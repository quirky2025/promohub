-- D8 · Collections Manager (COLLECTIONS_MANAGER_SPEC.md). Idempotent.
--
-- smart_collections: rule-driven collections. Members are NEVER stored as a
-- static list — membership = rule hits + pinned − excluded, resolved live on
-- the collection page and materialised into collection_products on publish
-- (the materialised map feeds PDP "Also Found In" without per-request rule runs).
--
-- rules jsonb shape (all optional; AND between fields, OR inside a field):
-- { category: [], subcategory: [], brand: [], supplier: [], colours: [],
--   material_tags: [], decoration_model: [], print_methods: [],
--   price_min: null, price_max: null, min_qty_max: null, is_eco: null }

create table if not exists public.smart_collections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  ctype       text not null default 'scenario',   -- scenario | colour | industry | attribute | brand
  rules       jsonb not null default '{}',
  pinned      jsonb not null default '[]',        -- ordered [product_id, …] shown first
  excluded    jsonb not null default '[]',        -- [product_id, …] blacklist
  status      text not null default 'draft',      -- draft | published
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Materialised membership map (refreshed on publish/save of a published collection).
create table if not exists public.collection_products (
  collection_id uuid not null references public.smart_collections(id) on delete cascade,
  product_id    uuid not null,
  pinned_order  integer,            -- null = not pinned
  primary key (collection_id, product_id)
);

create index if not exists idx_collection_products_product
  on public.collection_products (product_id);
