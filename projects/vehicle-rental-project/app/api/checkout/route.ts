import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PRICING, INSURANCE_PRICES, CURRENCY, toStripeAmount, getExtraById, VALIDATION } from '@/lib/constants';
import { calculateRentalPrice } from '@/lib/utils';
import { validateBody, checkoutSchema } from '@/lib/validation';
import { getEnv } from '@/lib/env';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(getEnv.stripe.secretKey());

    const validation = await validateBody(request, checkoutSchema);
    if (!validation.success) {
      return validation.error;
    }

    const {
      vehicleId,
      vehicleName,
      pricePerDay,
      startDate,
      endDate,
      babySeatsQuantity,
      extraDriver,
      insuranceType,
      selectedExtras,
      contactEmail,
      firstName,
      lastName,
      phone,
      holdToken,
      pickupTime,
    } = validation.data;

    // Reject checkout for paused vehicles
    const vehicleCheck = await query('SELECT is_paused FROM vehicles WHERE id = $1', [vehicleId]);
    if (vehicleCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    if (vehicleCheck.rows[0].is_paused) {
      return NextResponse.json(
        { error: 'This vehicle is not currently available for booking', code: 'VEHICLE_PAUSED' },
        { status: 409 }
      );
    }

    // Check for overlapping bookings before creating checkout session
    // This prevents users from paying for dates that are already booked
    let overlappingBookings;
    try {
      const result = await query(
        `SELECT id, start_date, end_date FROM bookings
         WHERE vehicle_id = $1
         AND status != 'cancelled'
         AND start_date <= $2
         AND end_date >= $3`,
        [vehicleId, endDate, startDate]
      );
      overlappingBookings = result.rows;
    } catch (checkError) {
      console.error('Error checking availability:', checkError);
      return NextResponse.json(
        { error: 'Failed to verify availability' },
        { status: 500 }
      );
    }

    // Check for maintenance/blackout blocks
    let blackoutConflict;
    try {
      const blackoutResult = await query(
        `SELECT id FROM blackout_dates
         WHERE vehicle_id = $1 AND start_date <= $2 AND end_date >= $3`,
        [vehicleId, endDate, startDate]
      );
      blackoutConflict = blackoutResult.rows.length > 0;
    } catch {
      blackoutConflict = false;
    }

    if (blackoutConflict) {
      return NextResponse.json(
        { error: 'Vehicle is unavailable for maintenance during these dates', code: 'DATES_UNAVAILABLE' },
        { status: 409 }
      );
    }

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        {
          error: 'Vehicle is no longer available for these dates',
          code: 'DATES_UNAVAILABLE',
          conflictingDates: overlappingBookings.map((b: { start_date: string; end_date: string }) => ({
            start: b.start_date,
            end: b.end_date
          }))
        },
        { status: 409 }
      );
    }

    // Check active holds from OTHER users (exclude the current user's own hold)
    try {
      const holdsResult = await query(
        `SELECT id FROM booking_holds
         WHERE vehicle_id = $1
         AND expires_at > NOW()
         AND start_date < $2
         AND end_date >= $3
         AND ($4::uuid IS NULL OR hold_token != $4::uuid)`,
        [vehicleId, endDate, startDate, holdToken ?? null]
      );
      if (holdsResult.rows.length > 0) {
        return NextResponse.json(
          { error: 'These dates are temporarily held by another user. Please try again shortly.', code: 'DATES_HELD' },
          { status: 409 }
        );
      }
    } catch (holdCheckError) {
      console.error('Error checking holds:', holdCheckError);
    }

    // Extend the current user's hold to cover the Stripe payment window (30 min)
    if (holdToken) {
      await query(
        `UPDATE booking_holds SET expires_at = NOW() + INTERVAL '10 minutes' WHERE hold_token = $1`,
        [holdToken]
      ).catch((e: unknown) => console.warn('Could not extend hold:', e));
    }

    const numberOfRentalDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const minStayResult = await query(
      `SELECT
         LEAST(
           min_days,
           GREATEST(
             2,
             CASE
               WHEN recurring = false THEN (end_date - $1::date) + 1
               ELSE (TO_DATE(EXTRACT(YEAR FROM $1::date)::text || '-' || TO_CHAR(end_date, 'MM-DD'), 'YYYY-MM-DD') - $1::date) + 1
             END
           )
         ) AS min_days
       FROM min_stay_rules
       WHERE (
         (recurring = false AND start_date <= $1::date AND end_date >= $1::date)
         OR
         (recurring = true AND (
           CASE
             WHEN TO_CHAR(end_date, 'MMDD') >= TO_CHAR(start_date, 'MMDD') THEN
               TO_CHAR($1::date, 'MMDD') >= TO_CHAR(start_date, 'MMDD') AND
               TO_CHAR($1::date, 'MMDD') <= TO_CHAR(end_date, 'MMDD')
             ELSE
               TO_CHAR($1::date, 'MMDD') >= TO_CHAR(start_date, 'MMDD') OR
               TO_CHAR($1::date, 'MMDD') <= TO_CHAR(end_date, 'MMDD')
           END
         ))
       )
       ORDER BY min_days DESC LIMIT 1`,
      [startDate]
    ).catch(() => ({ rows: [] as { min_days: number }[] }));
    const minDays = minStayResult.rows[0]?.min_days ?? VALIDATION.MIN_RENTAL_DAYS;

    if (numberOfRentalDays < minDays) {
      return NextResponse.json(
        { error: `Minimum rental period for these dates is ${minDays} days` },
        { status: 400 }
      );
    }

    const basePrice = calculateRentalPrice(pricePerDay, numberOfRentalDays).totalPrice;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: CURRENCY.CODE,
          product_data: {
            name: `${vehicleName} Rental (${startDate} to ${endDate})`,
            metadata: {
              vehicleId,
              startDate,
              endDate,
            },
          },
          unit_amount: toStripeAmount(basePrice),
        },
        quantity: 1,
      },
    ];

    if (extraDriver) {
      const extraDriverIsFree = insuranceType === 'premium' || insuranceType === 'premium_plus';
      if (!extraDriverIsFree) {
        lineItems.push({
          price_data: {
            currency: CURRENCY.CODE,
            product_data: {
              name: 'Extra Driver',
            },
            unit_amount: toStripeAmount(PRICING.EXTRA_DRIVER_PRICE),
          },
          quantity: 1,
        });
      }
    }

    const numberOfDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const insurancePrice = (INSURANCE_PRICES[insuranceType] || 0) * numberOfDays;
    lineItems.push({
      price_data: {
        currency: CURRENCY.CODE,
          product_data: {
            name: `${insuranceType.charAt(0).toUpperCase() + insuranceType.slice(1)} Insurance (${numberOfDays} days)`,
          },
          unit_amount: toStripeAmount(insurancePrice),
        },
        quantity: 1,
      });

    // Add selected extras as line items
    if (selectedExtras && Object.keys(selectedExtras).length > 0) {
      const numberOfDays = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const extraDriverIsFree = insuranceType === 'premium' || insuranceType === 'premium_plus';

      for (const [extraId, quantity] of Object.entries(selectedExtras)) {
        if (quantity <= 0) continue;

        const extra = getExtraById(extraId);
        if (!extra) continue;

        // First extra driver is free with premium/premium+ insurance
        const paidQuantity = (extraDriverIsFree && extraId === 'extra_driver')
          ? Math.max(0, quantity - 1)
          : quantity;
        if (paidQuantity <= 0) continue;

        let totalExtraCost: number;
        if (extra.priceType === 'per_day') {
          // Apply per-unit price cap if defined
          const costPerUnit = extra.maxPrice !== undefined
            ? Math.min(extra.price * numberOfDays, extra.maxPrice)
            : extra.price * numberOfDays;
          totalExtraCost = costPerUnit * paidQuantity;
        } else {
          totalExtraCost = extra.price * paidQuantity;
        }

        const suffix = extra.priceType === 'per_day' ? ` (${numberOfDays} days)` : '';

        lineItems.push({
          price_data: {
            currency: CURRENCY.CODE,
            product_data: {
              name: `${extra.name}${paidQuantity > 1 ? ` (${paidQuantity}x)` : ''}${suffix}`,
            },
            unit_amount: toStripeAmount(totalExtraCost),
          },
          quantity: 1,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${getEnv.app.url()}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getEnv.app.url()}/availability?startDate=${startDate}&endDate=${endDate}${holdToken ? `&releaseHold=${holdToken}` : ''}`,
      customer_email: contactEmail,
      metadata: {
        vehicleId,
        vehicleName,
        startDate,
        endDate,
        babySeatsQuantity: babySeatsQuantity.toString(),
        extraDriver: extraDriver.toString(),
        insuranceType,
        selectedExtras: JSON.stringify(selectedExtras),
        contactEmail,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        holdToken: holdToken || '',
        pickupTime: pickupTime || '',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
