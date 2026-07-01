CREATE TABLE IF NOT EXISTS blackout_dates (
  id          SERIAL PRIMARY KEY,
  vehicle_id  INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  reason      TEXT,
  created_by  VARCHAR(255),
  created_at  TIMESTAMP DEFAULT NOW()
);
