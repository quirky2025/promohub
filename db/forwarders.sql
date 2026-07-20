-- Freight forwarders master data (like factories), incl. bank/payment info so
-- you can pay them for international freight. Full CRUD in Sourcing → 货代管理.
create table if not exists public.forwarders (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  short_code        text,
  contact_person    text,
  wechat            text,
  phone             text,
  email             text,
  -- bank / payment info
  bank_name         text,
  bank_branch       text,
  bank_address      text,
  swift             text,
  account_number    text,
  account_currency  text default 'AUD',
  payment_terms     text,
  remark            text,          -- e.g. 运费
  notes             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Seed the first forwarder Lily gave (idempotent — won't duplicate on re-run).
insert into public.forwarders (name, wechat, bank_name, bank_branch, bank_address, swift, account_number, account_currency, remark)
select
  'Zhejiang Bing Supply Chain Management Co., Ltd',
  'WeChat',
  'Bank of China',
  'Yiwu Branch',
  'No.500, Chouzhou North Road, Yiwu City, Zhejiang Province, PR China',
  'BKCHCNBJ92H',
  '354577334824',
  'AUD',
  '运费 (freight)'
where not exists (select 1 from public.forwarders where name = 'Zhejiang Bing Supply Chain Management Co., Ltd');
