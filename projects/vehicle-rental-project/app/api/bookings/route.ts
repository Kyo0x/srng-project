import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/auth';
import { validateBody, bookingSchema, bookingUpdateSchema, idParamSchema, validateQuery } from '@/lib/validation';
import { generateOrderId } from '@/lib/utils';

// Protected: Only authenticated admins can view all bookings with full customer data
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await query(`
      SELECT b.*, v.name as vehicle_name, v.image_url, v.inspection_pdf_url, v.license_plate as vehicle_license_plate,
             EXISTS(SELECT 1 FROM booking_drivers WHERE booking_id = b.id) as has_drivers
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// Public: Users can create bookings (through checkout flow)
export async function POST(request: Request) {
  const validation = await validateBody(request, bookingSchema);
  if (!validation.success) {
    return validation.error;
  }

  const {
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
    total_price,
    stripe_session_id,
    status
  } = validation.data;

  try {
    const vehicleCheck = await query('SELECT is_paused FROM vehicles WHERE id = $1', [vehicle_id]);
    if (vehicleCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    if (vehicleCheck.rows[0].is_paused) {
      return NextResponse.json({ error: 'This vehicle is not currently available for booking' }, { status: 409 });
    }

    const result = await query(
      `INSERT INTO bookings
       (vehicle_id, start_date, end_date, first_name, last_name, email, phone,
        baby_seats_quantity, extra_driver, insurance_type, total_price, stripe_session_id, status, order_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [vehicle_id, start_date, end_date, first_name, last_name, email, phone,
       baby_seats_quantity, extra_driver, insurance_type, total_price, stripe_session_id || null, status, generateOrderId(vehicle_id)]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// Protected: Only authenticated admins can update booking status
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(request, bookingUpdateSchema);
  if (!validation.success) {
    return validation.error;
  }

  const { id, status } = validation.data;

  try {
    const result = await query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// Protected: Only authenticated admins can delete bookings
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const validation = validateQuery(searchParams, idParamSchema);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const result = await query('DELETE FROM bookings WHERE id = $1 RETURNING id', [validation.data.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
