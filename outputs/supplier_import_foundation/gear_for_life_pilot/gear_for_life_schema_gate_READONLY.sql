-- Gear For Life schema gate.
-- READ ONLY. Safe to run before any supplier staging tables exist.
-- Purpose: confirm whether the supplier staging schema exists before running raw-load dry-run checks.

begin read only;
set local statement_timeout = '30s';

with expected_tables as (
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
  join actual_tables t on t.table_name = e.table_name
  left join actual_columns a
    on a.table_name = e.table_name
   and a.column_name = e.column_name
  where a.column_name is null
),
summary as (
  select
    (select count(*) from missing_tables) as missing_table_count,
    (select count(*) from missing_columns) as missing_column_count
)
select
  'schema_gate_summary' as check_name,
  case
    when missing_table_count = 0 and missing_column_count = 0 then 'ok'
    else 'issue'
  end as health_status,
  (missing_table_count + missing_column_count)::int as issue_count,
  jsonb_build_object(
    'missing_table_count', missing_table_count,
    'missing_column_count', missing_column_count,
    'next_step',
      case
        when missing_table_count > 0 then 'Run outputs/supplier_import_foundation/supplier_staging_schema_DRAFT.sql first, then rerun gear_for_life_raw_load_dry_run_READONLY.sql.'
        when missing_column_count > 0 then 'Staging tables exist but columns are missing. Review supplier_staging_schema_DRAFT.sql before raw load.'
        else 'Schema is ready. Run gear_for_life_raw_load_dry_run_READONLY.sql next.'
      end
  ) as details
from summary

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
from missing_columns;

rollback;
