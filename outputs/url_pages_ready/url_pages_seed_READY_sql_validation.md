# url_pages READY SQL Validation

## Result

| Check | Result |
|---|---:|
| Seed rows embedded | 176 |
| Dry-run writes data | False |
| Upsert includes commit | True |
| Column count | 23 |

## Generated Files

- `url_pages_seed_READY_dry_run.sql`
- `url_pages_seed_READY_upsert.sql`
- `url_pages_seed_READY_sql_validation.json`

## Run Order Later

1. Run `url_pages_seed_READY_dry_run.sql`.
2. Confirm detail checks return zero rows.
3. Run `url_pages_seed_READY_upsert.sql`.

The upsert SQL does not delete existing rows. It inserts or updates by `slug`.
