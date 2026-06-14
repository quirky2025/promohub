-- Legacy manual-review residue resolution APPLY
-- Run only after reviewing legacy_manual_review_resolution_detail_READONLY.sql.
-- This updates only clear manual-review rows confirmed from the detail report.
-- NOTE: public.products has no updated_at column in this project.

begin;

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
    lower(coalesce(p.subcategory, '')) as subcategory_lower
  from public.products p
  where lower(coalesce(p.category, '')) in (
    'business',
    'print',
    'promotion',
    'promotional',
    'leisure',
    'personal'
  )
),
suggested as (
  select
    *,
    case
      when category_lower = 'print' and subcategory_lower in ('business cards', 'business card') and name_lower ~ '(card\s+magnifier|magnifier)' then 'Giveaways & Event Accessories'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and name_lower ~ '(pvc\s+decoration)' then 'Giveaways & Event Accessories'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and name_lower ~ '(emergency\s+poncho|emergency\s+rain\s*coat)' then 'Outdoor & Sports'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and name_lower ~ '(funky\s+bubble|bubble\s+kit|hacky\s+sacks?|hi[-\s]?bounce\s+ball|rain\s+coat\s+ball|rainbow\s+spring|twirly\s+copter)' then 'Toys & Games'
      else null
    end as suggested_category,
    case
      when category_lower = 'print' and subcategory_lower in ('business cards', 'business card') and name_lower ~ '(card\s+magnifier|magnifier)' then 'Novelty Giveaways'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and name_lower ~ '(pvc\s+decoration)' then 'Novelty Giveaways'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and name_lower ~ '(emergency\s+poncho|emergency\s+rain\s*coat)' then 'Camping & Outdoors'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and name_lower ~ '(funky\s+bubble|bubble\s+kit|hacky\s+sacks?|hi[-\s]?bounce\s+ball|rain\s+coat\s+ball|rainbow\s+spring|twirly\s+copter)' then 'Novelty Toys'
      else null
    end as suggested_subcategory
  from base
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
    p.supplier_sku,
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
  count(*) filter (where new_category = 'Giveaways & Event Accessories') as updated_to_giveaways,
  count(*) filter (where new_category = 'Outdoor & Sports') as updated_to_outdoor_sports,
  count(*) filter (where new_category = 'Toys & Games') as updated_to_toys_games,
  array_agg(name order by name) as updated_products
from updated;

commit;
