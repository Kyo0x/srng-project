-- Add beds column to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS beds INTEGER NOT NULL DEFAULT 2;
