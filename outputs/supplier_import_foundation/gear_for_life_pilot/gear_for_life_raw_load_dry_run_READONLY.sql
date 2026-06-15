-- Gear For Life RAW LOAD dry-run gate.
-- READ ONLY. This file does not insert, update, delete, truncate, create or drop anything.
-- Run after `supplier_staging_schema_DRAFT.sql` has been applied.
-- If staging tables may not exist yet, run `gear_for_life_schema_gate_READONLY.sql` first.
-- Purpose: check whether the staging area is safe for a true Gear For Life raw load.

begin read only;
set local statement_timeout = '60s';

with params as (
  select 'Gear For Life'::text as target_supplier
),
expected_payload as (
  select *
  from (
    values
      ('source_inventory_raw_rows', 472, 'Known Gear For Life source rows from supplier inventory audit.'),
      ('source_inventory_unique_skus', 470, 'Known Gear For Life unique SKUs from supplier inventory audit.'),
      ('source_inventory_raw_category_paths', 50, 'Known Gear For Life raw category paths from supplier inventory audit.'),
      ('branding_product_specific_skus', 75, 'SKUs found in The Source Branding Price List workbook.'),
      ('branding_decoration_options', 273, 'Rows expected for supplier_decoration_options from workbook preview.'),
      ('branding_decoration_price_rows', 1069, 'Rows expected for supplier_decoration_price_rows from workbook preview.'),
      ('branding_general_rate_cards', 2, 'Transfer Printing + Embroidery supplier-level rate cards.'),
      ('branding_general_rate_card_rows', 160, 'Rows expected for supplier_decoration_rate_card_rows from workbook preview.'),
      ('gfl_fulfillment_default', 1, 'Gear For Life default fulfillment is local_stock unless source says indent.'),
      ('gfl_lead_time_default', 1, 'Gear For Life decorated lead time is 10-12 business_days after artwork approval.')
  ) as t(item, expected_count, note)
),
expected_tables as (
  select *
  from (
    values
      ('supplier_import_batches'),
      ('supplier_commercial_defaults'),
      ('supplier_raw_product_rows'),
      ('supplier_raw_colour_options'),
      ('supplier_raw_images'),
      ('supplier_price_rows'),
      ('supplier_decoration_options'),
      ('supplier_decoration_price_rows'),
      ('supplier_decoration_rate_cards'),
      ('supplier_decoration_rate_card_rows'),
      ('supplier_transform_preview'),
      ('product_images')
  ) as t(table_name)
),
actual_tables as (
  select table_name
  from information_schema.tables
  where table_schema = 'public'
),
missing_tables as (
  select e.table_name
  from expected_tables e
  left join actual_tables a on a.table_name = e.table_name
  where a.table_name is null
),
expected_columns as (
  select *
  from (
    values
      ('supplier_import_batches','supplier'),
      ('supplier_import_batches','source_file_name'),
      ('supplier_import_batches','source_file_hash'),
      ('supplier_import_batches','import_status'),
      ('supplier_import_batches','source_row_count'),
      ('supplier_import_batches','unique_sku_count'),
      ('supplier_commercial_defaults','supplier'),
      ('supplier_commercial_defaults','fulfillment'),
      ('supplier_commercial_defaults','lead_time_min_days'),
      ('supplier_commercial_defaults','lead_time_max_days'),
      ('supplier_commercial_defaults','lead_time_unit'),
      ('supplier_commercial_defaults','lead_time_basis'),
      ('supplier_commercial_defaults','lead_time_note'),
      ('supplier_raw_product_rows','batch_id'),
      ('supplier_raw_product_rows','supplier'),
      ('supplier_raw_product_rows','source_row_number'),
      ('supplier_raw_product_rows','supplier_sku'),
      ('supplier_raw_product_rows','raw_name'),
      ('supplier_raw_product_rows','raw_brand'),
      ('supplier_raw_product_rows','raw_category_path'),
      ('supplier_raw_product_rows','raw_moq'),
      ('supplier_raw_product_rows','raw_lead_time'),
      ('supplier_raw_product_rows','lead_time_min_days'),
      ('supplier_raw_product_rows','lead_time_max_days'),
      ('supplier_raw_product_rows','lead_time_unit'),
      ('supplier_raw_product_rows','lead_time_basis'),
      ('supplier_raw_product_rows','lead_time_note'),
      ('supplier_raw_product_rows','raw_fulfillment'),
      ('supplier_raw_product_rows','raw_json'),
      ('supplier_raw_colour_options','supplier'),
      ('supplier_raw_colour_options','supplier_sku'),
      ('supplier_raw_colour_options','colour_key'),
      ('supplier_raw_colour_options','colour_name'),
      ('supplier_raw_images','supplier'),
      ('supplier_raw_images','supplier_sku'),
      ('supplier_raw_images','image_url'),
      ('supplier_raw_images','image_role'),
      ('supplier_raw_images','colour_key'),
      ('supplier_raw_images','colour_name'),
      ('supplier_price_rows','supplier'),
      ('supplier_price_rows','supplier_sku'),
      ('supplier_price_rows','min_qty'),
      ('supplier_price_rows','max_qty'),
      ('supplier_price_rows','unit_cost'),
      ('supplier_decoration_options','supplier'),
      ('supplier_decoration_options','supplier_sku'),
      ('supplier_decoration_options','decoration_option_key'),
      ('supplier_decoration_options','decoration_method'),
      ('supplier_decoration_options','decoration_area'),
      ('supplier_decoration_options','decoration_location'),
      ('supplier_decoration_options','artwork_size_label'),
      ('supplier_decoration_options','price_status'),
      ('supplier_decoration_options','setup_cost'),
      ('supplier_decoration_options','repeat_setup_cost'),
      ('supplier_decoration_price_rows','supplier'),
      ('supplier_decoration_price_rows','supplier_sku'),
      ('supplier_decoration_price_rows','decoration_option_key'),
      ('supplier_decoration_price_rows','decoration_method'),
      ('supplier_decoration_price_rows','decoration_area'),
      ('supplier_decoration_price_rows','artwork_size_label'),
      ('supplier_decoration_price_rows','min_qty'),
      ('supplier_decoration_price_rows','unit_cost'),
      ('supplier_decoration_price_rows','price_status'),
      ('supplier_decoration_rate_cards','supplier'),
      ('supplier_decoration_rate_cards','rate_card_key'),
      ('supplier_decoration_rate_cards','decoration_method'),
      ('supplier_decoration_rate_cards','is_default_for_scope'),
      ('supplier_decoration_rate_cards','fallback_policy'),
      ('supplier_decoration_rate_cards','frontend_pricing_model'),
      ('supplier_decoration_rate_card_rows','supplier'),
      ('supplier_decoration_rate_card_rows','rate_card_key'),
      ('supplier_decoration_rate_card_rows','decoration_method'),
      ('supplier_decoration_rate_card_rows','min_qty'),
      ('supplier_decoration_rate_card_rows','unit_cost'),
      ('supplier_decoration_rate_card_rows','price_status'),
      ('supplier_transform_preview','supplier'),
      ('supplier_transform_preview','supplier_sku'),
      ('supplier_transform_preview','page_role'),
      ('supplier_transform_preview','target_category'),
      ('supplier_transform_preview','target_subcategory'),
      ('supplier_transform_preview','mapping_status'),
      ('supplier_transform_preview','fulfillment'),
      ('supplier_transform_preview','lead_time_min_days'),
      ('supplier_transform_preview','lead_time_max_days'),
      ('supplier_transform_preview','lead_time_unit'),
      ('supplier_transform_preview','lead_time_basis'),
      ('supplier_transform_preview','lead_time_note')
  ) as t(table_name, column_name)
),
actual_columns as (
  select table_name, column_name
  from information_schema.columns
  where table_schema = 'public'
),
missing_columns as (
  select e.table_name, e.column_name
  from expected_columns e
  left join actual_columns a
    on a.table_name = e.table_name
   and a.column_name = e.column_name
  where a.column_name is null
),
staging_counts as (
  select 'supplier_import_batches' as table_name, count(*)::int as row_count
  from public.supplier_import_batches b
  join params p on p.target_supplier = b.supplier

  union all

  select 'supplier_commercial_defaults', count(*)::int
  from public.supplier_commercial_defaults d
  join params p on p.target_supplier = d.supplier

  union all

  select 'supplier_raw_product_rows', count(*)::int
  from public.supplier_raw_product_rows r
  join params p on p.target_supplier = r.supplier

  union all

  select 'supplier_raw_colour_options', count(*)::int
  from public.supplier_raw_colour_options c
  join params p on p.target_supplier = c.supplier

  union all

  select 'supplier_raw_images', count(*)::int
  from public.supplier_raw_images i
  join params p on p.target_supplier = i.supplier

  union all

  select 'supplier_price_rows', count(*)::int
  from public.supplier_price_rows pr
  join params p on p.target_supplier = pr.supplier

  union all

  select 'supplier_decoration_options', count(*)::int
  from public.supplier_decoration_options d
  join params p on p.target_supplier = d.supplier

  union all

  select 'supplier_decoration_price_rows', count(*)::int
  from public.supplier_decoration_price_rows d
  join params p on p.target_supplier = d.supplier

  union all

  select 'supplier_decoration_rate_cards', count(*)::int
  from public.supplier_decoration_rate_cards c
  join params p on p.target_supplier = c.supplier

  union all

  select 'supplier_decoration_rate_card_rows', count(*)::int
  from public.supplier_decoration_rate_card_rows r
  join params p on p.target_supplier = r.supplier

  union all

  select 'supplier_transform_preview', count(*)::int
  from public.supplier_transform_preview t
  join params p on p.target_supplier = t.supplier
),
existing_gfl_rows as (
  select coalesce(sum(row_count), 0)::int as row_count
  from staging_counts
),
batches as (
  select
    b.id,
    b.supplier,
    b.source_file_name,
    b.source_file_hash,
    b.import_status,
    b.source_row_count,
    b.unique_sku_count,
    b.created_at
  from public.supplier_import_batches b
  join params p on p.target_supplier = b.supplier
),
raw_rows as (
  select r.*
  from public.supplier_raw_product_rows r
  join params p on p.target_supplier = r.supplier
),
raw_missing_required as (
  select batch_id, source_row_number, supplier_sku, raw_name, 'missing_supplier_sku' as issue
  from raw_rows
  where nullif(trim(coalesce(supplier_sku, '')), '') is null

  union all

  select batch_id, source_row_number, supplier_sku, raw_name, 'missing_raw_name' as issue
  from raw_rows
  where nullif(trim(coalesce(raw_name, '')), '') is null
),
raw_sku_name_conflicts as (
  select
    batch_id,
    supplier_sku,
    count(*) as row_count,
    count(distinct lower(trim(raw_name))) as distinct_name_count,
    jsonb_agg(distinct raw_name) filter (where raw_name is not null) as names
  from raw_rows
  where nullif(trim(coalesce(supplier_sku, '')), '') is not null
  group by batch_id, supplier_sku
  having count(distinct lower(trim(raw_name))) > 1
),
raw_missing_lead_time as (
  select batch_id, supplier_sku, raw_name, lead_time_min_days, lead_time_max_days, lead_time_unit, lead_time_basis, lead_time_note
  from raw_rows
  where lead_time_min_days is distinct from 10
     or lead_time_max_days is distinct from 12
     or lead_time_unit is distinct from 'business_days'
     or lead_time_basis is distinct from 'decorated'
     or lower(coalesce(lead_time_note, '')) not like '%after artwork approval%'
),
valid_gfl_default as (
  select d.*
  from public.supplier_commercial_defaults d
  join params p on p.target_supplier = d.supplier
  where d.fulfillment = 'local_stock'
    and d.lead_time_min_days = 10
    and d.lead_time_max_days = 12
    and d.lead_time_unit = 'business_days'
    and d.lead_time_basis = 'decorated'
    and lower(coalesce(d.lead_time_note, '')) like '%after artwork approval%'
),
decoration_options as (
  select d.*
  from public.supplier_decoration_options d
  join params p on p.target_supplier = d.supplier
),
decoration_price_rows as (
  select d.*
  from public.supplier_decoration_price_rows d
  join params p on p.target_supplier = d.supplier
),
decoration_option_key_duplicates as (
  select batch_id, supplier_sku, decoration_option_key, count(*) as option_count
  from decoration_options
  where nullif(trim(coalesce(decoration_option_key, '')), '') is not null
  group by batch_id, supplier_sku, decoration_option_key
  having count(*) > 1
),
decoration_options_missing_key as (
  select batch_id, supplier_sku, decoration_method, decoration_area, artwork_size_label, price_status
  from decoration_options
  where nullif(trim(coalesce(decoration_option_key, '')), '') is null
    and price_status not in ('included','unavailable')
),
decoration_price_rows_missing_key as (
  select batch_id, supplier_sku, decoration_method, decoration_area, artwork_size_label, min_qty, price_status
  from decoration_price_rows
  where nullif(trim(coalesce(decoration_option_key, '')), '') is null
    and price_status not in ('included','unavailable')
),
decoration_price_rows_without_option as (
  select p.batch_id, p.supplier_sku, p.decoration_option_key, p.decoration_method, p.decoration_area, p.artwork_size_label, p.min_qty, p.price_status
  from decoration_price_rows p
  left join decoration_options d
    on d.batch_id = p.batch_id
   and d.supplier_sku = p.supplier_sku
   and d.decoration_option_key = p.decoration_option_key
  where nullif(trim(coalesce(p.decoration_option_key, '')), '') is not null
    and d.id is null
),
request_quote_rows_with_unit_cost as (
  select 'supplier_decoration_price_rows' as source_table, batch_id, supplier_sku, decoration_option_key, decoration_method, min_qty, unit_cost, price_status
  from decoration_price_rows
  where price_status = 'request_quote'
    and unit_cost is not null

  union all

  select 'supplier_decoration_rate_card_rows' as source_table, batch_id, null::text as supplier_sku, rate_card_key as decoration_option_key, decoration_method, min_qty, unit_cost, price_status
  from public.supplier_decoration_rate_card_rows r
  join params p on p.target_supplier = r.supplier
  where price_status = 'request_quote'
    and unit_cost is not null
),
poa_status_leftovers as (
  select 'supplier_decoration_options' as source_table, batch_id, supplier_sku, decoration_option_key, decoration_method, null::int as min_qty, price_status
  from decoration_options
  where price_status = 'poa'

  union all

  select 'supplier_decoration_price_rows' as source_table, batch_id, supplier_sku, decoration_option_key, decoration_method, min_qty, price_status
  from decoration_price_rows
  where price_status = 'poa'

  union all

  select 'supplier_decoration_rate_card_rows' as source_table, batch_id, null::text as supplier_sku, rate_card_key as decoration_option_key, decoration_method, min_qty, price_status
  from public.supplier_decoration_rate_card_rows r
  join params p on p.target_supplier = r.supplier
  where price_status = 'poa'
),
branding_rows_without_product_sku as (
  select p.batch_id, p.supplier_sku, p.decoration_option_key, p.decoration_method, p.decoration_area
  from decoration_price_rows p
  left join raw_rows r
    on r.batch_id = p.batch_id
   and r.supplier_sku = p.supplier_sku
  where r.id is null
),
preview_rows as (
  select t.*
  from public.supplier_transform_preview t
  join params p on p.target_supplier = t.supplier
),
preview_non_local_stock as (
  select supplier_sku, raw_name, fulfillment
  from preview_rows
  where fulfillment <> 'local_stock'
),
preview_missing_lead_time as (
  select supplier_sku, raw_name, lead_time_min_days, lead_time_max_days, lead_time_unit, lead_time_basis, lead_time_note
  from preview_rows
  where lead_time_min_days is distinct from 10
     or lead_time_max_days is distinct from 12
     or lead_time_unit is distinct from 'business_days'
     or lead_time_basis is distinct from 'decorated'
     or lower(coalesce(lead_time_note, '')) not like '%after artwork approval%'
),
preview_ready_with_f_page_role as (
  select supplier_sku, raw_name, page_role, target_category, target_subcategory
  from preview_rows
  where mapping_status = 'ready'
    and page_role = 'F'
),
summary_counts as (
  select
    (select count(*) from missing_tables) as missing_table_count,
    (select count(*) from missing_columns) as missing_column_count,
    (select row_count from existing_gfl_rows) as existing_gfl_row_count,
    (select count(*) from raw_missing_required) as raw_missing_required_count,
    (select count(*) from raw_sku_name_conflicts) as raw_sku_name_conflict_count,
    (select count(*) from raw_missing_lead_time) as raw_missing_lead_time_count,
    (select count(*) from valid_gfl_default) as valid_gfl_default_count,
    (select count(*) from decoration_options_missing_key) as decoration_options_missing_key_count,
    (select count(*) from decoration_option_key_duplicates) as decoration_option_key_duplicate_count,
    (select count(*) from decoration_price_rows_missing_key) as decoration_price_rows_missing_key_count,
    (select count(*) from decoration_price_rows_without_option) as decoration_price_rows_without_option_count,
    (select count(*) from request_quote_rows_with_unit_cost) as request_quote_with_unit_cost_count,
    (select count(*) from poa_status_leftovers) as poa_status_leftover_count,
    (select count(*) from branding_rows_without_product_sku) as branding_rows_without_product_sku_count,
    (select count(*) from preview_non_local_stock) as preview_non_local_stock_count,
    (select count(*) from preview_missing_lead_time) as preview_missing_lead_time_count,
    (select count(*) from preview_ready_with_f_page_role) as preview_ready_with_f_page_role_count
)
select
  'expected_payload_reference' as check_name,
  'info' as health_status,
  count(*)::int as issue_count,
  jsonb_agg(to_jsonb(expected_payload) order by item) as details
