from __future__ import annotations

import csv
import json
import re
from decimal import Decimal
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "outputs" / "supplier_import_foundation" / "gear_for_life_pilot"

CORRECTIONS_CSV = OUT_DIR / "gear_for_life_product_specific_branding_corrections_DRAFT.csv"
OPTIONS_PREVIEW_CSV = OUT_DIR / "gear_for_life_branding_options_FROM_XLSX_PREVIEW.csv"
PRICE_ROWS_PREVIEW_CSV = OUT_DIR / "gear_for_life_branding_price_rows_FROM_XLSX_PREVIEW.csv"
SCHEMA_SQL = ROOT / "outputs" / "supplier_import_foundation" / "supplier_staging_schema_DRAFT.sql"

OUTPUT_SQL = OUT_DIR / "gear_for_life_staging_corrections_DRAFT.sql"
OUTPUT_CHECK_SQL = OUT_DIR / "gear_for_life_staging_corrections_check_READONLY.sql"

SUPPLIER = "Gear For Life"
SOURCE_FILE_HASH = "f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c"

LEAD_TIME_NOTE = "10-12 business days after artwork approval"
LEAD_TIME_MIN_DAYS = 10
LEAD_TIME_MAX_DAYS = 12
LEAD_TIME_UNIT = "business_days"
LEAD_TIME_BASIS = "decorated"

EXPECTED_RAW_PRODUCTS = 472
EXPECTED_RAW_COLOURS = 892
EXPECTED_RAW_IMAGES = 2416
EXPECTED_PRODUCT_PRICE_ROWS = 773
EXPECTED_RATE_CARDS = 2
EXPECTED_RATE_CARD_ROWS = 160

EXPECTED_COVERAGE = {
    "coverage_product_specific": 75,
    "coverage_transfer_printing_bags_fallback": 63,
    "coverage_embroidery_apparel_scope": 290,
    "coverage_request_quote_fallback": 44,
    "coverage_orphan": 0,
}

TIER_COLUMNS = [
    ("tier_1_plus", 1),
    ("tier_10_plus", 10),
    ("tier_25_49_or_25_plus", 25),
    ("tier_50_99_or_50_plus", 50),
    ("tier_100_249_or_100_plus", 100),
    ("tier_250_plus", 250),
    ("tier_500_plus", 500),
]

OPTION_COLUMNS = [
    "supplier",
    "supplier_sku",
    "decoration_option_key",
    "decoration_method",
    "decoration_area",
    "decoration_location",
    "artwork_size_label",
    "max_width_mm",
    "max_height_mm",
    "size_unit",
    "max_colours",
    "pricing_model",
    "price_status",
    "setup_cost",
    "repeat_setup_cost",
    "setup_cost_label",
    "run_cost",
    "additional_colour_policy",
    "lead_time",
    "lead_time_min_days",
    "lead_time_max_days",
    "lead_time_unit",
    "lead_time_basis",
    "lead_time_note",
    "raw_json",
]

OPTION_CASTS = {
    "supplier": "text",
    "supplier_sku": "text",
    "decoration_option_key": "text",
    "decoration_method": "text",
    "decoration_area": "text",
    "decoration_location": "text",
    "artwork_size_label": "text",
    "max_width_mm": "numeric",
    "max_height_mm": "numeric",
    "size_unit": "text",
    "max_colours": "int",
    "pricing_model": "text",
    "price_status": "text",
    "setup_cost": "numeric",
    "repeat_setup_cost": "numeric",
    "setup_cost_label": "text",
    "run_cost": "numeric",
    "additional_colour_policy": "text",
    "lead_time": "text",
    "lead_time_min_days": "int",
    "lead_time_max_days": "int",
    "lead_time_unit": "text",
    "lead_time_basis": "text",
    "lead_time_note": "text",
    "raw_json": "jsonb",
}

