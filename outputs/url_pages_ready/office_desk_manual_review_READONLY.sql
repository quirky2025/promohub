-- Office & Desk manual review list
-- READ ONLY. Run after office_desk_normalization_summary_READONLY.sql if manual review rows appear.

with classified as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.brand,
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
    end as suggested_category
  from classified
)
select
  concat_ws(
    ' | ',
    current_category || ' / ' || coalesce(current_subcategory, '(blank)'),
    coalesce(supplier_sku, '(no sku)'),
    name,
    'reason=no_clear_office_rule'
  ) as manual_review_item
from suggested
where suggested_category is null
order by current_category, current_subcategory, name;
