-- Barware & Accessories live status check
-- READ ONLY. Run after barware_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'branded-barware-australia',
  'custom-coasters-australia',
  'custom-bottle-openers-australia',
  'custom-stubby-holders-australia',
  'custom-bar-mats-australia',
  'branded-wine-accessories-australia',
  'bar-accessories-australia'
)
order by
  case slug
    when 'branded-barware-australia' then 0
    when 'custom-coasters-australia' then 1
    when 'custom-bottle-openers-australia' then 2
    when 'custom-stubby-holders-australia' then 3
    when 'custom-bar-mats-australia' then 4
    when 'branded-wine-accessories-australia' then 5
    when 'bar-accessories-australia' then 6
    else 99
  end;
