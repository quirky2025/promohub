from __future__ import annotations

import csv
import hashlib
import json
import re
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "outputs" / "supplier_import_foundation" / "gear_for_life_pilot"

PRODUCT_CSV = Path(
    r"C:\Users\jilin\Desktop\supplier\gearforlife\The Source - 1st June 2026 APPA Data file - for Customers.csv"
)

OPTIONS_CSV = OUT_DIR / "gear_for_life_branding_options_FROM_XLSX_PREVIEW.csv"
PRICE_ROWS_CSV = OUT_DIR / "gear_for_life_branding_price_rows_FROM_XLSX_PREVIEW.csv"
RATE_CARDS_CSV = OUT_DIR / "gear_for_life_branding_general_rate_cards_FROM_XLSX_PREVIEW.csv"
RATE_CARD_ROWS_CSV = OUT_DIR / "gear_for_life_branding_general_rate_card_rows_FROM_XLSX_PREVIEW.csv"

OUTPUT_SQL = OUT_DIR / "gear_for_life_raw_load_INSERT_DRAFT.sql"
SCHEMA_SQL = ROOT / "outputs" / "supplier_import_foundation" / "supplier_staging_schema_DRAFT.sql"

SUPPLIER = "Gear For Life"
FULFILLMENT_DEFAULT = "local_stock"
LEAD_TIME_NOTE = "10-12 business days after artwork approval"
LEAD_TIME_MIN_DAYS = 10
LEAD_TIME_MAX_DAYS = 12
LEAD_TIME_UNIT = "business_days"
LEAD_TIME_BASIS = "decorated"


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
                        if not normalized_key:
                            continue
                        row[normalized_key] = (value or "").strip()
                    out.append(row)
                return out
        except UnicodeDecodeError as exc:
            last_error = exc
    if last_error:
        raise last_error
    return []


def file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def combined_hash(paths: Iterable[Path]) -> str:
    h = hashlib.sha256()
    for path in paths:
        h.update(path.name.encode("utf-8"))
        h.update(b"\0")
        h.update(file_sha256(path).encode("utf-8"))
        h.update(b"\0")
    return h.hexdigest()


