ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS current_mileage INTEGER;

CREATE TABLE IF NOT EXISTS mileage_logs (
  id           SERIAL PRIMARY KEY,
  vehicle_id   INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  booking_id   INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  mileage      INTEGER NOT NULL,
  note         TEXT,
  logged_at    TIMESTAMP DEFAULT NOW(),
  logged_by    VARCHAR(255)
);
