export const COMPANY_NAME = 'NorthVenture';
export const COMPANY_TAGLINE = 'Your gateway to unforgettable Northern adventures';
export const COMPANY_DESCRIPTION = 'We specialize in premium RV rentals designed for Arctic exploration.';
export const COMPANY_PHONE = '+47 555 12 345';
export const COMPANY_WHATSAPP = '+47 555 67 890';
export const COMPANY_EMAIL = 'hello@northventure-demo.com';
export const COMPANY_WEBSITE = 'northventure-demo.com';

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@northventure-demo.com').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

export const CURRENCY = {
  CODE: 'nok',
  SYMBOL: 'kr',
  LOCALE: 'nb-NO',
} as const;

export const PRICING = {
  BABY_SEAT_PRICE: 15,
  EXTRA_DRIVER_PRICE: 100,
  INSURANCE: {
    BASIC: { type: 'basic' as const, label: 'Basic (included)', price: 0, deposit: 16000, description: 'Included', details: ['Security deposit: 16,000 kr', 'Deductible equals security deposit', 'Liability coverage included', 'Windshield damage not covered', 'Roadside assistance not included'] },
    PREMIUM: { type: 'premium' as const, label: 'Premium', price: 200, deposit: 12000, description: '200 kr/day', details: ['Security deposit: 12,000 kr', 'Deductible equals security deposit', 'Free extra driver included', 'Windshield damage not covered', 'Roadside assistance not included'] },
    PREMIUM_PLUS: { type: 'premium_plus' as const, label: 'Premium+', price: 400, deposit: 7000, description: '400 kr/day', details: ['Security deposit: 7,000 kr', 'Deductible equals security deposit', 'Free extra driver included', 'Windshield damage covered', 'Roadside assistance included'] },
  },
} as const;

export const INSURANCE_OPTIONS = [
  PRICING.INSURANCE.BASIC,
  PRICING.INSURANCE.PREMIUM,
  PRICING.INSURANCE.PREMIUM_PLUS,
];

export const INSURANCE_PRICES: Record<string, number> = {
  basic: PRICING.INSURANCE.BASIC.price,
  premium: PRICING.INSURANCE.PREMIUM.price,
  premium_plus: PRICING.INSURANCE.PREMIUM_PLUS.price,
};

export const UI_TEXT = {
  FOOTER_COPYRIGHT: 'All rights reserved',
  FOOTER_TAGLINE: 'Discover the magic of the Arctic.',
  ADMIN_TITLE: 'Admin Dashboard',
  LOGIN_TITLE: 'Admin Login',
  LOADING_TEXT: 'Loading...',
  CHECKING_AUTH: 'Checking authentication...',
} as const;

export const FEATURES = {
  BUILT_FOR_NORTH: {
    title: 'Built for the North',
    description: 'Our fleet is purpose-built for Arctic winters. Heavy-duty insulation, robust heating systems, and equipment tested in extreme conditions. We know what works when it\'s -20°C outside.'
  },
  LOCAL_KNOWLEDGE: {
    title: 'Local Knowledge',
    description: 'Our team lives here. We know the best viewing spots, safest routes, and hidden gems. Get real advice from people who actually chase the lights, not just operate rentals.'
  },
  ALWAYS_THERE: {
    title: 'Always There',
    description: 'Problems happen on the road. We\'re available 24/7 with real mechanics and support staff ready to help. Not a call center, but actual people who care about your adventure.'
  }
} as const;

export const API_ENDPOINTS = {
  VEHICLES: '/api/vehicles',
  BOOKINGS: '/api/bookings',
  ADMIN_STATS: '/api/admin/stats',
  AUTH: '/api/auth',
  CHECKOUT: '/api/checkout',
} as const;

