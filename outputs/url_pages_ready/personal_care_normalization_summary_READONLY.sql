-- Personal Care normalization summary
-- READ ONLY. Run before personal_care_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview old Personal -> Personal Care cleanup for the flat URL rollout.
--   Keeps one primary product home.
--   Obvious non-personal-care rows are routed out:
--     toiletry / cosmetic bags -> Bags > Toiletry Bags
--     candles / diffusers -> Home & Living > Candles & Diffusers

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(p.name) as name_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
  where p.category in ('Personal', 'Personal Care')
),
suggested as (
  select
    *,
    case
      when haystack_lower ~ '(toiletry\s+bag|cosmetic\s+bag|makeup\s+bag|wash\s+bag)'
        then 'Bags'
      when subcategory_lower = 'candles & diffusers'
        or haystack_lower ~ '(candle|diffuser|aroma)'
        then 'Home & Living'
      when subcategory_lower = 'lip balms'
        or haystack_lower ~ '(lip\s+balm|chapstick)'
        then 'Personal Care'
      when subcategory_lower = 'hand sanitiser'
        or haystack_lower ~ '(hand\s+sanitis[er|or]+|sanitis[er|or]+|sanitiz[er|or]+|wet\s+wipes?|anti[- ]?bacterial|antibacterial)'
        then 'Personal Care'
      when subcategory_lower = 'face masks'
        or haystack_lower ~ '(face\s+masks?|cotton\s+masks?|children''s\s+masks?)'
        then 'Personal Care'
      when subcategory_lower = 'lotions & sunscreens'
        or haystack_lower ~ '(sunscreen|sun\s+screen|sunblock|sun\s+block|lotion|after\s+sun)'
        then 'Personal Care'
      when subcategory_lower = 'first aid'
        or haystack_lower ~ '(first\s+aid|medical\s+kit|safety\s+kit)'
        then 'Personal Care'
      when subcategory_lower = 'manicure sets'
        or haystack_lower ~ '(manicure|pedicure|nail\s+file|nail\s+care|nail\s+clipper)'
        then 'Personal Care'
      when haystack_lower ~ '(mirror|compact\s+brush|vanity|beauty)'
        then 'Personal Care'
      when haystack_lower ~ '(bath\s+salt|bath\s+bomb|soap|spa|body\s+brush|massager|massage|bath|(^|[^a-z])tissues?([^a-z]|$))'
        then 'Personal Care'
      when haystack_lower ~ '(comb|toothbrush|hair\s+brush|hairbrush|hair\s+detangler|grooming|razor|shaver)'
        then 'Personal Care'
      else null
    end as suggested_category,
    case
      when haystack_lower ~ '(toiletry\s+bag|cosmetic\s+bag|makeup\s+bag|wash\s+bag)'
        then 'Toiletry Bags'
      when subcategory_lower = 'candles & diffusers'
        or haystack_lower ~ '(candle|diffuser|aroma)'
        then 'Candles & Diffusers'
      when subcategory_lower = 'lip balms'
        or haystack_lower ~ '(lip\s+balm|chapstick)'
        then 'Lip Balms'
      when subcategory_lower = 'hand sanitiser'
        or haystack_lower ~ '(hand\s+sanitis[er|or]+|sanitis[er|or]+|sanitiz[er|or]+|wet\s+wipes?|anti[- ]?bacterial|antibacterial)'
        then 'Hand Sanitiser'
      when subcategory_lower = 'face masks'
        or haystack_lower ~ '(face\s+masks?|cotton\s+masks?|children''s\s+masks?)'
        then 'Face Masks'
      when subcategory_lower = 'lotions & sunscreens'
        or haystack_lower ~ '(sunscreen|sun\s+screen|sunblock|sun\s+block|lotion|after\s+sun)'
        then 'Sunscreen & Lotions'
      when subcategory_lower = 'first aid'
        or haystack_lower ~ '(first\s+aid|medical\s+kit|safety\s+kit)'
        then 'First Aid'
      when subcategory_lower = 'manicure sets'
        or haystack_lower ~ '(manicure|pedicure|nail\s+file|nail\s+care|nail\s+clipper)'
        then 'Manicure Sets'
      when haystack_lower ~ '(mirror|compact\s+brush|vanity|beauty)'
        then 'Mirrors & Beauty Accessories'
      when haystack_lower ~ '(bath\s+salt|bath\s+bomb|soap|spa|body\s+brush|massager|massage|bath|(^|[^a-z])tissues?([^a-z]|$))'
        then 'Bath & Body'
      when haystack_lower ~ '(comb|toothbrush|hair\s+brush|hairbrush|hair\s+detangler|grooming|razor|shaver)'
        then 'Grooming'
      else null
    end as suggested_subcategory
  from classified
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  coalesce(suggested_category, '(manual review)') as suggested_category,
  coalesce(suggested_subcategory, '(manual review)') as suggested_subcategory,
  count(*) as total_products,
  count(*) filter (where is_published = true) as published_products,
  count(*) filter (where suggested_category is null or suggested_subcategory is null) as manual_review_products,
  (array_agg(name order by name))[1:5] as example_products
from suggested
group by
  current_category,
  current_subcategory,
  suggested_category,
  suggested_subcategory
order by
  manual_review_products desc,
  published_products desc,
  total_products desc,
  current_category,
  current_subcategory;
