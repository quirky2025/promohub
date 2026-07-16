# QuirkyPromo — Work Log (session 2026-07-16)

> Living log so nothing is lost if the chat dies. Newest section = current state.
> "RUN" = execute .sql in Supabase. "PUSH" = git add/commit/push + merge to main (Vercel deploys). Code files are NOT run in Supabase.

---

## KEY FACTS / DECISIONS (read me first)

- **Order/PO numbering (NEW, unified):** `OC{FY}{NNNN}` for orders, `PO{FY}{NNNN}` for supplier POs.
  - FY = Australian financial year (Jul–Jun), labelled by ending year → **now = 27** (until Jul 2027).
  - Atomic counter in `doc_counters` (`next_doc_number`). Starting points: OC counter=3002 → next auto **OC273003**; PO counter=3001 → next auto **PO273002**.
  - **Ian's order stays a historical exception: INV-260707** (not renumbered).
- **Exchange rate for China cost:** 1 AUD = **¥4.5** (buffered ~5% off ~4.7 spot).
- **Bank (our invoices):** ANZ · Grow Your Marketing · BSB 012-306 · Acct 192040129 · ABN 95 656 714 270.
- **Customer-facing copy = English.** Text colour = pure black #000 (no grey). Brand: NAVY #1B2A4A, GOLD #C9A96E.

## PEOPLE / ACCOUNTS
- **Customer: Kintsugi Hero** — Ian Westmoreland `iwestmoreland1003@gmail.com`, 75 Queens Rd, Asquith NSW 2077. Order **INV-260707**.
  - Recipient for VIC parcels: **Sarah Rosse** `sarahrosse@kintsugiheroes.com.au`, 20 Centenary Drive, Trafalgar VIC 3824, 0411533722.
- **Customer: Parcelle** — boss **Jenny** `hello@parcelle.com.au`. Order **OC273002**. Long-term customer, monthly account.
- **Supplier: Trends** (Tuapeka Gold Print, NZ) `ar@trends.nz` — monthly account.
- **Supplier: Make Badges Pty Ltd** (Thomastown VIC) `info@makebadges.com.au` — prepaid.
- **Factory (China): DG WC CLO Accessories Co., Ltd** — contact **Kaylee** (WeChat **Kaylee630**), DongGuan. ⚠️ see OPEN ITEM #1.

---

## SQL FILES — run order & status (all in `outputs/` folders)

| # | File | Purpose | Status |
|---|------|---------|--------|
| 1 | `crm_brevo/contacts_consent_columns.sql` | marketing consent columns on contacts | RUN? confirm |
| 2 | `admin_order_flow/order_shipments_schema_CREATE.sql` | order_shipments table (+recipient_email) | RUN? confirm |
| 3 | `admin_order_flow/ian_kintsugi_order_seed.sql` | Ian order INV-260707 + contact | RUN? confirm |
| 4 | `admin_order_flow/ian_supplier_pos_seed.sql` | Ian's 3 supplier POs (Trends×2 + Make Badges), all PAID | RUN? confirm |
| 5 | `admin_order_flow/ian_shipments_seed.sql` | Ian's 3 parcels w/ tracking (no emails) | RUN? confirm |
| 6 | `production/suppliers_po_schema_CREATE.sql` | suppliers + purchase_orders (pre-existing) | RUN? confirm |
| 7 | `admin_order_flow/doc_counters_fy.sql` | FY numbering counter (OC=3002, PO=3001) | **RUN NOW (before code goes live)** |
| 8 | `admin_order_flow/parcelle_order_seed.sql` | Parcelle order OC273002 ($1,265, monthly) | pending |
| 9 | `admin_order_flow/parcelle_factory_cost_po.sql` | DG WC CLO cost PO273001 (¥1,300÷4.5=$288.89) | pending — ⚠️ OPEN ITEM #1 |

## CODE CHANGED — push + merge to main
- `lib/brevo.js` (new) · `app/api/subscribe/route.js` (new) · `components/SubscribeBar.jsx` (new) · `components/Footer.jsx` — footer Subscribe wired. **PUSHED earlier.**
- `app/api/admin/orders/shipments/route.js` (new) — multi-parcel shipments API. **PUSHED.**
- `app/admin/orders/page.js` — Shipments section + item name/SKU/branding display + per-item status. **PUSHED (item-status in latest).**
- `app/api/admin/orders/item-status/route.js` (new) — per-line status. **PUSHED (latest).**
- `app/admin/production/page.js` — multiple POs per order + "+PO". **PUSHED.**
- `lib/docNumbers.js` — FY unified numbering + counter. **PUSHED + MERGED (2026-07-16).**
- `.gitignore` — added `/outputs/` (stop tracking scratchpad).

