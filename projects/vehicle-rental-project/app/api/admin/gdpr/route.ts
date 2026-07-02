import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { auth } from '@/auth';
import { query, transaction } from '@/lib/db';

function requireAdminAuth() {
  return auth().then((session) => {
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return null;
  });
}

function getEmail(request: NextRequest): string | null {
  return new URL(request.url).searchParams.get('email')?.trim().toLowerCase() || null;
}

// GET /api/admin/gdpr/export?email=... — Subject Access Request export
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const email = getEmail(request);
  if (!email) return NextResponse.json({ error: 'email query param required' }, { status: 400 });

  const bookingsResult = await query(
    `SELECT b.*, v.name AS vehicle_name
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE LOWER(b.email) = $1
     ORDER BY b.created_at DESC`,
    [email]
  );

  const bookingIds = bookingsResult.rows.map((b) => b.id);

  let drivers: unknown[] = [];
  if (bookingIds.length > 0) {
    const driversResult = await query(
      `SELECT * FROM booking_drivers WHERE booking_id = ANY($1::int[])`,
      [bookingIds]
    );
    drivers = driversResult.rows;
  }

  return NextResponse.json({
    exported_at: new Date().toISOString(),
    email,
    bookings: bookingsResult.rows,
    driver_details: drivers,
  });
}

// DELETE /api/admin/gdpr/delete?email=... — Right to Erasure
export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const email = getEmail(request);
  if (!email) return NextResponse.json({ error: 'email query param required' }, { status: 400 });

  // Collect photo file paths before deleting driver rows
  const photosResult = await query(
    `SELECT bd.license_photo_front, bd.license_photo_back
     FROM booking_drivers bd
     JOIN bookings b ON bd.booking_id = b.id
     WHERE LOWER(b.email) = $1`,
    [email]
  );

  const photoFiles: string[] = photosResult.rows.flatMap((row) =>
    [row.license_photo_front, row.license_photo_back].filter(Boolean)
  );

  await transaction(async (client) => {
    await client.query(
      `DELETE FROM booking_drivers
       WHERE booking_id IN (SELECT id FROM bookings WHERE LOWER(email) = $1)`,
      [email]
    );

    // Anonymise booking rows — keep dates and financial data for accounting obligations
    await client.query(
      `UPDATE bookings
       SET first_name = '[deleted]',
           last_name  = '[deleted]',
           email      = $2,
           phone      = NULL
       WHERE LOWER(email) = $1`,
      [email, `deleted-${Date.now()}@gdpr.invalid`]
    );
  });

  let filesDeleted = 0;
  for (const photoUrl of photoFiles) {
    try {
      const filename = photoUrl.replace('/api/licenses/', '').replace('/uploads/licenses/', '');
      const filePath = path.join(process.cwd(), 'storage', 'licenses', filename);
      await unlink(filePath);
      filesDeleted++;
    } catch {
      // File already gone or wrong path — log but continue
    }
  }

  return NextResponse.json({
    success: true,
    bookings_anonymised: true,
    driver_records_deleted: true,
    photo_files_deleted: filesDeleted,
  });
}
