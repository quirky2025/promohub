-- Home & Living normalization APPLY
-- Run only after reviewing home_living_normalization_summary_READONLY.sql.
-- Updates only products with a clear target.
-- Leaves manual-review rows untouched.

begin;

with classified as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(p.name) as name_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
  where p.category = 'Home & Living'
    or (
      p.category = 'Leisure'
      and lower(coalesce(p.subcategory, '')) in (
        'home & living',
        'kitchen & home',
        'kitchen & dining',
        'candles',
        'cheese boards'
      )
    )
    or (
      p.category = 'Personal Care'
      and lower(coalesce(p.subcategory, '')) = 'candles & diffusers'
    )
),
suggested as (
  select
    *,
    case
      when supplier_sku in ('124699', '122319', '122320', '124805', '122438', '122437', '122436', '120339', '122271', '122272', '122279', '126521', '120847', '126685', '126686', '118120', '118121', '118122', '126682')
        then 'Home & Living'
      when supplier_sku = '122317'
        then 'Home & Living'
      when supplier_sku in ('120901', '129574')
        then 'Home & Living'
      when supplier_sku = '124417'
        then 'Outdoor & Sports'
      when supplier_sku = '110518'
        then 'Apparel'
      when supplier_sku = '109062'
        then 'Tools & Auto'
      when supplier_sku in ('117757', '123704', '123703', '120240')
        then 'Toys & Games'
      when supplier_sku = '116799'
        then 'Barware & Accessories'
      when supplier_sku = '116039'
        then 'Travel'
      when haystack_lower ~ '(toiletry\s+bag|cosmetic\s+bag|makeup\s+bag|wash\s+bag|cooler\s+bag|lunch\s+bag)'
        then 'Bags'
      when haystack_lower ~ '(car\s+sunshade|sunshade\s+set|car\s+shade)'
        then 'Tools & Auto'
      when haystack_lower ~ '(soap\s+holder|bath\s+caddy)'
        then 'Personal Care'
      when haystack_lower ~ '(^|[^a-z])(pet|dog|cat|leash)([^a-z]|$)|pet\s+bandana|pet\s+bowl'
        then 'Pet'
      when haystack_lower ~ '(coaster)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(bottle\s+opener|corkscrew|waiter''?s\s+knife)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(bar\s+mat|stubby|can\s+holder|koozie)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|whisk(e)?y|hip\s+flask|ice\s+bucket)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(drinking\s+straw|reusable\s+straw|cocktail\s+straw|straw\s+set|cocktail|swizzle)'
        then 'Barware & Accessories'
      when haystack_lower ~ '(tea\s+towel|dish\s+cloth|ice\s+tray|coffee\s+plunger|coffee\s+press|french\s+press|oven\s+mitt|sponge|place\s*mat)'
        then 'Home & Living'
      when haystack_lower ~ '(puffer\s+blanket|picnic\s+blanket|outdoor\s+blanket|beach\s+blanket|travel\s+blanket)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(beach\s+towel|sports?\s+towel|gym\s+towel|sand\s+free|towel)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(picnic\s+blanket|outdoor\s+blanket|beach\s+blanket)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(yoga\s+mat|exercise\s+mat)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(picnic|bbq|barbecue)'
        then 'Outdoor & Sports'
      when subcategory_lower = 'candles & diffusers'
        or subcategory_lower = 'candles'
        or haystack_lower ~ '(candle|diffuser|aroma|scented)'
        then 'Home & Living'
      when subcategory_lower = 'cheese & serving boards'
        or subcategory_lower = 'cheese boards'
        or haystack_lower ~ '(cheese\s+board|serving\s+board|serveware|charcuterie|tasting\s+board|pizza\s+peel|lazy\s+susan|fromage|tapas|cheese\s+knife|carving\s+set)'
        then 'Home & Living'
      when haystack_lower ~ '(lamp|lantern|night\s+light|photo\s+frame|picture\s+frame|cushion|pillow|home\s+decor|decorative|valet\s+tray|sewing\s+kit|weather\s+station)'
        then 'Home & Living'
      when subcategory_lower in ('kitchen & dining', 'kitchen & home')
        or haystack_lower ~ '(kitchen|cutting\s+board|chopping\s+board|knife\s+set|cutlery|utensil|lunch\s+box|bento|food\s+container|placemat|tea\s+towel|dish\s+cloth|ice\s+tray|coffee\s+plunger|coffee\s+press|french\s+press|oven\s+mitt|sponge|place\s*mat)'
        then 'Home & Living'
      when subcategory_lower = 'home decor'
        or haystack_lower ~ '(lamp|lantern|night\s+light|photo\s+frame|picture\s+frame|cushion|pillow|home\s+decor|decorative)'
        then 'Home & Living'
      else null
    end as suggested_category,
    case
      when supplier_sku in ('124699', '122319', '122320', '124805', '122438', '122437', '122436', '120339', '122271', '122272', '122279', '126521', '120847', '126685', '126686', '118120', '118121', '118122', '126682')
        then 'Kitchen & Dining'
      when supplier_sku = '122317'
        then 'Cheese & Serving Boards'
      when supplier_sku in ('120901', '129574')
        then 'Home Decor'
      when supplier_sku = '124417'
        then 'Blankets'
      when supplier_sku = '110518'
        then 'Apparel Accessories'
      when supplier_sku = '109062'
        then 'Tape Measures'
      when supplier_sku in ('117757')
        then 'Novelty Toys'
      when supplier_sku in ('123704', '123703', '120240')
        then 'Games & Puzzles'
      when supplier_sku = '116799'
        then 'Bar Accessories'
      when supplier_sku = '116039'
        then 'Travel Accessories'
      when haystack_lower ~ '(toiletry\s+bag|cosmetic\s+bag|makeup\s+bag|wash\s+bag)'
        then 'Toiletry Bags'
      when haystack_lower ~ '(cooler\s+bag|lunch\s+bag)'
        then 'Cooler Bags'
      when haystack_lower ~ '(car\s+sunshade|sunshade\s+set|car\s+shade)'
        then 'Car Accessories'
      when haystack_lower ~ '(soap\s+holder|bath\s+caddy)'
        then 'Bath & Body'
      when haystack_lower ~ '(^|[^a-z])(pet|dog|cat|leash)([^a-z]|$)|pet\s+bandana|pet\s+bowl'
        then 'Pet Accessories'
      when haystack_lower ~ '(coaster)'
        then 'Coasters'
      when haystack_lower ~ '(bottle\s+opener|corkscrew|waiter''?s\s+knife)'
        then 'Bottle Openers'
      when haystack_lower ~ '(bar\s+mat)'
        then 'Bar Mats'
      when haystack_lower ~ '(stubby|can\s+holder|koozie)'
        then 'Stubby Holders'
      when haystack_lower ~ '(wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|whisk(e)?y|hip\s+flask|ice\s+bucket)'
        then 'Wine Accessories'
      when haystack_lower ~ '(drinking\s+straw|reusable\s+straw|cocktail\s+straw|straw\s+set|cocktail|swizzle)'
        then 'Bar Accessories'
      when haystack_lower ~ '(tea\s+towel|dish\s+cloth|ice\s+tray|coffee\s+plunger|coffee\s+press|french\s+press|oven\s+mitt|sponge|place\s*mat)'
        then 'Kitchen & Dining'
      when haystack_lower ~ '(puffer\s+blanket|picnic\s+blanket|outdoor\s+blanket|beach\s+blanket|travel\s+blanket)'
        then 'Blankets'
      when haystack_lower ~ '(beach\s+towel|sports?\s+towel|gym\s+towel|sand\s+free|towel)'
        then 'Towels'
      when haystack_lower ~ '(picnic\s+blanket|outdoor\s+blanket|beach\s+blanket)'
        then 'Blankets'
      when haystack_lower ~ '(yoga\s+mat|exercise\s+mat)'
        then 'Sports Products'
      when haystack_lower ~ '(picnic|bbq|barbecue)'
        then 'Picnic & BBQ'
      when subcategory_lower = 'candles & diffusers'
        or subcategory_lower = 'candles'
        or haystack_lower ~ '(candle|diffuser|aroma|scented)'
        then 'Candles & Diffusers'
      when subcategory_lower = 'cheese & serving boards'
        or subcategory_lower = 'cheese boards'
        or haystack_lower ~ '(cheese\s+board|serving\s+board|serveware|charcuterie|tasting\s+board|pizza\s+peel|lazy\s+susan|fromage|tapas|cheese\s+knife|carving\s+set)'
        then 'Cheese & Serving Boards'
      when haystack_lower ~ '(lamp|lantern|night\s+light|photo\s+frame|picture\s+frame|cushion|pillow|home\s+decor|decorative|valet\s+tray|sewing\s+kit|weather\s+station)'
        then 'Home Decor'
      when subcategory_lower in ('kitchen & dining', 'kitchen & home')
        or haystack_lower ~ '(kitchen|cutting\s+board|chopping\s+board|knife\s+set|cutlery|utensil|lunch\s+box|bento|food\s+container|placemat|tea\s+towel|dish\s+cloth|ice\s+tray|coffee\s+plunger|coffee\s+press|french\s+press|oven\s+mitt|sponge|place\s*mat)'
        then 'Kitchen & Dining'
      when subcategory_lower = 'home decor'
        or haystack_lower ~ '(lamp|lantern|night\s+light|photo\s+frame|picture\s+frame|cushion|pillow|home\s+decor|decorative)'
        then 'Home Decor'
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
  count(*) filter (where new_category = 'Home & Living') as updated_to_home_living,
  count(*) filter (where new_category = 'Barware & Accessories') as updated_to_barware,
  count(*) filter (where new_category = 'Outdoor & Sports') as updated_to_outdoor_sports,
  count(*) filter (where new_category = 'Tools & Auto') as updated_to_tools_auto,
  count(*) filter (where new_category = 'Personal Care') as updated_to_personal_care,
  count(*) filter (where new_category = 'Pet') as updated_to_pet,
  count(*) filter (where new_category = 'Apparel') as updated_to_apparel,
  count(*) filter (where new_category = 'Toys & Games') as updated_to_toys_games,
  count(*) filter (where new_category = 'Travel') as updated_to_travel,
  count(*) filter (where new_category = 'Bags') as updated_to_bags
from updated;

commit;
