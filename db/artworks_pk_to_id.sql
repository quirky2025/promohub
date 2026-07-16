-- artworks currently has PRIMARY KEY (order_number) → only ONE artwork row per
-- order, which blocks per-product artwork cards. Move the primary key to a
-- surrogate id so an order can have many artwork rows (one per product).
-- Non-destructive: keeps all existing rows, just restructures the key.

-- 1. surrogate id (existing rows get a fresh uuid each via the volatile default)
alter table public.artworks add column if not exists id uuid default gen_random_uuid();
update public.artworks set id = gen_random_uuid() where id is null;
alter table public.artworks alter column id set not null;

-- 2. swap the primary key: order_number → id
alter table public.artworks drop constraint artworks_pkey;
alter table public.artworks add constraint artworks_pkey primary key (id);

-- 3. keep order_number fast to look up (now non-unique)
create index if not exists artworks_order_number_idx on public.artworks (order_number);
