-- Gear For Life: expected image filenames inventory.
-- READ ONLY. Purpose: list every image filename the DB expects for GFL, so the
-- actual image folder can be cross-checked (missing / extra / duplicate / case
-- or spacing mismatches) BEFORE uploading to Cloudinary. No writes.
--
-- Sources:
--   * product_images       -> gallery/fallback images already inserted (image_role).
--   * supplier_raw_images   -> colour-specific images still in staging (have colour_name),
--                              linked to the product via supplier_transform_preview.
-- Export the result to CSV and send it; it is the checklist for the image folder.

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
  select id, supplier_sku
  from public.products
  where supplier = (select target_supplier from params)
),
from_product_images as (
  select
    p.supplier_sku,
    pi.image_url,
    pi.image_role,
    null::text as colour_name,
    'product_images'::text as source
  from public.product_images pi
  join gfl_products p on p.id = pi.product_id
),
from_staging_swatches as (
  select
    pr.supplier_sku,
    i.image_url,
    i.image_role,
    i.colour_name,
    'staging_swatch'::text as source
  from public.supplier_raw_images i
  join preview_rows pr
    on pr.batch_id = i.batch_id
   and pr.raw_supplier_sku = i.supplier_sku
   and pr.source_row_number::text = i.raw_json ->> 'source_row_number'
  where i.supplier = (select target_supplier from params)
    and nullif(trim(coalesce(i.colour_name, '')), '') is not null
),
combined as (
  select * from from_product_images
  union all
  select * from from_staging_swatches
),
dedup as (
  select
    image_url,
    string_agg(distinct supplier_sku, ', ' order by supplier_sku) as supplier_skus,
    string_agg(distinct image_role, ', ' order by image_role)     as image_roles,
    string_agg(distinct coalesce(colour_name, ''), ', ')          as colour_names,
    string_agg(distinct source, ', ' order by source)             as sources,
    count(*)::int as reference_count
  from combined
  group by image_url
)
select
  image_url,
  supplier_skus,
  image_roles,
  nullif(colour_names, '') as colour_names,
  sources,
  reference_count
from dedup
order by image_url;
