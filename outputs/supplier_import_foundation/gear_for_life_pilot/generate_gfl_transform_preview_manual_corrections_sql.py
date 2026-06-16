from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "outputs" / "supplier_import_foundation" / "gear_for_life_pilot"
SCHEMA_SQL = ROOT / "outputs" / "supplier_import_foundation" / "supplier_staging_schema_DRAFT.sql"

OUTPUT_SQL = OUT_DIR / "gear_for_life_transform_preview_manual_corrections_DRAFT.sql"
OUTPUT_CHECK_SQL = OUT_DIR / "gear_for_life_transform_preview_manual_corrections_check_READONLY.sql"

SUPPLIER = "Gear For Life"
SOURCE_FILE_HASH = "f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c"

EXPECTED_PREVIEW_ROWS = 471
EXPECTED_BEFORE_READY = 428
EXPECTED_BEFORE_NEEDS_REVIEW = 8
EXPECTED_BEFORE_BLOCKED = 35
EXPECTED_AFTER_READY = 436
EXPECTED_AFTER_NEEDS_REVIEW = 0
EXPECTED_AFTER_BLOCKED = 35
EXPECTED_AFTER_MANUAL_CONFIRMED = 17
EXPECTED_DISCONTINUED_BLOCKED = 35

CONFIRMED_READY_ROWS = [
    {
        "supplier_sku": "PODIGB",
        "target_category": "Tools & Auto",
        "target_subcategory": "Tool Sets & Screwdrivers",
        "confirmation_note": "User confirmed product is a garden tool; closest existing target is Tools & Auto / Tool Sets & Screwdrivers.",
    },
    {
        "supplier_sku": "POGTT",
        "target_category": "Outdoor & Sports",
        "target_subcategory": "Picnic & BBQ",
        "confirmation_note": "User confirmed foldable table with four wine glass holders; outdoor/picnic use.",
    },
    {
        "supplier_sku": "PORC",
        "target_category": "Outdoor & Sports",
        "target_subcategory": "Picnic & BBQ",
        "confirmation_note": "User confirmed cooler box for drinks; no cooler-box category exists, use picnic/outdoor.",
    },
    {
        "supplier_sku": "POTT",
        "target_category": "Outdoor & Sports",
        "target_subcategory": "Picnic & BBQ",
        "confirmation_note": "User confirmed alfresco table with dual integrated wine glass holders.",
    },
    {
        "supplier_sku": "POLTT",
        "target_category": "Outdoor & Sports",
        "target_subcategory": "Picnic & BBQ",
        "confirmation_note": "User confirmed beach/outdoor use with eight stemmed glasses and two bottles.",
    },
    {
        "supplier_sku": "POOMTT",
        "target_category": "Outdoor & Sports",
        "target_subcategory": "Picnic & BBQ",
        "confirmation_note": "User confirmed outdoor table with four wine glass holders and centre umbrella hole.",
    },
    {
        "supplier_sku": "POVCB",
        "target_category": "Outdoor & Sports",
        "target_subcategory": "Picnic & BBQ",
        "confirmation_note": "User confirmed cooler box for drinks; no cooler-box category exists, use picnic/outdoor.",
    },
    {
        "supplier_sku": "IGOISB",
        "target_category": "Outdoor & Sports",
        "target_subcategory": "Picnic & BBQ",
        "confirmation_note": "User confirmed cooler box with speaker; primary use is outdoor drinks/cooler.",
    },
]

DISCONTINUED_BLOCKED_SKUS = [
    "EGAS",
    "POFWGS",
    "VT",
    "GJ",
    "TSC",
    "OAN(C)",
    "OASTOJ",
    "BBYBS",
    "OEGCP",
    "OEGMCI",
    "OWEGCP",
    "OWEGMX",
    "PORHFP",
    "TAX",
    "TTBL",
    "BIO",
    "PORT",
    "POAFP",
    "WTFL",
    "TFL",
    "TV",
    "WMWJ",
    "BMB",
    "BMW",
    "BINB",
    "ODGHP",
    "OTSZH",
    "BPMC",
    "POHF",
    "POKGS",
    "POMA",
    "TEL",
    "TMC",
    "TYS",
    "WTYS",
]


