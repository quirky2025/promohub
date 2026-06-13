# QuirkyPromo Supabase SQL Editor Execution Packet

> Use this page when you are ready to run the DB preflight in Supabase SQL Editor.
>
> Codex has not run any SQL against Supabase. The local project does not currently have `psql`, Supabase CLI, or a Postgres connection string.

## Golden Rule

Run one file at a time. If a dry-run check fails, stop and fix that issue before running the write step.

## Step 1: Products Field Dry Run

Open:

`C:\Users\jilin\Desktop\promohub\outputs\product_filter_requirements\products_filter_fields_dry_run.sql`

Run it in Supabase SQL Editor.

Expected:

- It is read-only.
- It reports which product fields/indexes/constraints are missing.
- It should not change data.

If this fails:

- Stop.
- Do not run Step 2.

## Step 2: Products Field Migration

Open:

`C:\Users\jilin\Desktop\promohub\outputs\product_filter_requirements\products_filter_fields_FINAL.sql`

Run it only after Step 1 looks sensible.

Expected:

- Adds missing fields only.
- Does not delete, truncate, or remove existing fields.
- Adds 11 fields if they are missing:
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

If this fails:

- Screenshot/copy the Supabase error.
- Stop before `url_pages` upsert.

## Step 3: URL Infrastructure Tables

Open:

`C:\Users\jilin\Desktop\promohub\outputs\url_pages_ready\url_infrastructure_tables_CREATE.sql`

Run it after the products fields are ready.

Expected:

- `url_pages_exists = true`
- `brands_exists = true`
- `url_redirects_exists = true`

If this fails:

- Screenshot/copy the Supabase error.
- Do not run the `url_pages` seed yet.

## Step 4: url_pages Seed Dry Run

Open:

`C:\Users\jilin\Desktop\promohub\outputs\url_pages_ready\url_pages_seed_READY_dry_run.sql`

Run it in Supabase SQL Editor.

Expected:

- It is read-only.
- Duplicate slugs = `0`.
- Reserved slug conflicts = `0`.
- Invalid enum/source/status checks = `0`.

If this fails:

- Stop.
- Do not run Step 5.

## Step 5: url_pages Upsert

Open:

`C:\Users\jilin\Desktop\promohub\outputs\url_pages_ready\url_pages_seed_READY_upsert.sql`

Run it only after Step 4 is clean.

Expected:

- 176 total `url_pages` seed rows.
- 165 product category pages.
- 11 Kits & Bundles pages.
- Pet pages remain hidden from main nav.
- Confectionery remains one merged row.

If this fails:

- Screenshot/copy the Supabase error.
- Stop before frontend work.

## Step 6: Product Filter Count Validation

Open:

`C:\Users\jilin\Desktop\promohub\outputs\product_filter_resolver\product_filter_validation_READONLY.sql`

Run it after Step 5.

Expected:

- It is read-only.
- Normal live pages should not show `CHECK: empty live page`.
- `kit_template` can have zero direct products if the page renders component/category rails and quote CTA.

If you see `CHECK: empty live page`:

- Do not switch navigation yet.
- Fix product category/subcategory/tag/kit fields first.
- The page can temporarily be set to `draft` if products are not ready.

## Ready For Frontend When

You can move to flat URL frontend work only when:

- Step 1 dry-run is understandable.
- Step 2 migration succeeds.
- Step 3 creates the URL infrastructure tables.
- Step 4 dry-run has no conflicts.
- Step 5 upsert succeeds.
- Step 6 has no unexpected empty live pages.

## Frontend First Move After DB Is Green

Use the spec here:

`C:\Users\jilin\Desktop\promohub\outputs\frontend_transition\Flat_URL_Frontend_Transition_Spec.md`

Recommended first route:

`app/[slug]/page.js`

Avoid first route:

`app/[...slug]/page.js`
