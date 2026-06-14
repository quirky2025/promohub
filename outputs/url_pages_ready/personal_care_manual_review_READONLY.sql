-- Personal Care manual review list
-- READ ONLY. Run if personal_care_normalization_summary_READONLY.sql shows manual_review_products > 0.

with classified as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.brand,
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
  current_category,
  current_subcategory,
  supplier_sku,
  name,
  brand,
  is_published
from suggested
where suggested_category is null
   or suggested_subcategory is null
order by
  current_category,
  current_subcategory,
  name;
