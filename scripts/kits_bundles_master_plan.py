from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MAPPING_DIR = ROOT / "outputs" / "supplier_mapping"
OUT_DIR = ROOT / "outputs" / "kits_bundles"

KIT_CANDIDATES = MAPPING_DIR / "supplier_kit_bundle_candidates.csv"

OUT_MASTER_CSV = OUT_DIR / "kits_bundles_master_table.csv"
OUT_ASSIGNMENTS = OUT_DIR / "supplier_kit_collection_assignments.csv"
OUT_URL_JSON = OUT_DIR / "kits_bundles_url_pages_seed.json"
OUT_URL_CSV = OUT_DIR / "kits_bundles_url_pages_seed.csv"
OUT_MD = OUT_DIR / "Kits_Bundles_Master_Plan.md"
OUT_VALIDATION = OUT_DIR / "kits_bundles_master_plan_validation.json"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in fieldnames})


PAGES: list[dict[str, object]] = [
    {
        "collection_name": "Custom Merch Kits",
        "nav_label": "Kits & Bundles",
        "slug": "custom-merch-kits-australia",
        "page_kind": "hub",
        "primary_kit_theme": "all",
        "kit_themes": [
            "employee_onboarding",
            "conference_event",
            "office_school",
            "wellness_care",
            "beach_outdoor",
            "food_drink_gifting",
            "eco_sustainable",
            "tech_gift_set",
            "premium_corporate_gift",
            "general_corporate_gifting",
        ],
        "offer_type_scope": ["prebuilt_kit", "prebuilt_bundle", "gift_set", "hamper", "custom_kit_template"],
        "target_audience": "Marketing teams, HR teams, event teams, real estate teams, agencies",
        "use_case": "Main hub for custom merch kits, bundles, gift sets and branded packs",
        "related_categories": "Bags; Drinkware; Pens; Office & Desk; Packaging; Apparel; Technology; Personal Care; Home & Living",
        "primary_keyword": "custom merch kits Australia",
        "title": "Custom Merch Kits Australia | Branded Kits & Bundles",
        "h1": "Custom Merch Kits Australia",
        "meta_description": "Build branded merch kits, gift sets and event bundles using products from QuirkyPromo categories, with options for packaging and custom quote support.",
        "show_in_nav": True,
        "show_in_footer": True,
        "seo_priority": 100,
        "notes": "Hub page. It can show all kit candidates and custom kit templates.",
    },
    {
        "collection_name": "Employee Onboarding Kits",
        "nav_label": "Onboarding Kits",
        "slug": "employee-onboarding-kits-australia",
        "page_kind": "kit_collection",
        "primary_kit_theme": "employee_onboarding",
        "kit_themes": ["employee_onboarding", "office_school"],
        "offer_type_scope": ["prebuilt_kit", "prebuilt_bundle", "gift_set", "custom_kit_template"],
        "target_audience": "HR teams, people teams, startups, corporate employers",
        "use_case": "Welcome packs for new employees and remote staff",
        "related_categories": "Bags; Drinkware; Office & Desk; Pens; Apparel; Technology; Packaging",
        "primary_keyword": "employee onboarding kits Australia",
        "title": "Employee Onboarding Kits Australia | Branded Welcome Packs",
        "h1": "Employee Onboarding Kits Australia",
        "meta_description": "Create branded employee onboarding kits with notebooks, pens, drink bottles, bags, apparel, tech gifts and custom packaging.",
        "show_in_nav": True,
        "show_in_footer": True,
        "seo_priority": 95,
        "notes": "Can include office_school candidates when the product is suitable as a welcome/work pack.",
    },
    {
        "collection_name": "Conference & Event Kits",
        "nav_label": "Conference Kits",
        "slug": "conference-event-kits-australia",
        "page_kind": "kit_collection",
        "primary_kit_theme": "conference_event",
        "kit_themes": ["conference_event"],
        "offer_type_scope": ["prebuilt_kit", "prebuilt_bundle", "gift_set", "custom_kit_template"],
        "target_audience": "Event managers, conference organisers, associations, expos",
        "use_case": "Conference packs, event attendee kits and tradeshow giveaway bundles",
        "related_categories": "Giveaways & Event Accessories; Bags; Pens; Office & Desk; Drinkware; Flags & Displays",
        "primary_keyword": "conference event kits Australia",
        "title": "Conference Event Kits Australia | Branded Event Packs",
        "h1": "Conference & Event Kits Australia",
        "meta_description": "Plan branded conference kits and event packs with lanyards, tote bags, notebooks, pens, drink bottles and practical giveaway items.",
        "show_in_nav": True,
        "show_in_footer": True,
        "seo_priority": 90,
        "notes": "Event-specific collection. Good internal links to lanyards, tote bags and notebooks.",
    },
    {
        "collection_name": "Corporate Gift Sets",
        "nav_label": "Corporate Gift Sets",
        "slug": "corporate-gift-sets-australia",
        "page_kind": "kit_collection",
        "primary_kit_theme": "corporate_gift_sets",
        "kit_themes": ["food_drink_gifting", "general_corporate_gifting", "premium_corporate_gift"],
        "offer_type_scope": ["gift_set", "hamper", "prebuilt_kit", "custom_kit_template"],
        "target_audience": "Corporate buyers, client relationship teams, agencies, sales teams",
        "use_case": "Client gifts, thank-you sets, food and drink gift boxes, premium branded gifts",
        "related_categories": "Drinkware; Barware & Accessories; Home & Living; Confectionery; Packaging; Bags",
        "primary_keyword": "corporate gift sets Australia",
        "title": "Corporate Gift Sets Australia | Branded Gift Boxes & Hampers",
        "h1": "Corporate Gift Sets Australia",
        "meta_description": "Source branded corporate gift sets and hampers with drinkware, barware, homewares, confectionery and premium packaging options.",
        "show_in_nav": True,
        "show_in_footer": True,
        "seo_priority": 96,
        "notes": "Primary home for supplier gift sets, hampers, food/drink gifting and premium gifting.",
    },
    {
        "collection_name": "Wellness Gift Packs",
        "nav_label": "Wellness Packs",
        "slug": "wellness-gift-packs-australia",
        "page_kind": "kit_collection",
        "primary_kit_theme": "wellness_care",
        "kit_themes": ["wellness_care"],
        "offer_type_scope": ["prebuilt_kit", "gift_set", "custom_kit_template"],
        "target_audience": "HR teams, healthcare campaigns, wellness programs, safety teams",
        "use_case": "Wellness packs, care packs, hygiene kits and staff wellbeing gifts",
        "related_categories": "Personal Care; Outdoor & Sports; Drinkware; Packaging; Office & Desk",
        "primary_keyword": "wellness gift packs Australia",
        "title": "Wellness Gift Packs Australia | Branded Care Packs",
        "h1": "Wellness Gift Packs Australia",
        "meta_description": "Create branded wellness gift packs and care kits with personal care items, drinkware, packaging and practical promotional products.",
        "show_in_nav": True,
        "show_in_footer": True,
        "seo_priority": 82,
        "notes": "Keep separate from medical claims; this is promotional wellness/care gifting.",
    },
    {
        "collection_name": "Eco Merch Kits",
        "nav_label": "Eco Merch Kits",
        "slug": "eco-merch-kits-australia",
        "page_kind": "kit_collection",
        "primary_kit_theme": "eco_sustainable",
        "kit_themes": ["eco_sustainable"],
        "offer_type_scope": ["prebuilt_kit", "gift_set", "custom_kit_template"],
        "target_audience": "Sustainability-led brands, events, HR teams, agencies",
        "use_case": "Eco gift packs, reusable merch kits and sustainability-themed bundles",
        "related_categories": "Bags; Drinkware; Office & Desk; Pens; Packaging; Home & Living",
        "primary_keyword": "eco merch kits Australia",
        "title": "Eco Merch Kits Australia | Sustainable Branded Bundles",
        "h1": "Eco Merch Kits Australia",
        "meta_description": "Build eco merch kits with reusable bags, drinkware, notebooks, pens, packaging and sustainable branded product options.",
        "show_in_nav": True,
        "show_in_footer": True,
        "seo_priority": 80,
        "notes": "Works with eco filter pages and sustainability content, but remains a collection/kit page.",
    },
    {
        "collection_name": "Tech Gift Sets",
        "nav_label": "Tech Gift Sets",
        "slug": "tech-gift-sets-australia",
        "page_kind": "kit_collection",
        "primary_kit_theme": "tech_gift_set",
        "kit_themes": ["tech_gift_set"],
        "offer_type_scope": ["gift_set", "prebuilt_kit", "custom_kit_template"],
        "target_audience": "Corporate teams, agencies, IT campaigns, employee gifting",
        "use_case": "Technology gift sets and branded tech bundles",
        "related_categories": "Technology; Office & Desk; Bags; Packaging",
        "primary_keyword": "tech gift sets Australia",
        "title": "Tech Gift Sets Australia | Branded Technology Bundles",
        "h1": "Tech Gift Sets Australia",
        "meta_description": "Source branded tech gift sets with chargers, speakers, earbuds, power banks, office items and custom packaging options.",
        "show_in_nav": True,
        "show_in_footer": False,
        "seo_priority": 86,
        "notes": "Supplier candidates are strong here. Internal link to Technology category.",
    },
    {
        "collection_name": "Outdoor Event Kits",
        "nav_label": "Outdoor Event Kits",
        "slug": "outdoor-event-kits-australia",
        "page_kind": "kit_collection",
        "primary_kit_theme": "beach_outdoor",
        "kit_themes": ["beach_outdoor"],
        "offer_type_scope": ["prebuilt_kit", "gift_set", "custom_kit_template"],
        "target_audience": "Outdoor events, sports days, beach activations, team events",
        "use_case": "Beach packs, picnic kits, outdoor event bundles and summer merch packs",
        "related_categories": "Outdoor & Sports; Bags; Drinkware; Apparel; Personal Care",
        "primary_keyword": "outdoor event kits Australia",
        "title": "Outdoor Event Kits Australia | Beach & Summer Merch Packs",
        "h1": "Outdoor Event Kits Australia",
        "meta_description": "Create outdoor event kits and beach merch packs with bags, drinkware, towels, sunglasses, picnic gear and branded summer items.",
        "show_in_nav": True,
        "show_in_footer": False,
        "seo_priority": 78,
        "notes": "Seasonal and event-heavy. Can support summer campaign pages later.",
    },
    {
        "collection_name": "New Home Gift Kits",
        "nav_label": "New Home Kits",
        "slug": "new-home-gift-kits-australia",
        "page_kind": "custom_kit_template",
        "primary_kit_theme": "new_home",
        "kit_themes": ["new_home"],
        "offer_type_scope": ["custom_kit_template"],
        "target_audience": "Real estate agents, property developers, mortgage brokers, settlement teams",
        "use_case": "New home handover gifts and settlement gift kits",
        "related_categories": "Home & Living; Drinkware; Barware & Accessories; Packaging; Confectionery",
        "primary_keyword": "new home gift kits Australia",
        "title": "New Home Gift Kits Australia | Settlement Gift Packs",
        "h1": "New Home Gift Kits Australia",
        "meta_description": "Create new home gift kits for property handovers with homewares, drinkware, barware, confectionery and branded packaging.",
        "show_in_nav": True,
        "show_in_footer": False,
        "seo_priority": 84,
        "notes": "Strategic QuirkyPromo-created template. Source from category products, not necessarily supplier prebuilt kits.",
    },
    {
        "collection_name": "Premium Corporate Gift Sets",
        "nav_label": "Premium Gift Sets",
        "slug": "premium-corporate-gift-sets-australia",
        "page_kind": "kit_collection",
        "primary_kit_theme": "premium_corporate_gift",
        "kit_themes": ["premium_corporate_gift"],
        "offer_type_scope": ["gift_set", "hamper", "custom_kit_template"],
        "target_audience": "Executive gifting, client gifting, premium campaigns",
        "use_case": "Higher-value corporate gifts and premium client gift sets",
        "related_categories": "Premium Drinkware; Barware & Accessories; Home & Living; Technology; Packaging",
        "primary_keyword": "premium corporate gift sets Australia",
        "title": "Premium Corporate Gift Sets Australia | Executive Branded Gifts",
        "h1": "Premium Corporate Gift Sets Australia",
        "meta_description": "Plan premium corporate gift sets and executive branded gifts with quality drinkware, tech, barware, homewares and packaging.",
        "show_in_nav": False,
        "show_in_footer": True,
        "seo_priority": 76,
        "notes": "Can be linked from corporate gift sets page instead of top nav until content is ready.",
    },
    {
        "collection_name": "Office & School Kits",
        "nav_label": "Office & School Kits",
        "slug": "office-and-school-kits-australia",
        "page_kind": "support_collection",
        "primary_kit_theme": "office_school",
        "kit_themes": ["office_school"],
        "offer_type_scope": ["prebuilt_kit", "gift_set", "custom_kit_template"],
        "target_audience": "Schools, universities, offices, training programs",
        "use_case": "Office packs, back-to-school packs and training kits",
        "related_categories": "Office & Desk; Pens; Bags; Packaging",
        "primary_keyword": "office kits Australia",
        "title": "Office & School Kits Australia | Branded Stationery Packs",
        "h1": "Office & School Kits Australia",
        "meta_description": "Create branded office kits and school packs with notebooks, pens, bags, stationery and packaging options.",
        "show_in_nav": False,
        "show_in_footer": False,
        "seo_priority": 62,
        "notes": "Support page. Many items can also appear in employee onboarding kits.",
    },
]


