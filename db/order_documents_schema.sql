-- Evidence / documents attached to an order and (optionally) a specific product.
-- doc_type is FREE TEXT (validated in the app) so new kinds like 'approved_artwork',
-- 'invoice', 'product_photo', 'supplier_payment_proof' never hit a DB constraint.
-- The API uses the service key, so RLS is left off (service key bypasses it anyway).
create table if not exists public.order_documents (
  id           uuid primary key default gen_random_uuid(),
  order_number text not null,
  doc_type     text not null default 'other',
  title        text,
  file_url     text not null,
  file_name    text,
  mime         text,
  created_at   timestamptz not null default now()
);

create index if not exists order_documents_order_number_idx
  on public.order_documents (order_number);
