-- Packaging live status check
-- READ ONLY. Run after packaging_set_live_UPDATE.sql.

select
  slug,
  status,
  noindex,
  product_filter
from public.url_pages
where slug in (
  'custom-packaging-australia',
  'custom-gift-boxes-australia',
  'custom-gift-bags-australia',
  'gift-tubes-australia',
  'custom-pouches-australia',
  'custom-tissue-paper-australia',
  'ribbons-and-gift-tags-australia',
  'greeting-cards-australia'
)
order by
  case slug
    when 'custom-packaging-australia' then 0
    when 'custom-gift-boxes-australia' then 1
    when 'custom-gift-bags-australia' then 2
    when 'gift-tubes-australia' then 3
    when 'custom-pouches-australia' then 4
    when 'custom-tissue-paper-australia' then 5
    when 'ribbons-and-gift-tags-australia' then 6
    when 'greeting-cards-australia' then 7
    else 99
  end;
