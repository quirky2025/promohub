-- product_templates: per-product print template for auto artwork proofs.
-- Built on demand (one per product, reused forever). Box stored as FRACTIONS
-- of the template image (0..1, y from top) so it is resolution-independent.

create table if not exists product_templates (
  id           uuid primary key default gen_random_uuid(),
  stock_code   text unique not null,
  product_name text,
  template_url text not null,          -- rasterised template image (public path or full URL)
  box_x        real not null,          -- print box left   (fraction of width)
  box_y        real not null,          -- print box top    (fraction of height, from top)
  box_w        real not null,          -- print box width  (fraction)
  box_h        real not null,          -- print box height (fraction)
  print_size   text,                   -- e.g. "35 x 50 mm"
  print_method text,                   -- e.g. "Pad Print (Front)"
  base_colour  text,                   -- template's product colour
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Seed: Aura Vacuum Bottle 600ml (black template lives at public/templates/128027.png)
insert into product_templates
  (stock_code, product_name, template_url, box_x, box_y, box_w, box_h, print_size, print_method, base_colour)
values
  ('128027', 'Aura Vacuum Bottle 600ml', '/templates/128027.png',
   0.210, 0.372, 0.245, 0.193, '35 x 50 mm', 'Pad Print (Front)', 'Black')
on conflict (stock_code) do update set
  product_name = excluded.product_name,
  template_url = excluded.template_url,
  box_x = excluded.box_x, box_y = excluded.box_y,
  box_w = excluded.box_w, box_h = excluded.box_h,
  print_size = excluded.print_size,
  print_method = excluded.print_method,
  base_colour = excluded.base_colour,
  updated_at = now();
