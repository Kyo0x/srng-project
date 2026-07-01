-- Migration: Add consent_given_at to bookings
-- Records when the customer gave explicit GDPR consent during driver registration.
-- NULL means the booking pre-dates consent tracking.

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS consent_given_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_bookings_consent_given_at
  ON bookings (consent_given_at)
  WHERE consent_given_at IS NOT NULL;
