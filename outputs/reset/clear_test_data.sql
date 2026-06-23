-- ⚠️ CLEAR TEST DATA — start the whole flow fresh. PERMANENT DELETE.
-- KEEPS: customers, suppliers, products, product_templates.
-- REMOVES: orders (+ children), artworks, enquiries/quotes.
-- Run in Supabase SQL editor. If any line errors "relation ... does not exist",
-- just delete THAT line and run again (some tables may not exist in your DB).

-- 1) order children first (so foreign keys are happy)
delete from order_payments;
delete from purchase_orders;
delete from order_items;
delete from artwork_proofs;
delete from order_approvals;
delete from order_status_log;

-- 2) main records
delete from orders;
delete from artworks;

-- 3) enquiries & quotes
delete from quotes;
delete from deals;
delete from leads;
