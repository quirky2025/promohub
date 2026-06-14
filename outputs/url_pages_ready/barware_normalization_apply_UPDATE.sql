-- Barware & Accessories normalization APPLY
-- Run only after reviewing barware_normalization_summary_READONLY.sql.
-- Updates only products with a clear target.
-- Leaves manual-review rows untouched.

begin;

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
  where p.category = 'Barware & Accessories'
    or (
      p.category = 'Promotion'
      and lower(coalesce(p.subcategory, '')) in (
        'coasters',
        'bottle openers',
        'stubby holders',
        'stubby & can holders',
        'bar mats'
      )
    )
    or (
      p.category in ('Home & Living', 'Leisure')
      and (
        lower(coalesce(p.subcategory, '')) in (
          'bar accessories',
          'wine accessories',
          'coasters',
          'bottle openers',
          'stubby holders',
          'stubby & can holders',
          'bar mats'
        )
        or lower(concat_ws(' ', p.name, p.subcategory, p.materials, p.description)) ~
          '(coaster|bottle\s+opener|corkscrew|waiter''?s\s+knife|bar\s+mat|stubby|can\s+holder|koozie|wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|whisk(e)?y|hip\s+flask|ice\s+bucket|drinking\s+straw|reusable\s+straw|cocktail)'
      )
    )
),
suggested as (
  select
    *,
    case
      when lower(name) ~ '(coaster)'
        then 'Barware & Accessories'
      when lower(name) ~ '(bar\s+mat|bar\s+runner|counter\s+mat)'
        then 'Barware & Accessories'
      when lower(name) ~ '(stubby|can\s+holder|koozie)'
        then 'Barware & Accessories'
      when lower(name) ~ '(bottle\s+opener|corkscrew|waiter''?s\s+knife)'
        then 'Barware & Accessories'
      when lower(name) ~ '(wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|wine\s+box|wine\s+gift\s+set|whisk(e)?y|hip\s+flask|ice\s+bucket|bottle\s+stopper)'
        then 'Barware & Accessories'
      when lower(name) ~ '(drinking\s+straw|reusable\s+straw|cocktail\s+straw|straw\s+set|silicone\s+straw|stainless\s+steel\s+straw|cocktail|swizzle|jigger|bar\s+spoon|bar\s+blade)'
        then 'Barware & Accessories'
      when lower(name) ~ '(multi-tool|multi\s+tool|pocket\s+knife)'
        then 'Tools & Auto'
      when lower(name) ~ '(cheese\s+board|serving\s+board|grazing\s+board|charcuterie|lazy\s+susan|pizza\s+set|pizza\s+board)'
        then 'Home & Living'
      when haystack_lower ~ '(wine\s+carrier|wine\s+carry|wine\s+bag|wine\s+crate|wine\s+drawstring\s+bag|wine\s+tote)'
        then 'Bags'
      when haystack_lower ~ '(cooler\s+bag|lunch\s+bag|toiletry\s+bag|cosmetic\s+bag|pouch)'
        then 'Bags'
      when haystack_lower ~ '(wine\s+glass|beer\s+glass|champagne\s+glass|shot\s+glass|whisk(e)?y\s+glass|goblet|glassware)'
        then 'Drinkware'
      when haystack_lower ~ '(drink\s+bottle|water\s+bottle|sport\s+bottle|coffee\s+cup|travel\s+mug|tumbler|ceramic\s+mug|(^|[^a-z])mug([^a-z]|$)|(^|[^a-z])cup([^a-z]|$))'
        then 'Drinkware'
      when haystack_lower ~ '(gift\s+box|packaging|gift\s+tube|tissue\s+paper|wrapping\s+paper|ribbon|gift\s+tag|greeting\s+card|message\s+card)'
        then 'Packaging'
      when haystack_lower ~ '(coaster)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(bar\s+mat)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(stubby|can\s+holder|koozie)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(bottle\s+opener|corkscrew|waiter''?s\s+knife)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|wine\s+box|wine\s+gift\s+set|whisk(e)?y|hip\s+flask|ice\s+bucket|bottle\s+stopper)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(drinking\s+straw|reusable\s+straw|cocktail\s+straw|straw\s+set|cocktail|swizzle|jigger|bar\s+spoon|bar\s+blade)'
        then 'Barware & Accessories'
      when subcategory_lower in ('coasters', 'bottle openers', 'stubby holders', 'stubby & can holders', 'bar mats', 'wine accessories', 'bar accessories')
        then 'Barware & Accessories'
      else null
    end as suggested_category,
    case
      when lower(name) ~ '(coaster)'
        then 'Coasters'
      when lower(name) ~ '(bar\s+mat|bar\s+runner|counter\s+mat)'
        then 'Bar Mats'
      when lower(name) ~ '(stubby|can\s+holder|koozie)'
        then 'Stubby Holders'
      when lower(name) ~ '(bottle\s+opener|corkscrew|waiter''?s\s+knife)'
        then 'Bottle Openers'
      when lower(name) ~ '(wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|wine\s+box|wine\s+gift\s+set|whisk(e)?y|hip\s+flask|ice\s+bucket|bottle\s+stopper)'
        then 'Wine Accessories'
      when lower(name) ~ '(drinking\s+straw|reusable\s+straw|cocktail\s+straw|straw\s+set|silicone\s+straw|stainless\s+steel\s+straw|cocktail|swizzle|jigger|bar\s+spoon|bar\s+blade)'
        then 'Bar Accessories'
      when lower(name) ~ '(multi-tool|multi\s+tool|pocket\s+knife)'
        then 'Multi-Tools'
      when lower(name) ~ '(cheese\s+board|serving\s+board|grazing\s+board|charcuterie|lazy\s+susan|pizza\s+set|pizza\s+board)'
        then 'Cheese & Serving Boards'
      when haystack_lower ~ '(wine\s+carrier|wine\s+carry|wine\s+bag|wine\s+crate|wine\s+drawstring\s+bag|wine\s+tote)'
        then 'Wine Carriers'
      when haystack_lower ~ '(cooler\s+bag|lunch\s+bag)'
        then 'Cooler Bags'
      when haystack_lower ~ '(toiletry\s+bag|cosmetic\s+bag|pouch)'
        then 'Toiletry Bags'
      when haystack_lower ~ '(wine\s+glass|beer\s+glass|champagne\s+glass|shot\s+glass|whisk(e)?y\s+glass|goblet|glassware)'
        then 'Glassware'
      when haystack_lower ~ '(drink\s+bottle|water\s+bottle|sport\s+bottle)'
        then 'Drink Bottles'
      when haystack_lower ~ '(coffee\s+cup)'
        then 'Coffee Cups'
      when haystack_lower ~ '(travel\s+mug)'
        then 'Travel Mugs'
      when haystack_lower ~ '(tumbler)'
        then 'Tumblers'
      when haystack_lower ~ '(ceramic\s+mug|(^|[^a-z])mug([^a-z]|$)|(^|[^a-z])cup([^a-z]|$))'
        then 'Mugs'
      when haystack_lower ~ '(gift\s+box|packaging|gift\s+tube|tissue\s+paper|wrapping\s+paper|ribbon|gift\s+tag|greeting\s+card|message\s+card)'
        then 'Gift Boxes'
      when haystack_lower ~ '(coaster)'
        then 'Coasters'
      when haystack_lower ~ '(bar\s+mat)'
        then 'Bar Mats'
      when haystack_lower ~ '(stubby|can\s+holder|koozie)'
        then 'Stubby Holders'
      when haystack_lower ~ '(bottle\s+opener|corkscrew|waiter''?s\s+knife)'
        then 'Bottle Openers'
      when haystack_lower ~ '(wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|wine\s+box|wine\s+gift\s+set|whisk(e)?y|hip\s+flask|ice\s+bucket|bottle\s+stopper)'
        then 'Wine Accessories'
      when haystack_lower ~ '(drinking\s+straw|reusable\s+straw|cocktail\s+straw|straw\s+set|cocktail|swizzle|jigger|bar\s+spoon|bar\s+blade)'
        then 'Bar Accessories'
      when subcategory_lower = 'coasters'
        then 'Coasters'
      when subcategory_lower = 'bottle openers'
        then 'Bottle Openers'
      when subcategory_lower in ('stubby holders', 'stubby & can holders')
        then 'Stubby Holders'
      when subcategory_lower = 'bar mats'
        then 'Bar Mats'
      when subcategory_lower = 'wine accessories'
        then 'Wine Accessories'
      when subcategory_lower = 'bar accessories'
        then 'Bar Accessories'
      else null
    end as suggested_subcategory
  from classified
),
updated as (
  update public.products p
  set
    category = s.suggested_category,
    subcategory = s.suggested_subcategory
  from suggested s
  where p.id = s.id
    and s.suggested_category is not null
    and s.suggested_subcategory is not null
    and (
      p.category is distinct from s.suggested_category
      or p.subcategory is distinct from s.suggested_subcategory
    )
  returning
    p.id,
    p.name,
    s.current_category,
    s.current_subcategory,
    p.category as new_category,
    p.subcategory as new_subcategory,
    p.is_published
)
select
  count(*) as updated_rows,
  count(*) filter (where is_published = true) as updated_published_rows,
  count(*) filter (where new_category = 'Barware & Accessories') as updated_to_barware,
  count(*) filter (where new_category = 'Bags') as updated_to_bags,
  count(*) filter (where new_category = 'Drinkware') as updated_to_drinkware,
  count(*) filter (where new_category = 'Packaging') as updated_to_packaging,
  count(*) filter (where new_category = 'Home & Living') as updated_to_home_living,
  count(*) filter (where new_category = 'Tools & Auto') as updated_to_tools_auto
from updated;

commit;
