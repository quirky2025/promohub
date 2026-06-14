import csv
import json
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
READY_JSON = ROOT / "outputs" / "url_pages_ready" / "url_pages_seed_READY.json"
OUT_DIR = ROOT / "outputs" / "product_filter_resolver"


FILTER_RULES = {
    "category": {
        "required_fields": ["category", "is_published"],
        "query_shape": "category exact match + is_published=true",
        "empty_policy": "Should not be empty after migration. Empty means products were not moved or category spelling differs.",
    },
    "subcategory": {
        "required_fields": ["category", "subcategory", "is_published"],
        "query_shape": "category exact match + subcategory exact match + is_published=true",
        "empty_policy": "Should not be empty after migration unless the page is intentionally draft.",
    },
    "compound": {
        "required_fields": ["category", "is_published", "material_tags/tags/is_eco"],
        "query_shape": "category exact match + one normalized attribute filter",
        "empty_policy": "Allowed during tagging cleanup only. Before live, each compound SEO page needs products or status=draft.",
    },
    "kit_collection": {
        "required_fields": ["offer_type", "kit_themes", "is_published"],
        "query_shape": "offer_type in allowed kit offer types + kit_themes overlap",
        "empty_policy": "Hub/theme pages should not be empty after kit tagging. Empty child pages should stay draft.",
    },
    "kit_template": {
        "required_fields": ["kit_components", "related_categories", "is_published"],
        "query_shape": "manual/template page; show curated component rails rather than one product list",
        "empty_policy": "Can have zero direct kit products if it renders component/category rails and quote CTA.",
    },
    "brand": {
        "required_fields": ["brand", "is_published"],
        "query_shape": "brand exact/normalized match + is_published=true",
        "empty_policy": "Brand page should be draft until products exist.",
    },
    "collection": {
        "required_fields": ["collection", "is_published"],
        "query_shape": "collection jsonb contains value + is_published=true",
        "empty_policy": "Collection page should be draft until products exist.",
    },
    "manual": {
        "required_fields": ["id", "is_published"],
        "query_shape": "explicit product_ids list + is_published=true",
        "empty_policy": "Manual page must be checked by hand.",
    },
}


def load_rows():
    with READY_JSON.open("r", encoding="utf-8") as f:
        return json.load(f)


def sorted_filter_keys(product_filter):
    return ",".join(sorted(k for k in product_filter.keys() if k != "type"))


def make_matrix(rows):
    matrix = []
    for row in rows:
        pf = row.get("product_filter") or {}
        filter_type = pf.get("type", "")
        rule = FILTER_RULES.get(filter_type, {})
        matrix.append(
            {
                "slug": row["slug"],
                "page_type": row.get("page_type", ""),
                "source_type": row.get("source_type", ""),
                "page_role": row.get("page_role", ""),
                "filter_type": filter_type,
                "filter_keys": sorted_filter_keys(pf),
                "category": pf.get("category", ""),
                "subcategory": pf.get("subcategory", ""),
                "material": pf.get("material", ""),
                "tags": "|".join(pf.get("tags", [])) if isinstance(pf.get("tags"), list) else "",
                "kit_themes": "|".join(pf.get("kit_themes", [])) if isinstance(pf.get("kit_themes"), list) else "",
                "offer_types": "|".join(pf.get("offer_types", [])) if isinstance(pf.get("offer_types"), list) else "",
                "required_product_fields": "|".join(rule.get("required_fields", [])),
                "query_shape": rule.get("query_shape", "UNHANDLED"),
                "empty_page_policy": rule.get("empty_policy", "UNHANDLED"),
            }
        )
    return matrix


