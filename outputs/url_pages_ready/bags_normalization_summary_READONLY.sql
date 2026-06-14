-- Bags normalization summary
-- READ ONLY. Run before bags_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview Bags normalization for the flat URL pilot.
--   Keeps product primary home in one subcategory.
--   Cotton Tote Bags is a filter page: Bags + Tote Bags + material_tags contains cotton.

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    coalesce(p.material_tags, '{}'::text[]) as current_material_tags,
    lower(p.name) as name_lower,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
  where p.category = 'Bags'
     or (
      p.category in ('Personal', 'Personal Care')
      and lower(concat_ws(' ', p.name, p.subcategory)) ~ '(toiletry|cosmetic|makeup|wash bag)'
    )
     or (
      p.category = 'Travel'
      and lower(concat_ws(' ', p.name, p.subcategory)) ~ '(laptop bag|backpack|duffle|duffel|travel bag|carry[- ]?on|suitcase|toiletry|cosmetic)'
    )
     or (
      p.category = 'Packaging'
      and lower(concat_ws(' ', p.name, p.subcategory)) ~ '(wine carrier|wine bag)'
    )
),
suggested as (
  select
    *,
    case
      when current_category = 'Packaging'
        and current_subcategory = 'Wine Carriers'
        and name_lower ~ '(crate|gift\s+box|box|tube)'
        then null
      when current_subcategory in ('Duffle Bags', 'Travel Bags', 'Suitcases') or name_lower ~ '(duffle|duffel|travel\s+bag|gym\s+bag|sports?\s+bag|carry[- ]?on|suitcase)' then 'Travel & Duffle Bags'
      when current_subcategory = 'Laptop Bags' or name_lower ~ '(laptop\s+(bag|backpack|sleeve|case))' then 'Laptop Bags'
      when current_subcategory = 'Cooler Bags' or name_lower ~ '(cooler\s+(bag|tote|backpack)|insulated\s+(grocery\s+)?(bag|tote)|lunch\s+(bag|cooler))' then 'Cooler Bags'
      when current_subcategory = 'Drawstring Bags' and not (name_lower ~ 'backpack') then 'Drawstring Bags'
      when current_subcategory = 'Dry Bags' or name_lower ~ '(dry\s+bag)' then 'Dry Bags'
      when name_lower ~ '(wine\s+(carrier|bag|tote)|wine\s+carry\s+pack)' then 'Wine Carriers'
      when current_subcategory = 'Crossbody & Belt Bags' or haystack_lower ~ '(crossbody|belt\s+bag|bum\s+bag)' then 'Crossbody & Belt Bags'
      when haystack_lower ~ '(satchel)' then 'Satchel Bags'
      when current_subcategory = 'Backpacks' or name_lower ~ '(backpack|totepack)' then 'Backpacks'
      when haystack_lower ~ '(toiletry|cosmetic\s+bag|makeup\s+bag|wash\s+bag)' then 'Toiletry Bags'
      when haystack_lower ~ '(paper\s+(bag|shopping\s+bag))' then 'Paper Bags'
      when current_subcategory = 'Jute Bags' or haystack_lower ~ '(jute)' then 'Jute Bags'
      when name_lower ~ '(drawstring|show\s+bag)' then 'Drawstring Bags'
      when current_subcategory in ('Tote Bags', 'Cotton Bags') or name_lower ~ '(tote|calico\s+bag|shopping\s+bag|bamboo\s+bag|non\s+woven\s+bag|produce\s+bag)' then 'Tote Bags'
      when current_subcategory in (
        'Paper Bags',
        'Satchel Bags',
        'Wine Carriers'
      ) then current_subcategory
      when current_subcategory = 'Lunch Bags' then 'Cooler Bags'
      else null
    end as suggested_subcategory,
    (haystack_lower ~ '(cotton|calico|canvas)') as has_cotton_signal
  from classified p
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  'Bags' as suggested_category,
  coalesce(suggested_subcategory, '(manual review)') as suggested_subcategory,
  count(*) as total_products,
  count(*) filter (where is_published = true) as published_products,
  count(*) filter (where suggested_subcategory is null) as manual_review_products,
  count(*) filter (
    where has_cotton_signal
      and not current_material_tags @> array['cotton']
  ) as will_add_cotton_tag,
  (array_agg(name order by name))[1:5] as example_products
from suggested
group by
  current_category,
  current_subcategory,
  suggested_subcategory
order by
  manual_review_products desc,
  published_products desc,
  total_products desc,
  current_category,
  current_subcategory;
