from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
READY_SEED = ROOT / "outputs" / "url_pages_ready" / "url_pages_seed_READY.json"
OUT_DIR = ROOT / "outputs" / "product_filter_requirements"

OUT_SUMMARY = OUT_DIR / "product_filter_field_gap_summary.md"
OUT_FILTERS = OUT_DIR / "product_filter_requirements.csv"
OUT_GAPS = OUT_DIR / "products_field_gap_checklist.csv"
OUT_SQL = OUT_DIR / "products_filter_fields_DRAFT.sql"
OUT_VALIDATION = OUT_DIR / "product_filter_field_gap_validation.json"


# Inferred from current app/admin code reads. This is a code-level audit, not a live DB introspection.
EXISTING_OR_REFERENCED_FIELDS = {
    "id",
    "name",
    "slug",
    "supplier_sku",
    "category",
    "subcategory",
    "extra_subcategories",
    "brand",
    "collection",
    "is_eco",
    "is_new_arrival",
    "is_sale",
    "is_published",
    "indent_type",
    "status",
    "meta_title",
    "meta_description",
    "alt_text",
    "seo_description",
    "features",
    "dimensions",
    "materials",
    "capacity",
    "packing",
    "description",
    "min_qty",
    "colours",
    "secondary_colours",
    "size_chart",
}


FIELD_RECOMMENDATIONS = {
    "category": {
        "status": "exists",
        "reason": "Used by current category pages and category product_filter.",
        "suggestion": "Keep as primary product category.",
    },
    "subcategory": {
        "status": "exists",
        "reason": "Used by current subcategory pages and subcategory product_filter.",
        "suggestion": "Keep as primary product subcategory.",
    },
    "is_published": {
        "status": "exists",
        "reason": "Used by public listing queries.",
        "suggestion": "Keep as public visibility gate.",
    },
    "status": {
        "status": "exists",
        "reason": "Used by product/similar-product logic and admin.",
        "suggestion": "Keep; standardize active/inactive if needed.",
    },
    "is_eco": {
        "status": "exists",
        "reason": "Used by sustainability pages and eco-pens filter.",
        "suggestion": "Keep for broad eco filter.",
    },
    "brand": {
        "status": "exists",
        "reason": "Used by brand pages.",
        "suggestion": "Keep; later link to brands table through normalized brand_slug/brand_id.",
    },
    "collection": {
        "status": "exists",
        "reason": "Current collection pages use jsonb array contains.",
        "suggestion": "Keep for legacy collections; do not rely on it alone for Kits & Bundles.",
    },
    "materials": {
        "status": "exists_text_only",
        "reason": "Admin has materials text field, but url_pages compound filters need reliable material matching.",
        "suggestion": "Add material_tags text[]; keep materials as human-readable text.",
    },
    "material_tags": {
        "status": "missing_recommended",
        "reason": "Needed for Cotton Tote, Metal Pens, Plastic Pens and future material LPs.",
        "suggestion": "Add text[] generated/normalized by import rules.",
    },
    "tags": {
        "status": "missing_required_for_filters",
        "reason": "Workwear and Teamwear seo_filter_page use product_filter.tags.",
        "suggestion": "Add tags text[] for merch attributes/use-cases.",
    },
    "fulfillment": {
        "status": "missing_recommended",
        "reason": "Supplier import plan needs local_stock / indent_air / indent_sea / custom_sourcing. Existing indent_type is narrower.",
        "suggestion": "Add fulfillment text and optionally backfill from indent_type.",
    },
    "is_australian_made": {
        "status": "missing_recommended",
        "reason": "Australian Made is a valuable future filter/collection.",
        "suggestion": "Add boolean default false.",
    },
    "offer_type": {
        "status": "missing_required_for_kits",
        "reason": "Kits & Bundles product_filter uses offer_types.",
        "suggestion": "Add offer_type text default single_product.",
    },
    "kit_themes": {
        "status": "missing_required_for_kits",
        "reason": "Kits & Bundles product_filter uses kit_themes.",
        "suggestion": "Add kit_themes text[] default empty array.",
    },
    "kit_components": {
        "status": "missing_recommended_for_kits",
        "reason": "Needed to describe what a kit contains.",
        "suggestion": "Add kit_components jsonb default [] for supplier prebuilt and custom kit templates.",
    },
    "related_categories": {
        "status": "missing_recommended_for_kits",
        "reason": "Kits often combine Bags, Drinkware, Office, Packaging, etc.",
        "suggestion": "Add related_categories text[] default empty array.",
    },
    "pack_size": {
        "status": "missing_recommended",
        "reason": "Single-product multi-packs like 4 Pack Face Masks are not kits.",
        "suggestion": "Add pack_size int nullable for pack quantity.",
    },
    "supplier": {
        "status": "missing_recommended",
        "reason": "Four supplier imports need traceability and duplicate handling.",
        "suggestion": "Add supplier text or supplier_id depending on import model.",
    },
    "supplier_raw_category_path": {
        "status": "missing_recommended",
        "reason": "Useful for audit/debug after supplier import mapping.",
        "suggestion": "Add text or store in supplier import raw/staging table.",
    },
}