def write_csv(path, rows):
    if not rows:
        return
    with path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def build_readonly_sql():
    return """-- Product filter resolver validation
-- READ ONLY. Run after url_pages + products filter fields exist.
-- Purpose: count products matched by each live url_pages.product_filter.

with page_counts as (
  select
    up.slug,
    up.page_type,
    up.source_type,
    up.status,
    up.product_filter,
    coalesce(up.product_filter->>'type', '') as filter_type,
    (
      select count(*)
      from public.products p
      where p.is_published = true
        and (
          (
            up.product_filter->>'type' = 'category'
            and p.category = up.product_filter->>'category'
          )
          or (
            up.product_filter->>'type' = 'subcategory'
            and p.category = up.product_filter->>'category'
            and p.subcategory = up.product_filter->>'subcategory'
          )
          or (
            up.product_filter->>'type' = 'compound'
            and p.category = up.product_filter->>'category'
            and (
              (up.product_filter ? 'material' and coalesce(p.material_tags, array[]::text[]) @> array[lower(up.product_filter->>'material')])
              or (up.product_filter ? 'tags' and coalesce(p.tags, array[]::text[]) && (
                select array_agg(lower(value))
                from jsonb_array_elements_text(up.product_filter->'tags') as value
              ))
              or (up.product_filter ? 'is_eco' and coalesce(p.is_eco, false) = (up.product_filter->>'is_eco')::boolean)
            )
          )
          or (
            up.product_filter->>'type' = 'kit_collection'
            and coalesce(p.offer_type, 'single_product') in (
              select value from jsonb_array_elements_text(up.product_filter->'offer_types') as value
            )
            and (
              coalesce((up.product_filter->>'include_all_kit_candidates')::boolean, false) = true
              or coalesce(p.kit_themes, array[]::text[]) && (
                select array_agg(value)
                from jsonb_array_elements_text(up.product_filter->'kit_themes') as value
              )
            )
          )
          or (
            up.product_filter->>'type' = 'kit_template'
            and coalesce(p.offer_type, 'single_product') in (
              select value from jsonb_array_elements_text(up.product_filter->'offer_types') as value
            )
            and coalesce(p.kit_themes, array[]::text[]) && (
              select array_agg(value)
              from jsonb_array_elements_text(up.product_filter->'kit_themes') as value
            )
          )
        )
    ) as product_count
  from public.url_pages up
  where up.status = 'live'
)
select
  slug,
  filter_type,
  product_count,
  case
    when filter_type = 'kit_template' then 'manual/template page: zero direct products can be ok if component rails render'
    when product_count = 0 then 'CHECK: empty live page'
    else 'ok'
  end as validation_note,
  product_filter
from page_counts
order by
  case when product_count = 0 and filter_type <> 'kit_template' then 0 else 1 end,
  filter_type,
  slug;
"""


def build_resolver_pseudocode():
    return """// Pseudocode only. Do not paste directly without adapting to the app query layer.

export function applyProductFilter(query, productFilter) {
  const type = productFilter?.type;
  query = query.eq('is_published', true);

  if (type === 'category') {
    return query.eq('category', productFilter.category);
  }

  if (type === 'subcategory') {
    return query
      .eq('category', productFilter.category)
      .eq('subcategory', productFilter.subcategory);
  }

  if (type === 'compound') {
    query = query.eq('category', productFilter.category);

    if (productFilter.material) {
      return query.contains('material_tags', [productFilter.material.toLowerCase()]);
    }
    if (Array.isArray(productFilter.tags) && productFilter.tags.length) {
      return query.overlaps('tags', productFilter.tags.map(tag => tag.toLowerCase()));
    }
    if (productFilter.is_eco === true) {
      return query.eq('is_eco', true);
    }
  }

  if (type === 'kit_collection') {
    query = query.in('offer_type', productFilter.offer_types || []);
    if (productFilter.include_all_kit_candidates) return query;
    return query.overlaps('kit_themes', productFilter.kit_themes || []);
  }

  if (type === 'kit_template') {
    // Template pages should render curated component/category rails and quote CTA.
    // A direct product query is optional, not the main content.
    return query
      .in('offer_type', productFilter.offer_types || [])
      .overlaps('kit_themes', productFilter.kit_themes || []);
  }

  throw new Error(`Unsupported product_filter.type: ${type}`);
}
"""


