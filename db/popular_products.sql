-- D12 · 热销榜:基于 product_stock_history 每日快照算消耗速度
-- 消耗 = 相邻两天库存下降之和(只计下降,忽略补货上涨,更接近真实动销)
-- 用法:select * from popular_products(7);

create or replace function public.popular_products(days_back int default 7)
returns table (
  supplier_sku text,
  colour_name  text,
  consumed     bigint,
  latest_qty   integer,
  snapshots    integer
)
language sql stable as $$
  with h as (
    select supplier_sku, colour_name, captured_at, qty,
           lag(qty) over (partition by supplier_sku, colour_name order by captured_at) as prev_qty
    from public.product_stock_history
    where captured_at >= current_date - days_back
  )
  select supplier_sku,
         colour_name,
         coalesce(sum(greatest(prev_qty - qty, 0)), 0)::bigint as consumed,
         (array_agg(qty order by captured_at desc))[1] as latest_qty,
         count(*)::int as snapshots
  from h
  group by supplier_sku, colour_name
  having coalesce(sum(greatest(prev_qty - qty, 0)), 0) > 0
  order by consumed desc
  limit 300;
$$;
