-- Insert factory quote: Fujian Juhui Printing — JH21001 Hardcover Notebook A5
-- Run in Supabase SQL editor AFTER factory_quote_product_code.sql.
-- Inserts 1 quote + 3 qty tiers. EXW already converted USD x6.8 -> RMB.

with q as (
  insert into public.factory_quotes (
    factory_id, quote_date, product_code, product_name, product_spec, printing_method,
    lead_time_days, exchange_rate, est_unit_weight_g, units_per_carton,
    carton_length_cm, carton_width_cm, carton_height_cm, available_colours, notes
  )
  values (
    (select id from public.factories where name ilike 'Fujian Juhui%' limit 1),
    '2026-06-26',
    'JH21001',
    'Hardcover Notebook A5',
    'A5 216x148mm · Fabric linen + 2mm greyboard + logo debossing · 160P 100gsm 1+1c · Case bound · 1 ribbon bookmark',
    'Debossing',
    30,
    0.21,
    380,
    60,
    40, 30, 25,
    'JHT-23101, JHT-23102, JHT-23103, JHT-23104, JHT-23105, JHT-23106, JHT-23107, JHT-23108, JHT-23109, JHT-23110, JHT-23111, JHT-23112, JHT-23113, JHT-23114, JHT-23115, JHT-23116, JHT-23117, JHT-23118, JHT-23119, JHT-23120, JHT-23121, JHT-23122, JHT-23123, JHT-23124, JHT-23125, JHT-23126, JHT-23127, JHT-23128, JHT-23129, JHT-23130, JHT-23131, JHT-23132, JHT-23133, JHT-23134, JHT-23135, JHT-23136, JHT-23137, JHT-23138, JHT-23139, JHT-23140, JHT-23141, JHT-23142, JHT-23143, JHT-23144, JHT-23145, JHT-23146, JHT-23147, JHT-23148, JHT-23149, JHT-23150, JHT-23151, JHT-23152, JHT-23153, JHT-23154, JHT-23155, JHT-23156',
    'EXW RMB (USD x6.8) · Heat shrink · ribbon bookmark · linen colours = JHT Classical Cotton card (JHT-23101..23156)'
  )
  returning id
)
insert into public.quote_tiers (quote_id, quantity, exw_unit_price_rmb, sort_order)
select q.id, v.quantity, v.rmb, v.sort_order
from q, (values (500, 14.76, 0), (1000, 13.80, 1), (2500, 12.44, 2)) as v(quantity, rmb, sort_order);

-- verify:
select product_code, product_name, units_per_carton,
       carton_length_cm||'x'||carton_width_cm||'x'||carton_height_cm as carton,
       available_colours
from public.factory_quotes where product_code = 'JH21001';
