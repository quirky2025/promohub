-- Office & Desk normalization APPLY
-- Run only after reviewing office_desk_normalization_summary_READONLY.sql.
-- Updates Business -> Office & Desk and routes obvious old-Business misplacements.

begin;

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(p.name) as name_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower
  from public.products p
  where p.category in ('Business', 'Office & Desk')
     or (
      p.category = 'Print'
      and lower(coalesce(p.subcategory, '')) in ('pads & planners', 'pads and planners')
    )
),
suggested as (
  select
    *,
    case
      when subcategory_lower like '%lanyard%' or name_lower like '%lanyard%' then 'Giveaways & Event Accessories'
      when subcategory_lower like '%id holder%' or name_lower ~ '(id holder|id card|badge holder|card holder)' then 'Giveaways & Event Accessories'
      when name_lower like '%highlighter%' then 'Pens'
      when name_lower ~ '(whiteboard marker|permanent marker|marker pen|marker)' then 'Pens'
      when name_lower ~ '(^|[^a-z])pencil([^a-z]|$)' and name_lower !~ '(pencil case|pencil pouch)' then 'Pens'
      when name_lower ~ '(colouring|coloring|crayon)' then 'Toys & Games'
      when subcategory_lower in ('notebooks') or name_lower ~ '(notebook|journal)' then 'Office & Desk'
      when subcategory_lower in ('pads & planners', 'pads and planners') or name_lower ~ '(planner|diary|calendar)' then 'Office & Desk'
      when subcategory_lower in ('sticky notes') or name_lower ~ '(sticky note|adhesive note)' then 'Office & Desk'
      when subcategory_lower in ('note pads', 'notepads') or name_lower ~ '(note pad|notepad|memo pad|jotter)' then 'Office & Desk'
      when subcategory_lower in ('portfolios', 'portfolios & compendiums', 'portfolios and compendiums') or name_lower ~ '(portfolio|compendium|conference folder|document folder)' then 'Office & Desk'
      when subcategory_lower in ('pencil cases') or name_lower ~ '(pencil case|pencil pouch)' then 'Office & Desk'
      when subcategory_lower in ('rulers') or name_lower ~ '(^|[^a-z])ruler([^a-z]|$)' then 'Office & Desk'
      when subcategory_lower in ('desk items') or name_lower ~ '(desk|desktop|paperweight|letter opener)' then 'Office & Desk'
      when subcategory_lower in ('stationery') then 'Office & Desk'
      else null
    end as suggested_category,
    case
      when subcategory_lower like '%lanyard%' or name_lower like '%lanyard%' then 'Lanyards'
      when subcategory_lower like '%id holder%' or name_lower ~ '(id holder|id card|badge holder|card holder)' then 'ID Holders'
      when name_lower like '%highlighter%' then 'Highlighters'
      when name_lower ~ '(whiteboard marker|permanent marker|marker pen|marker)' then 'Markers'
      when name_lower ~ '(^|[^a-z])pencil([^a-z]|$)' and name_lower !~ '(pencil case|pencil pouch)' then 'Pencils'
      when name_lower ~ '(colouring|coloring|crayon)' then 'Colouring & Kids Sets'
      when subcategory_lower in ('notebooks') or name_lower ~ '(notebook|journal)' then 'Notebooks'
      when subcategory_lower in ('pads & planners', 'pads and planners') or name_lower ~ '(planner|diary|calendar)' then 'Pads & Planners'
      when subcategory_lower in ('sticky notes') or name_lower ~ '(sticky note|adhesive note)' then 'Sticky Notes'
      when subcategory_lower in ('note pads', 'notepads') or name_lower ~ '(note pad|notepad|memo pad|jotter)' then 'Note Pads'
      when subcategory_lower in ('portfolios', 'portfolios & compendiums', 'portfolios and compendiums') or name_lower ~ '(portfolio|compendium|conference folder|document folder)' then 'Portfolios & Compendiums'
      when subcategory_lower in ('pencil cases') or name_lower ~ '(pencil case|pencil pouch)' then 'Pencil Cases'
      when subcategory_lower in ('rulers') or name_lower ~ '(^|[^a-z])ruler([^a-z]|$)' then 'Rulers'
      when subcategory_lower in ('desk items') or name_lower ~ '(desk|desktop|paperweight|letter opener)' then 'Desk Items'
      when subcategory_lower in ('stationery') then 'Stationery'
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
  count(*) filter (where new_category = 'Office & Desk') as updated_to_office_desk,
  count(*) filter (where new_category = 'Giveaways & Event Accessories') as updated_to_giveaways,
  count(*) filter (where new_category = 'Pens') as updated_to_pens,
  count(*) filter (where new_category = 'Toys & Games') as updated_to_toys
from updated;

commit;
