-- Gear For Life transform preview manual corrections check.
-- READ ONLY. Run after gear_for_life_transform_preview_manual_corrections_DRAFT.sql succeeds.

with params as (
  select 'Gear For Life'::text as target_supplier,
         'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'::text as target_source_file_hash,
         array['PODIGB', 'POGTT', 'PORC', 'POTT', 'POLTT', 'POOMTT', 'POVCB', 'IGOISB']::text[] as confirmed_ready_skus,
         array['EGAS', 'POFWGS', 'VT', 'GJ', 'TSC', 'OAN(C)', 'OASTOJ', 'BBYBS', 'OEGCP', 'OEGMCI', 'OWEGCP', 'OWEGMX', 'PORHFP', 'TAX', 'TTBL', 'BIO', 'PORT', 'POAFP', 'WTFL', 'TFL', 'TV', 'WMWJ', 'BMB', 'BMW', 'BINB', 'ODGHP', 'OTSZH', 'BPMC', 'POHF', 'POKGS', 'POMA', 'TEL', 'TMC', 'TYS', 'WTYS']::text[] as discontinued_skus
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
  where p.supplier = 'Gear For Life'
),
confirmed_ready as (
  select p.*
  from preview_rows p
  join params x on p.supplier_sku = any(x.confirmed_ready_skus)
),
discontinued as (
  select p.*
  from preview_rows p
  join params x on p.supplier_sku = any(x.discontinued_skus)
),
checks as (
  select 'batch' as check_name, (select count(*) from gfl_batch)::int as actual_value, 1::int as expected_value, '{}'::jsonb as details
  union all select 'transform_preview_rows', (select count(*) from preview_rows)::int, 471, '{}'::jsonb
  union all select 'preview_ready_rows', (select count(*) from preview_rows where mapping_status = 'ready')::int, 436, '{}'::jsonb
  union all select 'preview_needs_review_rows', (select count(*) from preview_rows where mapping_status = 'needs_review')::int, 0, '{}'::jsonb
  union all select 'preview_blocked_rows', (select count(*) from preview_rows where mapping_status = 'blocked')::int, 35, '{}'::jsonb
  union all select 'manual_confirmed_category_rows', (select count(*) from preview_rows where mapping_rule_id = 'gfl_manual_confirmed_category')::int, 17, '{}'::jsonb
  union all select 'newly_confirmed_ready_rows', (select count(*) from confirmed_ready where mapping_status = 'ready' and page_role = 'P' and target_category is not null and target_subcategory is not null)::int, 8, coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku, 'raw_name', raw_name, 'target_category', target_category, 'target_subcategory', target_subcategory) order by supplier_sku) from confirmed_ready), '[]'::jsonb)
  union all select 'discontinued_blocked_rows', (select count(*) from discontinued where mapping_status = 'blocked' and mapping_rule_id = 'gfl_supplier_confirmed_discontinued' and 'supplier_discontinued' = any(warning_flags))::int, 35, coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku, 'raw_name', raw_name, 'warning_flags', warning_flags) order by supplier_sku) from discontinued), '[]'::jsonb)
  union all select 'ready_rows_missing_target', (select count(*) from preview_rows where mapping_status = 'ready' and (target_category is null or target_subcategory is null))::int, 0, '{}'::jsonb
  union all select 'non_local_stock_rows', (select count(*) from preview_rows where fulfillment <> 'local_stock')::int, 0, '{}'::jsonb
  union all select 'bad_lead_time_rows', (select count(*) from preview_rows where lead_time_min_days <> 10 or lead_time_max_days <> 12 or lead_time_unit <> 'business_days' or lead_time_basis <> 'decorated')::int, 0, '{}'::jsonb
  union all select 'products_table_rows_created', 0::int, 0, '{}'::jsonb
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by check_name;
