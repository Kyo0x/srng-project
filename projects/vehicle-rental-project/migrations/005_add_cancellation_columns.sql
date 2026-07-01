-- Migration: Add cancellation-related columns to bookings table
-- Run this on your Neon PostgreSQL database
--
-- To run this migration:
-- 1. Go to your Neon dashboard: https://console.neon.tech
-- 2. Select your project and database
-- 3. Open the SQL Editor
-- 4. Paste and run this entire script
--
-- This migration is idempotent - safe to run multiple times

-- Add cancelled_at timestamp column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cancelled_at'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add cancelled_by column (who initiated: 'customer' or 'admin')
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cancelled_by'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN cancelled_by VARCHAR(20);
  END IF;
END $$;

-- Add cancellation_reason column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cancellation_reason'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN cancellation_reason TEXT;
  END IF;
END $$;

-- Add refund_amount column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'refund_amount'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN refund_amount DECIMAL(10, 2);
  END IF;
END $$;

-- Add refund_percentage column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'refund_percentage'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN refund_percentage INTEGER;
  END IF;
END $$;

-- Add stripe_refund_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'stripe_refund_id'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN stripe_refund_id VARCHAR(255);
  END IF;
END $$;

-- Add index for filtering cancelled bookings
CREATE INDEX IF NOT EXISTS idx_bookings_status_cancelled
ON bookings (status) WHERE status = 'cancelled';

-- Add index for cancelled_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_bookings_cancelled_at
ON bookings (cancelled_at) WHERE cancelled_at IS NOT NULL;
