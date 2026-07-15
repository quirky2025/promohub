-- Re-file mis-categorised PURE keytags into "Key Rings".
-- Rule (confirmed): functional items that merely HAVE a keyring stay in their functional
-- category (bottle-opener/keytag, charging-cable/keyring, first-aid/keyring, etc.).
-- Only standalone keytags move here.

-- ── STEP 0: BACKUP ──
create table products_bak_keytag_refile_0711 as
select id, supplier_sku, name, category, subcategory
from products
where supplier_sku in (
  '116565','104645','LL3527','LL3529','LL3531','LL3522','LL3524','LL3526',
  'LL102','LL3533','LL3535','LN0020','LN102','LL2659','LN0075','LN0068'
);

-- ── STEP 1: PREVIEW (see current → will become Key Rings) ──
select supplier_sku, name, category as old_cat, subcategory as old_sub
from products
where supplier_sku in (
  '116565','104645','LL3527','LL3529','LL3531','LL3522','LL3524','LL3526',
  'LL102','LL3533','LL3535','LN0020','LN102','LL2659','LN0075','LN0068'
)
order by supplier_sku;

-- ── STEP 2: APPLY ──
-- Metal Keyrings (stainless steel + the mis-categorised metal one)
update products set category='Key Rings', subcategory='Metal Keyrings'
where supplier_sku in ('116565','LL3527','LL3529','LL3531');

-- Eco Keyrings (bamboo zinc)
update products set category='Key Rings', subcategory='Eco Keyrings'
where supplier_sku in ('LL3522','LL3524','LL3526');

-- Silicone & PVC Keyrings
update products set category='Key Rings', subcategory='Silicone & PVC Keyrings'
where supplier_sku in ('LN0068');

-- Novelty Keyrings (plastic/woven/misc keytags)
update products set category='Key Rings', subcategory='Novelty Keyrings'
where supplier_sku in ('104645','LL102','LL3533','LL3535','LN0020','LN102','LL2659','LN0075');

-- ── STEP 3: VERIFY (should show 0 keytags left in Tools & Auto / Novelty Toys) ──
select category, subcategory, count(*) n
from products
where supplier_sku in (
  '116565','104645','LL3527','LL3529','LL3531','LL3522','LL3524','LL3526',
  'LL102','LL3533','LL3535','LN0020','LN102','LL2659','LN0075','LN0068'
)
group by category, subcategory order by n desc;
