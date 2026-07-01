-- Migration: Add selected_extras column to store all booking extras
-- Run this on your Neon PostgreSQL database
--
-- To run this migration:
-- 1. Go to your Neon dashboard: https://console.neon.tech
-- 2. Select your project and database
-- 3. Open the SQL Editor
-- 4. Paste and run this entire script
--
-- This migration is idempotent - safe to run multiple times

-- Add selected_extras JSONB column to store full extras selection
-- Format: { "extra_id": quantity, ... }
-- Example: { "gps": 1, "baby_seat_small": 2, "camping_kitchen": 1 }
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'selected_extras'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN selected_extras JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add index for querying bookings by extras (optional, for analytics)
CREATE INDEX IF NOT EXISTS idx_bookings_selected_extras
ON bookings USING gin (selected_extras);
