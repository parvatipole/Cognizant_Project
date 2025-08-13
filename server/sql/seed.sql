-- Users: password hashes must be generated; placeholder values inserted here should be replaced by actual bcrypt hashes.
-- Use the helper below (Node script or online bcrypt) to generate hashes for 'cdc123' and 'admin123'.

INSERT INTO users (username, password_hash, name, role, assigned_location, assigned_office)
VALUES
  ('ashutosh', '$2a$10$REPLACE_WITH_HASH_FOR_cdc123', 'Ashutosh', 'technician', 'Pune', 'CDC Office'),
  ('admin', '$2a$10$REPLACE_WITH_HASH_FOR_admin123', 'Admin User', 'admin', NULL, NULL);

-- Offices
INSERT INTO offices (name, location, address)
VALUES
  ('CDC Office', 'Pune', 'CDC Campus, Pune - 411020');

-- Machines in CDC Office
INSERT INTO machines (machine_code, name, office_id, status, daily_cups, efficiency, supplies_water, supplies_milk, supplies_coffee, supplies_sugar)
SELECT 'PUN-CDC-001', 'CDC Cafeteria', o.id, 'operational', 210, 97, 90, 85, 88, 92 FROM offices o WHERE o.name='CDC Office' AND o.location='Pune';
INSERT INTO machines (machine_code, name, office_id, status, daily_cups, efficiency, supplies_water, supplies_milk, supplies_coffee, supplies_sugar)
SELECT 'PUN-CDC-002', 'CDC Lobby', o.id, 'operational', 95, 93, 82, 70, 84, 88 FROM offices o WHERE o.name='CDC Office' AND o.location='Pune';
INSERT INTO machines (machine_code, name, office_id, status, daily_cups, efficiency, supplies_water, supplies_milk, supplies_coffee, supplies_sugar)
SELECT 'PUN-CDC-003', 'CDC 2nd Floor Break', o.id, 'maintenance', 0, 0, 45, 35, 40, 50 FROM offices o WHERE o.name='CDC Office' AND o.location='Pune';