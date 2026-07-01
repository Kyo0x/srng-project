-- Add inspection PDF URL to vehicles (per-vehicle changeable damage form)
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS inspection_pdf_url TEXT;
