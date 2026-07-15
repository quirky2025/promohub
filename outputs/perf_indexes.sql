-- ============================================================
-- 全站提速:数据库索引 —— 这是根因(产品页只查一条也要 3 秒 = 全表扫描)。
-- 安全:IF NOT EXISTS,已存在跳过。可【整块】一次跑(你的表量级建索引很快,锁表仅一瞬)。
-- ============================================================

-- ① 产品页按 slug 查(最高频)
create index if not exists idx_products_slug on products (slug);

-- ② 类目/子类列表:is_published + category / subcategory,+ order by name
create index if not exists idx_products_pub_category    on products (is_published, category);
create index if not exists idx_products_pub_subcategory on products (is_published, subcategory);
create index if not exists idx_products_pub_name        on products (is_published, name);

-- ③ 三个子表外键(PostgREST 内嵌 join 全靠它 —— 缺了每父行扫一次子表,最拖慢)
create index if not exists idx_product_colours_pid    on product_colours (product_id);
create index if not exists idx_pricing_tiers_pid      on pricing_tiers (product_id);
create index if not exists idx_decoration_options_pid on decoration_options (product_id);

-- ④ url_pages 每页都按 slug + status 查
create index if not exists idx_url_pages_slug   on url_pages (slug);
create index if not exists idx_url_pages_status on url_pages (status);

-- ⑤ supplier 筛选(可选)
create index if not exists idx_products_supplier on products (supplier);

-- ⑥ 让规划器用上新索引
analyze products;
analyze product_colours;
analyze pricing_tiers;
analyze decoration_options;
analyze url_pages;

-- 诊断(可选):跑完看索引都在
-- select tablename, indexname from pg_indexes
-- where tablename in ('products','product_colours','pricing_tiers','decoration_options','url_pages')
-- order by tablename, indexname;
