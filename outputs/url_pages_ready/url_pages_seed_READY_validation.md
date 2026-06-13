# url_pages Seed READY Validation

## Result

| Check | Result |
|---|---|
| READY status | PASS |
| Total rows | 176 |
| Category master rows | 165 |
| Kits & Bundles rows | 11 |
| Duplicate slugs | 0 |
| Reserved slug conflicts | 0 |
| Missing breadcrumb parents | 0 |
| Invalid page_type values | 0 |
| Invalid source_type values | 0 |
| Meta with Chinese/mojibake markers | 0 |
| Bad product_filter values | 0 |
| Bad canonical_url values | 0 |

## Counts

### page_type

| page_type | rows |
|---|---:|
| product_category | 165 |
| collection | 10 |
| landing | 1 |

### source_type

| source_type | rows |
|---|---:|
| category | 21 |
| subcategory | 138 |
| manual | 6 |
| collection | 11 |

### page_role Audit

| page_role | rows |
|---|---:|
| category | 20 |
| primary_subcategory | 138 |
| seo_filter_page | 6 |
| merged_category_primary | 1 |
| kit_collection | 10 |
| kit_template | 1 |

## Visibility Counts

| Flag | Rows |
|---|---:|
| show_in_nav=true | 171 |
| show_in_home=true | 12 |
| show_in_footer=true | 7 |

## Required Corrections Applied

- Pet category/subcategory nav flags are false: `{'branded-pet-products-australia': False, 'custom-pet-accessories-australia': False}`
- Confectionery is one merged row: `promotional-confectionery-australia`
- Kits & Bundles uses `source_type=collection`; `product_filter.type=kit_collection`
- Meta descriptions regenerated in English only for category master rows
- `canonical_url` generated as `/{slug}`

## Output Files

- `url_pages_seed_READY.json`
- `url_pages_seed_READY.csv`
- `url_pages_seed_READY_audit.csv`
- `url_pages_seed_READY_validation.json`
