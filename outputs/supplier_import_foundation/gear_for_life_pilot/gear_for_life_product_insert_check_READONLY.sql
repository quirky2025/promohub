-- Gear For Life product INSERT check.
-- READ ONLY. Run only after gear_for_life_product_insert_DRAFT.sql succeeds.

with
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
  select 'batch' as check_name, (select count(*) from gfl_batch)::int as actual_value, 1::int as expected_value, '{}'::jsonb as details
  union all select 'transform_preview_rows', (select count(*) from preview_rows)::int, 471, '{}'::jsonb
  union all select 'ready_rows', (select count(*) from ready_rows)::int, 436, '{}'::jsonb
  union all select 'blocked_rows', (select count(*) from blocked_rows)::int, 35, '{}'::jsonb
  union all select 'products_inserted', (select count(*) from inserted_products)::int, 436, '{}'::jsonb
  union all select 'products_published', (select count(*) from published_gfl_products)::int, 0, coalesce((select jsonb_agg(to_jsonb(published_gfl_products) order by supplier_sku) from published_gfl_products), '[]'::jsonb)
  union all select 'blocked_products_created', (select count(*) from blocked_products_created)::int, 0, coalesce((select jsonb_agg(to_jsonb(blocked_products_created) order by supplier_sku) from blocked_products_created), '[]'::jsonb)
  union all select 'duplicate_gfl_skus', (select count(*) from duplicate_gfl_skus)::int, 0, coalesce((select jsonb_agg(to_jsonb(duplicate_gfl_skus) order by supplier_sku) from duplicate_gfl_skus), '[]'::jsonb)
  union all select 'pricing_tiers_inserted', (select count(*) from inserted_price_tiers)::int, (select count(*) from ready_price_rows)::int, '{}'::jsonb
  union all select 'product_colours_inserted', (select count(*) from inserted_colours)::int, (select count(*) from ready_colour_rows where nullif(trim(coalesce(colour_name, '')), '') is not null)::int, '{}'::jsonb
  union all select 'product_images_gallery_fallback_inserted', (select count(*) from inserted_fallback_images)::int, (select count(*) from fallback_image_rows)::int, '{}'::jsonb
  union all select 'safe_colour_images_still_in_staging', (select count(*) from safe_colour_images)::int, (select count(*) from safe_colour_images)::int, '{}'::jsonb
  union all select 'non_local_stock_products', (select count(*) from inserted_products where fulfillment <> 'local_stock')::int, 0, '{}'::jsonb
  union all select 'missing_product_min_qty', (select count(*) from inserted_products where min_qty is null or min_qty <= 0)::int, 0, '{}'::jsonb
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by check_name;
