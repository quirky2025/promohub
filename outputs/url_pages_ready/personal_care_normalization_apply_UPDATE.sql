-- Personal Care normalization APPLY
-- Run only after reviewing personal_care_normalization_summary_READONLY.sql.
-- Updates only products with a clear target.
-- Leaves manual-review rows untouched.

begin;

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
  count(*) filter (where new_category = 'Personal Care') as updated_to_personal_care,
  count(*) filter (where new_category = 'Bags') as updated_to_bags,
  count(*) filter (where new_category = 'Home & Living') as updated_to_home_living
from updated;

commit;
