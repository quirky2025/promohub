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
- `supplier_raw_product_rows`
- `supplier_raw_colour_options`
- `supplier_raw_images`
- `supplier_raw_price_rows`
- `supplier_raw_decoration_options`

Important:

- Keep source row numbers.
- Keep raw JSON payloads.
- Do not delete repeated SKU rows.
- Do not publish imported products.

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

The preview is the approval surface. It should include target category/subcategory, brand alias result, tags, fulfillment, offer type and warning flags.

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
5. decoration options
6. tags/material/fulfillment/brand metadata

Do not flatten colour images into product-level images until colour-specific relationships are verified.

