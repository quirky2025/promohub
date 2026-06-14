-- Apparel normalization summary
-- READ ONLY. Run before apparel_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview Apparel cleanup for the flat URL pilot.
--   Primary subcategory stays product-shape based.
--   Workwear and Teamwear are tags/filter pages, not primary subcategories.

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.brand,
    p.is_published,
    coalesce(p.tags, '{}'::text[]) as current_tags,
    lower(p.name) as name_lower,
    lower(coalesce(p.brand, '')) as brand_lower,
    lower(concat_ws(' ', p.name, p.subcategory, p.brand, p.materials, p.description)) as haystack_lower
  from public.products p
  where p.category = 'Apparel'
     or (
     p.category = 'Headwear'
      and (
        p.subcategory = 'Scarves'
        or lower(concat_ws(' ', p.name, p.subcategory)) ~ '(scarf|glove|scrunchie|hair)'
        or (
          lower(concat_ws(' ', p.name, p.subcategory)) ~ '(^|[^a-z])(tie|ties)([^a-z]|$)'
          and lower(concat_ws(' ', p.name, p.subcategory)) !~ 'tie[- ]?dye'
        )
      )
    )
),
suggested as (
  select
    *,
    case
      when haystack_lower ~ '(shoe\s+(charm|lace|laces)|shoelace|hanger|garment\s+bag|flip\s+flop|flipflop|slides?|slippers?|sandals?|bathrobe|rain\s+poncho|(^|[^a-z])poncho([^a-z]|$)|(^|[^a-z])robe([^a-z]|$))' then 'Apparel Accessories'
      when haystack_lower ~ '(apron)' then 'Aprons'
      when current_subcategory = 'Socks' or name_lower ~ '(sock|socks)' then 'Socks'
      when haystack_lower ~ '(pants|pant|trouser|trousers|shorts|cargo|chino|jogger|leggings|tights)' then 'Pants & Shorts'
      when current_subcategory = 'Vests' or haystack_lower ~ '(vest|bodywarmer|body warmer)' or (current_subcategory = 'Teamwear' and name_lower ~ '(bib)') then 'Vests'
      when current_subcategory = 'Hoodies' or haystack_lower ~ '(hoodie|hoody|hooded)' then 'Hoodies'
      when current_subcategory = 'Sweatshirts' or haystack_lower ~ '(sweatshirt|sweater|crew neck|crewneck)' then 'Sweatshirts'
      when current_subcategory in ('Jackets', 'Windbreakers') or haystack_lower ~ '(jacket|anorak|parka|softshell|soft shell|puffer|raincoat|rain jacket|coat|windbreaker)' then 'Jackets'
      when current_subcategory = 'Polo Shirts' or haystack_lower ~ '(polo)' then 'Polo Shirts'
      when current_subcategory = 'Shirts' then 'Shirts'
      when current_subcategory = 'T-Shirts' or name_lower ~ '(t[- ]?shirt|tee shirt| tee | tees |singlet|crop)' then 'T-Shirts'
      when haystack_lower ~ '(shirt|blouse|woven|jersey|guernsey)' or (current_subcategory = 'Teamwear' and name_lower ~ '(top)') then 'Shirts'
      when current_subcategory in ('Scarves & Accessories', 'Scarves')
        or haystack_lower ~ '(scarf|glove|scrunchie|hair)'
        or (
          haystack_lower ~ '(^|[^a-z])(tie|ties)([^a-z]|$)'
          and haystack_lower !~ 'tie[- ]?dye'
        ) then 'Scarves & Accessories'
      when current_subcategory in (
        'Aprons',
        'Socks',
        'Pants & Shorts',
        'Vests',
        'Hoodies',
        'Sweatshirts',
        'Jackets',
        'Polo Shirts',
        'T-Shirts',
        'Shirts',
        'Scarves & Accessories',
        'Apparel Accessories'
      ) then current_subcategory
      else null
    end as suggested_subcategory,
    (
      haystack_lower ~ '(workwear|work wear|hi[- ]?vis|hivis|high visibility|safety|reflective|industrial|work shirt|work pant|work shorts)'
      or brand_lower ~ '(bisley|hard yakka|syzmik|kinggee|projob)'
    ) as has_workwear_signal,
    (
      haystack_lower ~ '(teamwear|team wear|team jacket|team polo|team shirt|sports team|club uniform|university team|athletic team)'
    ) as has_teamwear_signal
  from classified
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  'Apparel' as suggested_category,
  coalesce(suggested_subcategory, '(manual review)') as suggested_subcategory,
  count(*) as total_products,
  count(*) filter (where is_published = true) as published_products,
  count(*) filter (where suggested_subcategory is null) as manual_review_products,
  count(*) filter (
    where has_workwear_signal
      and not current_tags @> array['workwear']
  ) as will_add_workwear_tag,
  count(*) filter (
    where has_teamwear_signal
      and not current_tags @> array['teamwear']
  ) as will_add_teamwear_tag,
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
