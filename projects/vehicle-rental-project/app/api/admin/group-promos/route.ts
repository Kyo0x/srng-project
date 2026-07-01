import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await query('SELECT * FROM group_seasonal_promos ORDER BY vehicle_group, season');
    return NextResponse.json(result.rows.map(row => ({
      ...row,
      promo_price: row.promo_price != null ? parseFloat(row.promo_price) : null,
      promo_start_date: row.promo_start_date ? new Date(row.promo_start_date).toISOString().split('T')[0] : null,
      promo_end_date: row.promo_end_date ? new Date(row.promo_end_date).toISOString().split('T')[0] : null,
    })));
  } catch (error) {
    console.error('Error fetching group promos:', error);
    return NextResponse.json({ error: 'Failed to fetch group promos' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    vehicle_group?: string;
    season?: string;
    promo_text?: string;
    promo_price?: number | null;
    promo_start_date?: string | null;
    promo_end_date?: string | null;
    enabled?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { vehicle_group, season, promo_text, promo_price, promo_start_date, promo_end_date, enabled } = body;

  if (!vehicle_group || !season || promo_text === undefined) {
    return NextResponse.json({ error: 'vehicle_group, season, and promo_text are required' }, { status: 400 });
  }

  const validSeasons = ['spring', 'summer', 'autumn', 'winter'];
  if (!validSeasons.includes(season)) {
    return NextResponse.json({ error: 'season must be one of: spring, summer, autumn, winter' }, { status: 400 });
  }

  try {
    const result = await query(
      `INSERT INTO group_seasonal_promos (vehicle_group, season, promo_text, promo_price, promo_start_date, promo_end_date, enabled, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (vehicle_group, season)
       DO UPDATE SET
         promo_text = EXCLUDED.promo_text,
         promo_price = EXCLUDED.promo_price,
         promo_start_date = EXCLUDED.promo_start_date,
         promo_end_date = EXCLUDED.promo_end_date,
         enabled = EXCLUDED.enabled,
         updated_at = NOW()
       RETURNING *`,
      [vehicle_group, season, promo_text, promo_price ?? null, promo_start_date ?? null, promo_end_date ?? null, enabled ?? false]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving group promo:', error);
    return NextResponse.json({ error: 'Failed to save group promo' }, { status: 500 });
  }
}
