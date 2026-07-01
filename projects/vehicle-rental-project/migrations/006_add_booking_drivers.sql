-- Add booking_drivers table for storing driver registration details
CREATE TABLE IF NOT EXISTS booking_drivers (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT true,
  full_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  license_expiry DATE NOT NULL,
  license_country VARCHAR(100) NOT NULL,
  address_line1 VARCHAR(200) NOT NULL,
  address_line2 VARCHAR(200),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  license_photo_front VARCHAR(500),
  license_photo_back VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_booking_drivers_booking_id ON booking_drivers(booking_id);
