-- Every order shows its delivery address(es) up top. Default comes from the
-- customer's account, but is editable and you can add more than one address
-- (e.g. Ian ships to VIC + Hornsby). Stored as a JSON array of address strings;
-- the first one stays mirrored into delivery_address for the invoice/PDF.
alter table public.orders
  add column if not exists delivery_addresses jsonb;
