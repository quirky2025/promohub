# QuirkyPromo DB Preflight Runbook

> Generated for the locked taxonomy, READY `url_pages` seed, Kits & Bundles pages, and product filter field migration.
>
> This document is an execution guide only. No SQL has been run from Codex.

## What This Covers

This runbook connects three parts:

1. `products` fields needed by the new URL/product filter system.
2. `url_pages` READY seed for 176 public pages.
3. `product_filter` validation so every live URL can actually pull products.

## Run Order

### 1. Products Field Dry Run

File:

`outputs/product_filter_requirements/products_filter_fields_dry_run.sql`

Purpose:

Checks whether the needed `products` columns, indexes, and constraints already exist.

Expected:

- Read-only.
- No writes.
- Reports missing fields before migration.

### 2. Products Field Migration

File:

`outputs/product_filter_requirements/products_filter_fields_FINAL.sql`

Purpose:

Adds the additive fields needed by READY filters and supplier import cleanup:

- `material_tags`
- `tags`
- `fulfillment`
- `is_australian_made`
- `offer_type`
- `kit_themes`
- `kit_components`
- `related_categories`
- `pack_size`
- `supplier`
- `supplier_raw_category_path`

Expected:

- Additive only.
- No delete/truncate/drop.
- Named constraints:
  - `products_fulfillment_check`
  - `products_offer_type_check`
  - `products_pack_size_check`
- Indexes for category/subcategory and array filter fields.

### 3. URL Infrastructure Tables

File:

`outputs/url_pages_ready/url_infrastructure_tables_CREATE.sql`

Purpose:

Creates the URL infrastructure tables needed before seeding:

- `public.url_pages`
- `public.brands`
- `public.url_redirects`

Expected:

- Additive only.
- Does not delete product data.
- Final check returns all three table existence flags as true.

### 4. url_pages Seed Dry Run

File:

`outputs/url_pages_ready/url_pages_seed_READY_dry_run.sql`

Purpose:

Validates the 176 READY rows before writing them into `url_pages`.

Expected:

- Read-only.
- Duplicate slug count = 0.
- Reserved slug conflict count = 0.
- Invalid enum/status/source checks = 0.

### 5. url_pages Upsert

File:

`outputs/url_pages_ready/url_pages_seed_READY_upsert.sql`

Purpose:

Upserts the READY `url_pages` rows.

Expected:

- 176 rows available after upsert.
- 165 product category pages.
- 11 Kits & Bundles pages.
- Confectionery remains one merged category/primary page.
- Pet category/subcategory remains hidden from nav.

### 6. Product Filter Validation

File:

`outputs/product_filter_resolver/product_filter_validation_READONLY.sql`

Purpose:

Counts products matched by each live `url_pages.product_filter`.

Expected:

- Read-only.
- Normal live pages should not return `CHECK: empty live page`.
- `kit_template` can have zero direct product rows if the page renders component/category rails and quote CTA.

## Stop Conditions

Stop before frontend work if any of these appear:

- Any dry run reports duplicate slugs.
- Any dry run reports reserved slug conflicts.
- `product_filter_validation_READONLY.sql` shows empty live category/subcategory/compound/kit_collection pages that should be live.
- Products migration fails because an existing constraint/index name conflicts.
- `url_pages` upsert row count is not 176.

## Files To Keep Together

### Products

- `outputs/product_filter_requirements/products_filter_fields_dry_run.sql`
- `outputs/product_filter_requirements/products_filter_fields_FINAL.sql`
- `outputs/product_filter_requirements/products_filter_fields_sql_validation.md`

### URL Pages

- `outputs/url_pages_ready/url_pages_seed_READY.json`
- `outputs/url_pages_ready/url_pages_seed_READY.csv`
- `outputs/url_pages_ready/url_pages_seed_READY_dry_run.sql`
- `outputs/url_pages_ready/url_pages_seed_READY_upsert.sql`
- `outputs/url_pages_ready/url_pages_seed_READY_validation.md`

### Resolver

- `outputs/product_filter_resolver/product_filter_resolver_spec.md`
- `outputs/product_filter_resolver/product_filter_type_matrix.csv`
- `outputs/product_filter_resolver/product_filter_validation_READONLY.sql`
- `outputs/product_filter_resolver/product_filter_resolver_pseudocode.js`

## Frontend After DB Is Green

Only after the DB preflight is green:

1. Add flat `[slug]` page support with reserved slug protection.
2. Fetch `url_pages` by `slug`.
3. Apply the resolver rules from `product_filter_resolver_spec.md`.
4. Keep old `/category/...` routes live during the transition.
5. Point canonical on old pages to the new flat URL.
6. Switch nav/footer/home links from `url_pages` only when product counts are verified.
