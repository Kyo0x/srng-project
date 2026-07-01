import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendEmail } from '@/lib/email';

// Runs daily at 8 AM UTC via Vercel Cron
// Sends a pickup reminder to customers whose booking starts in 3 days
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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
        v.name AS vehicle_name
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.status NOT IN ('cancelled')
        AND b.start_date = CURRENT_DATE + INTERVAL '3 days'
        AND b.arrival_reminder_sent_at IS NULL
      ORDER BY b.id ASC
      LIMIT 50`
    );

    const bookings = result.rows;
    const results: { bookingId: number; success: boolean; error?: string }[] = [];

    for (const booking of bookings) {
      try {
        const startStr = new Date(booking.start_date).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        });
        const endStr = new Date(booking.end_date).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        });
        const ref = booking.order_id || `#${booking.id}`;
        const baseUrl = 'https://arctictrail.no';
        const manageUrl = booking.upload_token
          ? `${baseUrl}/modify-booking?token=${booking.upload_token}`
          : `${baseUrl}/modify-booking`;

        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="padding:40px 0;text-align:center;">
        <table role="presentation" style="width:600px;margin:0 auto;background:#ffffff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:32px 40px 16px;background:linear-gradient(135deg,#1e3a8a,#2563eb);border-radius:8px 8px 0 0;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">NorthVenture</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.7;">
                Hi ${booking.first_name},<br><br>
                This is a friendly reminder that your <strong>${booking.vehicle_name}</strong> rental (${ref}) starts in 3 days on <strong>${startStr}</strong>.<br><br>
                Your rental ends on <strong>${endStr}</strong>. Please ensure you have all necessary documents ready for pickup.
              </p>

              <!-- How to get here -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
              <p style="margin:0 0 16px;color:#374151;font-size:15px;font-weight:700;">Getting to us from the airport</p>
              <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Our address</p>
              <p style="margin:0 0 20px;color:#374151;font-size:14px;">Ropnesvegen 43, Eidkjosen</p>

              <!-- Bus -->
              <p style="margin:0 0 8px;color:#374151;font-size:14px;font-weight:700;">🚌 By bus (50–80 NOK · 35–45 min)</p>
              <p style="margin:0 0 4px;color:#6b7280;font-size:13px;"><strong>Operator:</strong> Svipper &nbsp;·&nbsp; <strong>Route:</strong> Line 42 towards Kaldfjord / Eidkjosen</p>
              <ol style="margin:8px 0 0 0;padding-left:20px;color:#6b7280;font-size:13px;line-height:1.8;">
                <li>Go to the bus stop outside the <strong>arrivals hall</strong> at Bergen Airport</li>
                <li>Take <strong>Line 42</strong> towards Kaldfjord / Eidkjosen</li>
                <li>Get off at <strong>Eidkjosen</strong> (not Eidkjosvegen)</li>
                <li>Walk to Ropnesvegen 43 (approx. 1 km)</li>
              </ol>

              <!-- Taxi -->
              <p style="margin:20px 0 8px;color:#374151;font-size:14px;font-weight:700;">🚕 By taxi (500–700 NOK · 20–35 min)</p>
              <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">Take a taxi directly from the airport to <strong>Ropnesvegen 43</strong>.</p>
              <table role="presentation" style="margin:8px 0 0 0;border-collapse:collapse;">
                <tr>
                  <td style="padding:4px 12px 4px 0;color:#6b7280;font-size:13px;vertical-align:top;">Bergen Taxi AS</td>
                  <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:600;"><a href="tel:+4703011" style="color:#1e3a8a;text-decoration:none;">+47 03011</a></td>
                </tr>
                <tr>
                  <td style="padding:4px 12px 4px 0;color:#6b7280;font-size:13px;vertical-align:top;">Din Taxi</td>
                  <td style="padding:4px 0;color:#374151;font-size:13px;font-weight:600;"><a href="tel:+4740102045" style="color:#1e3a8a;text-decoration:none;">+47 401 02 045</a></td>
                </tr>
              </table>

              <p style="margin:20px 0 0;text-align:center;">
                <a href="https://www.arctictrail.no/location" style="display:inline-block;padding:10px 22px;background-color:#f3f4f6;color:#374151;text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;border:1px solid #e5e7eb;">View location &amp; directions →</a>
              </p>

              <!-- Manage booking -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 24px;">
              <p style="margin:0 0 16px;color:#374151;font-size:14px;font-weight:600;text-align:center;">Need to make changes?</p>
              <p style="margin:0 0 12px;text-align:center;">
                <a href="${manageUrl}" style="display:inline-block;padding:12px 28px;background-color:#1e3a8a;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">Modify or Cancel Booking</a>
              </p>
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                Or visit: <a href="${manageUrl}" style="color:#3b82f6;text-decoration:none;">arctictrail.no/modify-booking</a>
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
              <p style="margin:0 0 4px;color:#374151;font-size:14px;text-align:center;">We look forward to seeing you!</p>
              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">NorthVenture · Bergen, Norway</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        await sendEmail(
          booking.email,
          'noreply@arctictrail.no',
          `Reminder: Your ${booking.vehicle_name} rental starts in 3 days`,
          html
        );

        await query(
          'UPDATE bookings SET arrival_reminder_sent_at = NOW() WHERE id = $1',
          [booking.id]
        );

        results.push({ bookingId: booking.id, success: true });
      } catch (error) {
        console.error(`Failed to send arrival reminder for booking ${booking.id}:`, error);
        results.push({
          bookingId: booking.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({ processed: bookings.length, results });
  } catch (error) {
    console.error('Arrival reminder cron error:', error);
    return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
  }
}
