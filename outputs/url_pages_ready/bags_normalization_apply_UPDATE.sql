-- Bags normalization APPLY
-- Run only after reviewing bags_normalization_summary_READONLY.sql.
-- Updates only existing Bags rows and obvious bag products from Personal/Travel/Packaging.
--
-- Key rules:
--   Lunch Bags -> Cooler Bags
--   Duffle Bags / Travel Bags / Suitcases -> Travel & Duffle Bags
--   Cosmetic / toiletry / makeup bags -> Toiletry Bags
--   Wine carriers / wine bags -> Wine Carriers
--   Cotton/calico/canvas products get material_tags += cotton

begin;

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
    case
      when haystack_lower ~ '(cotton|calico|canvas)' then array['cotton']::text[]
      else '{}'::text[]
    end as material_tags_to_add
  from classified
),
updated as (
  update public.products p
  set
    category = 'Bags',
    subcategory = s.suggested_subcategory,
    material_tags = coalesce(
      (
        select array_agg(distinct tag order by tag)
        from unnest(coalesce(p.material_tags, '{}'::text[]) || s.material_tags_to_add) as tag
      ),
      '{}'::text[]
    )
  from suggested s
  where p.id = s.id
    and s.suggested_subcategory is not null
    and (
      p.category is distinct from 'Bags'
      or p.subcategory is distinct from s.suggested_subcategory
      or coalesce(p.material_tags, '{}'::text[]) is distinct from coalesce(
        (
          select array_agg(distinct tag order by tag)
          from unnest(coalesce(p.material_tags, '{}'::text[]) || s.material_tags_to_add) as tag
        ),
        '{}'::text[]
      )
    )
  returning
    p.id,
    p.name,
    s.current_category,
    s.current_subcategory,
    p.category as new_category,
    p.subcategory as new_subcategory,
    p.material_tags,
    p.is_published
)
select
  count(*) as updated_rows,
  count(*) filter (where is_published = true) as updated_published_rows,
  count(*) filter (where new_category = 'Bags') as updated_to_bags,
  count(*) filter (where material_tags @> array['cotton']) as rows_now_tagged_cotton
from updated;

commit;
