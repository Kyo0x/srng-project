-- Add reminder_sent_at column to track when driver details reminders are sent
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient querying of pending reminders
CREATE INDEX IF NOT EXISTS idx_bookings_reminder_pending
ON bookings (created_at)
WHERE status = 'pending_details' AND reminder_sent_at IS NULL;
