-- Tie a supplier PO to a specific product on the order, so each product on the
-- order can show its own supplier PO(s). Existing POs stay null (show at order
-- level in Production as before).
alter table public.purchase_orders
  add column if not exists order_item_index integer;
