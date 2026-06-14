-- Personal Care live status check
-- READ ONLY. Run after personal_care_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'branded-personal-care-products-australia',
  'custom-lip-balm-australia',
  'custom-hand-sanitiser-australia',
  'custom-face-masks-australia',
  'sunscreen-australia',
  'first-aid-kits-australia',
  'manicure-sets-australia',
  'compact-mirrors-australia',
  'bath-and-body-gifts-australia',
  'grooming-products-australia'
)
order by
  case slug
    when 'branded-personal-care-products-australia' then 0
    when 'custom-lip-balm-australia' then 1
    when 'custom-hand-sanitiser-australia' then 2
    when 'custom-face-masks-australia' then 3
    when 'sunscreen-australia' then 4
    when 'first-aid-kits-australia' then 5
    when 'manicure-sets-australia' then 6
    when 'compact-mirrors-australia' then 7
    when 'bath-and-body-gifts-australia' then 8
    when 'grooming-products-australia' then 9
    else 99
  end;
