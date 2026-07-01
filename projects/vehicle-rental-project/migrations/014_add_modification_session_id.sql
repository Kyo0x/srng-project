-- Track the Stripe session used for a modification upcharge payment
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS modification_stripe_session_id TEXT;
