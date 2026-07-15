-- ============================================================
-- Ian / Kintsugi (INV-260707) — supplier costs (accounts payable)
-- Records the 3 supplier invoices received so far as purchase_orders,
-- linked to the customer order. Costs are stored EX-GST (to match the
-- ex-GST sales figure, so per-order margin / P&L is correct). The GST-
-- inclusive amount you actually pay is noted in each PO's notes.
--
-- Run AFTER: suppliers_po_schema_CREATE.sql and the Ian order seed.
-- Run in Supabase SQL editor. Idempotent.
--
-- PAYMENT: all 3 are marked 'paid' (you confirmed all three are paid).
-- ============================================================

-- 1) Suppliers ────────────────────────────────────────────────
insert into suppliers (name, email, payment_terms, notes)
select 'Trends (Tuapeka Gold Print Ltd)', 'ar@trends.nz', 'account', 'NZ decorator/supplier. Terms: 20th of month following invoice. ABN 45-106-330-034.'
where not exists (select 1 from suppliers where lower(name) like 'trends%');

insert into suppliers (name, email, payment_terms, notes)
select 'Make Badges Pty Ltd', 'info@makebadges.com.au', 'prepaid', 'Name badge supplier, Thomastown VIC. ABN 96158642310. Ph 1300 16 4416.'
where not exists (select 1 from suppliers where lower(name) like 'make badges%');

-- 2) Purchase orders (linked to the customer order INV-260707) ─
-- Trends — shirts (PI 1762639)
insert into purchase_orders (
  po_number, order_id, order_number, supplier_id, status,
  cost_subtotal, freight_cost, cost_total,
  supplier_invoice_number, supplier_invoice_at, supplier_payment_status, supplier_paid_at,
  items, notes
)
select 'SP260707-1',
  (select id from orders where invoice_number = 'INV-260707' limit 1), 'INV-260707',
  (select id from suppliers where lower(name) like 'trends%' limit 1), 'received',
  97.80, 15.00, 112.80,
  '1762639', timestamptz '2026-07-14', 'paid', now(),
  '[{"stockCode":"123608","name":"Parker Women''s Poplin Shirt","qty":2,"unitCost":26.90},
    {"stockCode":"128886","name":"Colourflex Transfer Per Position","qty":2,"unitCost":2.00},
    {"stockCode":"103786","name":"Setup","qty":1,"unitCost":40.00}]'::jsonb,
  'Trends PI 1762639 · paid $124.08 inc GST · shirts to Sarah Rosse (VIC) · FedEx 533302659347'
where not exists (select 1 from purchase_orders where po_number = 'SP260707-1');

-- Make Badges — 6 badges (INV 48235)
insert into purchase_orders (
  po_number, order_id, order_number, supplier_id, status,
  cost_subtotal, freight_cost, cost_total,
  supplier_invoice_number, supplier_invoice_at, supplier_payment_status, supplier_paid_at,
  items, notes
)
select 'SP260707-2',
  (select id from orders where invoice_number = 'INV-260707' limit 1), 'INV-260707',
  (select id from suppliers where lower(name) like 'make badges%' limit 1), 'received',
  89.67, 17.50, 107.17,
  '48235', timestamptz '2026-07-09', 'paid', now(),
  '[{"stockCode":"MFNB26-RDW","name":"Name Badge 76x26mm Gloss White (Magnetic + Resin Dome)","qty":6,"unitCost":14.95}]'::jsonb,
  'Make Badges INV 48235 · $117.89 inc GST · 6 badges + 2-location delivery ($19.25)'
where not exists (select 1 from purchase_orders where po_number = 'SP260707-2');

-- Trends — pre-production notebook SAMPLE (PI 1756482)
insert into purchase_orders (
  po_number, order_id, order_number, supplier_id, status,
  cost_subtotal, freight_cost, cost_total,
  supplier_invoice_number, supplier_invoice_at, supplier_payment_status, supplier_paid_at,
  items, notes
)
select 'SP260707-S',
  (select id from orders where invoice_number = 'INV-260707' limit 1), 'INV-260707',
  (select id from suppliers where lower(name) like 'trends%' limit 1), 'received',
  4.02, 10.00, 14.02,
  '1756482', timestamptz '2026-07-01', 'paid', now(),
  '[{"stockCode":"200216","name":"Phoenix Recycled Hard Cover Notebook (SAMPLE)","qty":1,"unitCost":4.02}]'::jsonb,
  'Trends PI 1756482 · $15.42 inc GST · pre-production sample · FedEx 531694227690'
where not exists (select 1 from purchase_orders where po_number = 'SP260707-S');

-- ⏳ STILL TO COME: the Trends invoice for the MAIN bulk (Athena Pen ×250,
--    Arabica Mug ×48, Phoenix Notebook ×50). Add it as SP260707-3 the same way
--    when it arrives, or raise it in /admin/production.
