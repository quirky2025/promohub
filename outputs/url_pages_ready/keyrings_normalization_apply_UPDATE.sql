-- Key Rings normalization APPLY
-- Run only after reviewing keyrings_normalization_summary_READONLY.sql.
-- Updates products with a clear Key Rings target.
-- Uses LOCKED subcategory labels exactly as url_pages product_filter expects.

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
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.category, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
),
classified as (
  select *
  from base
  where category_lower = 'key rings'
    or (
      category_lower = 'promotion'
      and subcategory_lower in ('key rings', 'keyrings', 'key chains', 'keychains')
    )
    or (
      category_lower in (
        'promotion',
        'office & desk',
        'business',
        'outdoor & sports',
        'barware & accessories',
        'tools & auto'
      )
      and (
        subcategory_lower in ('key rings', 'keyrings', 'key chains', 'keychains')
        or name_lower ~ '(key\s*ring|keyring|key\s*chain|keychain|key\s*tag|keytag|key\s*holder|carabiner\s+key)'
      )
    )
),
suggested as (
  select
    *,
    'Key Rings' as suggested_category,
    case
      when subcategory_lower in ('metal keyrings', 'metal key rings') then 'Metal Keyrings'
      when subcategory_lower in ('leather keyrings', 'leather key rings') then 'Leather Keyrings'
      when subcategory_lower in ('silicone & pvc keyrings', 'silicone and pvc keyrings', 'silicone keyrings', 'pvc keyrings') then 'Silicone & PVC Keyrings'
      when subcategory_lower in ('eco keyrings', 'eco key rings') then 'Eco Keyrings'
      when subcategory_lower in ('functional keyrings', 'functional key rings') then 'Functional Keyrings'
      when subcategory_lower in ('novelty keyrings', 'novelty key rings') then 'Novelty Keyrings'

      when haystack_lower ~ '(bottle\s+opener|can\s+opener|torch|flashlight|light|cob|tape\s+measure|measure\s+tape|measuring\s+tape|whistle|multi[-\s]?tool|multi\s+tool|tracker|finder|carabiner\s+key|keyring\s+carabiner|key\s*ring\s+carabiner|keychain\s+carabiner)'
        then 'Functional Keyrings'
      when haystack_lower ~ '(bamboo|wood|wooden|cork|recycled|rpet|wheat\s+straw|natural)'
        then 'Eco Keyrings'
      when haystack_lower ~ '(leather|vegan\s+leather|pu\s+leather|ultrahyde|imitation\s+leather|pierre\s+cardin)'
        then 'Leather Keyrings'
      when haystack_lower ~ '(silicone|pvc|rubber|neoprene|soft\s+key\s*tag|soft\s+keyring)'
        then 'Silicone & PVC Keyrings'
      when haystack_lower ~ '(metal|aluminium|aluminum|zinc|alloy|stainless|nickel|chrome|gunmetal|silver)'
        then 'Metal Keyrings'
      else 'Novelty Keyrings'
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
  count(*) filter (where new_subcategory = 'Metal Keyrings') as updated_to_metal,
  count(*) filter (where new_subcategory = 'Leather Keyrings') as updated_to_leather,
  count(*) filter (where new_subcategory = 'Silicone & PVC Keyrings') as updated_to_silicone_pvc,
  count(*) filter (where new_subcategory = 'Eco Keyrings') as updated_to_eco,
  count(*) filter (where new_subcategory = 'Functional Keyrings') as updated_to_functional,
  count(*) filter (where new_subcategory = 'Novelty Keyrings') as updated_to_novelty
from updated;

commit;
