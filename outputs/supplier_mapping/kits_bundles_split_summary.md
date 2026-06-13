# Kits & Bundles Split Summary

This splits the remaining supplier review list into:

- **Kits & Bundles candidates**: multi-product offers built from existing categories.
- **Single product quantity packs**: not kitting; normal product category plus a pack-size attribute.
- **Manual review after kits**: products still requiring human category judgment.

## Result

| Metric | Count |
|---|---:|
| Input remaining review products | 224 |
| Kits & Bundles candidates | 104 |
| Single product quantity packs | 1 |
| Manual review after kits | 119 |

## Kit Theme Counts

| kit_theme | products |
|---|---:|
| tech_gift_set | 22 |
| food_drink_gifting | 20 |
| general_corporate_gifting | 18 |
| beach_outdoor | 13 |
| office_school | 13 |
| wellness_care | 6 |
| employee_onboarding | 5 |
| eco_sustainable | 3 |
| conference_event | 3 |
| premium_corporate_gift | 1 |

## Offer Type Counts

| offer_type | products |
|---|---:|
| gift_set | 59 |
| prebuilt_kit | 35 |
| hamper | 9 |
| prebuilt_bundle | 1 |

## Kit Candidates By Supplier

| supplier | products |
|---|---:|
| Logoline | 89 |
| NIConcept | 15 |

## Manual Review After Kits By Supplier

| supplier | products |
|---|---:|
| PromoBrands | 73 |
| Logoline | 31 |
| Gear For Life | 9 |
| NIConcept | 6 |

## v4 Mapping Status Counts

| mapping_status | rows |
|---|---:|
| auto_mapped | 340 |
| auto_mapped_by_keyword | 55 |
| product_keyword_rules_partial | 46 |
| product_keyword_rules_applied | 35 |
| collection_or_tag | 17 |
| needs_review | 15 |
| kit_bundle_collection_candidate | 11 |
| fulfillment_service | 10 |
| product_keyword_rules_partial_with_kits | 5 |

## Files

- `supplier_kit_bundle_candidates.csv`
- `supplier_single_product_pack_candidates.csv`
- `supplier_manual_review_after_kits.csv`
- `supplier_category_mappings_DRAFT_v4.csv`
- `kits_bundles_architecture_note.md`
- `kits_bundles_split_validation.json`
