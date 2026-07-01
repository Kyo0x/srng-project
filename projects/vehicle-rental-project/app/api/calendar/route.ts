import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { ALL_EXTRAS } from '@/lib/constants';

function toICalDate(dateStr: string): string {
  return dateStr.replace(/-/g, '').slice(0, 8);
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// RFC 5545 §3.1 — fold lines longer than 75 characters
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let remaining = line;
  let isFirst = true;
  while (remaining.length > 0) {
    const limit = isFirst ? 75 : 74;
    chunks.push(remaining.slice(0, limit));
    remaining = remaining.slice(limit);
    isFirst = false;
  }
  return chunks.join('\r\n ');
}

function formatNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function formatInsurance(type: string): string {
  const labels: Record<string, string> = {
    basic: 'Basic',
    premium: 'Premium (+200 kr/day)',
    premium_plus: 'Premium+ (+400 kr/day)',
  };
  return labels[type] || type;
}

function formatExtras(selectedExtras: Record<string, number>): string {
  const lines: string[] = [];
  for (const [id, qty] of Object.entries(selectedExtras)) {
    if (qty <= 0) continue;
    const extra = ALL_EXTRAS.find((e) => e.id === id);
    const name = extra?.name || id;
    lines.push(qty > 1 ? `${name} x${qty}` : name);
  }
  return lines.length > 0 ? lines.join(', ') : 'None';
}

function numberOfDays(start: string, end: string): number {
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  );
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const secret = process.env.CALENDAR_SECRET;

  if (!secret || token !== secret) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Try full query first; fall back without pickup_time if column not yet migrated
    let result;
    try {
      result = await query(`
        SELECT b.id, b.order_id, b.upload_token,
               b.start_date, b.end_date,
               b.first_name, b.last_name, b.email, b.phone,
               b.insurance_type, b.selected_extras,
               b.baby_seats_quantity, b.extra_driver,
               b.total_price, b.status, b.created_at,
               v.name as vehicle_name,
               b.pickup_time
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.status != 'cancelled'
        ORDER BY b.start_date ASC
      `);
    } catch {
      result = await query(`
        SELECT b.id, b.order_id, b.upload_token,
               b.start_date, b.end_date,
               b.first_name, b.last_name, b.email, b.phone,
               b.insurance_type, b.selected_extras,
               b.baby_seats_quantity, b.extra_driver,
               b.total_price, b.status, b.created_at,
               v.name as vehicle_name,
               NULL as pickup_time
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.status != 'cancelled'
        ORDER BY b.start_date ASC
      `);
    }

    const now = formatNow();
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NorthVenture//Bookings//EN',
      'X-WR-CALNAME:NorthVenture Bookings',
      'X-WR-TIMEZONE:Europe/Oslo',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
      'X-PUBLISHED-TTL:PT1H',
    ];

    for (const b of result.rows) {
      // pg returns DATE columns as JS Date objects — normalise to ISO strings
      const startDateStr = new Date(b.start_date).toISOString().slice(0, 10);
      const endDateBase = new Date(b.end_date).toISOString().slice(0, 10);

      // DTEND is exclusive for all-day events — add 1 day
      const endDateExcl = new Date(b.end_date);
      endDateExcl.setUTCDate(endDateExcl.getUTCDate() + 1);
      const endDateStr = endDateExcl.toISOString().slice(0, 10);

      const days = numberOfDays(startDateStr, endDateBase);

      const totalFormatted = parseFloat(b.total_price).toLocaleString('nb-NO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      let selectedExtras: Record<string, number> = {};
      try {
        if (typeof b.selected_extras === 'string') {
          selectedExtras = JSON.parse(b.selected_extras);
        } else if (b.selected_extras && typeof b.selected_extras === 'object') {
          selectedExtras = b.selected_extras;
        }
      } catch { /* ignore */ }

      const descLines = [
        `📋 Booking ref: ${b.order_id || '#' + b.id}`,
        ``,
        `👤 Customer`,
        `   Name:    ${b.first_name} ${b.last_name}`,
        `   Email:   ${b.email}`,
        `   Phone:   ${b.phone || '—'}`,
        ``,
        `🚐 Vehicle`,
        `   ${b.vehicle_name}`,
        ``,
        `📅 Dates`,
        `   Pickup:  ${startDateStr}${b.pickup_time ? ' at ' + b.pickup_time : ''}`,
        `   Return:  ${endDateBase}`,
        `   Days:    ${days}`,
        ``,
        `🛡 Insurance`,
        `   ${formatInsurance(b.insurance_type)}`,
        ``,
        `🎒 Extras`,
        `   ${formatExtras(selectedExtras)}`,
        ...(b.baby_seats_quantity > 0 ? [`   Baby seats: ${b.baby_seats_quantity}x`] : []),
        ...(b.extra_driver ? [`   Extra driver: Yes`] : []),
        ``,
        `💰 Total: ${totalFormatted} kr`,
        `📌 Status: ${b.status}`,
        `🔑 Booking ID: ${b.upload_token || b.id}`,
      ];

      const summary = escapeICalText(
        `${b.first_name} ${b.last_name} — ${b.vehicle_name}${b.pickup_time ? ' (' + b.pickup_time + ')' : ''}`
      );

      const description = escapeICalText(descLines.join('\n'));

      lines.push(
        'BEGIN:VEVENT',
        foldLine(`UID:booking-${b.id}@arctictrail.no`),
        foldLine(`DTSTAMP:${now}`),
        foldLine(`DTSTART;VALUE=DATE:${toICalDate(startDateStr)}`),
        foldLine(`DTEND;VALUE=DATE:${toICalDate(endDateStr)}`),
        foldLine(`SUMMARY:${summary}`),
        foldLine(`DESCRIPTION:${description}`),
        `LOCATION:Ropnesvegen 43\\, 9107 Kvaløya\\, Norway`,
        `STATUS:CONFIRMED`,
        'END:VEVENT'
      );
    }

    lines.push('END:VCALENDAR');

    const ical = lines.join('\r\n');

    return new Response(ical, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="arctictrail-bookings.ics"',
        'Cache-Control': 'public, max-age=900, s-maxage=900',
      },
    });
  } catch (error) {
    console.error('Calendar feed error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(`Error: ${msg}`, { status: 500 });
  }
}
