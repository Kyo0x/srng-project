ALTER TABLE vehicles
  ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 999,
  ADD COLUMN vehicle_group VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_vehicles_group_sort
  ON vehicles(vehicle_group, sort_order)
  WHERE vehicle_group IS NOT NULL;
