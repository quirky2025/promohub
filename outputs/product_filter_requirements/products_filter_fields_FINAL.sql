-- Products filter fields FINAL migration
-- Purpose:
--   Support url_pages product_filter, Kits & Bundles, supplier imports, and SEO filter pages.
--
-- Run order:
--   1. products_filter_fields_dry_run.sql
--   2. products_filter_fields_FINAL.sql
--   3. url_pages_seed_READY_dry_run.sql
--   4. url_pages_seed_READY_upsert.sql
--
-- This migration is additive. It does not delete rows or remove existing fields.

begin;

alter table public.products
  add column if not exists material_tags text[],
  add column if not exists tags text[],
  add column if not exists fulfillment text,
  add column if not exists is_australian_made boolean,
  add column if not exists offer_type text,
  add column if not exists kit_themes text[],
  add column if not exists kit_components jsonb,
  add column if not exists related_categories text[],
  add column if not exists pack_size int,
  add column if not exists supplier text,
  add column if not exists supplier_raw_category_path text;

update public.products
set
  material_tags = coalesce(material_tags, '{}'::text[]),
  tags = coalesce(tags, '{}'::text[]),
  fulfillment = coalesce(fulfillment, 'local_stock'),
  is_australian_made = coalesce(is_australian_made, false),
  offer_type = coalesce(offer_type, 'single_product'),
  kit_themes = coalesce(kit_themes, '{}'::text[]),
  kit_components = coalesce(kit_components, '[]'::jsonb),
  related_categories = coalesce(related_categories, '{}'::text[]);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'indent_type'
  ) then
    execute $sql$
      update public.products
      set fulfillment = case
        when indent_type = 'indent_air' then 'indent_air'
        when indent_type = 'indent_sea' then 'indent_sea'
        else fulfillment
      end
      where indent_type is not null
        and fulfillment = 'local_stock'
    $sql$;
  end if;
end $$;

alter table public.products
  alter column material_tags set default '{}'::text[],
  alter column material_tags set not null,
  alter column tags set default '{}'::text[],
  alter column tags set not null,
  alter column fulfillment set default 'local_stock',
  alter column fulfillment set not null,
  alter column is_australian_made set default false,
  alter column is_australian_made set not null,
  alter column offer_type set default 'single_product',
  alter column offer_type set not null,
  alter column kit_themes set default '{}'::text[],
  alter column kit_themes set not null,
  alter column kit_components set default '[]'::jsonb,
  alter column kit_components set not null,
  alter column related_categories set default '{}'::text[],
  alter column related_categories set not null;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'products'
      and constraint_name = 'products_fulfillment_check'
  ) then
    alter table public.products
      add constraint products_fulfillment_check
      check (fulfillment in ('local_stock','indent_air','indent_sea','custom_sourcing'));
  end if;

  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'products'
      and constraint_name = 'products_offer_type_check'
  ) then
    alter table public.products
      add constraint products_offer_type_check
      check (offer_type in ('single_product','prebuilt_kit','prebuilt_bundle','gift_set','hamper','custom_kit_template'));
  end if;

  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'products'
      and constraint_name = 'products_pack_size_check'
  ) then
    alter table public.products
      add constraint products_pack_size_check
      check (pack_size is null or pack_size > 0);
  end if;
end $$;

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

commit;
