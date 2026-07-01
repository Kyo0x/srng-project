import { Resend } from 'resend';
import { ADMIN_EMAILS, ALL_EXTRAS, INSURANCE_OPTIONS } from './constants';
import type { ContractBooking, ContractDriver } from './contract';
import { getEnv } from './env';

const apiKey = getEnv.email.resendApiKey();
const resend = apiKey ? new Resend(apiKey) : null;

const formatPrice = (price: number): string =>
  price.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, ' ') + ' kr';

const tableRow = (label: string, value: string, options?: { labelWidth?: string }): string => `
  <tr>
    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;${options?.labelWidth ? ` width: ${options.labelWidth};` : ''}">${label}</td>
    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${value}</td>
  </tr>`;

const tableRowLink = (label: string, href: string, text: string, labelWidth?: string): string => `
  <tr>
    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;${labelWidth ? ` width: ${labelWidth};` : ''}">${label}</td>
    <td style="padding: 8px 0;"><a href="${href}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">${text}</a></td>
  </tr>`;

const totalRow = (label: string, value: string, color: string, borderColor = '#e5e7eb'): string => `
  <tr>
    <td colspan="2" style="padding-top: 16px; border-top: 2px solid ${borderColor};">
      <table role="presentation" style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #111827; font-size: 18px; font-weight: 700;">${label}</td>
          <td style="padding: 8px 0; color: ${color}; font-size: 20px; font-weight: 700; text-align: right;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;

const infoBox = (content: string, variant: 'blue' | 'yellow' | 'green' | 'red' | 'gray'): string => {
  const colors = {
    blue: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    yellow: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    green: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
    red: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
    gray: { bg: '#f9fafb', border: '#6b7280', text: '#111827' },
  };
  const c = colors[variant];
  return `
    <div style="background-color: ${c.bg}; border-left: 4px solid ${c.border}; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; color: ${c.text}; font-size: 14px; line-height: 1.6;">${content}</p>
    </div>`;
};

const detailsBox = (title: string, content: string, variant: 'default' | 'red' = 'default'): string => {
  const bg = variant === 'red' ? '#fef2f2' : '#f9fafb';
  const borderStyle = variant === 'red' ? 'border-left: 4px solid #ef4444;' : '';
  const titleColor = variant === 'red' ? '#991b1b' : '#111827';
  return `
    <div style="background-color: ${bg}; border-radius: 8px; padding: 24px; margin-bottom: 24px; ${borderStyle}">
      <h3 style="margin: 0 0 16px; color: ${titleColor}; font-size: 18px; font-weight: 600;">${title}</h3>
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        ${content}
      </table>
    </div>`;
};

interface EmailHeaderOptions {
  title: string;
  subtitle?: string;
  background: string;
  subtitleColor?: string;
}

const emailHeader = ({ title, subtitle, background, subtitleColor = '#e0e7ff' }: EmailHeaderOptions): string => `
  <tr>
    <td style="padding: ${subtitle ? '40px 40px 20px' : '32px 40px'}; text-align: center; ${background}; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; color: #ffffff; font-size: ${subtitle ? '28px' : '24px'}; font-weight: 700;">${title}</h1>
      ${subtitle ? `<p style="margin: 8px 0 0; color: ${subtitleColor}; font-size: 14px;">${subtitle}</p>` : ''}
    </td>
  </tr>`;

interface EmailFooterOptions {
  text?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonColor?: string;
}

const emailFooter = ({ text, buttonText, buttonHref, buttonColor = '#3b82f6' }: EmailFooterOptions = {}): string => `
  <tr>
    <td style="padding: 24px 40px; text-align: center; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
      ${text ? `<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">${text}</p>` : ''}
      ${buttonText && buttonHref ? `
        <a href="${buttonHref}" style="display: inline-block; padding: 12px 24px; background-color: ${buttonColor}; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
          ${buttonText}
        </a>
      ` : `<p style="margin: 0; color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Arctic Trail. All rights reserved.</p>`}
    </td>
  </tr>`;

const emailWrapper = (title: string, content: string): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 40px 0; text-align: center;">
          <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${content}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

interface Attachment {
  filename: string;
  content: Buffer;
}

export const sendEmail = async (
  to: string | string[],
  from: string,
  subject: string,
  html: string,
  attachments?: Attachment[]
): Promise<{ success: boolean; error?: unknown }> => {
  if (!resend) {
    console.warn('Resend not configured - skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }
  try {
    await resend.emails.send({ from, to, subject, html, attachments });
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

const formatInsuranceLabel = (insuranceType: string): string => {
  const option = INSURANCE_OPTIONS.find(opt => opt.type === insuranceType);
  return option?.label || insuranceType;
};

const formatSelectedExtras = (selectedExtras: Record<string, number>): string[] => {
  const lines: string[] = [];
  for (const [extraId, quantity] of Object.entries(selectedExtras)) {
    if (quantity <= 0) continue;
    const extra = ALL_EXTRAS.find(e => e.id === extraId);
    if (!extra) continue;
    const name = extra.name;
    const qtyStr = quantity > 1 ? ` x${quantity}` : '';
    lines.push(`${name}${qtyStr}`);
  }
  return lines;
};


interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  pickupTime?: string;
  totalPrice: number;
  babySeats?: number;
  extraDriver?: boolean;
  insurance?: string;
  selectedExtras?: Record<string, number>;
  bookingId?: number;
  uploadToken?: string;
  orderId?: string;
}

interface CancellationEmailData {
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  refundAmount: number;
  refundPercentage: number;
  daysUntilStart: number;
  reason?: string;
  cancelledBy: 'customer' | 'admin';
  bookingId: number;
  orderId?: string;
  uploadToken?: string;
}

export const sendBookingConfirmation = async (data: BookingEmailData) => {
  const content = `
    ${emailHeader({
      title: 'Arctic Trail',
      subtitle: 'Your Adventure Awaits',
      background: 'background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    })}
    <tr>
      <td style="padding: 40px;">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; font-weight: 600;">Booking Confirmed!</h2>
        <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.5;">
          Hi ${data.customerName},<br><br>
          Your booking has been confirmed! We're excited to help you start your adventure.
        </p>

        <!-- Booking Details Card -->
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600;">Booking Details</h3>

          <!-- ID + Vehicle -->
          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            ${data.orderId ? `
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Order ID</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.orderId}</td>
            </tr>` : ''}
            ${data.uploadToken ? `
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Booking ID</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.uploadToken}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Vehicle</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.vehicleName}</td>
            </tr>
          </table>

          <!-- Dates side by side -->
          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="width: 50%; padding-right: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                  <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-in</div>
                  <div style="color: #111827; font-size: 14px; font-weight: 700;">${data.startDate}</div>
                </div>
              </td>
              <td style="width: 50%; padding-left: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                  <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-out</div>
                  <div style="color: #111827; font-size: 14px; font-weight: 700;">${data.endDate}</div>
                </div>
              </td>
            </tr>
          </table>

          ${data.insurance ? `
          <!-- Insurance badge -->
          <div style="margin-bottom: 16px;">
            <span style="color: #6b7280; font-size: 13px;">Insurance:&nbsp;</span>
            <span style="display: inline-block; background-color: #1e3a8a; color: #ffffff; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px;">${formatInsuranceLabel(data.insurance)}</span>
          </div>` : ''}

          ${(() => {
            const extras: string[] = [];
            if (data.selectedExtras) {
              for (const [id, qty] of Object.entries(data.selectedExtras)) {
                if (qty <= 0) continue;
                const extra = ALL_EXTRAS.find(e => e.id === id);
                if (!extra) continue;
                extras.push(qty > 1 ? `${extra.name} x${qty}` : extra.name);
              }
            }
            if (data.babySeats) extras.push(`Baby Seats x${data.babySeats}`);
            if (data.extraDriver) extras.push('Extra Driver');
            if (extras.length === 0) return '';
            return `
          <!-- Extras list -->
          <div style="margin-bottom: 16px;">
            <div style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Add-ons &amp; Extras</div>
            ${extras.map(e => `
            <div style="display: flex; align-items: center; padding: 5px 0; border-bottom: 1px solid #f0f0f0;">
              <span style="color: #16a34a; font-size: 14px; font-weight: 700; margin-right: 8px;">&#10003;</span>
              <span style="color: #111827; font-size: 13px;">${e}</span>
            </div>`).join('')}
          </div>`;
          })()}

          <!-- Total -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 14px; margin-top: 4px; display: flex; justify-content: space-between; align-items: baseline;">
            <table role="presentation" style="width: 100%;">
              <tr>
                <td style="color: #111827; font-size: 16px; font-weight: 700;">Total</td>
                <td style="color: #1e3a8a; font-size: 20px; font-weight: 700; text-align: right;">${formatPrice(data.totalPrice)}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px; color: #1e3a8a; font-size: 16px; font-weight: 600;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.6;">
            <li style="margin-bottom: 8px;"><strong>Submit your driver details</strong> (if you haven't already): <a href="https://www.arctictrail.no/booking-details/${data.uploadToken}" style="color: #3b82f6;">Click here to provide driver information</a></li>
            <li style="margin-bottom: 8px;">Please bring a valid driver's license and ID</li>
            <li>Arrive 15 minutes early for vehicle inspection</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 8px 0 16px;">
          <a href="https://arctictrail.no/modify-booking${data.uploadToken ? `?token=${data.uploadToken}` : ''}"
             style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Modify or Cancel Booking
          </a>
        </div>
        <p style="margin: 0 0 24px; color: #6b7280; font-size: 13px; text-align: center;">
          Or visit: <a href="https://arctictrail.no/modify-booking${data.uploadToken ? `?token=${data.uploadToken}` : ''}" style="color: #3b82f6; text-decoration: none;">arctictrail.no/modify-booking</a>
        </p>

        <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px; font-weight: 600;">Cancellation Policy</h3>
          <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; line-height: 1.5;">
            Need to change your plans? Here's our cancellation policy:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.6;">
            <li style="margin-bottom: 4px;"><strong>Within 24 hours of booking:</strong> 100% refund (free cancellation)</li>
            <li style="margin-bottom: 4px;"><strong>More than 30 days before:</strong> 100% refund</li>
            <li style="margin-bottom: 4px;"><strong>22-30 days before:</strong> 50% refund</li>
            <li style="margin-bottom: 4px;"><strong>15-21 days before:</strong> 25% refund</li>
            <li><strong>14 days or less:</strong> No refund</li>
          </ul>
        </div>

        <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.5;">
          Please review our <a href="https://www.arctictrail.no/toc" style="color: #3b82f6; text-decoration: none;">Terms and Conditions</a> before your trip.
        </p>

        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
          If you have any questions, feel free to reply to this email or contact us at:<br>
          <a href="mailto:hello@northventure-demo.com" style="color: #3b82f6; text-decoration: none;">hello@northventure-demo.com</a>
        </p>
      </td>
    </tr>
    ${emailFooter({ text: 'NorthVenture' })}
  `;

  const pdfBuffer = await (async () => {
    try {
      const { generateBookingConfirmationPdf } = await import('./pdf');
      return await generateBookingConfirmationPdf({
        bookingId: data.bookingId,
        uploadToken: data.uploadToken,
        orderId: data.orderId,
        customerName: data.customerName,
        vehicleName: data.vehicleName,
        startDate: data.startDate,
        endDate: data.endDate,
        insurance: data.insurance,
        selectedExtras: data.selectedExtras,
        babySeats: data.babySeats,
        extraDriver: data.extraDriver,
        totalPrice: data.totalPrice,
      });
    } catch (err) {
      console.error('Failed to generate booking confirmation PDF:', err);
      return null;
    }
  })();

  return sendEmail(
    data.customerEmail,
    'Arctic Trail <hello@northventure-demo.com>',
    `Booking Confirmation - ${data.vehicleName}`,
    emailWrapper('Booking Confirmation', content),
    pdfBuffer ? [{ filename: 'booking-confirmation.pdf', content: pdfBuffer }] : undefined
  );
};

export const sendAdminNotification = async (data: BookingEmailData) => {
  const extras: string[] = [];
  if (data.selectedExtras) {
    for (const [id, qty] of Object.entries(data.selectedExtras)) {
      if (qty <= 0) continue;
      const extra = ALL_EXTRAS.find(e => e.id === id);
      if (!extra) continue;
      extras.push(qty > 1 ? `${extra.name} x${qty}` : extra.name);
    }
  }
  if (data.babySeats) extras.push(`Baby Seats x${data.babySeats}`);
  if (data.extraDriver) extras.push('Extra Driver');

  const content = `
    ${emailHeader({
      title: 'New Booking',
      subtitle: 'A new booking has been confirmed',
      background: 'background: linear-gradient(135deg, #059669 0%, #10b981 100%)',
      subtitleColor: '#d1fae5',
    })}
    <tr>
      <td style="padding: 40px;">

        <!-- Customer Info -->
        <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 12px; color: #065f46; font-size: 15px; font-weight: 600;">Customer</h3>
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #6b7280; font-size: 13px; width: 80px;">Name</td>
              <td style="padding: 4px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6b7280; font-size: 13px;">Email</td>
              <td style="padding: 4px 0; font-size: 13px;"><a href="mailto:${data.customerEmail}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${data.customerEmail}</a></td>
            </tr>
          </table>
        </div>

        <!-- Booking Details Card -->
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600;">Booking Details</h3>

          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            ${data.orderId ? `
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Order ID</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.orderId}</td>
            </tr>` : ''}
            ${data.uploadToken ? `
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Booking ID</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.uploadToken}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Vehicle</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.vehicleName}</td>
            </tr>
          </table>

          <!-- Dates side by side -->
          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="width: 50%; padding-right: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                  <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-in</div>
                  <div style="color: #111827; font-size: 14px; font-weight: 700;">${data.startDate}</div>
                </div>
              </td>
              <td style="width: 50%; padding-left: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                  <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-out</div>
                  <div style="color: #111827; font-size: 14px; font-weight: 700;">${data.endDate}</div>
                </div>
              </td>
            </tr>
          </table>

          ${data.pickupTime ? `
          <!-- Pickup time -->
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px;">
            <div style="color: #92400e; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Estimated Pickup Time</div>
            <div style="color: #78350f; font-size: 16px; font-weight: 700;">${data.pickupTime}</div>
          </div>` : ''}

          ${data.insurance ? `
          <div style="margin-bottom: 16px;">
            <span style="color: #6b7280; font-size: 13px;">Insurance:&nbsp;</span>
            <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px;">${formatInsuranceLabel(data.insurance)}</span>
          </div>` : ''}

          ${extras.length > 0 ? `
          <div style="margin-bottom: 16px;">
            <div style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Add-ons &amp; Extras</div>
            ${extras.map(e => `
            <div style="display: flex; align-items: center; padding: 5px 0; border-bottom: 1px solid #f0f0f0;">
              <span style="color: #16a34a; font-size: 14px; font-weight: 700; margin-right: 8px;">&#10003;</span>
              <span style="color: #111827; font-size: 13px;">${e}</span>
            </div>`).join('')}
          </div>` : ''}

          <!-- Total -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 14px; margin-top: 4px;">
            <table role="presentation" style="width: 100%;">
              <tr>
                <td style="color: #111827; font-size: 16px; font-weight: 700;">Total</td>
                <td style="color: #059669; font-size: 20px; font-weight: 700; text-align: right;">${formatPrice(data.totalPrice)}</td>
              </tr>
            </table>
          </div>
        </div>

      </td>
    </tr>
    ${emailFooter({ buttonText: 'View in Admin Panel', buttonHref: 'https://arctictrail.no/admin/bookings', buttonColor: '#059669' })}
  `;

  const pdfBuffer = await (async () => {
    try {
      const { generateAdminNewBookingPdf } = await import('./pdf');
      return await generateAdminNewBookingPdf({
        bookingId: data.bookingId,
        uploadToken: data.uploadToken,
        orderId: data.orderId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        vehicleName: data.vehicleName,
        startDate: data.startDate,
        endDate: data.endDate,
        pickupTime: data.pickupTime,
        insurance: data.insurance,
        selectedExtras: data.selectedExtras,
        babySeats: data.babySeats,
        extraDriver: data.extraDriver,
        totalPrice: data.totalPrice,
      });
    } catch (err) {
      console.error('Failed to generate admin new booking PDF:', err);
      return null;
    }
  })();

  return sendEmail(
    ADMIN_EMAILS,
    'Arctic Trail <hello@northventure-demo.com>',
    `New Booking - ${data.vehicleName}`,
    emailWrapper('New Booking', content),
    pdfBuffer ? [{ filename: 'new-booking.pdf', content: pdfBuffer }] : undefined
  );
};

export const sendMagicLinkEmail = async (to: string, magicLink: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Arctic Trail</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Admin Login</p>
        </div>
        <div style="background-color: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Sign in to your account</h2>
          <p style="color: #6b7280; margin-bottom: 30px;">
            Click the button below to sign in to the Arctic Trail admin panel. This link will expire in 24 hours.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${magicLink}"
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      padding: 16px 32px;
                      text-decoration: none;
                      border-radius: 8px;
                      font-weight: bold;
                      display: inline-block;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              Sign in to Admin Panel
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you didn't request this email, you can safely ignore it.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} Arctic Trail. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail(to, 'Arctic Trail <noreply@arctictrail.no>', 'Sign in to Arctic Trail Admin', html);
};

export const sendCancellationConfirmation = async (data: CancellationEmailData) => {
  const refundColor = data.refundAmount > 0 ? '#166534' : '#92400e';
  const refundBg = data.refundAmount > 0 ? '#f0fdf4' : '#fef3c7';
  const refundBorder = data.refundAmount > 0 ? '#22c55e' : '#f59e0b';
  const refundBorderInner = data.refundAmount > 0 ? '#bbf7d0' : '#fde68a';

  const content = `
    ${emailHeader({
      title: 'Arctic Trail',
      subtitle: 'Booking Cancellation',
      background: 'background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      subtitleColor: '#e5e7eb',
    })}
    <tr>
      <td style="padding: 40px;">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; font-weight: 600;">Booking Cancelled</h2>
        <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.5;">
          Hi ${data.customerName},<br><br>
          Your booking has been cancelled as requested. ${data.refundAmount > 0 ? 'A refund will be processed to your original payment method.' : ''}
        </p>

        ${detailsBox('Cancelled Booking Details', `
          ${data.orderId ? tableRow('Order ID:', data.orderId) : ''}
          ${data.uploadToken ? tableRow('Booking ID:', data.uploadToken) : ''}
          ${tableRow('Vehicle:', data.vehicleName)}
          ${tableRow('Original Dates:', `${data.startDate} - ${data.endDate}`)}
          ${tableRow('Original Total:', formatPrice(data.totalPrice))}
        `, 'red')}

        <div style="background-color: ${refundBg}; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid ${refundBorder};">
          <h3 style="margin: 0 0 16px; color: ${refundColor}; font-size: 18px; font-weight: 600;">Refund Information</h3>
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            ${tableRow('Days until start:', `${data.daysUntilStart} days`)}
            ${tableRow('Refund percentage:', `${data.refundPercentage}%`)}
            ${totalRow('Refund Amount:', formatPrice(data.refundAmount), refundColor, refundBorderInner)}
          </table>
        </div>

        ${data.refundAmount > 0
          ? infoBox('<strong>Refund Timeline:</strong> Your refund will be processed within 3-5 business days. The exact timing depends on your bank or card provider.', 'blue')
          : infoBox('<strong>No Refund:</strong> As the cancellation was made less than 15 days before the start date, no refund is available according to our cancellation policy.', 'yellow')}

        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
          If you have any questions about your cancellation or refund, please don't hesitate to contact us at:<br>
          <a href="mailto:hello@northventure-demo.com" style="color: #3b82f6; text-decoration: none;">hello@northventure-demo.com</a>
        </p>
      </td>
    </tr>
    ${emailFooter({ text: 'We hope to see you again soon!' })}
  `;

  const pdfBuffer = await (async () => {
    try {
      const { generateCancellationPdf } = await import('./pdf');
      return await generateCancellationPdf({
        bookingId: data.bookingId,
        orderId: data.orderId,
        uploadToken: data.uploadToken,
        customerName: data.customerName,
        vehicleName: data.vehicleName,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: data.totalPrice,
        refundAmount: data.refundAmount,
        refundPercentage: data.refundPercentage,
        daysUntilStart: data.daysUntilStart,
        cancelledBy: data.cancelledBy,
      });
    } catch (err) {
      console.error('Failed to generate cancellation PDF:', err);
      return null;
    }
  })();

  return sendEmail(
    data.customerEmail,
    'Arctic Trail <hello@northventure-demo.com>',
    `Booking Cancellation Confirmed - ${data.vehicleName}`,
    emailWrapper('Booking Cancellation', content),
    pdfBuffer ? [{ filename: 'booking-cancellation.pdf', content: pdfBuffer }] : undefined
  );
};

export const sendAdminCancellationNotification = async (data: CancellationEmailData) => {
  const content = `
    ${emailHeader({
      title: 'Booking Cancelled',
      background: 'background-color: #ef4444',
    })}
    <tr>
      <td style="padding: 40px;">
        <h2 style="margin: 0 0 24px; color: #111827; font-size: 20px; font-weight: 600;">Customer Information</h2>

        <table role="presentation" style="width: 100%; margin-bottom: 32px;">
          ${tableRow('Name:', data.customerName, { labelWidth: '140px' })}
          ${tableRowLink('Email:', `mailto:${data.customerEmail}`, data.customerEmail, '140px')}
          ${tableRow('Cancelled by:', data.cancelledBy === 'admin' ? 'Admin' : 'Customer', { labelWidth: '140px' })}
        </table>

        <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: 600;">Cancelled Booking Details</h2>

        <div style="background-color: #fef2f2; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <table role="presentation" style="width: 100%;">
            ${data.orderId ? tableRow('Order ID:', data.orderId, { labelWidth: '140px' }) : ''}
            ${data.uploadToken ? tableRow('Booking ID:', data.uploadToken, { labelWidth: '140px' }) : ''}
            ${tableRow('Vehicle:', data.vehicleName, { labelWidth: '140px' })}
            ${tableRow('Dates:', `${data.startDate} - ${data.endDate}`, { labelWidth: '140px' })}
            ${tableRow('Original Total:', formatPrice(data.totalPrice), { labelWidth: '140px' })}
            ${totalRow('Refund Processed:', `${formatPrice(data.refundAmount)} (${data.refundPercentage}%)`, '#dc2626', '#fecaca')}
          </table>
        </div>

        ${data.reason ? `
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 600;">Cancellation Reason:</p>
          <p style="margin: 0; color: #111827; font-size: 14px;">${data.reason}</p>
        </div>
        ` : ''}
      </td>
    </tr>
    ${emailFooter({ buttonText: 'View in Admin Panel', buttonHref: 'https://arctictrail.no/admin/bookings', buttonColor: '#6b7280' })}
  `;

  const pdfBuffer = await (async () => {
    try {
      const { generateCancellationPdf } = await import('./pdf');
      return await generateCancellationPdf({
        bookingId: data.bookingId,
        orderId: data.orderId,
        uploadToken: data.uploadToken,
        customerName: data.customerName,
        vehicleName: data.vehicleName,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: data.totalPrice,
        refundAmount: data.refundAmount,
        refundPercentage: data.refundPercentage,
        daysUntilStart: data.daysUntilStart,
        reason: data.reason,
        cancelledBy: data.cancelledBy,
      });
    } catch (err) {
      console.error('Failed to generate admin cancellation PDF:', err);
      return null;
    }
  })();

  return sendEmail(
    ADMIN_EMAILS,
    'Arctic Trail <hello@northventure-demo.com>',
    `Booking Cancelled - ${data.vehicleName} (#${data.bookingId})`,
    emailWrapper('Booking Cancelled', content),
    pdfBuffer ? [{ filename: 'booking-cancellation.pdf', content: pdfBuffer }] : undefined
  );
};

