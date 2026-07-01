-- Migration: Add booking_holds table for temporary date locking
-- When a user lands on the booking page, their chosen dates are soft-locked
-- for 15 minutes so other users can't book the same vehicle/dates simultaneously.
--
-- To run this migration:
-- 1. Go to your Neon dashboard: https://console.neon.tech
-- 2. Select your project and database
-- 3. Open the SQL Editor
-- 4. Paste and run this entire script

CREATE TABLE IF NOT EXISTS booking_holds (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  hold_token UUID NOT NULL DEFAULT gen_random_uuid(),
  expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_hold_date_range CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_booking_holds_vehicle_dates
  ON booking_holds(vehicle_id, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_booking_holds_token
  ON booking_holds(hold_token);

CREATE INDEX IF NOT EXISTS idx_booking_holds_expires
  ON booking_holds(expires_at);
