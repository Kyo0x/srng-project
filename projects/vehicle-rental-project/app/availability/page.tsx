'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VehicleCard } from '@/components/VehicleCard';
import { Calendar } from '@/components/Calendar';
import { Vehicle } from '@/lib/types';
import { calculateRentalPrice, getEffectivePrice } from '@/lib/utils';
import { VALIDATION } from '@/lib/constants';

function AvailabilityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allMinStayRules, setAllMinStayRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [minDays, setMinDays] = useState<number>(VALIDATION.MIN_RENTAL_DAYS);
  const [minDaysLabel, setMinDaysLabel] = useState<string | null>(null);

  // Release a hold if the user cancelled out of Stripe
  useEffect(() => {
    const releaseHold = searchParams.get('releaseHold');
    if (!releaseHold) return;
    fetch('/api/holds', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ holdToken: releaseHold }),
    }).catch(() => {});
  }, []);

  const handleDateRangeSelect = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleActiveRuleChange = useCallback((days: number, label: string | null) => {
    setMinDays(days);
    setMinDaysLabel(label);
  }, []);

  const numberOfDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  const vehicles = useMemo(() => {
    if (!startDate || !endDate || allVehicles.length === 0) return [];
    const searchStart = new Date(startDate);
    const searchEnd = new Date(endDate);

    const available = allVehicles.filter((vehicle: Vehicle) => {
      if (vehicle.is_paused) return false;
      return !allBookings.some((booking: any) => (
        booking.vehicle_id === vehicle.id &&
        booking.status !== 'cancelled' &&
        new Date(booking.start_date) <= searchEnd &&
        new Date(booking.end_date) >= searchStart
      ));
    });

    // Group vehicles: one representative card per vehicle_group, individual cards for ungrouped
    const seen = new Set<string>();
    const deduplicated: Vehicle[] = [];
    for (const vehicle of available) {
      if (vehicle.vehicle_group) {
        if (!seen.has(vehicle.vehicle_group)) {
          seen.add(vehicle.vehicle_group);
          // Use the lowest sort_order vehicle in this group as the representative card
          const groupRep = available
            .filter(v => v.vehicle_group === vehicle.vehicle_group)
            .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))[0];
          deduplicated.push(groupRep);
        }
      } else {
        deduplicated.push(vehicle);
      }
    }

    return deduplicated
      .map((vehicle: Vehicle) => {
        const effectivePrice = getEffectivePrice(vehicle, startDate);
        return {
          ...vehicle,
          totalPrice: calculateRentalPrice(effectivePrice, numberOfDays).totalPrice,
        };
      })
      .sort((a, b) => a.price_per_day - b.price_per_day);
  }, [allVehicles, allBookings, startDate, endDate, numberOfDays]);

  const handleVehicleSelect = useCallback(async (vehicle: Vehicle) => {
    if (vehicle.vehicle_group) {
      try {
        const res = await fetch(
          `/api/vehicles/optimal?group=${encodeURIComponent(vehicle.vehicle_group)}&start=${startDate}&end=${endDate}`
        );
        if (res.ok) {
          const { vehicleId } = await res.json();
          router.push(`/booking/${vehicleId}?startDate=${startDate}&endDate=${endDate}`);
          return;
        }
      } catch {
        // fall through to direct navigation if optimal lookup fails
      }
    }
    router.push(`/booking/${vehicle.id}?startDate=${startDate}&endDate=${endDate}`);
  }, [router, startDate, endDate]);

  useEffect(() => {
    if (!startDate || !endDate) {
      router.push('/');
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [vehiclesRes, bookingsRes, rulesRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/bookings/availability'),
          fetch('/api/booking-rules'),
        ]);
        if (!vehiclesRes.ok || !bookingsRes.ok) throw new Error('Failed to fetch data');
        setAllVehicles(await vehiclesRes.json() || []);
        setAllBookings(await bookingsRes.json() || []);
        if (rulesRes.ok) setAllMinStayRules(await rulesRes.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isSearchReady = startDate && endDate && numberOfDays >= minDays;
  const noResults = !loading && vehicles.length === 0 && allVehicles.length > 0 && isSearchReady;


  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-5 md:mb-8"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-start">

            {/* LEFT — Calendar sidebar (second on mobile, first on desktop) */}
            <div className="order-2 lg:order-1 lg:sticky lg:top-20">
              <Calendar
                onDateRangeSelect={handleDateRangeSelect}
                startDate={startDate}
                endDate={endDate}
                initialVehicles={loading ? undefined : allVehicles}
                initialBookings={loading ? undefined : allBookings}
                initialMinStayRules={loading ? undefined : allMinStayRules}
                onActiveRuleChange={handleActiveRuleChange}
              />
              {startDate && endDate && numberOfDays > 0 && (
                <div className="mt-4 space-y-1.5 text-center">
                  <p className="text-sm text-gray-600">
                    {startDate} → {endDate} · <span className="font-medium text-gray-900">{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span>
                  </p>
                  {numberOfDays < minDays && (
                    <p className="text-sm font-medium text-red-500">
                      Minimum {minDays} days required{minDaysLabel ? ` (${minDaysLabel})` : ''}
                    </p>
                  )}
                  {numberOfDays >= minDays && numberOfDays >= 7 && (
                    <p className="text-sm font-medium text-green-600">
                      10% long-stay discount applied
                    </p>
                  )}
                  {numberOfDays >= minDays && numberOfDays >= 5 && numberOfDays < 7 && (
                    <p className="text-sm text-amber-600">
                      {7 - numberOfDays} more day{7 - numberOfDays > 1 ? 's' : ''} for 10% off
                    </p>
                  )}
                </div>
              )}
              <p className="mt-3 text-xs text-gray-400 text-center">
                Minimum {minDays} days{minDaysLabel ? ` (${minDaysLabel})` : ''} · Stay 7+ days for 10% off
              </p>
            </div>

            {/* RIGHT — Results (first on mobile, second on desktop) */}
            <div id="availability-results" className="order-1 lg:order-2">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Results</p>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
                  Available Vehicles
                </h1>
              </div>

              {!isSearchReady && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                  Select your dates on the left to see available vehicles.
                </div>
              )}

              {isSearchReady && loading && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                  Loading available vehicles…
                </div>
              )}

              {isSearchReady && error && (
                <div className="bg-white border border-red-100 rounded-xl p-6 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              {isSearchReady && noResults && (
                <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500 text-sm">
                  No vehicles available for the selected dates. Try different dates.
                </div>
              )}

              {isSearchReady && !loading && vehicles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.vehicle_group ?? vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="cursor-pointer"
                    >
                      <VehicleCard
                        vehicle={vehicle}
                        totalPrice={vehicle.totalPrice}
                        isClickable
                        bookingStartDate={startDate}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AvailabilityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <AvailabilityContent />
    </Suspense>
  );
}
