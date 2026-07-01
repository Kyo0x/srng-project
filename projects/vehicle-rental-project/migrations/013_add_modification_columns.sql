-- Add modification tracking columns to bookings table
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS modified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS modification_count INT NOT NULL DEFAULT 0;
