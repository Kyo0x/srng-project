import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ALL_EXTRAS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

/**
 * GET /api/extras/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 *
 * Returns the number of units already booked for each "globalMax" extra
 * that overlaps with the requested date range.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
  }

  const limitedExtras = ALL_EXTRAS.filter((e) => e.globalMax !== undefined);
  if (limitedExtras.length === 0) {
    return NextResponse.json({});
  }

  try {
    // Sum quantities of each limited extra across all non-cancelled bookings
    // whose date range overlaps the requested range.
    const result = await query(
      `SELECT selected_extras
       FROM bookings
       WHERE status != 'cancelled'
         AND start_date < $2
         AND end_date > $1`,
      [startDate, endDate]
    );

    const booked: Record<string, number> = {};
    for (const row of result.rows) {
      const extras: Record<string, number> = row.selected_extras ?? {};
      for (const extra of limitedExtras) {
        if (extras[extra.id]) {
          booked[extra.id] = (booked[extra.id] ?? 0) + extras[extra.id];
        }
      }
    }

    const availability: Record<string, number> = {};
    for (const extra of limitedExtras) {
      availability[extra.id] = Math.max(0, (extra.globalMax ?? 0) - (booked[extra.id] ?? 0));
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching extras availability:', error);
    return NextResponse.json({ error: 'Failed to fetch extras availability' }, { status: 500 });
  }
}
