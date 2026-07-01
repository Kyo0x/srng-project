import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { ADMIN_EMAILS } from '@/lib/constants';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query(
    `SELECT id, start_date, end_date, min_days, label, created_at
     FROM min_stay_rules ORDER BY start_date ASC`
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { start_date, end_date, min_days, label, recurring } = await request.json();

  if (!start_date || !end_date || !min_days) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (new Date(end_date) <= new Date(start_date)) {
    return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
  }
  if (min_days < 1) {
    return NextResponse.json({ error: 'Minimum days must be at least 1' }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO min_stay_rules (start_date, end_date, min_days, label, recurring)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [start_date, end_date, min_days, label || null, recurring ?? false]
  );
  return NextResponse.json(result.rows[0]);
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await query('DELETE FROM min_stay_rules WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