## DOCUMENTS GENERATED (open in browser → Print → PDF)
- `outputs/kintsugi_docs/QuirkyPromo_CreditNote_CN-260707.html` — Ian credit note, net **−$123.20 inc GST** (pen→Digital −$196, notebook→3col +$84).
- `outputs/kintsugi_docs/QuirkyPromo_Invoice_INV-260707_REVISED.html` — Ian revised invoice, new total **$1,557.67**.
- `outputs/kintsugi_docs/QuirkyPromo_Invoice_Parcelle.html` — Parcelle tax invoice **INV273002 / Order OC273002**, $1,265 monthly.

---

## IAN ORDER — full picture (INV-260707)
- Items (revised): Badge×6 $114 · Shirt×2 $140 · Athena Pen×250 **Digital Print** $231.50 · Mug×48 $310.56 · Notebook×50 **3-colour** $520 · Freight $100. Subtotal $1,304.86 · GST $141.61 · **Total $1,557.67**.
- Paid original $1,680.87 → **credit $123.20 owed back** (CN-260707).
- Supplier costs (ex-GST): Trends shirts 1762639 $112.80 · Make Badges 48235 $107.17 · Trends sample 1756482 $14.02 — all PAID.
- Parcels: Shirts→Sarah VIC (FedEx 533302659347); Badges×4→Sarah VIC (AusPost 34EQA5017115); Badges×2→our Hornsby addr (AusPost 34EQA5017116).
- Still pending: Trends invoice for the MAIN bulk (pens/mugs/notebooks) — add as another PO when it arrives.

## PARCELLE ORDER — full picture (OC273002)
- Sell: PU Leather Wallet 8.5cm ×500 @ $2.30 (freight incl) = $1,150 +GST $115 = **$1,265**, monthly account, lead 2–3 wks.
- Cost: DG WC CLO ¥2.60×500 = ¥1,300 ÷4.5 = **$288.89 AUD**. Deposit ¥1,000 paid, balance ¥300. → gross margin ≈ **$861**.

---

## OPEN ITEMS / TO DISCUSS
1. **China suppliers should live under SOURCING, not local Suppliers.** I currently put DG WC CLO into `suppliers` + `purchase_orders` (quick path). Lily wants China factories in the **Sourcing** module (it also does quoting). → NEED: study sourcing module, then move DG WC CLO cost there and remove the suppliers/PO shortcut. **Do NOT run `parcelle_factory_cost_po.sql` until this is decided.**
2. **Add LOCAL suppliers:** LL, PB, AS, GILDAN, MADEIN, NameBadge (Make Badges). (Make Badges only appears once `ian_supplier_pos_seed.sql` is RUN — that's why Lily can't see it yet.)
3. Optional: reusable "Generate Tax Invoice" + "Generate Credit Note" buttons in admin (currently one-off HTML files).
4. Optional: Brevo API key in Vercel env (`BREVO_API_KEY`) to activate marketing sync.

