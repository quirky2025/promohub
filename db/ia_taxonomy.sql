-- IA · 集合六型分类学(CMS_IA_AND_ALSOFOUNDIN_FIX.md · A)+ Also Found In 解锁(C)
-- 幂等,可重复运行。

-- C:解锁前台匿名读(此前 RLS 挡住了 PDP 的集合 chips)
alter table public.smart_collections disable row level security;
alter table public.collection_products disable row level security;

-- A:品类标签列(可多选;场景/行业类跨品类)
alter table public.smart_collections
  add column if not exists categories jsonb not null default '[]';

-- A:现有集合补录 type + 品类标签
-- Metal / Plastic:v2 材质集合 → material,挂 Pens
update public.smart_collections
set ctype = 'material', categories = '["Pens"]'::jsonb, updated_at = now()
where slug in ('custom-metal-pens-australia', 'custom-plastic-pens-australia');

-- Eco Pens(如已建):attribute,挂 Pens
update public.smart_collections
set ctype = 'attribute', categories = '["Pens"]'::jsonb, updated_at = now()
where slug = 'eco-pens-australia';

-- 其余集合先按名字兜底打品类标签(没匹配到的保持 [],后台补录)
-- 核对现状:
select slug, name, ctype, categories, status from public.smart_collections order by ctype, name;
