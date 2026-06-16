-- Gear For Life pilot preflight.
-- READ ONLY. Run only after staging tables exist and Gear For Life raw data has been loaded.
-- Set target_batch_id to a Gear For Life batch UUID, or leave null to check all Gear For Life staging rows.

with params as (
  select
    'Gear For Life'::text as target_supplier,
    null::uuid as target_batch_id
),
raw_rows as (
  select r.*
  from public.supplier_raw_product_rows r
  join params p on p.target_supplier = r.supplier
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
  join params x on x.target_supplier = p.supplier
  where x.target_batch_id is null or p.batch_id = x.target_batch_id
),
colour_rows as (
  select c.*
  from public.supplier_raw_colour_options c
  join params x on x.target_supplier = c.supplier
  where x.target_batch_id is null or c.batch_id = x.target_batch_id
),
image_rows as (
  select i.*
  from public.supplier_raw_images i
  join params x on x.target_supplier = i.supplier
  where x.target_batch_id is null or i.batch_id = x.target_batch_id
),
decoration_rows as (
  select d.*
  from public.supplier_decoration_options d
  join params x on x.target_supplier = d.supplier
  where x.target_batch_id is null or d.batch_id = x.target_batch_id
),
decoration_price_rows as (
  select p.*
  from public.supplier_decoration_price_rows p
  join params x on x.target_supplier = p.supplier
  where x.target_batch_id is null or p.batch_id = x.target_batch_id
),
decoration_rate_cards as (
  select c.*
  from public.supplier_decoration_rate_cards c
  join params x on x.target_supplier = c.supplier
  where x.target_batch_id is null or c.batch_id = x.target_batch_id
),
decoration_rate_card_rows as (
  select r.*
  from public.supplier_decoration_rate_card_rows r
  join params x on x.target_supplier = r.supplier
  where x.target_batch_id is null or r.batch_id = x.target_batch_id
),
supplier_defaults as (
  select d.*
  from public.supplier_commercial_defaults d
  join params x on x.target_supplier = d.supplier
  where x.target_batch_id is null or d.batch_id = x.target_batch_id or d.batch_id is null
),
preview_rows as (
  select p.*
  from public.supplier_transform_preview p
  join params x on x.target_supplier = p.supplier
  where x.target_batch_id is null or p.batch_id = x.target_batch_id
),
missing_sku as (
  select batch_id, source_row_number, raw_name
  from raw_rows
  where nullif(trim(coalesce(supplier_sku, '')), '') is null
),
missing_name as (
  select batch_id, supplier_sku, source_row_number
  from raw_rows
  where nullif(trim(coalesce(raw_name, '')), '') is null
),
sku_name_conflicts as (
  select batch_id, supplier_sku, raw_row_count, distinct_name_count, names
  from sku_rows
  where distinct_name_count > 1
),
blank_category_path as (
  select batch_id, supplier_sku, raw_name, source_row_number
  from raw_rows
  where nullif(trim(coalesce(raw_category_path, '')), '') is null
),
skus_without_price as (
  select s.batch_id, s.supplier_sku
  from sku_rows s
  left join price_rows p
    on p.batch_id = s.batch_id
   and p.supplier_sku = s.supplier_sku
  where p.id is null
),
invalid_price_rows as (
  select batch_id, supplier_sku, min_qty, max_qty, unit_cost
  from price_rows
  where (min_qty is not null and min_qty <= 0)
     or (max_qty is not null and max_qty <= 0)
     or (unit_cost is not null and unit_cost < 0)
     or (min_qty is not null and max_qty is not null and max_qty < min_qty)
),
images_without_colour_link as (
  select batch_id, supplier_sku, image_url
  from image_rows
  where nullif(trim(coalesce(colour_key, '')), '') is null
    and nullif(trim(coalesce(colour_name, '')), '') is null
),
image_colour_mismatches as (
  select i.batch_id, i.supplier_sku, i.colour_key, i.colour_name, i.image_url
  from image_rows i
  where (
      nullif(trim(coalesce(i.colour_key, '')), '') is not null
      or nullif(trim(coalesce(i.colour_name, '')), '') is not null
    )
    and not exists (
      select 1
      from colour_rows c
      where c.batch_id = i.batch_id
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
    supplier_sku,
    image_url,
    'unlinked' as gallery_reason
  from images_without_colour_link

  union all

  select
    batch_id,
    supplier_sku,
    image_url,
    'mismatch' as gallery_reason
  from image_colour_mismatches
),
decoration_options_missing_key as (
  select batch_id, supplier_sku, decoration_method, decoration_area, artwork_size_label, price_status
  from decoration_rows
  where nullif(trim(coalesce(decoration_option_key, '')), '') is null
    and price_status not in ('included','unavailable')
),
decoration_option_key_duplicates as (
  select
    batch_id,
    supplier_sku,
    decoration_option_key,
    count(*) as option_count,
    jsonb_agg(
      jsonb_build_object(
        'decoration_method', decoration_method,
        'decoration_area', decoration_area,
        'artwork_size_label', artwork_size_label,
        'price_status', price_status
      )
      order by decoration_method, decoration_area, artwork_size_label
    ) as duplicate_options
  from decoration_rows
  where nullif(trim(coalesce(decoration_option_key, '')), '') is not null
  group by batch_id, supplier_sku, decoration_option_key
  having count(*) > 1
),
branding_price_rows_without_product_sku as (
  select p.batch_id, p.supplier_sku, p.decoration_method, p.decoration_area, p.artwork_size_label
  from decoration_price_rows p
  left join sku_rows s
    on s.batch_id = p.batch_id
   and s.supplier_sku = p.supplier_sku
  where s.supplier_sku is null
),
decoration_options_without_price_rows as (
  select
    d.batch_id,
    d.supplier_sku,
    d.decoration_method,
    d.decoration_area,
    d.artwork_size_label,
    d.price_status
  from decoration_rows d
  left join decoration_price_rows p
    on p.batch_id = d.batch_id
   and p.supplier_sku = d.supplier_sku
   and (
      p.supplier_decoration_option_id = d.id
      or (
        lower(coalesce(p.decoration_method, '')) = lower(coalesce(d.decoration_method, ''))
        and lower(coalesce(p.decoration_area, '')) = lower(coalesce(d.decoration_area, ''))
        and lower(coalesce(p.artwork_size_label, '')) = lower(coalesce(d.artwork_size_label, ''))
      )
   )
  where p.id is null
    and d.price_status not in ('request_quote','included','unavailable')
),
decoration_price_rows_missing_option_key as (
  select batch_id, supplier_sku, decoration_method, decoration_area, artwork_size_label, min_qty, price_status
  from decoration_price_rows
  where nullif(trim(coalesce(decoration_option_key, '')), '') is null
    and price_status not in ('included','unavailable')
),
decoration_price_rows_without_matching_option_key as (
  select
    p.batch_id,
    p.supplier_sku,
    p.decoration_option_key,
    p.decoration_method,
    p.decoration_area,
    p.artwork_size_label,
    p.min_qty,
    p.price_status
  from decoration_price_rows p
  left join decoration_rows d
    on d.batch_id = p.batch_id
   and d.supplier_sku = p.supplier_sku
   and d.decoration_option_key = p.decoration_option_key
  where nullif(trim(coalesce(p.decoration_option_key, '')), '') is not null
    and d.id is null
),
decoration_price_tier_duplicates as (
  select
    batch_id,
    supplier_sku,
    decoration_option_key,
    min_qty,
    max_qty,
    count(*) as tier_count,
    jsonb_agg(
      jsonb_build_object(
        'decoration_method', decoration_method,
        'decoration_area', decoration_area,
        'artwork_size_label', artwork_size_label,
        'unit_cost', unit_cost,
        'price_status', price_status
      )
      order by decoration_method, decoration_area, artwork_size_label
    ) as duplicate_tiers
  from decoration_price_rows
  where nullif(trim(coalesce(decoration_option_key, '')), '') is not null
  group by batch_id, supplier_sku, decoration_option_key, min_qty, max_qty
  having count(*) > 1
),
invalid_decoration_price_rows as (
  select batch_id, supplier_sku, decoration_method, decoration_area, artwork_size_label, min_qty, max_qty, unit_cost, price_status
  from decoration_price_rows
  where (min_qty is not null and min_qty <= 0)
     or (max_qty is not null and max_qty <= 0)
     or (unit_cost is not null and unit_cost < 0)
     or (min_qty is not null and max_qty is not null and max_qty < min_qty)
     or (price_status = 'priced' and unit_cost is null)
),
request_quote_rows_with_unit_cost as (
  select
    batch_id,
    supplier_sku,
    decoration_option_key,
    decoration_method,
    decoration_area,
    artwork_size_label,
    min_qty,
    unit_cost,
    price_status,
    'supplier_decoration_price_rows' as source_table
  from decoration_price_rows
  where price_status = 'request_quote'
    and unit_cost is not null

  union all

  select
    batch_id,
    null::text as supplier_sku,
    rate_card_key as decoration_option_key,
    decoration_method,
    applies_to as decoration_area,
    artwork_size_label,
    min_qty,
    unit_cost,
    price_status,
    'supplier_decoration_rate_card_rows' as source_table
  from decoration_rate_card_rows
  where price_status = 'request_quote'
    and unit_cost is not null
),
poa_status_leftovers as (
  select
    batch_id,
    supplier_sku,
    decoration_option_key,
    decoration_method,
    decoration_area,
    artwork_size_label,
    null::int as min_qty,
    price_status,
    'supplier_decoration_options' as source_table
  from decoration_rows
  where price_status = 'poa'

  union all

  select
    batch_id,
    supplier_sku,
    decoration_option_key,
    decoration_method,
    decoration_area,
    artwork_size_label,
    min_qty,
    price_status,
    'supplier_decoration_price_rows' as source_table
  from decoration_price_rows
  where price_status = 'poa'

  union all

  select
    batch_id,
    null::text as supplier_sku,
    rate_card_key as decoration_option_key,
    decoration_method,
    applies_to as decoration_area,
    artwork_size_label,
    min_qty,
    price_status,
    'supplier_decoration_rate_card_rows' as source_table
  from decoration_rate_card_rows
  where price_status = 'poa'
),
decoration_quote_required as (
  select batch_id, supplier_sku, decoration_method, decoration_area, artwork_size_label, price_status
  from decoration_rows
  where price_status = 'request_quote'

  union all

  select batch_id, supplier_sku, decoration_method, decoration_area, artwork_size_label, price_status
  from decoration_price_rows
  where price_status = 'request_quote'
),
rate_cards_without_rows as (
  select c.batch_id, c.rate_card_key, c.decoration_method, c.applies_to
  from decoration_rate_cards c
  left join decoration_rate_card_rows r
    on r.batch_id = c.batch_id
   and r.rate_card_key = c.rate_card_key
  where r.id is null
),
default_rate_cards_missing_scope as (
  select batch_id, rate_card_key, decoration_method, applies_to, applies_to_category, applies_to_subcategory, fallback_policy
  from decoration_rate_cards
  where is_default_for_scope = true
    and nullif(trim(coalesce(applies_to, '')), '') is null
    and nullif(trim(coalesce(applies_to_category, '')), '') is null
    and nullif(trim(coalesce(applies_to_subcategory, '')), '') is null
),
supplier_embroidery_formula_missing_fields as (
  select
    batch_id,
    rate_card_key,
    decoration_method,
    frontend_pricing_model,
    supplier_formula_base_stitches,
    supplier_formula_stitch_increment,
    supplier_formula_increment_unit_cost
  from decoration_rate_cards
  where frontend_pricing_model = 'supplier_embroidery_formula'
    and (
      coalesce(supplier_formula_base_stitches, 0) <= 0
      or coalesce(supplier_formula_stitch_increment, 0) <= 0
      or supplier_formula_increment_unit_cost is null
      or supplier_formula_increment_unit_cost < 0
    )
),
invalid_rate_card_rows as (
  select batch_id, rate_card_key, decoration_method, artwork_size_label, stitch_count_min, stitch_count_max, min_qty, max_qty, unit_cost, price_status
  from decoration_rate_card_rows
  where (min_qty is not null and min_qty <= 0)
     or (max_qty is not null and max_qty <= 0)
     or (stitch_count_min is not null and stitch_count_min < 0)
     or (stitch_count_max is not null and stitch_count_max < 0)
     or (unit_cost is not null and unit_cost < 0)
     or (min_qty is not null and max_qty is not null and max_qty < min_qty)
     or (stitch_count_min is not null and stitch_count_max is not null and stitch_count_max < stitch_count_min)
     or (price_status = 'priced' and unit_cost is null)
),
rate_card_quote_required as (
  select batch_id, rate_card_key, decoration_method, artwork_size_label, stitch_count_min, stitch_count_max, min_qty, max_qty, price_status
  from decoration_rate_card_rows
  where price_status = 'request_quote'
),
gfl_missing_lead_time_default as (
  select distinct r.batch_id, r.supplier
  from raw_rows r
  where not exists (
    select 1
    from supplier_defaults d
    where d.supplier = r.supplier
      and (d.batch_id = r.batch_id or d.batch_id is null)
      and coalesce(d.applies_to_category, '') = ''
      and coalesce(d.applies_to_subcategory, '') = ''
      and d.fulfillment = 'local_stock'
      and d.lead_time_min_days = 10
      and d.lead_time_max_days = 12
      and d.lead_time_unit = 'business_days'
      and d.lead_time_basis = 'decorated'
      and lower(coalesce(d.lead_time_note, '')) like '%after artwork approval%'
  )
),
gfl_non_local_stock_preview as (
  select p.batch_id, p.supplier_sku, p.raw_name, p.fulfillment, r.raw_fulfillment
  from preview_rows p
  left join raw_rows r
    on r.batch_id = p.batch_id
   and r.supplier_sku = p.supplier_sku
  where p.fulfillment <> 'local_stock'
    and lower(coalesce(r.raw_fulfillment, '')) not like '%indent%'
),
gfl_ready_preview_missing_lead_time as (
  select batch_id, supplier_sku, raw_name, lead_time_min_days, lead_time_max_days, lead_time_unit, lead_time_basis, lead_time_note
  from preview_rows
  where mapping_status = 'ready'
    and (
      lead_time_min_days is distinct from 10
      or lead_time_max_days is distinct from 12
      or lead_time_unit is distinct from 'business_days'
      or lead_time_basis is distinct from 'decorated'
      or lower(coalesce(lead_time_note, '')) not like '%after artwork approval%'
    )
),
known_manual_review as (
  select *
  from (
    values
      ('OVT', 'Vantage Top', 'Clothing / Fleece', 'Apparel', 'Sweatshirts', 'Top under Fleece; confirm as sweatshirt/fleece top.'),
      ('BHZQM', 'Barkers Corporate Highlander Merino - Mens', 'Clothing / Merino', 'Apparel', 'Sweatshirts', 'Merino top/pullover signal; confirm not polo/shirt.'),
      ('WEGMCD', 'Merino Cardigan - Womens', 'Clothing / Merino', 'Apparel', 'Sweatshirts', 'Merino cardigan; confirm sweatshirt/knitwear handling.'),
      ('BT', 'Ballistic Top', 'Clothing / Pullovers', 'Apparel', 'Sweatshirts', 'Top under Pullovers; confirm as sweatshirt/pullover.'),
      ('OTNT', 'Transition Top', 'Clothing / Pullovers', 'Apparel', 'Sweatshirts', 'Top under Pullovers; confirm as sweatshirt/pullover.'),
      ('TNT', 'Transition Top', 'Clothing / Pullovers', 'Apparel', 'Sweatshirts', 'Top under Pullovers; confirm as sweatshirt/pullover.'),
      ('PODCS', 'Decadent Cocktail 10 pcs Set', 'Home & Living / Miscellaneous Homeware', 'Barware & Accessories', 'Bar Accessories', 'Cocktail set; confirm barware vs home/kitchen.'),
      ('PONS', 'Nature Secateurs', 'Leisure & Outdoors', 'Tools & Auto', 'Tool Sets & Screwdrivers', 'Secateurs/tool item; confirm target.'),
      ('POPIB', 'Polar Ice 7.2L Bucket', 'Leisure & Outdoors / Coolers', 'Barware & Accessories', 'Bar Accessories', 'Ice bucket; confirm barware vs cooler/outdoor.')
  ) as t(supplier_sku, product_name, raw_category_path, suggested_category, suggested_subcategory, suggestion_note)
),
known_manual_present as (
  select k.*
  from known_manual_review k
  join raw_rows r on r.supplier_sku = k.supplier_sku
),
summary as (
  select
    count(*) as raw_rows,
    count(distinct supplier_sku) filter (where nullif(trim(coalesce(supplier_sku, '')), '') is not null) as unique_skus,
    count(distinct raw_category_path) filter (where nullif(trim(coalesce(raw_category_path, '')), '') is not null) as raw_category_paths
  from raw_rows
)
select
  'gear_for_life_loaded_summary' as check_name,
  'ok' as health_status,
  raw_rows::int as issue_count,
  jsonb_build_object(
    'raw_rows', raw_rows,
    'unique_skus', unique_skus,
    'raw_category_paths', raw_category_paths
  ) as details
from summary

union all

select
  'missing_supplier_sku' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(missing_sku) order by source_row_number) filter (where source_row_number is not null), '[]'::jsonb) as details
