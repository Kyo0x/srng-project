'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { ExtrasSelector } from '@/components/ExtrasSelector';
import { Vehicle, InsuranceType } from '@/lib/types';
import { formatCurrency, calculateRentalPrice, isPromoActive, isGroupPromoActive, getEffectivePrice } from '@/lib/utils';
import { SelectedExtras, calculateExtrasCost, INSURANCE_OPTIONS, getExtraById } from '@/lib/constants';
import { PriceDisplay } from '@/components/PriceDisplay';

type Step = 'contact' | 'extras' | 'payment';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ExtrasSelectorData {
  babySeatsQuantity: number;
  extraDriver: boolean;
  insuranceType: 'basic' | 'premium' | 'premium_plus';
  selectedExtras: SelectedExtras;
}

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const vehicleId = params.vehicleId as string;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('contact');
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const [extrasData, setExtrasData] = useState<ExtrasSelectorData | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [liveExtras, setLiveExtras] = useState<{ insuranceType: InsuranceType; selectedExtras: SelectedExtras } | null>(null);
  const [pickupTime, setPickupTime] = useState<string>('');
  const [extrasAvailability, setExtrasAvailability] = useState<Record<string, number> | undefined>(undefined);
  const [_holdToken, _setHoldToken] = useState<string | null>(null);
  const [holdExpiresAt, _setHoldExpiresAt] = useState<Date | null>(null);
  const [holdSecondsLeft, setHoldSecondsLeft] = useState<number | null>(null);
  const [holdError, _setHoldError] = useState<string | null>(null);
  const holdTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!startDate || !endDate || !vehicleId) {
      router.push('/');
      return;
    }

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vehicles');
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        
        const vehicles = await response.json();
        const vehicleIdNum = Number(vehicleId);
        const found = vehicles.find((v: Vehicle) => v.id === vehicleIdNum);
        
        if (!found) {
          setError('Vehicle not found');
          router.push('/');
          return;
        }

        if (found.is_paused) {
          router.push('/');
          return;
        }

        setVehicle(found);
      } catch (err) {
        setError('Vehicle not found');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId, startDate, endDate, router]);

  useEffect(() => {
    if (!startDate || !endDate) return;
    fetch(`/api/extras/availability?startDate=${startDate}&endDate=${endDate}`)
      .then((r) => r.json())
      .then((data) => setExtrasAvailability(data))
      .catch(() => {}); // non-critical — gracefully degrade
  }, [startDate, endDate]);

  useEffect(() => {
    return () => {
      if (holdTokenRef.current) {
        navigator.sendBeacon('/api/holds', JSON.stringify({ holdToken: holdTokenRef.current }));
      }
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!holdExpiresAt) return;

    const tick = () => {
      const secs = Math.max(0, Math.floor((holdExpiresAt.getTime() - Date.now()) / 1000));
      setHoldSecondsLeft(secs);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [holdExpiresAt]);

  const numberOfDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.floor(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }, [startDate, endDate]);

  const promoIsActive = useMemo(() => {
    if (!vehicle || !startDate) return false;
    return isPromoActive(vehicle, startDate) || isGroupPromoActive(vehicle, startDate);
  }, [vehicle, startDate]);

  const effectivePricePerDay = useMemo(() => {
    if (!vehicle || !startDate) return 0;
    return getEffectivePrice(vehicle, startDate);
  }, [vehicle, startDate]);

  const rentalPricing = useMemo(() => {
    if (!vehicle) return { discountPercent: 0, discountAmount: 0, totalPrice: 0 };
    return calculateRentalPrice(effectivePricePerDay, numberOfDays);
  }, [effectivePricePerDay, numberOfDays, promoIsActive]);

  const basePrice = rentalPricing.totalPrice;

  const promoSavingAmount = useMemo(() => {
    if (!promoIsActive || !vehicle) return 0;
    return Math.round(numberOfDays * (vehicle.price_per_day - effectivePricePerDay));
  }, [promoIsActive, vehicle, numberOfDays, effectivePricePerDay]);

  const totalSavingAmount = promoSavingAmount + rentalPricing.discountAmount;

  const totalWithExtras = useMemo(() => {
    if (!extrasData) return basePrice;

    const extrasCost = calculateExtrasCost(extrasData.selectedExtras || {}, numberOfDays, extrasData.insuranceType);
    const insuranceOption = INSURANCE_OPTIONS.find((opt) => opt.type === extrasData.insuranceType);
    const insuranceCost = (insuranceOption?.price || 0) * numberOfDays;

    return basePrice + extrasCost.totalCost + insuranceCost;
  }, [basePrice, extrasData, numberOfDays]);

  const selectedExtrasSummary = useMemo(() => {
    if (!extrasData?.selectedExtras) return [];

    return Object.entries(extrasData.selectedExtras)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const extra = getExtraById(id);
        if (!extra) return null;

        let cost = extra.price * qty;
        if (extra.priceType === 'per_day') cost *= numberOfDays;

        return {
          name: extra.name,
          quantity: qty,
          priceType: extra.priceType,
          cost,
        };
      })
      .filter(Boolean) as Array<{ name: string; quantity: number; priceType: string; cost: number }>;
  }, [extrasData, numberOfDays]);

  // Live extras tracking for sidebar during extras step
  const handleExtrasChange = useCallback((data: { insuranceType: InsuranceType; selectedExtras: SelectedExtras }) => {
    setLiveExtras(data);
  }, []);

  const liveExtrasCost = useMemo(() => {
    if (!liveExtras) return null;
    const extrasCost = calculateExtrasCost(liveExtras.selectedExtras || {}, numberOfDays, liveExtras.insuranceType);
    const insuranceOption = INSURANCE_OPTIONS.find((opt) => opt.type === liveExtras.insuranceType);
    const insuranceCost = (insuranceOption?.price || 0) * numberOfDays;
    return { extrasCost, insuranceCost, total: basePrice + extrasCost.totalCost + insuranceCost };
  }, [liveExtras, numberOfDays, basePrice]);

  const liveExtrasSummary = useMemo(() => {
    if (!liveExtras?.selectedExtras) return [];
    const freeExtraDriver = liveExtras.insuranceType === 'premium' || liveExtras.insuranceType === 'premium_plus';
    return Object.entries(liveExtras.selectedExtras)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const extra = getExtraById(id);
        if (!extra) return null;
        const paidQty = (freeExtraDriver && id === 'extra_driver') ? Math.max(0, qty - 1) : qty;
        let cost = extra.price * paidQty;
        if (extra.priceType === 'per_day') cost *= numberOfDays;
        return { name: extra.name, quantity: qty, cost };
      })
      .filter(Boolean) as Array<{ name: string; quantity: number; cost: number }>;
  }, [liveExtras, numberOfDays]);

  const handleContactSubmit = (data: ContactFormData) => {
    setContactData(data);
    setStep('extras');
  };

  const handleExtrasSubmit = (data: ExtrasSelectorData) => {
    setExtrasData(data);
    setStep('payment');
  };

  const handleExtrasContinue = () => {
    if (!liveExtras || !pickupTime) return;
    const babySeatsQuantity = (liveExtras.selectedExtras['baby_seat_small'] || 0) + (liveExtras.selectedExtras['baby_seat_large'] || 0);
    const extraDriver = (liveExtras.selectedExtras['extra_driver'] || 0) > 0;
    handleExtrasSubmit({
      babySeatsQuantity,
      extraDriver,
      insuranceType: liveExtras.insuranceType,
      selectedExtras: liveExtras.selectedExtras,
    });
  };

  const handleProceedToPayment = async () => {
    if (!vehicle || !startDate || !endDate || !contactData || !extrasData) {
      return;
    }

    try {
      setCheckoutLoading(true);

      // Demo mode: Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      alert(`🎭 Demo Mode: Payment Successful!\n\nBooking Details:\n• Vehicle: ${vehicle.name}\n• Dates: ${startDate} to ${endDate}\n• Total: ${formatCurrency(totalWithExtras)}\n• Guest: ${contactData.firstName} ${contactData.lastName}\n\nIn production, this would process payment via Stripe and send confirmation emails.`);

      // Redirect to homepage
      router.push('/');
    } catch (err) {
      console.error('Payment error:', err);
      alert(err instanceof Error ? err.message : 'Failed to proceed to payment. Please try again.');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 text-sm">{error || 'Vehicle not found'}</p>
        </div>
      </div>
    );
  }

  const holdMins = holdSecondsLeft !== null ? Math.floor(holdSecondsLeft / 60) : null;
  const holdSecs = holdSecondsLeft !== null ? holdSecondsLeft % 60 : null;
  const holdExpired = holdSecondsLeft !== null && holdSecondsLeft === 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* PAGE HEADER */}
        <section className="bg-white py-6 md:py-8 px-4 md:px-8 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-4"
            >
              ← Back
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Booking</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
              Complete Your Booking
            </h1>
          </div>
        </section>

        {/* CONTENT */}
        <section className="bg-gray-50 py-8 md:py-12 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">

            {/* Hold error banner */}
            {holdError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                ⚠️ {holdError}
              </div>
            )}

            {/* Hold expired banner */}
            {holdExpired && !holdError && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                ⏱ Your date hold has expired. The dates may still be available — complete your booking to confirm.
              </div>
            )}

            {/* Step 3: single card */}
            {step === 'payment' && contactData && extrasData && (
              <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {/* Vehicle strip */}
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                    {vehicle.image_urls?.[0] && (
                      <div className="relative h-14 w-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={vehicle.image_urls[0]} alt={vehicle.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{vehicle.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{startDate} → {endDate} · {numberOfDays} days</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        {numberOfDays}d × {formatCurrency(effectivePricePerDay)}
                        {promoIsActive && <span className="ml-1 text-red-500 font-medium">promo</span>}
                      </p>
                      <p className="text-sm font-semibold text-primary-700">{formatCurrency(basePrice)}</p>
                    </div>
                  </div>
                  {/* Contact summary */}
                  <div className="px-5 py-5 border-b border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Step 3 of 3</p>
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Review & Pay</h2>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <p><span className="font-medium text-gray-900">Guest:</span> {contactData.firstName} {contactData.lastName}</p>
                      <p><span className="font-medium text-gray-900">Email:</span> {contactData.email}</p>
                      <p><span className="font-medium text-gray-900">Phone:</span> {contactData.phone}</p>
                      {pickupTime && <p><span className="font-medium text-gray-900">Estimated pickup:</span> {pickupTime}</p>}
                    </div>
                  </div>
                  {/* Price summary + actions */}
                  <div className="px-5 py-4 bg-gray-50 space-y-2">
                    {promoIsActive && promoSavingAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Promo rate (−{Math.round((1 - effectivePricePerDay / vehicle.price_per_day) * 100)}%)</span>
                        <span className="font-medium">−{formatCurrency(promoSavingAmount)}</span>
                      </div>
                    )}
                    {rentalPricing.discountPercent > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>{rentalPricing.discountPercent}% long-stay discount</span>
                        <span className="font-medium">−{formatCurrency(rentalPricing.discountAmount)}</span>
                      </div>
                    )}
                    {totalSavingAmount > 0 && (
                      <div className="flex justify-between text-xs bg-green-50 border border-green-100 rounded-md px-3 py-2 text-green-700 font-semibold">
                        <span>You save</span>
                        <span>−{formatCurrency(totalSavingAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Insurance</span>
                      <span className="font-medium text-gray-900">
                        +{formatCurrency((INSURANCE_OPTIONS.find((opt) => opt.type === extrasData.insuranceType)?.price || 0) * numberOfDays)}
                      </span>
                    </div>
                    {selectedExtrasSummary.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-600">
                        <span>{item.name}{item.quantity > 1 ? ` (${item.quantity}×)` : ''}</span>
                        <span className="font-medium text-gray-900">+{formatCurrency(item.cost)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900 text-sm">Total</span>
                      <span className="font-semibold text-primary-700">
                        <PriceDisplay amount={totalWithExtras} approxClassName="text-xs text-gray-400 font-normal" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        onClick={handleProceedToPayment}
                        disabled={checkoutLoading}
                        className="w-full py-3 border-2 border-primary-700 text-primary-700 disabled:border-gray-200 disabled:text-gray-400 font-semibold rounded-lg transition-colors duration-200 hover:bg-primary-700 hover:text-white"
                      >
                        {checkoutLoading ? 'Processing…' : 'Proceed to Payment'}
                      </button>
                      <button
                        onClick={() => setStep('extras')}
                        disabled={checkoutLoading}
                        className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 font-medium transition-colors duration-200 text-sm"
                      >
                        Back to Extras
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Steps 1 & 2: two-column layout */}
            {step !== 'payment' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* STEPS */}
                <div className="lg:col-span-2 space-y-4">
                  {step === 'contact' && (
                    <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-8">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Step 1</p>
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
                      <ContactForm onSubmit={handleContactSubmit} />
                    </div>
                  )}
                  {step === 'extras' && contactData && (
                    <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-8">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Step 2</p>
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">Extras & Add-ons</h2>

                      {/* Return time notice — top of step */}
                      {(() => {
                        const lateReturn = (liveExtras?.selectedExtras['late_return'] ?? 0) > 0;
                        const returnTime = lateReturn ? '18:00' : '12:00';
                        return (
                          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                            <p className="text-sm font-bold text-amber-900 mb-1">
                              Return by {returnTime} on {endDate}
                            </p>
                            <p className="text-sm text-amber-800">
                              The vehicle must be returned no later than <strong>{returnTime}</strong> on your return date. Every started 30 minutes after {returnTime} will be charged at <strong>400 NOK</strong>.
                            </p>
                          </div>
                        );
                      })()}

                      {/* Pickup time - required */}
                      <div className="mb-8 pb-6 border-b border-gray-100">
                        <label className="block text-base font-semibold text-gray-900 mb-1">
                          Estimated pickup time <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                          Let us know approximately when you plan to arrive for pickup on <strong>{startDate}</strong>.
                        </p>
                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className={`w-full max-w-xs border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors ${
                            !pickupTime ? 'border-gray-300 text-gray-400' : 'border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="">Select a time…</option>
                          {Array.from({ length: 25 }, (_, i) => {
                            const hour = Math.floor(i / 2) + 12;
                            const min = i % 2 === 0 ? '00' : '30';
                            const label = `${String(hour).padStart(2, '0')}:${min}`;
                            return <option key={label} value={label}>{label}</option>;
                          })}
                        </select>
                        {!pickupTime && (
                          <p className="mt-2 text-xs text-amber-600 font-medium">Required — please select an estimated pickup time to continue.</p>
                        )}
                      </div>

                      <ExtrasSelector numberOfDays={numberOfDays} onChange={handleExtrasChange} extrasAvailability={extrasAvailability} />
                    </div>
                  )}
                </div>

                {/* SIDEBAR */}
                <div>
                  <div className="bg-white rounded-xl border border-gray-100 p-6 lg:sticky lg:top-20 hover:shadow-sm transition-all">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Summary</p>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    {holdSecondsLeft !== null && holdSecondsLeft > 0 && step === 'contact' && (
                      <div className="flex items-center justify-between text-xs rounded-lg bg-green-50 border border-green-200 px-3 py-2 mb-4">
                        <span className="text-green-700">🔒 Dates held for you</span>
                        <span className={`font-mono font-semibold ${holdSecondsLeft < 120 ? 'text-red-600' : 'text-green-700'}`}>
                          {String(holdMins).padStart(2, '0')}:{String(holdSecs).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                    <div className="rounded-lg border border-gray-100 overflow-hidden mb-4">
                      {vehicle.image_urls?.[0] && (
                        <div className="relative h-32 w-full">
                          <Image src={vehicle.image_urls[0]} alt={vehicle.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="px-4 py-3 bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{vehicle.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{startDate} → {endDate} · {numberOfDays} days</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {promoIsActive ? (
                        <div>
                          <p className="text-xs text-gray-400 line-through">
                            {numberOfDays} days × {formatCurrency(vehicle.price_per_day)}/day
                          </p>
                          <p className="text-xs text-gray-700 font-medium">
                            {numberOfDays} days × {formatCurrency(effectivePricePerDay)}/day{' '}
                            <span className="text-red-500">promo</span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">
                          {numberOfDays} days × {formatCurrency(effectivePricePerDay)}/day
                        </p>
                      )}
                      {promoIsActive && promoSavingAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Promo rate (−{Math.round((1 - effectivePricePerDay / vehicle.price_per_day) * 100)}%)</span>
                          <span className="font-medium">−{formatCurrency(promoSavingAmount)}</span>
                        </div>
                      )}
                      {rentalPricing.discountPercent > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>{rentalPricing.discountPercent}% long-stay discount</span>
                          <span className="font-medium">−{formatCurrency(rentalPricing.discountAmount)}</span>
                        </div>
                      )}
                      {totalSavingAmount > 0 && (
                        <div className="flex justify-between text-xs bg-green-50 border border-green-100 rounded-md px-3 py-2 text-green-700 font-semibold">
                          <span>You save</span>
                          <span>−{formatCurrency(totalSavingAmount)}</span>
                        </div>
                      )}
                      {step === 'extras' && liveExtrasCost && (
                        <>
                          {liveExtrasCost.insuranceCost > 0 && (
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Insurance</span>
                              <span className="font-medium text-gray-900">+{formatCurrency(liveExtrasCost.insuranceCost)}</span>
                            </div>
                          )}
                          {liveExtrasSummary.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600">
                              <span>{item.name}{item.quantity > 1 ? ` (${item.quantity}×)` : ''}</span>
                              <span className="font-medium text-gray-900">+{formatCurrency(item.cost)}</span>
                            </div>
                          ))}
                        </>
                      )}
                      <div className="flex justify-between items-start pt-3 border-t border-gray-100">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-right font-semibold text-primary-700">
                          <PriceDisplay
                            amount={step === 'extras' && liveExtrasCost ? liveExtrasCost.total : totalWithExtras}
                            approxClassName="text-xs text-gray-400 font-normal"
                          />
                        </span>
                      </div>
                    </div>
                    {step === 'extras' && (
                      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3">
                        {holdSecondsLeft !== null && holdSecondsLeft > 0 && (
                          <div className="flex items-center justify-between text-xs rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                            <span className="text-green-700">🔒 Dates held for you</span>
                            <span className={`font-mono font-semibold ${holdSecondsLeft < 120 ? 'text-red-600' : 'text-green-700'}`}>
                              {String(holdMins).padStart(2, '0')}:{String(holdSecs).padStart(2, '0')}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={handleExtrasContinue}
                          disabled={!pickupTime}
                          className="w-full px-6 py-3 border-2 border-primary-700 text-primary-700 font-semibold rounded-lg transition-colors duration-200 hover:bg-primary-700 hover:text-white disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Continue to Payment
                        </button>
                        <button
                          onClick={() => setStep('contact')}
                          className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                        >
                          Back
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