from expected_payload

union all

select
  'schema_missing_tables' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(missing_tables) order by table_name), '[]'::jsonb) as details
from missing_tables

union all

select
  'schema_missing_columns' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(missing_columns) order by table_name, column_name), '[]'::jsonb) as details
from missing_columns

union all

select
  'current_gfl_staging_counts' as check_name,
  case when coalesce(sum(row_count), 0) = 0 then 'ok' else 'warning' end as health_status,
  coalesce(sum(row_count), 0)::int as issue_count,
  jsonb_agg(to_jsonb(staging_counts) order by table_name) as details
from staging_counts

union all

select
  'current_gfl_batches' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(batches) order by created_at desc), '[]'::jsonb) as details
from batches

union all

select
  'gfl_commercial_default_ready' as check_name,
  case when count(*) > 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(valid_gfl_default)), '[]'::jsonb) as details
from valid_gfl_default

union all

select
  'raw_rows_missing_required_fields' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(raw_missing_required) order by source_row_number) filter (where issue is not null), '[]'::jsonb) as details
from raw_missing_required

union all

select
  'raw_sku_name_conflicts' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(raw_sku_name_conflicts) order by supplier_sku), '[]'::jsonb) as details
from raw_sku_name_conflicts

union all

select
  'raw_rows_missing_gfl_lead_time_fields' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(raw_missing_lead_time) order by supplier_sku), '[]'::jsonb) as details
