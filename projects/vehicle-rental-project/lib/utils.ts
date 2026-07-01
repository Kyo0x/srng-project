import { CURRENCY } from './constants';
import type { Vehicle } from './types';

export function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export function formatCurrency(amount: number, showDecimals = true) {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE.toUpperCase(),
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export function formatDateRange(start: string | Date, end: string | Date) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function calculateDays(start: string | Date, end: string | Date) {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  return Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateRentalPrice(pricePerDay: number, days: number) {
  const fullPrice = pricePerDay * days;
  const discountPercent = days >= 7 ? 10 : 0;
  const discountAmount = Math.round(fullPrice * discountPercent / 100);
  return {
    discountPercent,
    discountAmount,
    totalPrice: fullPrice - discountAmount,
  };
}

// Whether the promo price applies to a specific booking start date
export function isPromoActive(vehicle: Vehicle, date: string): boolean {
  return !!(
    vehicle.promo_price &&
    vehicle.promo_start_date &&
    vehicle.promo_end_date &&
    date >= vehicle.promo_start_date &&
    date < vehicle.promo_end_date
  );
}

// Whether the promo should be advertised (today is before the promo ends)
export function isPromoVisible(vehicle: Vehicle, today: string): boolean {
  return !!(
    vehicle.promo_price &&
    vehicle.promo_end_date &&
    today < vehicle.promo_end_date
  );
}

// Group promo equivalents — same logic, reads group_promo_* fields
// No dates set means the promo is active for the whole season
export function isGroupPromoActive(vehicle: Vehicle, date: string): boolean {
  if (!vehicle.group_promo_price) return false;
  if (!vehicle.group_promo_start_date || !vehicle.group_promo_end_date) return true;
  return date >= vehicle.group_promo_start_date && date < vehicle.group_promo_end_date;
}

export function isGroupPromoVisible(vehicle: Vehicle, today: string): boolean {
  if (!vehicle.group_promo_price) return false;
  if (!vehicle.group_promo_end_date) return true;
  return today < vehicle.group_promo_end_date;
}

export function getEffectivePrice(vehicle: Vehicle, date: string): number {
  if (isPromoActive(vehicle, date)) return vehicle.promo_price!;
  if (isGroupPromoActive(vehicle, date)) return vehicle.group_promo_price!;
  return vehicle.price_per_day;
}

export function promoDiscountPercent(vehicle: Vehicle): number {
  if (!vehicle.promo_price) return 0;
  return Math.round((1 - vehicle.promo_price / vehicle.price_per_day) * 100);
}

export function truncate(text: string, maxLength: number) {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function generateOrderId(vehicleId: string | number) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const vid = String(typeof vehicleId === 'number' ? vehicleId : parseInt(vehicleId) || 0).padStart(2, '0');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `AT-${date}-${vid}-${suffix}`;
}
