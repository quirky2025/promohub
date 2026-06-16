#!/usr/bin/env python3
"""Generate a DRAFT INSERT (and READONLY check) to add one product_colours row
to the 28 Gear For Life draft products that currently have none.

Colour NAME only -- hex is left NULL (use the product's own colour, no swatch hex).

Source of truth: the user's reviewed CSV (assigned colour per supplier_sku).
Write-safety:
  * scoped to supplier = 'Gear For Life'
  * idempotent: only inserts where the product has zero product_colours rows
  * single SELECT-driven INSERT; no UPDATE / DELETE / DDL
"""
import csv
from pathlib import Path
from collections import Counter

HERE = Path(__file__).resolve().parent
SRC = HERE / "gear for life assigned_colour_name.csv"
OUT_INSERT = HERE / "gear_for_life_missing_colours_fix_INSERT_DRAFT.sql"
OUT_CHECK = HERE / "gear_for_life_missing_colours_fix_check_READONLY.sql"

SUPPLIER = "Gear For Life"
ALLOWED = {"Natural", "Clear", "Silver", "White"}
SKU_COL = 0
COLOUR_COL = 10  # raw_colour_names_from_colour_options (reused by user for the decision)

def sq(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"

def main() -> None:
    with open(SRC, newline="", encoding="utf-8-sig") as fh:
        rows = [r for r in csv.reader(fh)]
    data = [r for r in rows[1:] if any(c.strip() for c in r)]
    items = []
    for r in data:
        sku = r[SKU_COL].strip()
        colour = r[COLOUR_COL].strip()
        if not sku or not colour:
            raise ValueError(f"Missing sku/colour: {r}")
        if colour not in ALLOWED:
            raise ValueError(f"Unexpected colour '{colour}' for {sku}")
        items.append((sku, colour))
    if len(items) != 28:
        raise ValueError(f"Expected 28 rows, got {len(items)}")
    skus = [i[0] for i in items]
    if len(set(skus)) != len(skus):
        raise ValueError("Duplicate supplier_sku in input")

    values = ",\n".join(f"  ({sq(sku)}, {sq(colour)})" for sku, colour in items)

    insert_sql = f"""-- Gear For Life: ADD missing product_colours (one per product) -- DRAFT, WRITE OPERATION.
-- Generated from: {SRC.name}
-- Purpose: give each of the 28 GFL draft products that had NO product_colours rows
--          a single reviewed colour name (Natural / Clear / Silver / White).
--          hex is intentionally left NULL (use the product's own colour, no swatch hex).
--
-- SAFETY:
--   * Scoped to supplier = '{SUPPLIER}'.
--   * Idempotent: only inserts where the product currently has ZERO product_colours rows,
--     so re-running will not create duplicates.
--   * One statement, INSERT ... SELECT only. No UPDATE / DELETE / DDL.
--
-- Run inside a transaction so you can BEGIN; ...; verify; COMMIT/ROLLBACK.

insert into public.product_colours (
  product_id,
  name,
  hex,
  sort_order
)
select
  p.id,
  v.colour_name,
  null::text as hex,
  1 as sort_order
from (values
{values}
) as v(supplier_sku, colour_name)
join public.products p
  on p.supplier_sku = v.supplier_sku
 and p.supplier = {sq(SUPPLIER)}
where not exists (
  select 1
  from public.product_colours pc
  where pc.product_id = p.id
);
"""
    OUT_INSERT.write_text(insert_sql, encoding="utf-8")

    check_sql = f"""-- Gear For Life: check colours after the missing-colours fix.
-- READ ONLY. Run after gear_for_life_missing_colours_fix_INSERT_DRAFT.sql.

with
params as (
  select {sq(SUPPLIER)}::text as target_supplier
),
expected(supplier_sku, colour_name) as (
  values
{values}
),
gfl_products as (
  select id, supplier_sku, name
  from public.products
  where supplier = (select target_supplier from params)
),
colour_counts as (
  select p.id, p.supplier_sku,
         count(pc.id)::int as colour_count
  from gfl_products p
  left join public.product_colours pc on pc.product_id = p.id
  group by p.id, p.supplier_sku
),
target_now as (
  select e.supplier_sku, e.colour_name as expected_colour,
         cc.colour_count,
         pc.name as actual_colour, pc.hex as actual_hex
  from expected e
  join gfl_products p on p.supplier_sku = e.supplier_sku
  join colour_counts cc on cc.id = p.id
  left join public.product_colours pc on pc.product_id = p.id
),
mismatches as (
  select * from target_now
  where colour_count <> 1
     or actual_colour is distinct from expected_colour
),
checks as (
  select 'expected_target_products' as check_name,
         (select count(*) from expected)::int as actual_value,
         28::int as expected_value, '{{}}'::jsonb as details
  union all select 'products_with_exactly_one_colour',
         (select count(*) from target_now where colour_count = 1)::int, 28,
         '{{}}'::jsonb
  union all select 'colour_name_mismatches',
         (select count(*) from mismatches)::int, 0,
         coalesce((select jsonb_agg(to_jsonb(mismatches) order by supplier_sku) from mismatches), '[]'::jsonb)
  union all select 'gfl_products_still_missing_colours',
         (select count(*) from colour_counts where colour_count = 0)::int, 0,
         coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku) order by supplier_sku)
                   from colour_counts where colour_count = 0), '[]'::jsonb)
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by case when actual_value = expected_value then 2 else 1 end, check_name;
"""
    OUT_CHECK.write_text(check_sql, encoding="utf-8")

    c = Counter(i[1] for i in items)
    print("rows:", len(items), "| colour counts:", dict(c), "| hex: NULL for all")
    print("wrote:", OUT_INSERT.name)
    print("wrote:", OUT_CHECK.name)

if __name__ == "__main__":
    main()
