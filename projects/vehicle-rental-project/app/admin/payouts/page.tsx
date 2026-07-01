'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Skeleton } from '@/components/Skeleton';

interface BookingRef {
  orderId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

interface TransactionRow {
  id: string;
  type: 'charge' | 'refund' | 'other';
  amount: number;
  fee: number;
  net: number;
  created: string;
  description: string | null;
  booking: BookingRef | null;
  noBookingReason: string | null;
}

interface PayoutSummary {
  id: string;
  date: string;
  amount: number;
  status: string;

  description: string | null;
}

interface BalanceSummary {
  available: number;
  pending: number;
}

const STATUS_CLASSES: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  in_transit: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  canceled: 'bg-red-100 text-red-800',
};

const TYPE_CLASSES: Record<string, string> = {
  charge: 'bg-blue-50 text-blue-700',
  refund: 'bg-red-50 text-red-600',
  other: 'bg-gray-100 text-gray-500',
};

const NO_BOOKING_LABELS: Record<string, string> = {
  stripe_internal: 'Stripe fee / adjustment',
  no_payment_intent: 'No payment intent',
  no_checkout_session: 'No checkout session',
  booking_not_found: 'No matching booking',
};

function TransactionTable({ rows }: { rows: TransactionRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No transactions</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-100">
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">Type</th>
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Customer</th>
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">Order ID</th>
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">Rental dates</th>
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right whitespace-nowrap">Gross</th>
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right whitespace-nowrap">Fee</th>
            <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right whitespace-nowrap">Net</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map(row => (
            <tr key={row.id} className="group">
              <td className="py-3 pr-4 whitespace-nowrap">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${TYPE_CLASSES[row.type] ?? TYPE_CLASSES.other}`}>
                  {row.type}
                </span>
              </td>
              <td className="py-3 pr-4 text-gray-700">
                {row.booking ? row.booking.customerName : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">
                {row.booking ? (
                  <Link
                    href={`/admin/bookings?search=${encodeURIComponent(row.booking.orderId)}`}
                    className="font-mono text-xs text-primary-600 hover:underline"
                  >
                    {row.booking.orderId} →
                  </Link>
                ) : (
                  <span className="text-xs text-gray-300">
                    {row.noBookingReason ? NO_BOOKING_LABELS[row.noBookingReason] ?? '—' : '—'}
                  </span>
                )}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap text-gray-500 text-xs">
                {row.booking
                  ? `${formatDate(row.booking.startDate)} – ${formatDate(row.booking.endDate)}`
                  : <span className="text-gray-300">—</span>
                }
              </td>
              <td className="py-3 pr-4 text-right whitespace-nowrap text-gray-700">
                {row.type !== 'other' ? formatCurrency(Math.abs(row.amount)) : <span className="text-gray-300">—</span>}
              </td>
              <td className="py-3 pr-4 text-right whitespace-nowrap text-gray-400 text-xs">
                {row.type !== 'other' ? `-${formatCurrency(row.fee)}` : <span className="text-gray-300">—</span>}
              </td>
              <td className={`py-3 text-right font-medium whitespace-nowrap ${row.net < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatCurrency(row.net)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TxSkeleton() {
  return (
    <div className="space-y-2 py-4">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function PayoutsPage() {
  const router = useRouter();
  const { status } = useSession();

  const [balance, setBalance] = useState<BalanceSummary | null>(null);
  const [payouts, setPayouts] = useState<PayoutSummary[]>([]);
  const [awaitingPayout, setAwaitingPayout] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Record<string, TransactionRow[]>>({});
  const [txLoading, setTxLoading] = useState<string | null>(null);
  const [txError, setTxError] = useState<Record<string, string>>({});

  const [awaitingExpanded, setAwaitingExpanded] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  const fetchPayouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/payouts');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load payouts');
      setBalance(data.balance);
      setPayouts(data.payouts);
      setAwaitingPayout(data.awaitingPayout);
      if (data.awaitingPayout?.length > 0) setAwaitingExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchPayouts();
  }, [status]);

  const printAllPayouts = () => {
    const awaitingTotal = awaitingPayout.reduce((sum, r) => sum + r.net, 0);
    const awaitingFee   = awaitingPayout.reduce((sum, r) => sum + r.fee, 0);
    const awaitingGross = awaitingPayout.reduce((sum, r) => sum + Math.abs(r.amount), 0);

    const balanceHtml = balance ? `
      <div class="meta">
        <div class="meta-item"><label>Available</label><span>${formatCurrency(balance.available)}</span></div>
        <div class="meta-item"><label>Pending</label><span>${formatCurrency(balance.pending)}</span></div>
        <div class="meta-item"><label>Total in Stripe</label><span>${formatCurrency(balance.available + balance.pending)}</span></div>
      </div>` : '';

    const awaitingHtml = awaitingPayout.length > 0 ? `
      <h2>Awaiting payout <span class="count">${awaitingPayout.length} transaction${awaitingPayout.length !== 1 ? 's' : ''}</span></h2>
      <table>
        <thead><tr>
          <th>Customer</th><th>Order ID</th><th>Rental dates</th>
          <th class="text-right">Gross</th><th class="text-right">Fee</th><th class="text-right">Net</th>
        </tr></thead>
        <tbody>
          ${awaitingPayout.map(r => `<tr>
            <td>${r.booking?.customerName ?? '<span class="muted">—</span>'}</td>
            <td>${r.booking?.orderId ?? '<span class="muted">—</span>'}</td>
            <td>${r.booking ? `${formatDate(r.booking.startDate)} – ${formatDate(r.booking.endDate)}` : '<span class="muted">—</span>'}</td>
            <td class="text-right">${formatCurrency(Math.abs(r.amount))}</td>
            <td class="text-right muted">-${formatCurrency(r.fee)}</td>
            <td class="text-right">${formatCurrency(r.net)}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot><tr>
          <td colspan="3">Total</td>
          <td class="text-right">${formatCurrency(awaitingGross)}</td>
          <td class="text-right muted">-${formatCurrency(awaitingFee)}</td>
          <td class="text-right">${formatCurrency(awaitingTotal)}</td>
        </tr></tfoot>
      </table>` : '';

    const payoutsHtml = `
      <h2>Payouts — deposited to bank</h2>
      <table>
        <thead><tr>
          <th>Date</th><th>Payout ID</th><th>Status</th><th class="text-right">Amount</th>
        </tr></thead>
        <tbody>
          ${payouts.map(p => `<tr>
            <td>${formatDate(p.date)}</td>
            <td style="font-family:monospace;font-size:11px">${p.id}</td>
            <td>${p.status.replace('_', ' ')}</td>
            <td class="text-right">${formatCurrency(p.amount)}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot><tr>
          <td colspan="3">Total (${payouts.length} payout${payouts.length !== 1 ? 's' : ''})</td>
          <td class="text-right">${formatCurrency(payouts.reduce((s, p) => s + p.amount, 0))}</td>
        </tr></tfoot>
      </table>`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payouts Overview</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:40px;color:#111827;font-size:13px}
    h1{font-size:18px;font-weight:700;margin-bottom:4px}
    h2{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:32px 0 12px}
    .count{font-weight:400;color:#9ca3af;margin-left:6px;text-transform:none;letter-spacing:0}
    .subtitle{color:#6b7280;font-size:12px;margin-bottom:24px}
    .meta{display:flex;gap:32px;margin-bottom:0;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb}
    .meta-item label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;margin-bottom:2px}
    .meta-item span{font-size:14px;font-weight:600;color:#111827}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:8px 12px;background:#f9fafb;border-bottom:2px solid #e5e7eb;font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280}
    th.text-right,td.text-right{text-align:right}
    td{padding:9px 12px;border-bottom:1px solid #f3f4f6;color:#374151}
    tfoot td{padding:10px 12px;background:#f9fafb;border-top:2px solid #e5e7eb;font-weight:600;color:#111827}
    .muted{color:#9ca3af}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <h1>NorthVenture — Payouts Overview</h1>
  <p class="subtitle">Generated ${new Date().toLocaleDateString('nb-NO')}</p>
  ${balanceHtml}
  ${awaitingHtml}
  ${payoutsHtml}
</body>
</html>`;

    const win = window.open('', '_blank', 'width=960,height=700');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const printPayout = async (payout: PayoutSummary) => {
    let rows = transactions[payout.id];
    if (!rows) {
      try {
        const res = await fetch(`/api/admin/payouts/${payout.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        rows = data.transactions;
        setTransactions(prev => ({ ...prev, [payout.id]: rows }));
      } catch {
        alert('Failed to load transactions for printing');
        return;
      }
    }

    const payRows    = rows.filter(r => r.type !== 'other');
    const totalGross = payRows.reduce((sum, r) => sum + Math.abs(r.amount), 0);
    const totalFee   = payRows.reduce((sum, r) => sum + r.fee, 0);
    const totalNet   = payRows.reduce((sum, r) => sum + r.net, 0);

    const rowsHtml = rows.map(r => `
      <tr>
        <td><span class="badge badge-${r.type}">${r.type}</span></td>
        <td>${r.booking?.customerName ?? '<span class="muted">—</span>'}</td>
        <td>${r.booking?.orderId ?? `<span class="muted">${r.noBookingReason ? (NO_BOOKING_LABELS[r.noBookingReason] ?? '—') : '—'}</span>`}</td>
        <td>${r.booking ? `${formatDate(r.booking.startDate)} – ${formatDate(r.booking.endDate)}` : '<span class="muted">—</span>'}</td>
        <td class="text-right">${formatCurrency(Math.abs(r.amount))}</td>
        <td class="text-right muted">-${formatCurrency(r.fee)}</td>
        <td class="text-right ${r.net < 0 ? 'neg' : ''}">${formatCurrency(r.net)}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payout ${formatDate(payout.date)}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:40px;color:#111827;font-size:13px}
    h1{font-size:18px;font-weight:700;margin-bottom:4px}
    .subtitle{color:#6b7280;font-size:12px;margin-bottom:24px}
    .meta{display:flex;gap:32px;margin-bottom:32px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb}
    .meta-item label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;margin-bottom:2px}
    .meta-item span{font-size:14px;font-weight:600;color:#111827}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:8px 12px;background:#f9fafb;border-bottom:2px solid #e5e7eb;font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280}
    th.text-right,td.text-right{text-align:right}
    td{padding:9px 12px;border-bottom:1px solid #f3f4f6;color:#374151}
    tfoot td{padding:10px 12px;background:#f9fafb;border-top:2px solid #e5e7eb;font-weight:600;color:#111827}
    .badge{display:inline-block;padding:1px 7px;border-radius:4px;font-size:10px;font-weight:500}
    .badge-charge{background:#eff6ff;color:#1d4ed8}
    .badge-refund{background:#fef2f2;color:#dc2626}
    .badge-other{background:#f3f4f6;color:#6b7280}
    .neg{color:#dc2626}
    .muted{color:#9ca3af}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <h1>NorthVenture — Payout Statement</h1>
  <p class="subtitle">Generated ${new Date().toLocaleDateString('nb-NO')}</p>
  <div class="meta">
    <div class="meta-item"><label>Date</label><span>${formatDate(payout.date)}</span></div>
    <div class="meta-item"><label>Amount</label><span>${formatCurrency(payout.amount)}</span></div>
    <div class="meta-item"><label>Status</label><span>${payout.status.replace('_', ' ')}</span></div>
    <div class="meta-item"><label>Payout ID</label><span style="font-family:monospace;font-size:12px">${payout.id}</span></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Type</th><th>Customer</th><th>Order ID</th><th>Rental dates</th>
        <th class="text-right">Gross</th><th class="text-right">Fee</th><th class="text-right">Net</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
    <tfoot>
      <tr>
        <td colspan="4">Total — ${payRows.length} transaction${payRows.length !== 1 ? 's' : ''}</td>
        <td class="text-right">${formatCurrency(totalGross)}</td>
        <td class="text-right muted">-${formatCurrency(totalFee)}</td>
        <td class="text-right ${totalNet < 0 ? 'neg' : ''}">${formatCurrency(totalNet)}</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=960,height=700');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const togglePayout = async (payoutId: string) => {
    if (expandedId === payoutId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(payoutId);
    if (transactions[payoutId]) return;

    setTxLoading(payoutId);
    try {
      const res = await fetch(`/api/admin/payouts/${payoutId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load transactions');
      setTransactions(prev => ({ ...prev, [payoutId]: data.transactions }));
    } catch (err) {
      setTxError(prev => ({
        ...prev,
        [payoutId]: err instanceof Error ? err.message : 'Failed to load',
      }));
    } finally {
      setTxLoading(null);
    }
  };

  if (status === 'loading' || status === 'unauthenticated') return null;

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4 inline-flex items-center gap-1"
          >
            ← Dashboard
          </button>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
              <p className="text-sm text-gray-400 mt-1">Reconcile Stripe payouts with bookings</p>
            </div>
            {!loading && payouts.length > 0 && (
              <button
                onClick={printAllPayouts}
                className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-4 py-2 transition-colors hover:border-gray-300"
              >
                Print overview
              </button>
            )}
          </div>
        </div>

        {error && <ErrorDisplay error={error} onRetry={fetchPayouts} />}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Balance card */}
            {balance && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                  Current Stripe balance
                </p>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Available</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(balance.available)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Ready to be paid out</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Pending</p>
                    <p className="text-xl font-bold text-gray-500">{formatCurrency(balance.pending)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Still settling</p>
                  </div>
                  <div className="border-l border-gray-100 pl-8">
                    <p className="text-xs text-gray-400 mb-1">Total in Stripe</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(balance.available + balance.pending)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Not yet deposited to bank</p>
                  </div>
                </div>
              </div>
            )}

            {/* Awaiting payout */}
            {awaitingPayout.length > 0 && (
              <div className="bg-white rounded-xl border border-amber-200 mb-6 overflow-hidden">
                <button
                  onClick={() => setAwaitingExpanded(v => !v)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                    <span className="font-semibold text-gray-900">Awaiting payout</span>
                    <span className="text-xs text-gray-400">— received in last 7 days, not yet deposited</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(awaitingPayout.reduce((sum, t) => sum + t.net, 0))}
                    </span>
                    <span className="text-gray-400 text-sm">{awaitingExpanded ? '▾' : '▸'}</span>
                  </div>
                </button>
                {awaitingExpanded && (
                  <div className="px-6 pb-6 border-t border-amber-100">
                    <div className="pt-4">
                      <TransactionTable rows={awaitingPayout} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payouts accordion */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Payouts — deposited to bank
            </p>

            {payouts.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">No payouts found.</div>
            ) : (
              <div className="space-y-2">
                {payouts.map(payout => (
                  <div key={payout.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div
                      onClick={() => togglePayout(payout.id)}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Date</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(payout.date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Amount</p>
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(payout.amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Status</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_CLASSES[payout.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {payout.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => printPayout(payout)}
                          className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors hover:border-gray-300"
                        >
                          Print
                        </button>
                        <span className="text-gray-400 text-sm">{expandedId === payout.id ? '▾' : '▸'}</span>
                      </div>
                    </div>

                    {expandedId === payout.id && (
                      <div className="px-6 pb-6 border-t border-gray-50">
                        {txLoading === payout.id ? (
                          <TxSkeleton />
                        ) : txError[payout.id] ? (
                          <div className="py-4 flex items-center gap-3">
                            <p className="text-sm text-red-500">{txError[payout.id]}</p>
                            <button
                              onClick={() => {
                                setTxError(prev => { const n = { ...prev }; delete n[payout.id]; return n; });
                                setTransactions(prev => { const n = { ...prev }; delete n[payout.id]; return n; });
                                togglePayout(payout.id);
                              }}
                              className="text-sm text-primary-600 hover:underline"
                            >
                              Retry
                            </button>
                          </div>
                        ) : transactions[payout.id] ? (
                          <div className="pt-4">
                            <TransactionTable rows={transactions[payout.id]} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
