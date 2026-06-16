# Gear For Life Manual Review Decisions - DRAFT

Date: 2026-06-15

Scope: Gear For Life pilot only. These notes guide later staging correction and transform preview work. They do not write to `products`, publish storefront data, or change global supplier rules.

## Guardrails

- Do not run SQL automatically. Generate SQL only after manual approval.
- Keep all Gear For Life rules supplier-specific.
- Preserve supplier `POA` as `price_status = request_quote` with `unit_cost = null`.
- Do not use `0` for unknown or POA costs.
- Decoration prices are ex GST.
- Decoration prices are branding/print costs only; product base cost remains separate.
- Setup is charged once per order, not per unit.
- Keep `decoration_option_key` bound to method + area/location + size/colour where applicable.
- Protect colour image relationships. Images that cannot be safely tied to a colour should go to gallery fallback later.
- Keep raw brand in staging/audit; do not use raw brand as subcategory.
- Category remapping happens in transform preview/correction, not during raw load.
- Manual review decisions remain explicit; do not silently auto-apply guesses.

## Confirmed Decisions

| Area | Decision | Notes |
|---|---|---|
| Frontend impact | No frontend/products changes yet | Current work is raw/staging only. |
| POA handling | Preserve as request quote | `raw_price = POA` retained; `price_status = request_quote`; `unit_cost = null`. |
| `ODGP` conflict | Split by confirmed product identity | See SKU decisions below. |
| `POPIB` category | `Outdoor & Sports / Picnic & BBQ` | User confirmed this is an outdoor/beach ice bucket use case. |
| Remaining category review | Confirmed proposed mappings | User confirmed the remaining 8 category suggestions listed below. |
| Product-specific branding corrections | Confirmed correction matrix captured | See `gear_for_life_product_specific_branding_corrections_DRAFT.csv`. |
| Transform preview needs_review | Confirmed 8 category corrections | See Transform Preview Manual Corrections below. |
| Transform preview blocked rows | Confirmed discontinued | The 35 blocked items are supplier-discontinued and should remain blocked/unpublished. |

## SKU Identity Decisions

| Source row | Raw SKU | Product name | Decision |
|---:|---|---|---|
| 275 | `ODGPO` | Dri Gear Piped Ottoman Instinct Polo | Keep as `ODGPO`. |
| 281 | `ODGP` | Dri Gear Active Blitz Polo - Mens | Keep as `ODGP`. |
| 427 | `ODGP` | Dri Gear Active Polo - Mens | Normalize SKU to `ODGP(P)` in transform preview; retain raw SKU `ODGP` for audit. |

## Category Decisions

| SKU | Product | Decision status | Target category | Target subcategory | Notes |
|---|---|---|---|---|---|
| `POPIB` | Polar Ice 7.2L Bucket | confirmed | Outdoor & Sports | Picnic & BBQ | Outdoor/beach ice bucket. Not Barware as primary category. |
| `OVT` | Vantage Top | confirmed | Apparel | Sweatshirts | User confirmed proposed mapping. |
| `BHZQM` | Barkers Corporate Highlander Merino - Mens | confirmed | Apparel | Sweatshirts | User confirmed proposed mapping. |
| `WEGMCD` | Merino Cardigan - Womens | confirmed | Apparel | Sweatshirts | User confirmed proposed mapping. |
| `BT` | Ballistic Top | confirmed | Apparel | Sweatshirts | User confirmed proposed mapping. |
| `OTNT` | Transition Top | confirmed | Apparel | Sweatshirts | User confirmed proposed mapping. |
| `TNT` | Transition Top | confirmed | Apparel | Sweatshirts | User confirmed proposed mapping. |
| `PODCS` | Decadent Cocktail 10 pcs Set | confirmed | Barware & Accessories | Bar Accessories | User confirmed proposed mapping. |
| `PONS` | Nature Secateurs | confirmed | Tools & Auto | Tool Sets & Screwdrivers | User confirmed proposed mapping. |

## Transform Preview Manual Corrections

These decisions apply to `supplier_transform_preview` only. They do not write to `products` or publish storefront data.

