-- D13 · 站内产品评价(邀评 token → 客户提交 → 审核 → 产品页上墙 + 搜索结果带星)
-- RLS 保持开启:表里有邮箱和 token,前台一律走 service-key 路由读写,匿名不可直读。

create table if not exists public.product_reviews (
  id               uuid primary key default gen_random_uuid(),
  token            uuid not null unique default gen_random_uuid(),  -- 邀评链接令牌
  product_id       uuid not null references public.products(id) on delete cascade,
  order_id         uuid,
  order_item_index integer,
  customer_name    text,
  customer_email   text,
  rating           integer check (rating between 1 and 5),
  body             text,
  status           text not null default 'invited',   -- invited | pending | approved | rejected
  source           text not null default 'invite',
  invited_at       timestamptz default now(),
  submitted_at     timestamptz,
  moderated_at     timestamptz,
  created_at       timestamptz default now()
);

create index if not exists product_reviews_product_idx
  on public.product_reviews (product_id, status);
create index if not exists product_reviews_status_idx
  on public.product_reviews (status);

alter table public.product_reviews enable row level security;