from missing_sku

union all

select
  'missing_product_name' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(missing_name) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from missing_name

union all

select
  'sku_name_conflicts' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(sku_name_conflicts) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from sku_name_conflicts

union all

select
  'blank_category_path' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(blank_category_path) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from blank_category_path

union all

select
  'skus_without_price_rows' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(skus_without_price) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from skus_without_price

union all

select
  'invalid_price_rows' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(invalid_price_rows) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from invalid_price_rows

union all

select
  'images_without_colour_link' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(images_without_colour_link) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from images_without_colour_link

union all

select
  'image_colour_mismatches' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(image_colour_mismatches) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from image_colour_mismatches

union all

select
  'gallery_fallback_image_candidates' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(gallery_fallback_image_candidates) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from gallery_fallback_image_candidates

union all

select
  'decoration_options_missing_key' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_options_missing_key) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from decoration_options_missing_key

union all

select
  'decoration_option_key_duplicates' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_option_key_duplicates) order by supplier_sku, decoration_option_key) filter (where supplier_sku is not null), '[]'::jsonb) as details
from decoration_option_key_duplicates

union all

select
  'branding_price_rows_without_product_sku' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(branding_price_rows_without_product_sku) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from branding_price_rows_without_product_sku

union all

select
  'decoration_options_without_price_rows' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_options_without_price_rows) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from decoration_options_without_price_rows

