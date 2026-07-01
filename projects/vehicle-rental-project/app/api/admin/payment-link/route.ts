import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { ADMIN_EMAILS, CURRENCY, toStripeAmount } from '@/lib/constants';
import { getEnv } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vehicle_id, start_date, end_date, first_name, last_name, email, phone, total_price } = body;

    if (!vehicle_id || !start_date || !end_date || !first_name || !last_name || !email || total_price === undefined || total_price === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    if (endDateObj <= startDateObj) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    const vehicleResult = await query('SELECT id, name FROM vehicles WHERE id = $1', [vehicle_id]);
    if (vehicleResult.rows.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    const vehicle = vehicleResult.rows[0];

    const overlapResult = await query(
      `SELECT id FROM bookings
       WHERE vehicle_id = $1
       AND status != 'cancelled'
       AND daterange(start_date, end_date, '[]') && daterange($2::date, $3::date, '[]')`,
      [vehicle_id, start_date, end_date]
    );
    if (overlapResult.rows.length > 0) {
      return NextResponse.json({ error: 'Vehicle is already booked for the selected dates' }, { status: 409 });
    }

    const stripe = new Stripe(getEnv.stripe.secretKey());

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CURRENCY.CODE,
            product_data: {
              name: `${vehicle.name} Rental (${start_date} to ${end_date})`,
            },
            unit_amount: toStripeAmount(total_price),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${getEnv.app.url()}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getEnv.app.url()}/`,
      metadata: {
        vehicleId: String(vehicle_id),
        vehicleName: vehicle.name,
        startDate: start_date,
        endDate: end_date,
        firstName: first_name,
        lastName: last_name,
        phone: phone || '',
        contactEmail: email,
        babySeatsQuantity: '0',
        extraDriver: 'false',
        insuranceType: 'basic',
        selectedExtras: '{}',
        pickupTime: '',
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: unknown) {
    console.error('Admin payment link error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate payment link' },
      { status: 500 }
    );
  }
}
