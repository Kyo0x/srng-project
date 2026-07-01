CREATE TABLE IF NOT EXISTS group_seasonal_promos (
  id SERIAL PRIMARY KEY,
  vehicle_group VARCHAR(100) NOT NULL,
  season VARCHAR(10) NOT NULL CHECK (season IN ('spring', 'summer', 'autumn', 'winter')),
  promo_text TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(vehicle_group, season)
);
