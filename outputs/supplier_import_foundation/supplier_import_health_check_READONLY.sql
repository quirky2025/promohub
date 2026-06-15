-- Supplier Import health check.
-- READ ONLY. Run after the supplier staging tables exist and raw rows are loaded.
-- Set target_batch_id to a concrete UUID to check one import batch, or leave null for all batches.

with params as (
  select null::uuid as target_batch_id
),
raw_rows as (
  select r.*
  from public.supplier_raw_product_rows r
  cross join params p
  where p.target_batch_id is null or r.batch_id = p.target_batch_id
),
sku_rows as (
  select
    batch_id,
    supplier,
    supplier_sku,
    count(*) as raw_row_count,
    count(distinct nullif(lower(trim(raw_name)), '')) as distinct_name_count,
    jsonb_agg(distinct raw_name) filter (where raw_name is not null) as names
  from raw_rows
  where nullif(trim(coalesce(supplier_sku, '')), '') is not null
  group by batch_id, supplier, supplier_sku
),
price_rows as (
  select p.*
  from public.supplier_price_rows p
  cross join params x
  where x.target_batch_id is null or p.batch_id = x.target_batch_id
),
colour_rows as (
  select c.*
  from public.supplier_raw_colour_options c
  cross join params x
  where x.target_batch_id is null or c.batch_id = x.target_batch_id
),
image_rows as (
  select i.*
  from public.supplier_raw_images i
  cross join params x
  where x.target_batch_id is null or i.batch_id = x.target_batch_id
),
decoration_rows as (
  select d.*
  from public.supplier_decoration_options d
  cross join params x
  where x.target_batch_id is null or d.batch_id = x.target_batch_id
),
preview_rows as (
  select p.*
  from public.supplier_transform_preview p
  cross join params x
  where x.target_batch_id is null or p.batch_id = x.target_batch_id
),
missing_sku as (
  select batch_id, supplier, source_row_number, raw_name
  from raw_rows
  where nullif(trim(coalesce(supplier_sku, '')), '') is null
),
missing_name as (
  select batch_id, supplier, supplier_sku, source_row_number
  from raw_rows
  where nullif(trim(coalesce(raw_name, '')), '') is null
),
sku_name_conflicts as (
  select batch_id, supplier, supplier_sku, raw_row_count, distinct_name_count, names
  from sku_rows
  where distinct_name_count > 1
),
skus_without_price as (
  select s.batch_id, s.supplier, s.supplier_sku
  from sku_rows s
  left join price_rows p
    on p.batch_id = s.batch_id
   and p.supplier = s.supplier
   and p.supplier_sku = s.supplier_sku
  where p.id is null
),
invalid_price_rows as (
  select batch_id, supplier, supplier_sku, min_qty, max_qty, unit_cost
  from price_rows
  where (min_qty is not null and min_qty <= 0)
     or (max_qty is not null and max_qty <= 0)
     or (unit_cost is not null and unit_cost < 0)
     or (min_qty is not null and max_qty is not null and max_qty < min_qty)
),
skus_without_images as (
  select s.batch_id, s.supplier, s.supplier_sku
  from sku_rows s
  left join image_rows i
    on i.batch_id = s.batch_id
   and i.supplier = s.supplier
   and i.supplier_sku = s.supplier_sku
  where i.id is null
),
images_without_colour_link as (
  select batch_id, supplier, supplier_sku, image_url
  from image_rows
  where nullif(trim(coalesce(colour_key, '')), '') is null
    and nullif(trim(coalesce(colour_name, '')), '') is null
),
colour_options_without_images as (
  select c.batch_id, c.supplier, c.supplier_sku, c.colour_key, c.colour_name
  from colour_rows c
  left join image_rows i
    on i.batch_id = c.batch_id
   and i.supplier = c.supplier
   and i.supplier_sku = c.supplier_sku
   and (
      (c.colour_key is not null and i.colour_key = c.colour_key)
      or (c.colour_name is not null and lower(i.colour_name) = lower(c.colour_name))
   )
  where i.id is null
),
image_colour_mismatches as (
  select i.batch_id, i.supplier, i.supplier_sku, i.colour_key, i.colour_name, i.image_url
  from image_rows i
  where (
      nullif(trim(coalesce(i.colour_key, '')), '') is not null
      or nullif(trim(coalesce(i.colour_name, '')), '') is not null
    )
    and not exists (
      select 1
      from colour_rows c
      where c.batch_id = i.batch_id
        and c.supplier = i.supplier
        and c.supplier_sku = i.supplier_sku
        and (
          (i.colour_key is not null and c.colour_key = i.colour_key)
          or (i.colour_name is not null and lower(c.colour_name) = lower(i.colour_name))
        )
    )
),
gallery_fallback_image_candidates as (
  select
    batch_id,
    supplier,
    supplier_sku,
    image_url,
    case
      when nullif(trim(coalesce(colour_key, '')), '') is null
       and nullif(trim(coalesce(colour_name, '')), '') is null
        then 'unlinked'
      else 'mismatch'
    end as gallery_reason
  from images_without_colour_link

  union all

  select
    batch_id,
    supplier,
    supplier_sku,
    image_url,
    'mismatch' as gallery_reason
  from image_colour_mismatches
),
decoration_missing_method as (
  select batch_id, supplier, supplier_sku, decoration_area
  from decoration_rows
  where nullif(trim(coalesce(decoration_method, '')), '') is null
),
manual_preview as (
  select batch_id, supplier, supplier_sku, raw_name, mapping_status, warning_flags, review_notes
  from preview_rows
  where mapping_status in ('needs_review','blocked','kit_or_bundle','collection_or_tag','fulfillment_only')
),
ready_preview as (
  select *
  from preview_rows
  where mapping_status = 'ready'
),
preview_missing_page_role as (
  select batch_id, supplier, supplier_sku, raw_name, mapping_status
  from preview_rows
  where nullif(trim(coalesce(page_role, '')), '') is null
),
preview_missing_fulfillment as (
  select batch_id, supplier, supplier_sku, raw_name, mapping_status
  from preview_rows
  where nullif(trim(coalesce(fulfillment, '')), '') is null
),
ready_rows_with_f_page_role as (
  select batch_id, supplier, supplier_sku, raw_name, page_role, target_category, target_subcategory
  from ready_preview
  where page_role = 'F'
)
select
  'raw_rows_missing_supplier_sku' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(missing_sku) order by supplier, source_row_number) filter (where supplier is not null), '[]'::jsonb) as details
