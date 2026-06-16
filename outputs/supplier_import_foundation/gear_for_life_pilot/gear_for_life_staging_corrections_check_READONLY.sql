-- Gear For Life staging corrections check.
-- READ ONLY. Run after gear_for_life_staging_corrections_DRAFT.sql succeeds.
-- Coverage rows are per source product row, not distinct SKU.

with params as (
  select
    'Gear For Life'::text as target_supplier,
    'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'::text as target_source_file_hash,
    array['IGOISB', 'IGSCFAK', 'PODCB', 'POEB', 'POEGB', 'POGB', 'POOMTT', 'POOPB', 'POPIB', 'PORC', 'POSWTS', 'POVCB', 'POWBC']::text[] as affected_skus
),
gfl_batch as (
  select b.id as batch_id
  from public.supplier_import_batches b
  join params p on p.target_supplier = b.supplier
  where b.source_file_hash = (select target_source_file_hash from params)
  order by b.created_at desc
  limit 1
),
raw_rows as (
  select r.*
  from public.supplier_raw_product_rows r
  join gfl_batch b on b.batch_id = r.batch_id
),
raw_colours as (
  select c.*
  from public.supplier_raw_colour_options c
  join gfl_batch b on b.batch_id = c.batch_id
),
raw_images as (
  select i.*
  from public.supplier_raw_images i
  join gfl_batch b on b.batch_id = i.batch_id
),
product_price_rows as (
  select p.*
  from public.supplier_price_rows p
  join gfl_batch b on b.batch_id = p.batch_id
),
decoration_options as (
  select d.*
  from public.supplier_decoration_options d
  join gfl_batch b on b.batch_id = d.batch_id
),
decoration_price_rows as (
  select p.*
  from public.supplier_decoration_price_rows p
  join gfl_batch b on b.batch_id = p.batch_id
),
rate_cards as (
  select c.*
  from public.supplier_decoration_rate_cards c
  join gfl_batch b on b.batch_id = c.batch_id
),
rate_card_rows as (
  select r.*
  from public.supplier_decoration_rate_card_rows r
  join gfl_batch b on b.batch_id = r.batch_id
),
affected_options as (
  select d.*
  from decoration_options d
  join params p on d.supplier_sku = any(p.affected_skus)
),
affected_price_rows as (
  select r.*
  from decoration_price_rows r
  join params p on r.supplier_sku = any(p.affected_skus)
),
product_specific_skus as (
  select distinct supplier_sku
  from decoration_options
  where nullif(trim(coalesce(supplier_sku, '')), '') is not null
),
coverage as (
  select
    r.batch_id,
    r.source_row_number,
    r.supplier_sku,
    r.raw_name,
    r.raw_category_1,
    r.raw_category_path,
    case
      when ps.supplier_sku is not null then 'coverage_product_specific'
      when lower(trim(coalesce(r.raw_category_1, ''))) = 'bags' then 'coverage_transfer_printing_bags_fallback'
      when lower(trim(coalesce(r.raw_category_1, ''))) = 'clothing' then 'coverage_embroidery_apparel_scope'
      else 'coverage_request_quote_fallback'
    end as coverage_bucket
  from raw_rows r
  left join product_specific_skus ps
    on ps.supplier_sku = r.supplier_sku
),
correction_price_rows_without_option as (
  select p.*
  from affected_price_rows p
  left join decoration_options d
    on d.id = p.supplier_decoration_option_id
  where d.id is null
),
duplicate_option_keys as (
  select supplier_sku, decoration_option_key, count(*) as row_count
  from affected_options
  group by supplier_sku, decoration_option_key
  having count(*) > 1
),
checks as (
  select 'batch' as check_name, (select count(*) from gfl_batch)::int as actual_value, 1::int as expected_value, '{}'::jsonb as details
  union all select 'raw_products', (select count(*) from raw_rows)::int, 472, '{}'::jsonb
  union all select 'colours', (select count(*) from raw_colours)::int, 892, '{}'::jsonb
  union all select 'images', (select count(*) from raw_images)::int, 2416, '{}'::jsonb
  union all select 'product_price_rows', (select count(*) from product_price_rows)::int, 773, '{}'::jsonb
  union all select 'decoration_options_total', (select count(*) from decoration_options)::int, 277, '{}'::jsonb
  union all select 'decoration_price_rows_total', (select count(*) from decoration_price_rows)::int, 1118, '{}'::jsonb
  union all select 'rate_cards', (select count(*) from rate_cards)::int, 2, '{}'::jsonb
  union all select 'rate_card_rows', (select count(*) from rate_card_rows)::int, 160, '{}'::jsonb
  union all select 'corrected_skus', (select count(distinct supplier_sku) from affected_options)::int, 13, '{}'::jsonb
  union all select 'corrected_decoration_options', (select count(*) from affected_options)::int, 49, '{}'::jsonb
  union all select 'corrected_decoration_price_rows', (select count(*) from affected_price_rows)::int, 214, '{}'::jsonb
  union all select 'corrected_request_quote_price_rows', (select count(*) from affected_price_rows where price_status = 'request_quote')::int, 25, '{}'::jsonb
  union all select 'corrected_priced_price_rows', (select count(*) from affected_price_rows where price_status = 'priced')::int, 189, '{}'::jsonb
  union all select 'request_quote_rows_with_unit_cost', (select count(*) from affected_price_rows where price_status = 'request_quote' and unit_cost is not null)::int, 0, '{}'::jsonb
  union all select 'priced_rows_missing_unit_cost', (select count(*) from affected_price_rows where price_status = 'priced' and unit_cost is null)::int, 0, '{}'::jsonb
  union all select 'raw_poa_rows_with_non_null_unit_cost', (select count(*) from affected_price_rows where raw_json ->> 'raw_price' = 'POA' and unit_cost is not null)::int, 0, '{}'::jsonb
  union all select 'corrected_price_rows_without_option', (select count(*) from correction_price_rows_without_option)::int, 0, '{}'::jsonb
  union all select 'corrected_duplicate_option_keys', (select count(*) from duplicate_option_keys)::int, 0, coalesce((select jsonb_agg(to_jsonb(duplicate_option_keys)) from duplicate_option_keys), '[]'::jsonb)
  union all select 'corrected_options_with_packing_note', (select count(*) from affected_options where nullif(trim(coalesce(raw_json ->> 'packing_fee_note', '')), '') is not null)::int, 14, '{}'::jsonb
  union all select 'corrected_options_with_setup_cost', (select count(*) from affected_options where setup_cost is not null)::int, 48, '{}'::jsonb
  union all select 'corrected_options_ex_gst', (select count(*) from affected_options where raw_json ->> 'gst_note' = 'ex_gst')::int, 49, '{}'::jsonb
  union all select 'corrected_options_branding_only', (select count(*) from affected_options where raw_json ->> 'cost_scope' = 'branding_only')::int, 49, '{}'::jsonb
  union all select 'coverage_product_specific', (select count(*) from coverage where coverage_bucket = 'coverage_product_specific')::int, 75, '{}'::jsonb
  union all select 'coverage_transfer_printing_bags_fallback', (select count(*) from coverage where coverage_bucket = 'coverage_transfer_printing_bags_fallback')::int, 63, '{}'::jsonb
  union all select 'coverage_embroidery_apparel_scope', (select count(*) from coverage where coverage_bucket = 'coverage_embroidery_apparel_scope')::int, 290, '{}'::jsonb
  union all select 'coverage_request_quote_fallback', (select count(*) from coverage where coverage_bucket = 'coverage_request_quote_fallback')::int, 44, '{}'::jsonb
  union all select 'coverage_sum_equals_raw_products', (select count(*) from coverage)::int, 472, '{}'::jsonb
  union all select 'coverage_orphan', (select count(*) from coverage where coverage_bucket is null)::int, 0, '{}'::jsonb
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by check_name;
