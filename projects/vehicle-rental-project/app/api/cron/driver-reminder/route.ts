import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendDriverDetailsReminder } from '@/lib/email';

// This endpoint is called by Vercel Cron
// Runs every hour to check for bookings needing driver detail reminders
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (in production)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find bookings that:
    // 1. Have status 'pending_details'
    // 2. Haven't had a reminder sent yet (reminder_sent_at is null)
    // 3. Start date is in the future (no point reminding for past bookings)
    const result = await query(
      `SELECT
        b.id,
        b.first_name,
        b.last_name,
        b.email,
        b.start_date,
        b.end_date,
        b.upload_token,
        b.order_id,
        v.name as vehicle_name
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.status = 'pending_details'
        AND b.reminder_sent_at IS NULL
        AND b.start_date > NOW()
      ORDER BY b.created_at ASC
      LIMIT 50`
    );

    const bookings = result.rows;
    const results: { bookingId: number; success: boolean; error?: string }[] = [];

    for (const booking of bookings) {
      try {
        // Send reminder email
        await sendDriverDetailsReminder({
          customerName: `${booking.first_name} ${booking.last_name}`,
          customerEmail: booking.email,
          vehicleName: booking.vehicle_name,
          startDate: new Date(booking.start_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          endDate: new Date(booking.end_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          bookingId: booking.id,
          uploadToken: booking.upload_token,
          orderId: booking.order_id ?? undefined,
        });

        // Mark reminder as sent
        await query(
          `UPDATE bookings SET reminder_sent_at = NOW() WHERE id = $1`,
          [booking.id]
        );

        results.push({ bookingId: booking.id, success: true });
      } catch (error) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, error);
        results.push({
          bookingId: booking.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      processed: bookings.length,
      results,
    });
  } catch (error) {
    console.error('Driver reminder cron error:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    );
  }
}
