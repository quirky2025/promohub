-- Gear For Life product INSERT error-state check.
-- READ ONLY. Run after a failed gear_for_life_product_insert_DRAFT.sql attempt.
-- Purpose: confirm whether the failed temp-table run left any partial product rows.

with params as (
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
  select p.*
  from public.supplier_transform_preview p
  join gfl_batch b on b.batch_id = p.batch_id
  where p.supplier = (select target_supplier from params)
),
inserted_products as (
  select id, supplier_sku, slug, is_published, status
  from public.products
  where supplier = (select target_supplier from params)
),
inserted_price_tiers as (
  select pt.*
  from public.pricing_tiers pt
  join inserted_products p on p.id = pt.product_id
),
inserted_colours as (
  select pc.*
  from public.product_colours pc
  join inserted_products p on p.id = pc.product_id
),
inserted_images as (
  select pi.*
  from public.product_images pi
  join inserted_products p on p.id = pi.product_id
),
published_products as (
  select supplier_sku, slug
  from inserted_products
  where is_published is true
),
duplicate_gfl_skus as (
  select supplier_sku, count(*) as row_count, jsonb_agg(slug order by slug) as slugs
  from inserted_products
  group by supplier_sku
  having count(*) > 1
),
product_sample as (
  select supplier_sku, slug, is_published, status
  from inserted_products
  order by supplier_sku
  limit 20
),
checks as (
  select 'batch' as check_name,
         (select count(*) from gfl_batch)::int as actual_value,
         1::int as expected_value,
         '{}'::jsonb as details
  union all select 'transform_preview_rows', (select count(*) from preview_rows)::int, 471, '{}'::jsonb
  union all select 'ready_rows', (select count(*) from preview_rows where mapping_status = 'ready')::int, 436, '{}'::jsonb
  union all select 'blocked_rows', (select count(*) from preview_rows where mapping_status = 'blocked')::int, 35, '{}'::jsonb
  union all select 'needs_review_rows', (select count(*) from preview_rows where mapping_status = 'needs_review')::int, 0, '{}'::jsonb
  union all select 'gfl_products_present_after_failed_insert', (select count(*) from inserted_products)::int, 0,
    coalesce((select jsonb_agg(to_jsonb(product_sample) order by supplier_sku) from product_sample), '[]'::jsonb)
  union all select 'gfl_pricing_tiers_present_after_failed_insert', (select count(*) from inserted_price_tiers)::int, 0, '{}'::jsonb
  union all select 'gfl_product_colours_present_after_failed_insert', (select count(*) from inserted_colours)::int, 0, '{}'::jsonb
  union all select 'gfl_product_images_present_after_failed_insert', (select count(*) from inserted_images)::int, 0, '{}'::jsonb
  union all select 'gfl_published_products_after_failed_insert', (select count(*) from published_products)::int, 0,
    coalesce((select jsonb_agg(to_jsonb(published_products) order by supplier_sku) from published_products), '[]'::jsonb)
  union all select 'duplicate_gfl_skus_after_failed_insert', (select count(*) from duplicate_gfl_skus)::int, 0,
    coalesce((select jsonb_agg(to_jsonb(duplicate_gfl_skus) order by supplier_sku) from duplicate_gfl_skus), '[]'::jsonb)
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by check_name;
