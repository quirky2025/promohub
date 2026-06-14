-- Supplier Import staging schema DRAFT.
-- Review only. Do not run until the table names and import flow are approved.
-- Purpose: preserve raw supplier data before any products transform.

begin;

create table if not exists public.supplier_import_batches (
  id uuid primary key default gen_random_uuid(),
  supplier text not null check (supplier in ('Gear For Life','Logoline','NIConcept','PromoBrands')),
  source_file_name text,
  source_file_hash text,
  import_status text not null default 'draft'
    check (import_status in ('draft','loaded_raw','validated','mapping_review','ready_to_transform','transformed','blocked')),
  source_row_count int,
  unique_sku_count int,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_raw_product_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.supplier_import_batches(id) on delete cascade,
  supplier text not null check (supplier in ('Gear For Life','Logoline','NIConcept','PromoBrands')),
  source_row_number int,
  supplier_sku text,
  supplier_parent_sku text,
  supplier_product_id text,
  raw_name text,
  raw_description text,
  raw_brand text,
  raw_category_path text,
  raw_category_1 text,
  raw_category_2 text,
  raw_category_3 text,
  raw_category_4 text,
  raw_colour_name text,
  raw_colour_code text,
  raw_material text,
  raw_moq text,
  raw_lead_time text,
  raw_fulfillment text,
  raw_is_new text,
  raw_is_sale text,
  raw_is_discontinued text,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_raw_colour_options (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.supplier_import_batches(id) on delete cascade,
  supplier text not null check (supplier in ('Gear For Life','Logoline','NIConcept','PromoBrands')),
  supplier_sku text not null,
  colour_key text,
  colour_name text,
  colour_code text,
  hex text,
  sort_order int,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_raw_images (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.supplier_import_batches(id) on delete cascade,
  supplier text not null check (supplier in ('Gear For Life','Logoline','NIConcept','PromoBrands')),
  supplier_sku text not null,
  image_url text not null,
  image_role text,
  colour_key text,
  colour_name text,
  source_image_id text,
  sort_order int,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_raw_price_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.supplier_import_batches(id) on delete cascade,
  supplier text not null check (supplier in ('Gear For Life','Logoline','NIConcept','PromoBrands')),
  supplier_sku text not null,
  currency text default 'AUD',
  min_qty int,
  max_qty int,
  unit_cost numeric(12,4),
  setup_cost numeric(12,4),
  price_label text,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_raw_decoration_options (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.supplier_import_batches(id) on delete cascade,
  supplier text not null check (supplier in ('Gear For Life','Logoline','NIConcept','PromoBrands')),
  supplier_sku text not null,
  decoration_method text,
  decoration_area text,
  max_colours int,
  setup_cost numeric(12,4),
  run_cost numeric(12,4),
  lead_time text,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_transform_preview (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.supplier_import_batches(id) on delete cascade,
  supplier text not null check (supplier in ('Gear For Life','Logoline','NIConcept','PromoBrands')),
  supplier_sku text not null,
  raw_name text,
  normalized_name text,
  slug text,
  target_category text,
  target_subcategory text,
  mapping_status text not null
    check (mapping_status in ('ready','needs_review','blocked','collection_or_tag','kit_or_bundle','fulfillment_only')),
  mapping_rule_id text,
  confidence numeric(4,2),
  brand text,
  brand_alias_status text,
  material_tags text[] not null default '{}'::text[],
  tags text[] not null default '{}'::text[],
  fulfillment text,
  offer_type text,
  kit_themes text[] not null default '{}'::text[],
  warning_flags text[] not null default '{}'::text[],
  review_notes text,
  preview_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_supplier_raw_product_rows_batch_sku
  on public.supplier_raw_product_rows(batch_id, supplier, supplier_sku);

create index if not exists idx_supplier_raw_product_rows_category
  on public.supplier_raw_product_rows(supplier, raw_category_path);

create index if not exists idx_supplier_raw_colours_sku
  on public.supplier_raw_colour_options(batch_id, supplier, supplier_sku);

create index if not exists idx_supplier_raw_images_sku
  on public.supplier_raw_images(batch_id, supplier, supplier_sku);

create index if not exists idx_supplier_raw_prices_sku
  on public.supplier_raw_price_rows(batch_id, supplier, supplier_sku);

create index if not exists idx_supplier_raw_decoration_sku
  on public.supplier_raw_decoration_options(batch_id, supplier, supplier_sku);

create index if not exists idx_supplier_transform_preview_status
  on public.supplier_transform_preview(batch_id, mapping_status);

commit;

