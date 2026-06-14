-- Pens normalization APPLY
-- Run only after reviewing pens_normalization_summary_READONLY.sql.
-- Updates only:
--   - existing category = 'Pens'
--   - obvious writing products currently under Business / Office & Desk
--
-- Primary category/subcategory:
--   Pens > Ballpoint Pens
--   Pens > Stylus Pens
--   Pens > Highlighters
--   Pens > Markers
--   Pens > Pencils
--
-- SEO/filter attributes:
--   material_tags += metal
--   material_tags += plastic
--   is_eco = true where eco material signal exists
--
-- Leaves manual-review products untouched:
--   pen holders, pencil cases and pencil pouches.

begin;

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    coalesce(p.is_eco, false) as current_is_eco,
    coalesce(p.material_tags, '{}'::text[]) as current_material_tags,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials)) as haystack_lower
  from public.products p
  where p.category = 'Pens'
     or (
      p.category in ('Business', 'Office & Desk')
      and (
        p.name ilike any (array['%highlighter%', '%marker%', '%pencil%'])
        or p.subcategory ilike any (array['%highlighter%', '%marker%', '%pencil%'])
      )
    )
),
suggested as (
  select
    *,
    case
      when haystack_lower ilike any (array['%pencil case%', '%pen holder%', '%pencil pouch%']) then null
      when haystack_lower ilike any (array['%highlighter%']) then 'Pens'
      when haystack_lower ilike any (array['%marker%', '%whiteboard marker%', '%permanent marker%']) then 'Pens'
      when haystack_lower ilike any (array['%pencil%']) then 'Pens'
      when haystack_lower ilike any (array['%stylus%']) then 'Pens'
      when current_category = 'Pens' then 'Pens'
      else null
    end as suggested_category,
    case
      when haystack_lower ilike any (array['%pencil case%', '%pen holder%', '%pencil pouch%']) then null
      when haystack_lower ilike any (array['%highlighter%']) then 'Highlighters'
      when haystack_lower ilike any (array['%marker%', '%whiteboard marker%', '%permanent marker%']) then 'Markers'
      when haystack_lower ilike any (array['%pencil%']) then 'Pencils'
      when haystack_lower ilike any (array['%stylus%']) then 'Stylus Pens'
      when current_category = 'Pens' then 'Ballpoint Pens'
      else null
    end as suggested_subcategory,
    (
      case
        when current_subcategory = 'Metal'
          or (
            current_subcategory = 'Deluxe'
            and not (haystack_lower ilike any (array['%highlighter%', '%marker%', '%pencil%']))
          )
          or (
            current_subcategory not in ('Highlighters', 'Bamboo', 'Paper', 'Wood', 'Plastic')
            and not (haystack_lower ilike any (array['%highlighter%', '%marker%', '%pencil%']))
            and haystack_lower ~ '(aluminium|aluminum|stainless steel|brass|metal|chrome)'
          )
        then array['metal']::text[]
        else '{}'::text[]
      end
      ||
      case
        when current_subcategory = 'Plastic'
          or (
            current_subcategory = 'Stylus'
            and haystack_lower ~ '(^|[^a-z])(abs|pp|pet|rpet)([^a-z]|$)|(plastic|polypropylene|polycarbonate|recycled pet|recycled plastic)'
          )
        then array['plastic']::text[]
        else '{}'::text[]
      end
    ) as material_tags_to_add,
    (
      current_is_eco = true
      or current_subcategory in ('Bamboo', 'Paper', 'Wood')
      or haystack_lower ~ '(bamboo|cork|recycled|rpet|recycled pet|wheat straw|paper|cardboard|wood|wooden)'
    ) as should_be_eco
  from classified
),
updated as (
  update public.products p
  set
    category = s.suggested_category,
    subcategory = s.suggested_subcategory,
    material_tags = coalesce(
      (
        select array_agg(distinct tag order by tag)
        from unnest(coalesce(p.material_tags, '{}'::text[]) || s.material_tags_to_add) as tag
      ),
      '{}'::text[]
    ),
    is_eco = case
      when s.should_be_eco then true
      else coalesce(p.is_eco, false)
    end
  from suggested s
  where p.id = s.id
    and s.suggested_category is not null
    and s.suggested_subcategory is not null
    and (
      p.category is distinct from s.suggested_category
      or p.subcategory is distinct from s.suggested_subcategory
      or coalesce(p.material_tags, '{}'::text[]) is distinct from coalesce(
        (
          select array_agg(distinct tag order by tag)
          from unnest(coalesce(p.material_tags, '{}'::text[]) || s.material_tags_to_add) as tag
        ),
        '{}'::text[]
      )
      or coalesce(p.is_eco, false) is distinct from case
        when s.should_be_eco then true
        else coalesce(p.is_eco, false)
      end
    )
  returning
    p.id,
    p.name,
    s.current_category,
    s.current_subcategory,
    p.category as new_category,
    p.subcategory as new_subcategory,
    p.material_tags,
    p.is_eco,
    p.is_published
)
select
  count(*) as updated_rows,
  count(*) filter (where is_published = true) as updated_published_rows,
  count(*) filter (where new_category = 'Pens') as updated_to_pens,
  count(*) filter (where material_tags @> array['metal']) as rows_now_tagged_metal,
  count(*) filter (where material_tags @> array['plastic']) as rows_now_tagged_plastic,
  count(*) filter (where is_eco = true) as rows_now_eco
from updated;

commit;