def clean_text(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value or None


def sql_string(value: str | None) -> str:
    text = clean_text(value)
    if text is None:
        return "null"
    return "'" + text.replace("'", "''") + "'"


def sql_jsonb(value: object) -> str:
    return sql_string(json.dumps(value, ensure_ascii=True, separators=(",", ":"))) + "::jsonb"


def tuple_sql(values: Iterable[str]) -> str:
    return "(" + ", ".join(values) + ")"


def values_sql(rows: list[dict[str, str]], columns: list[str]) -> str:
    return ",\n    ".join(tuple_sql(sql_string(row.get(column)) for column in columns) for row in rows)


def sql_array(values: list[str]) -> str:
    return "array[" + ", ".join(sql_string(value) for value in values) + "]::text[]"


def parse_schema_columns(schema_sql: str) -> dict[str, set[str]]:
    tables: dict[str, set[str]] = {}
    for match in re.finditer(
        r"create table if not exists public\.(\w+) \((.*?)\n\);",
        schema_sql,
        flags=re.IGNORECASE | re.DOTALL,
    ):
        table_name = match.group(1)
        columns: set[str] = set()
        for line in match.group(2).splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("--"):
                continue
            first_token = stripped.split()[0].rstrip(",")
            if first_token.lower() in {"check", "constraint", "unique", "primary", "foreign"}:
                continue
            columns.add(first_token)
        tables[table_name] = columns
    return tables


def validate_update_columns(sql: str) -> None:
    schema_columns = parse_schema_columns(SCHEMA_SQL.read_text(encoding="utf-8"))
    table_columns = schema_columns["supplier_transform_preview"]
    for match in re.finditer(
        r"update public\.supplier_transform_preview\s+\w+\s+set\s+(.*?)\nfrom",
        sql,
        flags=re.IGNORECASE | re.DOTALL,
    ):
        assignments = match.group(1)
        for assignment in re.finditer(r"^\s*(\w+)\s*=", assignments, flags=re.MULTILINE):
            column = assignment.group(1)
            if column not in table_columns:
                raise ValueError(f"Unknown supplier_transform_preview column: {column}")


def build_sql() -> str:
    ready_columns = ["supplier_sku", "target_category", "target_subcategory", "confirmation_note"]
    ready_values = values_sql(CONFIRMED_READY_ROWS, ready_columns)
    discontinued_skus = sql_array(DISCONTINUED_BLOCKED_SKUS)
    ready_skus = sql_array([row["supplier_sku"] for row in CONFIRMED_READY_ROWS])

    return f"""-- Gear For Life TRANSFORM PREVIEW MANUAL CORRECTIONS - DRAFT
-- Purpose: apply user-confirmed review decisions to supplier_transform_preview only.
-- Scope: GFL transform preview rows only. Does not write products, url_pages, navigation, redirects, or storefront data.
-- Decisions:
--   - 8 previous needs_review rows are confirmed ready with category targets.
--   - 35 blocked rows are supplier-confirmed discontinued and remain blocked.
-- Run manually in Supabase only after reviewing this file.

begin;

do $$
declare
  gfl_batch_id uuid;
  confirmed_ready_skus text[] := {ready_skus};
  discontinued_skus text[] := {discontinued_skus};
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch not found. Stop: run transform preview first.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)}) <> {EXPECTED_PREVIEW_ROWS} then
    raise exception 'Expected {EXPECTED_PREVIEW_ROWS} GFL transform preview rows before manual correction.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'ready') <> {EXPECTED_BEFORE_READY} then
    raise exception 'Expected {EXPECTED_BEFORE_READY} ready rows before manual correction.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'needs_review') <> {EXPECTED_BEFORE_NEEDS_REVIEW} then
    raise exception 'Expected {EXPECTED_BEFORE_NEEDS_REVIEW} needs_review rows before manual correction.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'blocked') <> {EXPECTED_BEFORE_BLOCKED} then
    raise exception 'Expected {EXPECTED_BEFORE_BLOCKED} blocked rows before manual correction.';
  end if;

  if (
    select count(*)
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(confirmed_ready_skus)
      and mapping_status = 'needs_review'
  ) <> {len(CONFIRMED_READY_ROWS)} then
    raise exception 'Expected all 8 confirmed SKUs to currently be needs_review.';
  end if;

  if (
    select count(*)
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(discontinued_skus)
      and mapping_status = 'blocked'
  ) <> {len(DISCONTINUED_BLOCKED_SKUS)} then
    raise exception 'Expected all 35 discontinued SKUs to currently be blocked.';
  end if;
end $$;

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1
),
confirmed_ready as (
  select *
  from (values
    {ready_values}
  ) as v({", ".join(ready_columns)})
)
update public.supplier_transform_preview p
set
  page_role = 'P',
  target_category = v.target_category,
  target_subcategory = v.target_subcategory,
  mapping_status = 'ready',
  mapping_rule_id = 'gfl_manual_confirmed_category',
  confidence = 0.95,
  warning_flags = coalesce((
    select array_agg(flag order by flag)
    from (
      select distinct flag
      from unnest(p.warning_flags) as u(flag)
      where flag <> 'needs_review'
    ) x
  ), '{{}}'::text[]),
  review_notes = v.confirmation_note,
  preview_json = p.preview_json || jsonb_build_object(
    'mapping_source', 'manual_confirmed_category',
    'manual_review_confirmed', true,
    'manual_review_confirmed_at', '2026-06-15',
    'manual_review_note', v.confirmation_note,
    'target_category', v.target_category,
    'target_subcategory', v.target_subcategory
  )
from gfl_batch b, confirmed_ready v
where p.batch_id = b.batch_id
  and p.supplier = {sql_string(SUPPLIER)}
  and p.supplier_sku = v.supplier_sku;

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1
),
discontinued as (
  select unnest({discontinued_skus}) as supplier_sku
)
update public.supplier_transform_preview p
set
  mapping_status = 'blocked',
  page_role = 'manual_review',
  target_category = null,
  target_subcategory = null,
  mapping_rule_id = 'gfl_supplier_confirmed_discontinued',
  confidence = null,
  warning_flags = coalesce((
    select array_agg(flag order by flag)
    from (
      select distinct flag
      from unnest(p.warning_flags || array['supplier_discontinued']::text[]) as u(flag)
    ) x
  ), '{{supplier_discontinued}}'::text[]),
  review_notes = 'Supplier confirmed discontinued; keep blocked and do not publish.',
  preview_json = p.preview_json || jsonb_build_object(
    'supplier_confirmed_discontinued', true,
    'manual_review_confirmed_at', '2026-06-15',
    'manual_review_note', 'Supplier confirmed discontinued; keep blocked and do not publish.'
  )
from gfl_batch b, discontinued d
where p.batch_id = b.batch_id
  and p.supplier = {sql_string(SUPPLIER)}
  and p.supplier_sku = d.supplier_sku;

do $$
declare
  gfl_batch_id uuid;
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)}) <> {EXPECTED_PREVIEW_ROWS} then
    raise exception 'GFL transform preview row count changed unexpectedly.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'ready') <> {EXPECTED_AFTER_READY} then
    raise exception 'Post-correction ready count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'needs_review') <> {EXPECTED_AFTER_NEEDS_REVIEW} then
    raise exception 'Post-correction needs_review count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'blocked') <> {EXPECTED_AFTER_BLOCKED} then
    raise exception 'Post-correction blocked count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_rule_id = 'gfl_manual_confirmed_category') <> {EXPECTED_AFTER_MANUAL_CONFIRMED} then
    raise exception 'Post-correction manual confirmed category count mismatch.';
  end if;

  if (
    select count(*)
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and mapping_rule_id = 'gfl_supplier_confirmed_discontinued'
      and 'supplier_discontinued' = any(warning_flags)
  ) <> {EXPECTED_DISCONTINUED_BLOCKED} then
    raise exception 'Post-correction discontinued blocked count mismatch.';
  end if;
end $$;

commit;

-- After this succeeds, run:
-- outputs/supplier_import_foundation/gear_for_life_pilot/gear_for_life_transform_preview_manual_corrections_check_READONLY.sql
"""


def build_check_sql() -> str:
    ready_skus = sql_array([row["supplier_sku"] for row in CONFIRMED_READY_ROWS])
    discontinued_skus = sql_array(DISCONTINUED_BLOCKED_SKUS)
    return f"""-- Gear For Life transform preview manual corrections check.
-- READ ONLY. Run after gear_for_life_transform_preview_manual_corrections_DRAFT.sql succeeds.

with params as (
  select {sql_string(SUPPLIER)}::text as target_supplier,
         {sql_string(SOURCE_FILE_HASH)}::text as target_source_file_hash,
         {ready_skus} as confirmed_ready_skus,
         {discontinued_skus} as discontinued_skus
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
  where p.supplier = {sql_string(SUPPLIER)}
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
  select 'batch' as check_name, (select count(*) from gfl_batch)::int as actual_value, 1::int as expected_value, '{{}}'::jsonb as details
  union all select 'transform_preview_rows', (select count(*) from preview_rows)::int, {EXPECTED_PREVIEW_ROWS}, '{{}}'::jsonb
  union all select 'preview_ready_rows', (select count(*) from preview_rows where mapping_status = 'ready')::int, {EXPECTED_AFTER_READY}, '{{}}'::jsonb
  union all select 'preview_needs_review_rows', (select count(*) from preview_rows where mapping_status = 'needs_review')::int, {EXPECTED_AFTER_NEEDS_REVIEW}, '{{}}'::jsonb
  union all select 'preview_blocked_rows', (select count(*) from preview_rows where mapping_status = 'blocked')::int, {EXPECTED_AFTER_BLOCKED}, '{{}}'::jsonb
  union all select 'manual_confirmed_category_rows', (select count(*) from preview_rows where mapping_rule_id = 'gfl_manual_confirmed_category')::int, {EXPECTED_AFTER_MANUAL_CONFIRMED}, '{{}}'::jsonb
  union all select 'newly_confirmed_ready_rows', (select count(*) from confirmed_ready where mapping_status = 'ready' and page_role = 'P' and target_category is not null and target_subcategory is not null)::int, {len(CONFIRMED_READY_ROWS)}, coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku, 'raw_name', raw_name, 'target_category', target_category, 'target_subcategory', target_subcategory) order by supplier_sku) from confirmed_ready), '[]'::jsonb)
  union all select 'discontinued_blocked_rows', (select count(*) from discontinued where mapping_status = 'blocked' and mapping_rule_id = 'gfl_supplier_confirmed_discontinued' and 'supplier_discontinued' = any(warning_flags))::int, {EXPECTED_DISCONTINUED_BLOCKED}, coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku, 'raw_name', raw_name, 'warning_flags', warning_flags) order by supplier_sku) from discontinued), '[]'::jsonb)
  union all select 'ready_rows_missing_target', (select count(*) from preview_rows where mapping_status = 'ready' and (target_category is null or target_subcategory is null))::int, 0, '{{}}'::jsonb
  union all select 'non_local_stock_rows', (select count(*) from preview_rows where fulfillment <> 'local_stock')::int, 0, '{{}}'::jsonb
  union all select 'bad_lead_time_rows', (select count(*) from preview_rows where lead_time_min_days <> 10 or lead_time_max_days <> 12 or lead_time_unit <> 'business_days' or lead_time_basis <> 'decorated')::int, 0, '{{}}'::jsonb
  union all select 'products_table_rows_created', 0::int, 0, '{{}}'::jsonb
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by check_name;
"""


def main() -> None:
    sql = build_sql()
    check_sql = build_check_sql()
    validate_update_columns(sql)
    lowered = sql.lower()
    for forbidden in ("public.products", "public.url_pages", "public.navigation", "insert into public."):
        if forbidden in lowered:
            raise ValueError(f"Forbidden publish target or insert found: {forbidden}")
    OUTPUT_SQL.write_text(sql, encoding="utf-8")
    OUTPUT_CHECK_SQL.write_text(check_sql, encoding="utf-8")
    print(f"Wrote {OUTPUT_SQL}")
    print(f"Wrote {OUTPUT_CHECK_SQL}")
    print(
        json.dumps(
            {
                "confirmed_ready_rows": len(CONFIRMED_READY_ROWS),
                "discontinued_blocked_rows": len(DISCONTINUED_BLOCKED_SKUS),
                "expected_ready_after": EXPECTED_AFTER_READY,
                "expected_needs_review_after": EXPECTED_AFTER_NEEDS_REVIEW,
                "expected_blocked_after": EXPECTED_AFTER_BLOCKED,
            },
            indent=2,
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
