import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/db';
import { getEnv } from '@/lib/env';
import { CURRENCY, BOOKING_STATUS, toStripeAmount, SelectedExtras } from '@/lib/constants';
import { withRateLimit } from '@/lib/apiAuth';
import { InsuranceType } from '@/lib/types';

interface ModifyCheckoutRequest {
  bookingId: number;
  uploadToken: string;
  priceDiff: number;
  newTotalPrice: number;
  // Date change fields
  newStartDate?: string;
  newEndDate?: string;
  // Extras change fields
  newInsuranceType?: InsuranceType;
  newSelectedExtras?: SelectedExtras;
}

const rateLimitedHandler = withRateLimit(async function (request: Request) {
  try {
    const body: ModifyCheckoutRequest = await request.json();
    const { bookingId, uploadToken, priceDiff, newTotalPrice, newStartDate, newEndDate, newInsuranceType, newSelectedExtras } = body;

    const isExtrasMode = !newStartDate && !newEndDate && (newInsuranceType !== undefined || newSelectedExtras !== undefined);
    const isDatesMode = !!newStartDate && !!newEndDate;

    if (!bookingId || !uploadToken || priceDiff == null || newTotalPrice == null || (!isExtrasMode && !isDatesMode)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (priceDiff <= 0) {
      return NextResponse.json({ error: 'No payment required for this modification' }, { status: 400 });
    }

    // Stripe minimum charge for NOK is 3.00 kr
    if (priceDiff < 3) {
      return NextResponse.json({ error: 'Price difference is below the minimum chargeable amount (3 kr). Please contact us to apply this change.' }, { status: 400 });
    }

    // Re-verify token and fetch booking
    const bookingResult = await query(
      `SELECT b.*, v.name as vehicle_name
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.id = $1 AND b.upload_token = $2`,
      [bookingId, uploadToken]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      return NextResponse.json({ error: 'Cannot modify a cancelled booking' }, { status: 400 });
    }

    // For date changes, re-check availability (guard against race conditions)
    if (isDatesMode) {
      const overlapResult = await query(
        `SELECT id FROM bookings
         WHERE vehicle_id = $1
           AND id != $2
           AND status != 'cancelled'
           AND start_date < $3
           AND end_date > $4`,
        [booking.vehicle_id, bookingId, newEndDate, newStartDate]
      );

      if (overlapResult.rows.length > 0) {
        return NextResponse.json(
          { error: 'The vehicle is no longer available for the selected dates', code: 'DATES_UNAVAILABLE' },
          { status: 409 }
        );
      }
    }

    const stripe = new Stripe(getEnv.stripe.secretKey());

    let productName: string;
    let description: string;
    let modificationType: string;
    let extraMetadata: Record<string, string> = {};

    if (isExtrasMode) {
      modificationType = 'extras';
      productName = `${booking.vehicle_name} – Extras Upgrade`;
      description = `Add-on / insurance upgrade`;
      extraMetadata = {
        newInsuranceType: newInsuranceType ?? booking.insurance_type,
        newSelectedExtras: JSON.stringify(newSelectedExtras ?? booking.selected_extras ?? {}),
      };
    } else {
      modificationType = 'dates';
      const oldStart = new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const oldEnd = new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const newStart = new Date(newStartDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const newEnd = new Date(newEndDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      productName = `${booking.vehicle_name} – Date Change`;
      description = `Previous: ${oldStart} – ${oldEnd} → New: ${newStart} – ${newEnd}`;
      extraMetadata = {
        newStartDate: newStartDate!,
        newEndDate: newEndDate!,
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CURRENCY.CODE,
            product_data: {
              name: productName,
              description,
            },
            unit_amount: toStripeAmount(priceDiff),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${getEnv.app.url()}/modify-booking?token=${uploadToken}&modified=1`,
      cancel_url: `${getEnv.app.url()}/modify-booking?token=${uploadToken}`,
      customer_email: booking.email,
      metadata: {
        type: 'booking_modification',
        modificationType,
        bookingId: bookingId.toString(),
        uploadToken,
        newTotalPrice: newTotalPrice.toString(),
        ...extraMetadata,
      },
    });

    return NextResponse.json({ sessionUrl: session.url, sessionId: session.id });
  } catch (error) {
    const stripeMessage = error instanceof Error ? error.message : String(error);
    console.error('Error creating modification checkout session:', stripeMessage);
    return NextResponse.json({ error: `Failed to create checkout session: ${stripeMessage}` }, { status: 500 });
  }
}, 5, 60000);

export async function POST(request: Request) {
  return rateLimitedHandler(request);
}
