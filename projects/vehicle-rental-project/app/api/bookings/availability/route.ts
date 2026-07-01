import { NextResponse } from 'next/server';

// Demo API route - returns mock availability data without database connection
export const revalidate = 0;

export async function GET() {
  // Return empty availability array (all dates available for demo)
  // In a real scenario, this would show booked/blocked dates
  const demoAvailability: unknown[] = [
    // Optionally add some demo bookings to show the calendar working
    // {
    //   vehicle_id: 1,
    //   status: 'confirmed',
    //   start_date: '2026-08-15',
    //   end_date: '2026-08-22',
    //   is_hold: false
    // }
  ];

  return NextResponse.json(demoAvailability);
}
