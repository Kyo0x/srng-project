'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Vehicle } from '@/lib/types';
import { isPromoActive, isGroupPromoActive } from '@/lib/utils';
import { VALIDATION } from '@/lib/constants';

interface MinStayRule {
  id: number;
  start_date: string;
  end_date: string;
  min_days: number;
  label: string | null;
  recurring: boolean;
}

interface CalendarProps {
  onDateRangeSelect: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
  initialVehicles?: Vehicle[];
  initialBookings?: any[];
  initialMinStayRules?: MinStayRule[];
  onActiveRuleChange?: (minDays: number, label: string | null) => void;
}

export const Calendar = ({
  onDateRangeSelect,
  startDate: initialStart,
  endDate: initialEnd,
  initialVehicles,
  initialBookings,
  initialMinStayRules,
  onActiveRuleChange,
}: CalendarProps) => {
  const hasInitialData = initialVehicles !== undefined && initialBookings !== undefined && initialMinStayRules !== undefined;

  const [startDate, setStartDate] = useState<string | undefined>(initialStart);
  const [endDate, setEndDate] = useState<string | undefined>(initialEnd);
  const [hoverDate, setHoverDate] = useState<string | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (initialStart) {
      const d = new Date(initialStart);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date();
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles ?? []);
  const [bookings, setBookings] = useState<any[]>(initialBookings ?? []);
  const [minStayRules, setMinStayRules] = useState<MinStayRule[]>(initialMinStayRules ?? []);
  const [loading, setLoading] = useState(!hasInitialData);

  useEffect(() => {
    if (initialVehicles !== undefined) setVehicles(initialVehicles);
  }, [initialVehicles]);

  useEffect(() => {
    if (initialBookings !== undefined) setBookings(initialBookings);
  }, [initialBookings]);

  useEffect(() => {
    if (initialMinStayRules !== undefined) setMinStayRules(initialMinStayRules);
  }, [initialMinStayRules]);

  useEffect(() => {
    if (hasInitialData) return;
    const fetchData = async () => {
      try {
        const [vehiclesRes, bookingsRes, rulesRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/bookings/availability'),
          fetch('/api/booking-rules'),
        ]);
        if (vehiclesRes.ok && bookingsRes.ok) {
          setVehicles(await vehiclesRes.json());
          setBookings(await bookingsRes.json());
        }
        if (rulesRes.ok) setMinStayRules(await rulesRes.json());
      } catch (error) {
        console.error('Failed to fetch calendar data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const _today = new Date();
  const todayString = `${_today.getFullYear()}-${String(_today.getMonth() + 1).padStart(2, '0')}-${String(_today.getDate()).padStart(2, '0')}`;

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const previousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const dateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-${String(day).padStart(2, '0')}`;
  };

  const getDaysBetween = (a: string, b: string) =>
    Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));

  const getActiveRule = (dateStr: string): { minDays: number; label: string | null } => {
    const mmdd = dateStr.slice(5);
    for (const rule of minStayRules) {
      const rStart = rule.start_date.slice(5);
      const rEnd = rule.end_date.slice(5);
      if (rule.recurring) {
        const inRange = rEnd >= rStart
          ? mmdd >= rStart && mmdd <= rEnd
          : mmdd >= rStart || mmdd <= rEnd;
        if (inRange) {
          const year = dateStr.slice(0, 4);
          const ruleEndThisYear = `${year}-${rule.end_date.slice(5)}`;
          const daysLeft = getDaysBetween(dateStr, ruleEndThisYear);
          return { minDays: Math.min(rule.min_days, Math.max(VALIDATION.MIN_RENTAL_DAYS, daysLeft + 1)), label: rule.label };
        }
      } else {
        if (dateStr >= rule.start_date && dateStr <= rule.end_date) {
          const daysLeft = getDaysBetween(dateStr, rule.end_date);
          return { minDays: Math.min(rule.min_days, Math.max(VALIDATION.MIN_RENTAL_DAYS, daysLeft + 1)), label: rule.label };
        }
      }
    }
    return { minDays: VALIDATION.MIN_RENTAL_DAYS, label: null };
  };

  const { minDays: activeMinDays, label: activeRuleLabel } = useMemo(
    () => startDate ? getActiveRule(startDate) : { minDays: VALIDATION.MIN_RENTAL_DAYS, label: null },
    [startDate, minStayRules]
  );

  const onActiveRuleChangeRef = useRef(onActiveRuleChange);
  onActiveRuleChangeRef.current = onActiveRuleChange;
  useEffect(() => {
    onActiveRuleChangeRef.current?.(activeMinDays, activeRuleLabel);
  }, [activeMinDays, activeRuleLabel]);

  const hasAvailableVehicles = (day: number) => {
    if (loading) return true;
    const activeVehicles = vehicles.filter((v) => !v.is_paused);
    if (activeVehicles.length === 0) return false;
    const dateStr = dateString(day);
    const checkDate = new Date(dateStr);
    return activeVehicles.some((vehicle) => {
      const isBooked = bookings.some(
        (booking) =>
          booking.vehicle_id === vehicle.id &&
          booking.status !== 'cancelled' &&
          new Date(booking.start_date) <= checkDate &&
          new Date(booking.end_date) >= checkDate
      );
      return !isBooked;
    });
  };

  // When picking an end date, check if any vehicle is free for the full [startDate, potentialEnd] range.
  // Mirrors the overlap logic used in the availability page.
  const isRangeBookable = (potentialEndStr: string): boolean => {
    if (!startDate || loading) return true;
    const [lo, hi] = potentialEndStr > startDate ? [startDate, potentialEndStr] : [potentialEndStr, startDate];
    const rangeStart = new Date(lo);
    const rangeEnd = new Date(hi);
    const activeVehicles = vehicles.filter(v => !v.is_paused);
    if (activeVehicles.length === 0) return false;
    return activeVehicles.some(vehicle =>
      !bookings.some(booking =>
        booking.vehicle_id === vehicle.id &&
        booking.status !== 'cancelled' &&
        new Date(booking.start_date) <= rangeEnd &&
        new Date(booking.end_date) >= rangeStart
      )
    );
  };

  // Returns true if every active vehicle is either booked on this day or has an
  // upcoming booking close enough that no minimum-length rental could start here.
  const isGapTooShort = (day: number): boolean => {
    const activeVehicles = vehicles.filter(v => !v.is_paused);
    if (activeVehicles.length === 0) return false;
    const dayStr = dateString(day);
    const dayDate = new Date(dayStr);
    const { minDays, label } = getActiveRule(dayStr);
    if (!label) return false; // only block gap days when a named min-stay rule is active

    return activeVehicles.every(vehicle => {
      const isBooked = bookings.some(b =>
        b.vehicle_id === vehicle.id &&
        b.status !== 'cancelled' &&
        new Date(b.start_date) <= dayDate &&
        new Date(b.end_date) >= dayDate
      );
      if (isBooked) return true;

      // Find the nearest future blockage start for this vehicle
      let nextStart: string | null = null;
      for (const b of bookings) {
        if (
          b.vehicle_id === vehicle.id &&
          b.status !== 'cancelled' &&
          b.start_date > dayStr &&
          (nextStart === null || b.start_date < nextStart)
        ) {
          nextStart = b.start_date;
        }
      }

      if (!nextStart) return false; // No upcoming booking = open-ended, always bookable
      return getDaysBetween(dayStr, nextStart) <= minDays;
    });
  };

  const hasPromoOnDate = (day: number) => {
    const dateStr = dateString(day);
    return vehicles.some((v) => isPromoActive(v, dateStr) || isGroupPromoActive(v, dateStr));
  };

  // The "preview end" is hoverDate while picking end, otherwise endDate
  const previewEnd = startDate && !endDate ? hoverDate : endDate;

  const handleDayClick = (dateStr: string, past: boolean, available: boolean) => {
    if (past || !available) return;

    // Both dates set → start fresh from this date
    if (startDate && endDate) {
      setStartDate(dateStr);
      setEndDate(undefined);
      onDateRangeSelect('', '');
      return;
    }

    // No start yet → set start
    if (!startDate) {
      setStartDate(dateStr);
      setEndDate(undefined);
      onDateRangeSelect('', '');
      return;
    }

    // Start set, no end → picking end date
    if (dateStr === startDate) {
      // Clicked start again → clear everything
      setStartDate(undefined);
      setEndDate(undefined);
      onDateRangeSelect('', '');
      return;
    }

    const [lo, hi] = dateStr > startDate ? [startDate, dateStr] : [dateStr, startDate];
    if (getDaysBetween(lo, hi) < activeMinDays) return;

    setStartDate(lo);
    setEndDate(hi);
    setHoverDate(undefined);
    onDateRangeSelect(lo, hi);
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setHoverDate(undefined);
    onDateRangeSelect('', '');
  };

  // Status hint
  const statusHint = (() => {
    if (!startDate && !endDate) return 'Select check-in date';
    if (startDate && !endDate) return 'Now select check-out date';
    if (startDate && endDate) {
      const nights = getDaysBetween(startDate, endDate);
      return `${startDate} → ${endDate} · ${nights} night${nights !== 1 ? 's' : ''}`;
    }
    return '';
  })();

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-gray-900">Select Dates</h3>
        {(startDate || endDate) && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status hint */}
      <p className={`text-xs transition-colors ${
        startDate && !endDate ? 'text-primary-600 font-medium' : 'text-gray-400'
      } ${activeRuleLabel ? 'mb-1.5' : 'mb-4'}`}>
        {statusHint}
      </p>

      {/* Active rule label */}
      {activeRuleLabel && startDate && (
        <p className="text-xs text-amber-600 font-medium mb-4">
          {activeRuleLabel} · min {activeMinDays} nights
        </p>
      )}

      {/* Month navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded transition"
          aria-label="Previous month"
        >
          <span className="text-lg">←</span>
        </button>
        <h4 className="text-base font-semibold text-gray-900">{monthName}</h4>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded transition"
          aria-label="Next month"
        >
          <span className="text-lg">→</span>
        </button>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2 font-semibold text-gray-600 uppercase">
            {d.slice(0, 2)}
          </div>
        ))}

        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const dateStr = dateString(day);
          const past = dateStr < todayString;
          const today = dateStr === todayString;
          const available = hasAvailableVehicles(day);
          const inUnbookableGap = !past && available && !loading && isGapTooShort(day);

          const isStart = dateStr === startDate;
          const isEnd = dateStr === endDate;
          const hasPromo = !past && available && hasPromoOnDate(day);

          // Range highlight uses previewEnd so hover shows a live preview
          const rangeStart = startDate;
          const rangeEnd = previewEnd;
          const inRange =
            rangeStart && rangeEnd && dateStr > rangeStart && dateStr < rangeEnd;
          const isPreviewEnd = !endDate && dateStr === hoverDate && startDate;

          // Too close to start (when picking end)
          const pickingEnd = !!startDate && !endDate;

          // End date that individually looks free but no single car covers [startDate, dateStr]
          const rangeBlocked =
            pickingEnd &&
            available &&
            !inUnbookableGap &&
            dateStr !== startDate! &&
            !isRangeBookable(dateStr);

          const tooClose =
            pickingEnd &&
            dateStr !== startDate &&
            !past &&
            available &&
            (() => {
              const [lo, hi] = dateStr > startDate! ? [startDate!, dateStr] : [dateStr, startDate!];
              return getDaysBetween(lo, hi) < activeMinDays;
            })();

          // Rounded ends of range
          let roundedClass = '';
          if (isStart && isEnd) roundedClass = 'rounded-full';
          else if (isStart) roundedClass = 'rounded-l-full';
          else if (isEnd || isPreviewEnd) roundedClass = 'rounded-r-full';

          let bgClass = '';
          if (past) {
            bgClass = 'text-gray-300 line-through cursor-not-allowed opacity-50';
          } else if (!available || inUnbookableGap || rangeBlocked) {
            bgClass = 'text-red-400 bg-red-50 cursor-not-allowed opacity-70';
          } else if (tooClose) {
            bgClass = 'text-gray-300 cursor-not-allowed opacity-40';
          } else if (isStart || isEnd) {
            bgClass = 'bg-primary-600 text-white font-semibold cursor-pointer';
          } else if (isPreviewEnd) {
            bgClass = 'bg-primary-400 text-white font-semibold cursor-pointer';
          } else if (inRange) {
            bgClass = 'bg-primary-100 text-gray-900 cursor-pointer';
          } else if (today) {
            bgClass = 'text-accent-500 font-bold hover:bg-gray-100 cursor-pointer';
          } else {
            bgClass = 'hover:bg-gray-100 text-gray-900 cursor-pointer';
          }

          return (
            <button
              key={day}
              onClick={() => handleDayClick(dateStr, past, available && !inUnbookableGap && !rangeBlocked)}
              onMouseEnter={() => {
                if (startDate && !endDate) setHoverDate(dateStr);
              }}
              onMouseLeave={() => {
                if (startDate && !endDate) setHoverDate(undefined);
              }}
              disabled={past || !available || inUnbookableGap || !!tooClose || rangeBlocked}
              title={
                !available
                  ? 'No vehicles available'
                  : inUnbookableGap
                  ? 'Gap too short to meet minimum stay requirement'
                  : rangeBlocked
                  ? 'No vehicles available for this date range'
                  : tooClose
                  ? `Minimum ${activeMinDays} nights required`
                  : undefined
              }
              className={`py-2.5 px-1 text-sm transition-colors ${roundedClass} ${bgClass}`}
            >
              <span className="flex flex-col items-center leading-none gap-0.5">
                {day}
                {hasPromo
                  ? <span className={`w-1 h-1 rounded-full ${isStart || isEnd ? 'bg-white/70' : inRange ? 'bg-primary-400' : 'bg-amber-400'}`} />
                  : <span className="w-1 h-1" />
                }
              </span>
            </button>
          );
        })}
      </div>
      {vehicles.some(v => (v.promo_price && v.promo_start_date && v.promo_end_date) || isGroupPromoActive(v, todayString)) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          Promotional price available
        </div>
      )}
    </div>
  );
};
