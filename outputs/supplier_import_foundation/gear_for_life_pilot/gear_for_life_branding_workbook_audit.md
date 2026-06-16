# Gear For Life Branding Workbook Audit

Source workbook:

`C:\Users\jilin\Desktop\supplier\gearforlife\The Source Branding Price List - Combined.xlsx`

## Summary

- Product-specific SKUs: 75
- Product-specific decoration options: 273
- Product-specific decoration price rows: 1069
- General rate cards: 2
- General rate card rows: 160
- Option status counts: `{'priced': 254, 'unavailable': 4, 'request_quote': 15}`
- Price row status counts: `{'priced': 1037, 'unavailable': 4, 'request_quote': 28}`
- General rate row status counts: `{'priced': 132, 'request_quote': 28}`

## Method Counts

- Pad Printing: 129
- Laser Engraving: 91
- UVDTF Full Colour - Small: 32
- UVDTF Full Colour - Large: 21

## Special Handling

- Rows with `POA` are preserved with `price_status = request_quote`; prices are not guessed and `unit_cost` stays blank.
- Rows such as `Knife decoration is not applicable` are preserved with `price_status = unavailable`.
- The Transfer Printing and Embroidery sections are general rate cards, not product-specific SKU rows.
- Transfer Printing uses `rate_card_key = transfer_printing_bags` and applies to all Bags.
- Transfer Printing is the default fallback for bag products when no product-specific decoration method is supplied.
- Embroidery source matrix is retained for audit.
- Embroidery frontend pricing rule is Gear For Life only: base 5,000 stitches, then +$0.50 per additional 1,000 stitches.
- The import layer stores supplier cost only; margin belongs in the quote/pricing layer.

## Output Preview Files

- `gear_for_life_branding_options_FROM_XLSX_PREVIEW.csv`
- `gear_for_life_branding_price_rows_FROM_XLSX_PREVIEW.csv`
- `gear_for_life_branding_general_rate_cards_FROM_XLSX_PREVIEW.csv`
- `gear_for_life_branding_general_rate_card_rows_FROM_XLSX_PREVIEW.csv`

## Unavailable Decoration Rows

- Row 31: POBCS / Knife decoration / Knife decoration is not applicable
- Row 35: POBCK / Knife decoration / Knife decoration is not applicable
- Row 82: POE6KS / Knife decoration / Knife decoration is not applicable
- Row 92: POFCK / Knife decoration / Knife decoration is not applicable
