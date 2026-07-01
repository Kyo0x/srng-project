import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/db';
import { fromStripeAmount, ADMIN_EMAILS } from '@/lib/constants';
import { getEnv } from '@/lib/env';
import { sendBookingConfirmation, sendAdminNotification, sendEmail, sendModificationConfirmation, sendAdminModificationNotification } from '@/lib/email';
import { formatDate, generateOrderId } from '@/lib/utils';

async function processOverlapRefund(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    // Get payment intent from the session
    if (!session.payment_intent) {
      return { success: false, error: 'No payment intent found' };
    }

    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent.id;

    // Process full refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
    });

    // Send notification emails
    const customerEmail = session.customer_details?.email || metadata.contactEmail;
    const customerName = session.customer_details?.name || 'Valued Customer';
    const vehicleName = metadata.vehicleName || 'RV';
    const refundAmount = fromStripeAmount(session.amount_total || 0);

    if (customerEmail) {
      // Customer email
      await sendEmail(
        customerEmail,
        'NorthVenture <hello@northventure-demo.com>',
        `Booking Conflict - Full Refund Processed`,
        `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="background-color: #ef4444; padding: 32px; text-align: center;">
                <h1 style="margin: 0; color: white; font-size: 24px;">Booking Conflict</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px; background-color: #ffffff;">
                <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                  Dear ${customerName},<br><br>
                  We sincerely apologize, but we were unable to complete your booking for the <strong>${vehicleName}</strong> from ${formatDate(metadata.startDate)} to ${formatDate(metadata.endDate)} due to a scheduling conflict.
                </p>
                <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                  <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.6;">
                    <strong>Full Refund Processed:</strong> A complete refund of ${refundAmount.toLocaleString('nb-NO', { minimumFractionDigits: 2 })} kr has been initiated. Please allow 3-5 business days for it to appear on your statement.
                  </p>
                </div>
                <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                  We would love to help you find alternative dates. Please visit our website or contact us directly to rebook.
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Contact: <a href="mailto:hello@northventure-demo.com" style="color: #3b82f6;">hello@northventure-demo.com</a> | <a href="tel:+4755512345" style="color: #3b82f6;">+47 555 12 345</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f9fafb; padding: 24px; text-align: center;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">We apologize for any inconvenience.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `
      );
    }

    // Admin notification
    await sendEmail(
      ADMIN_EMAILS,
      'NorthVenture <hello@northventure-demo.com>',
      `URGENT: Booking Overlap - Refund Processed`,
      `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tr>
            <td style="background-color: #dc2626; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px;">Booking Overlap Detected</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; background-color: #ffffff;">
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                  <strong>Action Required:</strong> A booking overlap was detected and automatically refunded. Please investigate to prevent future occurrences.
                </p>
              </div>
              <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px;">Attempted Booking Details</h2>
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr><td style="padding: 8px 0; color: #6b7280;">Customer:</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${customerName}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0; color: #111827;">${customerEmail || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Vehicle:</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${vehicleName}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Dates:</td><td style="padding: 8px 0; color: #111827;">${formatDate(metadata.startDate)} - ${formatDate(metadata.endDate)}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Refund Amount:</td><td style="padding: 8px 0; color: #22c55e; font-weight: 600;">${refundAmount.toLocaleString('nb-NO', { minimumFractionDigits: 2 })} kr</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Refund ID:</td><td style="padding: 8px 0; color: #111827; font-family: monospace;">${refund.id}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `
    );

    return { success: true, refundId: refund.id };
  } catch (error) {
    console.error('Failed to process overlap refund:', error);
    return { success: false, error: String(error) };
  }
}

