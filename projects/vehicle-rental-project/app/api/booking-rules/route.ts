import { NextRequest, NextResponse } from 'next/server';
import { VALIDATION } from '@/lib/constants';

// Demo API route - returns mock booking rules without database connection
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');

  // If no startDate provided, return all rules for client-side use
  if (!startDate) {
    const demoRules = [
      // Example: Christmas/New Year high season requires 7-day minimum
      {
        id: 1,
        start_date: '2025-12-20',
        end_date: '2026-01-10',
        min_days: 7,
        label: 'Holiday Season',
        recurring: true,
      },
      // Example: Summer season requires 5-day minimum
      {
        id: 2,
        start_date: '2026-06-15',
        end_date: '2026-08-31',
        min_days: 5,
        label: 'Summer Season',
        recurring: true,
      },
    ];
    return NextResponse.json(demoRules);
  }

  // For specific date query, return default minimum days
  return NextResponse.json({ 
    min_days: VALIDATION.MIN_RENTAL_DAYS,
    label: null 
  });
}
