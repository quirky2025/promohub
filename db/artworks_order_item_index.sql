-- Link an artwork record to the exact order line it belongs to, so that when a
-- customer approves that product's proof online, we can flip THAT item's
-- artwork_approved flag on the order (drives the per-product production gate).
-- Safe to run more than once.
alter table public.artworks
  add column if not exists order_item_index integer;

comment on column public.artworks.order_item_index is
  'Index into orders.items[] this proof is for (per-product artwork approval). Null = legacy/whole-order.';
