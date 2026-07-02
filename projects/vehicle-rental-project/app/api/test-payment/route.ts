import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CURRENCY, toStripeAmount, calculateTotalBookingPrice } from '@/lib/constants';
import { getEnv } from '@/lib/env';

/**
 * Test endpoint to trigger webhook events using Stripe CLI
 * This bypasses the hosted checkout page and directly creates a payment intent
 * Use this to test the webhook flow locally
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(getEnv.stripe.secretKey());
    const body = await request.json();
    const {
      vehicleId,
      vehicleName,
      pricePerDay,
      startDate,
      endDate,
      babySeatsQuantity = 0,
      extraDriver = false,
      insuranceType = 'basic',
      contactEmail = 'test@example.com',
    } = body;

    const numberOfDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Use centralized price calculation
    const { totalPrice } = calculateTotalBookingPrice(
      pricePerDay,
      numberOfDays,
      babySeatsQuantity,
      extraDriver,
      insuranceType
    );

    // This allows us to use test webhooks more easily
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toStripeAmount(totalPrice),
      currency: CURRENCY.CODE,
      payment_method_types: ['card'],
      receipt_email: contactEmail,
      metadata: {
        vehicleId,
        vehicleName,
        startDate,
        endDate,
        babySeatsQuantity: babySeatsQuantity.toString(),
        extraDriver: extraDriver.toString(),
        insuranceType,
      },
      description: `NorthVenture Rental: ${vehicleName} (${startDate} to ${endDate})`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalPrice,
      message: 'Test mode: Use Stripe CLI to trigger webhook events',
    });
  } catch (error) {
    console.error('Test payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create test payment' },
      { status: 500 }
    );
  }
}
