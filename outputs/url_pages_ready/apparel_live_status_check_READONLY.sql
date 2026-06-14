-- Apparel live status check
-- READ ONLY. Run after apparel_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'custom-branded-apparel-australia',
  'custom-t-shirts-australia',
  'custom-polo-shirts-australia',
  'custom-hoodies-australia',
  'custom-sweatshirts-australia',
  'custom-jackets-australia',
  'custom-shirts-australia',
  'custom-vests-australia',
  'workwear-pants-and-shorts-australia',
  'branded-workwear-australia',
  'custom-teamwear-australia',
  'custom-aprons-australia',
  'custom-socks-australia',
  'branded-scarves-and-accessories-australia',
  'branded-apparel-accessories-australia'
)
order by
  case slug
    when 'custom-branded-apparel-australia' then 0
    when 'custom-t-shirts-australia' then 1
    when 'custom-polo-shirts-australia' then 2
    when 'custom-hoodies-australia' then 3
    when 'custom-sweatshirts-australia' then 4
    when 'custom-jackets-australia' then 5
    when 'custom-shirts-australia' then 6
    when 'custom-vests-australia' then 7
    when 'workwear-pants-and-shorts-australia' then 8
    when 'branded-workwear-australia' then 9
    when 'custom-teamwear-australia' then 10
    when 'custom-aprons-australia' then 11
    when 'custom-socks-australia' then 12
    when 'branded-scarves-and-accessories-australia' then 13
    when 'branded-apparel-accessories-australia' then 14
    else 99
  end;
