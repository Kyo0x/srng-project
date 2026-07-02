import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { ADMIN_EMAILS } from '@/lib/constants';
import { generateOrderId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      vehicle_id,
      start_date,
      end_date,
      first_name,
      last_name,
      email,
      phone,
      total_price,
      status = 'pending_details',
      baby_seats_quantity = 0,
      extra_driver = false,
      insurance_type = 'basic',
      selected_extras = {},
    } = body;

    if (!vehicle_id || !start_date || !end_date || !first_name || !last_name || !email || total_price === undefined || total_price === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    if (endDateObj <= startDateObj) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    const vehicleResult = await query('SELECT id FROM vehicles WHERE id = $1', [vehicle_id]);
    if (vehicleResult.rows.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const overlapResult = await query(
      `SELECT id FROM bookings 
       WHERE vehicle_id = $1 
       AND status != 'cancelled'
       AND daterange(start_date, end_date, '[]') && daterange($2::date, $3::date, '[]')`,
      [vehicle_id, start_date, end_date]
    );

    if (overlapResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Vehicle is already booked for the selected dates' },
        { status: 409 }
      );
    }

    const result = await query(
      `INSERT INTO bookings (
        vehicle_id,
        start_date,
        end_date,
        first_name,
        last_name,
        email,
        phone,
        baby_seats_quantity,
        extra_driver,
        insurance_type,
        selected_extras,
        total_price,
        status,
        stripe_session_id,
        order_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        vehicle_id,
        start_date,
        end_date,
        first_name,
        last_name,
        email,
        phone,
        baby_seats_quantity,
        extra_driver,
        insurance_type,
        JSON.stringify(selected_extras),
        total_price,
        status,
        `admin_${Date.now()}`, // Admin-created bookings get a special session ID
        generateOrderId(vehicle_id),
      ]
    );

    return NextResponse.json({
      success: true,
      booking: result.rows[0],
    });
  } catch (error: unknown) {
    console.error('Admin booking creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create booking' },
      { status: 500 }
    );
  }
}