interface DriverReminderEmailData {
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  bookingId: number;
  uploadToken?: string;
  orderId?: string;
}

export const sendDriverDetailsReminder = async (data: DriverReminderEmailData) => {
  const content = `
    ${emailHeader({
      title: 'Arctic Trail',
      subtitle: 'Action Required',
      background: 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    })}
    <tr>
      <td style="padding: 40px;">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; font-weight: 600;">Driver Details Needed</h2>
        <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.5;">
          Hi ${data.customerName},<br><br>
          We noticed you haven't completed your driver registration yet. Please submit your driver details to finalize your booking.
        </p>

        ${detailsBox('Your Booking', `
          ${data.orderId ? tableRow('Order ID:', data.orderId) : ''}
          ${data.uploadToken ? tableRow('Booking ID:', data.uploadToken) : ''}
          ${tableRow('Vehicle:', data.vehicleName)}
          ${tableRow('Check-in:', data.startDate)}
          ${tableRow('Check-out:', data.endDate)}
        `)}

        ${infoBox('<strong>Why is this important?</strong> We need your driver details to prepare the vehicle and ensure a smooth pickup experience. Without this information, there may be delays when you arrive.', 'yellow')}

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://www.arctictrail.no/booking-details/${data.uploadToken}"
             style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Complete Driver Registration
          </a>
        </div>

        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
          If you have any questions, feel free to contact us at:<br>
          <a href="mailto:hello@northventure-demo.com" style="color: #3b82f6; text-decoration: none;">hello@northventure-demo.com</a>
        </p>
      </td>
    </tr>
    ${emailFooter({ text: 'NorthVenture' })}
  `;

  const pdfBuffer = await (async () => {
    try {
      const { generateDriverReminderPdf } = await import('./pdf');
      return await generateDriverReminderPdf({
        bookingId: data.bookingId,
        uploadToken: data.uploadToken,
        orderId: data.orderId,
        customerName: data.customerName,
        vehicleName: data.vehicleName,
        startDate: data.startDate,
        endDate: data.endDate,
      });
    } catch (err) {
      console.error('Failed to generate driver reminder PDF:', err);
      return null;
    }
  })();

  return sendEmail(
    data.customerEmail,
    'Arctic Trail <hello@northventure-demo.com>',
    `Action Required: Complete your driver registration - ${data.vehicleName}`,
    emailWrapper('Driver Details Reminder', content),
    pdfBuffer ? [{ filename: 'driver-registration.pdf', content: pdfBuffer }] : undefined
  );
};

