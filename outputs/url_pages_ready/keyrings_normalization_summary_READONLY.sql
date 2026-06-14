-- Key Rings normalization summary
-- READ ONLY. Run before keyrings_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview Key Rings cleanup for the flat URL rollout.
--   Key Rings keeps:
--     Metal Keyrings / Leather Keyrings / Silicone & PVC Keyrings /
--     Eco Keyrings / Functional Keyrings / Novelty Keyrings.
--   Boundaries:
--     bottle opener / torch / tape measure / whistle keyrings -> Functional Keyrings
--     carabiner keyrings -> Functional Keyrings
--     ordinary carabiners without keyring intent -> Outdoor & Sports, not here

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
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  suggested_category,
  suggested_subcategory,
  count(*) as total_products,
  count(*) filter (where is_published = true) as published_products,
  0 as manual_review_products,
  (array_agg(name order by name))[1:5] as example_products
from suggested
group by
  current_category,
  current_subcategory,
  suggested_category,
  suggested_subcategory
order by
  published_products desc,
  total_products desc,
  current_category,
  current_subcategory,
  suggested_subcategory;
