-- Bags live status check
-- READ ONLY. Run after bags_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'custom-bags-australia',
  'custom-tote-bags-australia',
  'custom-cotton-tote-bags-australia',
  'custom-cooler-bags-australia',
  'custom-backpacks-australia',
  'custom-paper-bags-australia',
  'custom-drawstring-bags-australia',
  'custom-duffle-bags-australia',
  'custom-toiletry-bags-australia',
  'jute-bags-australia',
  'custom-laptop-bags-australia',
  'wine-carriers-australia',
  'crossbody-bags-australia',
  'satchel-bags-australia',
  'dry-bags-australia'
)
order by
  case slug
    when 'custom-bags-australia' then 0
    when 'custom-tote-bags-australia' then 1
    when 'custom-cotton-tote-bags-australia' then 2
    when 'custom-cooler-bags-australia' then 3
    when 'custom-backpacks-australia' then 4
    when 'custom-paper-bags-australia' then 5
    when 'custom-drawstring-bags-australia' then 6
    when 'custom-duffle-bags-australia' then 7
    when 'custom-toiletry-bags-australia' then 8
    when 'jute-bags-australia' then 9
    when 'custom-laptop-bags-australia' then 10
    when 'wine-carriers-australia' then 11
    when 'crossbody-bags-australia' then 12
    when 'satchel-bags-australia' then 13
    when 'dry-bags-australia' then 14
    else 99
  end;
