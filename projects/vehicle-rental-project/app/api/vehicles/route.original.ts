import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/auth';
import { validateBody, vehicleSchema, vehicleUpdateSchema, vehiclePauseSchema, intIdParamSchema, validateQuery } from '@/lib/validation';

export const revalidate = 600;

// Helper to parse image_url field (can be JSON array or single URL string)
function parseImageUrls(imageUrl: string | null): string[] {
  if (!imageUrl) return [];
  try {
    const parsed = JSON.parse(imageUrl);
    return Array.isArray(parsed) ? parsed : [imageUrl];
  } catch {
    return imageUrl ? [imageUrl] : [];
  }
}

// pg returns DATE columns as JS Date objects — convert to YYYY-MM-DD string
function toDateString(value: Date | string | null): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return value;
}

// Public: Anyone can view vehicles
export async function GET() {
  try {
    const result = await query(
      `SELECT v.*,
         gsp.promo_text AS group_promo_text,
         gsp.promo_price AS group_promo_price,
         gsp.promo_start_date AS group_promo_start_date,
         gsp.promo_end_date AS group_promo_end_date
       FROM vehicles v
       LEFT JOIN LATERAL (
         SELECT promo_text, promo_price, promo_start_date, promo_end_date
         FROM group_seasonal_promos
         WHERE vehicle_group = v.vehicle_group
           AND enabled = true
           AND (
             (promo_start_date IS NULL AND promo_end_date IS NULL)
             OR CURRENT_DATE BETWEEN promo_start_date AND promo_end_date
           )
         ORDER BY updated_at DESC
         LIMIT 1
       ) gsp ON true
       ORDER BY v.created_at DESC`
    );
    const vehicles = result.rows.map(row => ({
      ...row,
      image_urls: parseImageUrls(row.image_url),
      price_per_day: parseFloat(row.price_per_day),
      promo_price: row.promo_price != null ? parseFloat(row.promo_price) : null,
      promo_start_date: toDateString(row.promo_start_date),
      promo_end_date: toDateString(row.promo_end_date),
      group_promo_text: row.group_promo_text ?? null,
      group_promo_price: row.group_promo_price != null ? parseFloat(row.group_promo_price) : null,
      group_promo_start_date: toDateString(row.group_promo_start_date),
      group_promo_end_date: toDateString(row.group_promo_end_date),
    }));
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

// Protected: Only authenticated admins can create vehicles
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(request, vehicleSchema);
  if (!validation.success) {
    return validation.error;
  }

  const { name, seats, beds, drive_type, transmission, has_heating, price_per_day, image_urls, description, license_plate, promo_price, promo_start_date, promo_end_date, sort_order, vehicle_group } = validation.data;

  try {
    const result = await query(
      `INSERT INTO vehicles (name, seats, beds, drive_type, transmission, has_heating, price_per_day, image_url, description, license_plate, promo_price, promo_start_date, promo_end_date, sort_order, vehicle_group)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [name, seats, beds, drive_type, transmission, has_heating, price_per_day, JSON.stringify(image_urls), description || null, license_plate || null, promo_price || null, promo_start_date || null, promo_end_date || null, sort_order ?? 999, vehicle_group ?? null]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}

// Protected: Only authenticated admins can update vehicles
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(request, vehicleUpdateSchema);
  if (!validation.success) {
    return validation.error;
  }

  const { id, name, seats, beds, drive_type, transmission, has_heating, price_per_day, image_urls, description, inspection_pdf_url, license_plate, promo_price, promo_start_date, promo_end_date, is_paused, sort_order, vehicle_group } = validation.data;

  try {
    const result = await query(
      `UPDATE vehicles
       SET name = $1, seats = $2, beds = $3, drive_type = $4, transmission = $5, has_heating = $6,
           price_per_day = $7, image_url = $8, description = $9, inspection_pdf_url = $10, license_plate = $11,
           promo_price = $12, promo_start_date = $13, promo_end_date = $14,
           is_paused = COALESCE($16, is_paused),
           sort_order = COALESCE($17, sort_order),
           vehicle_group = $18
       WHERE id = $15 RETURNING *`,
      [name, seats, beds, drive_type, transmission, has_heating, price_per_day, JSON.stringify(image_urls), description || null, inspection_pdf_url ?? null, license_plate || null, promo_price || null, promo_start_date || null, promo_end_date || null, id, is_paused ?? null, sort_order ?? null, vehicle_group ?? null]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

// Protected: Toggle is_paused on a vehicle
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(request, vehiclePauseSchema);
  if (!validation.success) {
    return validation.error;
  }

  const { id, is_paused } = validation.data;

  try {
    const result = await query(
      'UPDATE vehicles SET is_paused = $1 WHERE id = $2 RETURNING *',
      [is_paused, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling vehicle pause:', error);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

// Protected: Only authenticated admins can delete vehicles
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const validation = validateQuery(searchParams, intIdParamSchema);
  if (!validation.success) {
    return validation.error;
  }

  try {
    const result = await query('DELETE FROM vehicles WHERE id = $1 RETURNING id', [validation.data.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
