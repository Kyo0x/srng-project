import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const bookingId = parseInt(id);
  if (isNaN(bookingId)) return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });

  const { notes } = await request.json();

  const result = await query(
    'UPDATE bookings SET admin_notes = $1 WHERE id = $2 RETURNING admin_notes',
    [notes?.trim() || null, bookingId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, admin_notes: result.rows[0].admin_notes });
}
