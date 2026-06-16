-- Gear For Life: colour-image readiness report.
-- READ ONLY. Purpose: before populating product_colours.images (after Cloudinary
-- upload), verify the source data can satisfy the rule:
--   * single-colour product  -> needs at least one product image (main/gallery).
--   * multi-colour product    -> EACH colour must have its own colour-specific image
--                                (e.g. a "Red" colour must map to a red image, not a
--                                generic/other-colour image).
-- This finds the gaps that would block an accurate image mapping. No writes.
--
-- Linkage mirrors the product insert check:
--   products.supplier_sku = supplier_transform_preview.supplier_sku
--   supplier_raw_images joined via (batch_id, raw_supplier_sku, source_row_number).
-- Colour-specific images = supplier_raw_images rows whose colour_name is set;
-- matched to a product_colours row by product + lower(colour_name) = lower(name).

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
  select id, supplier_sku, name
  from public.products
  where supplier = (select target_supplier from params)
),
colours as (
  select
    pc.id as colour_id,
    p.id as product_id,
    p.supplier_sku,
    pc.name as colour_name,
    pc.images is null or jsonb_array_length(pc.images) = 0 as images_empty
  from gfl_products p
  join public.product_colours pc on pc.product_id = p.id
),
colour_counts as (
  select supplier_sku, count(*)::int as colour_count
  from colours
  group by supplier_sku
),
-- colour-specific images still in staging (have a colour_name)
raw_colour_images as (
  select
    pr.supplier_sku as product_supplier_sku,
    lower(trim(i.colour_name)) as colour_name_lc,
    i.image_url
  from public.supplier_raw_images i
  join preview_rows pr
    on pr.batch_id = i.batch_id
   and pr.raw_supplier_sku = i.supplier_sku
   and pr.source_row_number::text = i.raw_json ->> 'source_row_number'
  where i.supplier = (select target_supplier from params)
    and nullif(trim(coalesce(i.colour_name, '')), '') is not null
),
-- any product image available (main preferred, else gallery) per product
product_image_counts as (
  select
    p.supplier_sku,
    count(*)::int as image_count,
    count(*) filter (where pi.image_role = 'main')::int as main_count
  from public.product_images pi
  join gfl_products p on p.id = pi.product_id
  group by p.supplier_sku
),
colour_assessment as (
  select
    c.colour_id,
    c.supplier_sku,
    c.colour_name,
    cc.colour_count,
    (cc.colour_count = 1) as is_single_colour,
    exists (
      select 1 from raw_colour_images ri
      where ri.product_supplier_sku = c.supplier_sku
        and ri.colour_name_lc = lower(trim(c.colour_name))
    ) as has_specific_image,
    coalesce(pic.image_count, 0) as product_image_count,
    coalesce(pic.main_count, 0) as product_main_image_count
  from colours c
  join colour_counts cc on cc.supplier_sku = c.supplier_sku
  left join product_image_counts pic on pic.supplier_sku = c.supplier_sku
),
-- GAP 1: multi-colour colours with NO matching colour-specific image
multicolour_missing_specific as (
  select supplier_sku, colour_name, colour_count, product_image_count
  from colour_assessment
  where not is_single_colour
    and not has_specific_image
  order by supplier_sku, colour_name
),
-- GAP 2: single-colour products with NO image at all to use
single_colour_no_image as (
  select supplier_sku, colour_name
  from colour_assessment
  where is_single_colour
    and product_image_count = 0
  order by supplier_sku
),
checks as (
  select 'gfl_products_total' as check_name, 'report' as status,
         (select count(*) from gfl_products)::int as actual_value, '{}'::jsonb as details
  union all select 'gfl_colour_rows_total', 'report',
         (select count(*) from colours)::int, '{}'::jsonb
  union all select 'colour_rows_with_empty_images_now', 'report',
         (select count(*) from colours where images_empty)::int, '{}'::jsonb
  union all select 'single_colour_products', 'report',
         (select count(*) from colour_counts where colour_count = 1)::int, '{}'::jsonb
  union all select 'multi_colour_products', 'report',
         (select count(*) from colour_counts where colour_count > 1)::int, '{}'::jsonb
  union all select 'multicolour_colour_rows_total', 'report',
         (select count(*) from colour_assessment where not is_single_colour)::int, '{}'::jsonb
  union all select 'multicolour_colours_with_specific_image', 'report',
         (select count(*) from colour_assessment where not is_single_colour and has_specific_image)::int, '{}'::jsonb
  union all select 'multicolour_colours_MISSING_specific_image',
         case when (select count(*) from multicolour_missing_specific) = 0 then 'ok' else 'needs_attention' end,
         (select count(*) from multicolour_missing_specific)::int,
         coalesce((select jsonb_agg(to_jsonb(multicolour_missing_specific) order by supplier_sku, colour_name) from multicolour_missing_specific), '[]'::jsonb)
  union all select 'single_colour_products_with_NO_image',
         case when (select count(*) from single_colour_no_image) = 0 then 'ok' else 'needs_attention' end,
         (select count(*) from single_colour_no_image)::int,
         coalesce((select jsonb_agg(to_jsonb(single_colour_no_image) order by supplier_sku) from single_colour_no_image), '[]'::jsonb)
)
select check_name, status, actual_value, details
from checks
order by
  case status when 'needs_attention' then 1 when 'ok' then 2 else 3 end,
  check_name;