from raw_missing_lead_time

union all

select
  'decoration_options_missing_key' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_options_missing_key) order by supplier_sku), '[]'::jsonb) as details
from decoration_options_missing_key

union all

select
  'decoration_option_key_duplicates' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_option_key_duplicates) order by supplier_sku, decoration_option_key), '[]'::jsonb) as details
from decoration_option_key_duplicates

union all

select
  'decoration_price_rows_missing_key' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_price_rows_missing_key) order by supplier_sku, min_qty), '[]'::jsonb) as details
from decoration_price_rows_missing_key

union all

select
  'decoration_price_rows_without_option' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(decoration_price_rows_without_option) order by supplier_sku, decoration_option_key, min_qty), '[]'::jsonb) as details
from decoration_price_rows_without_option

union all

select
  'request_quote_rows_with_unit_cost' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(request_quote_rows_with_unit_cost) order by source_table, supplier_sku, decoration_option_key, min_qty), '[]'::jsonb) as details
from request_quote_rows_with_unit_cost

union all

select
  'poa_status_leftovers' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(poa_status_leftovers) order by source_table, supplier_sku, decoration_option_key, min_qty), '[]'::jsonb) as details
from poa_status_leftovers

union all

select
  'branding_rows_without_product_sku' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(branding_rows_without_product_sku) order by supplier_sku, decoration_option_key), '[]'::jsonb) as details
