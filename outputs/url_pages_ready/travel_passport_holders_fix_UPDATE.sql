-- Travel Passport Holders correction
-- Run after travel_live_preflight_READONLY.sql showed passport-holders-australia has 0 products.
-- Moves passport wallet / passport holder products from Travel Wallets to Passport Holders.

begin;

with target as (
  select
    id,
    is_published,
    name,
    category,
    subcategory
  from public.products
  where category = 'Travel'
    and lower(name) ~ 'passport'
    and subcategory is distinct from 'Passport Holders'
),
updated as (
  update public.products p
  set subcategory = 'Passport Holders'
  from target t
  where p.id = t.id
  returning p.id, p.is_published, p.name, p.category, p.subcategory
)
select
  count(*) as updated_rows,
  count(*) filter (where is_published = true) as updated_published_rows,
  jsonb_agg(name order by name) as updated_products
from updated;

commit;
