-- Per-product cost/quote history, shown on the factory product page.
-- Each row = one costing snapshot: factory cost + China local + international
-- freight (with carrier — different carriers = very different cost) → total
-- landed → my quote (from margin, or typed manually).
create table if not exists public.product_cost_records (
  id                uuid primary key default gen_random_uuid(),
  factory_quote_id  uuid references public.factory_quotes(id) on delete cascade,  -- the product
  sku               text,
  record_date       date default current_date,
  quantity          numeric,
  factory_cost_rmb  numeric,      -- 工厂成本 EXW (total for the qty)
  cn_local_rmb      numeric,      -- 国内部分:内陆运费 + 单证 + 杂费
  intl_freight_rmb  numeric,      -- 国际运费
  carrier           text,         -- DHL (Hong Kong) / DHL (China Mainland) / Air / Sea / Express / 手填
  fx_rate           numeric,      -- ¥ per A$1 (AUD = RMB / fx_rate)
  total_cost_aud    numeric,      -- 总成本(到岸,全单)
  landed_unit_aud   numeric,      -- 到岸/个
  margin_pct        numeric,      -- 毛利%
  quote_unit_aud    numeric,      -- 我的报价(客户单价)
  quote_manual      boolean default false,  -- 报价是否手填
  note              text,
  created_by        text,
  created_at        timestamptz default now()
);
create index if not exists idx_pcr_product on public.product_cost_records(factory_quote_id);
create index if not exists idx_pcr_sku on public.product_cost_records(sku);
