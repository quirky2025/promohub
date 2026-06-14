-- Travel normalization summary
-- READ ONLY. Run before travel_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview Travel cleanup for the flat URL rollout.
--   Travel keeps:
--     Luggage Tags / Passport Holders / Travel Wallets / Travel Pillows & Comfort / Travel Accessories.
--   Boundaries:
--     travel bags, duffle bags, suitcases -> Bags
--     travel mugs, bottles, tumblers -> Drinkware
--     travel adaptors, chargers, phone holders -> Technology
--     travel soap, tissues, first aid, masks -> Personal Care

with base as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(p.name) as name_lower,
    lower(coalesce(p.category, '')) as category_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.category, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
),
classified as (
  select *
  from base
  where category_lower = 'travel'
    or (
      category_lower = 'leisure'
      and subcategory_lower = 'travel'
    )
    or (
      category_lower in (
        'bags',
        'drinkware',
        'technology',
        'personal care',
        'personal',
        'home & living',
        'leisure',
        'business',
        'promotion'
      )
      and name_lower ~ '(luggage\s+tag|bag\s+tag|passport|travel\s+wallet|rfid|anti[-\s]?skimming|anti[-\s]?theft|travel\s+pillow|neck\s+pillow|eye\s+mask|ear\s*plug|luggage\s+strap|luggage\s+scale|tsa\s+lock|luggage\s+lock|travel\s+lock|travel\s+adaptor|travel\s+adapter|travel\s+mug|travel\s+bottle|travel\s+organiser|travel\s+organizer|travel\s+caddy|travel\s+accessor|travel\s+set|travel\s+kit|travel\s+bag|carry[-\s]?on|duffle|duffel|suitcase|trolley|toiletry|cosmetic\s+bag|wash\s+bag|travel\s+tissue|travel\s+soap)'
    )
),
suggested as (
  select
    *,
    case
      when subcategory_lower in (
        'luggage tags',
        'passport holders',
        'travel wallets',
        'travel pillows & comfort',
        'travel accessories'
      )
        then 'Travel'
      when category_lower = 'personal care'
        and subcategory_lower in (
          'bath & body',
          'grooming',
          'first aid',
          'hand sanitiser',
          'face masks',
          'sunscreen & lotions',
          'lip balms',
          'manicure sets',
          'mirrors & beauty accessories'
        )
        then 'Personal Care'
      when name_lower ~ '(trunk\s+organiser|trunk\s+organizer|car\s+tidy|air\s+freshener)'
        then 'Tools & Auto'
      when name_lower ~ 'dish\s+brush'
        then 'Home & Living'
      when name_lower ~ '(selfie\s+(stick|light)|phone\s+light|tripod)'
        then 'Technology'
      when name_lower ~ '(valencia\s+cup|cup\s*-\s*350)'
        then 'Drinkware'
      when name_lower ~ 'passport'
        then 'Travel'
      when name_lower ~ '(leather\s+wallet|wallet\s+and\s+belt|wallet)'
        then 'Travel'
      when name_lower ~ '(travel\s+mug|travel\s+tumbler|travel\s+cup)'
        then 'Drinkware'
      when name_lower ~ '(toiletry\s+bag|cosmetic\s+bag|wash\s+bag|travel\s+bag|carry[-\s]?on|duffle|duffel|suitcase|trolley|backpack|laptop\s+bag)'
        then 'Bags'
      when name_lower ~ '(travel\s+bottle\s+set|bottle\s+set|luggage\s+tag|bag\s+tag|passport|travel\s+wallet|rfid.*(wallet|card|holder|protector)|anti[-\s]?skimming|anti[-\s]?theft.*(wallet|card|holder|protector)|travel\s+pillow|neck\s+pillow|eye\s+mask|ear\s*plug|luggage\s+strap|luggage\s+scale|tsa\s+lock|luggage\s+lock|travel\s+lock|travel\s+organiser|travel\s+organizer|travel\s+caddy|travel\s+accessor)'
        then 'Travel'
      when name_lower ~ '(travel\s+adaptor|travel\s+adapter|charger|charging|cable|power\s*bank|usb|phone\s+(holder|mount|stand|grip))'
        then 'Technology'
      when name_lower ~ '(travel\s+tissue|tissue|travel\s+soap|soap|first\s+aid|mask|sanitiser|sanitizer|sunscreen|toothbrush)'
        then 'Personal Care'
      else null
    end as suggested_category,
    case
      when subcategory_lower = 'luggage tags'
        then 'Luggage Tags'
      when subcategory_lower = 'passport holders'
        then 'Passport Holders'
      when subcategory_lower = 'travel wallets'
        then 'Travel Wallets'
      when subcategory_lower = 'travel pillows & comfort'
        then 'Travel Pillows & Comfort'
      when subcategory_lower = 'travel accessories'
        then 'Travel Accessories'
      when category_lower = 'personal care' and subcategory_lower = 'bath & body'
        then 'Bath & Body'
      when category_lower = 'personal care' and subcategory_lower = 'grooming'
        then 'Grooming'
      when category_lower = 'personal care' and subcategory_lower = 'first aid'
        then 'First Aid'
      when category_lower = 'personal care' and subcategory_lower = 'hand sanitiser'
        then 'Hand Sanitiser'
      when category_lower = 'personal care' and subcategory_lower = 'face masks'
        then 'Face Masks'
      when category_lower = 'personal care' and subcategory_lower = 'sunscreen & lotions'
        then 'Sunscreen & Lotions'
      when category_lower = 'personal care' and subcategory_lower = 'lip balms'
        then 'Lip Balms'
      when category_lower = 'personal care' and subcategory_lower = 'manicure sets'
        then 'Manicure Sets'
      when category_lower = 'personal care' and subcategory_lower = 'mirrors & beauty accessories'
        then 'Mirrors & Beauty Accessories'
      when name_lower ~ '(trunk\s+organiser|trunk\s+organizer|car\s+tidy|air\s+freshener)'
        then 'Car Accessories'
      when name_lower ~ 'dish\s+brush'
        then 'Kitchen & Dining'
      when name_lower ~ '(selfie\s+(stick|light)|phone\s+light|tripod)'
        then 'Phone Accessories'
      when name_lower ~ '(valencia\s+cup|cup\s*-\s*350)'
        then 'Coffee Cups'
      when name_lower ~ 'passport'
        then 'Passport Holders'
      when name_lower ~ '(leather\s+wallet|wallet\s+and\s+belt|wallet)'
        then 'Travel Wallets'
      when name_lower ~ '(travel\s+mug|travel\s+tumbler|travel\s+cup)'
        then 'Travel Mugs'
      when name_lower ~ '(luggage\s+tag|bag\s+tag)'
        then 'Luggage Tags'
      when name_lower ~ 'passport'
        then 'Passport Holders'
      when name_lower ~ '(travel\s+wallet|rfid.*(wallet|card|holder|protector)|anti[-\s]?skimming|anti[-\s]?theft.*(wallet|card|holder|protector))'
        then 'Travel Wallets'
      when name_lower ~ '(travel\s+pillow|neck\s+pillow|eye\s+mask|ear\s*plug)'
        then 'Travel Pillows & Comfort'
      when name_lower ~ '(travel\s+bottle\s+set|bottle\s+set|luggage\s+strap|luggage\s+scale|tsa\s+lock|luggage\s+lock|travel\s+lock|travel\s+organiser|travel\s+organizer|travel\s+caddy|travel\s+accessor)'
        then 'Travel Accessories'
      when name_lower ~ '(travel\s+adaptor|travel\s+adapter|charger|charging|cable)'
        then 'Charging Cables & Chargers'
      when name_lower ~ 'power\s*bank'
        then 'Power Banks'
      when name_lower ~ 'usb'
        then 'USB Flash Drives'
      when name_lower ~ 'phone\s+(holder|mount|stand|grip)'
        then 'Phone Accessories'
      when name_lower ~ '(toiletry\s+bag|cosmetic\s+bag|wash\s+bag)'
        then 'Toiletry Bags'
      when name_lower ~ '(travel\s+bag|carry[-\s]?on|duffle|duffel|suitcase|trolley)'
        then 'Travel & Duffle Bags'
      when name_lower ~ 'backpack'
        then 'Backpacks'
      when name_lower ~ 'laptop\s+bag'
        then 'Laptop Bags'
      when name_lower ~ '(travel\s+tissue|tissue|travel\s+soap|soap)'
        then 'Bath & Body'
      when name_lower ~ 'first\s+aid'
        then 'First Aid'
      when name_lower ~ 'mask'
        then 'Face Masks'
      when name_lower ~ '(sanitiser|sanitizer)'
        then 'Hand Sanitiser'
      when name_lower ~ 'sunscreen'
        then 'Sunscreen & Lotions'
      when name_lower ~ 'toothbrush'
        then 'Grooming'
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
  jsonb_agg(name order by name) filter (where name is not null) as example_products
from suggested
group by
  current_category,
  current_subcategory,
  suggested_category,
  suggested_subcategory
order by
  manual_review_products desc,
  total_products desc,
  current_category,
  current_subcategory;
