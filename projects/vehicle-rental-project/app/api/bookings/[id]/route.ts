import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
  }

  const session = await auth();
  const isAdmin = !!session?.user;
  const uploadToken = request.nextUrl.searchParams.get('token');

  // Require either admin auth or valid upload token
  if (!isAdmin && !uploadToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (isAdmin) {
      // Admin gets full data
      const result = await query(
        `SELECT b.*, v.name as vehicle_name
         FROM bookings b
         JOIN vehicles v ON b.vehicle_id = v.id
         WHERE b.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } else {
      // Customer with token - validate token matches the booking
      const result = await query(
        `SELECT b.id, b.order_id, b.start_date, b.end_date, b.first_name,
                b.status, b.total_price, b.extra_driver, b.selected_extras,
                v.name as vehicle_name,
                EXISTS(SELECT 1 FROM booking_drivers WHERE booking_id = b.id) as has_drivers
         FROM bookings b
         JOIN vehicles v ON b.vehicle_id = v.id
         WHERE b.id = $1 AND b.upload_token = $2`,
        [id, uploadToken]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Booking not found or invalid token' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}
