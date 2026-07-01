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

  const result = await query(`SELECT key, value FROM admin_settings`);
  const settings: Record<string, string | null> = { contract_email: null };
  for (const row of result.rows) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { contract_email } = await request.json();

  if (contract_email !== null && contract_email !== undefined && contract_email !== '') {
    const email = String(contract_email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    await query(
      `INSERT INTO admin_settings (key, value, updated_at)
       VALUES ('contract_email', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [email]
    );
  } else {
    await query(`DELETE FROM admin_settings WHERE key = 'contract_email'`);
  }

  return NextResponse.json({ success: true });
}
