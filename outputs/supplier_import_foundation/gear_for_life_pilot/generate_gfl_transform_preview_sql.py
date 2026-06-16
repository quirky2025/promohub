from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "outputs" / "supplier_import_foundation" / "gear_for_life_pilot"

PRODUCT_CSV = Path(
    r"C:\Users\jilin\Desktop\supplier\gearforlife\The Source - 1st June 2026 APPA Data file - for Customers.csv"
)
CATEGORY_MAPPINGS_CSV = ROOT / "outputs" / "supplier_mapping" / "supplier_category_mappings_DRAFT_v4.csv"
CLEANUP_RESULTS_CSV = ROOT / "outputs" / "supplier_mapping" / "remaining_review_product_cleanup_results.csv"
BRAND_ALIASES_CSV = ROOT / "outputs" / "supplier_import_foundation" / "supplier_brand_aliases_DRAFT.csv"
SCHEMA_SQL = ROOT / "outputs" / "supplier_import_foundation" / "supplier_staging_schema_DRAFT.sql"

OUTPUT_SQL = OUT_DIR / "gear_for_life_transform_preview_DRAFT.sql"
OUTPUT_CHECK_SQL = OUT_DIR / "gear_for_life_transform_preview_check_READONLY.sql"

SUPPLIER = "Gear For Life"
SOURCE_FILE_HASH = "f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c"
LEAD_TIME_NOTE = "10-12 business days after artwork approval"

EXPECTED_RAW_PRODUCTS = 472
EXPECTED_PREVIEW_ROWS = 471
EXPECTED_EXCLUDED_ROWS = 1
EXPECTED_BLOCKED_ROWS = 35
EXPECTED_MANUAL_CONFIRMED_ROWS = 9
EXPECTED_DECORATION_OPTIONS = 277
EXPECTED_DECORATION_PRICE_ROWS = 1118
EXPECTED_RATE_CARDS = 2
EXPECTED_RATE_CARD_ROWS = 160

MANUAL_CATEGORY_OVERRIDES = {
    "POPIB": ("Outdoor & Sports", "Picnic & BBQ", "User confirmed outdoor/beach ice bucket."),
    "OVT": ("Apparel", "Sweatshirts", "User confirmed proposed mapping."),
    "BHZQM": ("Apparel", "Sweatshirts", "User confirmed proposed mapping."),
    "WEGMCD": ("Apparel", "Sweatshirts", "User confirmed proposed mapping."),
    "BT": ("Apparel", "Sweatshirts", "User confirmed proposed mapping."),
    "OTNT": ("Apparel", "Sweatshirts", "User confirmed proposed mapping."),
    "TNT": ("Apparel", "Sweatshirts", "User confirmed proposed mapping."),
    "PODCS": ("Barware & Accessories", "Bar Accessories", "User confirmed proposed mapping."),
    "PONS": ("Tools & Auto", "Tool Sets & Screwdrivers", "User confirmed proposed mapping."),
}

ODGP_SOURCE_ROW = 427
ODGP_RAW_SKU = "ODGP"
ODGP_NORMALIZED_SKU = "ODGP(P)"
ODGP_NORMALIZED_NAME = "Dri Gear Active Polo - Mens"

