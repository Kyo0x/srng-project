-- Migration: Add reliability constraints to bookings table
-- Run this on your Neon PostgreSQL database to prevent double-bookings
--
-- To run this migration:
-- 1. Go to your Neon dashboard: https://console.neon.tech
-- 2. Select your project and database
-- 3. Open the SQL Editor
-- 4. Paste and run this entire script
--
-- This migration is idempotent - safe to run multiple times

-- Enable btree_gist extension (required for exclusion constraints with non-btree types)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Add unique constraint on stripe_session_id for idempotency
-- This prevents duplicate bookings from webhook retries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_stripe_session_id_unique'
  ) THEN
    ALTER TABLE bookings
    ADD CONSTRAINT bookings_stripe_session_id_unique
    UNIQUE (stripe_session_id);
  END IF;
END $$;

-- Add check constraint to ensure end_date is after start_date
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_date_range'
  ) THEN
    ALTER TABLE bookings
    ADD CONSTRAINT valid_date_range
    CHECK (end_date > start_date);
  END IF;
END $$;

-- Add exclusion constraint to prevent overlapping bookings for the same vehicle
-- This is the critical constraint that prevents double-bookings at the database level
-- It only applies to non-cancelled bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_bookings'
  ) THEN
    ALTER TABLE bookings
    ADD CONSTRAINT no_overlapping_bookings
    EXCLUDE USING gist (
      vehicle_id WITH =,
      daterange(start_date, end_date, '[]') WITH &&
    ) WHERE (status != 'cancelled');
  END IF;
END $$;

-- Add index on stripe_session_id for faster idempotency lookups
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session
ON bookings(stripe_session_id)
WHERE stripe_session_id IS NOT NULL;

-- Add composite index for availability checking queries
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_dates_status
ON bookings(vehicle_id, start_date, end_date, status);
