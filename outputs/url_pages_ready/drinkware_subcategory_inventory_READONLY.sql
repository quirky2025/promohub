-- Drinkware current product subcategory inventory
-- READ ONLY. Use this when Drinkware URL preflight shows empty subcategory pages.
-- Goal: reveal current products.subcategory values under category = Drinkware.

select
  coalesce(nullif(trim(subcategory), ''), '(blank)') as current_subcategory,
  count(*) as published_products
from public.products
where is_published = true
  and category = 'Drinkware'
group by coalesce(nullif(trim(subcategory), ''), '(blank)')
order by published_products desc, current_subcategory;

-- Keyword spot-check for the 3 empty target pages:
-- Drink Bottles / Mugs / Tumblers may currently live under older or more specific subcategory names.

select
  'drink_bottle_keyword_samples' as check_name,
  id,
  name,
  category,
  subcategory
from public.products
where is_published = true
  and category = 'Drinkware'
  and (
    name ilike '%bottle%'
    or subcategory ilike '%bottle%'
  )
order by subcategory, name
limit 80;

select
  'mug_keyword_samples' as check_name,
  id,
  name,
  category,
  subcategory
from public.products
where is_published = true
  and category = 'Drinkware'
  and (
    name ilike '%mug%'
    or subcategory ilike '%mug%'
  )
order by subcategory, name
limit 80;

select
  'tumbler_keyword_samples' as check_name,
  id,
  name,
  category,
  subcategory
from public.products
where is_published = true
  and category = 'Drinkware'
  and (
    name ilike '%tumbler%'
    or subcategory ilike '%tumbler%'
  )
order by subcategory, name
limit 80;