## STANDING RULE — admin UI language
- **All backend/admin UI text → ENGLISH**, EXCEPT the **Sourcing** module (`/admin/sourcing/*`) which stays Chinese (Lily's China-ops side).
- Reason: future operators may be English speakers.
- **Do NOT do a big rename now.** Convert incrementally: whenever a backend file is edited for another reason, switch its Chinese labels to English at the same time. And write ALL NEW admin labels in English from now on.
- Chinese labels currently in the admin that need converting when next touched: production/page.js (从目录算成本, 送货至, PO 日期, 数量, 印刷方式, 加入 PO, 删除, etc.), orders/page.js shipment edit (✏️ 编辑, 保存, 取消), OrderDocuments.jsx (📎 单据/凭证, types), purchase-orders invoice/delete confirms, cost-lookup prompts.

## MAJOR PLANNED FEATURE — Supplier Cost Tables (accurate PO auto-pricing)
Goal: in Raise PO, pick product + qty + print method → ACCURATE cost auto-fills (product + print + setup), no manual typing/guessing. Requested 2026-07-16.
Needs 3 layers:
1. **Product cost by supplier + qty tier** (each supplier's buy price per product, tiered). Today `pricing_tiers.base_price` is sell-basis; need a clean supplier-cost per tier (add column or table).
2. **Decoration cost table by method + supplier** (per-unit + setup, often tiered by colours/qty). e.g. Trends screen print $0.40/unit + setup $40.
3. **Decoration supplier can DIFFER from product supplier** (AS Colour sells blanks; printing done by a separate print supplier → one order = garment cost (AS) + print cost (printer), possibly 2 POs).
Effort: sizable (new schema + rewire cost tool) + ongoing DATA ENTRY (populate each supplier's price list). Plan: design schema first (discuss), then build in steps. Until then: enter PO costs manually from invoices.

## MAJOR PLANNED FEATURE — Per-product freight model
Goal: freight is estimated PER PRODUCT (each product often ships separately with its own freight — Ian's order lost money because flat $30/$50 didn't cover Trends' per-product/per-location freight). Requested 2026-07-16.
- Freight should be calculated per line/product and summed, NOT a flat per-order amount.
- KEEP the ability to combine products into one shipment = one freight (when they genuinely ship together).
- Applies across Quote, Order Confirmation, Invoice, and supplier PO costing.
- Ties to the "supplier cost table" project (freight is part of true cost). Design first, then build.

## PLANNED — "Partially Delivered" derived status
For orders split across multiple addresses (same product to 2 locations), show a derived "🚚 Partially Delivered" when some parcels are delivered and others aren't. Source of truth = order_shipments parcel statuses (already tracked per parcel). Derive: all delivered→Delivered; some delivered + some not→Partially Delivered; all shipped none delivered→Dispatched. Show on order status + Production GATE. Moderate build. Requested 2026-07-16 (Ian's badges: NSW delivered, VIC not).

## DONE — Get-a-Quote: colours × positions + add-ons (2026-07-16)
BUILT into `app/products/[slug]/QuoteWizard.jsx` (ONE file changed — engine untouched). Per print method the customer now sets COLOURS + POSITIONS steppers; an Add-ons section renders addon-type decorations. Pricing:
- **Print run = per-unit rate × colours × positions × qty**; **Setup = setup fee × colours × positions**, amortised per unit — both per colour, per position.
- Trick: `calcUnit` (in ProductClient) already multiplies BOTH per-unit rate AND setup by `setupQty`. So the wizard just sets `setupQty = colours × positions` — no engine change, product page unaffected, maths exact.
- Engraving methods (laser/engrave/deboss/emboss/etch) hide the Colours stepper (positions only).
- Review summary + /api/quote payload send "Method — N COL × M POS".
- esbuild parse clean. PUSH: `app/products/[slug]/QuoteWizard.jsx`.
NOTE: product-page (ProductClient) decoration UI still uses the old single setupQty stepper — fine (feeds same engine), but could later mirror the colours/positions UI for consistency.

## LOG (append newest at bottom)
- 2026-07-16 (later 2): Artwork-approval gate + self-serve Invoice. NO SQL (uses existing artwork_status / artwork_approved_at / payment_status cols). PUSH: `app/admin/orders/page.js`, `app/api/admin/orders/invoice-pdf/route.js` (NEW), `app/api/admin/orders/documents/route.js`. Adds: (1) PRODUCTION GATE — "In Production" button hard-locked (🔒 grey, not clickable) until BOTH artwork_status==='approved' AND payment_status==='paid'; guard also in updateStatus. Gate panel shows two chips (Artwork approved / Payment received) + Ready/Locked. (2) OFFLINE ARTWORK LINE (Ian) — "⬆ Upload approved artwork" (saved to order_documents doc_type 'approved_artwork') auto-marks approved; or "✓ Mark approved (offline)" button. Sets artwork_status=approved + artwork_approved_at, nudges status label to Artwork Approved. (3) "🧾 Generate Tax Invoice (PDF)" button in Payment section → window.open /api/admin/orders/invoice-pdf?id= → builds Tax Invoice via generateOrderDocPDF (docType TAX INVOICE, INV# derived from OC#), cookie-auth, inline PDF to save/send. FUTURE ONLINE LINE (not built, #25-29): backend sends proof → customer clicks approve on token page → auto-records approval → if also paid, auto In Production. Same artwork_status field, no conflict. Lily's rule locked: production needs approved + payment received.

- 2026-07-16 (later): Finance wiring + PO self-serve batch. RUN `outputs/admin_order_flow/po_supplier_invoice_url.sql`. PUSH: app/admin/production/page.js + app/api/admin/purchase-orders/ (route.js pay→bank + DELETE, invoice-upload/route.js) + app/api/admin/products/cost-lookup/. Adds: (1) customer payment→bank IN was already wired (invoices route); (2) NEW PO "Mark paid"→bank OUT; (3) delete whole PO (removes its bank txn too); (4) new POs start blank (no auto-prefill of all order items — fixes multi-supplier clutter); (5) 🔍 search SKU→auto-fill supplier COST (base+deco+setup, no margin; apparel size grid); (6) 📎 upload supplier invoice file to R2 (supplier_invoice_url on PO); (7) PO PDF winansi-safe (no crash on non-latin); (8) modals no longer close on backdrop click; (9) Raise PO ungated. Also: PO text must be ENGLISH (× and Chinese get stripped in PDF). Ian's Make Badges PO had all 5 order items prefilled + garbled "7626mm (+)" → fix by editing to English + deleting the 4 Trends lines.

- 2026-07-16: Created this WORKLOG. Everything above captured.
- 2026-07-16: Studied Sourcing module (requests → cost sheet/costing → quote → sourcing_orders; RMB-native, freight engine, factory POs, Finance). Confirmed China orders belong there, not local suppliers.
- 2026-07-16: Lily RAN `parcelle_factory_cost_po.sql` → DG WC CLO went into LOCAL suppliers (wrong). Created `outputs/admin_order_flow/rollback_dgwc_from_suppliers.sql` to remove it (deletes PO273001 + DG WC CLO supplier; factories entry kept). PENDING RUN.
- 2026-07-16: Local suppliers confirmed: LL=Logo Line, PB=PromoBrands, AS=AS Colour, GILDAN=Gildan, MADEIN=?(placeholder "Made In"), NameBadge=Make Badges. Created `outputs/admin_order_flow/local_suppliers_seed.sql` (idempotent). PENDING RUN + confirm "Made In" full name.
- 2026-07-16: DECISION PENDING — how to record Parcelle's China order in Sourcing (walk the costing UI vs seed sourcing_orders). Do NOT re-run the factory-cost PO.
- 2026-07-16: ARCHITECTURE AGREED — ALL orders live in Local Orders (/admin/orders) = the "总台" (customer, sell, invoice, status/stage, dispatch). China-sourced orders ALSO get a Sourcing procurement record (factory, RMB cost, freight, exchange rate, factory PO, quote). Linked by the shared OC number. Source of truth: orders=sell/status/dispatch; sourcing=factory/cost/quote.
- 2026-07-16: DG WC CLO was NOT in factories (UI registration didn't save) → created `outputs/admin_order_flow/dgwc_factory_seed.sql` to insert it into factories (工厂管理). PENDING RUN.
- 2026-07-16: Clarified — Sourcing nav "工厂下单 / 订单" is ONE page (/admin/sourcing/orders), not two.
- 2026-07-16: NEW REQUIREMENT — add "Indent No." (indent_number) field to the Sourcing factory order (工厂下单)/PO. Confirm exact intent, then implement.
- 2026-07-16: Optional enhancement offered — 🌏 "Sourced" tag + link on the main Orders board that jumps to the order's Sourcing procurement record.
- 2026-07-16: PU product spec = **3M adhesive backing (3M背贴)** — PU patch/badge 8.5cm, NOT a plain wallet. Record in product name/spec.
- 2026-07-16: BUILT "email Factory PO to factory" for Sourcing (was missing; only PDF existed):
  - NEW `app/api/admin/sourcing/orders/send-po/route.js` — generates Factory PO PDF + Resend emails it to factory email (or override). Needs factory.email in `factories`.
  - `app/admin/sourcing/orders/page.js` — added "✉ 发工厂 PO" button in order detail. **PENDING PUSH + MERGE.**
- 2026-07-16: TODAY'S GOAL — run the China flow end to end: Costing (save estimate) → 工厂下单 (下单 → OC+PO) → ✉ send Factory PO to Kaylee's email, confirm she receives it. NEED Kaylee's email added to DG WC CLO factory record.
- 2026-07-16: Sourcing flow reference: 计价/报价 (save estimate) → 工厂下单/订单 "待下单" list → 「下单 →」 makes OC + factory PO → order detail has OC PDF / Factory PO PDF / ✉ 发工厂 PO.
- 2026-07-16: NEW BIG FEATURE requested — **per-order Document/Evidence Vault (📎 单据/凭证)**. Each order shows ALL its docs, one-click open: factory PO (auto-saved), factory INVOICE (upload), payment proof (upload), product images (thumbnails), customer invoice, other. Table `order_documents` keyed by OC number (works on both main Orders board + Sourcing order). Reuse R2/artwork upload infra. Show on BOTH main order detail + sourcing order detail. AWAITING Lily's go-ahead + confirm storage=R2.
- 2026-07-16: Costing note — factory price ¥1,300 entered as EXW 2.60 × 500 (NOT typed as 1300). Freight ¥185: PENDING confirm (RMB? to AU/DDP or only to China forwarder?) → goes in "Factory to forwarder RMB" or freight engine.
- 2026-07-16: Confirmed — customer sees only the Tax Invoice (INV273002); the $2.30/costing is internal.
- 2026-07-16: Freight = **¥185 RMB, Hong Kong → Sydney** (international, all-in). Enter in costing "Factory to forwarder RMB" = 185; do NOT also pick an air/sea freight mode. Total cost ≈ (1300+185)/4.5 ≈ $330 AUD.
- 2026-07-16: TO ADD — Factory PO must show an "Estimated delivery / lead time" line (from factory). Lily will get the estimate; then wire it into the Factory PO PDF (either manual or auto from costing's Production lead time). PENDING.
- 2026-07-16: FEATURE idea — a Calendar / reminders view: key dates per order (est. delivery, balance-payment due, ship date) + optional auto email reminders (scheduled tasks) e.g. "chase factory 3 days before due", "balance payment due". Build after Parcelle flow is done.
- 2026-07-16: Parallel waits: (a) Kaylee's factory email, (b) factory estimated lead time, (c) push+merge the send-po files.
- 2026-07-16: BUILT Document/Evidence Vault (manual upload, incl. product images):
  - SQL `outputs/admin_order_flow/order_documents_schema.sql` (table order_documents). PENDING RUN.
  - API `app/api/admin/orders/documents/route.js` (GET/POST-upload-to-R2/DELETE). Reuses R2 env (no new vars).
  - Component `components/OrderDocuments.jsx` (type select + file upload + thumbnail gallery + open/delete).
  - Wired into `app/admin/orders/page.js` (main board detail) AND `app/admin/sourcing/orders/page.js` (工厂单 detail). PENDING PUSH+MERGE.
- 2026-07-16: Ian supplier "下单" records — they're in `ian_supplier_pos_seed.sql` (Trends×2 + Make Badges, linked to INV-260707). CONFIRM Lily ran it (after the order seed) so they show in /admin/production. Trends bulk PO still pending its invoice.
- 2026-07-16: PUSH QUEUE (code not yet merged): send-po (sourcing) + document vault (api/route + OrderDocuments.jsx + orders/page.js + sourcing/orders/page.js).
- 2026-07-16: KEY DIRECTION — Lily wants EVERYTHING done via backend UI, not SQL. SQL was bootstrap only. Plan to make Production self-serve:
  - (a) "New Order" manual creator (offline/phone orders) in admin → proper OC number. So no SQL for orders ever again. [BIG, TODO]
  - (b) Sourcing factory POs use "SPO" prefix (SPO27xxxx); local supplier POs stay "PO". China PO must NOT sit in Production. [TODO]
  - (c) Ungate "Raise PO" (allow before paid/approved) so existing/manual orders can be recorded. [TODO]
  - (d) Normalise numbering: Order# = OC (OC273002), Invoice# = INV (INV273002). Fix Ian → Order# OC260707, Invoice# INV-260707 (was showing INV-260707 in Order# slot). Remove stray PO260003 (DG WC CLO) from Production. [TODO]
  - Ian supplier POs: do NOT run the seed — raise them by hand via UI (Make Badges + Trends). Don't run ian_supplier_pos_seed.sql.
  - Parcelle numbering drift: system gave OC260017 (old auto-count ran before FY fix; new fixed-273002 seed was skipped by idempotent guard). DECIDE: renumber → OC273002 (match invoice) OR keep OC260017 (regen invoice). PENDING Lily.
  - Local end-to-end target flow (all UI): New Order → Raise PO(s) → Send PO → +Invoice → Mark paid → In Production → Dispatch/tracking → upload product images (📎 vault).
