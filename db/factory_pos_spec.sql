-- Factory PO carries a product SPEC line (size / colour / 3M adhesive backing /
-- other requirements) so the PO you send to the factory states exactly what to make.
alter table public.factory_pos
  add column if not exists product_spec text;
