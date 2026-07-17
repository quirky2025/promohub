-- Sourcing Step 2 — INDENT customer quotes live on the main quotes board,
-- tagged so local vs indent are distinguishable, and linked back to the
-- sourcing product they came from.
alter table public.quotes
  add column if not exists quote_type          text default 'local',  -- 'local' | 'indent'
  add column if not exists sourcing_product_id  uuid,   -- -> factory_quotes.id (the sourcing product)
  add column if not exists unit_price           numeric; -- AUD sell unit price
