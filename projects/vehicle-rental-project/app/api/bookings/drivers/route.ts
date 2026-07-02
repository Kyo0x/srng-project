import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { validateBody, bookingDriversSchema } from '@/lib/validation';
import { BOOKING_STATUS } from '@/lib/constants';
import { auth } from '@/auth';
import { sendContractEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const validation = await validateBody(request, bookingDriversSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { uploadToken, drivers, consentGiven } = validation.data;

    // Look up booking by upload_token (works for both admin and customer flows)
    const bookingResult = await query(
      `SELECT id, status, extra_driver FROM bookings WHERE upload_token = $1`,
      [uploadToken]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    if (booking.status !== BOOKING_STATUS.PENDING_DETAILS && booking.status !== BOOKING_STATUS.COMPLETED) {
      return NextResponse.json(
        { error: 'Driver details have already been submitted for this booking' },
        { status: 400 }
      );
    }

    const existingDrivers = await query(
      'SELECT id FROM booking_drivers WHERE booking_id = $1',
      [booking.id]
    );

    if (existingDrivers.rows.length > 0) {
      return NextResponse.json(
        { error: 'Driver details have already been submitted' },
        { status: 400 }
      );
    }

    await transaction(async (client) => {
      for (const driver of drivers) {
        await client.query(
          `INSERT INTO booking_drivers
           (booking_id, is_primary, full_name, date_of_birth, license_number, license_expiry,
            license_country, address_line1, address_line2, city, postal_code, country,
            license_photo_front, license_photo_back)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            booking.id,
            driver.is_primary,
            driver.full_name,
            driver.date_of_birth,
            driver.license_number,
            driver.license_expiry,
            driver.license_country,
            driver.address_line1,
            driver.address_line2 || null,
            driver.city,
            driver.postal_code,
            driver.country,
            driver.license_photo_front || null,
            driver.license_photo_back || null,
          ]
        );
      }

      await client.query(
        `UPDATE bookings SET status = $1, consent_given_at = $2 WHERE id = $3`,
        [BOOKING_STATUS.COMPLETED, consentGiven ? new Date().toISOString() : null, booking.id]
      );
    });

    try {
      const [settingResult, fullBookingResult] = await Promise.all([
        query(`SELECT value FROM admin_settings WHERE key = 'contract_email'`),
        query(
          `SELECT b.*, v.name as vehicle_name, v.license_plate as vehicle_license_plate
           FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.id = $1`,
          [booking.id]
        ),
      ]);

      const contractEmail = settingResult.rows[0]?.value;
      if (contractEmail && fullBookingResult.rows.length > 0) {
        await sendContractEmail(contractEmail, fullBookingResult.rows[0], drivers);
      }
    } catch (err) {
      console.error('Failed to send contract email:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'Driver details saved successfully',
    });
  } catch (error) {
    console.error('Error saving driver details:', error);
    return NextResponse.json(
      { error: 'Failed to save driver details' },
      { status: 500 }
    );
  }
}

// Protected: Only authenticated admins can view driver details
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('bookingId');

  if (!bookingId) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }

  try {
    const result = await query(
      'SELECT * FROM booking_drivers WHERE booking_id = $1 ORDER BY is_primary DESC',
      [bookingId]
    );

    return NextResponse.json({ drivers: result.rows });
  } catch (error) {
    console.error('Error fetching driver details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver details' },
      { status: 500 }
    );
  }
}