# These are not manually confirmed. Keep them visible as suggestions, but do not mark ready.
MIXED_PATH_KEYWORD_REVIEW_SKUS = {
    "PODIGB": "Keyword suggestion is risky: Garden Box from Leisure & Outdoors was mapped to Packaging.",
    "POLTT": "Keyword suggestion is risky: outdoor Tavolo Table may not be Home & Living.",
    "POOMTT": "Keyword suggestion is risky: outdoor Tavolo Table may not be Home & Living.",
    "POTT": "Keyword suggestion is risky: Tavolo Table from Leisure & Outdoors may not be Home & Living.",
    "IGOISB": "Keyword suggestion is risky: On-Ice Sound Box was mapped to Packaging.",
    "POVCB": "Keyword suggestion is risky: Vintage Cooler Box was mapped to Packaging.",
    "PORC": "Keyword suggestion is risky: Retro Cooler Box was mapped to Packaging.",
    "POGTT": "Keyword suggestion is risky: Grande Tavolo Table may not be Home & Living.",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    last_error: UnicodeDecodeError | None = None
    for encoding in ("utf-8-sig", "cp1252"):
        try:
            with path.open("r", encoding=encoding, newline="") as f:
                reader = csv.DictReader(f)
                out: list[dict[str, str]] = []
                for raw_row in reader:
                    row: dict[str, str] = {}
                    for key, value in raw_row.items():
                        if key is None:
                            continue
                        normalized_key = key.strip()
                        if normalized_key:
                            row[normalized_key] = (value or "").strip()
                    out.append(row)
                return out
        except UnicodeDecodeError as exc:
            last_error = exc
    if last_error:
        raise last_error
    return []


def clean_text(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    if not value:
        return None
    return value.replace("\r\n", "\n").replace("\r", "\n")


def sql_string(value: str | None) -> str:
    text = clean_text(value)
    if text is None:
        return "null"
    return "'" + text.replace("'", "''") + "'"


def sql_num(value: str | None) -> str:
    text = clean_text(value)
    if text is None:
        return "null"
    text = text.replace("$", "").replace(",", "")
    if not re.fullmatch(r"-?\d+(\.\d+)?", text):
        return "null"
    return text


def sql_jsonb(value: object) -> str:
    text = json.dumps(value, ensure_ascii=True, separators=(",", ":"))
    return sql_string(text) + "::jsonb"


def tuple_sql(values: Iterable[str]) -> str:
    return "(" + ", ".join(values) + ")"


def raw_category_path(row: dict[str, str]) -> str | None:
    parts = [
        clean_text(row.get("Categorisation")),
        clean_text(row.get("category_ /_ sub category")),
    ]
    parts = [part for part in parts if part]
    return " / ".join(parts) if parts else None


def product_price_count(row: dict[str, str]) -> int:
    count = 0
    for tier_index in range(1, 9):
        qty = clean_text(row.get(f"qty_{tier_index}"))
        price = clean_text(row.get(f"price_{tier_index}"))
        if qty and price:
            count += 1
    return count


def source_rows() -> list[dict[str, str]]:
    rows = read_csv(PRODUCT_CSV)
    for source_row_number, row in enumerate(rows, start=2):
        row["_source_row_number"] = str(source_row_number)
        row["_raw_category_path"] = raw_category_path(row) or ""
        row["_price_count"] = str(product_price_count(row))
    return rows


def category_mapping_rows() -> list[dict[str, str]]:
    rows = []
    for row in read_csv(CATEGORY_MAPPINGS_CSV):
        if row.get("supplier") != SUPPLIER:
            continue
        if not clean_text(row.get("target_category")):
            continue
        rows.append(
            {
                "raw_category_path": row["raw_category_path"],
                "target_category": row["target_category"],
                "target_subcategory": row.get("target_subcategory", ""),
                "confidence": row.get("confidence", ""),
                "mapping_rule_id": f"category_mapping_v4:{row['raw_category_path']}",
                "review_note": row.get("mapping_note", ""),
                "suggested_material": row.get("suggested_material", ""),
                "suggested_tags": row.get("suggested_tags", ""),
            }
        )
    return rows


def cleanup_mapping_rows() -> list[dict[str, str]]:
    rows = []
    for row in read_csv(CLEANUP_RESULTS_CSV):
        if row.get("supplier") != SUPPLIER:
            continue
        if row.get("mapping_status") != "auto_mapped_by_keyword":
            continue
        if not clean_text(row.get("target_category")):
            continue
        rows.append(
            {
                "raw_supplier_sku": row["sku"],
                "raw_category_path": row.get("raw_category_path", ""),
                "target_category": row["target_category"],
                "target_subcategory": row.get("target_subcategory", ""),
                "confidence": row.get("confidence", ""),
                "mapping_rule_id": f"product_keyword_cleanup:{row.get('rule_id') or row['sku']}",
                "review_note": row.get("mapping_note", ""),
                "suggested_material": row.get("suggested_material", ""),
                "suggested_tags": row.get("suggested_tags", ""),
            }
        )
    return rows


def manual_override_rows() -> list[dict[str, str]]:
    rows = []
    for sku, (category, subcategory, note) in MANUAL_CATEGORY_OVERRIDES.items():
        rows.append(
            {
                "raw_supplier_sku": sku,
                "target_category": category,
                "target_subcategory": subcategory,
                "confidence": "0.95",
                "mapping_rule_id": "gfl_manual_confirmed_category",
                "review_note": note,
            }
        )
    return rows


def mixed_review_rows() -> list[dict[str, str]]:
    rows = []
    for sku, note in MIXED_PATH_KEYWORD_REVIEW_SKUS.items():
        rows.append({"raw_supplier_sku": sku, "review_note": note})
    return rows


def brand_alias_rows() -> list[dict[str, str]]:
    rows = []
    for row in read_csv(BRAND_ALIASES_CSV):
        scope = row.get("supplier_scope")
        if scope not in {SUPPLIER, "all"}:
            continue
        rows.append(
            {
                "raw_brand_or_signal": row["raw_brand_or_signal"],
                "normalized_brand": row.get("normalized_brand", ""),
                "action": row.get("action", ""),
                "confidence": row.get("confidence", ""),
            }
        )
    return rows


def values_sql(rows: list[dict[str, str]], columns: list[str]) -> str:
    return ",\n    ".join(tuple_sql(sql_string(row.get(column)) for column in columns) for row in rows)


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


def validate_insert_columns(sql: str) -> None:
    schema_columns = parse_schema_columns(SCHEMA_SQL.read_text(encoding="utf-8"))
    for match in re.finditer(
        r"insert into public\.(\w+) \(\n\s*(.*?)\n\)",
        sql,
        flags=re.IGNORECASE | re.DOTALL,
    ):
        table_name = match.group(1)
        if table_name not in schema_columns:
            raise ValueError(f"Unknown table in generated SQL: {table_name}")
        insert_columns = [column.strip() for column in match.group(2).replace("\n", " ").split(",")]
        missing = [column for column in insert_columns if column and column not in schema_columns[table_name]]
        if missing:
            raise ValueError(f"Unknown columns for {table_name}: {missing}")


def local_metrics() -> dict[str, int]:
    rows = source_rows()
    category_map = {row["raw_category_path"]: row for row in category_mapping_rows()}
    cleanup_map = {row["raw_supplier_sku"]: row for row in cleanup_mapping_rows()}
    manual_map = {row["raw_supplier_sku"]: row for row in manual_override_rows()}
    mixed_review = {row["raw_supplier_sku"] for row in mixed_review_rows()}

    metrics = {
        "raw_rows": len(rows),
        "excluded_rows": 0,
        "preview_rows": 0,
        "ready_rows": 0,
        "blocked_rows": 0,
        "needs_review_rows": 0,
        "manual_confirmed_rows": 0,
        "keyword_cleanup_ready_rows": 0,
        "keyword_cleanup_needs_review_rows": 0,
        "category_mapping_rows": 0,
        "odgp_normalized_rows": 0,
    }
    for row in rows:
        sku = clean_text(row.get("product_code"))
        raw_name = clean_text(row.get("product_name")) or ""
        if not sku or raw_name.upper() == "DELETIONS":
            metrics["excluded_rows"] += 1
            continue
        metrics["preview_rows"] += 1
        if row["_source_row_number"] == str(ODGP_SOURCE_ROW) and sku == ODGP_RAW_SKU:
            metrics["odgp_normalized_rows"] += 1
        if not row["_raw_category_path"] or product_price_count(row) == 0:
            metrics["blocked_rows"] += 1
            continue
        if sku in manual_map:
            metrics["ready_rows"] += 1
            metrics["manual_confirmed_rows"] += 1
        elif sku in cleanup_map:
            if sku in mixed_review:
                metrics["needs_review_rows"] += 1
                metrics["keyword_cleanup_needs_review_rows"] += 1
            else:
                metrics["ready_rows"] += 1
                metrics["keyword_cleanup_ready_rows"] += 1
        elif row["_raw_category_path"] in category_map:
            metrics["ready_rows"] += 1
            metrics["category_mapping_rows"] += 1
        else:
            metrics["needs_review_rows"] += 1
    return metrics


def build_sql(metrics: dict[str, int]) -> str:
    category_columns = [
        "raw_category_path",
        "target_category",
        "target_subcategory",
        "confidence",
        "mapping_rule_id",
        "review_note",
        "suggested_material",
        "suggested_tags",
    ]
    cleanup_columns = [
        "raw_supplier_sku",
        "raw_category_path",
        "target_category",
        "target_subcategory",
        "confidence",
        "mapping_rule_id",
        "review_note",
        "suggested_material",
        "suggested_tags",
    ]
    manual_columns = [
        "raw_supplier_sku",
        "target_category",
        "target_subcategory",
        "confidence",
        "mapping_rule_id",
        "review_note",
    ]
    mixed_review_columns = ["raw_supplier_sku", "review_note"]
    brand_columns = ["raw_brand_or_signal", "normalized_brand", "action", "confidence"]

    insert_columns = [
        "batch_id",
        "supplier",
        "supplier_sku",
        "raw_name",
        "normalized_name",
        "slug",
        "page_role",
        "target_category",
        "target_subcategory",
        "mapping_status",
        "mapping_rule_id",
        "confidence",
        "brand",
        "brand_alias_status",
        "material_tags",
        "tags",
        "fulfillment",
        "lead_time_min_days",
        "lead_time_max_days",
        "lead_time_unit",
        "lead_time_basis",
        "lead_time_note",
        "offer_type",
        "kit_themes",
        "warning_flags",
        "review_notes",
        "preview_json",
    ]

    return f"""-- Gear For Life TRANSFORM PREVIEW - DRAFT
-- Purpose: populate supplier_transform_preview for manual approval.
-- Scope: staging preview table only. Does not write products, url_pages, navigation, redirects, or storefront data.
-- Run manually in Supabase only after reviewing this file.

begin;

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

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch not found. Stop: run raw load first.';
  end if;

  if exists (
    select 1 from public.supplier_transform_preview
    where supplier = {sql_string(SUPPLIER)}
      and batch_id = gfl_batch_id
  ) then
    raise exception 'Gear For Life transform preview already exists for this batch. Stop: do not run twice.';
  end if;

  if (select count(*) from public.supplier_raw_product_rows where batch_id = gfl_batch_id) <> {EXPECTED_RAW_PRODUCTS} then
    raise exception 'Expected {EXPECTED_RAW_PRODUCTS} raw product rows before transform preview.';
  end if;

  if (select count(*) from public.supplier_decoration_options where batch_id = gfl_batch_id) <> {EXPECTED_DECORATION_OPTIONS} then
    raise exception 'Expected {EXPECTED_DECORATION_OPTIONS} corrected decoration options before transform preview.';
  end if;

  if (select count(*) from public.supplier_decoration_price_rows where batch_id = gfl_batch_id) <> {EXPECTED_DECORATION_PRICE_ROWS} then
    raise exception 'Expected {EXPECTED_DECORATION_PRICE_ROWS} corrected decoration price rows before transform preview.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_cards where batch_id = gfl_batch_id) <> {EXPECTED_RATE_CARDS} then
    raise exception 'Expected {EXPECTED_RATE_CARDS} GFL rate cards before transform preview.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_card_rows where batch_id = gfl_batch_id) <> {EXPECTED_RATE_CARD_ROWS} then
    raise exception 'Expected {EXPECTED_RATE_CARD_ROWS} GFL rate card rows before transform preview.';
  end if;
end $$;

with
params as (
  select {sql_string(SUPPLIER)}::text as target_supplier,
         {sql_string(SOURCE_FILE_HASH)}::text as target_source_file_hash
),
gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = (select target_supplier from params)
    and source_file_hash = (select target_source_file_hash from params)
  order by created_at desc
  limit 1
),
manual_overrides as (
  select *
  from (values
    {values_sql(manual_override_rows(), manual_columns)}
  ) as v({", ".join(manual_columns)})
),
category_mappings as (
  select *
  from (values
    {values_sql(category_mapping_rows(), category_columns)}
  ) as v({", ".join(category_columns)})
),
cleanup_mappings as (
  select *
  from (values
    {values_sql(cleanup_mapping_rows(), cleanup_columns)}
  ) as v({", ".join(cleanup_columns)})
),
mixed_keyword_review as (
  select *
  from (values
    {values_sql(mixed_review_rows(), mixed_review_columns)}
  ) as v({", ".join(mixed_review_columns)})
),
brand_aliases as (
  select *
  from (values
    {values_sql(brand_alias_rows(), brand_columns)}
  ) as v({", ".join(brand_columns)})
),
raw_rows as (
  select r.*
  from public.supplier_raw_product_rows r
  join gfl_batch b on b.batch_id = r.batch_id
  where r.supplier = {sql_string(SUPPLIER)}
),
excluded_rows as (
  select *
  from raw_rows
  where nullif(trim(coalesce(supplier_sku, '')), '') is null
     or upper(trim(coalesce(raw_name, ''))) = 'DELETIONS'
),
eligible_rows as (
  select *
  from raw_rows r
  where not exists (
    select 1
    from excluded_rows e
    where e.batch_id = r.batch_id
      and e.source_row_number = r.source_row_number
  )
),
price_counts as (
  select
    p.batch_id,
    p.supplier_sku,
    p.raw_json ->> 'source_row_number' as source_row_number,
    count(*)::int as price_row_count
  from public.supplier_price_rows p
  join gfl_batch b on b.batch_id = p.batch_id
  where p.supplier = {sql_string(SUPPLIER)}
  group by p.batch_id, p.supplier_sku, p.raw_json ->> 'source_row_number'
),
colour_counts as (
  select batch_id, supplier_sku, count(*)::int as colour_count
  from public.supplier_raw_colour_options
  where supplier = {sql_string(SUPPLIER)}
  group by batch_id, supplier_sku
),
image_counts as (
  select
    batch_id,
    supplier_sku,
    count(*)::int as image_count,
    count(*) filter (where colour_key is null)::int as gallery_fallback_image_count
  from public.supplier_raw_images
  where supplier = {sql_string(SUPPLIER)}
  group by batch_id, supplier_sku
),
decoration_counts as (
  select
    d.batch_id,
    d.supplier_sku,
    count(distinct d.id)::int as decoration_option_count,
    count(p.id)::int as decoration_price_row_count
  from public.supplier_decoration_options d
  left join public.supplier_decoration_price_rows p
    on p.supplier_decoration_option_id = d.id
  where d.supplier = {sql_string(SUPPLIER)}
  group by d.batch_id, d.supplier_sku
),
resolved as (
  select
    r.*,
    case
      when r.source_row_number = {ODGP_SOURCE_ROW}
       and r.supplier_sku = {sql_string(ODGP_RAW_SKU)}
       and trim(coalesce(r.raw_name, '')) = {sql_string(ODGP_NORMALIZED_NAME)}
      then {sql_string(ODGP_NORMALIZED_SKU)}
      else r.supplier_sku
    end as preview_supplier_sku,
    coalesce(pc.price_row_count, 0) as price_row_count,
    coalesce(cc.colour_count, 0) as colour_count,
    coalesce(ic.image_count, 0) as image_count,
    coalesce(ic.gallery_fallback_image_count, 0) as gallery_fallback_image_count,
    coalesce(dc.decoration_option_count, 0) as decoration_option_count,
    coalesce(dc.decoration_price_row_count, 0) as decoration_price_row_count,
    mo.target_category as manual_target_category,
    mo.target_subcategory as manual_target_subcategory,
    mo.confidence as manual_confidence,
    mo.mapping_rule_id as manual_rule_id,
    mo.review_note as manual_review_note,
    cm.target_category as cleanup_target_category,
    cm.target_subcategory as cleanup_target_subcategory,
    cm.confidence as cleanup_confidence,
    cm.mapping_rule_id as cleanup_rule_id,
    cm.review_note as cleanup_review_note,
    cm.suggested_material as cleanup_suggested_material,
    cm.suggested_tags as cleanup_suggested_tags,
    cat.target_category as category_target_category,
    cat.target_subcategory as category_target_subcategory,
    cat.confidence as category_confidence,
    cat.mapping_rule_id as category_rule_id,
    cat.review_note as category_review_note,
    cat.suggested_material as category_suggested_material,
    cat.suggested_tags as category_suggested_tags,
    mkr.review_note as mixed_review_note,
    ba.normalized_brand,
    ba.action as brand_alias_action
  from eligible_rows r
  left join price_counts pc
    on pc.batch_id = r.batch_id
   and pc.supplier_sku = r.supplier_sku
   and pc.source_row_number = r.source_row_number::text
  left join colour_counts cc
    on cc.batch_id = r.batch_id
   and cc.supplier_sku = r.supplier_sku
  left join image_counts ic
    on ic.batch_id = r.batch_id
   and ic.supplier_sku = r.supplier_sku
  left join decoration_counts dc
    on dc.batch_id = r.batch_id
   and dc.supplier_sku = r.supplier_sku
  left join manual_overrides mo
    on mo.raw_supplier_sku = r.supplier_sku
  left join cleanup_mappings cm
    on cm.raw_supplier_sku = r.supplier_sku
   and cm.raw_category_path = r.raw_category_path
  left join category_mappings cat
    on cat.raw_category_path = r.raw_category_path
  left join mixed_keyword_review mkr
    on mkr.raw_supplier_sku = r.supplier_sku
  left join brand_aliases ba
    on ba.raw_brand_or_signal = r.raw_brand
),
preview_rows as (
  select
    r.*,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then 'blocked'
      when r.manual_target_category is not null then 'ready'
      when r.cleanup_target_category is not null and r.mixed_review_note is not null then 'needs_review'
      when r.cleanup_target_category is not null then 'ready'
      when r.category_target_category is not null then 'ready'
      else 'needs_review'
    end as resolved_mapping_status,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then null
      else coalesce(r.manual_target_category, r.cleanup_target_category, r.category_target_category)
    end as resolved_target_category,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then null
      else coalesce(r.manual_target_subcategory, r.cleanup_target_subcategory, r.category_target_subcategory)
    end as resolved_target_subcategory,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then 'gfl_blocked_blank_category_or_missing_price'
      else coalesce(r.manual_rule_id, r.cleanup_rule_id, r.category_rule_id, 'gfl_needs_review')
    end as resolved_mapping_rule_id,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then null::numeric
      else coalesce(r.manual_confidence, r.cleanup_confidence, r.category_confidence)::numeric
    end as resolved_confidence,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then 'Blocked: missing category and/or product price rows. Do not publish without manual product data.'
      when r.manual_target_category is not null then r.manual_review_note
      when r.cleanup_target_category is not null and r.mixed_review_note is not null then r.mixed_review_note
      when r.cleanup_target_category is not null then coalesce(nullif(r.cleanup_review_note, ''), 'Product keyword cleanup mapping.')
      when r.category_target_category is not null then coalesce(nullif(r.category_review_note, ''), 'Category mapping v4.')
      else 'No confident category mapping. Manual review required.'
    end as resolved_review_notes,
    coalesce(nullif(r.cleanup_suggested_material, ''), nullif(r.category_suggested_material, '')) as resolved_suggested_material,
    coalesce(nullif(r.cleanup_suggested_tags, ''), nullif(r.category_suggested_tags, '')) as resolved_suggested_tags
  from resolved r
)
insert into public.supplier_transform_preview (
  {", ".join(insert_columns)}
)
select
  r.batch_id,
  {sql_string(SUPPLIER)} as supplier,
  r.preview_supplier_sku as supplier_sku,
  r.raw_name,
  trim(coalesce(r.raw_name, '')) as normalized_name,
  trim(both '-' from regexp_replace(lower(trim(coalesce(r.raw_name, '') || '-' || r.preview_supplier_sku)), '[^a-z0-9]+', '-', 'g')) as slug,
  case when r.resolved_mapping_status = 'ready' then 'P' else 'manual_review' end as page_role,
  r.resolved_target_category as target_category,
  r.resolved_target_subcategory as target_subcategory,
  r.resolved_mapping_status as mapping_status,
  r.resolved_mapping_rule_id as mapping_rule_id,
  r.resolved_confidence as confidence,
  case
    when r.brand_alias_action in ('normalize', 'keep') then nullif(r.normalized_brand, '')
    else nullif(r.raw_brand, '')
  end as brand,
  case
    when r.brand_alias_action in ('normalize', 'keep') then 'matched_' || r.brand_alias_action
    when nullif(trim(coalesce(r.raw_brand, '')), '') is not null then 'raw_unmatched'
    else 'none'
  end as brand_alias_status,
  array_remove(array[nullif(r.resolved_suggested_material, '')]::text[], null) as material_tags,
  '{{}}'::text[] as tags,
  'local_stock' as fulfillment,
  10 as lead_time_min_days,
  12 as lead_time_max_days,
  'business_days' as lead_time_unit,
  'decorated' as lead_time_basis,
  {sql_string(LEAD_TIME_NOTE)} as lead_time_note,
  null::text as offer_type,
  '{{}}'::text[] as kit_themes,
  array_remove(array[
    case when r.source_row_number = {ODGP_SOURCE_ROW} and r.preview_supplier_sku = {sql_string(ODGP_NORMALIZED_SKU)} then 'sku_conflict_resolved' end,
    case when nullif(trim(coalesce(r.raw_category_path, '')), '') is null then 'missing_category' end,
    case when r.price_row_count = 0 then 'missing_product_price' end,
    case when r.resolved_mapping_status = 'blocked' then 'blocked_manual_review' end,
    case when r.resolved_mapping_status = 'needs_review' then 'needs_review' end,
    case when r.gallery_fallback_image_count > 0 then 'gallery_fallback_images_preserved' end
  ]::text[], null) as warning_flags,
  r.resolved_review_notes as review_notes,
  jsonb_build_object(
    'source', 'gfl_transform_preview_draft',
    'source_row_number', r.source_row_number,
    'raw_supplier_sku', r.supplier_sku,
    'preview_supplier_sku', r.preview_supplier_sku,
    'raw_name', r.raw_name,
    'raw_brand', r.raw_brand,
    'raw_category_path', r.raw_category_path,
    'mapping_source',
      case
        when r.resolved_mapping_rule_id = 'gfl_manual_confirmed_category' then 'manual_confirmed_category'
        when r.resolved_mapping_rule_id like 'product_keyword_cleanup:%' then 'product_keyword_cleanup'
        when r.resolved_mapping_rule_id like 'category_mapping_v4:%' then 'category_mapping_v4'
        when r.resolved_mapping_rule_id = 'gfl_blocked_blank_category_or_missing_price' then 'blocked_blank_category_or_missing_price'
        else 'needs_review'
      end,
    'price_row_count', r.price_row_count,
    'colour_count', r.colour_count,
    'image_count', r.image_count,
    'gallery_fallback_image_count', r.gallery_fallback_image_count,
    'decoration_option_count', r.decoration_option_count,
    'decoration_price_row_count', r.decoration_price_row_count,
    'lead_time', jsonb_build_object(
      'min_days', 10,
      'max_days', 12,
      'unit', 'business_days',
      'basis', 'decorated',
      'note', {sql_string(LEAD_TIME_NOTE)}
    ),
    'raw_product_json', r.raw_json
  ) as preview_json
from preview_rows r
order by r.source_row_number;

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

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)}) <> {metrics["preview_rows"]} then
    raise exception 'GFL transform preview row count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'ready') <> {metrics["ready_rows"]} then
    raise exception 'GFL transform preview ready row count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'needs_review') <> {metrics["needs_review_rows"]} then
    raise exception 'GFL transform preview needs_review row count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = {sql_string(SUPPLIER)} and mapping_status = 'blocked') <> {metrics["blocked_rows"]} then
    raise exception 'GFL transform preview blocked row count mismatch.';
  end if;

  if exists (
    select 1
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and (fulfillment <> 'local_stock'
        or lead_time_min_days <> 10
        or lead_time_max_days <> 12
        or lead_time_unit <> 'business_days'
        or lead_time_basis <> 'decorated')
  ) then
    raise exception 'GFL transform preview defaults are not supplier-specific local_stock / 10-12 business_days / decorated.';
  end if;

  if exists (
    select 1
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
    group by supplier_sku
    having count(*) > 1
  ) then
    raise exception 'GFL transform preview supplier_sku values must be unique after ODGP normalization.';
  end if;
end $$;

commit;

-- After this succeeds, run:
-- outputs/supplier_import_foundation/gear_for_life_pilot/gear_for_life_transform_preview_check_READONLY.sql
-- Then review needs_review / blocked rows before any product INSERT draft.
"""


def build_check_sql(metrics: dict[str, int]) -> str:
    return f"""-- Gear For Life transform preview check.
-- READ ONLY. Run after gear_for_life_transform_preview_DRAFT.sql succeeds.

with params as (
  select {sql_string(SUPPLIER)}::text as target_supplier,
         {sql_string(SOURCE_FILE_HASH)}::text as target_source_file_hash
),
gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = (select target_supplier from params)
    and source_file_hash = (select target_source_file_hash from params)
  order by created_at desc
  limit 1
),
raw_rows as (
  select r.*
  from public.supplier_raw_product_rows r
  join gfl_batch b on b.batch_id = r.batch_id
),
excluded_rows as (
  select *
  from raw_rows
  where nullif(trim(coalesce(supplier_sku, '')), '') is null
     or upper(trim(coalesce(raw_name, ''))) = 'DELETIONS'
),
preview_rows as (
  select p.*
  from public.supplier_transform_preview p
  join gfl_batch b on b.batch_id = p.batch_id
  where p.supplier = {sql_string(SUPPLIER)}
),
duplicate_preview_skus as (
  select supplier_sku, count(*) as row_count, jsonb_agg(raw_name order by raw_name) as names
  from preview_rows
  group by supplier_sku
  having count(*) > 1
),
checks as (
  select 'batch' as check_name, (select count(*) from gfl_batch)::int as actual_value, 1::int as expected_value, '{{}}'::jsonb as details
  union all select 'raw_products', (select count(*) from raw_rows)::int, {EXPECTED_RAW_PRODUCTS}, '{{}}'::jsonb
  union all select 'excluded_rows', (select count(*) from excluded_rows)::int, {metrics["excluded_rows"]}, coalesce((select jsonb_agg(jsonb_build_object('source_row_number', source_row_number, 'supplier_sku', supplier_sku, 'raw_name', raw_name)) from excluded_rows), '[]'::jsonb)
  union all select 'transform_preview_rows', (select count(*) from preview_rows)::int, {metrics["preview_rows"]}, '{{}}'::jsonb
  union all select 'preview_ready_rows', (select count(*) from preview_rows where mapping_status = 'ready')::int, {metrics["ready_rows"]}, '{{}}'::jsonb
  union all select 'preview_needs_review_rows', (select count(*) from preview_rows where mapping_status = 'needs_review')::int, {metrics["needs_review_rows"]}, coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku, 'raw_name', raw_name, 'target_category', target_category, 'target_subcategory', target_subcategory, 'review_notes', review_notes) order by supplier_sku) from preview_rows where mapping_status = 'needs_review'), '[]'::jsonb)
  union all select 'preview_blocked_rows', (select count(*) from preview_rows where mapping_status = 'blocked')::int, {metrics["blocked_rows"]}, coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku, 'raw_name', raw_name, 'warning_flags', warning_flags) order by supplier_sku) from preview_rows where mapping_status = 'blocked'), '[]'::jsonb)
  union all select 'manual_confirmed_category_rows', (select count(*) from preview_rows where mapping_rule_id = 'gfl_manual_confirmed_category')::int, {metrics["manual_confirmed_rows"]}, '{{}}'::jsonb
  union all select 'keyword_cleanup_ready_rows', (select count(*) from preview_rows where mapping_status = 'ready' and mapping_rule_id like 'product_keyword_cleanup:%')::int, {metrics["keyword_cleanup_ready_rows"]}, '{{}}'::jsonb
  union all select 'keyword_cleanup_needs_review_rows', (select count(*) from preview_rows where mapping_status = 'needs_review' and mapping_rule_id like 'product_keyword_cleanup:%')::int, {metrics["keyword_cleanup_needs_review_rows"]}, '{{}}'::jsonb
  union all select 'category_mapping_rows', (select count(*) from preview_rows where mapping_rule_id like 'category_mapping_v4:%')::int, {metrics["category_mapping_rows"]}, '{{}}'::jsonb
  union all select 'odgp_normalized_rows', (select count(*) from preview_rows where supplier_sku = {sql_string(ODGP_NORMALIZED_SKU)} and preview_json ->> 'raw_supplier_sku' = {sql_string(ODGP_RAW_SKU)})::int, {metrics["odgp_normalized_rows"]}, '{{}}'::jsonb
  union all select 'preview_duplicate_supplier_skus', (select count(*) from duplicate_preview_skus)::int, 0, coalesce((select jsonb_agg(to_jsonb(duplicate_preview_skus) order by supplier_sku) from duplicate_preview_skus), '[]'::jsonb)
  union all select 'preview_missing_page_role', (select count(*) from preview_rows where nullif(trim(coalesce(page_role, '')), '') is null)::int, 0, '{{}}'::jsonb
  union all select 'preview_ready_missing_target', (select count(*) from preview_rows where mapping_status = 'ready' and (target_category is null or target_subcategory is null))::int, 0, '{{}}'::jsonb
  union all select 'preview_non_local_stock', (select count(*) from preview_rows where fulfillment <> 'local_stock')::int, 0, '{{}}'::jsonb
  union all select 'preview_bad_lead_time', (select count(*) from preview_rows where lead_time_min_days <> 10 or lead_time_max_days <> 12 or lead_time_unit <> 'business_days' or lead_time_basis <> 'decorated')::int, 0, '{{}}'::jsonb
  union all select 'preview_products_table_rows_created', 0::int, 0, '{{}}'::jsonb
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
    metrics = local_metrics()
    if metrics["raw_rows"] != EXPECTED_RAW_PRODUCTS:
        raise ValueError(metrics)
    if metrics["preview_rows"] != EXPECTED_PREVIEW_ROWS:
        raise ValueError(metrics)
    if metrics["excluded_rows"] != EXPECTED_EXCLUDED_ROWS:
        raise ValueError(metrics)
    if metrics["blocked_rows"] != EXPECTED_BLOCKED_ROWS:
        raise ValueError(metrics)
    if metrics["manual_confirmed_rows"] != EXPECTED_MANUAL_CONFIRMED_ROWS:
        raise ValueError(metrics)
    sql = build_sql(metrics)
    check_sql = build_check_sql(metrics)
    validate_insert_columns(sql)
    validate_insert_columns(check_sql)
    lowered = sql.lower()
    for forbidden in ("insert into public.products", "update public.products", "public.url_pages", "public.navigation"):
        if forbidden in lowered:
            raise ValueError(f"Forbidden publish target in transform preview SQL: {forbidden}")
    OUTPUT_SQL.write_text(sql, encoding="utf-8")
    OUTPUT_CHECK_SQL.write_text(check_sql, encoding="utf-8")
    print(f"Wrote {OUTPUT_SQL}")
    print(f"Wrote {OUTPUT_CHECK_SQL}")
    print(json.dumps(metrics, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
