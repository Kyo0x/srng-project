-- Add upload_token for secure file uploads from booking-details page
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS upload_token UUID DEFAULT gen_random_uuid();

-- Ensure existing bookings get tokens
UPDATE bookings SET upload_token = gen_random_uuid() WHERE upload_token IS NULL;

-- Make it non-nullable after backfill
ALTER TABLE bookings ALTER COLUMN upload_token SET NOT NULL;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_bookings_upload_token ON bookings (upload_token);
