import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/db';
import { getEnv } from '@/lib/env';
import {
  calculateRefundPercentage,
  calculateExtrasCost,
  toStripeAmount,
  BOOKING_STATUS,
  getDaysUntilStart,
  isWithinFreeCancellationWindow,
  SelectedExtras,
} from '@/lib/constants';
import { calculateRentalPrice } from '@/lib/utils';
import { sendModificationConfirmation, sendAdminModificationNotification } from '@/lib/email';
import { withRateLimit } from '@/lib/apiAuth';
import { InsuranceType } from '@/lib/types';

interface ModifyRequest {
  bookingId: number;
  uploadToken: string;
  newStartDate?: string;
  newEndDate?: string;
  newInsuranceType?: InsuranceType;
  newSelectedExtras?: SelectedExtras;
  previewOnly?: boolean;
}

function formatDateForEmail(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function resolvePaymentIntentId(stripe: Stripe, booking: Record<string, string>): Promise<string | null> {
  // Prefer the modification session if available
  const sessionId = booking.modification_stripe_session_id || booking.stripe_session_id;
  if (!sessionId) return null;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session.payment_intent) return null;
  return typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id;
}

function calculateNewTotalPrice(
  pricePerDay: number,
  newStartDate: string,
  newEndDate: string,
  selectedExtras: Record<string, number>,
  insuranceType: string
): number {
  const start = new Date(newStartDate);
  const end = new Date(newEndDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const { totalPrice: basePrice } = calculateRentalPrice(pricePerDay, days);
  const { totalCost: extrasCost } = calculateExtrasCost(selectedExtras, days, insuranceType);

  return Math.round((basePrice + extrasCost) * 100) / 100;
}

const rateLimitedHandler = withRateLimit(async function (request: Request) {
  try {
    const body: ModifyRequest = await request.json();
    const { bookingId, uploadToken, newStartDate, newEndDate, newInsuranceType, newSelectedExtras, previewOnly = false } = body;

    if (!bookingId || !uploadToken) {
      return NextResponse.json({ error: 'bookingId and uploadToken are required' }, { status: 400 });
    }

    const isExtrasMode = !newStartDate && !newEndDate && (newInsuranceType !== undefined || newSelectedExtras !== undefined);
    const isDatesMode = !!newStartDate && !!newEndDate;

    if (!isExtrasMode && !isDatesMode) {
      return NextResponse.json({ error: 'Either date fields or extras fields are required' }, { status: 400 });
    }

    // Common date validation for dates mode
    let newStart: Date | null = null;
    let newEnd: Date | null = null;
    let days = 0;

    if (isDatesMode) {
      newStart = new Date(newStartDate!);
      newEnd = new Date(newEndDate!);
      if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
      }
      if (newEnd <= newStart) {
        return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
      }
      days = Math.ceil((newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24));
      if (days < 2) {
        return NextResponse.json({ error: 'Minimum rental duration is 2 days' }, { status: 400 });
      }
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      newStart.setHours(0, 0, 0, 0);
      if (newStart <= now) {
        return NextResponse.json({ error: 'New start date must be in the future' }, { status: 400 });
      }
    }

    // Fetch booking and verify token
    const bookingResult = await query(
      `SELECT b.*, v.name as vehicle_name, v.price_per_day
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

    if (booking.status !== BOOKING_STATUS.COMPLETED && booking.status !== BOOKING_STATUS.PENDING_DETAILS) {
      return NextResponse.json({ error: 'Only confirmed bookings can be modified' }, { status: 400 });
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentStart = new Date(booking.start_date);
    currentStart.setHours(0, 0, 0, 0);
    if (currentStart <= now) {
      return NextResponse.json({ error: 'Cannot modify a booking that has already started' }, { status: 400 });
    }

    const oldTotalPrice = parseFloat(booking.total_price);

    // ── Extras-only modification path ──────────────────────────────────────
    if (isExtrasMode) {
      const bookingStart = new Date(booking.start_date);
      const bookingEnd = new Date(booking.end_date);
      const bookingDays = Math.ceil((bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24));

      const currentInsurance: InsuranceType = (booking.insurance_type as InsuranceType) || 'basic';
      const currentExtras: SelectedExtras = booking.selected_extras || {};
      const targetInsurance: InsuranceType = newInsuranceType ?? currentInsurance;
      const targetExtras: SelectedExtras = newSelectedExtras ?? currentExtras;

      const { totalCost: oldExtrasPrice } = calculateExtrasCost(currentExtras, bookingDays, currentInsurance);
      const { totalCost: newExtrasPrice } = calculateExtrasCost(targetExtras, bookingDays, targetInsurance);
      const extrasPriceDiff = Math.round((newExtrasPrice - oldExtrasPrice) * 100) / 100;
      const newTotalPrice = Math.round((oldTotalPrice - oldExtrasPrice + newExtrasPrice) * 100) / 100;

      if (previewOnly) {
        const previewRefundPercentage = extrasPriceDiff < 0
          ? calculateRefundPercentage(booking.start_date, booking.created_at)
          : 0;
        const previewRefundAmount = extrasPriceDiff < 0
          ? Math.round(Math.abs(extrasPriceDiff) * previewRefundPercentage / 100 * 100) / 100
          : 0;

        return NextResponse.json({
          action: extrasPriceDiff > 0 ? 'payment_required' : extrasPriceDiff < 0 ? 'refund' : 'same',
          priceDiff: extrasPriceDiff,
          newTotalPrice,
          refundAmount: previewRefundAmount > 0 ? previewRefundAmount : undefined,
          refundPercentage: previewRefundAmount > 0 ? previewRefundPercentage : undefined,
        });
      }

      if (extrasPriceDiff > 0) {
        return NextResponse.json({
          action: 'payment_required',
          priceDiff: extrasPriceDiff,
          newTotalPrice,
        });
      }

      let stripeRefundId: string | null = null;
      let refundAmount = 0;
      let refundPercentage = 0;

      if (extrasPriceDiff < 0) {
        const priceDiffAbs = Math.abs(extrasPriceDiff);
        refundPercentage = calculateRefundPercentage(booking.start_date, booking.created_at);
        refundAmount = Math.round(priceDiffAbs * refundPercentage / 100 * 100) / 100;

        if (refundAmount > 0 && booking.stripe_session_id) {
          try {
            const stripe = new Stripe(getEnv.stripe.secretKey());

            // Try original session first, then modification session
            const paymentIntentId = await resolvePaymentIntentId(stripe, booking);

            if (paymentIntentId) {
              const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: toStripeAmount(refundAmount),
                reason: 'requested_by_customer',
              });
              stripeRefundId = refund.id;
            }
          } catch (stripeError) {
            console.error('Stripe refund error during extras modification:', stripeError);
            return NextResponse.json(
              { error: 'Failed to process refund. Please contact support.' },
              { status: 500 }
            );
          }
        }
      }

      const effectiveNewTotal = Math.round((oldTotalPrice - refundAmount) * 100) / 100;
      await query(
        `UPDATE bookings
         SET selected_extras = $1,
             insurance_type = $2,
             total_price = $3,
             modified_at = NOW(),
             modification_count = modification_count + 1
         WHERE id = $4`,
        [JSON.stringify(targetExtras), targetInsurance, effectiveNewTotal, bookingId]
      );

      const emailData = {
        customerName: `${booking.first_name} ${booking.last_name}`,
        customerEmail: booking.email,
        vehicleName: booking.vehicle_name,
        oldStartDate: formatDateForEmail(booking.start_date),
        oldEndDate: formatDateForEmail(booking.end_date),
        newStartDate: formatDateForEmail(booking.start_date),
        newEndDate: formatDateForEmail(booking.end_date),
        oldTotalPrice,
        newTotalPrice: effectiveNewTotal,
        priceDiff: extrasPriceDiff,
        refundAmount: refundAmount > 0 ? refundAmount : undefined,
        refundPercentage: refundAmount > 0 ? refundPercentage : undefined,
        bookingId,
        uploadToken,
        orderId: booking.order_id ?? undefined,
        oldInsuranceType: currentInsurance,
        newInsuranceType: targetInsurance,
        oldSelectedExtras: currentExtras,
        newSelectedExtras: targetExtras,
      };

      Promise.all([
        sendModificationConfirmation(emailData),
        sendAdminModificationNotification(emailData),
      ]).catch((err) => console.error('Failed to send extras modification emails:', err));

      return NextResponse.json({
        success: true,
        message: 'Booking extras updated successfully',
        newTotalPrice: effectiveNewTotal,
        refund: refundAmount > 0
          ? { amount: refundAmount, percentage: refundPercentage, stripeRefundId }
          : null,
      });
    }

    // ── Dates modification path ─────────────────────────────────────────────
    // Check availability for new dates (exclude this booking)
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
        { error: 'The vehicle is not available for the selected dates', code: 'DATES_UNAVAILABLE' },
        { status: 409 }
      );
    }

    // Recalculate price for new dates
    const pricePerDay = parseFloat(booking.price_per_day);
    const selectedExtras: Record<string, number> = booking.selected_extras || {};
    const insuranceType: string = booking.insurance_type || 'basic';

    const newTotalPrice = calculateNewTotalPrice(pricePerDay, newStartDate!, newEndDate!, selectedExtras, insuranceType);
    const priceDiff = Math.round((newTotalPrice - oldTotalPrice) * 100) / 100;

    // Preview-only mode: return pricing info without committing any changes
    if (previewOnly) {
      const previewRefundPercentage = priceDiff < 0
        ? calculateRefundPercentage(newStartDate!, booking.created_at)
        : 0;
      const previewRefundAmount = priceDiff < 0
        ? Math.round(Math.abs(priceDiff) * previewRefundPercentage / 100 * 100) / 100
        : 0;

      return NextResponse.json({
        action: priceDiff > 0 ? 'payment_required' : priceDiff < 0 ? 'refund' : 'same',
        priceDiff,
        newTotalPrice,
        newStartDate,
        newEndDate,
        refundAmount: previewRefundAmount > 0 ? previewRefundAmount : undefined,
        refundPercentage: previewRefundAmount > 0 ? previewRefundPercentage : undefined,
      });
    }

    // If extra payment is required, tell the client to proceed to checkout
    if (priceDiff > 0) {
      return NextResponse.json({
        action: 'payment_required',
        priceDiff,
        newTotalPrice,
        newStartDate,
        newEndDate,
      });
    }

    // Refund path (priceDiff <= 0): calculate refund and update booking
    let stripeRefundId: string | null = null;
    let refundAmount = 0;
    let refundPercentage = 0;

    if (priceDiff < 0) {
      const priceDiffAbs = Math.abs(priceDiff);
      refundPercentage = calculateRefundPercentage(newStartDate!, booking.created_at);
      refundAmount = Math.round(priceDiffAbs * refundPercentage / 100 * 100) / 100;

      if (refundAmount > 0 && booking.stripe_session_id) {
        try {
          const stripe = new Stripe(getEnv.stripe.secretKey());
          const paymentIntentId = await resolvePaymentIntentId(stripe, booking);

          if (paymentIntentId) {
            const refund = await stripe.refunds.create({
              payment_intent: paymentIntentId,
              amount: toStripeAmount(refundAmount),
              reason: 'requested_by_customer',
            });
            stripeRefundId = refund.id;
          }
        } catch (stripeError) {
          console.error('Stripe refund error during modification:', stripeError);
          return NextResponse.json(
            { error: 'Failed to process refund. Please contact support.' },
            { status: 500 }
          );
        }
      }
    }

    // Update the booking
    const effectiveNewTotal = oldTotalPrice - refundAmount;
    await query(
      `UPDATE bookings
       SET start_date = $1,
           end_date = $2,
           total_price = $3,
           modified_at = NOW(),
           modification_count = modification_count + 1
       WHERE id = $4`,
      [newStartDate, newEndDate, effectiveNewTotal, bookingId]
    );

    // Send confirmation emails (non-blocking)
    const emailData = {
      customerName: `${booking.first_name} ${booking.last_name}`,
      customerEmail: booking.email,
      vehicleName: booking.vehicle_name,
      oldStartDate: formatDateForEmail(booking.start_date),
      oldEndDate: formatDateForEmail(booking.end_date),
      newStartDate: formatDateForEmail(newStartDate!),
      newEndDate: formatDateForEmail(newEndDate!),
      oldTotalPrice,
      newTotalPrice: effectiveNewTotal,
      priceDiff,
      refundAmount: refundAmount > 0 ? refundAmount : undefined,
      refundPercentage: refundAmount > 0 ? refundPercentage : undefined,
      bookingId,
      uploadToken,
      orderId: booking.order_id ?? undefined,
    };

    Promise.all([
      sendModificationConfirmation(emailData),
      sendAdminModificationNotification(emailData),
    ]).catch((err) => console.error('Failed to send modification emails:', err));

    const daysUntilStart = getDaysUntilStart(newStartDate!);
    const withinFreeCancellation = isWithinFreeCancellationWindow(booking.created_at);

    return NextResponse.json({
      success: true,
      message: 'Booking dates updated successfully',
      newStartDate,
      newEndDate,
      newTotalPrice: effectiveNewTotal,
      refund: refundAmount > 0
        ? { amount: refundAmount, percentage: refundPercentage, stripeRefundId }
        : null,
      daysUntilStart,
      withinFreeCancellation,
    });
  } catch (error) {
    console.error('Error modifying booking:', error);
    return NextResponse.json({ error: 'Failed to modify booking' }, { status: 500 });
  }
}, 5, 60000);

export async function POST(request: Request) {
  return rateLimitedHandler(request);
}
