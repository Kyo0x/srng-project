import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const HOLD_MINUTES = 10;

// POST /api/holds — create a soft lock on dates for a vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, startDate, endDate } = body;

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    // Clean up expired holds first
    await query(`DELETE FROM booking_holds WHERE expires_at < NOW()`);

    const existingHold = await query(
      `SELECT id FROM booking_holds
       WHERE vehicle_id = $1
       AND start_date < $2
       AND end_date >= $3`,
      [vehicleId, endDate, startDate]
    );

    if (existingHold.rows.length > 0) {
      return NextResponse.json(
        { error: 'These dates are temporarily held by another user. Please try again in a few minutes.', code: 'DATES_HELD' },
        { status: 409 }
      );
    }

    const existingBooking = await query(
      `SELECT id FROM bookings
       WHERE vehicle_id = $1
       AND status != 'cancelled'
       AND start_date < $2
       AND end_date >= $3`,
      [vehicleId, endDate, startDate]
    );

    if (existingBooking.rows.length > 0) {
      return NextResponse.json(
        { error: 'These dates are already booked.', code: 'DATES_UNAVAILABLE' },
        { status: 409 }
      );
    }

    const result = await query(
      `INSERT INTO booking_holds (vehicle_id, start_date, end_date, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '${HOLD_MINUTES} minutes')
       RETURNING hold_token, expires_at`,
      [vehicleId, startDate, endDate]
    );

    const { hold_token, expires_at } = result.rows[0];
    return NextResponse.json({ holdToken: hold_token, expiresAt: expires_at });
  } catch (error) {
    console.error('Error creating hold:', error);
    return NextResponse.json({ error: 'Failed to create hold' }, { status: 500 });
  }
}

// DELETE /api/holds — release a hold early (e.g. user navigates away)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const holdToken = body.holdToken;

    if (!holdToken) {
      return NextResponse.json({ error: 'Missing holdToken' }, { status: 400 });
    }

    await query(`DELETE FROM booking_holds WHERE hold_token = $1`, [holdToken]);
    return NextResponse.json({ released: true });
  } catch (error) {
    console.error('Error releasing hold:', error);
    return NextResponse.json({ error: 'Failed to release hold' }, { status: 500 });
  }
}
