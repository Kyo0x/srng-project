CREATE TABLE IF NOT EXISTS min_stay_rules (
  id          SERIAL PRIMARY KEY,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  min_days    INTEGER NOT NULL DEFAULT 7,
  label       VARCHAR(255),
  created_at  TIMESTAMP DEFAULT NOW(),
  CHECK (end_date > start_date),
  CHECK (min_days >= 1)
);