export async function POST(request: NextRequest) {
  const stripe = new Stripe(getEnv.stripe.secretKey());
  const webhookSecret = getEnv.stripe.webhookSecret();

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as Record<string, string> | null;

        console.log('Webhook received:', {
          type: event.type,
          sessionId: session.id,
          paymentStatus: session.payment_status,
        });

        if (session.payment_status === 'paid' && metadata?.type === 'booking_modification') {
          // Handle booking modification payment
          const { bookingId, uploadToken, newTotalPrice, modificationType } = metadata;

          // Idempotency: skip if already modified by this session
          const modResult = await query(
            `SELECT id, start_date, end_date, modified_at, insurance_type, selected_extras FROM bookings WHERE id = $1 AND upload_token = $2`,
            [bookingId, uploadToken]
          );

          if (modResult.rows.length === 0) {
            console.error('Modification webhook: booking not found', { bookingId });
            return NextResponse.json({ received: true, status: 'booking_not_found' });
          }

          const booking = modResult.rows[0];
          const paidAmount = fromStripeAmount(session.amount_total || 0);

          if (modificationType === 'extras') {
            // Extras-only modification
            const { newInsuranceType, newSelectedExtras } = metadata;
            let parsedExtras = {};
            try { parsedExtras = newSelectedExtras ? JSON.parse(newSelectedExtras) : {}; } catch { /* ignore */ }

            await query(
              `UPDATE bookings
               SET selected_extras = $1,
                   insurance_type = $2,
                   total_price = $3,
                   modified_at = NOW(),
                   modification_count = modification_count + 1,
                   modification_stripe_session_id = $5
               WHERE id = $4`,
              [JSON.stringify(parsedExtras), newInsuranceType, parseFloat(newTotalPrice), bookingId, session.id]
            );

            // Fetch full booking for email
            const fullBookingResult = await query(
              `SELECT b.*, v.name as vehicle_name FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.id = $1`,
              [bookingId]
            );

            if (fullBookingResult.rows.length > 0) {
              const b = fullBookingResult.rows[0];
              const emailData = {
                customerName: `${b.first_name} ${b.last_name}`,
                customerEmail: b.email,
                vehicleName: b.vehicle_name,
                oldStartDate: formatDate(booking.start_date),
                oldEndDate: formatDate(booking.end_date),
                newStartDate: formatDate(booking.start_date),
                newEndDate: formatDate(booking.end_date),
                oldTotalPrice: parseFloat(newTotalPrice) - paidAmount,
                newTotalPrice: parseFloat(newTotalPrice),
                priceDiff: paidAmount,
                bookingId: parseInt(bookingId),
                uploadToken,
                orderId: b.order_id ?? undefined,
                oldInsuranceType: booking.insurance_type,
                newInsuranceType,
                oldSelectedExtras: booking.selected_extras || {},
                newSelectedExtras: parsedExtras,
              };
              Promise.all([
                sendModificationConfirmation(emailData),
                sendAdminModificationNotification(emailData),
              ]).catch((err) => console.error('Failed to send extras modification emails:', err));
            }

            console.log('Booking extras modification processed via webhook:', { bookingId, newInsuranceType });
            return NextResponse.json({ received: true, status: 'extras_modification_processed' });
          } else {
            // Date modification (default / legacy)
            const { newStartDate, newEndDate } = metadata;

            await query(
              `UPDATE bookings
               SET start_date = $1,
                   end_date = $2,
                   total_price = $3,
                   modified_at = NOW(),
                   modification_count = modification_count + 1,
                   modification_stripe_session_id = $5
               WHERE id = $4`,
              [newStartDate, newEndDate, parseFloat(newTotalPrice), bookingId, session.id]
            );

            // Fetch full booking for email
            const fullBookingResult = await query(
              `SELECT b.*, v.name as vehicle_name FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.id = $1`,
              [bookingId]
            );

            if (fullBookingResult.rows.length > 0) {
              const b = fullBookingResult.rows[0];
              const emailData = {
                customerName: `${b.first_name} ${b.last_name}`,
                customerEmail: b.email,
                vehicleName: b.vehicle_name,
                oldStartDate: formatDate(booking.start_date || newStartDate),
                oldEndDate: formatDate(booking.end_date || newEndDate),
                newStartDate: formatDate(newStartDate),
                newEndDate: formatDate(newEndDate),
                oldTotalPrice: parseFloat(newTotalPrice) - paidAmount,
                newTotalPrice: parseFloat(newTotalPrice),
                priceDiff: paidAmount,
                bookingId: parseInt(bookingId),
                uploadToken,
                orderId: b.order_id ?? undefined,
              };

              Promise.all([
                sendModificationConfirmation(emailData),
                sendAdminModificationNotification(emailData),
              ]).catch((err) => console.error('Failed to send modification emails:', err));
            }

            console.log('Booking modification processed via webhook:', { bookingId, newStartDate, newEndDate });
            return NextResponse.json({ received: true, status: 'modification_processed' });
          }
        }

        if (session.payment_status === 'paid' && metadata?.vehicleId) {
          // Idempotency check: Skip if this session was already processed
          const existingResult = await query(
            'SELECT id FROM bookings WHERE stripe_session_id = $1',
            [session.id]
          );

          if (existingResult.rows.length > 0) {
            console.log('Booking already exists for session:', session.id);
            return NextResponse.json({ received: true, status: 'already_processed' });
          }

          // Check for overlapping bookings before inserting
          const overlapResult = await query(
            `SELECT id FROM bookings
             WHERE vehicle_id = $1
             AND status != 'cancelled'
             AND start_date <= $2
             AND end_date >= $3`,
            [metadata.vehicleId, metadata.endDate, metadata.startDate]
          );

          if (overlapResult.rows.length > 0) {
            console.error('Overlapping booking detected for vehicle:', metadata.vehicleId);

            // Process automatic full refund
            const refundResult = await processOverlapRefund(stripe, session, metadata);

            if (refundResult.success) {
              console.log('Overlap refund processed successfully:', refundResult.refundId);
            } else {
              console.error('Failed to process overlap refund:', refundResult.error);
            }

            return NextResponse.json(
              {
                error: 'Vehicle already booked for these dates',
                refundProcessed: refundResult.success,
                refundId: refundResult.refundId,
              },
              { status: 409 }
            );
          }

          // Check if vehicle was paused after checkout was created
          const pausedResult = await query(
            'SELECT is_paused FROM vehicles WHERE id = $1',
            [metadata.vehicleId]
          );

          if (pausedResult.rows[0]?.is_paused) {
            console.error('Paused vehicle booking attempt detected, refunding:', metadata.vehicleId);

            const refundResult = await processOverlapRefund(stripe, session, metadata);
            if (refundResult.success) {
              console.log('Paused vehicle refund processed successfully:', refundResult.refundId);
            } else {
              console.error('Failed to process paused vehicle refund:', refundResult.error);
            }

            return NextResponse.json(
              {
                error: 'Vehicle is paused and cannot be booked',
                refundProcessed: refundResult.success,
                refundId: refundResult.refundId,
              },
              { status: 409 }
            );
          }

          // Parse selectedExtras from metadata (stored as JSON string)
          let selectedExtras = {};
          try {
            selectedExtras = metadata.selectedExtras ? JSON.parse(metadata.selectedExtras) : {};
          } catch {
            console.warn('Failed to parse selectedExtras, using empty object');
          }

          let bookingId: number | undefined;
          let uploadToken: string | undefined;
          let orderId: string | undefined;
          try {
            const insertResult = await query(
              `INSERT INTO bookings
               (vehicle_id, start_date, end_date, first_name, last_name, email, phone,
                baby_seats_quantity, extra_driver, insurance_type, selected_extras, stripe_session_id, status, total_price, order_id, pickup_time)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
               RETURNING id, upload_token, order_id`,
              [
                metadata.vehicleId,
                metadata.startDate,
                metadata.endDate,
                metadata.firstName || session.customer_details?.name?.split(' ')[0] || 'Guest',
                metadata.lastName || session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
                session.customer_details?.email || metadata.contactEmail || '',
                metadata.phone || session.customer_details?.phone || '',
                parseInt(metadata.babySeatsQuantity) || 0,
                metadata.extraDriver === 'true',
                metadata.insuranceType || 'basic',
                JSON.stringify(selectedExtras),
                session.id,
                'pending_details',
                fromStripeAmount(session.amount_total || 0),
                generateOrderId(parseInt(metadata.vehicleId)),
                metadata.pickupTime || null,
              ]
            );
            bookingId = insertResult.rows[0]?.id;
            uploadToken = insertResult.rows[0]?.upload_token ?? undefined;
            orderId = insertResult.rows[0]?.order_id ?? undefined;
          } catch (dbError: unknown) {
            const error = dbError as { code?: string; message?: string };
            // Check if error is due to overlapping constraint (database-level protection)
            if (error.code === '23P01') { // exclusion_violation
              console.error('Database constraint prevented double-booking:', error);
              return NextResponse.json(
                { error: 'Vehicle already booked for these dates', refundRequired: true },
                { status: 409 }
              );
            }
            // Check if error is due to duplicate stripe_session_id (idempotency)
            if (error.code === '23505') { // unique_violation
              console.log('Duplicate webhook call detected, already processed:', session.id);
              return NextResponse.json({ received: true, status: 'already_processed' });
            }
            console.error('Error saving booking:', error);
            return NextResponse.json(
              { error: 'Failed to save booking' },
              { status: 500 }
            );
          }

          console.log('Booking created successfully for session:', session.id);

          // Release the hold now that booking is confirmed
          if (metadata.holdToken) {
            await query(
              `DELETE FROM booking_holds WHERE hold_token = $1`,
              [metadata.holdToken]
            ).catch((e: unknown) => console.warn('Could not delete hold after booking:', e));
          }

          // Send email notifications
          const emailData = {
            customerName: session.customer_details?.name || 'Valued Customer',
            customerEmail: session.customer_details?.email || metadata.contactEmail || '',
            vehicleName: metadata.vehicleName || 'RV',
            startDate: formatDate(metadata.startDate),
            endDate: formatDate(metadata.endDate),
            pickupTime: metadata.pickupTime || undefined,
            totalPrice: fromStripeAmount(session.amount_total || 0),
            babySeats: parseInt(metadata.babySeatsQuantity) || 0,
            extraDriver: metadata.extraDriver === 'true',
            insurance: metadata.insuranceType,
            selectedExtras,
            bookingId,
            uploadToken,
            orderId,
          };

          // Send customer confirmation email
          const customerEmail = await sendBookingConfirmation(emailData);
          if (!customerEmail.success) {
            console.error('Failed to send customer email:', customerEmail.error);
          }

          // Send admin notification email
          const adminEmail = await sendAdminNotification(emailData);
          if (!adminEmail.success) {
            console.error('Failed to send admin email:', adminEmail.error);
          }
        } else {
          console.log('Skipping booking creation - test webhook or incomplete data:', {
            hasMetadata: !!metadata,
            hasVehicleId: !!metadata?.vehicleId,
            paymentStatus: session.payment_status,
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as Record<string, string>;

        if (metadata.vehicleId) {
          await query(
            'UPDATE bookings SET status = $1 WHERE stripe_session_id = $2',
            ['cancelled', session.id]
          );
        }

        // Release the hold if Stripe session expired without payment
        if (metadata.holdToken) {
          await query(
            `DELETE FROM booking_holds WHERE hold_token = $1`,
            [metadata.holdToken]
          ).catch((e: unknown) => console.warn('Could not delete hold on session expiry:', e));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
