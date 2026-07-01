import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const result = await query(
      'SELECT id, order_id, upload_token FROM bookings WHERE stripe_session_id = $1',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ bookingId: result.rows[0].id, orderId: result.rows[0].order_id, uploadToken: result.rows[0].upload_token });
  } catch (error) {
    console.error('Error looking up booking by session:', error);
    return NextResponse.json({ error: 'Failed to look up booking' }, { status: 500 });
  }
}
