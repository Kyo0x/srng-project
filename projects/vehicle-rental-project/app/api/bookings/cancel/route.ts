import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/db';
import { auth } from '@/auth';
import { getEnv } from '@/lib/env';
import { calculateRefundAmount, calculateRefundPercentage, getDaysUntilStart, toStripeAmount, BOOKING_STATUS } from '@/lib/constants';
import { sendCancellationConfirmation, sendAdminCancellationNotification } from '@/lib/email';
import { withRateLimit } from '@/lib/apiAuth';

interface CancelRequest {
  bookingId: number;
  uploadToken?: string;
  reason?: string;
  cancelledBy: 'customer' | 'admin';
  customRefundAmount?: number;
}

const rateLimitedHandler = withRateLimit(async function(request: Request) {
  try {
    const body: CancelRequest = await request.json();
    const { bookingId, uploadToken, reason, cancelledBy, customRefundAmount } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    if (!cancelledBy || !['customer', 'admin'].includes(cancelledBy)) {
      return NextResponse.json({ error: 'cancelledBy must be "customer" or "admin"' }, { status: 400 });
    }

    // Customer cancellations require the upload token for ownership verification
    if (cancelledBy === 'customer' && !uploadToken) {
      return NextResponse.json({ error: 'Booking ID token is required' }, { status: 400 });
    }

    // If admin is cancelling, verify auth session
    if (cancelledBy === 'admin') {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Fetch the booking — for customers, verify the upload_token matches
    const bookingResult = await query(
      `SELECT b.*, v.name as vehicle_name
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.id = $1
       ${cancelledBy === 'customer' ? 'AND b.upload_token = $2' : ''}`,
      cancelledBy === 'customer' ? [bookingId, uploadToken] : [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    // Check if already cancelled
    if (booking.status === BOOKING_STATUS.CANCELLED) {
      return NextResponse.json({ error: 'This booking is already cancelled' }, { status: 400 });
    }

    // Check if booking has started (only block customer cancellations, not admin)
    const startDate = new Date(booking.start_date);
    const now = new Date();
    startDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (cancelledBy === 'customer' && startDate < now) {
      return NextResponse.json(
        { error: 'Cannot cancel a booking that has already started' },
        { status: 400 }
      );
    }

    // Calculate refund
    const totalPrice = parseFloat(booking.total_price);
    const daysUntilStart = getDaysUntilStart(booking.start_date);

    let refundAmount: number;
    let refundPercentage: number;

    if (cancelledBy === 'admin' && customRefundAmount !== undefined) {
      // Admin override: use custom amount, clamped to [0, totalPrice]
      refundAmount = Math.max(0, Math.min(customRefundAmount, totalPrice));
      refundPercentage = totalPrice > 0 ? Math.round((refundAmount / totalPrice) * 100) : 0;
    } else {
      // Customer: use policy-based calculation (includes 24h free cancellation check)
      refundPercentage = calculateRefundPercentage(booking.start_date, booking.created_at);
      refundAmount = calculateRefundAmount(totalPrice, booking.start_date, booking.created_at);
    }

    // Process Stripe refund if applicable
    let stripeRefundId: string | null = null;

    const isAdminBooking = booking.stripe_session_id?.startsWith('admin_');

    if (refundAmount > 0 && booking.stripe_session_id && !isAdminBooking) {
      try {
        const stripe = new Stripe(getEnv.stripe.secretKey());

        // Retrieve the original checkout session to get its payment intent
        const originalSession = await stripe.checkout.sessions.retrieve(booking.stripe_session_id);

        if (originalSession.payment_intent) {
          const originalPIId = typeof originalSession.payment_intent === 'string'
            ? originalSession.payment_intent
            : originalSession.payment_intent.id;

          // Determine how much is still available on the original payment intent
          const originalPI = await stripe.paymentIntents.retrieve(originalPIId, {
            expand: ['latest_charge'],
          });
          const originalCharge = originalPI.latest_charge as Stripe.Charge | null;
          const originalCharged = originalCharge?.amount ?? 0;
          const originalAlreadyRefunded = originalCharge?.amount_refunded ?? 0;
          const originalAvailable = originalCharged - originalAlreadyRefunded;

          const totalToRefund = toStripeAmount(refundAmount);
          const refundFromOriginal = Math.min(totalToRefund, originalAvailable);
          const refundFromModification = totalToRefund - refundFromOriginal;

          // Refund from original payment intent
          if (refundFromOriginal > 0) {
            const refund = await stripe.refunds.create({
              payment_intent: originalPIId,
              amount: refundFromOriginal,
              reason: 'requested_by_customer',
            });
            stripeRefundId = refund.id;
          }

          // Refund remainder from modification payment intent (if any)
          if (refundFromModification > 0 && booking.modification_stripe_session_id) {
            const modSession = await stripe.checkout.sessions.retrieve(booking.modification_stripe_session_id);
            if (modSession.payment_intent) {
              const modPIId = typeof modSession.payment_intent === 'string'
                ? modSession.payment_intent
                : modSession.payment_intent.id;

              const modPI = await stripe.paymentIntents.retrieve(modPIId, {
                expand: ['latest_charge'],
              });
              const modCharge = modPI.latest_charge as Stripe.Charge | null;
              const modAvailable = (modCharge?.amount ?? 0) - (modCharge?.amount_refunded ?? 0);
              const actualModRefund = Math.min(refundFromModification, modAvailable);

              if (actualModRefund > 0) {
                await stripe.refunds.create({
                  payment_intent: modPIId,
                  amount: actualModRefund,
                  reason: 'requested_by_customer',
                });
              }
            }
          }
        }
      } catch (stripeError) {
        console.error('Stripe refund error:', stripeError);
        return NextResponse.json(
          { error: 'Failed to process refund. Please contact support.' },
          { status: 500 }
        );
      }
    }

    // Update booking status to cancelled
    const cancelledAt = new Date().toISOString();
    await query(
      `UPDATE bookings
       SET status = 'cancelled',
           cancelled_at = $1,
           cancelled_by = $2,
           cancellation_reason = $3,
           refund_amount = $4,
           refund_percentage = $5,
           stripe_refund_id = $6
       WHERE id = $7`,
      [cancelledAt, cancelledBy, reason || null, refundAmount, refundPercentage, stripeRefundId, bookingId]
    );

    // Prepare email data
    const emailData = {
      customerName: `${booking.first_name} ${booking.last_name}`,
      customerEmail: booking.email,
      vehicleName: booking.vehicle_name,
      startDate: new Date(booking.start_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      endDate: new Date(booking.end_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      totalPrice,
      refundAmount,
      refundPercentage,
      daysUntilStart,
      reason: reason || undefined,
      cancelledBy,
      bookingId,
      orderId: booking.order_id ?? undefined,
      uploadToken: booking.upload_token ?? undefined,
    };

    // Send email notifications (don't fail the request if emails fail)
    try {
      await Promise.all([
        sendCancellationConfirmation(emailData),
        sendAdminCancellationNotification(emailData),
      ]);
    } catch (emailError) {
      console.error('Failed to send cancellation emails:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      refund: {
        amount: refundAmount,
        percentage: refundPercentage,
        stripeRefundId,
      },
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}, 5, 60000);

export async function POST(request: Request) {
  return rateLimitedHandler(request);
}
