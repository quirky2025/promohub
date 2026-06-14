from __future__ import annotations

import csv
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]

CATEGORY_MD = Path(
    r"C:\Users\jilin\Desktop\supplier\New folder\QuirkyPromo_url_pages_seed_DRAFT.md"
)
CATEGORY_JSON = Path(
    r"C:\Users\jilin\.codex\attachments\d5a98719-b84b-4aee-aee4-aacc427dc773\pasted-text.txt"
)
KITS_JSON = ROOT / "outputs" / "kits_bundles" / "kits_bundles_url_pages_seed.json"

OUT_DIR = ROOT / "outputs" / "url_pages_ready"
OUT_JSON = OUT_DIR / "url_pages_seed_READY.json"
OUT_CSV = OUT_DIR / "url_pages_seed_READY.csv"
OUT_AUDIT = OUT_DIR / "url_pages_seed_READY_audit.csv"
OUT_VALIDATION = OUT_DIR / "url_pages_seed_READY_validation.md"
OUT_VALIDATION_JSON = OUT_DIR / "url_pages_seed_READY_validation.json"

URL_PAGE_FIELDS = [
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

AUDIT_FIELDS = URL_PAGE_FIELDS + ["seed_group", "page_role", "source_notes"]

ALLOWED_PAGE_TYPES = {"product_category", "collection", "landing", "brand", "service"}
ALLOWED_SOURCE_TYPES = {"category", "subcategory", "collection", "brand", "manual"}
ALLOWED_STATUS = {"draft", "live", "redirected"}

RESERVED_SLUGS = {
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
}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_csv(path: Path, rows: list[dict[str, Any]], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            out: dict[str, Any] = {}
            for field in fields:
                value = row.get(field, "")
                if isinstance(value, (dict, list)):
                    value = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
                elif isinstance(value, bool):
                    value = str(value).lower()
                elif value is None:
                    value = ""
                out[field] = value
            writer.writerow(out)


def parse_markdown_seed(path: Path) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    role_values = {"CAT", "P", "F", "MERGE"}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line.startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) < 8 or cells[0] == "slug" or set(cells[0]) == {"-"}:
            continue
        if cells[1] not in role_values:
            continue
        # Final draft columns:
        # slug | role | source_label | product_filter | bc_parent | nav | home | pri | notes
        rows.append(
            {
                "slug": cells[0],
                "role": cells[1],
                "source_label": cells[2],
                "product_filter": cells[3],
                "breadcrumb_parent": cells[4],
                "nav": cells[5],
                "home": cells[6],
                "priority": cells[7],
                "notes": cells[8] if len(cells) > 8 else "",
            }
        )
    return rows


def titleize_keyword(keyword: str) -> str:
    small = {"and", "or", "for", "with", "of", "in", "to", "the"}
    words = []
    for index, word in enumerate(keyword.replace("&", " & ").split()):
        lower = word.lower()
        if word == "&":
            words.append("&")
        elif lower == "australia":
            words.append("Australia")
        elif index > 0 and lower in small:
            words.append(lower)
        else:
            words.append(lower[:1].upper() + lower[1:])
    return " ".join(words)


def primary_keyword_from_slug(slug: str) -> str:
    return slug.replace("/", " ").replace("-", " ")


def clean_source_label(role: str, label: str, product_filter: dict[str, Any]) -> str:
    if role == "MERGE":
        return "Confectionery"
    if product_filter.get("type") == "category" and product_filter.get("category"):
        return str(product_filter["category"])
    if product_filter.get("type") == "subcategory":
        return f"{product_filter.get('category')} > {product_filter.get('subcategory')}"
    return label


def display_name_from_label(source_label: str) -> str:
    label = source_label.split(">")[-1].strip()
    label = re.sub(r"\s*\(.*?\)\s*", "", label).strip()
    return label or source_label


def build_meta(page_role: str, source_label: str, h1: str) -> str:
    display = display_name_from_label(source_label)
    if page_role == "category":
        return (
            f"Browse {display} promotional products for Australian businesses, "
            "with branded and custom options available from QuirkyPromo."
        )
    if page_role == "seo_filter_page":
        return (
            f"Shop {display} in Australia with filtered branded product options "
            "for corporate gifts, events and promotional campaigns."
        )
    if page_role == "merged_category_primary":
        return (
            "Browse promotional confectionery in Australia, including branded lollies, "
            "chocolates and mints for businesses and events."
        )
    return (
        f"Explore {display} in Australia, with branded and custom options "
        "for corporate gifts, events and promotional campaigns."
    )


def nav_flag(value: str) -> bool:
    return value.strip().upper() == "Y"


def normalize_category_rows() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    md_rows = parse_markdown_seed(CATEGORY_MD)
    old_rows_by_slug = {row["slug"]: row for row in load_json(CATEGORY_JSON)}
    normalized: list[dict[str, Any]] = []
    audit: list[dict[str, Any]] = []

    role_map = {
        "CAT": ("category", "category"),
        "P": ("primary_subcategory", "subcategory"),
        "F": ("seo_filter_page", "manual"),
        "MERGE": ("merged_category_primary", "category"),
    }

    for md in md_rows:
        slug = md["slug"]
        old = old_rows_by_slug.get(slug, {})
        product_filter = json.loads(md["product_filter"])
        page_role, source_type = role_map[md["role"]]
        source_label = clean_source_label(md["role"], md["source_label"], product_filter)
        display = display_name_from_label(source_label)
        primary_keyword = str(old.get("primary_keyword") or primary_keyword_from_slug(slug))
        h1 = str(old.get("h1") or titleize_keyword(primary_keyword))
        title = str(old.get("title") or f"{h1} | QuirkyPromo")
        breadcrumb_parent = None if md["breadcrumb_parent"] == "-" else md["breadcrumb_parent"]
        show_in_nav = nav_flag(md["nav"])
        show_in_home = nav_flag(md["home"])

        # Apply final locked corrections explicitly.
        if slug in {"branded-pet-products-australia", "custom-pet-accessories-australia"}:
            show_in_nav = False
            show_in_home = False
        if slug == "promotional-confectionery-australia":
            source_label = "Confectionery"
            breadcrumb_parent = None
            show_in_nav = False
            show_in_home = False
            primary_keyword = "promotional confectionery australia"
            h1 = "Promotional Confectionery Australia"
            title = "Promotional Confectionery Australia | QuirkyPromo"

        row = {
            "slug": slug,
            "page_type": "product_category",
            "source_type": source_type,
            "source_label": source_label,
            "primary_keyword": primary_keyword,
            "title": title,
            "h1": h1,
            "nav_label": display_name_from_label(source_label),
            "home_label": display_name_from_label(source_label),
            "meta_description": build_meta(page_role, source_label, h1),
            "canonical_url": f"/{slug}",
            "product_filter": product_filter,
            "seo_content": "",
            "faq": [],
            "hero_image": "",
            "status": "draft",
            "priority": int(md["priority"]),
            "show_in_home": show_in_home,
            "show_in_nav": show_in_nav,
            "show_in_footer": False,
            "breadcrumb_parent": breadcrumb_parent,
            "related_urls": [],
            "noindex": False,
        }
        normalized.append(row)
        audit.append(
            {
                **row,
                "seed_group": "category_master",
                "page_role": page_role,
                "source_notes": md.get("notes", ""),
            }
        )

    return normalized, audit


def normalize_kit_rows() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    rows = load_json(KITS_JSON)
    normalized: list[dict[str, Any]] = []
    audit: list[dict[str, Any]] = []
    for source in rows:
        slug = source["slug"]
        source_type = source.get("source_type") or "collection"
        if source_type == "kit_collection":
            source_type = "collection"
        breadcrumb_parent = source.get("breadcrumb_parent")
        if breadcrumb_parent == "Kits & Bundles":
            breadcrumb_parent = None if slug == "custom-merch-kits-australia" else "custom-merch-kits-australia"
        nav_label = source.get("nav_label") or source.get("source_label")
        home_label = source.get("home_label") or nav_label
        row = {
            "slug": slug,
            "page_type": source["page_type"],
            "source_type": source_type,
            "source_label": source["source_label"],
            "primary_keyword": source["primary_keyword"],
            "title": source["title"],
            "h1": source["h1"],
            "nav_label": nav_label,
            "home_label": home_label,
            "meta_description": source["meta_description"],
            "canonical_url": f"/{slug}",
            "product_filter": source["product_filter"],
            "seo_content": "",
            "faq": [],
            "hero_image": "",
            "status": source.get("status", "draft"),
            "priority": int(source.get("priority", 0)),
            "show_in_home": bool(source.get("show_in_home", False)),
            "show_in_nav": bool(source.get("show_in_nav", False)),
            "show_in_footer": bool(source.get("show_in_footer", False)),
            "breadcrumb_parent": breadcrumb_parent,
            "related_urls": source.get("related_urls", []),
            "noindex": bool(source.get("noindex", False)),
        }
        normalized.append(row)
        audit.append(
            {
                **row,
                "seed_group": "kits_bundles",
                "page_role": "kit_template" if row["page_type"] == "landing" else "kit_collection",
                "source_notes": source.get("notes", ""),
            }
        )
    return normalized, audit


def cjk_or_mojibake(value: str) -> bool:
    if re.search(r"[\u4e00-\u9fff]", value):
        return True
    # Common mojibake markers from previous drafts.
    return any(marker in value for marker in ["â", "ä", "å", "é", "è", "ç", "œ", "™"])


def validate(rows: list[dict[str, Any]], audit_rows: list[dict[str, Any]]) -> dict[str, Any]:
    slugs = [row["slug"] for row in rows]
    slug_counts = Counter(slugs)
    duplicate_slugs = sorted([slug for slug, count in slug_counts.items() if count > 1])
    slug_set = set(slugs)
    breadcrumb_missing = sorted(
        {
            row["breadcrumb_parent"]
            for row in rows
            if row.get("breadcrumb_parent") and row["breadcrumb_parent"] not in slug_set
        }
    )
    reserved_conflicts = sorted(
        [slug for slug in slugs if slug.split("/")[0] in RESERVED_SLUGS or slug in RESERVED_SLUGS]
    )
    invalid_page_types = sorted({row["page_type"] for row in rows if row["page_type"] not in ALLOWED_PAGE_TYPES})
    invalid_source_types = sorted({row["source_type"] for row in rows if row["source_type"] not in ALLOWED_SOURCE_TYPES})
    invalid_statuses = sorted({row["status"] for row in rows if row["status"] not in ALLOWED_STATUS})
    meta_internal = sorted([row["slug"] for row in rows if cjk_or_mojibake(str(row.get("meta_description", "")))])
    non_dict_filters = sorted([row["slug"] for row in rows if not isinstance(row.get("product_filter"), dict)])
    missing_canonical = sorted([row["slug"] for row in rows if row.get("canonical_url") != f"/{row['slug']}"])
    field_missing = {
        field: sorted([row["slug"] for row in rows if field not in row])
        for field in URL_PAGE_FIELDS
    }
    field_missing = {field: values for field, values in field_missing.items() if values}

    return {
        "total_rows": len(rows),
        "category_master_rows": sum(1 for row in audit_rows if row["seed_group"] == "category_master"),
        "kits_bundles_rows": sum(1 for row in audit_rows if row["seed_group"] == "kits_bundles"),
        "duplicate_slugs": duplicate_slugs,
        "reserved_conflicts": reserved_conflicts,
        "breadcrumb_missing": breadcrumb_missing,
        "invalid_page_types": invalid_page_types,
        "invalid_source_types": invalid_source_types,
        "invalid_statuses": invalid_statuses,
        "meta_internal_or_mojibake": meta_internal,
        "non_dict_product_filters": non_dict_filters,
        "missing_or_bad_canonical": missing_canonical,
        "field_missing": field_missing,
        "page_type_counts": dict(Counter(row["page_type"] for row in rows)),
        "source_type_counts": dict(Counter(row["source_type"] for row in rows)),
        "status_counts": dict(Counter(row["status"] for row in rows)),
        "seed_group_counts": dict(Counter(row["seed_group"] for row in audit_rows)),
        "page_role_counts": dict(Counter(row["page_role"] for row in audit_rows)),
        "nav_true_count": sum(1 for row in rows if row["show_in_nav"]),
        "home_true_count": sum(1 for row in rows if row["show_in_home"]),
        "footer_true_count": sum(1 for row in rows if row["show_in_footer"]),
        "pet_nav_flags": {
            row["slug"]: row["show_in_nav"]
            for row in rows
            if row["slug"] in {"branded-pet-products-australia", "custom-pet-accessories-australia"}
        },
        "confectionery_rows": [
            row for row in audit_rows if row["slug"] == "promotional-confectionery-australia"
        ],
    }


def md_count_table(counter_dict: dict[str, int]) -> str:
    if not counter_dict:
        return "| - | 0 |"
    return "\n".join(f"| {key} | {value} |" for key, value in counter_dict.items())


def main() -> None:
    category_rows, category_audit = normalize_category_rows()
    kit_rows, kit_audit = normalize_kit_rows()
    rows = category_rows + kit_rows
    audit_rows = category_audit + kit_audit

    validation = validate(rows, audit_rows)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    write_csv(OUT_CSV, rows, URL_PAGE_FIELDS)
    write_csv(OUT_AUDIT, audit_rows, AUDIT_FIELDS)
    OUT_VALIDATION_JSON.write_text(json.dumps(validation, ensure_ascii=False, indent=2), encoding="utf-8")

    blocking_keys = [
        "duplicate_slugs",
        "reserved_conflicts",
        "breadcrumb_missing",
        "invalid_page_types",
        "invalid_source_types",
        "invalid_statuses",
        "meta_internal_or_mojibake",
        "non_dict_product_filters",
        "missing_or_bad_canonical",
        "field_missing",
    ]
    blocking_ok = all(not validation[key] for key in blocking_keys)

    md = f"""# url_pages Seed READY Validation

## Result

| Check | Result |
|---|---|
| READY status | {"PASS" if blocking_ok else "NEEDS FIX"} |
| Total rows | {validation["total_rows"]} |
| Category master rows | {validation["category_master_rows"]} |
| Kits & Bundles rows | {validation["kits_bundles_rows"]} |
| Duplicate slugs | {len(validation["duplicate_slugs"])} |
| Reserved slug conflicts | {len(validation["reserved_conflicts"])} |
| Missing breadcrumb parents | {len(validation["breadcrumb_missing"])} |
| Invalid page_type values | {len(validation["invalid_page_types"])} |
| Invalid source_type values | {len(validation["invalid_source_types"])} |
| Meta with Chinese/mojibake markers | {len(validation["meta_internal_or_mojibake"])} |
| Bad product_filter values | {len(validation["non_dict_product_filters"])} |
| Bad canonical_url values | {len(validation["missing_or_bad_canonical"])} |

## Counts

### page_type

| page_type | rows |
|---|---:|
{md_count_table(validation["page_type_counts"])}

### source_type

| source_type | rows |
|---|---:|
{md_count_table(validation["source_type_counts"])}

### page_role Audit

| page_role | rows |
|---|---:|
{md_count_table(validation["page_role_counts"])}

## Visibility Counts

| Flag | Rows |
|---|---:|
| show_in_nav=true | {validation["nav_true_count"]} |
| show_in_home=true | {validation["home_true_count"]} |
| show_in_footer=true | {validation["footer_true_count"]} |

## Required Corrections Applied

- Pet category/subcategory nav flags are false: `{validation["pet_nav_flags"]}`
- Confectionery is one merged row: `promotional-confectionery-australia`
- Kits & Bundles uses `source_type=collection`; `product_filter.type=kit_collection`
- Meta descriptions regenerated in English only for category master rows
- `canonical_url` generated as `/{'{slug}'}`

## Output Files

- `url_pages_seed_READY.json`
- `url_pages_seed_READY.csv`
- `url_pages_seed_READY_audit.csv`
- `url_pages_seed_READY_validation.json`
"""
    OUT_VALIDATION.write_text(md, encoding="utf-8")
    print(json.dumps(validation, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    main()