def build_spec(rows, matrix):
    type_counts = Counter(r["filter_type"] for r in matrix)
    key_counts = defaultdict(Counter)
    examples = {}
    for row in rows:
        pf = row.get("product_filter") or {}
        filter_type = pf.get("type", "")
        for key in pf:
            key_counts[filter_type][key] += 1
        examples.setdefault(filter_type, {"slug": row["slug"], "product_filter": pf})

    lines = [
        "# QuirkyPromo product_filter Resolver Spec",
        "",
        "> Generated from `outputs/url_pages_ready/url_pages_seed_READY.json`. This is a build/spec artifact only; it does not modify the database.",
        "",
        "## Core Rule",
        "",
        "Every public URL page reads `url_pages.product_filter` and converts it into one product query. Category/subcategory pages use the product's primary home only. Do not use one product in multiple subcategories to fake extra pages; use collections, tags, kit themes, brand pages, and compound filter pages for secondary appearances.",
        "",
        "## Type Counts",
        "",
        "| product_filter.type | pages |",
        "|---|---:|",
    ]
    for filter_type, count in sorted(type_counts.items()):
        lines.append(f"| {filter_type} | {count} |")

    lines.extend(
        [
            "",
            "## Resolver Rules",
            "",
            "| type | required product fields | query shape | empty-page policy |",
            "|---|---|---|---|",
        ]
    )
    for filter_type in sorted(type_counts):
        rule = FILTER_RULES.get(filter_type, {})
        lines.append(
            f"| {filter_type} | {', '.join(rule.get('required_fields', []))} | {rule.get('query_shape', 'UNHANDLED')} | {rule.get('empty_policy', 'UNHANDLED')} |"
        )

    lines.extend(
        [
            "",
            "## Filter Keys In Seed",
            "",
            "| type | keys seen | example slug | example product_filter |",
            "|---|---|---|---|",
        ]
    )
    for filter_type in sorted(type_counts):
        keys = ", ".join(sorted(k for k in key_counts[filter_type] if k != "type"))
        example = examples[filter_type]
        lines.append(
            f"| {filter_type} | {keys} | `{example['slug']}` | `{json.dumps(example['product_filter'], ensure_ascii=False)}` |"
        )

    lines.extend(
        [
            "",
            "## Important Implementation Notes",
            "",
            "- `category` and `subcategory` matching should be exact after migration. If counts are wrong, fix the product data or mapping, not the URL.",
            "- `material_tags` and `tags` should be normalized lowercase arrays during import/cleanup. Example: `Cotton` in URL seed becomes `cotton` in `material_tags`.",
            "- `kit_collection` pages only show products/offers with kit-style `offer_type`, not normal single products.",
            "- `kit_template` pages such as New Home Kits can be useful even with zero direct kit products, but they must render component/category rails and a quote CTA.",
            "- Empty live pages are not acceptable for normal category/subcategory/compound/kit_collection pages. Keep them `draft` until product counts are ready.",
            "- Legacy `extra_subcategories` can remain as a transition helper, but it should not drive the new canonical flat URL pages.",
            "",
            "## Generated Files",
            "",
            "- `product_filter_type_matrix.csv`",
            "- `product_filter_validation_READONLY.sql`",
            "- `product_filter_resolver_pseudocode.js`",
            "- `product_filter_resolver_validation.json`",
        ]
    )
    return "\n".join(lines) + "\n"


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = load_rows()
    matrix = make_matrix(rows)

    matrix_path = OUT_DIR / "product_filter_type_matrix.csv"
    spec_path = OUT_DIR / "product_filter_resolver_spec.md"
    sql_path = OUT_DIR / "product_filter_validation_READONLY.sql"
    pseudo_path = OUT_DIR / "product_filter_resolver_pseudocode.js"
    validation_path = OUT_DIR / "product_filter_resolver_validation.json"

    write_csv(matrix_path, matrix)
    spec_path.write_text(build_spec(rows, matrix), encoding="utf-8")
    sql_path.write_text(build_readonly_sql(), encoding="utf-8")
    pseudo_path.write_text(build_resolver_pseudocode(), encoding="utf-8")

    handled_types = sorted(set(FILTER_RULES) & {r["filter_type"] for r in matrix})
    unhandled_types = sorted({r["filter_type"] for r in matrix} - set(FILTER_RULES))
    validation = {
        "ready_rows": len(rows),
        "matrix_rows": len(matrix),
        "filter_type_counts": dict(sorted(Counter(r["filter_type"] for r in matrix).items())),
        "handled_types": handled_types,
        "unhandled_types": unhandled_types,
        "empty_page_policy_defined_for_all_seed_types": not unhandled_types,
        "outputs": {
            "spec": str(spec_path),
            "matrix": str(matrix_path),
            "readonly_sql": str(sql_path),
            "pseudocode": str(pseudo_path),
        },
    }
    validation_path.write_text(json.dumps(validation, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(validation, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
