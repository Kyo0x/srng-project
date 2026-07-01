-- Store inspection PDF files in the database
CREATE TABLE IF NOT EXISTS inspection_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data BYTEA NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
