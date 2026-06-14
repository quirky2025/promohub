# Product Filter Field Gap Summary

This is a code-level audit based on the READY `url_pages` seed and current product queries/admin fields in the app. It does not connect to Supabase.

## Result

| Metric | Count |
|---|---:|
| READY url_pages rows reviewed | 176 |
| Product filter types | 5 |
| Missing/recommended product fields | 11 |
| Required missing fields for READY filters | 3 |

## product_filter Type Counts

| filter_type | pages |
|---|---:|
| subcategory | 138 |
| category | 21 |
| kit_collection | 10 |
| compound | 6 |
| kit_template | 1 |

## Product Field Usage From READY Seed

| product field | pages |
|---|---:|
| is_published | 176 |
| category | 165 |
| subcategory | 138 |
| kit_themes | 11 |
| offer_type | 11 |
| material_tags | 3 |
| tags | 2 |
| is_eco | 1 |
| kit_components | 1 |
| related_categories | 1 |

## Gaps To Add Or Normalize

| field | status | used_by_pages | suggestion |
|---|---|---:|---|
| fulfillment | missing_recommended | 0 | Add fulfillment text and optionally backfill from indent_type. |
| is_australian_made | missing_recommended | 0 | Add boolean default false. |
| kit_components | missing_recommended_for_kits | 1 | Add kit_components jsonb default [] for supplier prebuilt and custom kit templates. |
| kit_themes | missing_required_for_kits | 11 | Add kit_themes text[] default empty array. |
| material_tags | missing_recommended | 3 | Add text[] generated/normalized by import rules. |
| offer_type | missing_required_for_kits | 11 | Add offer_type text default single_product. |
| pack_size | missing_recommended | 0 | Add pack_size int nullable for pack quantity. |
| related_categories | missing_recommended_for_kits | 1 | Add related_categories text[] default empty array. |
| supplier | missing_recommended | 0 | Add supplier text or supplier_id depending on import model. |
| supplier_raw_category_path | missing_recommended | 0 | Add text or store in supplier import raw/staging table. |
| tags | missing_required_for_filters | 2 | Add tags text[] for merch attributes/use-cases. |

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
