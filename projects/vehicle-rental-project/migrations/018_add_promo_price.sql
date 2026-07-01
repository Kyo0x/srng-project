ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS promo_price      DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS promo_start_date DATE,
  ADD COLUMN IF NOT EXISTS promo_end_date   DATE;
