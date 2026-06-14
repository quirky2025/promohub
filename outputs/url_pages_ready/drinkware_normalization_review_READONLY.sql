-- Drinkware normalization review detail
-- READ ONLY. One result set for Supabase export.
-- Purpose: review product-level suggested_subcategory before any batch update.

select
  id,
  supplier_sku,
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
  end as suggested_subcategory,
  case
    when subcategory ilike 'Drink Bottles%' and name ilike any (array['%tumbler%']) then 'Bottle subcategory, but product name says tumbler'
    when subcategory ilike 'Drink Bottles%' then 'Old bottle material split -> Drink Bottles'
    when subcategory = 'Glassware' then 'Already Glassware'
    when subcategory = 'Cups & Tumblers' and name ilike any (array['%wine glass%', '%beer glass%', '%cocktail glass%', '%whiskey glass%', '%whisky glass%', '%flute%', '%hiball%', '%hi ball%', '%low ball%', '%glass set%', '%glass cup%', '%carafe%', '%bormioli%', '%bordeaux%', '%chardonnay%', '%cognac%']) then 'Glassware keyword'
    when subcategory = 'Cups & Tumblers' and name ilike any (array['%teapot%', '%tea pot%', '%tea%', '%coffee plunger%', '%plunger%']) then 'Tea/plunger keyword'
    when subcategory = 'Cups & Tumblers' and name ilike any (array['%mug%']) and name not ilike any (array['%vacuum mug%', '%travel mug%']) then 'Mug keyword'
    when subcategory = 'Cups & Tumblers' and name ilike any (array['%coffee cup%', '%keep cup%', '%keepcup%', '%reusable cup%']) then 'Coffee cup keyword'
    when subcategory = 'Cups & Tumblers' and name ilike any (array['%vacuum mug%', '%travel mug%']) then 'Travel/vacuum mug keyword'
    when subcategory = 'Cups & Tumblers' and name ilike any (array['%tumbler%', '%vacuum cup%', '%double wall cup%', '%colour changing cup%', '%color changing cup%']) then 'Tumbler/vacuum cup keyword'
    when subcategory = 'Cups & Tumblers' and name ilike any (array['%cup%']) then 'Generic cup keyword'
    else 'No rule; keep current subcategory'
  end as rule_reason,
  is_published
from public.products
where category = 'Drinkware'
order by suggested_subcategory, current_subcategory, name;

