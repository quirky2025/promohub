-- LN INDENT quote-only NARROW fix — touches ONLY 30 Logoline LN products.
-- TRENDS / PromoBrands / all other indent products are NOT affected (gated on new quote_only flag, not indent_type).

-- (optional) backup first:
-- create table decoration_options_bak_ln_0710 as select d.* from decoration_options d join products p on p.id=d.product_id where p.supplier ilike 'logoline%' and upper(p.supplier_sku) like 'LN%';

-- STEP 0: add columns (idempotent, safe)
alter table products add column if not exists quote_only boolean default false;
alter table products add column if not exists quote_ref_price numeric;  -- reference COST; frontend shows x1.4

-- STEP 1: LN246 = pure custom (no base price) -> quote-only, no reference number (POA)
update products set quote_only=true where supplier ilike 'logoline%' and supplier_sku='LN246';

-- STEP 2: 29 bundled 'product-with-print' -> quote-only + reference price = all-in COST
update products p set quote_only=true, quote_ref_price=v.ref
from (values
  ('LN0040', 2.5),   -- sell $3.5
  ('LN0065', 0.65),   -- sell $0.91
  ('LN0068', 1.2),   -- sell $1.68
  ('LN0070', 0.55),   -- sell $0.77
  ('LN0072', 1.0),   -- sell $1.4
  ('LN0073', 1.2),   -- sell $1.68
  ('LN0075', 2.8),   -- sell $3.92
  ('LN15238', 1.28),   -- sell $1.79
  ('LN3857', 0.52),   -- sell $0.73
  ('LN5050', 0.54),   -- sell $0.76
  ('LN5778', 0.89),   -- sell $1.25
  ('LN7615', 4.2),   -- sell $5.88
  ('LN7617', 7.0),   -- sell $9.8
  ('LN7619', 4.4),   -- sell $6.16
  ('LN7621', 4.05),   -- sell $5.67
  ('LN78102', 1.28),   -- sell $1.79
  ('LN9002', 17.5),   -- sell $24.5
  ('LN9003', 16.8),   -- sell $23.52
  ('LN9018', 13.98),   -- sell $19.57
  ('LN9019', 15.16),   -- sell $21.22
  ('LN9067', 7.16),   -- sell $10.02
  ('LN9077', 29.8),   -- sell $41.72
  ('LN9078', 10.4),   -- sell $14.56
  ('LN9082', 11.86),   -- sell $16.6
  ('LN9085', 13.98),   -- sell $19.57
  ('LN9099', 5.65),   -- sell $7.91
  ('LN9935', 16.5),   -- sell $23.1
  ('LN9954', 30.01),   -- sell $42.01
  ('LN9955', 59.0)    -- sell $82.6
) as v(sku, ref)
where p.supplier ilike 'logoline%' and p.supplier_sku = v.sku;

-- STEP 3: delete the POLLUTED decoration rows for the 29 bundled (they held the all-in price)
delete from decoration_options d using products p
where d.product_id=p.id and p.supplier ilike 'logoline%'
  and p.supplier_sku in (
    'LN0040', 'LN0065', 'LN0068', 'LN0070', 'LN0072', 'LN0073', 'LN0075', 'LN15238', 'LN3857', 'LN5050', 'LN5778', 'LN7615', 'LN7617', 'LN7619', 'LN7621', 'LN78102', 'LN9002', 'LN9003', 'LN9018', 'LN9019', 'LN9067', 'LN9077', 'LN9078', 'LN9082', 'LN9085', 'LN9099', 'LN9935', 'LN9954', 'LN9955'
  );

-- VERIFY (expect 30 rows quote_only=true; the 29 bundled deco_rows=0)
select p.supplier_sku, p.name, p.quote_only, p.quote_ref_price, round(p.quote_ref_price*1.4,2) as ref_sell,
       (select count(*) from decoration_options d where d.product_id=p.id) as deco_rows
from products p where p.supplier ilike 'logoline%' and p.quote_only=true order by p.supplier_sku;
