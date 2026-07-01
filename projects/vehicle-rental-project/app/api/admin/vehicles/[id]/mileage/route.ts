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
    `SELECT ml.*, b.first_name, b.last_name, b.order_id
     FROM mileage_logs ml
     LEFT JOIN bookings b ON ml.booking_id = b.id
     WHERE ml.vehicle_id = $1
     ORDER BY ml.logged_at DESC`,
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

  const { mileage, note, booking_id } = await request.json();
  const mileageInt = parseInt(mileage);

  if (!mileage || isNaN(mileageInt) || mileageInt < 0) {
    return NextResponse.json({ error: 'Valid mileage reading is required' }, { status: 400 });
  }

  await query(
    `INSERT INTO mileage_logs (vehicle_id, booking_id, mileage, note, logged_by)
     VALUES ($1, $2, $3, $4, $5)`,
    [vehicleId, booking_id || null, mileageInt, note?.trim() || null, session.user.email]
  );

  await query('UPDATE vehicles SET current_mileage = $1 WHERE id = $2', [mileageInt, vehicleId]);

  return NextResponse.json({ success: true });
}
