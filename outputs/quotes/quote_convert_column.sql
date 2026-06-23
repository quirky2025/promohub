-- Optional (recommended): lets the system remember a quote was converted,
-- show a "Converted to OC…" badge, and prevent converting the same quote twice.
-- Without it, Convert to Order still works, but you could convert twice by mistake.
alter table quotes add column if not exists converted_order_number text;