PRICE_VALUE_COLUMNS = [
    "supplier",
    "supplier_sku",
    "decoration_option_key",
    "decoration_method",
    "decoration_area",
    "decoration_location",
    "artwork_size_label",
    "currency",
    "min_qty",
    "max_qty",
    "unit_cost",
    "setup_cost",
    "repeat_setup_cost",
    "pricing_basis",
    "price_status",
    "raw_json",
]

PRICE_CASTS = {
    "supplier": "text",
    "supplier_sku": "text",
    "decoration_option_key": "text",
    "decoration_method": "text",
    "decoration_area": "text",
    "decoration_location": "text",
    "artwork_size_label": "text",
    "currency": "text",
    "min_qty": "int",
    "max_qty": "int",
    "unit_cost": "numeric",
    "setup_cost": "numeric",
    "repeat_setup_cost": "numeric",
    "pricing_basis": "text",
    "price_status": "text",
    "raw_json": "jsonb",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    last_error: UnicodeDecodeError | None = None
    for encoding in ("utf-8-sig", "cp1252"):
        try:
            with path.open("r", encoding=encoding, newline="") as f:
                reader = csv.DictReader(f)
                rows: list[dict[str, str]] = []
                for raw_row in reader:
                    row: dict[str, str] = {}
                    for key, value in raw_row.items():
                        if key is None:
                            continue
                        normalized_key = key.strip()
                        if normalized_key:
                            row[normalized_key] = (value or "").strip()
                    rows.append(row)
                return rows
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


def slugify(value: str | None, fallback: str) -> str:
    text = (value or "").lower().strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    return text or fallback


def parse_num(value: str | None) -> str | None:
    text = clean_text(value)
    if not text:
        return None
    text = text.replace("$", "").replace(",", "").strip()
    if not re.fullmatch(r"-?\d+(\.\d+)?", text):
        return None
    return text


def money_label(value: str | None) -> str | None:
    parsed = parse_num(value)
    if parsed is None:
        return None
    return f"{Decimal(parsed):.2f}"


def is_poa(value: str | None) -> bool:
    return (value or "").strip().upper() == "POA"


def sql_string(value: str | None) -> str:
    text = clean_text(value)
    if text is None:
        return "null"
    return "'" + text.replace("'", "''") + "'"


def sql_int(value: int | str | None) -> str:
    if isinstance(value, int):
        return str(value)
    text = clean_text(value)
    if text is None:
        return "null"
    text = re.sub(r"[^0-9-]", "", text)
    if not text or text == "-":
        return "null"
    return str(int(text))


def sql_num(value: str | None) -> str:
    parsed = parse_num(value)
    return "null" if parsed is None else parsed


def sql_jsonb(value: object) -> str:
    text = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return sql_string(text) + "::jsonb"


def tuple_sql(values: Iterable[str]) -> str:
    return "(" + ", ".join(values) + ")"


def parse_dimensions(row: dict[str, str]) -> tuple[str | None, str | None]:
    source = clean_text(row.get("artwork_size_label")) or clean_text(row.get("decoration_area")) or ""
    match = re.search(r"(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)\s*mm", source)
    if match:
        return match.group(1), match.group(2)
    diameter = re.search(r"(\d+(?:\.\d+)?)\s*mm\s*(?:dia|diameter)", source, flags=re.IGNORECASE)
    if diameter:
        return diameter.group(1), diameter.group(1)
    return None, None


def decoration_location(row: dict[str, str]) -> str | None:
    area = clean_text(row.get("decoration_area"))
    method = (row.get("decoration_method") or "").lower()
    if not area:
        return None
    if method.startswith("transfer printing") and re.fullmatch(r"\d+\s*[xX]\s*\d+\s*mm", area):
        return "Full Colour Transfer"
    location = re.split(r"\s+-\s+", area, maxsplit=1)[0]
    location = re.sub(r"\s+max\s+\d.*$", "", location, flags=re.IGNORECASE).strip()
    return location or area


def decoration_option_key(row: dict[str, str]) -> str:
    sku = slugify(row.get("supplier_sku"), "sku")
    method = slugify(row.get("decoration_method"), "method")
    area = slugify(row.get("decoration_area"), "area")
    size = slugify(row.get("artwork_size_label"), "")
    parts = [sku, method, area]
    if size and size != area:
        parts.append(size)
    return "|".join(parts)


def max_colours(method: str | None) -> str:
    match = re.search(r"(\d+)\s*colou?r", method or "", flags=re.IGNORECASE)
    return match.group(1) if match else "null"


def pricing_basis(method: str | None) -> str:
    text = (method or "").lower()
    if "screen print" in text or "pad print" in text:
        return "per_colour_position"
    if "laser" in text:
        return "per_position"
    return "per_unit"


def tier_max_qty(method: str | None, min_qty: int) -> int | None:
    text = (method or "").lower()
    if text.startswith("transfer printing"):
        return {25: 49, 50: 99, 100: 249}.get(min_qty)
    return None


def option_price_status(row: dict[str, str]) -> str:
    tier_values = [clean_text(row.get(column)) for column, _ in TIER_COLUMNS]
    tier_values = [value for value in tier_values if value]
    if tier_values and all(is_poa(value) for value in tier_values):
        return "request_quote"
    return "priced"


def option_pricing_model(row: dict[str, str]) -> str:
    return "quote_required" if option_price_status(row) == "request_quote" else "sku_location_qty"


def setup_label(row: dict[str, str]) -> str | None:
    setup = money_label(row.get("setup_cost"))
    if setup is None:
        return None
    return f"Setup ${setup}"


def option_rows(correction_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    for source_row_number, row in enumerate(correction_rows, start=2):
        width, height = parse_dimensions(row)
        key = decoration_option_key(row)
        raw_json = {
            **row,
            "source": "manual_review_product_specific_branding_correction",
            "source_file": CORRECTIONS_CSV.name,
            "source_row_number": source_row_number,
            "supplier_specific": True,
        }
        out.append(
            {
                "supplier": SUPPLIER,
                "supplier_sku": row["supplier_sku"],
                "decoration_option_key": key,
                "decoration_method": row["decoration_method"],
                "decoration_area": row["decoration_area"],
                "decoration_location": decoration_location(row) or "",
                "artwork_size_label": row.get("artwork_size_label", ""),
                "max_width_mm": width or "",
                "max_height_mm": height or "",
                "size_unit": "mm",
                "max_colours": max_colours(row.get("decoration_method")),
                "pricing_model": option_pricing_model(row),
                "price_status": option_price_status(row),
                "setup_cost": row.get("setup_cost", ""),
                "repeat_setup_cost": "",
                "setup_cost_label": setup_label(row) or "",
                "run_cost": "",
                "additional_colour_policy": row.get("packing_fee_note", ""),
                "lead_time": LEAD_TIME_NOTE,
                "lead_time_min_days": str(LEAD_TIME_MIN_DAYS),
                "lead_time_max_days": str(LEAD_TIME_MAX_DAYS),
                "lead_time_unit": LEAD_TIME_UNIT,
                "lead_time_basis": LEAD_TIME_BASIS,
                "lead_time_note": LEAD_TIME_NOTE,
                "raw_json": raw_json,
            }
        )
    return out


def price_rows(correction_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    for source_row_number, row in enumerate(correction_rows, start=2):
        key = decoration_option_key(row)
        for tier_column, min_qty in TIER_COLUMNS:
            raw_price = clean_text(row.get(tier_column))
            if raw_price is None:
                continue
            status = "request_quote" if is_poa(raw_price) else "priced"
            unit_cost = "" if status == "request_quote" else raw_price
            raw_json = {
                **row,
                "source": "manual_review_product_specific_branding_correction",
                "source_file": CORRECTIONS_CSV.name,
                "source_row_number": source_row_number,
                "tier_column": tier_column,
                "raw_price": raw_price,
                "supplier_specific": True,
            }
            out.append(
                {
                    "supplier": SUPPLIER,
                    "supplier_sku": row["supplier_sku"],
                    "decoration_option_key": key,
                    "decoration_method": row["decoration_method"],
                    "decoration_area": row["decoration_area"],
                    "decoration_location": decoration_location(row) or "",
                    "artwork_size_label": row.get("artwork_size_label", ""),
                    "currency": "AUD",
                    "min_qty": str(min_qty),
                    "max_qty": "" if tier_max_qty(row.get("decoration_method"), min_qty) is None else str(tier_max_qty(row.get("decoration_method"), min_qty)),
                    "unit_cost": unit_cost,
                    "setup_cost": row.get("setup_cost", ""),
                    "repeat_setup_cost": "",
                    "pricing_basis": pricing_basis(row.get("decoration_method")),
                    "price_status": status,
                    "raw_json": raw_json,
                }
            )
    return out


def row_to_sql_values(row: dict[str, str], columns: list[str]) -> list[str]:
    values: list[str] = []
    for column in columns:
        if column == "raw_json":
            values.append(sql_jsonb(row[column]))
        elif column in {"max_width_mm", "max_height_mm", "setup_cost", "repeat_setup_cost", "run_cost", "unit_cost"}:
            values.append(sql_num(row.get(column)))
        elif column in {"max_colours", "lead_time_min_days", "lead_time_max_days", "min_qty", "max_qty"}:
            values.append(sql_int(row.get(column)))
        else:
            values.append(sql_string(row.get(column)))
    return values


def values_sql(rows: list[dict[str, str]], columns: list[str]) -> str:
    return ",\n    ".join(tuple_sql(row_to_sql_values(row, columns)) for row in rows)


def sql_array(values: list[str]) -> str:
    return "array[" + ", ".join(sql_string(value) for value in values) + "]::text[]"


def select_cast_list(columns: list[str], casts: dict[str, str]) -> str:
    return ",\n  ".join(f"v.{column}::{casts[column]}" for column in columns)


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


def correction_metrics(
    old_options: list[dict[str, str]],
    old_prices: list[dict[str, str]],
    new_options: list[dict[str, str]],
    new_prices: list[dict[str, str]],
    affected_skus: list[str],
) -> dict[str, int]:
    affected = set(affected_skus)
    old_affected_options = [row for row in old_options if row.get("supplier_sku") in affected]
    old_affected_prices = [row for row in old_prices if row.get("supplier_sku") in affected]
    return {
        "old_total_options": len(old_options),
        "old_total_prices": len(old_prices),
        "old_affected_options": len(old_affected_options),
        "old_affected_prices": len(old_affected_prices),
        "new_options": len(new_options),
        "new_prices": len(new_prices),
        "new_total_options": len(old_options) - len(old_affected_options) + len(new_options),
        "new_total_prices": len(old_prices) - len(old_affected_prices) + len(new_prices),
        "new_request_quote_options": sum(1 for row in new_options if row["price_status"] == "request_quote"),
        "new_request_quote_prices": sum(1 for row in new_prices if row["price_status"] == "request_quote"),
        "new_priced_prices": sum(1 for row in new_prices if row["price_status"] == "priced"),
        "affected_skus": len(affected_skus),
        "new_options_with_packing_note": sum(1 for row in new_options if clean_text(row.get("additional_colour_policy"))),
        "new_options_with_setup_cost": sum(1 for row in new_options if clean_text(row.get("setup_cost"))),
    }


def build_correction_sql() -> tuple[str, dict[str, int], list[str]]:
    correction_source_rows = read_csv(CORRECTIONS_CSV)
    old_options = read_csv(OPTIONS_PREVIEW_CSV)
    old_prices = read_csv(PRICE_ROWS_PREVIEW_CSV)
    new_options = option_rows(correction_source_rows)
    new_prices = price_rows(correction_source_rows)
    affected_skus = sorted({row["supplier_sku"] for row in correction_source_rows})
    metrics = correction_metrics(old_options, old_prices, new_options, new_prices, affected_skus)
    affected_array = sql_array(affected_skus)

    if metrics["old_total_options"] != 273:
        raise ValueError(f"Expected 273 old option preview rows, saw {metrics['old_total_options']}")
    if metrics["old_total_prices"] != 1069:
        raise ValueError(f"Expected 1069 old price preview rows, saw {metrics['old_total_prices']}")
    if metrics["new_prices"] == 0:
        raise ValueError("No correction price rows generated")
    if any(row["price_status"] == "request_quote" and clean_text(row.get("unit_cost")) for row in new_prices):
        raise ValueError("Request quote correction row has a unit cost")
    if any(row["price_status"] == "priced" and not clean_text(row.get("unit_cost")) for row in new_prices):
        raise ValueError("Priced correction row is missing unit cost")

    option_insert_columns = ["batch_id", *OPTION_COLUMNS]
    price_insert_columns = [
        "batch_id",
        "supplier",
        "supplier_sku",
        "supplier_decoration_option_id",
        "decoration_option_key",
        "decoration_method",
        "decoration_area",
        "decoration_location",
        "artwork_size_label",
        "currency",
        "min_qty",
        "max_qty",
        "unit_cost",
        "setup_cost",
        "repeat_setup_cost",
        "pricing_basis",
        "price_status",
        "raw_json",
    ]

    sql = f"""-- Gear For Life STAGING CORRECTIONS - DRAFT
-- Purpose: replace confirmed product-specific decoration staging rows for 13 GFL SKUs.
-- Scope: supplier_decoration_options and supplier_decoration_price_rows only.
-- Not included: products, url_pages, navigation, transforms, or storefront publishing.
-- Run manually in Supabase only after reviewing this file.
-- Safety: guards stop if the raw load is incomplete, already corrected, or not in the expected state.

begin;

do $$
declare
  gfl_batch_id uuid;
  affected_skus text[] := {affected_array};
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch not found. Stop: run the raw load first.';
  end if;

  if (select count(*) from public.supplier_raw_product_rows where batch_id = gfl_batch_id) <> {EXPECTED_RAW_PRODUCTS} then
    raise exception 'Expected {EXPECTED_RAW_PRODUCTS} GFL raw product rows before correction.';
  end if;

  if (select count(*) from public.supplier_raw_colour_options where batch_id = gfl_batch_id) <> {EXPECTED_RAW_COLOURS} then
    raise exception 'Expected {EXPECTED_RAW_COLOURS} GFL raw colour rows before correction.';
  end if;

  if (select count(*) from public.supplier_raw_images where batch_id = gfl_batch_id) <> {EXPECTED_RAW_IMAGES} then
    raise exception 'Expected {EXPECTED_RAW_IMAGES} GFL raw image rows before correction.';
  end if;

  if (select count(*) from public.supplier_price_rows where batch_id = gfl_batch_id) <> {EXPECTED_PRODUCT_PRICE_ROWS} then
    raise exception 'Expected {EXPECTED_PRODUCT_PRICE_ROWS} GFL product price rows before correction.';
  end if;

  if (select count(*) from public.supplier_decoration_options where batch_id = gfl_batch_id) <> {metrics["old_total_options"]} then
    raise exception 'Expected {metrics["old_total_options"]} GFL decoration options before correction. Stop: maybe already corrected.';
  end if;

  if (select count(*) from public.supplier_decoration_price_rows where batch_id = gfl_batch_id) <> {metrics["old_total_prices"]} then
    raise exception 'Expected {metrics["old_total_prices"]} GFL decoration price rows before correction. Stop: maybe already corrected.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_cards where batch_id = gfl_batch_id) <> {EXPECTED_RATE_CARDS} then
    raise exception 'Expected {EXPECTED_RATE_CARDS} GFL decoration rate cards before correction.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_card_rows where batch_id = gfl_batch_id) <> {EXPECTED_RATE_CARD_ROWS} then
    raise exception 'Expected {EXPECTED_RATE_CARD_ROWS} GFL decoration rate card rows before correction.';
  end if;

  if (
    select count(*)
    from public.supplier_decoration_options
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(affected_skus)
  ) <> {metrics["old_affected_options"]} then
    raise exception 'Expected {metrics["old_affected_options"]} old affected decoration options. Stop: review current staging state.';
  end if;

  if (
    select count(*)
    from public.supplier_decoration_price_rows
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(affected_skus)
  ) <> {metrics["old_affected_prices"]} then
    raise exception 'Expected {metrics["old_affected_prices"]} old affected decoration price rows. Stop: review current staging state.';
  end if;

  if exists (
    select 1
    from public.supplier_decoration_price_rows
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and price_status = 'request_quote'
      and unit_cost is not null
  ) then
    raise exception 'Existing request_quote decoration price rows must have unit_cost null before correction.';
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
affected_skus as (
  select unnest({affected_array}) as supplier_sku
)
delete from public.supplier_decoration_price_rows p
using gfl_batch, affected_skus a
where p.batch_id = gfl_batch.batch_id
  and p.supplier = {sql_string(SUPPLIER)}
  and p.supplier_sku = a.supplier_sku;

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1
),
affected_skus as (
  select unnest({affected_array}) as supplier_sku
)
delete from public.supplier_decoration_options d
using gfl_batch, affected_skus a
where d.batch_id = gfl_batch.batch_id
  and d.supplier = {sql_string(SUPPLIER)}
  and d.supplier_sku = a.supplier_sku;

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1
)
insert into public.supplier_decoration_options (
  {", ".join(option_insert_columns)}
)
select
  gfl_batch.batch_id,
  {select_cast_list(OPTION_COLUMNS, OPTION_CASTS)}
from gfl_batch
cross join (
  values
    {values_sql(new_options, OPTION_COLUMNS)}
) as v({", ".join(OPTION_COLUMNS)});

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1
)
insert into public.supplier_decoration_price_rows (
  {", ".join(price_insert_columns)}
)
select
  gfl_batch.batch_id,
  v.supplier::text,
  v.supplier_sku::text,
  d.id,
  v.decoration_option_key::text,
  v.decoration_method::text,
  v.decoration_area::text,
  v.decoration_location::text,
  v.artwork_size_label::text,
  v.currency::text,
  v.min_qty::int,
  v.max_qty::int,
  v.unit_cost::numeric,
  v.setup_cost::numeric,
  v.repeat_setup_cost::numeric,
  v.pricing_basis::text,
  v.price_status::text,
  v.raw_json::jsonb
from gfl_batch
cross join (
  values
    {values_sql(new_prices, PRICE_VALUE_COLUMNS)}
) as v({", ".join(PRICE_VALUE_COLUMNS)})
join public.supplier_decoration_options d
  on d.batch_id = gfl_batch.batch_id
 and d.supplier = v.supplier::text
 and d.supplier_sku = v.supplier_sku::text
 and d.decoration_option_key = v.decoration_option_key::text;

do $$
declare
  gfl_batch_id uuid;
  affected_skus text[] := {affected_array};
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(SOURCE_FILE_HASH)}
  order by created_at desc
  limit 1;

  if (select count(*) from public.supplier_decoration_options where batch_id = gfl_batch_id) <> {metrics["new_total_options"]} then
    raise exception 'Post-correction decoration option total mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_price_rows where batch_id = gfl_batch_id) <> {metrics["new_total_prices"]} then
    raise exception 'Post-correction decoration price row total mismatch.';
  end if;

  if (
    select count(*)
    from public.supplier_decoration_options
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(affected_skus)
  ) <> {metrics["new_options"]} then
    raise exception 'Post-correction affected decoration option count mismatch.';
  end if;

  if (
    select count(*)
    from public.supplier_decoration_price_rows
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(affected_skus)
  ) <> {metrics["new_prices"]} then
    raise exception 'Post-correction affected decoration price row count mismatch.';
  end if;

  if exists (
    select 1
    from public.supplier_decoration_price_rows
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(affected_skus)
      and price_status = 'request_quote'
      and unit_cost is not null
  ) then
    raise exception 'POA/request_quote correction rows must have unit_cost null.';
  end if;

  if exists (
    select 1
    from public.supplier_decoration_price_rows
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(affected_skus)
      and price_status = 'priced'
      and unit_cost is null
  ) then
    raise exception 'Priced correction rows must have a unit_cost.';
  end if;

  if exists (
    select 1
    from public.supplier_decoration_price_rows
    where batch_id = gfl_batch_id
      and supplier = {sql_string(SUPPLIER)}
      and supplier_sku = any(affected_skus)
      and supplier_decoration_option_id is null
  ) then
    raise exception 'Correction price rows must be linked to supplier_decoration_options.';
  end if;
end $$;

commit;

-- After this succeeds, run:
-- outputs/supplier_import_foundation/gear_for_life_pilot/gear_for_life_staging_corrections_check_READONLY.sql
-- Then send the result screenshot for review before any transform/update draft is generated.
"""
    return sql, metrics, affected_skus


def build_check_sql(metrics: dict[str, int], affected_skus: list[str]) -> str:
    affected_array = sql_array(affected_skus)
    return f"""-- Gear For Life staging corrections check.
-- READ ONLY. Run after gear_for_life_staging_corrections_DRAFT.sql succeeds.
-- Coverage rows are per source product row, not distinct SKU.

with params as (
  select
    {sql_string(SUPPLIER)}::text as target_supplier,
    {sql_string(SOURCE_FILE_HASH)}::text as target_source_file_hash,
    {affected_array} as affected_skus
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
  select 'batch' as check_name, (select count(*) from gfl_batch)::int as actual_value, 1::int as expected_value, '{{}}'::jsonb as details
  union all select 'raw_products', (select count(*) from raw_rows)::int, {EXPECTED_RAW_PRODUCTS}, '{{}}'::jsonb
  union all select 'colours', (select count(*) from raw_colours)::int, {EXPECTED_RAW_COLOURS}, '{{}}'::jsonb
  union all select 'images', (select count(*) from raw_images)::int, {EXPECTED_RAW_IMAGES}, '{{}}'::jsonb
  union all select 'product_price_rows', (select count(*) from product_price_rows)::int, {EXPECTED_PRODUCT_PRICE_ROWS}, '{{}}'::jsonb
  union all select 'decoration_options_total', (select count(*) from decoration_options)::int, {metrics["new_total_options"]}, '{{}}'::jsonb
  union all select 'decoration_price_rows_total', (select count(*) from decoration_price_rows)::int, {metrics["new_total_prices"]}, '{{}}'::jsonb
  union all select 'rate_cards', (select count(*) from rate_cards)::int, {EXPECTED_RATE_CARDS}, '{{}}'::jsonb
  union all select 'rate_card_rows', (select count(*) from rate_card_rows)::int, {EXPECTED_RATE_CARD_ROWS}, '{{}}'::jsonb
  union all select 'corrected_skus', (select count(distinct supplier_sku) from affected_options)::int, {metrics["affected_skus"]}, '{{}}'::jsonb
  union all select 'corrected_decoration_options', (select count(*) from affected_options)::int, {metrics["new_options"]}, '{{}}'::jsonb
  union all select 'corrected_decoration_price_rows', (select count(*) from affected_price_rows)::int, {metrics["new_prices"]}, '{{}}'::jsonb
  union all select 'corrected_request_quote_price_rows', (select count(*) from affected_price_rows where price_status = 'request_quote')::int, {metrics["new_request_quote_prices"]}, '{{}}'::jsonb
  union all select 'corrected_priced_price_rows', (select count(*) from affected_price_rows where price_status = 'priced')::int, {metrics["new_priced_prices"]}, '{{}}'::jsonb
  union all select 'request_quote_rows_with_unit_cost', (select count(*) from affected_price_rows where price_status = 'request_quote' and unit_cost is not null)::int, 0, '{{}}'::jsonb
  union all select 'priced_rows_missing_unit_cost', (select count(*) from affected_price_rows where price_status = 'priced' and unit_cost is null)::int, 0, '{{}}'::jsonb
  union all select 'raw_poa_rows_with_non_null_unit_cost', (select count(*) from affected_price_rows where raw_json ->> 'raw_price' = 'POA' and unit_cost is not null)::int, 0, '{{}}'::jsonb
  union all select 'corrected_price_rows_without_option', (select count(*) from correction_price_rows_without_option)::int, 0, '{{}}'::jsonb
  union all select 'corrected_duplicate_option_keys', (select count(*) from duplicate_option_keys)::int, 0, coalesce((select jsonb_agg(to_jsonb(duplicate_option_keys)) from duplicate_option_keys), '[]'::jsonb)
  union all select 'corrected_options_with_packing_note', (select count(*) from affected_options where nullif(trim(coalesce(raw_json ->> 'packing_fee_note', '')), '') is not null)::int, {metrics["new_options_with_packing_note"]}, '{{}}'::jsonb
  union all select 'corrected_options_with_setup_cost', (select count(*) from affected_options where setup_cost is not null)::int, {metrics["new_options_with_setup_cost"]}, '{{}}'::jsonb
  union all select 'corrected_options_ex_gst', (select count(*) from affected_options where raw_json ->> 'gst_note' = 'ex_gst')::int, {metrics["new_options"]}, '{{}}'::jsonb
  union all select 'corrected_options_branding_only', (select count(*) from affected_options where raw_json ->> 'cost_scope' = 'branding_only')::int, {metrics["new_options"]}, '{{}}'::jsonb
  union all select 'coverage_product_specific', (select count(*) from coverage where coverage_bucket = 'coverage_product_specific')::int, {EXPECTED_COVERAGE["coverage_product_specific"]}, '{{}}'::jsonb
  union all select 'coverage_transfer_printing_bags_fallback', (select count(*) from coverage where coverage_bucket = 'coverage_transfer_printing_bags_fallback')::int, {EXPECTED_COVERAGE["coverage_transfer_printing_bags_fallback"]}, '{{}}'::jsonb
  union all select 'coverage_embroidery_apparel_scope', (select count(*) from coverage where coverage_bucket = 'coverage_embroidery_apparel_scope')::int, {EXPECTED_COVERAGE["coverage_embroidery_apparel_scope"]}, '{{}}'::jsonb
  union all select 'coverage_request_quote_fallback', (select count(*) from coverage where coverage_bucket = 'coverage_request_quote_fallback')::int, {EXPECTED_COVERAGE["coverage_request_quote_fallback"]}, '{{}}'::jsonb
  union all select 'coverage_sum_equals_raw_products', (select count(*) from coverage)::int, {EXPECTED_RAW_PRODUCTS}, '{{}}'::jsonb
  union all select 'coverage_orphan', (select count(*) from coverage where coverage_bucket is null)::int, {EXPECTED_COVERAGE["coverage_orphan"]}, '{{}}'::jsonb
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
    correction_sql, metrics, affected_skus = build_correction_sql()
    check_sql = build_check_sql(metrics, affected_skus)
    validate_insert_columns(correction_sql)
    validate_insert_columns(check_sql)
    if "public.products" in correction_sql.lower() or "public.url_pages" in correction_sql.lower():
        raise ValueError("Correction SQL touched a publish table unexpectedly")
    OUTPUT_SQL.write_text(correction_sql, encoding="utf-8")
    OUTPUT_CHECK_SQL.write_text(check_sql, encoding="utf-8")
    print(f"Wrote {OUTPUT_SQL}")
    print(f"Wrote {OUTPUT_CHECK_SQL}")
    print(json.dumps(metrics, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