THEME_TO_PRIMARY_SLUG = {
    "employee_onboarding": "employee-onboarding-kits-australia",
    "conference_event": "conference-event-kits-australia",
    "office_school": "office-and-school-kits-australia",
    "wellness_care": "wellness-gift-packs-australia",
    "beach_outdoor": "outdoor-event-kits-australia",
    "food_drink_gifting": "corporate-gift-sets-australia",
    "eco_sustainable": "eco-merch-kits-australia",
    "tech_gift_set": "tech-gift-sets-australia",
    "premium_corporate_gift": "premium-corporate-gift-sets-australia",
    "general_corporate_gifting": "corporate-gift-sets-australia",
}


def page_lookup() -> dict[str, dict[str, object]]:
    return {str(p["slug"]): p for p in PAGES}


def json_text(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def main() -> None:
    candidates = read_csv(KIT_CANDIDATES)
    pages = page_lookup()

    assignments: list[dict[str, object]] = []
    counts_by_slug: Counter[str] = Counter()
    counts_by_theme: Counter[str] = Counter()
    counts_by_offer: Counter[str] = Counter()
    supplier_counts_by_slug: dict[str, Counter[str]] = defaultdict(Counter)

    for row in candidates:
        theme = row.get("kit_theme", "")
        primary_slug = THEME_TO_PRIMARY_SLUG.get(theme, "custom-merch-kits-australia")
        primary_page = pages[primary_slug]
        counts_by_slug[primary_slug] += 1
        counts_by_theme[theme] += 1
        counts_by_offer[row.get("offer_type", "")] += 1
        supplier_counts_by_slug[primary_slug][row.get("supplier", "")] += 1
        assignments.append(
            {
                "supplier": row.get("supplier", ""),
                "sku": row.get("sku", ""),
                "product_name": row.get("product_name", ""),
                "offer_type": row.get("offer_type", ""),
                "kit_theme": theme,
                "primary_collection_slug": primary_slug,
                "primary_collection_name": primary_page["collection_name"],
                "also_include_in_hub": "true",
                "hub_slug": "custom-merch-kits-australia",
                "likely_components": row.get("likely_components", ""),
                "related_categories": row.get("related_categories", ""),
                "raw_category_path": row.get("raw_category_path", ""),
                "source_field": row.get("source_field", ""),
                "assignment_note": "Supplier prebuilt kit/bundle candidate; not a product primary category.",
            }
        )

    master_rows: list[dict[str, object]] = []
    for page in PAGES:
        slug = str(page["slug"])
        source_candidate_count = len(candidates) if slug == "custom-merch-kits-australia" else counts_by_slug[slug]
        suppliers = (
            "; ".join(f"{supplier}:{count}" for supplier, count in supplier_counts_by_slug[slug].most_common())
            if supplier_counts_by_slug[slug]
            else ""
        )
        master_rows.append(
            {
                "collection_name": page["collection_name"],
                "nav_label": page["nav_label"],
                "slug": slug,
                "page_kind": page["page_kind"],
                "primary_kit_theme": page["primary_kit_theme"],
                "kit_themes": "; ".join(page["kit_themes"]),  # type: ignore[arg-type]
                "offer_type_scope": "; ".join(page["offer_type_scope"]),  # type: ignore[arg-type]
                "target_audience": page["target_audience"],
                "use_case": page["use_case"],
                "related_categories": page["related_categories"],
                "source_candidate_count": source_candidate_count,
                "source_supplier_counts": suppliers,
                "show_in_nav": str(page["show_in_nav"]).lower(),
                "show_in_footer": str(page["show_in_footer"]).lower(),
                "seo_priority": page["seo_priority"],
                "primary_keyword": page["primary_keyword"],
                "title": page["title"],
                "h1": page["h1"],
                "meta_description": page["meta_description"],
                "notes": page["notes"],
            }
        )

    url_csv_rows: list[dict[str, object]] = []
    url_json_rows: list[dict[str, object]] = []
    for page in PAGES:
        slug = str(page["slug"])
        product_filter = {
            "type": "kit_collection",
            "kit_themes": page["kit_themes"],
            "offer_types": page["offer_type_scope"],
        }
        if slug == "custom-merch-kits-australia":
            product_filter["include_all_kit_candidates"] = True
        if page["page_kind"] == "custom_kit_template":
            product_filter["type"] = "kit_template"
            product_filter["source"] = "manual_template_from_existing_categories"

        base_url_row = {
            "slug": slug,
            "page_type": "collection" if page["page_kind"] != "custom_kit_template" else "landing",
            "source_type": "collection",
            "source_label": page["collection_name"],
            "primary_keyword": page["primary_keyword"],
            "title": page["title"],
            "h1": page["h1"],
            "meta_description": page["meta_description"],
            "status": "draft",
            "priority": page["seo_priority"],
            "show_in_home": False,
            "show_in_nav": page["show_in_nav"],
            "show_in_footer": page["show_in_footer"],
            "breadcrumb_parent": None if slug == "custom-merch-kits-australia" else "custom-merch-kits-australia",
            "related_urls": [],
            "noindex": False,
            "notes": page["notes"],
        }
        json_row = dict(base_url_row)
        json_row["product_filter"] = product_filter
        url_json_rows.append(json_row)

        csv_row = dict(base_url_row)
        csv_row["product_filter"] = json_text(product_filter)
        csv_row["show_in_home"] = str(csv_row["show_in_home"]).lower()
        csv_row["show_in_nav"] = str(csv_row["show_in_nav"]).lower()
        csv_row["show_in_footer"] = str(csv_row["show_in_footer"]).lower()
        csv_row["related_urls"] = json_text(csv_row["related_urls"])
        csv_row["noindex"] = str(csv_row["noindex"]).lower()
        url_csv_rows.append(csv_row)

    master_fields = [
        "collection_name",
        "nav_label",
        "slug",
        "page_kind",
        "primary_kit_theme",
        "kit_themes",
        "offer_type_scope",
        "target_audience",
        "use_case",
        "related_categories",
        "source_candidate_count",
        "source_supplier_counts",
        "show_in_nav",
        "show_in_footer",
        "seo_priority",
        "primary_keyword",
        "title",
        "h1",
        "meta_description",
        "notes",
    ]
    assignment_fields = [
        "supplier",
        "sku",
        "product_name",
        "offer_type",
        "kit_theme",
        "primary_collection_slug",
        "primary_collection_name",
        "also_include_in_hub",
        "hub_slug",
        "likely_components",
        "related_categories",
        "raw_category_path",
        "source_field",
        "assignment_note",
    ]
    url_fields = [
        "slug",
        "page_type",
        "source_type",
        "source_label",
        "primary_keyword",
        "title",
        "h1",
        "meta_description",
        "product_filter",
        "status",
        "priority",
        "show_in_home",
        "show_in_nav",
        "show_in_footer",
        "breadcrumb_parent",
        "related_urls",
        "noindex",
        "notes",
    ]

    write_csv(OUT_MASTER_CSV, master_rows, master_fields)
    write_csv(OUT_ASSIGNMENTS, assignments, assignment_fields)
    write_csv(OUT_URL_CSV, url_csv_rows, url_fields)
    OUT_URL_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_URL_JSON.write_text(json.dumps(url_json_rows, ensure_ascii=False, indent=2), encoding="utf-8")

    duplicate_slugs = [slug for slug, count in Counter(r["slug"] for r in master_rows).items() if count > 1]
    missing_assignments = [
        r for r in assignments if r["primary_collection_slug"] not in pages
    ]
    nav_pages = [r for r in master_rows if r["show_in_nav"] == "true"]
    footer_pages = [r for r in master_rows if r["show_in_footer"] == "true"]

    validation = {
        "master_pages": len(master_rows),
        "candidate_assignments": len(assignments),
        "duplicate_slugs": duplicate_slugs,
        "missing_assignments": len(missing_assignments),
        "kit_theme_counts": dict(counts_by_theme),
        "offer_type_counts": dict(counts_by_offer),
        "counts_by_primary_slug": dict(counts_by_slug),
        "nav_page_count": len(nav_pages),
        "footer_page_count": len(footer_pages),
        "outputs": {
            "master_csv": str(OUT_MASTER_CSV),
            "assignments": str(OUT_ASSIGNMENTS),
            "url_pages_json": str(OUT_URL_JSON),
            "url_pages_csv": str(OUT_URL_CSV),
            "master_plan": str(OUT_MD),
        },
    }
    OUT_VALIDATION.write_text(json.dumps(validation, ensure_ascii=False, indent=2), encoding="utf-8")

    def md_table(rows: list[dict[str, object]], cols: list[str]) -> str:
        header = "| " + " | ".join(cols) + " |"
        sep = "| " + " | ".join("---" for _ in cols) + " |"
        body = [
            "| " + " | ".join(str(row.get(col, "")).replace("|", "/") for col in cols) + " |"
            for row in rows
        ]
        return "\n".join([header, sep, *body])

    md = f"""# QuirkyPromo Kits & Bundles Master Plan

> Generated from supplier kit candidates. This is a collection/offer layer, not a product category.

## Locked Direction

- Main navigation label: **Kits & Bundles**
- `Kits & Bundles` is not `Sourcing / Supply Chain`.
- A kit is assembled from existing product categories such as Bags, Drinkware, Pens, Office & Desk, Packaging, Apparel, Technology, Home & Living and Personal Care.
- Supplier prebuilt kits/gift sets/hampers become collection candidates.
- QuirkyPromo can also create custom kit templates, such as `New Home Gift Kits`, even when no supplier prebuilt kit exists.

## Master Table

{md_table(master_rows, ["collection_name", "slug", "page_kind", "primary_kit_theme", "source_candidate_count", "show_in_nav", "show_in_footer", "seo_priority"])}

## Candidate Counts By Primary Page

{md_table([{"slug": slug, "candidate_count": count} for slug, count in counts_by_slug.most_common()], ["slug", "candidate_count"])}

## Kit Theme Counts

{md_table([{"kit_theme": theme, "candidate_count": count} for theme, count in counts_by_theme.most_common()], ["kit_theme", "candidate_count"])}

## Offer Type Counts

{md_table([{"offer_type": offer_type, "candidate_count": count} for offer_type, count in counts_by_offer.most_common()], ["offer_type", "candidate_count"])}

## URL Pages Seed Rules

- `page_type = collection` for supplier-driven kit collections.
- `page_type = landing` for QuirkyPromo-created kit templates such as `New Home Gift Kits`.
- `source_type = collection`
- `product_filter.type = kit_collection` for collection pages.
- `product_filter.type = kit_template` for manual kit-template pages.
- All rows start as `status = draft`.

## Recommended Initial Nav Dropdown

1. Custom Merch Kits
2. Employee Onboarding Kits
3. Conference & Event Kits
4. Corporate Gift Sets
5. Wellness Gift Packs
6. Eco Merch Kits
7. Tech Gift Sets
8. Outdoor Event Kits
9. New Home Gift Kits

`Premium Corporate Gift Sets` and `Office & School Kits` can exist as SEO/support pages first, without appearing in the main dropdown.

## Generated Files

- `kits_bundles_master_table.csv`
- `supplier_kit_collection_assignments.csv`
- `kits_bundles_url_pages_seed.json`
- `kits_bundles_url_pages_seed.csv`
- `kits_bundles_master_plan_validation.json`
"""
    OUT_MD.write_text(md, encoding="utf-8")

    print(json.dumps(validation, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