def clean_text(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    if not value:
        return None
    return value.replace("\r\n", "\n").replace("\r", "\n")


def split_pipe(value: str | None) -> list[str]:
    text = clean_text(value)
    if not text:
        return []
    return [part.strip() for part in text.split("|") if part.strip()]


def slugify(value: str | None, fallback: str) -> str:
    text = (value or "").lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or fallback


def parse_int(value: str | None) -> int | None:
    text = clean_text(value)
    if not text:
        return None
    text = re.sub(r"[^0-9-]", "", text)
    if not text or text == "-":
        return None
    return int(text)


def parse_num(value: str | None) -> str | None:
    text = clean_text(value)
    if not text:
        return None
    text = text.replace("$", "").replace(",", "").strip()
    if not re.fullmatch(r"-?\d+(\.\d+)?", text):
        return None
    return text


def sql_string(value: str | None) -> str:
    text = clean_text(value)
    if text is None:
        return "null"
    return "'" + text.replace("'", "''") + "'"


def sql_int(value: int | str | None) -> str:
    if isinstance(value, int):
        return str(value)
    parsed = parse_int(value)
    return "null" if parsed is None else str(parsed)


def sql_num(value: str | None) -> str:
    parsed = parse_num(value)
    return "null" if parsed is None else parsed


def sql_bool(value: bool | str | None) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    text = (value or "").strip().lower()
    if text in {"true", "t", "yes", "y", "1"}:
        return "true"
    if text in {"false", "f", "no", "n", "0"}:
        return "false"
    return "null"


def sql_jsonb(value: object) -> str:
    text = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return sql_string(text) + "::jsonb"


def tuple_sql(values: list[str]) -> str:
    return "(" + ", ".join(values) + ")"


def insert_with_batch(
    table: str,
    columns: list[str],
    rows: list[list[str]],
    source_hash: str,
    chunk_size: int = 80,
) -> str:
    if not rows:
        return f"-- No rows for {table}.\n"

    chunks: list[str] = []
    value_columns = [col for col in columns if col != "batch_id"]
    insert_columns = ["batch_id", *value_columns]
    for row_index, row in enumerate(rows, start=1):
        if len(row) != len(value_columns):
            raise ValueError(
                f"{table} row {row_index} has {len(row)} values but {len(value_columns)} value columns"
            )
    for i in range(0, len(rows), chunk_size):
        chunk = rows[i : i + chunk_size]
        values_sql = ",\n    ".join(tuple_sql(row) for row in chunk)
        chunks.append(
            f"""with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(source_hash)}
  order by created_at desc
  limit 1
)
insert into public.{table} (
  {", ".join(insert_columns)}
)
select
  gfl_batch.batch_id,
  v.{", v.".join(value_columns)}
from gfl_batch
cross join (
  values
    {values_sql}
) as v({", ".join(value_columns)});
"""
        )
    return "\n".join(chunks)


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


def raw_category(row: dict[str, str]) -> tuple[str | None, str | None, str | None]:
    cat1 = clean_text(row.get("Categorisation"))
    cat2 = clean_text(row.get("category_ /_ sub category"))
    parts = [part for part in (cat1, cat2) if part]
    return cat1, cat2, " / ".join(parts) if parts else None


def product_rows(rows: list[dict[str, str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for idx, row in enumerate(rows, start=2):
        cat1, cat2, cat_path = raw_category(row)
        indent_only = (row.get("indent_only") or "").strip().lower() in {"yes", "true", "1", "y"}
        fulfillment = "indent" if indent_only else FULFILLMENT_DEFAULT
        raw_json = {
            **row,
            "_source_file": PRODUCT_CSV.name,
            "_source_row_number": idx,
            "_lead_time_normalized": {
                "min_days": LEAD_TIME_MIN_DAYS,
                "max_days": LEAD_TIME_MAX_DAYS,
                "unit": LEAD_TIME_UNIT,
                "basis": LEAD_TIME_BASIS,
                "note": LEAD_TIME_NOTE,
            },
        }
        out.append(
            [
                sql_string(SUPPLIER),
                sql_int(idx),
                sql_string(row.get("product_code")),
                sql_string(row.get("product_code_group")),
                sql_string(row.get("appa_product_code")),
                sql_string(row.get("product_name")),
                sql_string(row.get("product_description")),
                sql_string(row.get("brand_name")),
                sql_string(cat_path),
                sql_string(cat1),
                sql_string(cat2),
                "null",
                "null",
                sql_string(row.get("colours_available_supplier")),
                sql_string(row.get("colour_product_codes")),
                sql_string(row.get("product_materials")),
                sql_string(row.get("MOQ")),
                sql_string(LEAD_TIME_NOTE),
                sql_int(LEAD_TIME_MIN_DAYS),
                sql_int(LEAD_TIME_MAX_DAYS),
                sql_string(LEAD_TIME_UNIT),
                sql_string(LEAD_TIME_BASIS),
                sql_string(LEAD_TIME_NOTE),
                sql_string(fulfillment),
                "null",
                "null",
                sql_string(row.get("discontinued_stock")),
                sql_jsonb(raw_json),
            ]
        )
    return out


def colour_rows(rows: list[dict[str, str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for idx, row in enumerate(rows, start=2):
        supplier_sku = row.get("product_code")
        supplier_colours = split_pipe(row.get("colours_available_supplier"))
        appa_colours = split_pipe(row.get("colours_available_appa"))
        colour_codes = split_pipe(row.get("colour_product_codes"))
        for sort_order, supplier_colour in enumerate(supplier_colours, start=1):
            appa_colour = appa_colours[sort_order - 1] if sort_order - 1 < len(appa_colours) else None
            colour_code = colour_codes[sort_order - 1] if sort_order - 1 < len(colour_codes) else None
            colour_key = f"{slugify(supplier_colour or appa_colour, f'colour-{sort_order}')}-{sort_order}"
            raw_json = {
                "supplier_colour": supplier_colour,
                "appa_colour": appa_colour,
                "colour_product_code": colour_code,
                "source_row_number": idx,
            }
            out.append(
                [
                    sql_string(SUPPLIER),
                    sql_string(supplier_sku),
                    sql_string(colour_key),
                    sql_string(supplier_colour),
                    sql_string(colour_code),
                    "null",
                    sql_int(sort_order),
                    sql_jsonb(raw_json),
                ]
            )
    return out


def image_rows(rows: list[dict[str, str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for idx, row in enumerate(rows, start=2):
        supplier_sku = row.get("product_code")
        supplier_colours = split_pipe(row.get("colours_available_supplier"))
        colour_keys = [f"{slugify(colour, f'colour-{i}')}-{i}" for i, colour in enumerate(supplier_colours, start=1)]
        image_sort = 1

        def add_image(filename: str | None, role: str, field_name: str, colour_key: str | None = None) -> None:
            nonlocal image_sort
            cleaned = clean_text(filename)
            if not cleaned:
                return
            colour_name = None
            if colour_key and colour_key in colour_keys:
                colour_name = supplier_colours[colour_keys.index(colour_key)]
            out.append(
                [
                    sql_string(SUPPLIER),
                    sql_string(supplier_sku),
                    sql_string(cleaned),
                    sql_string(role),
                    sql_string(colour_key),
                    sql_string(colour_name),
                    sql_string(cleaned),
                    sql_int(image_sort),
                    sql_jsonb(
                        {
                            "source_field": field_name,
                            "source_filename": cleaned,
                            "source_row_number": idx,
                        }
                    ),
                ]
            )
            image_sort += 1

        add_image(row.get("product_image_file_name"), "main", "product_image_file_name")
        for filename in split_pipe(row.get("alternate_views_image_file_names")):
            add_image(filename, "gallery", "alternate_views_image_file_names")
        add_image(row.get("group_image_file_name"), "gallery", "group_image_file_name")
        for image_index, filename in enumerate(split_pipe(row.get("colour_image_file_names")), start=1):
            colour_key = colour_keys[image_index - 1] if image_index - 1 < len(colour_keys) else None
            add_image(filename, "swatch", "colour_image_file_names", colour_key)
    return out


def product_price_rows(rows: list[dict[str, str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for idx, row in enumerate(rows, start=2):
        supplier_sku = row.get("product_code")
        price_label_parts = [
            clean_text(row.get("price_decoration_description")),
            clean_text(row.get("price_by_size")),
            clean_text(row.get("price_by_colour")),
        ]
        price_label = " | ".join(part for part in price_label_parts if part)
        for tier_index in range(1, 9):
            qty = parse_int(row.get(f"qty_{tier_index}"))
            unit_cost = parse_num(row.get(f"price_{tier_index}"))
            if qty is None or unit_cost is None:
                continue
            out.append(
                [
                    sql_string(SUPPLIER),
                    sql_string(supplier_sku),
                    sql_string("AUD"),
                    sql_int(qty),
                    "null",
                    unit_cost,
                    "null",
                    sql_string(price_label),
                    sql_jsonb(
                        {
                            "source_row_number": idx,
                            "tier_index": tier_index,
                            "qty": qty,
                            "unit_cost": unit_cost,
                            "price_product_code": clean_text(row.get("price_product_code")),
                            "price_notes": clean_text(row.get("price_notes")),
                        }
                    ),
                ]
            )
    return out


def decoration_option_rows(rows: list[dict[str, str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for row in rows:
        out.append(
            [
                sql_string(SUPPLIER),
                sql_string(row.get("supplier_sku")),
                sql_string(row.get("decoration_option_key")),
                sql_string(row.get("decoration_method")),
                sql_string(row.get("decoration_area")),
                sql_string(row.get("decoration_location")),
                sql_string(row.get("artwork_size_label")),
                sql_num(row.get("max_width_mm")),
                sql_num(row.get("max_height_mm")),
                sql_string(row.get("size_unit") or "mm"),
                "null",
                sql_string(row.get("pricing_model")),
                sql_string(row.get("price_status")),
                sql_num(row.get("setup_cost")),
                sql_num(row.get("repeat_setup_cost")),
                sql_string(row.get("setup_cost_label")),
                "null",
                sql_string(row.get("additional_colour_policy")),
                sql_string(LEAD_TIME_NOTE),
                sql_int(LEAD_TIME_MIN_DAYS),
                sql_int(LEAD_TIME_MAX_DAYS),
                sql_string(LEAD_TIME_UNIT),
                sql_string(LEAD_TIME_BASIS),
                sql_string(LEAD_TIME_NOTE),
                sql_jsonb(row),
            ]
        )
    return out


def decoration_price_rows(rows: list[dict[str, str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for row in rows:
        price_status = clean_text(row.get("price_status")) or "priced"
        unit_cost = None if price_status == "request_quote" else row.get("unit_cost")
        out.append(
            [
                sql_string(SUPPLIER),
                sql_string(row.get("supplier_sku")),
                "null",
                sql_string(row.get("decoration_option_key")),
                sql_string(row.get("decoration_method")),
                sql_string(row.get("decoration_area")),
                sql_string(row.get("decoration_location")),
                sql_string(row.get("artwork_size_label")),
                sql_string(row.get("currency") or "AUD"),
                sql_int(row.get("min_qty")),
                sql_int(row.get("max_qty")),
                sql_num(unit_cost),
                sql_num(row.get("setup_cost")),
                sql_num(row.get("repeat_setup_cost")),
                sql_string(row.get("pricing_basis") or "per_unit"),
                sql_string(price_status),
                sql_jsonb(row),
            ]
        )
    return out


def rate_card_rows(rows: list[dict[str, str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for row in rows:
        out.append(
            [
                sql_string(SUPPLIER),
                sql_string(row.get("rate_card_key")),
                sql_string(row.get("decoration_method")),
                sql_string(row.get("applies_to")),
                sql_string(row.get("applies_to_category")),
                sql_string(row.get("applies_to_subcategory")),
                sql_bool(row.get("is_default_for_scope")),
                sql_string(row.get("fallback_policy") or "none"),
                sql_string(row.get("pricing_model")),
                sql_string(row.get("frontend_pricing_model") or "source_rate_card"),
                sql_int(row.get("supplier_formula_base_stitches")),
                sql_int(row.get("supplier_formula_stitch_increment")),
                sql_num(row.get("supplier_formula_increment_unit_cost")),
                sql_string(row.get("supplier_formula_note")),
                sql_num(row.get("setup_cost")),
                sql_num(row.get("repeat_setup_cost")),
                sql_num(row.get("surcharge_cost")),
                sql_string(row.get("surcharge_label")),
                sql_string(row.get("notes")),
                sql_jsonb(row),
            ]
        )
    return out


def rate_card_price_rows(rows: list[dict[str, str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for row in rows:
        price_status = clean_text(row.get("price_status")) or "priced"
        unit_cost = None if price_status == "request_quote" else row.get("unit_cost")
        out.append(
            [
                sql_string(SUPPLIER),
                sql_string(row.get("rate_card_key")),
                sql_string(row.get("decoration_method")),
                sql_string(row.get("applies_to")),
                sql_string(row.get("artwork_size_label")),
                sql_int(row.get("stitch_count_min")),
                sql_int(row.get("stitch_count_max")),
                sql_string(row.get("currency") or "AUD"),
                sql_int(row.get("min_qty")),
                sql_int(row.get("max_qty")),
                sql_num(unit_cost),
                sql_num(row.get("setup_cost")),
                sql_num(row.get("repeat_setup_cost")),
                "null",
                sql_string(row.get("surcharge_note")),
                sql_string(row.get("pricing_basis") or "per_unit"),
                sql_string(price_status),
                sql_jsonb(row),
            ]
        )
    return out


def build_sql() -> str:
    product_source_rows = read_csv(PRODUCT_CSV)
    option_source_rows = read_csv(OPTIONS_CSV)
    decoration_price_source_rows = read_csv(PRICE_ROWS_CSV)
    rate_card_source_rows = read_csv(RATE_CARDS_CSV)
    rate_card_price_source_rows = read_csv(RATE_CARD_ROWS_CSV)

    source_hash = combined_hash([PRODUCT_CSV, OPTIONS_CSV, PRICE_ROWS_CSV, RATE_CARDS_CSV, RATE_CARD_ROWS_CSV])
    product_source_hash = file_sha256(PRODUCT_CSV)
    unique_skus = len({row.get("product_code", "").strip() for row in product_source_rows if row.get("product_code", "").strip()})
    product_insert_rows = product_rows(product_source_rows)
    colour_insert_rows = colour_rows(product_source_rows)
    image_insert_rows = image_rows(product_source_rows)
    product_price_insert_rows = product_price_rows(product_source_rows)
    decoration_option_insert_rows = decoration_option_rows(option_source_rows)
    decoration_price_insert_rows = decoration_price_rows(decoration_price_source_rows)
    rate_card_insert_rows = rate_card_rows(rate_card_source_rows)
    rate_card_price_insert_rows = rate_card_price_rows(rate_card_price_source_rows)

    sections: list[str] = [
        """-- Gear For Life RAW STAGING LOAD - DRAFT
-- Purpose: insert Gear For Life source data into supplier staging tables only.
-- Scope: raw products, colours, images, unbranded product price rows, supplier-specific decoration options/price rows, and GFL commercial defaults.
-- Not included: products table transform, url_pages, navigation, redirects, or published storefront changes.
-- Safety: this script refuses to run if any existing Gear For Life staging rows are present.
-- Run manually in Supabase only after reviewing this file.
""",
        "begin;\n",
        f"""do $$
begin
  if exists (select 1 from public.supplier_import_batches where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_raw_product_rows where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_raw_colour_options where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_raw_images where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_price_rows where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_decoration_options where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_decoration_price_rows where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_decoration_rate_cards where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_decoration_rate_card_rows where supplier = {sql_string(SUPPLIER)})
     or exists (select 1 from public.supplier_commercial_defaults where supplier = {sql_string(SUPPLIER)})
  then
    raise exception 'Gear For Life staging rows already exist. Stop: do not run this load twice.';
  end if;
end $$;
""",
f"""insert into public.supplier_import_batches (
  supplier,
  source_file_name,
  source_file_hash,
  source_row_count,
  unique_sku_count,
  import_status,
  notes
) values (
  {sql_string(SUPPLIER)},
  {sql_string(PRODUCT_CSV.name)},
  {sql_string(source_hash)},
  {len(product_source_rows)},
  {unique_skus},
  {sql_string("loaded_raw")},
  {sql_string("Generated from GFL raw product CSV plus The Source Branding Price List - Combined.xlsx previews. Supplier-specific defaults only.")}
);

insert into public.supplier_commercial_defaults (
  supplier,
  fulfillment,
  lead_time_min_days,
  lead_time_max_days,
  lead_time_unit,
  lead_time_basis,
  lead_time_note,
  source_note,
  raw_json
) values (
  {sql_string(SUPPLIER)},
  {sql_string(FULFILLMENT_DEFAULT)},
  {LEAD_TIME_MIN_DAYS},
  {LEAD_TIME_MAX_DAYS},
  {sql_string(LEAD_TIME_UNIT)},
  {sql_string(LEAD_TIME_BASIS)},
  {sql_string(LEAD_TIME_NOTE)},
  {sql_string(LEAD_TIME_NOTE)},
  {sql_jsonb({"source": "supplier confirmed", "product_csv_sha256": product_source_hash, "supplier_specific": True})}
);
""",
    ]

    sections.append(
        insert_with_batch(
            "supplier_raw_product_rows",
            [
                "batch_id",
                "supplier",
                "source_row_number",
                "supplier_sku",
                "supplier_parent_sku",
                "supplier_product_id",
                "raw_name",
                "raw_description",
                "raw_brand",
                "raw_category_path",
                "raw_category_1",
                "raw_category_2",
                "raw_category_3",
                "raw_category_4",
                "raw_colour_name",
                "raw_colour_code",
                "raw_material",
                "raw_moq",
                "raw_lead_time",
                "lead_time_min_days",
                "lead_time_max_days",
                "lead_time_unit",
                "lead_time_basis",
                "lead_time_note",
                "raw_fulfillment",
                "raw_is_new",
                "raw_is_sale",
                "raw_is_discontinued",
                "raw_json",
            ],
            product_insert_rows,
            source_hash,
        )
    )
    sections.append(
        insert_with_batch(
            "supplier_raw_colour_options",
            [
                "batch_id",
                "supplier",
                "supplier_sku",
                "colour_key",
                "colour_name",
                "colour_code",
                "hex",
                "sort_order",
                "raw_json",
            ],
            colour_insert_rows,
            source_hash,
        )
    )
    sections.append(
        insert_with_batch(
            "supplier_raw_images",
            [
                "batch_id",
                "supplier",
                "supplier_sku",
                "image_url",
                "image_role",
                "colour_key",
                "colour_name",
                "source_image_id",
                "sort_order",
                "raw_json",
            ],
            image_insert_rows,
            source_hash,
        )
    )
    sections.append(
        insert_with_batch(
            "supplier_price_rows",
            [
                "batch_id",
                "supplier",
                "supplier_sku",
                "currency",
                "min_qty",
                "max_qty",
                "unit_cost",
                "setup_cost",
                "price_label",
                "raw_json",
            ],
            product_price_insert_rows,
            source_hash,
        )
    )
    sections.append(
        insert_with_batch(
            "supplier_decoration_options",
            [
                "batch_id",
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
            ],
            decoration_option_insert_rows,
            source_hash,
        )
    )
    sections.append(
        insert_with_batch(
            "supplier_decoration_price_rows",
            [
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
            ],
            decoration_price_insert_rows,
            source_hash,
        )
    )
    sections.append(
        insert_with_batch(
            "supplier_decoration_rate_cards",
            [
                "batch_id",
                "supplier",
                "rate_card_key",
                "decoration_method",
                "applies_to",
                "applies_to_category",
                "applies_to_subcategory",
                "is_default_for_scope",
                "fallback_policy",
                "pricing_model",
                "frontend_pricing_model",
                "supplier_formula_base_stitches",
                "supplier_formula_stitch_increment",
                "supplier_formula_increment_unit_cost",
                "supplier_formula_note",
                "setup_cost",
                "repeat_setup_cost",
                "surcharge_cost",
                "surcharge_label",
                "notes",
                "raw_json",
            ],
            rate_card_insert_rows,
            source_hash,
        )
    )
    sections.append(
        insert_with_batch(
            "supplier_decoration_rate_card_rows",
            [
                "batch_id",
                "supplier",
                "rate_card_key",
                "decoration_method",
                "applies_to",
                "artwork_size_label",
                "stitch_count_min",
                "stitch_count_max",
                "currency",
                "min_qty",
                "max_qty",
                "unit_cost",
                "setup_cost",
                "repeat_setup_cost",
                "surcharge_cost",
                "surcharge_label",
                "pricing_basis",
                "price_status",
                "raw_json",
            ],
            rate_card_price_insert_rows,
            source_hash,
        )
    )

    sections.append(
        f"""do $$
declare
  gfl_batch_id uuid;
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = {sql_string(SUPPLIER)}
    and source_file_hash = {sql_string(source_hash)}
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch row was not created.';
  end if;

  if (select count(*) from public.supplier_raw_product_rows where batch_id = gfl_batch_id) <> {len(product_source_rows)} then
    raise exception 'Gear For Life raw product row count mismatch.';
  end if;

  if (select count(*) from public.supplier_raw_colour_options where batch_id = gfl_batch_id) <> {len(colour_insert_rows)} then
    raise exception 'Gear For Life raw colour row count mismatch.';
  end if;

  if (select count(*) from public.supplier_raw_images where batch_id = gfl_batch_id) <> {len(image_insert_rows)} then
    raise exception 'Gear For Life raw image row count mismatch.';
  end if;

  if (select count(*) from public.supplier_price_rows where batch_id = gfl_batch_id) <> {len(product_price_insert_rows)} then
    raise exception 'Gear For Life product price row count mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_options where batch_id = gfl_batch_id) <> {len(decoration_option_insert_rows)} then
    raise exception 'Gear For Life decoration option row count mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_price_rows where batch_id = gfl_batch_id) <> {len(decoration_price_insert_rows)} then
    raise exception 'Gear For Life decoration price row count mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_cards where batch_id = gfl_batch_id) <> {len(rate_card_insert_rows)} then
    raise exception 'Gear For Life decoration rate card row count mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_card_rows where batch_id = gfl_batch_id) <> {len(rate_card_price_insert_rows)} then
    raise exception 'Gear For Life decoration rate card price row count mismatch.';
  end if;

  if exists (
    select 1
    from public.supplier_decoration_price_rows
    where batch_id = gfl_batch_id
      and price_status = 'request_quote'
      and unit_cost is not null
  ) then
    raise exception 'POA/request_quote decoration rows must have unit_cost null.';
  end if;
end $$;

commit;

-- After this succeeds, run:
-- outputs/supplier_import_foundation/gear_for_life_pilot/gear_for_life_pilot_preflight_READONLY.sql
-- Do not transform into products until the post-load checks are reviewed.
"""
    )
    return "\n".join(sections)


def main() -> None:
    sql = build_sql()
    validate_insert_columns(sql)
    OUTPUT_SQL.write_text(sql, encoding="utf-8")

    product_source_rows = read_csv(PRODUCT_CSV)
    option_source_rows = read_csv(OPTIONS_CSV)
    decoration_price_source_rows = read_csv(PRICE_ROWS_CSV)
    rate_card_source_rows = read_csv(RATE_CARDS_CSV)
    rate_card_price_source_rows = read_csv(RATE_CARD_ROWS_CSV)
    print(f"Wrote {OUTPUT_SQL}")
    print(f"raw products: {len(product_source_rows)}")
    print(f"unique skus: {len({row.get('product_code', '').strip() for row in product_source_rows if row.get('product_code', '').strip()})}")
    print(f"decoration options: {len(option_source_rows)}")
    print(f"decoration price rows: {len(decoration_price_source_rows)}")
    print(f"rate cards: {len(rate_card_source_rows)}")
    print(f"rate card rows: {len(rate_card_price_source_rows)}")


if __name__ == "__main__":
    main()
