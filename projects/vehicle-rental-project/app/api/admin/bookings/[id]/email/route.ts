import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendEmail } from '@/lib/email';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await params;

  const { to, subject, message, uploadToken } = await request.json();

  if (!to || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Recipient, subject and message are required' }, { status: 400 });
  }

  const messageHtml = escapeHtml(message).replace(/\n/g, '<br>');

  const baseUrl = 'https://arctictrail.no';
  const manageUrl = uploadToken ? `${baseUrl}/modify-booking?token=${uploadToken}` : `${baseUrl}/modify-booking`;
  const driverDetailsUrl = uploadToken
    ? `https://www.arctictrail.no/booking-details/${uploadToken}`
    : null;

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
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.7;">${messageHtml}</p>
              ${driverDetailsUrl ? `
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
              <p style="margin:0 0 16px;color:#374151;font-size:14px;font-weight:600;text-align:center;">Complete your driver registration</p>
              <p style="margin:0 0 12px;text-align:center;">
                <a href="${driverDetailsUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#059669,#0f766e);color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">Submit Driver Details</a>
              </p>
              <p style="margin:0 0 0;color:#9ca3af;font-size:12px;text-align:center;">
                Or visit: <a href="${driverDetailsUrl}" style="color:#3b82f6;text-decoration:none;">arctictrail.no/booking-details/…</a>
              </p>
              ` : ''}
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
              <p style="margin:0 0 16px;color:#374151;font-size:14px;font-weight:600;text-align:center;">Manage your booking</p>
              <p style="margin:0 0 12px;text-align:center;">
                <a href="${manageUrl}" style="display:inline-block;padding:12px 28px;background-color:#1e3a8a;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">Modify or Cancel Booking</a>
              </p>
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                Or visit: <a href="${manageUrl}" style="color:#3b82f6;text-decoration:none;">arctictrail.no/modify-booking</a>
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
              <p style="margin:0;color:#9ca3af;font-size:13px;">NorthVenture · Bergen, Norway</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const result = await sendEmail(to, 'noreply@arctictrail.no', subject.trim(), html);

  if (!result.success) {
    console.error('Admin email send failed:', result.error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
