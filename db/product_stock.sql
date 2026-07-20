-- D11 · 供应商库存(Trends 起步)
-- product_stock: 当前库存快照(每次同步覆盖)
-- product_stock_history: 每日留痕,用于算消耗速度(热销榜)

create table if not exists public.product_stock (
  id            bigint generated always as identity primary key,
  product_id    uuid not null references public.products(id) on delete cascade,
  colour_name   text not null default '',          -- 与前端颜色名对齐;整品无颜色时为 ''
  qty           integer,                            -- null = 未知
  next_shipment text,                               -- 下批到货(日期或供应商原文)
  supplier      text not null default 'Trends',
  synced_at     timestamptz not null default now(),
  unique (product_id, colour_name)
);

create index if not exists product_stock_product_idx
  on public.product_stock (product_id);

create table if not exists public.product_stock_history (
  id           bigint generated always as identity primary key,
  supplier_sku text not null,
  colour_name  text not null default '',
  qty          integer,
  supplier     text not null default 'Trends',
  captured_at  date not null default current_date
);

-- 同一天同一 SKU 颜色只留一条(重复同步时覆盖式忽略)
create unique index if not exists product_stock_history_daily_idx
  on public.product_stock_history (supplier_sku, colour_name, captured_at);

create index if not exists product_stock_history_sku_idx
  on public.product_stock_history (supplier_sku, captured_at);
