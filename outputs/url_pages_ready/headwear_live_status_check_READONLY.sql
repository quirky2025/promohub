-- Headwear live status check
-- READ ONLY. Run after headwear_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'custom-headwear-australia',
  'custom-caps-australia',
  'custom-beanies-australia',
  'custom-bucket-hats-australia',
  'custom-wide-brim-hats-australia',
  'straw-hats-australia',
  'custom-visors-australia',
  'novelty-headwear-australia'
)
order by
  case slug
    when 'custom-headwear-australia' then 0
    when 'custom-caps-australia' then 1
    when 'custom-beanies-australia' then 2
    when 'custom-bucket-hats-australia' then 3
    when 'custom-wide-brim-hats-australia' then 4
    when 'straw-hats-australia' then 5
    when 'custom-visors-australia' then 6
    when 'novelty-headwear-australia' then 7
    else 99
  end;
