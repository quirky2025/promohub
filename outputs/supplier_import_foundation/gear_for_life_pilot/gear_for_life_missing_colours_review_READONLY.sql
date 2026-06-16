-- Gear For Life: missing product_colours review.
-- READ ONLY. Run after product insert postcheck is all ok.
-- Purpose: list the 28 Gear For Life draft products that have NO product_colours rows,
--          with source context for manual review. Does NOT update, insert, or fix anything.
--
-- Notes on source columns:
--   * Raw supplier CSV columns are stored as top-level keys inside
--     supplier_raw_product_rows.raw_json (the loader does raw_json = {**csv_row, ...}).
--     So colours_available_supplier / colours_available_appa / colour_image_file_names /
--     product_image_file_name / alternate_views_image_file_names are read via raw_json ->> '<key>'.
--   * There is no literal "raw_colour_name" column on supplier_raw_product_rows. The raw colour
--     names live in supplier_raw_colour_options.colour_name, so they are aggregated here as
--     raw_colour_names_from_colour_options for review context.

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
gfl_products as (
  select *
  from public.products
  where supplier = (select target_supplier from params)
),
-- Counts per product. The 28 review targets are products with zero product_colours rows.
product_rollup as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.slug,
    p.category,
    p.subcategory,
    p.min_qty,
    count(distinct pc.id)::int as colour_count,
    count(distinct pt.id)::int as pricing_tier_count,
    count(distinct pi.id)::int as product_image_fallback_count
  from gfl_products p
  left join public.product_colours pc on pc.product_id = p.id
  left join public.pricing_tiers  pt on pt.product_id = p.id
  left join public.product_images pi on pi.product_id = p.id
  group by p.id, p.supplier_sku, p.name, p.slug, p.category, p.subcategory, p.min_qty
),
missing_colour_products as (
  select *
  from product_rollup
  where colour_count = 0
),
-- Raw supplier row context (raw_json holds the original CSV columns).
raw_context as (
  select
    mc.id as product_id,
    mc.supplier_sku,
    pr.raw_supplier_sku,
    pr.source_row_number,
    r.raw_json ->> 'colours_available_supplier'        as colours_available_supplier,
    r.raw_json ->> 'colours_available_appa'            as colours_available_appa,
    r.raw_json ->> 'colour_image_file_names'           as colour_image_file_names,
    r.raw_json ->> 'product_image_file_name'           as product_image_file_name,
    r.raw_json ->> 'alternate_views_image_file_names'  as alternate_views_image_file_names
  from missing_colour_products mc
  left join preview_rows pr
    on pr.supplier_sku = mc.supplier_sku
  left join public.supplier_raw_product_rows r
    on r.supplier = (select target_supplier from params)
   and r.batch_id = pr.batch_id
   and r.supplier_sku = pr.raw_supplier_sku
   and r.source_row_number = pr.source_row_number
),
-- Raw colour names from the colour-options staging table (best available "raw colour name").
raw_colour_names as (
  select
    mc.id as product_id,
    string_agg(distinct nullif(trim(c.colour_name), ''), ' | '
               order by nullif(trim(c.colour_name), '')) as raw_colour_names_from_colour_options,
    count(c.id)::int as raw_colour_option_row_count
  from missing_colour_products mc
  left join preview_rows pr
    on pr.supplier_sku = mc.supplier_sku
  left join public.supplier_raw_colour_options c
    on c.supplier = (select target_supplier from params)
   and c.batch_id = pr.batch_id
   and c.supplier_sku = pr.raw_supplier_sku
   and pr.source_row_number::text = c.raw_json ->> 'source_row_number'
  group by mc.id
),
review as (
  select
    mc.supplier_sku,
    mc.name,
    mc.slug,
    mc.category,
    mc.subcategory,
    mc.min_qty,
    mc.product_image_fallback_count,
    mc.pricing_tier_count,
    rc.raw_supplier_sku,
    rc.source_row_number,
    rcn.raw_colour_names_from_colour_options,
    rcn.raw_colour_option_row_count,
    rc.colours_available_supplier,
    rc.colours_available_appa,
    rc.colour_image_file_names,
    rc.product_image_file_name,
    rc.alternate_views_image_file_names,
    -- Did the raw source carry any meaningful colour text?
    case
      when nullif(trim(coalesce(rc.colours_available_supplier, '')), '') is not null
        or nullif(trim(coalesce(rc.colours_available_appa, '')), '')     is not null
        or coalesce(rcn.raw_colour_option_row_count, 0) > 0
      then 'needs_colour_review'
      else 'ok_no_colour_options'
    end as suggested_status
  from missing_colour_products mc
  left join raw_context     rc  on rc.product_id  = mc.id
  left join raw_colour_names rcn on rcn.product_id = mc.id
)
select
  supplier_sku,
  name,
  slug,
  category,
  subcategory,
  min_qty,
  product_image_fallback_count,
  pricing_tier_count,
  raw_supplier_sku,
  source_row_number,
  raw_colour_names_from_colour_options,
  raw_colour_option_row_count,
  colours_available_supplier,
  colours_available_appa,
  colour_image_file_names,
  product_image_file_name,
  alternate_views_image_file_names,
  suggested_status
from review
order by suggested_status, supplier_sku;
