import { z } from 'zod';
import { NextResponse } from 'next/server';
import { VALIDATION } from '@/lib/constants';

const vehiclePromoRefinements = <T extends z.ZodObject<z.ZodRawShape>>(schema: T) =>
  schema
    .refine(
      (data) => {
        if (data.promo_start_date && data.promo_end_date) {
          return data.promo_end_date > data.promo_start_date;
        }
        return true;
      },
      { message: 'Promo end date must be after start date', path: ['promo_end_date'] }
    )
    .refine(
      (data) => {
        if (data.promo_price != null && data.price_per_day != null) {
          return data.promo_price < data.price_per_day;
        }
        return true;
      },
      { message: 'Promotional price must be less than regular price', path: ['promo_price'] }
    );

const vehicleBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  seats: z.number().int().min(1, 'Must have at least 1 seat').max(20, 'Max 20 seats'),
  beds: z.number().int().min(1, 'Must have at least 1 bed').max(10, 'Max 10 beds'),
  drive_type: z.enum(['2WD', '4WD', 'AWD'], { message: 'Invalid drive type' }),
  transmission: z.enum(['manual', 'automatic'], { message: 'Invalid transmission type' }),
  has_heating: z.boolean(),
  price_per_day: z.number().positive('Price must be positive').max(100000, 'Price too high'),
  image_urls: z.array(z.string()).default([]).transform(urls => urls.filter(url => url.trim() !== '')),
  description: z.string().max(2000, 'Description too long').optional(),
  license_plate: z.string().max(20, 'License plate too long').optional(),
  promo_price: z.number().positive('Promo price must be positive').optional(),
  promo_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  promo_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  sort_order: z.number().int().min(1).max(9999).optional(),
  vehicle_group: z.string().max(100).nullable().optional(),
});

export const vehicleSchema = vehiclePromoRefinements(vehicleBaseSchema);

export const vehicleUpdateSchema = vehiclePromoRefinements(
  vehicleBaseSchema.extend({
    id: z.union([
      z.string().regex(/^\d+$/, 'Invalid vehicle ID').transform(Number),
      z.number().int().positive()
    ]),
    inspection_pdf_url: z.string().nullable().optional(),
    is_paused: z.boolean().optional(),
  })
);

export const vehiclePauseSchema = z.object({
  id: z.union([
    z.string().regex(/^\d+$/, 'Invalid vehicle ID').transform(Number),
    z.number().int().positive()
  ]),
  is_paused: z.boolean(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehicleUpdateInput = z.infer<typeof vehicleUpdateSchema>;

export const bookingSchema = z.object({
  vehicle_id: z.string().uuid('Invalid vehicle ID'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  first_name: z.string().min(1, 'First name required').max(50, 'Name too long'),
  last_name: z.string().min(1, 'Last name required').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number too short').max(20, 'Phone number too long'),
  baby_seats_quantity: z.number()
    .int()
    .min(VALIDATION.MIN_BABY_SEATS, `Min ${VALIDATION.MIN_BABY_SEATS} baby seats`)
    .max(VALIDATION.MAX_BABY_SEATS, `Max ${VALIDATION.MAX_BABY_SEATS} baby seats`)
    .default(0),
  extra_driver: z.boolean().default(false),
  insurance_type: z.enum(['basic', 'premium', 'premium_plus']).default('basic'),
  total_price: z.number().positive('Price must be positive'),
  stripe_session_id: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
}).refine(
  (data) => new Date(data.end_date) > new Date(data.start_date),
  { message: 'End date must be after start date', path: ['end_date'] }
);

export const bookingUpdateSchema = z.object({
  id: z.string().uuid('Invalid booking ID'),
  status: z.enum(['pending', 'completed', 'cancelled'], { message: 'Invalid status' }),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type BookingUpdateInput = z.infer<typeof bookingUpdateSchema>;

export const checkoutSchema = z.object({
  vehicleId: z.union([z.string(), z.number()], { message: 'Invalid vehicle ID' }),
  vehicleName: z.string().min(1, 'Vehicle name required'),
  pricePerDay: z.number().positive('Price must be positive'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  babySeatsQuantity: z.number().int().min(0).max(VALIDATION.MAX_BABY_SEATS).default(0),
  extraDriver: z.boolean().default(false),
  insuranceType: z.enum(['basic', 'premium', 'premium_plus']).default('basic'),
  selectedExtras: z.record(z.string(), z.number()).default({}),
  totalPrice: z.number().positive('Price must be positive').optional(),
  contactEmail: z.string().email('Invalid email'),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().min(6).max(20).optional(),
  holdToken: z.string().uuid().optional(),
  pickupTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: 'End date must be after start date', path: ['endDate'] }
);

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const driverSchema = z.object({
  is_primary: z.boolean(),
  full_name: z.string().min(1, 'Full name required').max(100, 'Name too long'),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  license_number: z.string().min(1, 'License number required').max(50, 'License number too long'),
  license_expiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  license_country: z.string().min(1, 'Country required').max(100, 'Country too long'),
  address_line1: z.string().min(1, 'Address required').max(200, 'Address too long'),
  address_line2: z.string().max(200, 'Address too long').optional(),
  city: z.string().min(1, 'City required').max(100, 'City too long'),
  postal_code: z.string().min(1, 'Postal code required').max(20, 'Postal code too long'),
  country: z.string().min(1, 'Country required').max(100, 'Country too long'),
  license_photo_front: z.string().max(500).optional(),
  license_photo_back: z.string().max(500).optional(),
});

export const bookingDriversSchema = z.object({
  uploadToken: z.string().uuid('Invalid token'),
  drivers: z.array(driverSchema).min(1, 'At least one driver required').max(3, 'Maximum 3 drivers'),
  consentGiven: z.boolean().refine((v) => v === true, { message: 'You must accept the privacy policy to proceed' }),
});

export type DriverInput = z.infer<typeof driverSchema>;
export type BookingDriversInput = z.infer<typeof bookingDriversSchema>;

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const intIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid ID format').transform(Number),
});

export const dateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid end date'),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: 'End date must be after start date' }
);

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: NextResponse };

export const validateBody = async <T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> => {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      console.error('[validateBody] Validation failed:', JSON.stringify({ body, errors }, null, 2));

      return {
        success: false,
        error: NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 }),
      };
    }

    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }
};

export const validateQuery = <T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): ValidationResult<T> => {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return {
      success: false,
      error: NextResponse.json({ error: 'Invalid query parameters', details: errors }, { status: 400 }),
    };
  }

  return { success: true, data: result.data };
};

export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '');
};

export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(sanitized[key] as string);
    }
  }
  return sanitized;
};
