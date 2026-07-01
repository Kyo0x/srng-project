import { NextResponse } from 'next/server';

// Demo API route - returns mock vehicle data without database connection
export const revalidate = 0;

export async function GET() {
  // Mock vehicle data for demo purposes
  const demoVehicles = [
    {
      id: 1,
      name: 'Sunlight Cliff 590 4x4 Greentrek',
      description: 'Premium Arctic-ready campervan with 4WD capability, perfect for Norwegian winter adventures. Features diesel heating, full kitchen, and comfortable sleeping arrangements for 2-3 people.',
      price_per_day: 1850,
      seats: 4,
      sleeping_spots: 3,
      length_cm: 598,
      transmission: '6-speed manual',
      fuel_type: 'Diesel',
      drivetrain: '4x4',
      features: ['4x4 All-wheel drive', 'Diesel heating system', 'Full kitchen with stove & fridge', 'Bathroom with shower & toilet', 'Solar panels', 'Arctic insulation'],
      image_urls: ['/fleet-hero.jpg'],
      available: true,
      vehicle_group: 'premium-4x4',
      promo_text: null,
      promo_price: null,
      promo_start_date: null,
      promo_end_date: null,
      group_promo_text: null,
      group_promo_price: null,
      group_promo_start_date: null,
      group_promo_end_date: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
  ];

  return NextResponse.json(demoVehicles);
}

// Demo POST endpoint - returns success without database
export async function POST() {
  return NextResponse.json(
    { error: 'Demo mode: Vehicle creation disabled' },
    { status: 403 }
  );
}

// Demo PUT endpoint - returns success without database
export async function PUT() {
  return NextResponse.json(
    { error: 'Demo mode: Vehicle updates disabled' },
    { status: 403 }
  );
}

// Demo DELETE endpoint - returns success without database
export async function DELETE() {
  return NextResponse.json(
    { error: 'Demo mode: Vehicle deletion disabled' },
    { status: 403 }
  );
}