union all

select
  'decoration_price_rows_missing_option_key' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_price_rows_missing_option_key) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from decoration_price_rows_missing_option_key

union all

select
  'decoration_price_rows_without_matching_option_key' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_price_rows_without_matching_option_key) order by supplier_sku, decoration_option_key) filter (where supplier_sku is not null), '[]'::jsonb) as details
from decoration_price_rows_without_matching_option_key

union all

select
  'decoration_price_tier_duplicates' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_price_tier_duplicates) order by supplier_sku, decoration_option_key, min_qty) filter (where supplier_sku is not null), '[]'::jsonb) as details
from decoration_price_tier_duplicates

union all

select
  'invalid_decoration_price_rows' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(invalid_decoration_price_rows) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from invalid_decoration_price_rows

union all

select
  'request_quote_rows_with_unit_cost' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(request_quote_rows_with_unit_cost) order by supplier_sku, decoration_option_key, min_qty) filter (where decoration_option_key is not null), '[]'::jsonb) as details
from request_quote_rows_with_unit_cost

union all

select
  'poa_status_leftovers' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(poa_status_leftovers) order by supplier_sku, decoration_option_key, min_qty) filter (where decoration_option_key is not null), '[]'::jsonb) as details
from poa_status_leftovers

union all

select
  'decoration_quote_required' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_quote_required) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from decoration_quote_required

