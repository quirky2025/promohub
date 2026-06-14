-- Key Rings live status check
-- READ ONLY. Run after keyrings_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'custom-keyrings-australia',
  'custom-metal-keyrings-australia',
  'leather-keyrings-australia',
  'silicone-keyrings-australia',
  'eco-keyrings-australia',
  'functional-keyrings-australia',
  'novelty-keyrings-australia'
)
order by
  case slug
    when 'custom-keyrings-australia' then 0
    when 'custom-metal-keyrings-australia' then 1
    when 'leather-keyrings-australia' then 2
    when 'silicone-keyrings-australia' then 3
    when 'eco-keyrings-australia' then 4
    when 'functional-keyrings-australia' then 5
    when 'novelty-keyrings-australia' then 6
    else 99
  end;
