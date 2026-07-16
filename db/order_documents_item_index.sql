-- Tag a document to a specific product line of an order, so each product block
-- can show its own invoice / photo / supplier payment proof. Null = order-level.
alter table public.order_documents
  add column if not exists order_item_index integer;
