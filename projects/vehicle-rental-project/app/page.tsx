'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/CTASection';
import { Calendar } from '@/components/Calendar';
import { VehicleList } from '@/components/VehicleList';
import { PromoPopup } from '@/components/PromoPopup';
import { useVehicles } from '@/hooks';
import { isPromoVisible, isGroupPromoVisible } from '@/lib/utils';
import { VALIDATION } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const { data: allVehicles } = useVehicles();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const start = params.get('startDate');
    const end = params.get('endDate');
    const todayStr = new Date().toISOString().split('T')[0];
    setToday(todayStr);
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    } else {
      const todayDate = new Date();
      const twoDaysLater = new Date(todayDate);
      twoDaysLater.setDate(todayDate.getDate() + 2);
      setStartDate(todayStr);
      setEndDate(twoDaysLater.toISOString().split('T')[0]);
    }
  }, []);

  const handleDateRangeSelect = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleCheckAvailability = useCallback(() => {
    if (startDate && endDate) {
      router.push(
        `/availability?startDate=${startDate}&endDate=${endDate}`
      );
    }
  }, [startDate, endDate, router]);

  const scrollToBooking = useCallback(() => {
    const el = document.getElementById('booking');
    if (!el) return;
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const isMobile = window.innerWidth < 640;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight + (isMobile ? 100 : 0);
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const numberOfDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [startDate, endDate]);

  const isCheckAvailableDisabled = !startDate || !endDate || numberOfDays < VALIDATION.MIN_RENTAL_DAYS;

  const activePromoVehicles = useMemo(() => {
    if (!Array.isArray(allVehicles) || !today) return [];
    return allVehicles.filter((v) => isPromoVisible(v, today));
  }, [allVehicles, today]);

  const groupPromos = useMemo(() => {
    if (!Array.isArray(allVehicles)) return [];
    const seen = new Set<string>();
    const result: { vehicle_group: string; promo_text: string; promo_price: number | null; regular_price: number | null; promo_end_date: string | null }[] = [];
    for (const v of allVehicles) {
      if (v.vehicle_group && v.group_promo_text && isGroupPromoVisible(v, today) && !seen.has(v.vehicle_group)) {
        seen.add(v.vehicle_group);
        result.push({
          vehicle_group: v.vehicle_group,
          promo_text: v.group_promo_text,
          promo_price: v.group_promo_price ?? null,
          regular_price: v.price_per_day,
          promo_end_date: v.group_promo_end_date ?? null,
        });
      }
    }
    return result;
  }, [allVehicles]);

  const showPromoPopup = activePromoVehicles.length > 0 || groupPromos.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showPromoPopup && <PromoPopup vehicles={activePromoVehicles} groupPromos={groupPromos} />}
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-center overflow-hidden bg-cover bg-center bg-no-repeat pb-6 sm:pb-2" style={{backgroundImage: 'url(/hero-image.jpg)'}}>
          <div className="absolute inset-0 bg-black/55 z-0"></div>
          <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center py-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90 mb-3">NorthVenture</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-tight">
              Campervan Rental in Bergen, Norway
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-white font-light drop-shadow">
              Camper van &amp; RV rental from our Bergen rental station. Rent your campervan and explore the stunning fjords and Arctic landscapes of Norway.
            </p>
            <button
              type="button"
              onClick={scrollToBooking}
              className="border-2 border-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              Book now
            </button>
          </div>

          {/* Hero booking bar */}
          <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
            {/* Mobile layout */}
            <div className="sm:hidden bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="flex flex-col px-3 py-2.5 border-r border-b border-gray-100">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Pick-up</label>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={e => handleDateRangeSelect(e.target.value, endDate)}
                    className="text-xs text-gray-900 bg-transparent outline-none w-full"
                  />
                </div>
                <div className="flex flex-col px-3 py-2.5 border-b border-gray-100">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Drop-off</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    onChange={e => handleDateRangeSelect(startDate, e.target.value)}
                    className="text-xs text-gray-900 bg-transparent outline-none w-full"
                  />
                </div>
              </div>
              <div className="px-3 py-2.5">
                <button
                  onClick={handleCheckAvailability}
                  disabled={isCheckAvailableDisabled}
                  className="w-full py-2.5 border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white font-semibold text-sm rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Select Camper
                </button>
              </div>
            </div>
            {/* Desktop layout */}
            <div className="hidden sm:flex bg-white rounded-lg shadow-md items-center overflow-hidden border border-gray-200">
              <div className="flex-1 flex flex-col px-3 py-2 border-r border-gray-100">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Location</label>
                <input
                  list="locations"
                  defaultValue="Bergen, Norway"
                  className="text-sm text-gray-900 bg-transparent outline-none placeholder-gray-400"
                  placeholder="Bergen, Norway"
                />
                <datalist id="locations">
                  <option value="Bergen, Norway" />
                </datalist>
              </div>
              <div className="flex-1 flex flex-col px-3 py-2 border-r border-gray-100">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Pick-up date</label>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => handleDateRangeSelect(e.target.value, endDate)}
                  className="text-sm text-gray-900 bg-transparent outline-none w-full"
                />
              </div>
              <div className="flex-1 flex flex-col px-3 py-2 border-r border-gray-100">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Drop-off date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={e => handleDateRangeSelect(startDate, e.target.value)}
                  className="text-sm text-gray-900 bg-transparent outline-none w-full"
                />
              </div>
              <div className="px-2 py-2">
                <button
                  onClick={handleCheckAvailability}
                  disabled={isCheckAvailableDisabled}
                  className="px-4 py-2 border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white font-semibold text-sm rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Select Camper
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AVAILABLE VEHICLES SECTION */}
        <section className="bg-gray-50 pt-24 md:pt-28 pb-12 md:pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Fleet</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                Our fleet
              </h2>
              <p className="text-gray-500 text-sm">
                Explore our premium collection of arctic-equipped campervans
              </p>
            </div>
            <VehicleList />
          </div>
        </section>

        {/* BOOKING SECTION */}
        <section id="booking" className="bg-white pt-10 md:pt-14 pb-6 md:pb-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Availability</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 md:mb-10 text-center tracking-tight">
              Reserve your arctic home
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
              {/* About - hidden on mobile, shown on desktop */}
              <div className="hidden lg:flex">
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 w-full flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">About</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">About NorthVenture</h3>
                  <div className="space-y-4 flex-1 text-gray-600 text-sm sm:text-base leading-relaxed">
                    <p>
                      Welcome to NorthVenture, your Bergen rental station for camper van and RV rental in northern Norway. We specialise in premium motorhomes built for Arctic road trips, from northern lights chases to midnight sun adventures.
                    </p>
                    <p>
                      Rent your campervan at our base on Bergen or arrange pickup directly at Bergen Airport. Hit the road to Senja, the Lyngen Alps, Lofoten, Sommarøy, and beyond.
                    </p>
                    <p>
                      Every vehicle in our camper &amp; RV rental fleet is winter-ready: studded tyres, auxiliary heating, and all essentials for a comfortable Arctic road trip.
                    </p>
                  </div>
                </div>
              </div>
              {/* Calendar */}
              <div className="flex">
                <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-100 w-full flex flex-col">
                  <Calendar
                    onDateRangeSelect={handleDateRangeSelect}
                    startDate={startDate}
                    endDate={endDate}
                  />
                  <button
                    onClick={handleCheckAvailability}
                    disabled={isCheckAvailableDisabled}
                    className={`w-full mt-6 px-6 py-4 rounded-lg font-semibold transition-colors duration-200 text-lg border-2 ${
                      isCheckAvailableDisabled
                        ? 'border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                        : 'border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white active:bg-primary-900'
                    }`}
                  >
                    Select Camper
                  </button>
                  {startDate && endDate && (
                    <div className="mt-4 text-center space-y-2">
                      <p className="text-sm text-gray-700">
                        {startDate} to {endDate} ({numberOfDays} days)
                      </p>
                      {numberOfDays >= 7 && (
                        <p className="text-sm font-medium text-green-600">
                          10% long-stay discount on vehicle price!
                        </p>
                      )}
                      {numberOfDays >= 5 && numberOfDays < 7 && (
                        <p className="text-sm font-medium text-amber-600">
                          {7 - numberOfDays} more day{7 - numberOfDays > 1 ? 's' : ''} for 10% off!
                        </p>
                      )}
                    </div>
                  )}
                  <p className="mt-3 text-sm text-gray-600 text-center">
                    Minimum {VALIDATION.MIN_RENTAL_DAYS} days · Stay 7+ days for 10% off
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="bg-white pt-6 md:pt-8 pb-12 md:pb-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Why us</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 text-center tracking-tight">
              Why choose NorthVenture
            </h2>
            <p className="text-center text-gray-400 mb-10 text-sm">
              Experience the Arctic in comfort with our carefully curated fleet and dedicated support
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Camper & RV Rental Fleet</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Handpicked campervans and RVs, fully equipped with modern amenities for your Arctic adventure</p>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Pickup at Bergen Airport</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Land at Bergen Airport (TOS) and we transfer you to our rental station on Bergen. 600 kr each way.</p>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Arctic Ready</h3>
                <p className="text-gray-500 text-sm leading-relaxed">All camper vans and RVs are winterised with studded tyres and auxiliary heating for Norwegian Arctic conditions</p>
              </div>
            </div>
          </div>
        </section>

        <CTASection
          title="Ready for your arctic adventure?"
          subtitle="Join hundreds of travelers who've experienced the magic of the northern lights from their own mobile home"
          buttonText="Book Now"
          buttonOnClick={scrollToBooking}
        />
      </main>

      <Footer />
    </div>
  );
}
