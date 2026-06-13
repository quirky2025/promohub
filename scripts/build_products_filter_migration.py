from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "outputs" / "product_filter_requirements"

OUT_DRY_RUN = OUT_DIR / "products_filter_fields_dry_run.sql"
OUT_FINAL = OUT_DIR / "products_filter_fields_FINAL.sql"
OUT_RUN_ORDER = OUT_DIR / "url_pages_and_products_run_order.md"
OUT_VALIDATION = OUT_DIR / "products_filter_fields_sql_validation.json"
OUT_VALIDATION_MD = OUT_DIR / "products_filter_fields_sql_validation.md"


DRY_RUN_SQL = """-- Products filter fields dry run
-- Safe to run. This file does not write data.
-- Purpose: check current products table readiness for url_pages product_filter.

with required_columns(column_name) as (
  values
    ('material_tags'),
    ('tags'),
    ('fulfillment'),
    ('is_australian_made'),
    ('offer_type'),
    ('kit_themes'),
    ('kit_components'),
    ('related_categories'),
    ('pack_size'),
    ('supplier'),
    ('supplier_raw_category_path')
),
column_status as (
  select
    r.column_name,
    case when c.column_name is null then false else true end as exists_now,
    c.data_type,
    c.udt_name,
    c.is_nullable,
    c.column_default
  from required_columns r
  left join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = 'products'
   and c.column_name = r.column_name
),
required_constraints(constraint_name) as (
  values
    ('products_fulfillment_check'),
    ('products_offer_type_check'),
    ('products_pack_size_check')
),
constraint_status as (
  select
    r.constraint_name,
    case when tc.constraint_name is null then false else true end as exists_now
  from required_constraints r
  left join information_schema.table_constraints tc
    on tc.table_schema = 'public'
   and tc.table_name = 'products'
   and tc.constraint_name = r.constraint_name
),
required_indexes(indexname) as (
  values
    ('idx_products_category_published'),
    ('idx_products_subcategory_published'),
    ('idx_products_material_tags'),
    ('idx_products_tags'),
    ('idx_products_kit_themes'),
    ('idx_products_offer_type'),
    ('idx_products_fulfillment')
),
index_status as (
  select
    r.indexname,
    case when i.indexname is null then false else true end as exists_now
  from required_indexes r
  left join pg_indexes i
    on i.schemaname = 'public'
   and i.tablename = 'products'
   and i.indexname = r.indexname
)
select 'missing_columns' as check_name, count(*)::text as result
from column_status where exists_now = false
union all
select 'missing_constraints', count(*)::text
from constraint_status where exists_now = false
union all
select 'missing_indexes', count(*)::text
from index_status where exists_now = false
union all
select 'products_table_exists',
  case when to_regclass('public.products') is null then 'false' else 'true' end;

-- Detail: missing columns/constraints/indexes.
with required_columns(column_name) as (
  values
    ('material_tags'), ('tags'), ('fulfillment'), ('is_australian_made'),
    ('offer_type'), ('kit_themes'), ('kit_components'), ('related_categories'),
    ('pack_size'), ('supplier'), ('supplier_raw_category_path')
),
column_status as (
  select r.column_name, c.column_name is not null as exists_now
  from required_columns r
  left join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = 'products'
   and c.column_name = r.column_name
),
required_constraints(constraint_name) as (
  values ('products_fulfillment_check'), ('products_offer_type_check'), ('products_pack_size_check')
),
constraint_status as (
  select r.constraint_name, tc.constraint_name is not null as exists_now
  from required_constraints r
  left join information_schema.table_constraints tc
    on tc.table_schema = 'public'
   and tc.table_name = 'products'
   and tc.constraint_name = r.constraint_name
),
required_indexes(indexname) as (
  values
    ('idx_products_category_published'), ('idx_products_subcategory_published'),
    ('idx_products_material_tags'), ('idx_products_tags'), ('idx_products_kit_themes'),
    ('idx_products_offer_type'), ('idx_products_fulfillment')
),
index_status as (
  select r.indexname, i.indexname is not null as exists_now
  from required_indexes r
  left join pg_indexes i
    on i.schemaname = 'public'
   and i.tablename = 'products'
   and i.indexname = r.indexname
)
select 'missing_column' as issue, column_name as name from column_status where exists_now = false
union all
select 'missing_constraint', constraint_name from constraint_status where exists_now = false
union all
select 'missing_index', indexname from index_status where exists_now = false
order by issue, name;
"""