export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_VEHICLES: '/admin/vehicles',
  ADMIN_BOOKINGS: '/admin/bookings',
  AVAILABILITY: '/availability',
  BOOKING_SUCCESS: '/booking-success',
  CANCEL_BOOKING: '/cancel-booking',
  MODIFY_BOOKING: '/modify-booking',
  API_CANCEL_BOOKING: '/api/bookings/cancel',
  API_MODIFY_BOOKING: '/api/bookings/modify',
  API_MODIFY_BOOKING_CHECKOUT: '/api/bookings/modify/checkout',
  API_LOOKUP_BOOKING: '/api/bookings/lookup',
  BOOKING_DETAILS: '/booking-details',
  API_BOOKING_DRIVERS: '/api/bookings/drivers',
  API_UPLOAD: '/api/upload',
} as const;

export const REFUND_POLICY = {
  FREE_CANCELLATION_HOURS: 24,
  FULL_REFUND_DAYS: 30,
  HALF_REFUND_DAYS: 22,
  QUARTER_REFUND_DAYS: 15,
  NO_REFUND_DAYS: 14,
  FULL_REFUND_PERCENT: 100,
  HALF_REFUND_PERCENT: 50,
  QUARTER_REFUND_PERCENT: 25,
} as const;

export const isWithinFreeCancellationWindow = (createdAt: string | Date): boolean => {
  const bookingTime = new Date(createdAt);
  const now = new Date();
  const hoursSinceBooking = (now.getTime() - bookingTime.getTime()) / (1000 * 60 * 60);
  return hoursSinceBooking <= REFUND_POLICY.FREE_CANCELLATION_HOURS;
};

export const calculateRefundPercentage = (startDate: string | Date, createdAt?: string | Date): number => {
  if (createdAt && isWithinFreeCancellationWindow(createdAt)) {
    return REFUND_POLICY.FULL_REFUND_PERCENT;
  }

  const start = new Date(startDate);
  const now = new Date();
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > REFUND_POLICY.FULL_REFUND_DAYS) return REFUND_POLICY.FULL_REFUND_PERCENT;
  if (diffDays >= REFUND_POLICY.HALF_REFUND_DAYS) return REFUND_POLICY.HALF_REFUND_PERCENT;
  if (diffDays >= REFUND_POLICY.QUARTER_REFUND_DAYS) return REFUND_POLICY.QUARTER_REFUND_PERCENT;
  return 0;
};

export const calculateRefundAmount = (totalPrice: number, startDate: string | Date, createdAt?: string | Date): number => {
  const percentage = calculateRefundPercentage(startDate, createdAt);
  return Math.round((totalPrice * percentage) / 100 * 100) / 100;
};

