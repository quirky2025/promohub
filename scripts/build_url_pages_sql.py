from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
READY_DIR = ROOT / "outputs" / "url_pages_ready"
SEED_JSON = READY_DIR / "url_pages_seed_READY.json"

OUT_DRY_RUN = READY_DIR / "url_pages_seed_READY_dry_run.sql"
OUT_UPSERT = READY_DIR / "url_pages_seed_READY_upsert.sql"
OUT_VALIDATION = READY_DIR / "url_pages_seed_READY_sql_validation.md"
OUT_VALIDATION_JSON = READY_DIR / "url_pages_seed_READY_sql_validation.json"

SEED_RECORDSET = """(
  slug text,
  page_type text,
  source_type text,
  source_label text,
  primary_keyword text,
  title text,
  h1 text,
  nav_label text,
  home_label text,
  meta_description text,
  canonical_url text,
  product_filter jsonb,
  seo_content text,
  faq jsonb,
  hero_image text,
  status text,
  priority int,
  show_in_home boolean,
  show_in_nav boolean,
  show_in_footer boolean,
  breadcrumb_parent text,
  related_urls jsonb,
  noindex boolean
)"""

URL_COLUMNS = [
    "slug",
    "page_type",
    "source_type",
    "source_label",
    "primary_keyword",
    "title",
    "h1",
    "nav_label",
    "home_label",
    "meta_description",
    "canonical_url",
    "product_filter",
    "seo_content",
    "faq",
    "hero_image",
    "status",
    "priority",
    "show_in_home",
    "show_in_nav",
    "show_in_footer",
    "breadcrumb_parent",
    "related_urls",
    "noindex",
]

RESERVED_SLUGS = [
    "cart",
    "checkout",
    "account",
    "login",
    "register",
    "about",
    "contact",
    "blog",
    "admin",
    "api",
    "search",
    "quote",
    "sourcing-quote",
    "brands",
    "products",
    "supply-chain",
    "sustainability",
    "new-arrivals",
    "sale",
    "custom-sourcing",
    "air-freight-sourcing",
    "sea-freight-sourcing",
    "product-development",
    "warehousing-and-fulfilment",
    "merch-store",
]


def sql_seed_cte(seed_text: str) -> str:
    return f"""seed_json as (
  select $url_seed$
{seed_text}
$url_seed$::jsonb as data
),
seed as (
  select *
  from jsonb_to_recordset((select data from seed_json)) as x
{SEED_RECORDSET}
)"""


def build_dry_run(seed_text: str) -> str:
    reserved_array = ", ".join(f"'{slug}'" for slug in RESERVED_SLUGS)
    cte = sql_seed_cte(seed_text)
    return f"""-- QuirkyPromo url_pages READY seed dry run
-- Generated from outputs/url_pages_ready/url_pages_seed_READY.json
-- Safe to run before upsert. This file does not write data.

with
{cte},
slug_counts as (
  select slug, count(*) as count
  from seed
  group by slug
  having count(*) > 1
),
breadcrumb_missing as (
  select s.slug, s.breadcrumb_parent
  from seed s
  left join seed parent on parent.slug = s.breadcrumb_parent
  where s.breadcrumb_parent is not null
    and parent.slug is null
),
reserved_conflicts as (
  select slug
  from seed
  where split_part(slug, '/', 1) = any(array[{reserved_array}])
),
enum_errors as (
  select slug, 'page_type' as field, page_type as value
  from seed
  where page_type not in ('product_category','collection','landing','brand','service')
  union all
  select slug, 'source_type' as field, source_type as value
  from seed
  where source_type not in ('category','subcategory','collection','brand','manual')
  union all
  select slug, 'status' as field, status as value
  from seed
  where status not in ('draft','live','redirected')
),
canonical_errors as (
  select slug, canonical_url
  from seed
  where canonical_url <> '/' || slug
),
summary as (
  select 'seed_rows' as check_name, count(*)::text as result from seed
  union all select 'duplicate_slugs', count(*)::text from slug_counts
  union all select 'reserved_slug_conflicts', count(*)::text from reserved_conflicts
  union all select 'missing_breadcrumb_parents', count(*)::text from breadcrumb_missing
  union all select 'enum_errors', count(*)::text from enum_errors
  union all select 'canonical_errors', count(*)::text from canonical_errors
  union all select 'existing_url_pages_matches', count(*)::text
    from public.url_pages u join seed s on s.slug = u.slug
)
select * from summary order by check_name;

-- Detail checks. Each should return zero rows before upsert.
with
{cte},
slug_counts as (
  select slug, count(*) as count
  from seed
  group by slug
  having count(*) > 1
),
breadcrumb_missing as (
  select s.slug, s.breadcrumb_parent
  from seed s
  left join seed parent on parent.slug = s.breadcrumb_parent
  where s.breadcrumb_parent is not null
    and parent.slug is null
),
reserved_conflicts as (
  select slug
  from seed
  where split_part(slug, '/', 1) = any(array[{reserved_array}])
),
enum_errors as (
  select slug, 'page_type' as field, page_type as value
  from seed
  where page_type not in ('product_category','collection','landing','brand','service')
  union all
  select slug, 'source_type' as field, source_type as value
  from seed
  where source_type not in ('category','subcategory','collection','brand','manual')
  union all
  select slug, 'status' as field, status as value
  from seed
  where status not in ('draft','live','redirected')
  union all
  select slug, 'canonical_url' as field, canonical_url as value
  from seed
  where canonical_url <> '/' || slug
)
select 'duplicate_slug' as issue, slug, count::text as detail from slug_counts
union all
select 'reserved_conflict' as issue, slug, '' as detail from reserved_conflicts
union all
select 'missing_breadcrumb_parent' as issue, slug, breadcrumb_parent as detail from breadcrumb_missing
union all
select 'enum_or_canonical_error' as issue, slug, field || '=' || value as detail from enum_errors
order by issue, slug;
"""


