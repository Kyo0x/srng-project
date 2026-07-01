import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { isSuperAdmin } from '@/lib/adminAuth';
import { ADMIN_EMAILS } from '@/lib/constants';

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isSuperAdmin(session.user.email)) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireSuperAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query(
    `SELECT id, email, name, is_temporary, expires_at, created_by, created_at
     FROM admin_users ORDER BY created_at DESC`
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  const session = await requireSuperAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { email, name, is_temporary, expires_at } = body;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  if (ADMIN_EMAILS.includes(normalized)) {
    return NextResponse.json({ error: 'This email is already a super admin' }, { status: 400 });
  }

  if (is_temporary && !expires_at) {
    return NextResponse.json({ error: 'Expiry date is required for temporary admins' }, { status: 400 });
  }

  try {
    const result = await query(
      `INSERT INTO admin_users (email, name, is_temporary, expires_at, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, is_temporary, expires_at, created_by, created_at`,
      [
        normalized,
        name?.trim() || null,
        is_temporary ?? false,
        is_temporary && expires_at ? expires_at : null,
        session.user!.email,
      ]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      return NextResponse.json({ error: 'This email already has admin access' }, { status: 409 });
    }
    console.error('Error adding admin user:', err);
    return NextResponse.json({ error: 'Failed to add admin user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await requireSuperAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  if (ADMIN_EMAILS.includes(email.toLowerCase())) {
    return NextResponse.json({ error: 'Cannot remove a super admin' }, { status: 400 });
  }

  const result = await query(
    `DELETE FROM admin_users WHERE LOWER(email) = $1 RETURNING id`,
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
