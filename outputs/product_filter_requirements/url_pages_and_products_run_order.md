# URL Pages + Products Migration Run Order

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
