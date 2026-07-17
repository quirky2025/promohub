-- Sourcing Step 1 — Product library on the existing factory-quote pipeline.
-- A factory_quote row = "a product this factory makes + its tiered RMB/AUD price".
-- We enhance it into the product library rather than build a 3rd product table.

-- 1) Each factory gets a short CODE used to build product SKUs (DG WC CLO -> DGWC).
alter table public.factories
  add column if not exists short_code text;

-- 2) Product-library fields on factory_quotes.
alter table public.factory_quotes
  add column if not exists sku            text,        -- auto = {factory short_code}-{seq}
  add column if not exists image_url      text,        -- product photo
  add column if not exists group_id       uuid,        -- optional: same item across factories (比价组)
  add column if not exists status         text default 'active',  -- active | draft | archived
  add column if not exists setup_cost_rmb numeric,     -- one-off (RMB)
  add column if not exists tooling_cost_rmb numeric,   -- one-off (RMB)
  add column if not exists sample_cost_rmb  numeric;   -- one-off (RMB)

-- 3) Per-factory SKU sequence counter (so SKUs are DGWC-001, DGWC-002 …).
create table if not exists public.factory_sku_counters (
  factory_id uuid primary key references public.factories(id) on delete cascade,
  next_seq   integer not null default 1
);

create index if not exists factory_quotes_group_idx on public.factory_quotes (group_id);
create index if not exists factory_quotes_status_idx on public.factory_quotes (status);
