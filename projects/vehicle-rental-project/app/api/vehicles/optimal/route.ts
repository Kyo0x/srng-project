import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!group || !start || !end) {
    return NextResponse.json({ error: 'Missing required params: group, start, end' }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  try {
    const result = await query(
      `SELECT v.id
       FROM vehicles v
       WHERE v.vehicle_group = $1
         AND v.is_paused = FALSE
         AND NOT EXISTS (
           SELECT 1 FROM bookings b
           WHERE b.vehicle_id = v.id
             AND b.status != 'cancelled'
             AND b.start_date < $3::date
             AND b.end_date > $2::date
         )
         AND NOT EXISTS (
           SELECT 1 FROM booking_holds h
           WHERE h.vehicle_id = v.id
             AND h.expires_at > NOW()
             AND h.start_date < $3::date
             AND h.end_date > $2::date
         )
         AND NOT EXISTS (
           SELECT 1 FROM blackout_dates bd
           WHERE bd.vehicle_id = v.id
             AND bd.start_date < $3::date
             AND bd.end_date > $2::date
         )
       ORDER BY v.sort_order ASC
       LIMIT 1`,
      [group, start, end]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No available vehicle in group' }, { status: 404 });
    }

    return NextResponse.json({ vehicleId: result.rows[0].id });
  } catch (error) {
    console.error('Error finding optimal vehicle:', error);
    return NextResponse.json({ error: 'Failed to find optimal vehicle' }, { status: 500 });
  }
}
