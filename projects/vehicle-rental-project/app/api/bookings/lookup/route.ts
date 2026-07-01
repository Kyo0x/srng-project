import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { calculateRefundPercentage, calculateRefundAmount, getDaysUntilStart, isWithinFreeCancellationWindow, BOOKING_STATUS } from '@/lib/constants';
import { withRateLimit } from '@/lib/apiAuth';

interface LookupRequest {
  uploadToken: string;
  action?: 'cancel' | 'modify';
}

const rateLimitedHandler = withRateLimit(async function(request: Request) {
  try {
    const body: LookupRequest = await request.json();
    const { uploadToken } = body;

    if (!uploadToken) {
      return NextResponse.json(
        { error: 'Cancellation token is required' },
        { status: 400 }
      );
    }

    // Search by upload_token (UUID)
    const result = await query(
      `SELECT b.*, v.name as vehicle_name, v.image_url, v.price_per_day
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.upload_token = $1
       LIMIT 1`,
      [uploadToken.trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No booking found for this Booking ID. Please check and try again.', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const booking = result.rows[0];

    // Check if booking is already cancelled
    if (booking.status === BOOKING_STATUS.CANCELLED) {
      return NextResponse.json(
        { error: 'This booking has already been cancelled.', code: 'ALREADY_CANCELLED' },
        { status: 400 }
      );
    }

    // Check if booking start date has passed
    const startDate = new Date(booking.start_date);
    const now = new Date();
    startDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (startDate < now) {
      return NextResponse.json(
        { error: 'This booking has already started or completed and cannot be modified.', code: 'BOOKING_STARTED' },
        { status: 400 }
      );
    }

    // Only allow management of confirmed (paid) bookings
    if (booking.status !== BOOKING_STATUS.COMPLETED && booking.status !== BOOKING_STATUS.PENDING_DETAILS) {
      return NextResponse.json(
        { error: 'Only confirmed bookings can be modified or cancelled.', code: 'NOT_CONFIRMED' },
        { status: 400 }
      );
    }

    // For cancel action, check start date hasn't passed (already checked above)
    // For modify action, additionally allow pending_details bookings

    // Calculate refund information (includes 24h free cancellation check)
    const totalPrice = parseFloat(booking.total_price);
    const daysUntilStart = getDaysUntilStart(booking.start_date);
    const withinFreeCancellation = isWithinFreeCancellationWindow(booking.created_at);
    const refundPercentage = calculateRefundPercentage(booking.start_date, booking.created_at);
    const refundAmount = calculateRefundAmount(totalPrice, booking.start_date, booking.created_at);

    return NextResponse.json({
      booking: {
        id: booking.id,
        vehicle_id: booking.vehicle_id,
        vehicle_name: booking.vehicle_name,
        vehicle_image: booking.image_url,
        price_per_day: parseFloat(booking.price_per_day),
        first_name: booking.first_name,
        last_name: booking.last_name,
        email: booking.email,
        start_date: booking.start_date,
        end_date: booking.end_date,
        total_price: totalPrice,
        status: booking.status,
        stripe_session_id: booking.stripe_session_id,
        insurance_type: booking.insurance_type,
        selected_extras: booking.selected_extras || {},
        extra_driver: booking.extra_driver,
        baby_seats_quantity: booking.baby_seats_quantity,
      },
      refund: {
        daysUntilStart,
        refundPercentage,
        refundAmount,
        withinFreeCancellation,
      },
    });
  } catch (error) {
    console.error('Error looking up booking:', error);
    return NextResponse.json(
      { error: 'Failed to lookup booking' },
      { status: 500 }
    );
  }
}, 10, 60000);

export async function POST(request: Request) {
  return rateLimitedHandler(request);
}
