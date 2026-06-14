-- Legacy manual-review residue resolution detail
-- READ ONLY. Run before legacy_manual_review_resolution_apply_UPDATE.sql.
-- Goal:
--   Resolve only the remaining old-category products with clear targets.
--   All currently reviewed rows should now have clear targets.

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
      when category_lower = 'print'
        and subcategory_lower in ('business cards', 'business card')
        and name_lower ~ '(card\s+magnifier|magnifier)'
        then 'Giveaways & Event Accessories'

      when category_lower in ('promotion', 'promotional')
        and subcategory_lower in ('promotion', 'promotional')
        and name_lower ~ '(pvc\s+decoration)'
        then 'Giveaways & Event Accessories'

      when category_lower in ('promotion', 'promotional')
        and subcategory_lower in ('promotion', 'promotional')
        and name_lower ~ '(emergency\s+poncho|emergency\s+rain\s*coat)'
        then 'Outdoor & Sports'

      when category_lower in ('promotion', 'promotional')
        and subcategory_lower in ('promotion', 'promotional')
        and name_lower ~ '(funky\s+bubble|bubble\s+kit|hacky\s+sacks?|hi[-\s]?bounce\s+ball|rain\s+coat\s+ball|rainbow\s+spring|twirly\s+copter)'
        then 'Toys & Games'

      else null
    end as suggested_category,
    case
      when category_lower = 'print'
        and subcategory_lower in ('business cards', 'business card')
        and name_lower ~ '(card\s+magnifier|magnifier)'
        then 'Novelty Giveaways'

      when category_lower in ('promotion', 'promotional')
        and subcategory_lower in ('promotion', 'promotional')
        and name_lower ~ '(pvc\s+decoration)'
        then 'Novelty Giveaways'

      when category_lower in ('promotion', 'promotional')
        and subcategory_lower in ('promotion', 'promotional')
        and name_lower ~ '(emergency\s+poncho|emergency\s+rain\s*coat)'
        then 'Camping & Outdoors'

      when category_lower in ('promotion', 'promotional')
        and subcategory_lower in ('promotion', 'promotional')
        and name_lower ~ '(funky\s+bubble|bubble\s+kit|hacky\s+sacks?|hi[-\s]?bounce\s+ball|rain\s+coat\s+ball|rainbow\s+spring|twirly\s+copter)'
        then 'Novelty Toys'

      else null
    end as suggested_subcategory,
    case
      when category_lower in ('promotion', 'promotional')
        and subcategory_lower in ('promotion', 'promotional')
        then 'manual_review: mixed promotional residue'
      when category_lower = 'print'
        and subcategory_lower in ('business cards', 'business card')
        then 'manual_review: print/card residue'
      else 'manual_review: old hidden category residue'
    end as fallback_review_reason
  from base
)
select
  current_category,
  current_subcategory,
  supplier_sku,
  name,
  is_published,
  coalesce(suggested_category, '(manual review)') as suggested_category,
  coalesce(suggested_subcategory, '(manual review)') as suggested_subcategory,
  case
    when suggested_category is not null and suggested_subcategory is not null then 'update'
    else fallback_review_reason
  end as proposed_action
from suggested
order by
  case when suggested_category is null or suggested_subcategory is null then 0 else 1 end,
  current_category,
  current_subcategory,
  name;
