# Supplier Import Run Order

This run order intentionally separates design, raw loading, validation, transform preview and product creation.

## Phase 0 - Review Design

Files to review first:

1. `outputs/supplier_import_foundation/Supplier_Import_Foundation_Plan.md`
2. `outputs/supplier_import_foundation/supplier_staging_schema_DRAFT.sql`
3. `outputs/supplier_import_foundation/supplier_import_mapping_rules_DRAFT.csv`
4. `outputs/supplier_import_foundation/supplier_brand_aliases_DRAFT.csv`
5. `outputs/supplier_import_foundation/supplier_import_health_check_READONLY.sql`

Do not run product conversion yet.

## Phase 1 - Create Staging Tables

After approval, run the staging schema in Supabase:

```text
outputs/supplier_import_foundation/supplier_staging_schema_DRAFT.sql
```

This creates staging tables only. It does not touch `products`.

## Phase 2 - Load One Pilot Supplier

Recommended pilot:

```text
Gear For Life
```

Load raw rows into staging tables:

- `supplier_import_batches`
- `supplier_commercial_defaults`
- `supplier_raw_product_rows`
- `supplier_raw_colour_options`
- `supplier_raw_images`
- `supplier_price_rows`
- `supplier_decoration_options`
- `supplier_decoration_price_rows`
- `supplier_decoration_rate_cards`
- `supplier_decoration_rate_card_rows`

Important:

- Keep source row numbers.
- Keep raw JSON payloads.
- Do not delete repeated SKU rows.
- Do not publish imported products.
- Use supplier-specific fulfillment, lead time, setup and decoration rules. For Gear For Life, default fulfillment is `local_stock` and default decorated lead time is `10-12 business_days after artwork approval`.

## Phase 3 - Run READONLY Health Check

Run:

```text
outputs/supplier_import_foundation/supplier_import_health_check_READONLY.sql
```

Expected early results can include warnings. Blocking issues:

- missing `supplier_sku`
- same supplier SKU with conflicting product names
- image colour mismatch
- invalid price tiers

Warnings that need review:

- SKUs without images
- images without colour links
- colour rows without images
- missing decoration method
- decoration option without price rows
- invalid decoration price rows
- POA/request quote decoration rows
- request quote rows with a non-null unit cost
- decoration option key duplicates or price rows that cannot match a decoration option key
- Gear For Life default fulfillment/lead time missing or mismatched
- general decoration rate card issues
- transform preview rows needing review

## Phase 4 - Generate Transform Preview

Use:

- `supplier_category_mappings_DRAFT_v4.csv`
- `supplier_keyword_rules_DRAFT.csv`
- `remaining_review_keyword_rules_DRAFT.csv`
- `supplier_import_mapping_rules_DRAFT.csv`
- `supplier_brand_aliases_DRAFT.csv`

Output target:

```text
public.supplier_transform_preview
```

The preview is the approval surface. It should include target category/subcategory, `page_role`, brand alias result, tags, fulfillment, offer type and warning flags.
It should also carry structured lead time fields where the supplier default or product source provides them: min days, max days, unit, basis and note.

## Phase 5 - Manual Review

Do not auto-import:

- `needs_review`
- `blocked`
- `kit_or_bundle`
- `collection_or_tag`
- `fulfillment_only`

Manual review should decide whether a row becomes:

- normal single product
- kit/bundle/gift set/hamper
- collection/tag only
- fulfillment-only signal
- excluded from import

## Phase 6 - Product Conversion

Only approved `mapping_status = ready` rows should be used to generate product conversion SQL or an import job.

Initial conversion should create unpublished/draft products.

Convert in this order:

1. product shell
2. product price rows
3. product colours
4. product colour image relationships
5. product gallery fallback images in `product_images`
6. decoration options
7. decoration price rows
8. general decoration rate cards
9. tags/material/fulfillment/brand metadata

Do not flatten colour images into product-level images. Colour-safe images belong in `product_colours.images`; unlinked, ambiguous or mismatched images belong in `product_images` with `image_role = gallery`.

Decoration conversion must preserve supplier-specific method, location and artwork size. For example, `Pad Print / Box Lid / 70x40mm` and `Pad Print / Bottle / 45x45mm` are different options even when their quantity prices happen to match.

Supplier-level general rate cards, such as transfer printing by size or embroidery by stitch count, should stay separate from product-specific decoration rows until a product explicitly supports that method.

Gear For Life `transfer_printing_bags` is a category fallback: apply it to Bags when a bag product has no product-specific decoration option. Do not use the fallback to override product-specific decoration data.

Gear For Life embroidery should keep the supplier matrix for audit, but frontend quote normalization uses a Gear For Life-specific formula: base 5,000 stitches, then +0.50 per additional 1,000 stitches. This is not a global embroidery rule.

POA rows should use `price_status = request_quote` and `unit_cost = null`. Keep the original POA text in the raw/source field so manual quoting still has the supplier evidence.
