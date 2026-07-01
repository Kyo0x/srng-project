import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [vehiclesRes, bookingsRes, revenueRes] = await Promise.all([
      query('SELECT COUNT(*) as count FROM vehicles'),
      query('SELECT COUNT(*) as count FROM bookings'),
      query('SELECT SUM(total_price) as total FROM bookings WHERE status = $1', ['completed'])
    ]);

    return NextResponse.json({
      totalVehicles: parseInt(vehiclesRes.rows[0].count),
      totalBookings: parseInt(bookingsRes.rows[0].count),
      totalRevenue: parseFloat(revenueRes.rows[0]?.total?.toString() || '0')
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
