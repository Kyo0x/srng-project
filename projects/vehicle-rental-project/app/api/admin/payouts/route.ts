import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { ADMIN_EMAILS } from '@/lib/constants';
import { getEnv } from '@/lib/env';

export const maxDuration = 30;

async function reconcileTransactions(stripe: Stripe, transactions: Stripe.BalanceTransaction[]) {
  const piMap = new Map<string, string>();

  for (const txn of transactions) {
    const source = txn.source;
    if (!source || typeof source === 'string') continue;

    let piId: string | null = null;
    if (txn.type === 'charge') {
      const charge = source as Stripe.Charge;
      piId = typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : (charge.payment_intent as Stripe.PaymentIntent)?.id ?? null;
    } else if (txn.type === 'refund') {
      const refund = source as Stripe.Refund;
      piId = typeof refund.payment_intent === 'string'
        ? refund.payment_intent
        : (refund.payment_intent as Stripe.PaymentIntent)?.id ?? null;
    }

    if (piId) piMap.set(txn.id, piId);
  }

  const uniquePiIds = [...new Set(piMap.values())];

  const sessionResults = await Promise.all(
    uniquePiIds.map(async (piId) => {
      try {
        const sessions = await stripe.checkout.sessions.list({ payment_intent: piId, limit: 1 });
        return { piId, sessionId: sessions.data[0]?.id ?? null };
      } catch {
        return { piId, sessionId: null };
      }
    })
  );

  const piToSession = new Map(sessionResults.map(r => [r.piId, r.sessionId]));

  const sessionIds = sessionResults.map(r => r.sessionId).filter((id): id is string => id !== null);

  const sessionToBooking = new Map<string, any>();
  if (sessionIds.length > 0) {
    const result = await query(
      `SELECT order_id, first_name, last_name, start_date, end_date, total_price, status, stripe_session_id
       FROM bookings WHERE stripe_session_id = ANY($1::text[])`,
      [sessionIds]
    );
    for (const row of result.rows) {
      sessionToBooking.set(row.stripe_session_id, row);
    }
  }

  return transactions.map(txn => {
    const isCharge = txn.type === 'charge';
    const isRefund = txn.type === 'refund';
    const isKnown = isCharge || isRefund;

    let booking = null;
    let noBookingReason: string | null = null;

    if (isKnown) {
      const piId = piMap.get(txn.id);
      if (!piId) {
        noBookingReason = 'no_payment_intent';
      } else {
        const sessionId = piToSession.get(piId);
        if (!sessionId) {
          noBookingReason = 'no_checkout_session';
        } else {
          const b = sessionToBooking.get(sessionId);
          if (!b) {
            noBookingReason = 'booking_not_found';
          } else {
            booking = {
              orderId: b.order_id,
              customerName: `${b.first_name} ${b.last_name}`,
              startDate: b.start_date,
              endDate: b.end_date,
              totalPrice: parseFloat(b.total_price),
              status: b.status,
            };
          }
        }
      }
    } else {
      noBookingReason = 'stripe_internal';
    }

    return {
      id: txn.id,
      type: isCharge ? 'charge' : isRefund ? 'refund' : 'other',
      amount: txn.amount / 100,
      fee: txn.fee / 100,
      net: txn.net / 100,
      created: new Date(txn.created * 1000).toISOString(),
      description: txn.description,
      booking,
      noBookingReason,
    };
  });
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stripe = new Stripe(getEnv.stripe.secretKey());

    const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

    const [balance, payoutsResult, awaitingTxnsResult] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.payouts.list({ limit: 30 }),
      stripe.balanceTransactions.list({
        type: 'charge',
        created: { gte: sevenDaysAgo },
        limit: 100,
        expand: ['data.source'],
      }),
    ]);

    const availableNok = balance.available.find(b => b.currency === 'nok')?.amount ?? 0;
    const pendingNok = balance.pending.find(b => b.currency === 'nok')?.amount ?? 0;

    const payouts = payoutsResult.data.map(p => ({
      id: p.id,
      date: new Date(p.arrival_date * 1000).toISOString(),
      amount: p.amount / 100,
      status: p.status,
      description: p.description,
    }));

    const awaitingPayout = await reconcileTransactions(stripe, awaitingTxnsResult.data);

    return NextResponse.json({
      balance: {
        available: availableNok / 100,
        pending: pendingNok / 100,
      },
      payouts,
      awaitingPayout,
    });
  } catch (error) {
    console.error('Payouts list error:', error);
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
  }
}
