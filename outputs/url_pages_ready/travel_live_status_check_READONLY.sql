-- Travel live status check
-- READ ONLY. Run after travel_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'branded-travel-accessories-australia',
  'custom-luggage-tags-australia',
  'passport-holders-australia',
  'travel-wallets-australia',
  'travel-pillows-australia',
  'travel-accessories-australia'
)
order by
  case slug
    when 'branded-travel-accessories-australia' then 0
    when 'custom-luggage-tags-australia' then 1
    when 'passport-holders-australia' then 2
    when 'travel-wallets-australia' then 3
    when 'travel-pillows-australia' then 4
    when 'travel-accessories-australia' then 5
    else 99
  end;
