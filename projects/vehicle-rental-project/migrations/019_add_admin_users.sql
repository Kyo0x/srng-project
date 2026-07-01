CREATE TABLE IF NOT EXISTS admin_users (
  id           SERIAL PRIMARY KEY,
  email        VARCHAR(255) UNIQUE NOT NULL,
  name         VARCHAR(255),
  is_temporary BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at   TIMESTAMP,
  created_by   VARCHAR(255) NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);
