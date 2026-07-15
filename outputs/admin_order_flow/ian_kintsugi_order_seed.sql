-- ============================================================
-- Seed: Ian Westmoreland / Kintsugi Hero — order INV-260707
-- Run order:
--   1) order_shipments_schema_CREATE.sql
--   2) contacts_consent_columns.sql
--   3) THIS FILE
-- Run in Supabase SQL editor. Email is already filled in — no edits needed.
-- (If INV-260707 is already PAID, just click "Paid" in the order's Payment
--  section in the backend after it appears — no SQL change needed.)
-- ============================================================

-- 1) CRM: company + contact for Ian (a proper customer record; no login needed) ─
insert into public.companies (name, company_key, lifecycle_stage, needs_review)
select 'Kintsugi Hero', 'name:kintsugi hero', 'customer', false
where not exists (select 1 from public.companies where company_key = 'name:kintsugi hero');

insert into public.contacts (company_id, email, first_name, phone, role, marketing_consent, consent_source)
select c.id, 'iwestmoreland1003@gmail.com', 'Ian Westmoreland', '', 'member', false, 'offline'
from public.companies c
where c.company_key = 'name:kintsugi hero'
  and not exists (select 1 from public.contacts where lower(email) = 'iwestmoreland1003@gmail.com');

-- 2) The order itself (shows up on the admin Orders board) ─────────────────────
insert into public.orders (
  order_number, invoice_number,
  customer_name, customer_company, customer_email, customer_phone,
  items, subtotal, shipping, gst, total,
  payment_method, payment_status, status,
  delivery_address, created_at
)
select
  'INV-260707', 'INV-260707',
  'Ian Westmoreland', 'Kintsugi Hero', 'iwestmoreland1003@gmail.com', '',
  '[
    {"productName":"Name Tag / Badge 7.6 × 2.5 cm","sku":"","colour":"","qty":6,"unitPrice":19.00,"subtotal":114.00,"brandingMethod":"Personalised (6 names)","addons":[]},
    {"productName":"TRENDSWEAR Parker Women'' s Poplin Shirt","sku":"123608","colour":"Black","qty":2,"unitPrice":70.00,"subtotal":140.00,"brandingMethod":"Colourflex Transfer (1× 3XL, 1× M)","addons":[]},
    {"productName":"Athena Pen","sku":"104352","colour":"Black","qty":250,"unitPrice":1.71,"subtotal":427.50,"brandingMethod":"Pad print — 2 colour","addons":[]},
    {"productName":"Arabica Coffee Mug","sku":"104193","colour":"Black","qty":48,"unitPrice":6.47,"subtotal":310.56,"brandingMethod":"Screen print — 1 colour","addons":[]},
    {"productName":"Phoenix Recycled Hard Cover Notebook","sku":"200234","colour":"Black","qty":50,"unitPrice":8.72,"subtotal":436.00,"brandingMethod":"Pad print — 2 colour","addons":[]}
  ]'::jsonb,
  1428.06, 100.00, 152.81, 1680.87,
  'eft', 'unpaid', 'dispatched',
  E'Split delivery (2 locations):\n1) 20 Centenary Drive, Trafalgar VIC 3824\n2) 75 Queens Rd, Asquith NSW 2077',
  '2026-07-07T09:00:00+10:00'
where not exists (select 1 from public.orders where invoice_number = 'INV-260707');

-- ============================================================
-- 3) SHIPMENTS — add each parcel in the BACKEND UI (recommended), not here.
--    Each parcel has its OWN recipient + recipient email — the tracking email
--    goes to THAT person (e.g. Sarah for the VIC parcel), not always to Ian.
--    Open the order → "📮 Shipments" → "➕ Add a parcel":
--      • Parcel 1  FedEx   [tracking]  → 20 Centenary Drive, Trafalgar VIC 3824
--                  Recipient: Sarah <sarah's email>
--                  Contents: Parker Women's Shirt ×2   (shipped 14/07)
--      • Parcel 2  [carrier][tracking] → 20 Centenary Drive, Trafalgar VIC 3824
--                  Recipient: Sarah <sarah's email>
--                  Contents: Badges ×4 (Sarah Rosse, Daniel Dougherty, Cindy Vy Nguyen, Tony Bailey)
--      • Parcel 3  [carrier][tracking] → (your address OR 75 Queens Rd, Asquith NSW 2077)
--                  Recipient: Ian <iwestmoreland1003@gmail.com> (or John Milham + his email)
--                  Contents: Badges ×2 (Ian Westmoreland, John Milham)
--    Fill "Recipient email", tick "Email … this tracking", click Add parcel →
--    that recipient gets the tracking email instantly. If you leave recipient
--    email blank, it falls back to the buyer (Ian). Add day-after parcels the same way.
-- ============================================================
