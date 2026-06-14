-- Products filter support fields DRAFT
-- Review only. Do not run until the url_pages table and product_filter resolver design are confirmed.
-- These additions support url_pages product_filter, supplier import traceability, and Kits & Bundles.

alter table public.products
  add column if not exists material_tags text[] not null default '{}',
  add column if not exists tags text[] not null default '{}',
  add column if not exists fulfillment text not null default 'local_stock'
    check (fulfillment in ('local_stock','indent_air','indent_sea','custom_sourcing')),
  add column if not exists is_australian_made boolean not null default false,
  add column if not exists offer_type text not null default 'single_product'
    check (offer_type in ('single_product','prebuilt_kit','prebuilt_bundle','gift_set','hamper','custom_kit_template')),
  add column if not exists kit_themes text[] not null default '{}',
  add column if not exists kit_components jsonb not null default '[]'::jsonb,
  add column if not exists related_categories text[] not null default '{}',
  add column if not exists pack_size int,
  add column if not exists supplier text,
  add column if not exists supplier_raw_category_path text;

-- Optional backfill from existing indent_type.
update public.products
set fulfillment = case
  when indent_type = 'indent_air' then 'indent_air'
  when indent_type = 'indent_sea' then 'indent_sea'
  else fulfillment
end
where indent_type is not null
  and fulfillment = 'local_stock';

create index if not exists idx_products_category_published
  on public.products(category)
  where is_published = true;

create index if not exists idx_products_subcategory_published
  on public.products(category, subcategory)
  where is_published = true;

create index if not exists idx_products_material_tags
  on public.products using gin(material_tags);

create index if not exists idx_products_tags
  on public.products using gin(tags);

create index if not exists idx_products_kit_themes
  on public.products using gin(kit_themes);

create index if not exists idx_products_offer_type
  on public.products(offer_type)
  where is_published = true;

create index if not exists idx_products_fulfillment
  on public.products(fulfillment);
