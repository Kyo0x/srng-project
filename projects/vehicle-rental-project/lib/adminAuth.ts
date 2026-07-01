import { query } from '@/lib/db';
import { ADMIN_EMAILS } from '@/lib/constants';

export function isSuperAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function isAuthorizedAdmin(email: string): Promise<boolean> {
  const normalized = email.toLowerCase();
  if (ADMIN_EMAILS.includes(normalized)) return true;
  try {
    const result = await query(
      `SELECT id FROM admin_users
       WHERE LOWER(email) = $1 AND (expires_at IS NULL OR expires_at > NOW())`,
      [normalized]
    );
    return result.rows.length > 0;
  } catch {
    // If the table doesn't exist yet (pre-migration), fall back to env list only
    return false;
  }
}
