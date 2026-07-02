import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { query, transaction } from '@/lib/db';

// Called by Vercel Cron daily.
// Stage 1: delete driver licence data 30 days after rental end date (GDPR minimisation).
// Stage 2: anonymise remaining booking PII after 7 years (Norwegian accounting law).
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ----------------------------------------------------------------
    // Stage 1 — delete driver data 30 days after rental end date
    // ----------------------------------------------------------------
    const expiredDriversResult = await query(
      `SELECT bd.license_photo_front, bd.license_photo_back
       FROM booking_drivers bd
       JOIN bookings b ON bd.booking_id = b.id
       WHERE b.end_date < NOW() - INTERVAL '30 days'`
    );

    const expiredPhotoFiles: string[] = expiredDriversResult.rows.flatMap((row) =>
      [row.license_photo_front, row.license_photo_back].filter(Boolean)
    );

    const expiredDriverCount = expiredDriversResult.rows.length;

    if (expiredDriverCount > 0) {
      await query(
        `DELETE FROM booking_drivers
         WHERE booking_id IN (
           SELECT id FROM bookings WHERE end_date < NOW() - INTERVAL '30 days'
         )`
      );

      for (const photoUrl of expiredPhotoFiles) {
        try {
          const filename = photoUrl.replace('/api/licenses/', '').replace('/uploads/licenses/', '');
          const filePath = path.join(process.cwd(), 'storage', 'licenses', filename);
          await unlink(filePath);
        } catch {
          // Already gone — continue
        }
      }
    }

    // ----------------------------------------------------------------
    // Stage 2 — anonymise full booking PII after 7 years
    // ----------------------------------------------------------------
    const oldBookingsResult = await query(
      `SELECT COUNT(*) AS count FROM bookings
       WHERE created_at < NOW() - INTERVAL '7 years'
         AND first_name != '[deleted]'`
    );
    const oldBookingCount = parseInt(oldBookingsResult.rows[0].count, 10);

    if (oldBookingCount > 0) {
      await transaction(async (client) => {
        await client.query(
          `UPDATE bookings
           SET first_name = '[deleted]',
               last_name  = '[deleted]',
               email      = 'deleted-' || id || '@gdpr.invalid',
               phone      = NULL
           WHERE created_at < NOW() - INTERVAL '7 years'
             AND first_name != '[deleted]'`
        );
      });
    }

    return NextResponse.json({
      success: true,
      driver_records_deleted: expiredDriverCount,
      driver_photos_deleted: expiredPhotoFiles.length,
      bookings_anonymised: oldBookingCount,
    });
  } catch (error) {
    console.error('Data retention cron error:', error);
    return NextResponse.json({ error: 'Data retention job failed' }, { status: 500 });
  }
}