export interface ModificationEmailData {
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  oldStartDate: string;
  oldEndDate: string;
  newStartDate: string;
  newEndDate: string;
  oldTotalPrice: number;
  newTotalPrice: number;
  priceDiff: number;
  refundAmount?: number;
  refundPercentage?: number;
  bookingId: number;
  uploadToken?: string;
  orderId?: string;
  // Extras modification fields
  oldInsuranceType?: string;
  newInsuranceType?: string;
  oldSelectedExtras?: Record<string, number>;
  newSelectedExtras?: Record<string, number>;
}

export const sendModificationConfirmation = async (data: ModificationEmailData) => {
  const hasSurcharge = data.priceDiff > 0;
  const hasRefund = (data.refundAmount ?? 0) > 0;
  const isExtrasChange = data.newInsuranceType !== undefined || data.newSelectedExtras !== undefined;

  const oldInsuranceLabel = data.oldInsuranceType ? formatInsuranceLabel(data.oldInsuranceType) : null;
  const newInsuranceLabel = data.newInsuranceType ? formatInsuranceLabel(data.newInsuranceType) : null;
  const insuranceChanged = oldInsuranceLabel && newInsuranceLabel && oldInsuranceLabel !== newInsuranceLabel;

  const oldExtrasList = data.oldSelectedExtras ? formatSelectedExtras(data.oldSelectedExtras) : [];
  const newExtrasList = data.newSelectedExtras ? formatSelectedExtras(data.newSelectedExtras) : [];

  const extrasChangesBlock = isExtrasChange ? `
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 20px; color: #111827; font-size: 16px; font-weight: 600;">What Changed</h3>

      ${insuranceChanged ? `
      <div style="margin-bottom: 16px;">
        <div style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Insurance</div>
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; background-color: #e5e7eb; color: #6b7280; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; text-decoration: line-through;">${oldInsuranceLabel}</span>
          <span style="color: #9ca3af; font-size: 14px;">→</span>
          <span style="display: inline-block; background-color: #0f766e; color: #ffffff; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px;">${newInsuranceLabel}</span>
        </div>
      </div>` : ''}

      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; padding-right: 8px; vertical-align: top;">
            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
              <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Before</div>
              ${oldExtrasList.length > 0
                ? oldExtrasList.map(e => `<div style="padding: 3px 0; color: #9ca3af; font-size: 13px; text-decoration: line-through;">${e}</div>`).join('')
                : '<div style="color: #9ca3af; font-size: 13px; font-style: italic;">None</div>'}
            </div>
          </td>
          <td style="width: 50%; padding-left: 8px; vertical-align: top;">
            <div style="background-color: #ffffff; border: 1px solid #d1fae5; border-radius: 6px; padding: 12px 16px;">
              <div style="color: #059669; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">After</div>
              ${newExtrasList.length > 0
                ? newExtrasList.map(e => `<div style="padding: 3px 0;"><span style="color: #16a34a; font-weight: 700; margin-right: 6px;">&#10003;</span><span style="color: #111827; font-size: 13px;">${e}</span></div>`).join('')
                : '<div style="color: #9ca3af; font-size: 13px; font-style: italic;">None</div>'}
            </div>
          </td>
        </tr>
      </table>
    </div>
  ` : '';

  const content = `
    ${emailHeader({
      title: 'Arctic Trail',
      subtitle: 'Booking Modified',
      background: 'background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
      subtitleColor: '#ccfbf1',
    })}
    <tr>
      <td style="padding: 40px;">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; font-weight: 600;">Booking Updated</h2>
        <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.5;">
          Hi ${data.customerName},<br><br>
          Your booking has been successfully updated. Here's a summary of the changes.
        </p>

        <!-- Booking Details Card -->
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600;">Booking Details</h3>

          <!-- ID + Vehicle -->
          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Order ID</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.orderId ?? `#${data.bookingId}`}</td>
            </tr>
            ${data.uploadToken ? `
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Booking ID</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.uploadToken}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 110px;">Vehicle</td>
              <td style="padding: 6px 0; color: #111827; font-size: 13px; font-weight: 600;">${data.vehicleName}</td>
            </tr>
          </table>

          ${isExtrasChange ? `
          <!-- Dates side by side (unchanged) -->
          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="width: 50%; padding-right: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                  <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-in</div>
                  <div style="color: #111827; font-size: 14px; font-weight: 700;">${data.newStartDate}</div>
                </div>
              </td>
              <td style="width: 50%; padding-left: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                  <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-out</div>
                  <div style="color: #111827; font-size: 14px; font-weight: 700;">${data.newEndDate}</div>
                </div>
              </td>
            </tr>
          </table>
          ` : `
          <!-- Old dates → New dates -->
          <div style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Previous Dates</div>
          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
            <tr>
              <td style="width: 50%; padding-right: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px; opacity: 0.6;">
                  <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-in</div>
                  <div style="color: #6b7280; font-size: 14px; font-weight: 700; text-decoration: line-through;">${data.oldStartDate}</div>
                </div>
              </td>
              <td style="width: 50%; padding-left: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px; opacity: 0.6;">
                  <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-out</div>
                  <div style="color: #6b7280; font-size: 14px; font-weight: 700; text-decoration: line-through;">${data.oldEndDate}</div>
                </div>
              </td>
            </tr>
          </table>
          <div style="color: #0f766e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">New Dates</div>
          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="width: 50%; padding-right: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #99f6e4; border-radius: 6px; padding: 12px 16px;">
                  <div style="color: #0f766e; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-in</div>
                  <div style="color: #111827; font-size: 14px; font-weight: 700;">${data.newStartDate}</div>
                </div>
              </td>
              <td style="width: 50%; padding-left: 8px;">
                <div style="background-color: #ffffff; border: 1px solid #99f6e4; border-radius: 6px; padding: 12px 16px;">
                  <div style="color: #0f766e; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Check-out</div>
                  <div style="color: #111827; font-size: 14px; font-weight: 700;">${data.newEndDate}</div>
                </div>
              </td>
            </tr>
          </table>
          `}

          <!-- New Total -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 14px; margin-top: 4px;">
            <table role="presentation" style="width: 100%;">
              <tr>
                <td style="color: #111827; font-size: 16px; font-weight: 700;">New Total</td>
                <td style="color: #0f766e; font-size: 20px; font-weight: 700; text-align: right;">${formatPrice(data.newTotalPrice)}</td>
              </tr>
            </table>
          </div>
        </div>

        ${extrasChangesBlock}

        ${hasRefund ? `
        <div style="background-color: #f0fdf4; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #22c55e;">
          <h3 style="margin: 0 0 16px; color: #166534; font-size: 18px; font-weight: 600;">Refund Information</h3>
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            ${tableRow('Refund percentage:', `${data.refundPercentage}%`)}
            ${totalRow('Refund Amount:', formatPrice(data.refundAmount!), '#166534', '#bbf7d0')}
          </table>
        </div>
        ${infoBox('<strong>Refund Timeline:</strong> Your partial refund will be processed within 3–5 business days to your original payment method.', 'blue')}
        ` : hasSurcharge ? `
        ${infoBox(`<strong>Payment Processed:</strong> An additional charge of <strong>${formatPrice(data.priceDiff)}</strong> has been applied.`, 'blue')}
        ` : ''}

        <div style="text-align: center; margin: 8px 0 16px;">
          <a href="https://arctictrail.no/modify-booking${data.uploadToken ? `?token=${data.uploadToken}` : ''}"
             style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Modify or Cancel Booking
          </a>
        </div>
        <p style="margin: 0 0 24px; color: #6b7280; font-size: 13px; text-align: center;">
          Or visit: <a href="https://arctictrail.no/modify-booking${data.uploadToken ? `?token=${data.uploadToken}` : ''}" style="color: #3b82f6; text-decoration: none;">arctictrail.no/modify-booking</a>
        </p>

        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
          If you have any questions, feel free to contact us at:<br>
          <a href="mailto:hello@northventure-demo.com" style="color: #3b82f6; text-decoration: none;">hello@northventure-demo.com</a>
        </p>
      </td>
    </tr>
    ${emailFooter({ text: 'NorthVenture' })}
  `;

  const pdfBuffer = await (async () => {
    try {
      const { generateBookingUpdatedPdf } = await import('./pdf');
      return await generateBookingUpdatedPdf({
        bookingId: data.bookingId,
        uploadToken: data.uploadToken,
        orderId: data.orderId,
        customerName: data.customerName,
        vehicleName: data.vehicleName,
        oldStartDate: data.oldStartDate,
        oldEndDate: data.oldEndDate,
        newStartDate: data.newStartDate,
        newEndDate: data.newEndDate,
        oldTotalPrice: data.oldTotalPrice,
        newTotalPrice: data.newTotalPrice,
        priceDiff: data.priceDiff,
        refundAmount: data.refundAmount,
        refundPercentage: data.refundPercentage,
        oldInsuranceType: data.oldInsuranceType,
        newInsuranceType: data.newInsuranceType,
        oldSelectedExtras: data.oldSelectedExtras,
        newSelectedExtras: data.newSelectedExtras,
      });
    } catch (err) {
      console.error('Failed to generate booking updated PDF:', err);
      return null;
    }
  })();

  return sendEmail(
    data.customerEmail,
    'Arctic Trail <hello@northventure-demo.com>',
    `Booking Updated – ${data.vehicleName}`,
    emailWrapper('Booking Modified', content),
    pdfBuffer ? [{ filename: 'booking-updated.pdf', content: pdfBuffer }] : undefined
  );
};