export const getDaysUntilStart = (startDate: string | Date): number => {
  const start = new Date(startDate);
  const now = new Date();
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  PENDING_DETAILS: 'pending_details',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const VALIDATION = {
  MIN_BABY_SEATS: 0,
  MAX_BABY_SEATS: 5,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_RENTAL_DAYS: 2,
} as const;

export const getCurrentYear = () => new Date().getFullYear();

export const calculateExtrasPrice = (
  babySeats: number,
  hasExtraDriver: boolean,
  insuranceType: keyof typeof PRICING.INSURANCE
): number => {
  return babySeats * PRICING.BABY_SEAT_PRICE +
    (hasExtraDriver ? PRICING.EXTRA_DRIVER_PRICE : 0) +
    PRICING.INSURANCE[insuranceType].price;
};

export const calculateTotalBookingPrice = (
  pricePerDay: number,
  numberOfDays: number,
  babySeats: number = 0,
  hasExtraDriver: boolean = false,
  insuranceType: string = 'basic'
): { basePrice: number; extrasPrice: number; totalPrice: number } => {
  const fullPrice = pricePerDay * numberOfDays;
  const discountPercent = numberOfDays >= 7 ? 10 : 0;
  const basePrice = fullPrice - Math.round(fullPrice * discountPercent / 100);

  let extrasPrice = 0;
  if (babySeats > 0) extrasPrice += babySeats * PRICING.BABY_SEAT_PRICE;
  if (hasExtraDriver) extrasPrice += PRICING.EXTRA_DRIVER_PRICE;
  extrasPrice += INSURANCE_PRICES[insuranceType] || 0;

  return { basePrice, extrasPrice, totalPrice: basePrice + extrasPrice };
};

export const formatPrice = (amount: number): string => {
  return `${amount.toFixed(2)} ${CURRENCY.SYMBOL}`;
};

export const toStripeAmount = (amount: number): number => Math.round(amount * 100);
export const fromStripeAmount = (amount: number): number => amount / 100;

export type ExtraPriceType = 'per_day' | 'one_time' | 'purchase';

export interface Extra {
  id: string;
  name: string;
  nameNo: string;
  description?: string;
  price: number;
  priceType: ExtraPriceType;
  maxQuantity: number;
  category: 'service' | 'essentials' | 'vehicle' | 'camping' | 'winter';
  /** Maximum total price per unit for per_day extras (price caps out at this amount) */
  maxPrice?: number;
  /** Global stock limit across all bookings — requires availability check */
  globalMax?: number;
}

export const EXTRAS_SERVICES: Extra[] = [
  { id: 'airport_pickup', name: 'Airport Pickup (09:00–18:00)', nameNo: 'Henting flyplass (09:00–18:00)', description: 'We pick you up at Tromsø Airport', price: 990, priceType: 'one_time', maxQuantity: 1, category: 'service' },
  { id: 'airport_dropoff', name: 'Airport Drop-off (09:00–18:00)', nameNo: 'Dropp av flyplass (09:00–18:00)', description: 'We drop you off at Tromsø Airport', price: 990, priceType: 'one_time', maxQuantity: 1, category: 'service' },
  { id: 'cleaning_service', name: 'Cleaning Service', nameNo: 'Rengjøringsservice', description: 'Professional cleaning of the vehicle', price: 750, priceType: 'one_time', maxQuantity: 1, category: 'service' },
  { id: 'late_return', name: 'Late Return (until 18:00)', nameNo: 'Sen innlevering (til 18:00)', description: 'Extend your return time from 12:00 to 18:00', price: 800, priceType: 'one_time', maxQuantity: 1, category: 'service' },
];

export const EXTRAS_ESSENTIALS: Extra[] = [
  { id: 'bedding', name: 'Bedding', nameNo: 'Sengklær', description: 'Duvet, pillow and cover', price: 100, priceType: 'per_day', maxQuantity: 6, category: 'essentials', maxPrice: 300 },
  { id: 'towels', name: 'Towels', nameNo: 'Håndduker', description: '1 small and 1 large towel', price: 60, priceType: 'per_day', maxQuantity: 6, category: 'essentials', maxPrice: 180 },
];

export const EXTRAS_VEHICLE: Extra[] = [
  { id: 'pet_fee', name: 'Pet Fee', nameNo: 'Kjæledyr avgift', description: 'Bring your furry friend along', price: 100, priceType: 'per_day', maxQuantity: 1, category: 'vehicle' },
  { id: 'baby_seat_small', name: 'Baby Seat (0–17 kg)', nameNo: 'Barnesete (0–17 kg)', description: 'For infants and small children', price: 100, priceType: 'per_day', maxQuantity: 3, category: 'vehicle' },
  { id: 'baby_seat_large', name: 'Booster Seat (17–36 kg)', nameNo: 'Barnesete (17–36 kg)', description: 'For older children', price: 50, priceType: 'per_day', maxQuantity: 3, category: 'vehicle', maxPrice: 200 },
  { id: 'extra_driver', name: 'Extra Driver', nameNo: 'Ekstra sjåfør', description: 'Add another authorized driver', price: 100, priceType: 'per_day', maxQuantity: 2, category: 'vehicle' },
];

export const EXTRAS_CAMPING: Extra[] = [
{ id: 'stove', name: 'Camping Stove with Gas', nameNo: 'Primus på gass (inkl. gass)', description: 'Portable stove including gas', price: 50, priceType: 'per_day', maxQuantity: 1, category: 'camping' },
  { id: 'sup_package', name: 'SUP Board Package', nameNo: 'SUP-pakke', description: 'SUP board with paddle included', price: 100, priceType: 'per_day', maxQuantity: 2, globalMax: 2, category: 'camping' },
  { id: 'bicycle_package', name: 'Bicycle Package', nameNo: 'Sykkelpakke', description: 'Bicycle with helmet included', price: 200, priceType: 'per_day', maxQuantity: 2, globalMax: 2, category: 'camping' },
  { id: 'fishing_set', name: 'Fishing Set', nameNo: 'Fiskesett', description: 'Complete sea fishing set — everything you need to fish from land', price: 999, priceType: 'purchase', maxQuantity: 2, category: 'camping' },
];

export const EXTRAS_WINTER: Extra[] = [
  { id: 'snowshoes_set', name: 'Snowshoe Set with Poles', nameNo: 'Truger sett med staver', description: 'Complete snowshoe kit with poles', price: 200, priceType: 'per_day', maxQuantity: 6, category: 'winter' },
  { id: 'snowshoes', name: 'Snowshoes', nameNo: 'Truger', description: 'Walk on deep snow', price: 150, priceType: 'per_day', maxQuantity: 6, category: 'winter' },
  { id: 'headlamp', name: 'Headlamp', nameNo: 'Hodelykt', description: 'Essential for dark Arctic nights (purchase)', price: 300, priceType: 'purchase', maxQuantity: 6, category: 'winter' },
  { id: 'crampons', name: 'Crampons', nameNo: 'Brodder', description: 'Ice grips for your shoes (purchase)', price: 150, priceType: 'purchase', maxQuantity: 6, category: 'winter' },
];

export const ALL_EXTRAS: Extra[] = [...EXTRAS_SERVICES, ...EXTRAS_ESSENTIALS, ...EXTRAS_VEHICLE, ...EXTRAS_CAMPING, ...EXTRAS_WINTER];

export const EXTRAS_BY_CATEGORY = {
  service: { title: 'Services', titleNo: 'Ekstra service', items: EXTRAS_SERVICES },
  essentials: { title: 'Vehicle Essentials', titleNo: 'Nødvendigheter til kjøretøyet', items: EXTRAS_ESSENTIALS },
  vehicle: { title: 'Vehicle Extras', titleNo: 'Ekstra utstyr til kjøretøyet', items: EXTRAS_VEHICLE },
  camping: { title: 'Camping Equipment', titleNo: 'Ekstra utstyr til camping', items: EXTRAS_CAMPING },
  winter: { title: 'Winter Extras', titleNo: 'Ekstra for vinter', items: EXTRAS_WINTER },
} as const;

export const getExtraById = (id: string): Extra | undefined => ALL_EXTRAS.find(e => e.id === id);

export type SelectedExtras = Record<string, number>;

export const calculateExtrasCost = (
  selectedExtras: SelectedExtras,
  numberOfDays: number,
  insuranceType?: string
): { perDayCost: number; oneTimeCost: number; purchaseCost: number; totalCost: number } => {
  let perDayCost = 0, oneTimeCost = 0, purchaseCost = 0;

  const freeExtraDriver = insuranceType === 'premium' || insuranceType === 'premium_plus';

  for (const [extraId, quantity] of Object.entries(selectedExtras)) {
    if (quantity <= 0) continue;
    const extra = getExtraById(extraId);
    if (!extra) continue;

    const paidQuantity = (freeExtraDriver && extraId === 'extra_driver')
      ? Math.max(0, quantity - 1)
      : quantity;
    if (paidQuantity <= 0) continue;

    const cost = extra.price * paidQuantity;
    if (extra.priceType === 'per_day') {
      // Apply per-unit price cap if defined (e.g. bedding max 300kr/set regardless of days)
      const costPerUnit = extra.maxPrice !== undefined
        ? Math.min(extra.price * numberOfDays, extra.maxPrice)
        : extra.price * numberOfDays;
      perDayCost += costPerUnit * paidQuantity;
    } else if (extra.priceType === 'one_time') oneTimeCost += cost;
    else purchaseCost += cost;
  }

  return { perDayCost, oneTimeCost, purchaseCost, totalCost: perDayCost + oneTimeCost + purchaseCost };
};
