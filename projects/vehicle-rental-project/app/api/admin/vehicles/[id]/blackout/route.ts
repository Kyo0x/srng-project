import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const vehicleId = parseInt(id);
  if (isNaN(vehicleId)) return NextResponse.json({ error: 'Invalid vehicle ID' }, { status: 400 });

  const result = await query(
    'SELECT * FROM blackout_dates WHERE vehicle_id = $1 ORDER BY start_date ASC',
    [vehicleId]
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const vehicleId = parseInt(id);
  if (isNaN(vehicleId)) return NextResponse.json({ error: 'Invalid vehicle ID' }, { status: 400 });

  const { start_date, end_date, reason } = await request.json();

  if (!start_date || !end_date) {
    return NextResponse.json({ error: 'Start and end date are required' }, { status: 400 });
  }
  if (end_date < start_date) {
    return NextResponse.json({ error: 'End date must be on or after start date' }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO blackout_dates (vehicle_id, start_date, end_date, reason, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [vehicleId, start_date, end_date, reason?.trim() || null, session.user.email]
  );
  return NextResponse.json(result.rows[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await params;

  const { searchParams } = new URL(request.url);
  const blackoutId = parseInt(searchParams.get('id') || '');
  if (isNaN(blackoutId)) return NextResponse.json({ error: 'Invalid blackout ID' }, { status: 400 });

  const result = await query('DELETE FROM blackout_dates WHERE id = $1 RETURNING id', [blackoutId]);
  if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true });
}
