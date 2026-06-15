# Supplier Import Foundation Plan

This is the foundation layer for importing the four supplier feeds into QuirkyPromo without losing source detail or damaging colour/image relationships.

## Scope

Suppliers in scope:

- Gear For Life
- Logoline
- NIConcept
- PromoBrands

Do not import straight into `public.products` first. Every supplier feed should land in raw staging tables, be validated, then generate a transform preview. Only approved preview rows should later be converted into products, colours, images, price rows and decoration options.

## Current Input Assets

Existing useful files:

- `outputs/supplier_inventory/supplier_raw_category_inventory.csv`
- `outputs/supplier_inventory/supplier_raw_category_inventory_summary.md`
- `outputs/supplier_mapping/supplier_category_mappings_DRAFT_v4.csv`
- `outputs/supplier_mapping/supplier_keyword_rules_DRAFT.csv`
- `outputs/supplier_mapping/remaining_review_keyword_rules_DRAFT.csv`
- `outputs/supplier_mapping/supplier_manual_review_after_kits.csv`
- `outputs/supplier_mapping/kits_bundles_architecture_note.md`

Known inventory size from the existing audit:

| supplier | source rows | unique SKUs | raw category paths |
|---|---:|---:|---:|
| Gear For Life | 472 | 470 | 50 |
| Logoline | 5226 | 1054 | 159 |
| NIConcept | 994 | 975 | 13 |
| PromoBrands | 863 | 863 | 312 |

Known mapping position:

- The category mapping draft is intentionally conservative.
- `supplier_category_mappings_DRAFT_v4.csv` is the current mapping source.
- The old broad/review buckets were reduced, but manual review still exists and should not be forced.
- Kits/Bundles are an offer/collection layer, not normal category rows.

## Target Flow

1. Load the source file into a batch record.
2. Store every source row in `supplier_raw_product_rows`.
3. Store raw colour rows in `supplier_raw_colour_options`.
4. Store raw image rows in `supplier_raw_images`.
5. Store normalized supplier price rows in `supplier_price_rows`.
6. Store normalized supplier decoration choices in `supplier_decoration_options`.
7. Store normalized decoration quantity price rows in `supplier_decoration_price_rows`.
8. Store non-product-specific decoration matrices in `supplier_decoration_rate_cards` and `supplier_decoration_rate_card_rows`.
9. Generate `supplier_transform_preview` rows using mapping rules.
10. Run READONLY health checks.
11. Manually review blocked/mixed rows.
12. Only then generate product upsert SQL or an import job.

## Data Protection Rules

Colour/image relationship is the highest-risk area.

- Never flatten images into a product-level image list until colour links are preserved.
- Preserve raw supplier colour names exactly.
- Preserve raw image URLs and source order.
- Store both `colour_key` and `colour_name` when available.
- If an image has no colour link, keep it but mark it as `unlinked`.
- If a colour has no image, keep the colour and mark it as missing imagery.
- If one image maps to multiple colours, store the relationship explicitly rather than guessing.
- If an image cannot be safely matched to a colour, route it to `product_images` as `image_role = gallery` after product approval. Do not put ambiguous images into `product_colours.images`.

SKU handling:

- `supplier_sku` is unique only within a supplier, not globally.
- Repeated source rows for the same SKU are expected for Logoline because pricing and decoration rows can repeat.
- Deduping should happen in preview/transform, not by deleting raw rows.
- Cross-supplier duplicate names are not duplicates unless supplier, SKU and product identity confirm it.

Mapping handling:

- Use `supplier_category_mappings_DRAFT_v4.csv` as the first mapping source.
- Use keyword rules only when confidence is high and no exclusion rule matches.
- Anything with mixed category signals remains manual review.
- Collection signals like `Sale`, `Trending`, `Eco+ Collection`, `Legendary Range` should become tags or collection signals, not primary categories.
- Fulfillment signals like `Offshore Express` and `Indent` should become fulfillment flags, not categories.

## Decoration Pricing Rules

Supplier decoration data must keep method, location, artwork size, quantity tier and setup charges separate. Do not collapse product-specific decoration rows into a single generic method.

Example: for one Gear For Life bottle, these are separate decoration options:

- `Pad Print / Box Lid / 70x40mm`
- `Pad Print / Bottle / 45x45mm`
- `Pad Print / Silicone base / 20x60mm`
- `Laser Engraving / Bottle / 35x40mm or 20x80mm`
- `UVDTF Full Colour / Bottle / 100x120mm`
- `UVDTF Full Colour / Bottle / 200x150mm`

Each option can have its own setup cost, repeat setup cost, additional-colour policy and quantity-tier unit costs. `POA` or missing fixed branding prices should be preserved as `price_status = 'poa'` or `price_status = 'request_quote'`, not guessed.

General decoration matrices that are not tied to one SKU should not be forced into `supplier_decoration_price_rows`. For example, Gear For Life transfer printing for bags and embroidery by stitch count should use supplier-level rate cards:

- `supplier_decoration_rate_cards`
- `supplier_decoration_rate_card_rows`

Some supplier-level rate cards are default fallbacks for a category. For Gear For Life, `transfer_printing_bags` applies to all Bags and should be used when a bag product has no product-specific decoration option. Product-specific decoration rows still take priority over the category fallback.

The supplier import layer stores supplier costs only. Margin and final quote calculations belong in the pricing/quote layer.

## Product Conversion Principles

When transform preview is approved, product-level conversion should preserve:

- supplier
- supplier_sku
- source batch
- raw category path
- raw product JSON
- target category and subcategory
- page_role, where `P` means primary product category page and prevents product rows being treated as F/filter-only pages
- brand alias result
- material/tags/eco/collection signals
- fulfillment
- MOQ
- lead time
- price rows
- decoration options
- decoration price rows
- decoration rate cards
- colours
- colour-specific images
- gallery fallback images in `product_images`

Do not publish imported products by default. Imported products should start as draft or unpublished until a product QA pass is complete.

## Manual Review Boundaries

Keep these out of automatic category import:

- Gift sets, hampers, kits, packs and bundles
- Broad mixed categories from NIConcept
- Supplier collection paths
- Fulfillment/service paths
- Rows where product keywords conflict across categories
- Rows with colour/image ambiguity
- Rows with price or MOQ missing in a supplier feed that normally provides it

## Recommended Pilot

Start with one supplier and one narrow category family.

Best first pilot:

- Supplier: Gear For Life
- Categories: Bags, Drinkware, Apparel narrow subcategories
- Reason: smaller feed, lower row duplication, clearer category structure

Avoid first pilot:

- Logoline full feed, because row repetition from pricing/decoration needs more dedupe handling.
- NIConcept broad categories, because keyword mapping is required.
- PromoBrands full feed, because multi-category path and collection signals need careful handling.
