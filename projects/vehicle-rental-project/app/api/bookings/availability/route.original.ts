import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 60;

// Public: Returns only the minimal fields needed for availability/calendar display.
// No PII (names, emails, phone numbers) is exposed.
// Also returns active (non-expired) holds so the calendar treats held dates as unavailable.
export async function GET() {
  try {
    const result = await query(`
      SELECT vehicle_id, status, start_date, end_date, false AS is_hold
      FROM bookings
      WHERE status != 'cancelled'
      UNION ALL
      SELECT vehicle_id, 'held' AS status, start_date, end_date, true AS is_hold
      FROM booking_holds
      WHERE expires_at > NOW()
      UNION ALL
      SELECT vehicle_id, 'blackout' AS status, start_date, end_date, false AS is_hold
      FROM blackout_dates
      ORDER BY start_date ASC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
