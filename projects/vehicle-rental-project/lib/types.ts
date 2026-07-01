export type DriveType = '2WD' | '4WD' | 'AWD';
export type Transmission = 'manual' | 'automatic';
export type InsuranceType = 'basic' | 'premium' | 'premium_plus';
export type BookingStatus = 'pending' | 'completed' | 'cancelled';

export interface Vehicle {
  id: number;
  name: string;
  seats: number;
  beds: number;
  drive_type: DriveType;
  transmission: Transmission;
  has_heating: boolean;
  price_per_day: number;
  image_urls: string[];
  description: string;
  license_plate?: string;
  inspection_pdf_url?: string;
  promo_price?: number;
  promo_start_date?: string;
  promo_end_date?: string;
  current_mileage?: number;
  is_paused: boolean;
  sort_order?: number;
  vehicle_group?: string | null;
  group_promo_text?: string | null;
  group_promo_price?: number | null;
  group_promo_start_date?: string | null;
  group_promo_end_date?: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  baby_seats_quantity: number;
  extra_driver: boolean;
  insurance_type: InsuranceType;
  selected_extras: Record<string, number>;
  total_price: number;
  stripe_session_id: string | null;
  status: BookingStatus;
  created_at: string;
}

export interface UnavailableDate {
  id: number;
  vehicle_id: number;
  date: string;
}

export interface BlackoutDate {
  id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ExtrasPrice {
  babySeats: number; // per seat
  extraDriver: number; // flat
  insurance: {
    basic: number;
    premium: number;
    premium_plus: number;
  };
}