def read_seed() -> list[dict[str, Any]]:
    return json.loads(READY_SEED.read_text(encoding="utf-8"))


def write_csv(path: Path, rows: list[dict[str, Any]], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fields})


def filter_required_fields(product_filter: dict[str, Any]) -> set[str]:
    kind = product_filter.get("type")
    fields: set[str] = {"is_published"}
    if kind == "category":
        fields.add("category")
    elif kind == "subcategory":
        fields.update({"category", "subcategory"})
    elif kind == "compound":
        if product_filter.get("category"):
            fields.add("category")
        if product_filter.get("subcategory"):
            fields.add("subcategory")
        if product_filter.get("material"):
            fields.add("material_tags")
        if "is_eco" in product_filter:
            fields.add("is_eco")
        if product_filter.get("tags"):
            fields.add("tags")
        if product_filter.get("brand"):
            fields.add("brand")
    elif kind == "kit_collection":
        fields.update({"offer_type", "kit_themes"})
    elif kind == "kit_template":
        fields.update({"offer_type", "kit_themes", "kit_components", "related_categories"})
    elif kind == "brand":
        fields.add("brand")
    elif kind == "collection":
        fields.add("collection")
    elif kind == "manual":
        fields.add("id")
    return fields


def main() -> None:
    seed = read_seed()
    requirement_rows: list[dict[str, Any]] = []
    field_usage = Counter()
    filter_type_counts = Counter()
    missing_usage = Counter()

    for row in seed:
        product_filter = row.get("product_filter") or {}
        filter_type = product_filter.get("type", "none")
        filter_type_counts[filter_type] += 1
        fields = sorted(filter_required_fields(product_filter))
        for field in fields:
            field_usage[field] += 1
            rec = FIELD_RECOMMENDATIONS.get(field, {})
            status = rec.get("status", "unknown")
            if status.startswith("missing"):
                missing_usage[field] += 1
        requirement_rows.append(
            {
                "slug": row["slug"],
                "page_type": row["page_type"],
                "source_type": row["source_type"],
                "source_label": row["source_label"],
                "filter_type": filter_type,
                "required_product_fields": "; ".join(fields),
                "product_filter": json.dumps(product_filter, ensure_ascii=False, separators=(",", ":")),
            }
        )

    gap_rows: list[dict[str, Any]] = []
    for field, rec in FIELD_RECOMMENDATIONS.items():
        current = "referenced_in_code" if field in EXISTING_OR_REFERENCED_FIELDS else "not_seen_in_code"
        gap_rows.append(
            {
                "field": field,
                "current_code_signal": current,
                "recommendation_status": rec["status"],
                "used_by_ready_seed_pages": field_usage.get(field, 0),
                "reason": rec["reason"],
                "suggestion": rec["suggestion"],
            }
        )
    gap_rows.sort(key=lambda r: (0 if str(r["recommendation_status"]).startswith("missing") else 1, r["field"]))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    write_csv(
        OUT_FILTERS,
        requirement_rows,
        [
            "slug",
            "page_type",
            "source_type",
            "source_label",
            "filter_type",
            "required_product_fields",
            "product_filter",
        ],
    )
    write_csv(
        OUT_GAPS,
        gap_rows,
        [
            "field",
            "current_code_signal",
            "recommendation_status",
            "used_by_ready_seed_pages",
            "reason",
            "suggestion",
        ],
    )

    sql = """-- Products filter support fields DRAFT
-- Review only. Do not run until the url_pages table and product_filter resolver design are confirmed.
-- These additions support url_pages product_filter, supplier import traceability, and Kits & Bundles.

alter table public.products
  add column if not exists material_tags text[] not null default '{}',
  add column if not exists tags text[] not null default '{}',
  add column if not exists fulfillment text not null default 'local_stock'
    check (fulfillment in ('local_stock','indent_air','indent_sea','custom_sourcing')),
  add column if not exists is_australian_made boolean not null default false,
  add column if not exists offer_type text not null default 'single_product'
    check (offer_type in ('single_product','prebuilt_kit','prebuilt_bundle','gift_set','hamper','custom_kit_template')),
  add column if not exists kit_themes text[] not null default '{}',
  add column if not exists kit_components jsonb not null default '[]'::jsonb,
  add column if not exists related_categories text[] not null default '{}',
  add column if not exists pack_size int,
  add column if not exists supplier text,
  add column if not exists supplier_raw_category_path text;

-- Optional backfill from existing indent_type.
update public.products
set fulfillment = case
  when indent_type = 'indent_air' then 'indent_air'
  when indent_type = 'indent_sea' then 'indent_sea'
  else fulfillment
end
where indent_type is not null
  and fulfillment = 'local_stock';

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
"""
    OUT_SQL.write_text(sql, encoding="utf-8")

    missing_fields = [row for row in gap_rows if str(row["recommendation_status"]).startswith("missing")]
    required_missing = [
        row for row in missing_fields
        if str(row["recommendation_status"]) in {"missing_required_for_filters", "missing_required_for_kits"}
    ]

    validation = {
        "ready_seed_rows": len(seed),
        "filter_type_counts": dict(filter_type_counts),
        "field_usage_counts": dict(field_usage),
        "missing_usage_counts": dict(missing_usage),
        "missing_recommended_fields": [row["field"] for row in missing_fields],
        "required_missing_fields": [row["field"] for row in required_missing],
        "outputs": {
            "summary": str(OUT_SUMMARY),
            "requirements_csv": str(OUT_FILTERS),
            "gap_checklist_csv": str(OUT_GAPS),
            "draft_sql": str(OUT_SQL),
        },
    }
    OUT_VALIDATION.write_text(json.dumps(validation, indent=2), encoding="utf-8")

    def count_table(counter: Counter) -> str:
        return "\n".join(f"| {key} | {value} |" for key, value in counter.most_common()) or "| - | 0 |"

    missing_table = "\n".join(
        f"| {row['field']} | {row['recommendation_status']} | {row['used_by_ready_seed_pages']} | {row['suggestion']} |"
        for row in missing_fields
    )
    if not missing_table:
        missing_table = "| - | - | 0 | - |"

    summary = f"""# Product Filter Field Gap Summary

This is a code-level audit based on the READY `url_pages` seed and current product queries/admin fields in the app. It does not connect to Supabase.

## Result

| Metric | Count |
|---|---:|
| READY url_pages rows reviewed | {len(seed)} |
| Product filter types | {len(filter_type_counts)} |
| Missing/recommended product fields | {len(missing_fields)} |
| Required missing fields for READY filters | {len(required_missing)} |

## product_filter Type Counts

| filter_type | pages |
|---|---:|
{count_table(filter_type_counts)}

## Product Field Usage From READY Seed

| product field | pages |
|---|---:|
{count_table(field_usage)}

## Gaps To Add Or Normalize

| field | status | used_by_pages | suggestion |
|---|---|---:|---|
{missing_table}

## Key Conclusion

Current products can already support basic category, subcategory, brand, collection and eco pages.

The main gaps are:

- `material_tags` for Cotton Tote / Metal Pens / Plastic Pens material SEO pages.
- `tags` for Workwear / Teamwear filter pages.
- `offer_type` and `kit_themes` for Kits & Bundles pages.
- `kit_components` and `related_categories` for richer kit display.
- `fulfillment` to replace/extend current `indent_type` for supplier imports.
- `pack_size` so single-product packs do not get mistaken for kits.

## Generated Files

- `product_filter_requirements.csv`
- `products_field_gap_checklist.csv`
- `products_filter_fields_DRAFT.sql`
- `product_filter_field_gap_validation.json`
"""
    OUT_SUMMARY.write_text(summary, encoding="utf-8")
    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