from missing_sku

union all

select
  'raw_rows_missing_name' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(missing_name) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from missing_name

union all

select
  'supplier_sku_name_conflicts' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(sku_name_conflicts) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from sku_name_conflicts

union all

select
  'skus_without_price_rows' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(skus_without_price) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from skus_without_price

union all

select
  'invalid_price_rows' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(invalid_price_rows) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from invalid_price_rows

union all

select
  'skus_without_images' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(skus_without_images) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from skus_without_images

union all

select
  'images_without_colour_link' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(images_without_colour_link) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from images_without_colour_link

union all

select
  'colour_options_without_images' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(colour_options_without_images) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from colour_options_without_images

union all

select
  'image_colour_mismatches' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(image_colour_mismatches) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from image_colour_mismatches

union all

select
  'gallery_fallback_image_candidates' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(gallery_fallback_image_candidates) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from gallery_fallback_image_candidates

union all

select
  'decoration_options_missing_method' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_missing_method) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from decoration_missing_method

union all

select
  'transform_preview_needs_review' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(manual_preview) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from manual_preview

union all

select
  'transform_preview_missing_page_role' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(preview_missing_page_role) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from preview_missing_page_role

union all

select
  'transform_preview_missing_fulfillment' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(preview_missing_fulfillment) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from preview_missing_fulfillment

union all

select
  'ready_rows_with_f_page_role' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(ready_rows_with_f_page_role) order by supplier, supplier_sku) filter (where supplier is not null), '[]'::jsonb) as details
from ready_rows_with_f_page_role

union all

select
  'transform_preview_ready_count' as check_name,
  'ok' as health_status,
  count(*)::int as issue_count,
  jsonb_build_object(
    'ready_rows', count(*),
    'suppliers', coalesce(jsonb_object_agg(supplier, supplier_count), '{}'::jsonb)
  ) as details
from (
  select supplier, count(*) as supplier_count
  from ready_preview
  group by supplier
) ready_by_supplier;
