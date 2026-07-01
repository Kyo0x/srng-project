'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { REFUND_POLICY, ROUTES, SelectedExtras } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { ExtrasSelector } from '@/components/ExtrasSelector';
import { InsuranceType } from '@/lib/types';

interface BookingInfo {
  id: number;
  vehicle_id: number;
  vehicle_name: string;
  vehicle_image: string;
  price_per_day: number;
  first_name: string;
  last_name: string;
  email: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  stripe_session_id: string;
  insurance_type: string;
  selected_extras: Record<string, number>;
  extra_driver: boolean;
  baby_seats_quantity: number;
}

interface RefundInfo {
  daysUntilStart: number;
  refundPercentage: number;
  refundAmount: number;
  withinFreeCancellation: boolean;
}

type Step = 'lookup' | 'choose' | 'modify' | 'add-extras' | 'cancel' | 'success';
type SuccessType = 'modified' | 'extras' | 'cancelled';

export default function ModifyBookingPage() {
  return (
    <Suspense>
      <ModifyBookingContent />
    </Suspense>
  );
}

function ModifyBookingContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('lookup');
  const [token, setToken] = useState('');
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [refund, setRefund] = useState<RefundInfo | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successType, setSuccessType] = useState<SuccessType>('modified');

  // Extras modification state
  const [liveExtras, setLiveExtras] = useState<{ insuranceType: InsuranceType; selectedExtras: SelectedExtras } | null>(null);
  const [extrasPreview, setExtrasPreview] = useState<{
    priceDiff: number;
    newTotalPrice: number;
    refundAmount?: number;
    refundPercentage?: number;
    action: 'payment_required' | 'refund' | 'same';
    checking: boolean;
  } | null>(null);
  const [extrasLoading, setExtrasLoading] = useState(false);

  const handleExtrasChange = useCallback((data: { insuranceType: InsuranceType; selectedExtras: SelectedExtras }) => {
    setLiveExtras(data);
    setExtrasPreview(null);
    setError('');
  }, []);

  // Date modification state
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [pricePreview, setPricePreview] = useState<{
    newTotalPrice: number;
    priceDiff: number;
    refundAmount?: number;
    refundPercentage?: number;
    action: 'payment_required' | 'refund' | 'same';
    checking: boolean;
  } | null>(null);
  const [modifyResult, setModifyResult] = useState<{
    newStartDate: string;
    newEndDate: string;
    newTotalPrice: number;
    refund: { amount: number; percentage: number } | null;
  } | null>(null);

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) setToken(urlToken);

    // If redirected back from Stripe after successful modification payment
    const modified = searchParams.get('modified');
    if (modified === '1' && urlToken) {
      handleAutoLookupAfterPayment(urlToken);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleAutoLookupAfterPayment = async (urlToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(ROUTES.API_LOOKUP_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadToken: urlToken, action: 'modify' }),
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data.booking);
        setRefund(data.refund);
        setSuccessType('modified');
        setModifyResult({
          newStartDate: data.booking.start_date,
          newEndDate: data.booking.end_date,
          newTotalPrice: data.booking.total_price,
          refund: null,
        });
        setStep('success');
      }
    } catch {
      // Silently fail — user can enter token manually
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(ROUTES.API_LOOKUP_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadToken: token.trim(), action: 'modify' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to find booking');

      setBooking(data.booking);
      setRefund(data.refund);
      setNewStartDate(data.booking.start_date.split('T')[0]);
      setNewEndDate(data.booking.end_date.split('T')[0]);
      setStep('choose');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkPriceDiff = async () => {
    if (!booking || !newStartDate || !newEndDate) return;
    setPricePreview((prev) => ({ ...(prev ?? { newTotalPrice: 0, priceDiff: 0, action: 'same' }), checking: true }));
    setError('');

    try {
      const res = await fetch(ROUTES.API_MODIFY_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          uploadToken: token,
          newStartDate,
          newEndDate,
          previewOnly: true,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to check availability');
        setPricePreview(null);
        return;
      }

      if (data.action === 'payment_required') {
        setPricePreview({
          newTotalPrice: data.newTotalPrice,
          priceDiff: data.priceDiff,
          action: 'payment_required',
          checking: false,
        });
      } else if (data.priceDiff < 0) {
        setPricePreview({
          newTotalPrice: data.newTotalPrice,
          priceDiff: data.priceDiff,
          refundAmount: data.refundAmount,
          refundPercentage: data.refundPercentage,
          action: 'refund',
          checking: false,
        });
      } else {
        setPricePreview({
          newTotalPrice: data.newTotalPrice,
          priceDiff: 0,
          action: 'same',
          checking: false,
        });
      }
    } catch {
      setError('Failed to check availability');
      setPricePreview(null);
    }
  };

  const handleModifyDates = async () => {
    if (!booking || !newStartDate || !newEndDate) return;

    if (pricePreview?.action === 'payment_required') {
      // Redirect to Stripe for extra payment
      setLoading(true);
      setError('');
      try {
        const res = await fetch(ROUTES.API_MODIFY_BOOKING_CHECKOUT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: booking.id,
            uploadToken: token,
            newStartDate,
            newEndDate,
            priceDiff: pricePreview.priceDiff,
            newTotalPrice: pricePreview.newTotalPrice,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create checkout');
        window.location.href = data.sessionUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
      return;
    }

    // Same price or refund path — send directly to modify API
    setLoading(true);
    setError('');
    try {
      const res = await fetch(ROUTES.API_MODIFY_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          uploadToken: token,
          newStartDate,
          newEndDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to modify booking');

      setModifyResult({
        newStartDate,
        newEndDate,
        newTotalPrice: data.newTotalPrice,
        refund: data.refund,
      });
      setSuccessType('modified');
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(ROUTES.API_CANCEL_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          uploadToken: token,
          reason: cancelReason || undefined,
          cancelledBy: 'customer',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel booking');

      setSuccessType('cancelled');
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkExtrasPriceDiff = async () => {
    if (!booking || !liveExtras) return;
    setExtrasPreview((prev) => ({ ...(prev ?? { newTotalPrice: 0, priceDiff: 0, action: 'same' }), checking: true }));
    setError('');

    try {
      const res = await fetch(ROUTES.API_MODIFY_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          uploadToken: token,
          newInsuranceType: liveExtras.insuranceType,
          newSelectedExtras: liveExtras.selectedExtras,
          previewOnly: true,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to calculate price');
        setExtrasPreview(null);
        return;
      }

      setExtrasPreview({
        priceDiff: data.priceDiff,
        newTotalPrice: data.newTotalPrice,
        refundAmount: data.refundAmount,
        refundPercentage: data.refundPercentage,
        action: data.action,
        checking: false,
      });
    } catch {
      setError('Failed to calculate price');
      setExtrasPreview(null);
    }
  };

  const handleModifyExtras = async () => {
    if (!booking || !liveExtras) return;

    if (extrasPreview?.action === 'payment_required') {
      setExtrasLoading(true);
      setError('');
      try {
        const res = await fetch(ROUTES.API_MODIFY_BOOKING_CHECKOUT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: booking.id,
            uploadToken: token,
            newInsuranceType: liveExtras.insuranceType,
            newSelectedExtras: liveExtras.selectedExtras,
            priceDiff: extrasPreview.priceDiff,
            newTotalPrice: extrasPreview.newTotalPrice,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create checkout');
        window.location.href = data.sessionUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setExtrasLoading(false);
      }
      return;
    }

    // Same price or refund — call modify API directly
    setExtrasLoading(true);
    setError('');
    try {
      const res = await fetch(ROUTES.API_MODIFY_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          uploadToken: token,
          newInsuranceType: liveExtras.insuranceType,
          newSelectedExtras: liveExtras.selectedExtras,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to modify booking');

      setSuccessType('extras');
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setExtrasLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto w-full px-4 md:px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Manage booking</p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {step === 'cancel' ? 'Cancel Booking' : 'Modify Booking'}
          </h1>

        </div>

        {/* Step 1: Lookup */}
        {step === 'lookup' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Step 1</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Find your booking</h2>

            {error && (
              <div className="bg-white border border-red-100 rounded-lg px-4 py-3 text-red-600 text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleLookup} className="space-y-5">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">Booking ID</label>
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  placeholder="Enter your Booking ID from confirmation email"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors font-mono text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-400">You can find this in your booking confirmation email</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching…' : 'Find my booking'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href={ROUTES.HOME} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Choose action */}
        {step === 'choose' && booking && (
          <div className="space-y-4">
            {/* Booking summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Your booking</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{booking.vehicle_name}</h2>
              <div className="space-y-2">
                {[
                  { label: 'Check-in', value: formatDate(booking.start_date) },
                  { label: 'Check-out', value: formatDate(booking.end_date) },
                  { label: 'Guest', value: `${booking.first_name} ${booking.last_name}` },
                  { label: 'Total Paid', value: formatCurrency(booking.total_price) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100 text-sm last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">What would you like to do?</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setStep('modify')}
                className="flex flex-col items-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-900 rounded-xl p-5 transition-all duration-200 group"
              >
                <svg className="w-7 h-7 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Change Dates</span>
                <span className="text-xs text-gray-400 text-center">Move or extend your trip</span>
              </button>

              <button
                onClick={() => setStep('add-extras')}
                className="flex flex-col items-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-900 rounded-xl p-5 transition-all duration-200 group"
              >
                <svg className="w-7 h-7 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Add / Change Extras</span>
                <span className="text-xs text-gray-400 text-center">Update add-ons or insurance</span>
              </button>

              <button
                onClick={() => setStep('cancel')}
                className="flex flex-col items-center gap-2 bg-white border-2 border-gray-200 hover:border-red-300 rounded-xl p-5 transition-all duration-200 group"
              >
                <svg className="w-7 h-7 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600">Cancel Booking</span>
                <span className="text-xs text-gray-400 text-center">Get a refund if eligible</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3a: Modify Dates */}
        {step === 'modify' && booking && (
          <div className="space-y-4">
            {error && (
              <div className="bg-white border border-red-100 rounded-lg px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Modify Dates</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Select New Dates</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="newStart" className="block text-sm font-medium text-gray-700 mb-2">New Check-in</label>
                  <input
                    type="date"
                    id="newStart"
                    value={newStartDate}
                    min={minDate}
                    onChange={(e) => {
                      setNewStartDate(e.target.value);
                      setPricePreview(null);
                      setError('');
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="newEnd" className="block text-sm font-medium text-gray-700 mb-2">New Check-out</label>
                  <input
                    type="date"
                    id="newEnd"
                    value={newEndDate}
                    min={newStartDate || minDate}
                    onChange={(e) => {
                      setNewEndDate(e.target.value);
                      setPricePreview(null);
                      setError('');
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={checkPriceDiff}
                  disabled={!newStartDate || !newEndDate || newEndDate <= newStartDate}
                  className="w-full border border-gray-300 text-gray-700 py-2.5 px-5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Check availability & price
                </button>
              </div>
            </div>

            {/* Price preview */}
            {pricePreview && !pricePreview.checking && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Price Change</p>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">Original total</span>
                    <span className="font-medium text-gray-900">{formatCurrency(booking.total_price)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">New dates</span>
                    <span className="font-medium text-gray-900">{formatDate(newStartDate)} – {formatDate(newEndDate)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">New total</span>
                    <span className="font-medium text-gray-900">{formatCurrency(pricePreview.newTotalPrice)}</span>
                  </div>
                </div>

                {pricePreview.action === 'payment_required' && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
                    Additional payment of <strong>{formatCurrency(pricePreview.priceDiff)}</strong> required for the extra days. You'll be redirected to a secure payment page.
                  </div>
                )}

                {pricePreview.action === 'refund' && (
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700">
                    You'll receive a refund of <strong>{formatCurrency(pricePreview.refundAmount ?? 0)}</strong>
                    {pricePreview.refundPercentage != null && pricePreview.refundPercentage < 100
                      ? ` (${pricePreview.refundPercentage}% of the ${formatCurrency(Math.abs(pricePreview.priceDiff))} price difference, based on the cancellation policy)`
                      : ' for the reduced days'
                    }. Processed within 3–5 business days.
                  </div>
                )}

                {pricePreview.action === 'same' && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-600">
                    No price change for these dates.
                  </div>
                )}
              </div>
            )}

            {pricePreview?.checking && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center text-sm text-gray-400">
                Checking availability…
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => { setStep('choose'); setError(''); setPricePreview(null); }}
                className="flex-1 border border-gray-200 text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleModifyDates}
                disabled={loading || !pricePreview || pricePreview.checking}
                className="flex-1 border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Processing…'
                  : pricePreview?.action === 'payment_required'
                    ? 'Proceed to Payment'
                    : 'Confirm Date Change'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3b: Add / Change Extras */}
        {step === 'add-extras' && booking && (
          <div className="space-y-4">
            {error && (
              <div className="bg-white border border-red-100 rounded-lg px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Modify Extras</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Add / Change Extras</h2>

              <ExtrasSelector
                numberOfDays={Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))}
                onChange={handleExtrasChange}
                initialValues={{
                  insuranceType: (booking.insurance_type as InsuranceType) || 'basic',
                  selectedExtras: booking.selected_extras || {},
                }}
              />

              <div className="mt-6">
                <button
                  type="button"
                  onClick={checkExtrasPriceDiff}
                  disabled={!liveExtras}
                  className="w-full border border-gray-300 text-gray-700 py-2.5 px-5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Preview changes
                </button>
              </div>
            </div>

            {/* Extras price preview */}
            {extrasPreview && !extrasPreview.checking && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Price Change</p>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">Original total</span>
                    <span className="font-medium text-gray-900">{formatCurrency(booking.total_price)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">New total</span>
                    <span className="font-medium text-gray-900">{formatCurrency(extrasPreview.newTotalPrice)}</span>
                  </div>
                </div>

                {extrasPreview.action === 'payment_required' && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
                    Additional payment of <strong>{formatCurrency(extrasPreview.priceDiff)}</strong> required. You'll be redirected to a secure payment page.
                  </div>
                )}
                {extrasPreview.action === 'refund' && (
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700">
                    You'll receive a refund of <strong>{formatCurrency(extrasPreview.refundAmount ?? 0)}</strong>
                    {extrasPreview.refundPercentage != null && extrasPreview.refundPercentage < 100
                      ? ` (${extrasPreview.refundPercentage}% of the ${formatCurrency(Math.abs(extrasPreview.priceDiff))} difference, based on the cancellation policy)`
                      : ''
                    }. Processed within 3–5 business days.
                  </div>
                )}
                {extrasPreview.action === 'same' && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-600">
                    No price change for these extras.
                  </div>
                )}
              </div>
            )}

            {extrasPreview?.checking && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center text-sm text-gray-400">
                Calculating price…
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => { setStep('choose'); setError(''); setExtrasPreview(null); }}
                className="flex-1 border border-gray-200 text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleModifyExtras}
                disabled={extrasLoading || !extrasPreview || extrasPreview.checking}
                className="flex-1 border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {extrasLoading
                  ? 'Processing…'
                  : extrasPreview?.action === 'payment_required'
                    ? 'Proceed to Payment'
                    : 'Confirm Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3c: Cancel */}
        {step === 'cancel' && booking && refund && (
          <div className="space-y-4">
            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Cancellation Policy</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex gap-2"><span className="text-gray-400">·</span> Within {REFUND_POLICY.FREE_CANCELLATION_HOURS}h of booking: <strong className="text-gray-900">{REFUND_POLICY.FULL_REFUND_PERCENT}% refund</strong></li>
                <li className="flex gap-2"><span className="text-gray-400">·</span> More than {REFUND_POLICY.FULL_REFUND_DAYS} days before: <strong className="text-gray-900">{REFUND_POLICY.FULL_REFUND_PERCENT}% refund</strong></li>
                <li className="flex gap-2"><span className="text-gray-400">·</span> {REFUND_POLICY.HALF_REFUND_DAYS}–{REFUND_POLICY.FULL_REFUND_DAYS} days before: <strong className="text-gray-900">{REFUND_POLICY.HALF_REFUND_PERCENT}% refund</strong></li>
                <li className="flex gap-2"><span className="text-gray-400">·</span> {REFUND_POLICY.QUARTER_REFUND_DAYS}–{REFUND_POLICY.HALF_REFUND_DAYS - 1} days before: <strong className="text-gray-900">{REFUND_POLICY.QUARTER_REFUND_PERCENT}% refund</strong></li>
                <li className="flex gap-2"><span className="text-gray-400">·</span> {REFUND_POLICY.NO_REFUND_DAYS} days or less: <strong className="text-gray-900">No refund</strong></li>
              </ul>
            </div>

            {error && (
              <div className="bg-white border border-red-100 rounded-lg px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Booking Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Booking Details</p>
              <div className="space-y-3 mt-4">
                {[
                  { label: 'Vehicle', value: booking.vehicle_name },
                  { label: 'Check-in', value: formatDate(booking.start_date) },
                  { label: 'Check-out', value: formatDate(booking.end_date) },
                  { label: 'Customer', value: `${booking.first_name} ${booking.last_name}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-sm">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-semibold text-primary-700">{formatCurrency(booking.total_price)}</span>
                </div>
              </div>
            </div>

            {/* Refund */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Refund</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Refund Calculation</h2>

              {refund.withinFreeCancellation && (
                <div className="mb-4 bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700">
                  You're within the {REFUND_POLICY.FREE_CANCELLATION_HOURS}-hour free cancellation window — full refund available.
                </div>
              )}

              <div className="space-y-3">
                {[
                  { label: 'Days until start', value: `${refund.daysUntilStart} days` },
                  { label: 'Refund percentage', value: `${refund.refundPercentage}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <span className="font-medium text-gray-900">Refund Amount</span>
                  <span className={`text-lg font-semibold ${refund.refundAmount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formatCurrency(refund.refundAmount)}
                  </span>
                </div>
              </div>

              {refund.refundAmount === 0 && (
                <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-500">
                  Your booking is within {REFUND_POLICY.NO_REFUND_DAYS} days and outside the free cancellation window — no refund is available. You may still cancel if you wish.
                </div>
              )}
            </div>

            {/* Reason */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="Let us know why you're cancelling…"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors resize-none"
              />
            </div>

            {/* Warning */}
            <div className="bg-white border border-red-100 rounded-xl px-5 py-4 text-sm text-red-600">
              This action cannot be undone. Once cancelled, you will need to make a new booking if you change your mind.
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => { setStep('choose'); setError(''); }}
                className="flex-1 border border-gray-200 text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 border-2 border-red-500 text-red-600 py-3 px-6 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Cancelling…' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && booking && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className={`w-14 h-14 ${successType === 'cancelled' ? 'bg-gray-50 border-gray-100' : 'bg-teal-50 border-teal-100'} border rounded-full flex items-center justify-center mx-auto mb-5`}>
              {successType === 'cancelled' ? (
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : successType === 'extras' ? (
                <svg className="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Done</p>

            {successType === 'cancelled' ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Booking Cancelled</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Your booking for <strong className="text-gray-900">{booking.vehicle_name}</strong> has been successfully cancelled.
                </p>
                {refund && refund.refundAmount > 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700 mb-4">
                    A refund of <strong>{formatCurrency(refund.refundAmount)}</strong> ({refund.refundPercentage}%) will be processed to your original payment method within 3–5 business days.
                  </div>
                )}
              </>
            ) : successType === 'extras' ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Extras Updated</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Your add-ons and insurance for <strong className="text-gray-900">{booking.vehicle_name}</strong> have been successfully updated.
                </p>
                {extrasPreview?.action === 'refund' && extrasPreview.refundAmount && extrasPreview.refundAmount > 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700 mb-4">
                    A refund of <strong>{formatCurrency(extrasPreview.refundAmount)}</strong> will be processed within 3–5 business days.
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Dates Updated</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Your booking for <strong className="text-gray-900">{booking.vehicle_name}</strong> has been successfully updated.
                </p>
                {modifyResult && (
                  <div className="bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 text-sm text-teal-700 mb-4">
                    <strong>New dates:</strong> {formatDate(modifyResult.newStartDate)} – {formatDate(modifyResult.newEndDate)}
                  </div>
                )}
                {modifyResult?.refund && modifyResult.refund.amount > 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700 mb-4">
                    A refund of <strong>{formatCurrency(modifyResult.refund.amount)}</strong> ({modifyResult.refund.percentage}%) will be processed within 3–5 business days.
                  </div>
                )}
              </>
            )}

            <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-500 mb-8">
              A confirmation email has been sent to <strong className="text-gray-900">{booking.email}</strong>
            </div>

            <Link
              href={ROUTES.HOME}
              className="inline-block border-2 border-gray-900 text-gray-900 py-3 px-8 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