FINAL_SQL = """-- Products filter fields FINAL migration
-- Purpose:
--   Support url_pages product_filter, Kits & Bundles, supplier imports, and SEO filter pages.
--
-- Run order:
--   1. products_filter_fields_dry_run.sql
--   2. products_filter_fields_FINAL.sql
--   3. url_pages_seed_READY_dry_run.sql
--   4. url_pages_seed_READY_upsert.sql
--
-- This migration is additive. It does not delete rows or remove existing fields.

begin;

alter table public.products
  add column if not exists material_tags text[],
  add column if not exists tags text[],
  add column if not exists fulfillment text,
  add column if not exists is_australian_made boolean,
  add column if not exists offer_type text,
  add column if not exists kit_themes text[],
  add column if not exists kit_components jsonb,
  add column if not exists related_categories text[],
  add column if not exists pack_size int,
  add column if not exists supplier text,
  add column if not exists supplier_raw_category_path text;

update public.products
set
  material_tags = coalesce(material_tags, '{}'::text[]),
  tags = coalesce(tags, '{}'::text[]),
  fulfillment = coalesce(fulfillment, 'local_stock'),
  is_australian_made = coalesce(is_australian_made, false),
  offer_type = coalesce(offer_type, 'single_product'),
  kit_themes = coalesce(kit_themes, '{}'::text[]),
  kit_components = coalesce(kit_components, '[]'::jsonb),
  related_categories = coalesce(related_categories, '{}'::text[]);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'indent_type'
  ) then
    execute $sql$
      update public.products
      set fulfillment = case
        when indent_type = 'indent_air' then 'indent_air'
        when indent_type = 'indent_sea' then 'indent_sea'
        else fulfillment
      end
      where indent_type is not null
        and fulfillment = 'local_stock'
    $sql$;
  end if;
end $$;

alter table public.products
  alter column material_tags set default '{}'::text[],
  alter column material_tags set not null,
  alter column tags set default '{}'::text[],
  alter column tags set not null,
  alter column fulfillment set default 'local_stock',
  alter column fulfillment set not null,
  alter column is_australian_made set default false,
  alter column is_australian_made set not null,
  alter column offer_type set default 'single_product',
  alter column offer_type set not null,
  alter column kit_themes set default '{}'::text[],
  alter column kit_themes set not null,
  alter column kit_components set default '[]'::jsonb,
  alter column kit_components set not null,
  alter column related_categories set default '{}'::text[],
  alter column related_categories set not null;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'products'
      and constraint_name = 'products_fulfillment_check'
  ) then
    alter table public.products
      add constraint products_fulfillment_check
      check (fulfillment in ('local_stock','indent_air','indent_sea','custom_sourcing'));
  end if;

  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'products'
      and constraint_name = 'products_offer_type_check'
  ) then
    alter table public.products
      add constraint products_offer_type_check
      check (offer_type in ('single_product','prebuilt_kit','prebuilt_bundle','gift_set','hamper','custom_kit_template'));
  end if;

  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'products'
      and constraint_name = 'products_pack_size_check'
  ) then
    alter table public.products
      add constraint products_pack_size_check
      check (pack_size is null or pack_size > 0);
  end if;
end $$;

create index if not exists idx_products_category_published
  on public.products(category)
  where is_published = true;

create index if not exists idx_products_subcategory_published
  on public.products(category, subcategory)
  where is_published = true;

create index if not exists idx_products_material_tags
  on public.products using gin(material_tags);

create index if not exists idx_products_tags
  on public.products using gin(tags);

create index if not exists idx_products_kit_themes
  on public.products using gin(kit_themes);

create index if not exists idx_products_offer_type
  on public.products(offer_type)
  where is_published = true;

create index if not exists idx_products_fulfillment
  on public.products(fulfillment);

commit;
"""


