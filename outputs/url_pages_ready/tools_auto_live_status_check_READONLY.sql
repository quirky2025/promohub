-- Tools & Auto live status check
-- READ ONLY. Run after tools_auto_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'branded-tools-and-car-accessories-australia',
  'custom-multi-tools-australia',
  'custom-tape-measures-australia',
  'custom-torches-australia',
  'tool-sets-australia',
  'car-accessories-australia'
)
order by
  case slug
    when 'branded-tools-and-car-accessories-australia' then 0
    when 'custom-multi-tools-australia' then 1
    when 'custom-tape-measures-australia' then 2
    when 'custom-torches-australia' then 3
    when 'tool-sets-australia' then 4
    when 'car-accessories-australia' then 5
    else 99
  end;