| SKU | Product | Decision status | Target category | Target subcategory | Notes |
|---|---|---|---|---|---|
| `PODIGB` | Dig It Garden Box | confirmed | Tools & Auto | Tool Sets & Screwdrivers | User confirmed garden tool. Closest existing tree location. |
| `POGTT` | Grande Tavolo Table | confirmed | Outdoor & Sports | Picnic & BBQ | Foldable table with four wine glass holders. |
| `PORC` | Retro Cooler Box | confirmed | Outdoor & Sports | Picnic & BBQ | Cooler box for drinks. |
| `POTT` | Tavolo Table | confirmed | Outdoor & Sports | Picnic & BBQ | Alfresco table with dual integrated wine glass holders. |
| `POLTT` | Lungo Tavolo Table | confirmed | Outdoor & Sports | Picnic & BBQ | Beach/outdoor use with eight stemmed glasses and two bottles. |
| `POOMTT` | Ombrello Tavolo Table | confirmed | Outdoor & Sports | Picnic & BBQ | Four integrated wine glass holders and centre umbrella hole. |
| `POVCB` | Vintage Cooler Box | confirmed | Outdoor & Sports | Picnic & BBQ | Cooler box for drinks. |
| `IGOISB` | On-Ice 21L Sound Box | confirmed | Outdoor & Sports | Picnic & BBQ | Cooler box with speaker; primary use is outdoor drinks/cooler. |

The 35 blocked rows are supplier-confirmed discontinued. Keep them blocked and do not publish them unless product/category/price status is re-confirmed later.

## Rows To Exclude Or Block

| Source row | SKU | Product | Decision status | Suggested handling |
|---:|---|---|---|---|
| 438 | blank | DELETIONS | suggested | Exclude from transform; not a product. |

The 35 nonblank SKUs in the blank-category/no-product-price block should remain blocked/manual review unless category and product cost are supplied. Do not publish these by default.

SKUs: `BBYBS`, `BINB`, `BIO`, `BMB`, `BMW`, `BPMC`, `EGAS`, `GJ`, `OAN(C)`, `OASTOJ`, `ODGHP`, `OEGCP`, `OEGMCI`, `OTSZH`, `OWEGCP`, `OWEGMX`, `POAFP`, `POFWGS`, `POHF`, `POKGS`, `POMA`, `PORHFP`, `PORT`, `TAX`, `TEL`, `TFL`, `TMC`, `TSC`, `TTBL`, `TV`, `TYS`, `VT`, `WMWJ`, `WTFL`, `WTYS`.

## Product-Specific Branding Corrections

These are product-specific exceptions. Do not turn them into global rules.

Detailed confirmed option-level correction matrix:

`outputs/supplier_import_foundation/gear_for_life_pilot/gear_for_life_product_specific_branding_corrections_DRAFT.csv`

Confirmed common pricing notes:

- All prices are ex GST.
- All prices are branding/print costs only and do not include product base cost.
- Setup fees are charged once per order.
- `POA` means Price On Application and must become `request_quote` with `unit_cost = null`.
- Screen Print and Transfer Printing can carry extra packing/repacking fees. Preserve product-specific fee notes where supplied; do not invent missing fee amounts.
- `IGOISB` decoration area says "Size & Application on request", but user confirmed UVDTF pricing is available.
- `POWBC` and `POOMTT` Laser Engraving locations are POA with no fixed unit pricing.

### `PODCB` - Detroit 20L Cooler Box

User-provided screenshot shows two product-specific branding methods:

1. Screen Print
2. UVDTF Full Colour

Current parser/staging observations:

- UVDTF size price rows exist.
- Screen Print was conservatively parsed as `Pad Printing / Screen printing available - POA / request_quote`.
- UVDTF setup appears as `$25` in current preview, but screenshot shows `$55`.

Correction draft should represent:

| Method | Option/area | Qty/size | Cost/status | Setup | Notes |
|---|---|---|---|---|---|
| Screen Print | Cooler, 1 Colour | 25+, 50+, 100+, 250+ | `$15.00`, `$9.75`, `$8.70`, `$7.50` | `$90` | Product-specific. |
| Screen Print | Cooler, 2 Colour | 25+, 50+, 100+, 250+ | `$23.25`, `$15.25`, `$12.75`, `$11.25` | `$180` | Product-specific. |
| UVDTF Full Colour | Cooler 100x120mm | 1+, 10+, 25+, 50+, 100+ | `$16.60`, `$14.00`, `$11.40`, `$11.20`, `$11.00` | `$55` | Product-specific. |
| UVDTF Full Colour | Cooler 200x150mm | 1+, 10+, 25+, 50+, 100+ | `$20.50`, `$16.60`, `$14.00`, `$13.80`, `$13.50` | `$55` | Product-specific. |
| UVDTF Full Colour | Cooler 300x210mm | 1+, 10+, 25+, 50+, 100+ | `$27.00`, `$21.80`, `$16.60`, `$16.40`, `$16.00` | `$55` | Product-specific. |

