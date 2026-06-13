# QuirkyPromo product_filter Resolver Spec

> Generated from `outputs/url_pages_ready/url_pages_seed_READY.json`. This is a build/spec artifact only; it does not modify the database.

## Core Rule

Every public URL page reads `url_pages.product_filter` and converts it into one product query. Category/subcategory pages use the product primary home only. Do not use one product in multiple subcategories to fake extra pages; use collections, tags, kit themes, brand pages, and compound filter pages for secondary appearances.

## Type Counts

| product_filter.type | pages |
|---|---:|
| category | 21 |
| compound | 6 |
| kit_collection | 10 |
| kit_template | 1 |
| subcategory | 138 |

## Resolver Rules

| type | required product fields | query shape | empty-page policy |
|---|---|---|---|
| category | category, is_published | category exact match + is_published=true | Should not be empty after migration. Empty means products were not moved or category spelling differs. |
| compound | category, is_published, material_tags/tags/is_eco | category exact match + one normalized attribute filter | Allowed during tagging cleanup only. Before live, each compound SEO page needs products or status=draft. |
| kit_collection | offer_type, kit_themes, is_published | offer_type in allowed kit offer types + kit_themes overlap | Hub/theme pages should not be empty after kit tagging. Empty child pages should stay draft. |
| kit_template | kit_components, related_categories, is_published | manual/template page; show curated component rails rather than one product list | Can have zero direct kit products if it renders component/category rails and quote CTA. |
| subcategory | category, subcategory, is_published | category exact match + subcategory exact match + is_published=true | Should not be empty after migration unless the page is intentionally draft. |

## Filter Keys In Seed

| type | keys seen | example slug | example product_filter |
|---|---|---|---|
| category | category | `promotional-giveaways-australia` | `{"type":"category","category":"Giveaways & Event Accessories"}` |
| compound | category, is_eco, material, tags | `custom-cotton-tote-bags-australia` | `{"type":"compound","category":"Bags","material":"Cotton"}` |
| kit_collection | include_all_kit_candidates, kit_themes, offer_types | `custom-merch-kits-australia` | `{"type":"kit_collection","kit_themes":["employee_onboarding","conference_event","office_school","wellness_care","beach_outdoor","food_drink_gifting","eco_sustainable","tech_gift_set","premium_corporate_gift","general_corporate_gifting"],"offer_types":["prebuilt_kit","prebuilt_bundle","gift_set","hamper","custom_kit_template"],"include_all_kit_candidates":true}` |
| kit_template | kit_themes, offer_types, source | `new-home-gift-kits-australia` | `{"type":"kit_template","kit_themes":["new_home"],"offer_types":["custom_kit_template"],"source":"manual_template_from_existing_categories"}` |
| subcategory | category, subcategory | `custom-lanyards-australia` | `{"type":"subcategory","category":"Giveaways & Event Accessories","subcategory":"Lanyards"}` |

## Important Implementation Notes

- `category` and `subcategory` matching should be exact after migration. If counts are wrong, fix the product data or mapping, not the URL.
- `material_tags` and `tags` should be normalized lowercase arrays during import/cleanup. Example: `Cotton` in URL seed becomes `cotton` in `material_tags`.
- `kit_collection` pages only show products/offers with kit-style `offer_type`, not normal single products.
- `kit_template` pages such as New Home Kits can be useful even with zero direct kit products, but they must render component/category rails and a quote CTA.
- Empty live pages are not acceptable for normal category/subcategory/compound/kit_collection pages. Keep them `draft` until product counts are ready.
- Legacy `extra_subcategories` can remain as a transition helper, but it should not drive the new canonical flat URL pages.

## Generated Files

- `product_filter_type_matrix.csv`
- `product_filter_validation_READONLY.sql`
- `product_filter_resolver_pseudocode.js`
- `product_filter_resolver_validation.json`
