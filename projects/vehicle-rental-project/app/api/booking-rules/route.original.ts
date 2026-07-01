import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { VALIDATION } from '@/lib/constants';

export const revalidate = 300;

// Returns all rules (used by calendar for client-side checks)
// OR the effective min_days for a specific startDate if provided
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');

  try {
    if (!startDate) {
      // Return all rules for client-side calendar use
      const result = await query(
        `SELECT id, start_date, end_date, min_days, label, recurring FROM min_stay_rules ORDER BY start_date ASC`
      );
      return NextResponse.json(result.rows);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return NextResponse.json({ min_days: VALIDATION.MIN_RENTAL_DAYS });
    }

    const result = await query(
      `SELECT
         LEAST(
           min_days,
           GREATEST(
             2,
             CASE
               WHEN recurring = false THEN (end_date - $1::date) + 1
               ELSE (TO_DATE(EXTRACT(YEAR FROM $1::date)::text || '-' || TO_CHAR(end_date, 'MM-DD'), 'YYYY-MM-DD') - $1::date) + 1
             END
           )
         ) AS min_days,
         label
       FROM min_stay_rules
       WHERE (
         (recurring = false AND start_date <= $1::date AND end_date >= $1::date)
         OR
         (recurring = true AND (
           CASE
             WHEN TO_CHAR(end_date, 'MMDD') >= TO_CHAR(start_date, 'MMDD') THEN
               TO_CHAR($1::date, 'MMDD') >= TO_CHAR(start_date, 'MMDD') AND
               TO_CHAR($1::date, 'MMDD') <= TO_CHAR(end_date, 'MMDD')
             ELSE
               TO_CHAR($1::date, 'MMDD') >= TO_CHAR(start_date, 'MMDD') OR
               TO_CHAR($1::date, 'MMDD') <= TO_CHAR(end_date, 'MMDD')
           END
         ))
       )
       ORDER BY min_days DESC LIMIT 1`,
      [startDate]
    );

    const rule = result.rows[0];
    return NextResponse.json({
      min_days: rule?.min_days ?? VALIDATION.MIN_RENTAL_DAYS,
      label: rule?.label ?? null,
    });
  } catch {
    return NextResponse.json(startDate ? { min_days: VALIDATION.MIN_RENTAL_DAYS } : []);
  }
}