def build_upsert(seed_text: str) -> str:
    cte = sql_seed_cte(seed_text)
    columns_sql = ",\n    ".join(URL_COLUMNS)
    select_sql = ",\n    ".join(URL_COLUMNS)
    update_sql = ",\n    ".join(
        f"{column} = excluded.{column}"
        for column in URL_COLUMNS
        if column != "slug"
    )
    return f"""-- QuirkyPromo url_pages READY seed upsert
-- Generated from outputs/url_pages_ready/url_pages_seed_READY.json
-- Review and run dry-run SQL first:
--   outputs/url_pages_ready/url_pages_seed_READY_dry_run.sql
--
-- This upserts by slug. It does not delete any existing url_pages rows.

begin;

with
{cte},
upserted as (
  insert into public.url_pages (
    {columns_sql}
  )
  select
    {select_sql}
  from seed
  on conflict (slug) do update set
    {update_sql}
  returning slug, page_type, source_type, status
)
select
  count(*) as upserted_rows,
  count(*) filter (where page_type = 'product_category') as product_category_rows,
  count(*) filter (where page_type = 'collection') as collection_rows,
  count(*) filter (where page_type = 'landing') as landing_rows
from upserted;

commit;
"""


def main() -> None:
    seed = json.loads(SEED_JSON.read_text(encoding="utf-8"))
    seed_text = json.dumps(seed, ensure_ascii=False, indent=2)
    if "$url_seed$" in seed_text:
        raise RuntimeError("Seed JSON contains the SQL dollar quote tag.")

    OUT_DRY_RUN.write_text(build_dry_run(seed_text), encoding="utf-8")
    OUT_UPSERT.write_text(build_upsert(seed_text), encoding="utf-8")

    validation = {
        "seed_rows": len(seed),
        "dry_run_sql": str(OUT_DRY_RUN),
        "upsert_sql": str(OUT_UPSERT),
        "columns": URL_COLUMNS,
        "has_commit_in_upsert": "commit;" in OUT_UPSERT.read_text(encoding="utf-8").lower(),
        "dry_run_writes_data": any(
            word in OUT_DRY_RUN.read_text(encoding="utf-8").lower()
            for word in ["insert into", "update public", "delete from", "truncate"]
        ),
    }
    OUT_VALIDATION_JSON.write_text(json.dumps(validation, indent=2), encoding="utf-8")

    md = f"""# url_pages READY SQL Validation

## Result

| Check | Result |
|---|---:|
| Seed rows embedded | {len(seed)} |
| Dry-run writes data | {validation["dry_run_writes_data"]} |
| Upsert includes commit | {validation["has_commit_in_upsert"]} |
| Column count | {len(URL_COLUMNS)} |

## Generated Files

- `url_pages_seed_READY_dry_run.sql`
- `url_pages_seed_READY_upsert.sql`
- `url_pages_seed_READY_sql_validation.json`

## Run Order Later

1. Run `url_pages_seed_READY_dry_run.sql`.
2. Confirm detail checks return zero rows.
3. Run `url_pages_seed_READY_upsert.sql`.

The upsert SQL does not delete existing rows. It inserts or updates by `slug`.
"""
    OUT_VALIDATION.write_text(md, encoding="utf-8")
    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