Additional note from screenshot: packing/repacking fee `$2.50` per piece. Preserve as fee/note for later pricing layer review; do not hide it.

Suggested option keys should distinguish method + colour count or size, for example:

- `podcb|screen_print|cooler|1_colour`
- `podcb|screen_print|cooler|2_colour`
- `podcb|uvdtf_full_colour|cooler_100x120mm|100x120mm`
- `podcb|uvdtf_full_colour|cooler_200x150mm|200x150mm`
- `podcb|uvdtf_full_colour|cooler_300x210mm|300x210mm`

### `POOMTT` - Ombrello Tavolo Table

User-provided screenshot shows two product-specific branding methods:

1. Transfer Printing
2. Laser Engraving

Current parser/staging observations:

- Only Laser Engraving was captured.
- Laser Engraving captured `25+`, `50+`, `100+`, `250+` as POA/request_quote.
- Screenshot also has `500+` for Laser Engraving.
- Product-specific Transfer Printing was not captured for `POOMTT`.

Correction draft should represent:

| Method | Option/area | Qty/size | Cost/status | Setup | Notes |
|---|---|---|---|---|---|
| Transfer Printing | Full Colour Transfer 60x60mm | 25-49, 50-99, 100-249, 250+ | `$5.25`, `$4.50`, `$4.00`, POA | `$55` | Product-specific. `250+` is request_quote/null cost. |
| Transfer Printing | Full Colour Transfer 100x100mm | 25-49, 50-99, 100-249, 250+ | `$6.75`, `$5.25`, `$4.75`, POA | `$55` | Product-specific. `250+` is request_quote/null cost. |
| Transfer Printing | Full Colour Transfer 210x150mm | 25-49, 50-99, 100-249, 250+ | `$8.00`, `$6.25`, `$5.25`, POA | `$55` | Product-specific. `250+` is request_quote/null cost. |
| Transfer Printing | Full Colour Transfer 300x200mm | 25-49, 50-99, 100-249, 250+ | `$9.25`, `$7.00`, `$6.25`, POA | `$55` | Product-specific. `250+` is request_quote/null cost. |
| Laser Engraving | Slat / Leg | 25+, 50+, 100+, 250+, 500+ | POA for all tiers | `$75` | Product-specific request_quote/null cost. |

Additional note from screenshot: packing/repacking fee `$0.50` per piece for Transfer Printing. Preserve as fee/note for later pricing layer review.

Suggested option keys should distinguish method + area/size:

- `poomtt|transfer_printing|full_colour_transfer_60x60mm|60x60mm`
- `poomtt|transfer_printing|full_colour_transfer_100x100mm|100x100mm`
- `poomtt|transfer_printing|full_colour_transfer_210x150mm|210x150mm`
- `poomtt|transfer_printing|full_colour_transfer_300x200mm|300x200mm`
- `poomtt|laser_engraving|slat_leg|`

## Request Quote Branding Rows

These SKUs had product-specific request_quote/POA decoration evidence in current preview. User has now supplied confirmed pricing corrections for all 13 in `gear_for_life_product_specific_branding_corrections_DRAFT.csv`. Any remaining POA tiers should stay `request_quote` with `unit_cost = null`.

`IGOISB`, `IGSCFAK`, `PODCB`, `POEB`, `POEGB`, `POGB`, `POOMTT`, `POOPB`, `POPIB`, `PORC`, `POSWTS`, `POVCB`, `POWBC`.

Pricing correction matrix currently covers: `IGOISB`, `IGSCFAK`, `PODCB`, `POEB`, `POEGB`, `POGB`, `POOMTT`, `POOPB`, `POPIB`, `PORC`, `POSWTS`, `POVCB`, `POWBC`.

`POPIB` category is confirmed as `Outdoor & Sports / Picnic & BBQ`; user also supplied confirmed product-specific UVDTF Bucket pricing.

## Next Draft Step

After user confirms no more in-house branding screenshots are needed, generate a staging correction SQL draft only. The correction draft should target staging tables and should not write to `products`, navigation, URL pages, or published frontend data.