RUN_ORDER_MD = """# URL Pages + Products Migration Run Order

Do not run the `url_pages` seed before the product filter support fields are ready. The seed can exist first, but the frontend will only be able to resolve all filters when products have the needed fields.

## Recommended Order

1. Run `products_filter_fields_dry_run.sql`
   - This is read-only.
   - It shows missing columns, constraints and indexes.

2. Run `products_filter_fields_FINAL.sql`
   - Additive migration only.
   - Adds fields for material/tag filters, Kits & Bundles, fulfilment and supplier traceability.
   - Does not delete rows or drop columns.

3. Run `url_pages_seed_READY_dry_run.sql`
   - This is read-only.
   - Confirms READY seed has no duplicate slug, reserved slug conflict, enum error or broken breadcrumb.

4. Run `url_pages_seed_READY_upsert.sql`
   - Upserts 176 rows into `public.url_pages`.
   - Does not delete existing rows.

## Why Products Fields First?

`url_pages.product_filter` includes:

- category/subcategory filters: already supported by `products.category` and `products.subcategory`
- material filters: need `products.material_tags`
- Workwear/Teamwear filters: need `products.tags`
- Kits & Bundles filters: need `products.offer_type` and `products.kit_themes`

If the seed is inserted before these fields exist, the URL rows can still be stored, but product listing queries for Kits & Bundles and SEO filter pages cannot be implemented cleanly.

## Fields Added By Products Migration

- `material_tags text[]`
- `tags text[]`
- `fulfillment text`
- `is_australian_made boolean`
- `offer_type text`
- `kit_themes text[]`
- `kit_components jsonb`
- `related_categories text[]`
- `pack_size int`
- `supplier text`
- `supplier_raw_category_path text`
"""


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DRY_RUN.write_text(DRY_RUN_SQL, encoding="utf-8")
    OUT_FINAL.write_text(FINAL_SQL, encoding="utf-8")
    OUT_RUN_ORDER.write_text(RUN_ORDER_MD, encoding="utf-8")

    final_lower = FINAL_SQL.lower()
    dry_lower = DRY_RUN_SQL.lower()
    validation = {
        "dry_run_sql": str(OUT_DRY_RUN),
        "final_sql": str(OUT_FINAL),
        "run_order": str(OUT_RUN_ORDER),
        "dry_run_writes_data": any(token in dry_lower for token in ["insert into", "update public", "delete from", "truncate", "alter table", "create index"]),
        "final_has_begin_commit": "begin;" in final_lower and "commit;" in final_lower,
        "final_destructive_tokens": [
            token for token in ["delete from", "truncate", "drop table", "drop column"]
            if token in final_lower
        ],
        "final_adds_columns": FINAL_SQL.count("add column if not exists"),
        "final_creates_indexes": FINAL_SQL.count("create index if not exists"),
        "final_named_constraints": [
            "products_fulfillment_check",
            "products_offer_type_check",
            "products_pack_size_check",
        ],
    }
    OUT_VALIDATION.write_text(json.dumps(validation, indent=2), encoding="utf-8")

    md = f"""# Products Filter Fields SQL Validation

## Result

| Check | Result |
|---|---:|
| Dry-run writes data | {validation["dry_run_writes_data"]} |
| FINAL has begin/commit | {validation["final_has_begin_commit"]} |
| FINAL destructive tokens | {len(validation["final_destructive_tokens"])} |
| Columns added with IF NOT EXISTS | {validation["final_adds_columns"]} |
| Indexes created with IF NOT EXISTS | {validation["final_creates_indexes"]} |
| Named check constraints | {len(validation["final_named_constraints"])} |

## Generated Files

- `products_filter_fields_dry_run.sql`
- `products_filter_fields_FINAL.sql`
- `url_pages_and_products_run_order.md`
- `products_filter_fields_sql_validation.json`
"""
    OUT_VALIDATION_MD.write_text(md, encoding="utf-8")
    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
