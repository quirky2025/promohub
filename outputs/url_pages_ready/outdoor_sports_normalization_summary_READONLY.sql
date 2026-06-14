-- Outdoor & Sports normalization summary
-- READ ONLY. Run before outdoor_sports_normalization_apply_UPDATE.sql.
-- Goal: move old Leisure outdoor/sports rows into the locked Outdoor & Sports taxonomy.
-- Locked subcategories:
-- Sports Products / Golf Products / Umbrellas / Towels / Camping & Outdoors /
-- Picnic & BBQ / Sunglasses / Blankets / Supporter Gear.

with base as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(coalesce(p.category, '')) as category_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.category, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
),
classified as (
  select *
  from base
  where category_lower = 'outdoor & sports'
    or (
      category_lower = 'leisure'
      and subcategory_lower in (
        'sport',
        'sports',
        'sports products',
        'golf',
        'golf products',
        'umbrellas',
        'towels',
        'camping',
        'camping & outdoors',
        'picnic & bbq',
        'chairs',
        'sunglasses',
        'blankets'
      )
    )
    or (
      category_lower = 'promotion'
      and haystack_lower ~ '(foam\s+hand|thunder\s+stix|cheer|supporter|(^|[^a-z])fan(s)?([^a-z]|$))'
    )
),
suggested as (
  select
    *,
    case
      when subcategory_lower = 'chairs'
        then 'Outdoor & Sports'
      when lower(name) like '%towel%'
        then 'Outdoor & Sports'
      when lower(name) ~ '(toiletry\s+bag|cosmetic\s+bag|makeup\s+bag|wash\s+bag|cooler\s+bag|lunch\s+bag|picnic\s+bag|dry\s+bag|duffle\s+bag|sports\s+bag|backpack|boston\s+bag)'
        then 'Bags'
      when lower(name) ~ '(bottle\s+opener|corkscrew|waiter''?s\s+knife|coaster|bar\s+mat|stubby|can\s+holder|koozie|wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|whisk(e)?y|hip\s+flask|ice\s+bucket|drinking\s+straw|reusable\s+straw|cocktail)'
        then 'Barware & Accessories'
      when subcategory_lower = 'umbrellas' or lower(name) ~ '(umbrella|parasol)'
        then 'Outdoor & Sports'
      when subcategory_lower = 'towels' or lower(name) ~ '(beach\s+towel|sports?\s+towel|gym\s+towel|cooling\s+towel|sand\s+free|face\s+washer|bath\s+towel|hand\s+towel|bath\s+sheet|towel)'
        then 'Outdoor & Sports'
      when subcategory_lower = 'sunglasses' or lower(name) ~ '(sunglasses|sunnies)'
        then 'Outdoor & Sports'
      when subcategory_lower = 'golf' or lower(name) ~ '(^|[^a-z])golf([^a-z]|$)'
        then 'Outdoor & Sports'
      when lower(name) ~ '(water\s+bottle|drink\s+bottle|sports\s+bottle|shaker|mug|tumbler|coffee\s+cup|(^|[^a-z])cup([^a-z]|$)|flask)'
        then 'Drinkware'
      when lower(name) ~ '(sunscreen|sun\s+screen|first\s+aid|bandage|massage|massager)'
        then 'Personal Care'
      when lower(name) ~ '(luggage|passport|tsa\s+lock|travel\s+wallet|travel\s+set|travel\s+pillow|neck\s+pillow|ear\s+plug|eye\s+mask)'
        then 'Travel'
      when lower(name) ~ '(car\s+sunshade|sunshade\s+set|headlamp|torch|lantern|tape\s+measure|multi[-\s]?tool|pocket\s+knife|utility\s+knife)'
        then 'Tools & Auto'
      when lower(name) ~ '(carabiner\s+key|key\s*ring|keyring|keychain|floating\s+keychain)'
        then 'Key Rings'
      when lower(name) ~ '(dominoes|kubb|pick\s+up\s+sticks|yard\s+dice|beach\s+ball|frisbee|flying\s+disc|flyer|yo-yo|yoyo|skittle|puzzle|playing\s+cards|rubber\s+duck)'
        then 'Toys & Games'
      when lower(name) ~ '(^|[^a-z])(pet|dog|cat|leash)([^a-z]|$)|pet\s+bandana|pet\s+bowl' or subcategory_lower = 'pet accessories'
        then 'Pet'
      when haystack_lower ~ '(usb|rechargeable|battery|electric|cooling\s+fan|desktop\s+fan)'
        then 'Technology'
      when subcategory_lower in (
        'sports products',
        'golf products',
        'umbrellas',
        'towels',
        'camping & outdoors',
        'picnic & bbq',
        'sunglasses',
        'blankets',
        'supporter gear'
      )
        then 'Outdoor & Sports'
      when haystack_lower ~ '(foam\s+hand|thunder\s+stix|cheer|supporter|(^|[^a-z])fan(s)?([^a-z]|$))'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(umbrella|parasol)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(^|[^a-z])golf([^a-z]|$)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(beach\s+towel|sports?\s+towel|gym\s+towel|cooling\s+towel|sand\s+free|face\s+washer|bath\s+towel|hand\s+towel|bath\s+sheet|towel)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(sunglasses|sunnies)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(picnic\s+blanket|outdoor\s+blanket|beach\s+blanket|travel\s+blanket|puffer\s+blanket|throw\s+blanket|leisure\s+mat|beach\s+mat)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(picnic|bbq|barbecue|camp\s+fire|cooker)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(camping|camp\s+light|folding\s+chair|beach\s+chair|leisure\s+chair|carabiner|gear\s+clip)'
        then 'Outdoor & Sports'
      when haystack_lower ~ '(yoga\s+mat|exercise\s+mat|soccer|basketball|football|tennis|pickleball|sports?\s+ball|ball\s+set|bat\s*&\s*ball|sports?\s+equipment)'
        then 'Outdoor & Sports'
      when subcategory_lower in ('sport', 'sports', 'golf', 'camping', 'chairs')
        then 'Outdoor & Sports'
      else null
    end as suggested_category,
    case
      when subcategory_lower = 'chairs'
        then 'Camping & Outdoors'
      when lower(name) like '%towel%'
        then 'Towels'
      when lower(name) ~ '(toiletry\s+bag|cosmetic\s+bag|makeup\s+bag|wash\s+bag)'
        then 'Toiletry Bags'
      when lower(name) ~ '(cooler\s+bag|lunch\s+bag|picnic\s+bag)'
        then 'Cooler Bags'
      when lower(name) ~ '(backpack)'
        then 'Backpacks'
      when lower(name) ~ '(dry\s+bag)'
        then 'Dry Bags'
      when lower(name) ~ '(duffle\s+bag|sports\s+bag|boston\s+bag)'
        then 'Travel & Duffle Bags'
      when lower(name) ~ '(bottle\s+opener|corkscrew|waiter''?s\s+knife)'
        then 'Bottle Openers'
      when lower(name) ~ '(coaster)'
        then 'Coasters'
      when lower(name) ~ '(bar\s+mat)'
        then 'Bar Mats'
      when lower(name) ~ '(stubby|can\s+holder|koozie)'
        then 'Stubby Holders'
      when lower(name) ~ '(wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|whisk(e)?y|hip\s+flask|ice\s+bucket)'
        then 'Wine Accessories'
      when lower(name) ~ '(drinking\s+straw|reusable\s+straw|cocktail)'
        then 'Bar Accessories'
      when subcategory_lower = 'umbrellas' or lower(name) ~ '(umbrella|parasol)'
        then 'Umbrellas'
      when subcategory_lower = 'towels' or lower(name) ~ '(beach\s+towel|sports?\s+towel|gym\s+towel|cooling\s+towel|sand\s+free|face\s+washer|bath\s+towel|hand\s+towel|bath\s+sheet|towel)'
        then 'Towels'
      when subcategory_lower = 'sunglasses' or lower(name) ~ '(sunglasses|sunnies)'
        then 'Sunglasses'
      when subcategory_lower = 'golf' or lower(name) ~ '(^|[^a-z])golf([^a-z]|$)'
        then 'Golf Products'
      when lower(name) ~ '(water\s+bottle|drink\s+bottle|sports\s+bottle|shaker)'
        then 'Drink Bottles'
      when lower(name) ~ '(mug|tumbler|coffee\s+cup|(^|[^a-z])cup([^a-z]|$)|flask)'
        then 'Tumblers'
      when lower(name) ~ '(sunscreen|sun\s+screen)'
        then 'Sunscreen & Lotions'
      when lower(name) ~ '(first\s+aid|bandage)'
        then 'First Aid'
      when lower(name) ~ '(massage|massager)'
        then 'Bath & Body'
      when lower(name) ~ '(luggage|passport|tsa\s+lock|travel\s+wallet|travel\s+set|travel\s+pillow|neck\s+pillow|ear\s+plug|eye\s+mask)'
        then 'Travel Accessories'
      when lower(name) ~ '(car\s+sunshade|sunshade\s+set)'
        then 'Car Accessories'
      when lower(name) ~ '(headlamp|torch|lantern)'
        then 'Torches & Lights'
      when lower(name) ~ '(tape\s+measure)'
        then 'Tape Measures'
      when lower(name) ~ '(multi[-\s]?tool|pocket\s+knife|utility\s+knife)'
        then 'Multi-Tools'
      when lower(name) ~ '(carabiner\s+key|key\s*ring|keyring|keychain|floating\s+keychain)'
        then 'Functional Key Rings'
      when lower(name) ~ '(beach\s+ball|frisbee|flying\s+disc|flyer|yo-yo|yoyo|skittle|rubber\s+duck)'
        then 'Outdoor Toys'
      when lower(name) ~ '(dominoes|kubb|pick\s+up\s+sticks|yard\s+dice|puzzle|playing\s+cards)'
        then 'Games & Puzzles'
      when lower(name) ~ '(^|[^a-z])(pet|dog|cat|leash)([^a-z]|$)|pet\s+bandana|pet\s+bowl' or subcategory_lower = 'pet accessories'
        then 'Pet Accessories'
      when haystack_lower ~ '(usb|rechargeable|battery|electric|cooling\s+fan|desktop\s+fan)'
        then 'Tech Accessories'
      when subcategory_lower in ('sports products')
        then 'Sports Products'
      when subcategory_lower in ('golf products')
        then 'Golf Products'
      when subcategory_lower in ('umbrellas')
        then 'Umbrellas'
      when subcategory_lower in ('towels')
        then 'Towels'
      when subcategory_lower in ('camping & outdoors')
        then 'Camping & Outdoors'
      when subcategory_lower in ('picnic & bbq')
        then 'Picnic & BBQ'
      when subcategory_lower in ('sunglasses')
        then 'Sunglasses'
      when subcategory_lower in ('blankets')
        then 'Blankets'
      when subcategory_lower in ('supporter gear')
        then 'Supporter Gear'
      when haystack_lower ~ '(foam\s+hand|thunder\s+stix|cheer|supporter|(^|[^a-z])fan(s)?([^a-z]|$))'
        then 'Supporter Gear'
      when haystack_lower ~ '(umbrella|parasol)'
        then 'Umbrellas'
      when haystack_lower ~ '(^|[^a-z])golf([^a-z]|$)'
        then 'Golf Products'
      when haystack_lower ~ '(beach\s+towel|sports?\s+towel|gym\s+towel|cooling\s+towel|sand\s+free|face\s+washer|bath\s+towel|hand\s+towel|bath\s+sheet|towel)'
        then 'Towels'
      when haystack_lower ~ '(sunglasses|sunnies)'
        then 'Sunglasses'
      when haystack_lower ~ '(picnic\s+blanket|outdoor\s+blanket|beach\s+blanket|travel\s+blanket|puffer\s+blanket|throw\s+blanket|leisure\s+mat|beach\s+mat)'
        then 'Blankets'
      when haystack_lower ~ '(picnic|bbq|barbecue|camp\s+fire|cooker)'
        then 'Picnic & BBQ'
      when haystack_lower ~ '(camping|camp\s+light|folding\s+chair|beach\s+chair|leisure\s+chair|carabiner|gear\s+clip)'
        then 'Camping & Outdoors'
      when haystack_lower ~ '(yoga\s+mat|exercise\s+mat|soccer|basketball|football|tennis|pickleball|sports?\s+ball|ball\s+set|bat\s*&\s*ball|sports?\s+equipment)'
        then 'Sports Products'
      when subcategory_lower in ('sport', 'sports')
        then 'Sports Products'
      when subcategory_lower = 'golf'
        then 'Golf Products'
      when subcategory_lower in ('camping', 'chairs')
        then 'Camping & Outdoors'
      else null
    end as suggested_subcategory
  from classified
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  coalesce(suggested_category, '(manual review)') as suggested_category,
  coalesce(suggested_subcategory, '(manual review)') as suggested_subcategory,
  count(*) as total_products,
  count(*) filter (where is_published = true) as published_products,
  count(*) filter (where suggested_category is null or suggested_subcategory is null) as manual_review_products,
  (array_agg(name order by name))[1:5] as example_products
from suggested
group by
  current_category,
  current_subcategory,
  suggested_category,
  suggested_subcategory
order by
  manual_review_products desc,
  published_products desc,
  total_products desc,
  current_category,
  current_subcategory;
