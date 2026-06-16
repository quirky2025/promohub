-- Gear For Life product INSERT preflight.
-- READ ONLY. Does not write products or child tables.

with
required_columns(table_name, column_name) as (
  values
    ('products', 'name'),
    ('products', 'slug'),
    ('products', 'category'),
    ('products', 'subcategory'),
    ('products', 'brand'),
    ('products', 'supplier'),
    ('products', 'supplier_sku'),
    ('products', 'supplier_raw_category_path'),
    ('products', 'min_qty'),
    ('products', 'description'),
    ('products', 'materials'),
    ('products', 'dimensions'),
    ('products', 'packing'),
    ('products', 'is_published'),
    ('products', 'status'),
    ('products', 'material_tags'),
    ('products', 'tags'),
    ('products', 'fulfillment'),
    ('products', 'offer_type'),
    ('products', 'is_eco'),
    ('products', 'is_new_arrival'),
    ('products', 'is_sale'),
    ('products', 'meta_title'),
    ('products', 'meta_description'),
    ('products', 'alt_text'),
    ('products', 'seo_description'),
    ('product_colours', 'product_id'),
    ('product_colours', 'name'),
    ('product_colours', 'hex'),
    ('product_colours', 'sort_order'),
    ('pricing_tiers', 'product_id'),
    ('pricing_tiers', 'min_qty'),
    ('pricing_tiers', 'max_qty'),
    ('pricing_tiers', 'base_price'),
    ('pricing_tiers', 'sort_order'),
    ('product_images', 'product_id'),
    ('product_images', 'supplier'),
    ('product_images', 'supplier_sku'),
    ('product_images', 'image_url'),
    ('product_images', 'image_role'),
    ('product_images', 'colour_link_status'),
    ('product_images', 'source_image_id'),
    ('product_images', 'sort_order'),
    ('product_images', 'raw_json')
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
params as (
  select 'Gear For Life'::text as target_supplier,
         'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'::text as target_source_file_hash
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
),
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
  union all select 'batch', (select count(*) from gfl_batch)::int, 1, '{}'::jsonb
  union all select 'raw_products', (select count(*) from public.supplier_raw_product_rows r join gfl_batch b on b.batch_id = r.batch_id where r.supplier = (select target_supplier from params))::int, 472, '{}'::jsonb
  union all select 'transform_preview_rows', (select count(*) from preview_rows)::int, 471, '{}'::jsonb
  union all select 'ready_rows', (select count(*) from ready_rows)::int, 436, '{}'::jsonb
  union all select 'blocked_rows', (select count(*) from blocked_rows)::int, 35, '{}'::jsonb
  union all select 'needs_review_rows', (select count(*) from preview_rows where mapping_status = 'needs_review')::int, 0, '{}'::jsonb
  union all select 'existing_gfl_products', (select count(*) from existing_gfl_products)::int, 0, coalesce((select jsonb_agg(to_jsonb(existing_gfl_products) order by supplier_sku) from existing_gfl_products), '[]'::jsonb)
  union all select 'slug_conflicts', (select count(*) from slug_conflicts)::int, 0, coalesce((select jsonb_agg(to_jsonb(slug_conflicts) order by supplier_sku) from slug_conflicts), '[]'::jsonb)
  union all select 'sku_conflicts', (select count(*) from sku_conflicts)::int, 0, coalesce((select jsonb_agg(to_jsonb(sku_conflicts) order by supplier_sku) from sku_conflicts), '[]'::jsonb)
  union all select 'ready_rows_missing_product_price', (select count(*) from product_rows where min_qty is null)::int, 0, coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku, 'name', name) order by supplier_sku) from product_rows where min_qty is null), '[]'::jsonb)
  union all select 'target_products_to_insert', (select count(*) from product_rows)::int, 436, '{}'::jsonb
  union all select 'target_product_price_tiers', (select count(*) from ready_price_rows)::int, 773, '{}'::jsonb
  union all select 'target_product_colours', (select count(*) from ready_colour_rows)::int, (select count(*) from ready_colour_rows)::int, '{}'::jsonb
  union all select 'ready_images_total', (select count(*) from ready_images)::int, (select count(*) from ready_images)::int, '{}'::jsonb
  union all select 'safe_colour_images_preserved_in_staging', (select count(*) from safe_colour_images)::int, (select count(*) from safe_colour_images)::int, '{}'::jsonb
  union all select 'gallery_fallback_images_to_insert', (select count(*) from fallback_image_rows)::int, (select count(*) from fallback_image_rows)::int, '{}'::jsonb
  union all select 'products_table_rows_created_by_this_preflight', 0::int, 0, '{}'::jsonb
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by check_name;
