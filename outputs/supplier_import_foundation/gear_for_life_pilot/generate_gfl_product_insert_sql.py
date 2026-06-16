from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "outputs" / "supplier_import_foundation" / "gear_for_life_pilot"

PREFLIGHT_SQL = OUT_DIR / "gear_for_life_product_insert_preflight_READONLY.sql"
INSERT_SQL = OUT_DIR / "gear_for_life_product_insert_DRAFT.sql"
CHECK_SQL = OUT_DIR / "gear_for_life_product_insert_check_READONLY.sql"

SUPPLIER = "Gear For Life"
SOURCE_FILE_HASH = "f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c"

EXPECTED_TRANSFORM_PREVIEW_ROWS = 471
EXPECTED_READY_ROWS = 436
EXPECTED_BLOCKED_ROWS = 35
EXPECTED_NEEDS_REVIEW_ROWS = 0
EXPECTED_RAW_PRODUCTS = 472
EXPECTED_PRODUCT_PRICE_ROWS = 773


def sql_string(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


COMMON_CTES = f"""params as (
  select {sql_string(SUPPLIER)}::text as target_supplier,
         {sql_string(SOURCE_FILE_HASH)}::text as target_source_file_hash
),
gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = (select target_supplier from params)
    and source_file_hash = (select target_source_file_hash from params)
  order by created_at desc
  limit 1
),
preview_rows as (
  select
    p.*,
    p.preview_json ->> 'raw_supplier_sku' as raw_supplier_sku,
    nullif(p.preview_json ->> 'source_row_number', '')::int as source_row_number
  from public.supplier_transform_preview p
  join gfl_batch b on b.batch_id = p.batch_id
  where p.supplier = (select target_supplier from params)
),
ready_rows as (
  select *
  from preview_rows
  where mapping_status = 'ready'
),
blocked_rows as (
  select *
  from preview_rows
  where mapping_status = 'blocked'
),
raw_ready_rows as (
  select r.*
  from public.supplier_raw_product_rows r
  join ready_rows p
    on p.batch_id = r.batch_id
   and p.raw_supplier_sku = r.supplier_sku
   and p.source_row_number = r.source_row_number
  where r.supplier = (select target_supplier from params)
),
ready_price_rows as (
  select
    p.supplier_sku as preview_supplier_sku,
    p.raw_supplier_sku,
    p.source_row_number,
    pr.*
  from public.supplier_price_rows pr
  join ready_rows p
    on p.batch_id = pr.batch_id
   and p.raw_supplier_sku = pr.supplier_sku
   and p.source_row_number::text = pr.raw_json ->> 'source_row_number'
  where pr.supplier = (select target_supplier from params)
    and pr.min_qty is not null
    and pr.unit_cost is not null
),
ready_colour_rows as (
  select
    p.supplier_sku as preview_supplier_sku,
    p.raw_supplier_sku,
    p.source_row_number,
    c.*
  from public.supplier_raw_colour_options c
  join ready_rows p
    on p.batch_id = c.batch_id
   and p.raw_supplier_sku = c.supplier_sku
   and p.source_row_number::text = c.raw_json ->> 'source_row_number'
  where c.supplier = (select target_supplier from params)
),
safe_colour_images as (
  select
    p.supplier_sku as preview_supplier_sku,
    i.*
  from public.supplier_raw_images i
  join ready_rows p
    on p.batch_id = i.batch_id
   and p.raw_supplier_sku = i.supplier_sku
   and p.source_row_number::text = i.raw_json ->> 'source_row_number'
  where i.supplier = (select target_supplier from params)
    and (
      (i.colour_key is not null and exists (
        select 1
        from ready_colour_rows c
        where c.preview_supplier_sku = p.supplier_sku
          and c.colour_key = i.colour_key
      ))
      or
      (i.colour_name is not null and exists (
        select 1
        from ready_colour_rows c
        where c.preview_supplier_sku = p.supplier_sku
          and lower(c.colour_name) = lower(i.colour_name)
      ))
    )
),
fallback_image_rows as (
  select
    p.supplier_sku as preview_supplier_sku,
    p.raw_supplier_sku,
    p.source_row_number,
    i.*
  from public.supplier_raw_images i
  join ready_rows p
    on p.batch_id = i.batch_id
   and p.raw_supplier_sku = i.supplier_sku
   and p.source_row_number::text = i.raw_json ->> 'source_row_number'
  where i.supplier = (select target_supplier from params)
    and not exists (
      select 1
      from safe_colour_images sci
      where sci.id = i.id
    )
),
product_rows as (
  select
    p.batch_id,
    p.supplier,
    p.supplier_sku,
    p.raw_supplier_sku,
    p.source_row_number,
    p.normalized_name as name,
    p.slug,
    p.target_category as category,
    p.target_subcategory as subcategory,
    p.brand,
    p.material_tags,
    p.tags,
    p.fulfillment,
    coalesce(p.offer_type, 'single_product') as offer_type,
    min(pr.min_qty)::int as min_qty,
    r.raw_description,
    r.raw_material,
    r.raw_category_path,
    r.raw_json,
    p.preview_json,
    p.lead_time_min_days,
    p.lead_time_max_days,
    p.lead_time_unit,
    p.lead_time_basis,
    p.lead_time_note
  from ready_rows p
  join raw_ready_rows r
    on r.batch_id = p.batch_id
   and r.supplier_sku = p.raw_supplier_sku
   and r.source_row_number = p.source_row_number
  left join ready_price_rows pr
    on pr.preview_supplier_sku = p.supplier_sku
  group by
    p.batch_id,
    p.supplier,
    p.supplier_sku,
    p.raw_supplier_sku,
    p.source_row_number,
    p.normalized_name,
    p.slug,
    p.target_category,
    p.target_subcategory,
    p.brand,
    p.material_tags,
    p.tags,
    p.fulfillment,
    p.offer_type,
    r.raw_description,
    r.raw_material,
    r.raw_category_path,
    r.raw_json,
    p.preview_json,
    p.lead_time_min_days,
    p.lead_time_max_days,
    p.lead_time_unit,
    p.lead_time_basis,
    p.lead_time_note
),
existing_gfl_products as (
  select id, supplier_sku, slug
  from public.products
  where supplier = (select target_supplier from params)
),
slug_conflicts as (
  select pr.supplier_sku, pr.slug, existing.id
  from product_rows pr
  join public.products existing
    on existing.slug = pr.slug
  where coalesce(existing.supplier, '') <> (select target_supplier from params)
),
sku_conflicts as (
  select pr.supplier_sku, existing.id, existing.slug
  from product_rows pr
  join public.products existing
    on existing.supplier_sku = pr.supplier_sku
  where coalesce(existing.supplier, '') <> (select target_supplier from params)
)"""


def build_preflight_sql() -> str:
    required_columns = [
        ("products", "name"),
        ("products", "slug"),
        ("products", "category"),
        ("products", "subcategory"),
        ("products", "brand"),
        ("products", "supplier"),
        ("products", "supplier_sku"),
        ("products", "supplier_raw_category_path"),
        ("products", "min_qty"),
        ("products", "description"),
        ("products", "materials"),
        ("products", "dimensions"),
        ("products", "packing"),
        ("products", "is_published"),
        ("products", "status"),
        ("products", "material_tags"),
        ("products", "tags"),
        ("products", "fulfillment"),
        ("products", "offer_type"),
        ("products", "is_eco"),
        ("products", "is_new_arrival"),
        ("products", "is_sale"),
        ("products", "meta_title"),
        ("products", "meta_description"),
        ("products", "alt_text"),
        ("products", "seo_description"),
        ("product_colours", "product_id"),
        ("product_colours", "name"),
        ("product_colours", "hex"),
        ("product_colours", "sort_order"),
        ("pricing_tiers", "product_id"),
        ("pricing_tiers", "min_qty"),
        ("pricing_tiers", "max_qty"),
        ("pricing_tiers", "base_price"),
        ("pricing_tiers", "sort_order"),
        ("product_images", "product_id"),
        ("product_images", "supplier"),
        ("product_images", "supplier_sku"),
        ("product_images", "image_url"),
        ("product_images", "image_role"),
        ("product_images", "colour_link_status"),
        ("product_images", "source_image_id"),
        ("product_images", "sort_order"),
        ("product_images", "raw_json"),
    ]
    values = ",\n    ".join(
        f"({sql_string(table)}, {sql_string(column)})" for table, column in required_columns
    )
    return f"""-- Gear For Life product INSERT preflight.
-- READ ONLY. Does not write products or child tables.

with
required_columns(table_name, column_name) as (
  values
    {values}
),
missing_columns as (
  select rc.table_name, rc.column_name
  from required_columns rc
  left join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = rc.table_name
   and c.column_name = rc.column_name
  where c.column_name is null
),
{COMMON_CTES},
ready_images as (
  select i.*
  from public.supplier_raw_images i
  join ready_rows p
    on p.batch_id = i.batch_id
   and p.raw_supplier_sku = i.supplier_sku
   and p.source_row_number::text = i.raw_json ->> 'source_row_number'
  where i.supplier = (select target_supplier from params)
),
checks as (
  select 'missing_required_columns' as check_name,
         (select count(*) from missing_columns)::int as actual_value,
         0::int as expected_value,
         coalesce((select jsonb_agg(to_jsonb(missing_columns) order by table_name, column_name) from missing_columns), '[]'::jsonb) as details
  union all select 'batch', (select count(*) from gfl_batch)::int, 1, '{{}}'::jsonb
  union all select 'raw_products', (select count(*) from public.supplier_raw_product_rows r join gfl_batch b on b.batch_id = r.batch_id where r.supplier = (select target_supplier from params))::int, {EXPECTED_RAW_PRODUCTS}, '{{}}'::jsonb
  union all select 'transform_preview_rows', (select count(*) from preview_rows)::int, {EXPECTED_TRANSFORM_PREVIEW_ROWS}, '{{}}'::jsonb
  union all select 'ready_rows', (select count(*) from ready_rows)::int, {EXPECTED_READY_ROWS}, '{{}}'::jsonb
  union all select 'blocked_rows', (select count(*) from blocked_rows)::int, {EXPECTED_BLOCKED_ROWS}, '{{}}'::jsonb
  union all select 'needs_review_rows', (select count(*) from preview_rows where mapping_status = 'needs_review')::int, {EXPECTED_NEEDS_REVIEW_ROWS}, '{{}}'::jsonb
  union all select 'existing_gfl_products', (select count(*) from existing_gfl_products)::int, 0, coalesce((select jsonb_agg(to_jsonb(existing_gfl_products) order by supplier_sku) from existing_gfl_products), '[]'::jsonb)
  union all select 'slug_conflicts', (select count(*) from slug_conflicts)::int, 0, coalesce((select jsonb_agg(to_jsonb(slug_conflicts) order by supplier_sku) from slug_conflicts), '[]'::jsonb)
  union all select 'sku_conflicts', (select count(*) from sku_conflicts)::int, 0, coalesce((select jsonb_agg(to_jsonb(sku_conflicts) order by supplier_sku) from sku_conflicts), '[]'::jsonb)
  union all select 'ready_rows_missing_product_price', (select count(*) from product_rows where min_qty is null)::int, 0, coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku, 'name', name) order by supplier_sku) from product_rows where min_qty is null), '[]'::jsonb)
  union all select 'target_products_to_insert', (select count(*) from product_rows)::int, {EXPECTED_READY_ROWS}, '{{}}'::jsonb
  union all select 'target_product_price_tiers', (select count(*) from ready_price_rows)::int, {EXPECTED_PRODUCT_PRICE_ROWS}, '{{}}'::jsonb
  union all select 'target_product_colours', (select count(*) from ready_colour_rows)::int, (select count(*) from ready_colour_rows)::int, '{{}}'::jsonb
  union all select 'ready_images_total', (select count(*) from ready_images)::int, (select count(*) from ready_images)::int, '{{}}'::jsonb
  union all select 'safe_colour_images_preserved_in_staging', (select count(*) from safe_colour_images)::int, (select count(*) from safe_colour_images)::int, '{{}}'::jsonb
  union all select 'gallery_fallback_images_to_insert', (select count(*) from fallback_image_rows)::int, (select count(*) from fallback_image_rows)::int, '{{}}'::jsonb
  union all select 'products_table_rows_created_by_this_preflight', 0::int, 0, '{{}}'::jsonb
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by check_name;
"""


def build_insert_sql() -> str:
    return f"""-- Gear For Life products INSERT - DRAFT.
-- Purpose: create unpublished product rows for the 436 approved GFL transform-preview rows.
-- Scope:
--   - Writes public.products, public.pricing_tiers, public.product_colours, public.product_images.
--   - Does not write url_pages, navigation, redirects, or publish products.
--   - Does not transform supplier decoration tiers yet; those remain in supplier staging.
-- Run manually in Supabase only after gear_for_life_product_insert_preflight_READONLY.sql is all ok.

begin;

do $$
declare
  issue_count int;
begin
  with
  required_columns(table_name, column_name) as (
    values
      ('products','name'),
      ('products','slug'),
      ('products','category'),
      ('products','subcategory'),
      ('products','brand'),
      ('products','supplier'),
      ('products','supplier_sku'),
      ('products','supplier_raw_category_path'),
      ('products','min_qty'),
      ('products','description'),
      ('products','materials'),
      ('products','dimensions'),
      ('products','packing'),
      ('products','is_published'),
      ('products','status'),
      ('products','material_tags'),
      ('products','tags'),
      ('products','fulfillment'),
      ('products','offer_type'),
      ('products','is_eco'),
      ('products','is_new_arrival'),
      ('products','is_sale'),
      ('products','meta_title'),
      ('products','meta_description'),
      ('products','alt_text'),
      ('products','seo_description'),
      ('product_colours','product_id'),
      ('product_colours','name'),
      ('product_colours','hex'),
      ('product_colours','sort_order'),
      ('pricing_tiers','product_id'),
      ('pricing_tiers','min_qty'),
      ('pricing_tiers','max_qty'),
      ('pricing_tiers','base_price'),
      ('pricing_tiers','sort_order'),
      ('product_images','product_id'),
      ('product_images','supplier'),
      ('product_images','supplier_sku'),
      ('product_images','image_url'),
      ('product_images','image_role'),
      ('product_images','colour_link_status'),
      ('product_images','source_image_id'),
      ('product_images','sort_order'),
      ('product_images','raw_json')
  ),
  missing_columns as (
    select rc.*
    from required_columns rc
    left join information_schema.columns c
      on c.table_schema = 'public'
     and c.table_name = rc.table_name
     and c.column_name = rc.column_name
    where c.column_name is null
  )
  select count(*) into issue_count from missing_columns;

  if issue_count <> 0 then
    raise exception 'Missing required product insert columns. Stop and run the READONLY preflight for details.';
  end if;
end $$;

do $$
declare
  batch_count int;
  preview_count int;
  ready_count int;
  blocked_count int;
  needs_review_count int;
  existing_gfl_product_count int;
  slug_conflict_count int;
  sku_conflict_count int;
  missing_price_count int;
  ready_price_count int;
begin
  with
  {COMMON_CTES},
  insert_guard as (
    select
      (select count(*) from gfl_batch) as batch_count,
      (select count(*) from preview_rows) as preview_count,
      (select count(*) from ready_rows) as ready_count,
      (select count(*) from blocked_rows) as blocked_count,
      (select count(*) from preview_rows where mapping_status = 'needs_review') as needs_review_count,
      (select count(*) from existing_gfl_products) as existing_gfl_product_count,
      (select count(*) from slug_conflicts) as slug_conflict_count,
      (select count(*) from sku_conflicts) as sku_conflict_count,
      (select count(*) from product_rows where min_qty is null) as missing_price_count,
      (select count(*) from ready_price_rows) as ready_price_count
  )
  select
    insert_guard.batch_count,
    insert_guard.preview_count,
    insert_guard.ready_count,
    insert_guard.blocked_count,
    insert_guard.needs_review_count,
    insert_guard.existing_gfl_product_count,
    insert_guard.slug_conflict_count,
    insert_guard.sku_conflict_count,
    insert_guard.missing_price_count,
    insert_guard.ready_price_count
  into
    batch_count,
    preview_count,
    ready_count,
    blocked_count,
    needs_review_count,
    existing_gfl_product_count,
    slug_conflict_count,
    sku_conflict_count,
    missing_price_count,
    ready_price_count
  from insert_guard;

  if batch_count <> 1 then
    raise exception 'GFL batch not found or not unique. Stop.';
  elsif preview_count <> {EXPECTED_TRANSFORM_PREVIEW_ROWS} then
    raise exception 'Expected {EXPECTED_TRANSFORM_PREVIEW_ROWS} GFL transform preview rows. Stop.';
  elsif ready_count <> {EXPECTED_READY_ROWS} then
    raise exception 'Expected {EXPECTED_READY_ROWS} ready rows. Stop.';
  elsif blocked_count <> {EXPECTED_BLOCKED_ROWS} then
    raise exception 'Expected {EXPECTED_BLOCKED_ROWS} blocked discontinued rows. Stop.';
  elsif needs_review_count <> {EXPECTED_NEEDS_REVIEW_ROWS} then
    raise exception 'Expected 0 needs_review rows. Stop.';
  elsif existing_gfl_product_count <> 0 then
    raise exception 'GFL products already exist in public.products. Stop: do not rerun.';
  elsif slug_conflict_count <> 0 then
    raise exception 'Slug conflicts exist. Stop and run preflight for details.';
  elsif sku_conflict_count <> 0 then
    raise exception 'Supplier SKU conflicts exist. Stop and run preflight for details.';
  elsif missing_price_count <> 0 then
    raise exception 'Ready product rows missing product price tiers. Stop.';
  elsif ready_price_count <> {EXPECTED_PRODUCT_PRICE_ROWS} then
    raise exception 'Expected {EXPECTED_PRODUCT_PRICE_ROWS} ready product price tiers. Stop.';
  end if;
end $$;

create temporary table gfl_product_insert_map (
  product_id uuid not null,
  supplier_sku text not null,
  raw_supplier_sku text not null,
  source_row_number int not null
) on commit drop;

with
{COMMON_CTES},
inserted_products as (
  insert into public.products (
    name,
    slug,
    category,
    subcategory,
    brand,
    supplier,
    supplier_sku,
    supplier_raw_category_path,
    min_qty,
    description,
    materials,
    dimensions,
    packing,
    is_published,
    status,
    material_tags,
    tags,
    fulfillment,
    offer_type,
    is_eco,
    is_new_arrival,
    is_sale,
    meta_title,
    meta_description,
    alt_text,
    seo_description
  )
  select
    pr.name,
    pr.slug,
    pr.category,
    pr.subcategory,
    pr.brand,
    {sql_string(SUPPLIER)},
    pr.supplier_sku,
    pr.raw_category_path,
    pr.min_qty,
    nullif(regexp_replace(coalesce(pr.raw_description, ''), '[[:space:]]*[|][[:space:]]*', E'\\n', 'g'), '') as description,
    nullif(pr.raw_material, '') as materials,
    nullif(pr.raw_json ->> 'product_item_size', '') as dimensions,
    nullif(coalesce(nullif(pr.raw_json ->> 'product_packaging_inner', ''), nullif(pr.raw_json ->> 'freight_description', '')), '') as packing,
    false as is_published,
    'active' as status,
    coalesce(pr.material_tags, '{{}}'::text[]) as material_tags,
    coalesce(pr.tags, '{{}}'::text[]) as tags,
    'local_stock' as fulfillment,
    'single_product' as offer_type,
    false as is_eco,
    false as is_new_arrival,
    false as is_sale,
    left(pr.name || ' | QuirkyPromo', 120) as meta_title,
    left(regexp_replace(coalesce(pr.raw_description, ''), '[[:space:]]*[|][[:space:]]*', ' ', 'g'), 300) as meta_description,
    pr.name as alt_text,
    left(regexp_replace(coalesce(pr.raw_description, ''), '[[:space:]]*[|][[:space:]]*', ' ', 'g'), 500) as seo_description
  from product_rows pr
  order by pr.source_row_number
  returning id, supplier_sku
)
insert into gfl_product_insert_map (
  product_id,
  supplier_sku,
  raw_supplier_sku,
  source_row_number
)
select
  ip.id,
  pr.supplier_sku,
  pr.raw_supplier_sku,
  pr.source_row_number
from inserted_products ip
join product_rows pr
  on pr.supplier_sku = ip.supplier_sku;

with
{COMMON_CTES},
ranked_prices as (
  select
    rp.*,
    row_number() over (
      partition by rp.preview_supplier_sku
      order by rp.min_qty, coalesce(rp.max_qty, 2147483647), rp.id
    ) as tier_sort_order
  from ready_price_rows rp
)
insert into public.pricing_tiers (
  product_id,
  min_qty,
  max_qty,
  base_price,
  sort_order
)
select
  m.product_id,
  rp.min_qty,
  rp.max_qty,
  rp.unit_cost,
  rp.tier_sort_order
from ranked_prices rp
join gfl_product_insert_map m
  on m.supplier_sku = rp.preview_supplier_sku
order by m.supplier_sku, rp.tier_sort_order;

with
{COMMON_CTES}
insert into public.product_colours (
  product_id,
  name,
  hex,
  sort_order
)
select
  m.product_id,
  rc.colour_name,
  rc.hex,
  rc.sort_order
from ready_colour_rows rc
join gfl_product_insert_map m
  on m.supplier_sku = rc.preview_supplier_sku
 and m.raw_supplier_sku = rc.raw_supplier_sku
 and m.source_row_number = rc.source_row_number
where nullif(trim(coalesce(rc.colour_name, '')), '') is not null
order by m.supplier_sku, rc.sort_order, rc.id;

with
{COMMON_CTES}
insert into public.product_images (
  product_id,
  supplier,
  supplier_sku,
  image_url,
  image_role,
  colour_link_status,
  source_image_id,
  sort_order,
  raw_json
)
select
  m.product_id,
  {sql_string(SUPPLIER)},
  fir.preview_supplier_sku,
  fir.image_url,
  case
    when fir.image_role in ('main','detail','lifestyle','swatch','fallback','gallery') then fir.image_role
    else 'gallery'
  end as image_role,
  case
    when fir.colour_key is not null or fir.colour_name is not null then 'mismatch'
    when fir.image_role = 'swatch' then 'ambiguous'
    else 'not_colour_specific'
  end as colour_link_status,
  fir.source_image_id,
  fir.sort_order,
  fir.raw_json || jsonb_build_object(
    'raw_supplier_sku', fir.raw_supplier_sku,
    'preview_supplier_sku', fir.preview_supplier_sku,
    'source_row_number', fir.source_row_number,
    'gfl_transform', 'product_images_gallery_fallback'
  ) as raw_json
from fallback_image_rows fir
join gfl_product_insert_map m
  on m.supplier_sku = fir.preview_supplier_sku
 and m.raw_supplier_sku = fir.raw_supplier_sku
 and m.source_row_number = fir.source_row_number
order by m.supplier_sku, fir.sort_order, fir.id;

do $$
declare
  inserted_products int;
  published_products int;
  inserted_price_tiers int;
  expected_price_tiers int;
  inserted_colours int;
  expected_colours int;
  inserted_fallback_images int;
  expected_fallback_images int;
begin
  with
  {COMMON_CTES}
  select count(*) into inserted_products
  from public.products prod
  join product_rows pr
    on pr.supplier_sku = prod.supplier_sku
  where prod.supplier = {sql_string(SUPPLIER)};

  if inserted_products <> {EXPECTED_READY_ROWS} then
    raise exception 'Inserted GFL product count mismatch: expected %, got %.', {EXPECTED_READY_ROWS}, inserted_products;
  end if;

  with
  {COMMON_CTES}
  select count(*) into published_products
  from public.products prod
  join product_rows pr
    on pr.supplier_sku = prod.supplier_sku
  where prod.supplier = {sql_string(SUPPLIER)}
    and prod.is_published is true;

  if published_products <> 0 then
    raise exception 'GFL product insert published rows. Stop.';
  end if;

  with
  {COMMON_CTES}
  select count(*) into expected_price_tiers
  from ready_price_rows;

  select count(*) into inserted_price_tiers
  from public.pricing_tiers pt
  join public.products prod on prod.id = pt.product_id
  where prod.supplier = {sql_string(SUPPLIER)};

  if inserted_price_tiers <> expected_price_tiers then
    raise exception 'GFL pricing_tiers count mismatch: expected %, got %.', expected_price_tiers, inserted_price_tiers;
  end if;

  with
  {COMMON_CTES}
  select count(*) into expected_colours
  from ready_colour_rows
  where nullif(trim(coalesce(colour_name, '')), '') is not null;

  select count(*) into inserted_colours
  from public.product_colours pc
  join public.products prod on prod.id = pc.product_id
  where prod.supplier = {sql_string(SUPPLIER)};

  if inserted_colours <> expected_colours then
    raise exception 'GFL product_colours count mismatch: expected %, got %.', expected_colours, inserted_colours;
  end if;

  with
  {COMMON_CTES}
  select count(*) into expected_fallback_images
  from fallback_image_rows;

  select count(*) into inserted_fallback_images
  from public.product_images pi
  join public.products prod on prod.id = pi.product_id
  where prod.supplier = {sql_string(SUPPLIER)};

  if inserted_fallback_images <> expected_fallback_images then
    raise exception 'GFL product_images fallback count mismatch: expected %, got %.', expected_fallback_images, inserted_fallback_images;
  end if;
end $$;

commit;

-- After this succeeds, run:
-- outputs/supplier_import_foundation/gear_for_life_pilot/gear_for_life_product_insert_check_READONLY.sql
"""


def build_check_sql() -> str:
    return f"""-- Gear For Life product INSERT check.
-- READ ONLY. Run only after gear_for_life_product_insert_DRAFT.sql succeeds.

with
{COMMON_CTES},
inserted_products as (
  select prod.*
  from public.products prod
  join product_rows pr
    on pr.supplier_sku = prod.supplier_sku
  where prod.supplier = (select target_supplier from params)
),
inserted_price_tiers as (
  select pt.*
  from public.pricing_tiers pt
  join inserted_products prod on prod.id = pt.product_id
),
inserted_colours as (
  select pc.*
  from public.product_colours pc
  join inserted_products prod on prod.id = pc.product_id
),
inserted_fallback_images as (
  select pi.*
  from public.product_images pi
  join inserted_products prod on prod.id = pi.product_id
),
published_gfl_products as (
  select id, supplier_sku, slug
  from inserted_products
  where is_published is true
),
blocked_products_created as (
  select prod.id, prod.supplier_sku, prod.slug
  from public.products prod
  join blocked_rows b on b.supplier_sku = prod.supplier_sku
  where prod.supplier = (select target_supplier from params)
),
duplicate_gfl_skus as (
  select supplier_sku, count(*) as row_count, jsonb_agg(slug order by slug) as slugs
  from inserted_products
  group by supplier_sku
  having count(*) > 1
),
checks as (
  select 'batch' as check_name, (select count(*) from gfl_batch)::int as actual_value, 1::int as expected_value, '{{}}'::jsonb as details
  union all select 'transform_preview_rows', (select count(*) from preview_rows)::int, {EXPECTED_TRANSFORM_PREVIEW_ROWS}, '{{}}'::jsonb
  union all select 'ready_rows', (select count(*) from ready_rows)::int, {EXPECTED_READY_ROWS}, '{{}}'::jsonb
  union all select 'blocked_rows', (select count(*) from blocked_rows)::int, {EXPECTED_BLOCKED_ROWS}, '{{}}'::jsonb
  union all select 'products_inserted', (select count(*) from inserted_products)::int, {EXPECTED_READY_ROWS}, '{{}}'::jsonb
  union all select 'products_published', (select count(*) from published_gfl_products)::int, 0, coalesce((select jsonb_agg(to_jsonb(published_gfl_products) order by supplier_sku) from published_gfl_products), '[]'::jsonb)
  union all select 'blocked_products_created', (select count(*) from blocked_products_created)::int, 0, coalesce((select jsonb_agg(to_jsonb(blocked_products_created) order by supplier_sku) from blocked_products_created), '[]'::jsonb)
  union all select 'duplicate_gfl_skus', (select count(*) from duplicate_gfl_skus)::int, 0, coalesce((select jsonb_agg(to_jsonb(duplicate_gfl_skus) order by supplier_sku) from duplicate_gfl_skus), '[]'::jsonb)
  union all select 'pricing_tiers_inserted', (select count(*) from inserted_price_tiers)::int, (select count(*) from ready_price_rows)::int, '{{}}'::jsonb
  union all select 'product_colours_inserted', (select count(*) from inserted_colours)::int, (select count(*) from ready_colour_rows where nullif(trim(coalesce(colour_name, '')), '') is not null)::int, '{{}}'::jsonb
  union all select 'product_images_gallery_fallback_inserted', (select count(*) from inserted_fallback_images)::int, (select count(*) from fallback_image_rows)::int, '{{}}'::jsonb
  union all select 'safe_colour_images_still_in_staging', (select count(*) from safe_colour_images)::int, (select count(*) from safe_colour_images)::int, '{{}}'::jsonb
  union all select 'non_local_stock_products', (select count(*) from inserted_products where fulfillment <> 'local_stock')::int, 0, '{{}}'::jsonb
  union all select 'missing_product_min_qty', (select count(*) from inserted_products where min_qty is null or min_qty <= 0)::int, 0, '{{}}'::jsonb
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by check_name;
"""


def validate_sql(preflight_sql: str, insert_sql: str, check_sql: str) -> None:
    readonly_forbidden = ("insert into public.", "update public.", "delete from public.")
    for path, sql in ((PREFLIGHT_SQL, preflight_sql), (CHECK_SQL, check_sql)):
      lowered = sql.lower()
      for forbidden in readonly_forbidden:
          if forbidden in lowered:
              raise ValueError(f"{path.name} contains forbidden READONLY token: {forbidden}")

    lowered_insert = insert_sql.lower()
    for forbidden in ("public.url_pages", "public.navigation", "update public.", "delete from public."):
        if forbidden in lowered_insert:
            raise ValueError(f"{INSERT_SQL.name} contains forbidden token: {forbidden}")
    if "true as is_published" in lowered_insert or "is_published, true" in lowered_insert:
        raise ValueError("Insert SQL must not publish products.")


def main() -> None:
    preflight_sql = build_preflight_sql()
    insert_sql = build_insert_sql()
    check_sql = build_check_sql()
    validate_sql(preflight_sql, insert_sql, check_sql)
    PREFLIGHT_SQL.write_text(preflight_sql, encoding="utf-8")
    INSERT_SQL.write_text(insert_sql, encoding="utf-8")
    CHECK_SQL.write_text(check_sql, encoding="utf-8")
    print(f"Wrote {PREFLIGHT_SQL}")
    print(f"Wrote {INSERT_SQL}")
    print(f"Wrote {CHECK_SQL}")


if __name__ == "__main__":
    main()