export const sendAdminModificationNotification = async (data: ModificationEmailData) => {
  const content = `
    ${emailHeader({
      title: 'Booking Modified',
      background: 'background-color: #0f766e',
    })}
    <tr>
      <td style="padding: 40px;">
        <h2 style="margin: 0 0 24px; color: #111827; font-size: 20px; font-weight: 600;">Customer Information</h2>

        <table role="presentation" style="width: 100%; margin-bottom: 32px;">
          ${tableRow('Name:', data.customerName, { labelWidth: '140px' })}
          ${tableRowLink('Email:', `mailto:${data.customerEmail}`, data.customerEmail, '140px')}
        </table>

        <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: 600;">Modification Details</h2>

        <div style="background-color: #f0fdf4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <table role="presentation" style="width: 100%;">
            ${data.orderId ? tableRow('Order ID:', data.orderId, { labelWidth: '160px' }) : ''}
            ${data.uploadToken ? tableRow('Booking ID:', data.uploadToken, { labelWidth: '160px' }) : ''}
            ${tableRow('Vehicle:', data.vehicleName, { labelWidth: '160px' })}
            ${tableRow('Previous dates:', `${data.oldStartDate} – ${data.oldEndDate}`, { labelWidth: '160px' })}
            ${tableRow('New dates:', `${data.newStartDate} – ${data.newEndDate}`, { labelWidth: '160px' })}
            ${tableRow('Old total:', formatPrice(data.oldTotalPrice), { labelWidth: '160px' })}
            ${totalRow('New Total:', formatPrice(data.newTotalPrice), '#0f766e', '#bbf7d0')}
            ${(data.refundAmount ?? 0) > 0 ? totalRow(`Refund (${data.refundPercentage}%):`, formatPrice(data.refundAmount!), '#dc2626', '#fecaca') : ''}
          </table>
        </div>
      </td>
    </tr>
    ${emailFooter({ buttonText: 'View in Admin Panel', buttonHref: 'https://arctictrail.no/admin/bookings', buttonColor: '#0f766e' })}
  `;

  const pdfBuffer = await (async () => {
    try {
      const { generateAdminModificationPdf } = await import('./pdf');
      return await generateAdminModificationPdf({
        bookingId: data.bookingId,
        uploadToken: data.uploadToken,
        orderId: data.orderId,
        customerName: data.customerName,
        vehicleName: data.vehicleName,
        oldStartDate: data.oldStartDate,
        oldEndDate: data.oldEndDate,
        newStartDate: data.newStartDate,
        newEndDate: data.newEndDate,
        oldTotalPrice: data.oldTotalPrice,
        newTotalPrice: data.newTotalPrice,
        priceDiff: data.priceDiff,
        refundAmount: data.refundAmount,
        refundPercentage: data.refundPercentage,
        oldInsuranceType: data.oldInsuranceType,
        newInsuranceType: data.newInsuranceType,
        oldSelectedExtras: data.oldSelectedExtras,
        newSelectedExtras: data.newSelectedExtras,
      });
    } catch (err) {
      console.error('Failed to generate admin modification PDF:', err);
      return null;
    }
  })();

  return sendEmail(
    ADMIN_EMAILS,
    'Arctic Trail <hello@northventure-demo.com>',
    `Booking Modified – ${data.vehicleName} (#${data.bookingId})`,
    emailWrapper('Booking Modified', content),
    pdfBuffer ? [{ filename: 'booking-modified.pdf', content: pdfBuffer }] : undefined
  );
};

export const sendContractEmail = async (
  to: string,
  booking: ContractBooking,
  drivers: ContractDriver[]
): Promise<{ success: boolean; error?: unknown }> => {
  const { generateContractHTML } = await import('@/lib/contract');
  const html = generateContractHTML(booking, drivers);

  const pdfBuffer = await (async () => {
    try {
      const { generateContractPdf } = await import('./pdf');
      return await generateContractPdf(booking, drivers);
    } catch (err) {
      console.error('Failed to generate contract PDF:', err);
      return null;
    }
  })();

  const contractRef = booking.order_id ?? `#${booking.id}`;
  return sendEmail(
    to,
    'Arctic Trail <hello@northventure-demo.com>',
    `Rental Agreement – ${booking.first_name} ${booking.last_name} (${contractRef})`,
    html,
    pdfBuffer ? [{ filename: `rental-agreement-${contractRef}.pdf`, content: pdfBuffer }] : undefined
  );
};
