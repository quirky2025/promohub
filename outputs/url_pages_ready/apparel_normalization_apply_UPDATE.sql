-- Apparel normalization APPLY
-- Run only after reviewing apparel_normalization_summary_READONLY.sql.
-- Updates Apparel rows and obvious apparel accessories from Headwear.
--
-- Key rules:
--   Primary subcategory = product shape.
--   Workwear / Teamwear = tags for filter pages.
--   Brand is not a subcategory.

begin;

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
      case
        when (
          haystack_lower ~ '(workwear|work wear|hi[- ]?vis|hivis|high visibility|safety|reflective|industrial|work shirt|work pant|work shorts)'
          or brand_lower ~ '(bisley|hard yakka|syzmik|kinggee|projob)'
        ) then array['workwear']::text[]
        else '{}'::text[]
      end
      ||
      case
        when haystack_lower ~ '(teamwear|team wear|team jacket|team polo|team shirt|sports team|club uniform|university team|athletic team)'
          then array['teamwear']::text[]
        else '{}'::text[]
      end
    ) as tags_to_add
  from classified
),
updated as (
  update public.products p
  set
    category = 'Apparel',
    subcategory = s.suggested_subcategory,
    tags = coalesce(
      (
        select array_agg(distinct tag order by tag)
        from unnest(coalesce(p.tags, '{}'::text[]) || s.tags_to_add) as tag
      ),
      '{}'::text[]
    )
  from suggested s
  where p.id = s.id
    and s.suggested_subcategory is not null
    and (
      p.category is distinct from 'Apparel'
      or p.subcategory is distinct from s.suggested_subcategory
      or coalesce(p.tags, '{}'::text[]) is distinct from coalesce(
        (
          select array_agg(distinct tag order by tag)
          from unnest(coalesce(p.tags, '{}'::text[]) || s.tags_to_add) as tag
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
    p.tags,
    p.is_published
)
select
  count(*) as updated_rows,
  count(*) filter (where is_published = true) as updated_published_rows,
  count(*) filter (where new_category = 'Apparel') as updated_to_apparel,
  count(*) filter (where tags @> array['workwear']) as rows_now_tagged_workwear,
  count(*) filter (where tags @> array['teamwear']) as rows_now_tagged_teamwear
from updated;

commit;
