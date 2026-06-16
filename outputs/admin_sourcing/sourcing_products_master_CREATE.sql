-- QuirkyPromo Made-to-Order Product master
-- GENERATE-ONLY. Lily runs this manually in the Supabase SQL editor.
-- Safe / non-destructive:
--   * Only CREATE TABLE/INDEX IF NOT EXISTS. No DROP, no ALTER on existing objects.
--   * Does NOT touch the public.products table or any existing sourcing_* tables.
--   * Read-only foreign-key reference to public.factories(id).
-- Run order: just run this whole file once. Re-running is a no-op.

-- Product master: stable product info only (NO costing calculations).
create table if not exists public.sourcing_products (
  id                          uuid primary key default gen_random_uuid(),
  status                      text not null default 'active',       -- active / draft / archived
  internal_sku                text,                                  -- QuirkyPromo internal SKU #
  name                        text not null,
  category                    text,
  subcategory                 text,
  factory_id                  uuid references public.factories(id),  -- Factory link (read-only ref)
  factory_name                text,                                  -- denormalised snapshot from frontend
  factory_sku                 text,                                  -- Factory SKU / reference
  moq                         integer,
  target_use                  text,
  specs_summary               text,                                  -- free-text "specs" summary
  material                    text,
  dimensions                  text,                                  -- size / dimensions
  colour_summary              text,                                  -- free-text "colours" summary
  packaging                   text,
  decoration_options          text,                                  -- free-text decoration summary
  logo_requirements           text,
  units_per_carton            integer,                               -- Carton Packing Template (inline, 1:1)
  carton_length_cm            numeric,
  carton_width_cm             numeric,
  carton_height_cm            numeric,
  gross_weight_kg_per_carton  numeric,
  production_lead_time        text,                                  -- e.g. "15-20 days"
  sample_info                 text,
  documents_supported         text,                                  -- COO / test report / fumigation...
  compliance_notes            text,
  public_positioning          text,                                  -- front-end quote-only description
  front_end_tags              text,
  internal_notes              text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- Unique SKU only when present (drafts may have empty SKU).
create unique index if not exists sourcing_products_internal_sku_key
  on public.sourcing_products (internal_sku)
  where internal_sku is not null and internal_sku <> '';
create index if not exists sourcing_products_factory_id_idx on public.sourcing_products (factory_id);
create index if not exists sourcing_products_category_idx   on public.sourcing_products (category);

-- Available Colours (frontend availableColours[]).
create table if not exists public.sourcing_product_colours (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.sourcing_products(id) on delete cascade,
  sort_order      integer not null default 0,
  colour_name     text,        -- name
  supplier_colour text,        -- supplierColour / swatch ref
  pms_code        text,        -- pms
  hex             text,
  notes           text
);
create index if not exists sourcing_product_colours_product_idx
  on public.sourcing_product_colours (product_id);

-- Branding Options (frontend brandingOptions[]).
create table if not exists public.sourcing_product_branding (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.sourcing_products(id) on delete cascade,
  sort_order   integer not null default 0,
  method       text,
  max_size     text,           -- maxSize
  position     text,
  colour_limit text,           -- colourLimit
  template_url text,           -- templateUrl
  notes        text
);
create index if not exists sourcing_product_branding_product_idx
  on public.sourcing_product_branding (product_id);

-- Individual Product Specs (frontend specRows[]).
create table if not exists public.sourcing_product_specs (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.sourcing_products(id) on delete cascade,
  sort_order  integer not null default 0,
  spec_name   text,            -- name
  description text
);
create index if not exists sourcing_product_specs_product_idx
  on public.sourcing_product_specs (product_id);

-- NOTE (later, not now): when quotes/cost-sheets are generated, snapshot the
-- product into sourcing_cost_sheets (add product_id uuid + product_snapshot jsonb)
-- so later edits to this master never change historical quotes.
