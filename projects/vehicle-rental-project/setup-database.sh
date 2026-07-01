#!/bin/bash

echo "Setting up PostgreSQL database for ArcticTrail..."

# Create database and user
sudo -u postgres psql << SQL
-- Drop existing if needed (for clean setup)
DROP DATABASE IF EXISTS rv_rental;
DROP USER IF EXISTS rv_user;

-- Create user
CREATE USER rv_user WITH PASSWORD 'rv_secure_pass_2026';

-- Create database
CREATE DATABASE rv_rental OWNER rv_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rv_rental TO rv_user;

SQL

echo "Database and user created. Now creating tables..."

# Create tables
PGPASSWORD='rv_secure_pass_2026' psql -U rv_user -d rv_rental << SQL

-- Enable btree_gist extension for exclusion constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  seats INTEGER NOT NULL DEFAULT 4,
  beds INTEGER NOT NULL DEFAULT 2,
  drive_type VARCHAR(10) NOT NULL DEFAULT '2WD',
  transmission VARCHAR(20) NOT NULL DEFAULT 'manual',
  has_heating BOOLEAN DEFAULT true,
  price_per_day DECIMAL(10, 2) NOT NULL,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  baby_seats_quantity INTEGER DEFAULT 0,
  extra_driver BOOLEAN DEFAULT false,
  insurance_type VARCHAR(20) DEFAULT 'none',
  selected_extras JSONB DEFAULT '{}'::jsonb,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  stripe_session_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Constraint: end_date must be after start_date
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Exclusion constraint to prevent overlapping bookings for the same vehicle
-- Only applies to non-cancelled bookings
ALTER TABLE bookings ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING gist (
    vehicle_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (status != 'cancelled');

-- Create indexes for better performance
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_stripe_session ON bookings(stripe_session_id);

-- Insert sample vehicles
INSERT INTO vehicles (name, seats, beds, drive_type, transmission, has_heating, price_per_day, image_urls, description) VALUES
('Arctic Explorer', 6, 4, '4WD', 'automatic', true, 1500.00, ARRAY['/images/vehicles/arctic-explorer.jpg'], 'Luxurious motorhome perfect for Arctic adventures'),
('Northern Nomad', 4, 2, '2WD', 'manual', true, 800.00, ARRAY['/images/vehicles/northern-nomad.jpg'], 'Compact and efficient camper van'),
('Fjord Cruiser', 5, 3, 'AWD', 'automatic', true, 1200.00, ARRAY['/images/vehicles/fjord-cruiser.jpg'], 'Family-friendly RV with modern amenities');

SQL

echo "✅ Database setup complete!"
echo "Tables created: vehicles, bookings"
echo "Sample vehicles inserted"
echo ""
echo "Note: The bookings table includes an exclusion constraint"
echo "to prevent double-bookings for the same vehicle."

