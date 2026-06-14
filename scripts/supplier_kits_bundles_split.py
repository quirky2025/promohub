from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MAPPING_DIR = ROOT / "outputs" / "supplier_mapping"

MAPPING_V3 = MAPPING_DIR / "supplier_category_mappings_DRAFT_v3.csv"
REMAINING_REVIEW = MAPPING_DIR / "remaining_review_products.csv"

OUT_KITS = MAPPING_DIR / "supplier_kit_bundle_candidates.csv"
OUT_SINGLE_PACKS = MAPPING_DIR / "supplier_single_product_pack_candidates.csv"
OUT_MANUAL = MAPPING_DIR / "supplier_manual_review_after_kits.csv"
OUT_MAPPING_V4 = MAPPING_DIR / "supplier_category_mappings_DRAFT_v4.csv"
OUT_SUMMARY = MAPPING_DIR / "kits_bundles_split_summary.md"
OUT_ARCH_NOTE = MAPPING_DIR / "kits_bundles_architecture_note.md"
OUT_VALIDATION = MAPPING_DIR / "kits_bundles_split_validation.json"


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


def norm(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def has(pattern: str, text: str) -> bool:
    return bool(re.search(pattern, text, re.I))


def is_single_product_quantity_pack(name_text: str, raw_text: str) -> tuple[bool, str, str, str]:
    """Quantity packs are not kitting. They are one product sold in multiple units."""
    if not has(r"\b\d+\s*pack\b|\bpack\s*-\s*children", name_text):
        return False, "", "", ""
    if has(r"face\s+masks?", name_text):
        return True, "Personal Care", "Face Masks", "quantity pack of one product, not a kit"
    if has(r"sunglasses", name_text):
        return True, "Outdoor & Sports", "Sunglasses", "quantity pack of one product, not a kit"
    if has(r"straws?", name_text):
        return True, "Barware & Accessories", "Bar Accessories", "quantity pack of one product, not a kit"
    if has(r"coasters?", name_text):
        return True, "Barware & Accessories", "Coasters", "quantity pack of one product, not a kit"
    if has(r"masks?", raw_text) and has(r"children", name_text):
        return True, "Personal Care", "Face Masks", "quantity pack of one product, not a kit"
    return False, "", "", ""


def is_kit_candidate(name_text: str, raw_text: str) -> bool:
    if is_single_product_quantity_pack(name_text, raw_text)[0]:
        return False
    if has(r"\bhamper\b|\bhampers\b", raw_text) or has(r"\bhamper\b", name_text):
        return True
    if has(r"\bgift\s*sets?\b|\bgiftsets?\b|\bpacks?\s+gifting\b|\bpacks?\s*&\s*gifting\b", raw_text):
        return True
    if has(r"\b(gift\s*set|hamper|welcome\s+pack|onboarding\s+bundle|conference\s+pack|tradeshow\s+pack|office\s+pack|wellbeing\s+pack|wellness\s+pack|hygiene\s+pack)\b", name_text):
        return True
    if has(r"\b(eco\s+shopping\s+kit|expo\s+essentials\s+pack|beach\s+kit|active\s+living\s+pack|adventure\s+pack|reusable\s+kit|lunch\s*&\s*latte\s+kit|treat\s+kit|little\s+learners\s+pack|emergency\s+pack|sewing\s+kit)\b", name_text):
        return True
    if has(r"\b(the\s+classic\s+pairing|the\s+warm\s+welcome|the\s+happy\s+hour|the\s+host\s+edit|the\s+nibble\s+set|bubbles\s+(and\s+)?beachdays|the\s+daily\s+setup|the\s+brew\s+(and\s+)?bite|the\s+chandon\s+escape|the\s+sunchaser\s+set|glow\s+(and\s+)?graze|the\s+brew\s+ritual|the\s+refined\s+graze|the\s+ultimate\s+welcome|the\s+sunset\s+pour|the\s+generous\s+host|the\s+little\s+luxuries|the\s+mindful\s+moment|the\s+cosy\s+indulgence|the\s+perfect\s+pairing|the\s+warm\s+escape|the\s+big\s+indulge|the\s+good\s+things|the\s+wine\s+(and\s+)?unwind)\b", name_text):
        return True
    return False


def classify_offer_type(name_text: str, raw_text: str) -> str:
    if has(r"\bhamper\b|\bhampers\b", raw_text) or has(r"\bhamper\b", name_text):
        return "hamper"
    if has(r"\bgift\s*set|giftsets?|gift\s*sets?\b", f"{name_text} {raw_text}"):
        return "gift_set"
    if has(r"\bbundle\b", name_text):
        return "prebuilt_bundle"
    return "prebuilt_kit"


def classify_theme(name_text: str, raw_text: str) -> str:
    text = f"{name_text} {raw_text}"
    checks = [
        ("employee_onboarding", r"onboarding|welcome|intro\s+pack|warm\s+welcome|ultimate\s+welcome"),
        ("conference_event", r"conference|tradeshow|expo|event\s+essentials"),
        ("office_school", r"office|back\s+to\s+school|little\s+learners|journal|notebook"),
        ("wellness_care", r"wellness|wellbeing|hygiene|care|mindful|pause|emergency|face\s+mask|sewing"),
        ("beach_outdoor", r"beach|adventure|outdoor|active|sunchaser|sunset|sunglasses|picnic|coogee|bondi|gold\s+coast"),
        ("food_drink_gifting", r"graze|nibble|bite|brew|latte|coffee|tea|whisky|whiskey|wine|chandon|happy\s+hour|host|pairing|indulgence|treat"),
        ("eco_sustainable", r"eco|reusable|kakadu|flinders"),
        ("tech_gift_set", r"technology|speaker|charger|power\s*bank|earbud|symphony|destiny|bellman|alliance"),
        ("premium_corporate_gift", r"premium|classic|refined|luxuries|perfect|corporate"),
    ]
    for theme, pattern in checks:
        if has(pattern, text):
            return theme
    return "general_corporate_gifting"


def infer_components(name_text: str, raw_text: str) -> tuple[str, str]:
    text = f"{name_text} {raw_text}"
    components: list[str] = []
    categories: list[str] = []

    def add(label: str, category: str) -> None:
        if label not in components:
            components.append(label)
        if category not in categories:
            categories.append(category)

    if has(r"pen|pencil|stylus", text):
        add("pen/pencil", "Pens")
    if has(r"notebook|journal|notepad|office|school", text):
        add("notebook/office item", "Office & Desk")
    if has(r"bottle|cup|mug|tumbler|coffee|tea|latte", text):
        add("drinkware", "Drinkware")
    if has(r"wine|whisky|whiskey|chandon|opener|happy\s+hour|host", text):
        add("barware/wine item", "Barware & Accessories")
    if has(r"graze|nibble|bite|treat|indulgence|chocolate|sweet", text):
        add("food/confectionery item", "Confectionery")
    if has(r"bag|tote|shopping|carry|pack", text):
        add("bag/packaging carrier", "Bags")
    if has(r"box|cardboard|gift\s+box|gift\s+card", text):
        add("gift packaging", "Packaging")
    if has(r"beach|picnic|outdoor|sunglasses|towel|active|adventure|emergency", text):
        add("outdoor/leisure item", "Outdoor & Sports")
    if has(r"speaker|charger|power\s*bank|earbud|technology|tech", text):
        add("technology item", "Technology")
    if has(r"mask|hygiene|wellness|wellbeing|care|first\s+aid|sewing", text):
        add("personal care item", "Personal Care")
    if has(r"lanyard|badge|conference|tradeshow|expo", text):
        add("event giveaway item", "Giveaways & Event Accessories")
    if has(r"cap|hat|beanie|apparel|shirt|hoodie", text):
        add("wearable item", "Apparel/Headwear")

    if not components:
        components.append("mixed branded products")
    if not categories:
        categories.append("multiple categories")

    return "; ".join(components), "; ".join(categories)


def suggested_url(theme: str) -> str:
    urls = {
        "employee_onboarding": "employee-onboarding-kits-australia",
        "conference_event": "conference-event-kits-australia",
        "office_school": "office-and-school-kits-australia",
        "wellness_care": "wellness-gift-packs-australia",
        "beach_outdoor": "outdoor-event-kits-australia",
        "food_drink_gifting": "corporate-gift-sets-australia",
        "eco_sustainable": "eco-merch-kits-australia",
        "tech_gift_set": "tech-gift-sets-australia",
        "premium_corporate_gift": "premium-corporate-gift-sets-australia",
        "general_corporate_gifting": "custom-merch-kits-australia",
    }
    return urls.get(theme, "custom-merch-kits-australia")


def main() -> None:
    mapping_rows = read_csv(MAPPING_V3)
    remaining_rows = read_csv(REMAINING_REVIEW)

    kit_rows: list[dict[str, object]] = []
    single_pack_rows: list[dict[str, object]] = []
    manual_rows: list[dict[str, object]] = []

    kit_counts_by_key: Counter[tuple[str, str, str]] = Counter()
    single_pack_counts_by_key: Counter[tuple[str, str, str]] = Counter()
    manual_counts_by_key: Counter[tuple[str, str, str]] = Counter()

    for row in remaining_rows:
        name_text = norm(row.get("product_name", ""))
        raw_text = norm(row.get("raw_category_path", ""))
        key = (row.get("supplier", ""), row.get("source_field", ""), row.get("raw_category_path", ""))

        is_single_pack, pack_category, pack_subcategory, pack_note = is_single_product_quantity_pack(name_text, raw_text)
        if is_single_pack:
            out = dict(row)
            out.update(
                {
                    "mapping_status": "single_product_quantity_pack",
                    "target_category": pack_category,
                    "target_subcategory": pack_subcategory,
                    "offer_type": "single_product",
                    "kit_theme": "",
                    "likely_components": "",
                    "related_categories": pack_category,
                    "suggested_collection_slug": "",
                    "action": "map to normal product category; store pack_size as product attribute",
                    "bundle_note": pack_note,
                }
            )
            single_pack_rows.append(out)
            single_pack_counts_by_key[key] += 1
            continue

        if is_kit_candidate(name_text, raw_text):
            offer_type = classify_offer_type(name_text, raw_text)
            theme = classify_theme(name_text, raw_text)
            components, categories = infer_components(name_text, raw_text)
            out = dict(row)
            out.update(
                {
                    "mapping_status": "kit_bundle_collection_candidate",
                    "target_category": "",
                    "target_subcategory": "",
                    "offer_type": offer_type,
                    "kit_theme": theme,
                    "likely_components": components,
                    "related_categories": categories,
                    "suggested_collection_slug": suggested_url(theme),
                    "action": "route to Kits & Bundles collection/offer; do not force into primary category",
                    "bundle_note": "Kitting offer built from existing product categories.",
                }
            )
            kit_rows.append(out)
            kit_counts_by_key[key] += 1
            continue

        manual_rows.append(row)
        manual_counts_by_key[key] += 1

    # Update raw category mapping rows with the kit split outcome.
    updated_mapping: list[dict[str, str]] = []
    for row in mapping_rows:
        key = (row.get("supplier", ""), row.get("source_field", ""), row.get("raw_category_path", ""))
        kit_count = kit_counts_by_key[key]
        single_pack_count = single_pack_counts_by_key[key]
        manual_count = manual_counts_by_key[key]
        new_row = dict(row)
        if kit_count or single_pack_count:
            prior_status = new_row.get("mapping_status", "")
            prior_note = new_row.get("mapping_note", "")
            suffix = (
                f"Kits split: kit_bundle_candidates={kit_count}, "
                f"single_product_quantity_packs={single_pack_count}, "
                f"remaining_manual_review={manual_count}."
            )
            if kit_count and not manual_count and not prior_status.startswith("product_keyword_rules_partial"):
                new_row["mapping_status"] = "kit_bundle_collection_candidate"
                new_row["review_reason"] = "route product-level kit/bundle offers to Kits & Bundles"
                new_row["target_category"] = ""
                new_row["target_subcategory"] = ""
                new_row["confidence"] = ""
            elif kit_count and manual_count:
                new_row["mapping_status"] = "product_keyword_rules_partial_with_kits_and_review"
                new_row["review_reason"] = "product-level split includes kit/bundle candidates and manual review"
                new_row["target_category"] = ""
                new_row["target_subcategory"] = ""
                new_row["confidence"] = ""
            elif kit_count:
                new_row["mapping_status"] = "product_keyword_rules_partial_with_kits"
                new_row["review_reason"] = "product-level split includes kit/bundle candidates"
                new_row["target_category"] = ""
                new_row["target_subcategory"] = ""
                new_row["confidence"] = ""
            elif single_pack_count and not manual_count and prior_status == "needs_review":
                new_row["mapping_status"] = "single_product_quantity_pack"
                new_row["review_reason"] = "not a kit; normal product category with pack_size attribute"
            new_row["mapping_note"] = f"{prior_note} {suffix}".strip()
        updated_mapping.append(new_row)

    common_fields = [
        "supplier",
        "source_field",
        "raw_category_path",
        "sku",
        "product_name",
        "mapping_status",
        "target_category",
        "target_subcategory",
        "confidence",
        "rule_id",
        "review_reason",
        "suggested_tags",
        "suggested_material",
        "mapping_note",
    ]
    kit_fields = common_fields + [
        "offer_type",
        "kit_theme",
        "likely_components",
        "related_categories",
        "suggested_collection_slug",
        "action",
        "bundle_note",
    ]

    write_csv(OUT_KITS, kit_rows, kit_fields)
    write_csv(OUT_SINGLE_PACKS, single_pack_rows, kit_fields)
    write_csv(OUT_MANUAL, manual_rows, common_fields)
    write_csv(OUT_MAPPING_V4, updated_mapping, list(mapping_rows[0].keys()))

    theme_counts = Counter(str(r["kit_theme"]) for r in kit_rows)
    offer_type_counts = Counter(str(r["offer_type"]) for r in kit_rows)
    supplier_counts = Counter(str(r["supplier"]) for r in kit_rows)
    manual_supplier_counts = Counter(str(r["supplier"]) for r in manual_rows)
    v4_status_counts = Counter(r.get("mapping_status", "") for r in updated_mapping)

    validation = {
        "input_remaining_review_products": len(remaining_rows),
        "kit_bundle_candidates": len(kit_rows),
        "single_product_quantity_pack_candidates": len(single_pack_rows),
        "manual_review_after_kits": len(manual_rows),
        "kit_theme_counts": dict(theme_counts),
        "offer_type_counts": dict(offer_type_counts),
        "kit_candidates_by_supplier": dict(supplier_counts),
        "manual_review_by_supplier": dict(manual_supplier_counts),
        "v4_mapping_status_counts": dict(v4_status_counts),
        "outputs": {
            "kit_candidates": str(OUT_KITS),
            "single_product_packs": str(OUT_SINGLE_PACKS),
            "manual_review_after_kits": str(OUT_MANUAL),
            "mapping_v4": str(OUT_MAPPING_V4),
            "summary": str(OUT_SUMMARY),
            "architecture_note": str(OUT_ARCH_NOTE),
        },
    }
    OUT_VALIDATION.write_text(json.dumps(validation, indent=2), encoding="utf-8")

    def md_counts(counter: Counter[str]) -> str:
        if not counter:
            return "| - | 0 |"
        return "\n".join(f"| {name} | {count} |" for name, count in counter.most_common())

    summary = f"""# Kits & Bundles Split Summary

This splits the remaining supplier review list into:

- **Kits & Bundles candidates**: multi-product offers built from existing categories.
- **Single product quantity packs**: not kitting; normal product category plus a pack-size attribute.
- **Manual review after kits**: products still requiring human category judgment.

## Result

| Metric | Count |
|---|---:|
| Input remaining review products | {len(remaining_rows)} |
| Kits & Bundles candidates | {len(kit_rows)} |
| Single product quantity packs | {len(single_pack_rows)} |
| Manual review after kits | {len(manual_rows)} |

## Kit Theme Counts

| kit_theme | products |
|---|---:|
{md_counts(theme_counts)}

## Offer Type Counts

| offer_type | products |
|---|---:|
{md_counts(offer_type_counts)}

## Kit Candidates By Supplier

| supplier | products |
|---|---:|
{md_counts(supplier_counts)}

## Manual Review After Kits By Supplier

| supplier | products |
|---|---:|
{md_counts(manual_supplier_counts)}

## v4 Mapping Status Counts

| mapping_status | rows |
|---|---:|
{md_counts(v4_status_counts)}

## Files

- `supplier_kit_bundle_candidates.csv`
- `supplier_single_product_pack_candidates.csv`
- `supplier_manual_review_after_kits.csv`
- `supplier_category_mappings_DRAFT_v4.csv`
- `kits_bundles_architecture_note.md`
- `kits_bundles_split_validation.json`
"""
    OUT_SUMMARY.write_text(summary, encoding="utf-8")

    arch_note = """# Kits & Bundles Architecture Note

## Decision

`Kits & Bundles` is a collection/offer layer, not a product category and not Sourcing/Supply Chain.

Products still keep one primary product category such as `Pens`, `Bags`, `Drinkware`, `Office & Desk`, `Packaging`, or `Personal Care`.
Kits are built by combining products from those categories into a sellable offer/template.

## Navigation

Recommended main navigation label:

```text
Kits & Bundles
```

Use `Merch Bundles`, `Merch Kits`, and `Corporate Gift Sets` inside SEO copy and page titles where useful.

## Data Model

Recommended fields for product/offers:

```text
offer_type:
- single_product
- prebuilt_kit
- prebuilt_bundle
- gift_set
- hamper
- custom_kit_template

kit_theme:
- employee_onboarding
- conference_event
- office_school
- wellness_care
- beach_outdoor
- food_drink_gifting
- eco_sustainable
- tech_gift_set
- premium_corporate_gift
- general_corporate_gifting
```

Single-product multi-packs such as `4 Pack Face Masks` are not kitting. They should stay in the normal product category with a `pack_size` attribute.

## Starter URLs

```text
/custom-merch-kits-australia
/employee-onboarding-kits-australia
/conference-event-kits-australia
/corporate-gift-sets-australia
/wellness-gift-packs-australia
/eco-merch-kits-australia
/premium-corporate-gift-sets-australia
/new-home-gift-kits-australia
```

`New Home Gift Kits` is a QuirkyPromo-created template/landing page. Supplier gift set candidates can feed it only when components match home/settlement gifting.
"""
    OUT_ARCH_NOTE.write_text(arch_note, encoding="utf-8")

    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
