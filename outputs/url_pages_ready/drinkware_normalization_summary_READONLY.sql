-- Drinkware normalization summary
-- READ ONLY. One result set for Supabase export.
-- Purpose: estimate where current Drinkware products should go in the new subcategory dictionary.

with classified as (
  select
    id,
    name,
    category,
    subcategory as current_subcategory,
    case
      when subcategory ilike 'Drink Bottles%' and name ilike any (array['%tumbler%']) then 'Tumblers'
      when subcategory ilike 'Drink Bottles%' then 'Drink Bottles'

      when subcategory = 'Glassware' then 'Glassware'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array[
          '%wine glass%', '%beer glass%', '%cocktail glass%', '%whiskey glass%',
          '%whisky glass%', '%flute%', '%hiball%', '%hi ball%', '%low ball%',
          '%glass set%', '%glass cup%', '%carafe%', '%bormioli%', '%bordeaux%',
          '%chardonnay%', '%cognac%'
        ])
        then 'Glassware'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%teapot%', '%tea pot%', '%tea%', '%coffee plunger%', '%plunger%'])
        then 'Teaware'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%mug%'])
        and name not ilike any (array['%vacuum mug%', '%travel mug%'])
        then 'Mugs'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%coffee cup%', '%keep cup%', '%keepcup%', '%reusable cup%'])
        then 'Coffee Cups'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%vacuum mug%', '%travel mug%'])
        then 'Travel Mugs'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%tumbler%', '%vacuum cup%', '%double wall cup%', '%colour changing cup%', '%color changing cup%'])
        then 'Tumblers'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%cup%'])
        then 'Coffee Cups'

      else subcategory
    end as suggested_subcategory
  from public.products
  where category = 'Drinkware'
)
select
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  coalesce(suggested_subcategory, '(blank)') as suggested_subcategory,
  count(*) filter (where true) as total_products,
  count(*) filter (where exists (
    select 1
    from public.products p
    where p.id = classified.id and p.is_published = true
  )) as published_products
from classified
group by current_subcategory, suggested_subcategory
order by suggested_subcategory, current_subcategory;

