'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/lib/types';
import { promoDiscountPercent, formatCurrency } from '@/lib/utils';

interface GroupPromoEntry {
  vehicle_group: string;
  promo_text: string;
  promo_price: number | null;
  regular_price: number | null;
  promo_end_date: string | null;
}

interface PromoPopupProps {
  vehicles: Vehicle[];
  groupPromos?: GroupPromoEntry[];
}

function getPromoFingerprint(vehicles: Vehicle[], groupPromos: GroupPromoEntry[]): string {
  const vehiclePart = vehicles
    .map(v => `${v.id}:${v.promo_price}:${v.promo_end_date}`)
    .sort()
    .join('|');
  const groupPart = groupPromos
    .map(g => `${g.vehicle_group}:${g.promo_text}`)
    .sort()
    .join('|');
  return `${vehiclePart}__${groupPart}`;
}

export function PromoPopup({ vehicles, groupPromos = [] }: PromoPopupProps) {
  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (vehicles.length === 0 && groupPromos.length === 0) return;
    const fingerprint = getPromoFingerprint(vehicles, groupPromos);
    const seen = localStorage.getItem('seenPromo');
    if (seen !== fingerprint) {
      const timer = setTimeout(() => {
        setVisible(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [vehicles, groupPromos]);

  const dismiss = () => {
    localStorage.setItem('seenPromo', getPromoFingerprint(vehicles, groupPromos));
    setAnimated(false);
    setTimeout(() => setVisible(false), 220);
  };

  const handleBookNow = () => {
    dismiss();
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 230);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4 cursor-pointer"
      style={{
        backgroundColor: animated ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
        transition: 'background-color 220ms ease',
      }}
      onClick={dismiss}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-y-auto max-h-[90vh]"
        style={{
          transform: animated ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          opacity: animated ? 1 : 0,
          transition: 'transform 260ms cubic-bezier(0.16,1,0.3,1), opacity 220ms ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-primary-700 px-6 py-5 text-white">
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white/80 hover:text-white"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Limited time</p>
          <h2 className="text-xl font-bold leading-tight">Special Offer</h2>
          <p className="text-sm text-white/70 mt-0.5">Reduced rates on selected campervans</p>
        </div>

        {/* Vehicle price promo cards */}
        {vehicles.length > 0 && (
          <div className="px-5 pt-4 pb-3 space-y-2.5 max-h-[45vh] overflow-y-auto">
            {vehicles.map((vehicle) => {
              const discount = promoDiscountPercent(vehicle);
              const endDate = vehicle.promo_end_date
                ? new Date(vehicle.promo_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : null;

              return (
                <div key={vehicle.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-gray-900 text-sm leading-snug">{vehicle.name}</p>
                    <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0">
                      -{discount}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary-700">{formatCurrency(vehicle.promo_price!, false)} kr</span>
                    <span className="text-xs text-gray-400">/day</span>
                    <span className="text-sm text-gray-400 line-through ml-auto">{formatCurrency(vehicle.price_per_day, false)} kr</span>
                  </div>
                  {endDate && (
                    <p className="text-xs text-gray-400 mt-1">Offer ends {endDate}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Seasonal group promo cards */}
        {groupPromos.length > 0 && (
          <div className="px-5 pt-4 pb-3 space-y-2.5">
            {groupPromos.map((gp) => {
              const endDate = gp.promo_end_date
                ? new Date(gp.promo_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : null;
              return (
                <div key={gp.vehicle_group} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  {gp.promo_text && (
                    <p className="font-semibold text-gray-900 text-sm leading-snug mb-2">{gp.promo_text}</p>
                  )}
                  {gp.promo_price != null && (
                    <>
                      {gp.regular_price != null && (
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm text-gray-400 line-through">{formatCurrency(gp.regular_price, false)} kr</span>
                          <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            -{Math.round((1 - gp.promo_price / gp.regular_price) * 100)}%
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-primary-700">{formatCurrency(gp.promo_price, false)} kr</span>
                        <span className="text-xs text-gray-400">/day</span>
                      </div>
                    </>
                  )}
                  {endDate && (
                    <p className="text-xs text-gray-400 mt-1">Offer ends {endDate}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Long-stay stacking note */}
        <div className="mx-5 mb-4 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
          <p className="text-xs font-semibold text-emerald-700">+ 10% off for stays of 7+ days</p>
          <p className="text-xs text-emerald-600 mt-0.5">Stacks on top of the promo price</p>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex flex-col gap-2 border-t border-gray-100 pt-3">
          <button
            onClick={handleBookNow}
            className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Book Now
          </button>
          <button
            onClick={dismiss}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