from branding_rows_without_product_sku

union all

select
  'preview_non_local_stock' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(preview_non_local_stock) order by supplier_sku), '[]'::jsonb) as details
from preview_non_local_stock

union all

select
  'preview_missing_gfl_lead_time_fields' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(preview_missing_lead_time) order by supplier_sku), '[]'::jsonb) as details
from preview_missing_lead_time

union all

select
  'preview_ready_with_f_page_role' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(to_jsonb(preview_ready_with_f_page_role) order by supplier_sku), '[]'::jsonb) as details
from preview_ready_with_f_page_role

union all

select
  'raw_load_next_step_gate' as check_name,
  case
    when missing_table_count > 0 or missing_column_count > 0 then 'issue'
    when existing_gfl_row_count > 0 then 'warning'
    else 'ok'
  end as health_status,
  case
    when missing_table_count > 0 then missing_table_count
    when missing_column_count > 0 then missing_column_count
    else existing_gfl_row_count
  end::int as issue_count,
  jsonb_build_object(
    'meaning', 'ok means staging schema is ready and no existing GFL staging rows were found; warning means review existing GFL staging data before true load',
    'missing_table_count', missing_table_count,
    'missing_column_count', missing_column_count,
    'existing_gfl_row_count', existing_gfl_row_count,
    'valid_gfl_default_count', valid_gfl_default_count,
    'request_quote_with_unit_cost_count', request_quote_with_unit_cost_count,
    'poa_status_leftover_count', poa_status_leftover_count,
    'decoration_option_key_duplicate_count', decoration_option_key_duplicate_count
  ) as details
from summary_counts;

rollback;
