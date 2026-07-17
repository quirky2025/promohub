-- Richer product detail fields on the sourcing product (factory_quotes).
-- Material / product size / craft(process) / packaging — beyond the single
-- free-text 型号/规格 (product_spec).
alter table public.factory_quotes
  add column if not exists material     text,   -- 材质, e.g. PU leather / 304 steel
  add column if not exists product_size text,   -- 产品尺寸 (the item itself, not the carton)
  add column if not exists craft        text,   -- 工艺, e.g. 烫金 / 压纹 / 激光
  add column if not exists packaging    text;   -- 包装, e.g. OPP bag + gift box
