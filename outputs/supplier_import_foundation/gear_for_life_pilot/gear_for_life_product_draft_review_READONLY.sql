-- Gear For Life product draft review.
-- READ ONLY. Run after product insert postcheck is all ok.
-- Purpose: review the 436 unpublished GFL draft products before any image upload, decoration transform, or publish step.

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
  select
    p.*,
    p.preview_json ->> 'raw_supplier_sku' as raw_supplier_sku,
    nullif(p.preview_json ->> 'source_row_number', '')::int as source_row_number
  from public.supplier_transform_preview p
  join gfl_batch b on b.batch_id = p.batch_id
  where p.supplier = (select target_supplier from params)
),
gfl_products as (
  select *
  from public.products
  where supplier = (select target_supplier from params)
),
product_rollup as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.slug,
    p.category,
    p.subcategory,
    p.brand,
    p.min_qty,
    p.is_published,
    p.status,
    p.fulfillment,
    count(distinct pt.id)::int as price_tier_count,
    min(pt.base_price) as min_supplier_product_cost,
    max(pt.base_price) as max_supplier_product_cost,
    count(distinct pc.id)::int as colour_count,
    count(distinct pi.id)::int as gallery_image_count
  from gfl_products p
  left join public.pricing_tiers pt on pt.product_id = p.id
  left join public.product_colours pc on pc.product_id = p.id
  left join public.product_images pi on pi.product_id = p.id
  group by
    p.id,
    p.supplier_sku,
    p.name,
    p.slug,
    p.category,
    p.subcategory,
    p.brand,
    p.min_qty,
    p.is_published,
    p.status,
    p.fulfillment
),
category_distribution as (
  select
    category,
    subcategory,
    count(*)::int as product_count
  from gfl_products
  group by category, subcategory
),
products_missing_price as (
  select supplier_sku, name, slug
  from product_rollup
  where price_tier_count = 0
  order by supplier_sku
),
products_missing_colours as (
  select supplier_sku, name, slug
  from product_rollup
  where colour_count = 0
  order by supplier_sku
),
products_missing_gallery_images as (
  select supplier_sku, name, slug
  from product_rollup
  where gallery_image_count = 0
  order by supplier_sku
),
products_published as (
  select supplier_sku, name, slug
  from product_rollup
  where is_published is true
  order by supplier_sku
),
non_local_stock as (
  select supplier_sku, name, slug, fulfillment
  from product_rollup
  where fulfillment <> 'local_stock'
  order by supplier_sku
),
sample_products as (
  select
    supplier_sku,
    name,
    slug,
    category,
    subcategory,
    min_qty,
    price_tier_count,
    min_supplier_product_cost,
    colour_count,
    gallery_image_count,
    is_published
  from product_rollup
  order by category, subcategory, supplier_sku
  limit 40
),
checks as (
  select 'summary_products_inserted' as check_name,
         'ok' as status,
         (select count(*) from gfl_products)::int as actual_value,
         436::int as expected_value,
         '{}'::jsonb as details
  union all select 'summary_products_published',
         case when (select count(*) from products_published) = 0 then 'ok' else 'issue' end,
         (select count(*) from products_published)::int,
         0,
         coalesce((select jsonb_agg(to_jsonb(products_published) order by supplier_sku) from products_published), '[]'::jsonb)
  union all select 'summary_non_local_stock',
         case when (select count(*) from non_local_stock) = 0 then 'ok' else 'issue' end,
         (select count(*) from non_local_stock)::int,
         0,
         coalesce((select jsonb_agg(to_jsonb(non_local_stock) order by supplier_sku) from non_local_stock), '[]'::jsonb)
  union all select 'summary_missing_price_tiers',
         case when (select count(*) from products_missing_price) = 0 then 'ok' else 'issue' end,
         (select count(*) from products_missing_price)::int,
         0,
         coalesce((select jsonb_agg(to_jsonb(products_missing_price) order by supplier_sku) from products_missing_price), '[]'::jsonb)
  union all select 'summary_missing_colours',
         case when (select count(*) from products_missing_colours) = 0 then 'ok' else 'warning' end,
         (select count(*) from products_missing_colours)::int,
         0,
         coalesce((select jsonb_agg(to_jsonb(products_missing_colours) order by supplier_sku) from products_missing_colours), '[]'::jsonb)
  union all select 'summary_missing_gallery_images',
         case when (select count(*) from products_missing_gallery_images) = 0 then 'ok' else 'warning' end,
         (select count(*) from products_missing_gallery_images)::int,
         0,
         coalesce((select jsonb_agg(to_jsonb(products_missing_gallery_images) order by supplier_sku) from products_missing_gallery_images), '[]'::jsonb)
  union all select 'summary_pricing_tiers',
         'ok',
         (select count(*) from public.pricing_tiers pt join gfl_products p on p.id = pt.product_id)::int,
         773,
         '{}'::jsonb
  union all select 'summary_product_colours',
         'ok',
         (select count(*) from public.product_colours pc join gfl_products p on p.id = pc.product_id)::int,
         892,
         '{}'::jsonb
  union all select 'summary_gallery_fallback_images',
         'ok',
         (select count(*) from public.product_images pi join gfl_products p on p.id = pi.product_id)::int,
         2384,
         jsonb_build_object('note', 'These are supplier image filenames/fallback records. They are not product_colours.images and should not be treated as published storefront images yet.')
  union all select 'category_distribution',
         'report',
         (select count(*) from category_distribution)::int,
         null::int,
         coalesce((select jsonb_agg(to_jsonb(category_distribution) order by category, subcategory) from category_distribution), '[]'::jsonb)
  union all select 'draft_product_sample_first_40',
         'report',
         (select count(*) from sample_products)::int,
         null::int,
         coalesce((select jsonb_agg(to_jsonb(sample_products) order by category, subcategory, supplier_sku) from sample_products), '[]'::jsonb)
)
select
  check_name,
  status,
  actual_value,
  expected_value,
  details
from checks
order by
  case status
    when 'issue' then 1
    when 'warning' then 2
    when 'report' then 4
    else 3
  end,
  check_name;