union all

select
  'decoration_rate_cards_without_rows' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(rate_cards_without_rows) order by rate_card_key) filter (where rate_card_key is not null), '[]'::jsonb) as details
from rate_cards_without_rows

union all

select
  'default_rate_cards_missing_scope' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(default_rate_cards_missing_scope) order by rate_card_key) filter (where rate_card_key is not null), '[]'::jsonb) as details
from default_rate_cards_missing_scope

union all

select
  'supplier_embroidery_formula_missing_fields' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(supplier_embroidery_formula_missing_fields) order by rate_card_key) filter (where rate_card_key is not null), '[]'::jsonb) as details
from supplier_embroidery_formula_missing_fields

union all

select
  'invalid_decoration_rate_card_rows' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(invalid_rate_card_rows) order by rate_card_key) filter (where rate_card_key is not null), '[]'::jsonb) as details
from invalid_rate_card_rows

union all

select
  'decoration_rate_card_quote_required' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(rate_card_quote_required) order by rate_card_key) filter (where rate_card_key is not null), '[]'::jsonb) as details
from rate_card_quote_required

union all

select
  'gfl_missing_lead_time_default' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(gfl_missing_lead_time_default) order by batch_id) filter (where supplier is not null), '[]'::jsonb) as details
from gfl_missing_lead_time_default

union all

select
  'gfl_non_local_stock_preview' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(gfl_non_local_stock_preview) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from gfl_non_local_stock_preview

union all

select
  'gfl_ready_preview_missing_lead_time' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(gfl_ready_preview_missing_lead_time) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from gfl_ready_preview_missing_lead_time

union all

select
  'known_manual_review_present' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(known_manual_present) order by supplier_sku) filter (where supplier_sku is not null), '[]'::jsonb) as details
from known_manual_present;
