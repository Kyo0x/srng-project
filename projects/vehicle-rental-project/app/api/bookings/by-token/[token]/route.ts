import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  try {
    const session = await auth();
    const isAdmin = !!session?.user;

    if (isAdmin) {
      const result = await query(
        `SELECT b.*, v.name as vehicle_name
         FROM bookings b
         JOIN vehicles v ON b.vehicle_id = v.id
         WHERE b.upload_token = $1`,
        [token]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    } else {
      const result = await query(
        `SELECT b.id, b.order_id, b.start_date, b.end_date, b.first_name,
                b.status, b.total_price, b.extra_driver, b.selected_extras,
                v.name as vehicle_name,
                EXISTS(SELECT 1 FROM booking_drivers WHERE booking_id = b.id) as has_drivers
         FROM bookings b
         JOIN vehicles v ON b.vehicle_id = v.id
         WHERE b.upload_token = $1`,
        [token]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Booking not found or invalid token' }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching booking by token:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}
