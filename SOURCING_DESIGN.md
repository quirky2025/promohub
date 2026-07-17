# Sourcing / Indent (China) — Design (confirmed with Lily, discuss-first, 2026-07-17)

Rule for this build: **discuss + confirm EVERY piece before writing code.** No building until the whole design is signed off. (Lesson from the Ian day: piecemeal fixing wasted time.)

**STANDING RULE (Lily, 2026-07-17): EVERY record/entity in every step must have full CRUD — create, READ, EDIT, delete.** Never ship "delete-only". Edit = a pencil/编辑 button that opens the same form pre-filled, saves an update. Applies to: products (done), quotes, orders, factory POs, factory invoices, payments (RMB + Dad AUD), tracking, everything. Build edit in from the start — do not defer.

## Confirmed architecture

- **One customer view.** Customer QUOTES live in the main **Enquiries & Quotes** board; customer ORDERS live in **/admin/orders**. China ones are tagged **INDENT** (local vs indent), same boards, not a separate system. Reuses all the per-product machinery built for local orders (artwork optional, freight, notify, invoice, credit note).
- **Sourcing = procurement backend.** It owns: factories, the product library, RMB costing, forwarder freight estimate, factory PO, RMB payment + proof, AUD settlement, factory-side tracking. It **links to the customer order by order number** — it does NOT hold its own customer order.
- Flow: Sourcing(建工厂 → 建产品 → 算成本) → **报价给客户(主板, INDENT)** → **PROCEED(手动)** → 建客户订单(/admin/orders, 调 Sourcing 产品) → 工厂 PO / RMB 付款 / 跟货(Sourcing) → tracking 回到客户订单。

## Confirmed: Product library

- Each **factory** gets a short **code** (set once, e.g. DG WC CLO → `DGWC`).
- **Product** belongs to ONE factory (`factory_id`). **SKU auto = `{factoryCode}-{seq}`** (DGWC-001…).
- Factory detail page = **that factory's product list** (with each product's price), replacing today's raw "quote history".
- Optional **comparison group** (`group_id`, nullable) links the *same item* across factories → the 比价 page shows multi-factory RMB prices. Simple single-factory products leave it null.
- Product fields: SKU, name, factory, group(optional), category, specs(material/dimensions/packaging), colours, print/decoration options (can be **无印刷**), MOQ, **carton (units/carton, L×W×H cm, gross weight)** [needed for freight], **RMB cost tiered by qty** + one-off costs (tooling/setup/sample RMB), FX (or global), lead time, image, status.
- **Pricing tiers per product:** each tier = { qty, RMB EXW unit, **default AUD sell unit** }. BOTH stored (default AUD sell) AND re-computable via costing. Reuse existing `quote_tiers` (quantity, exw_unit_price_rmb, customer_unit_price_aud).

## Confirmed: Quote + PROCEED

- Customer quote = a record on the main Enquiries & Quotes board, tagged INDENT. Status: `draft → sent → proceed / declined`. Can be **email-only, no PDF** — just mark "sent" to keep the record + timestamp. Costing (RMB→AUD) stays in Sourcing and feeds the quote's AUD price.
- **PROCEED gate (manual now):** only when the quote is marked **PROCEED** can you (a) create the customer order and (b) raise the factory PO. No PROCEED → factory PO locked (same idea as the production gate). Later: optional customer-clicks-proceed link (automate for repeat customers).

## Confirmed: Procurement location (steps 7–10)

- Procurement done in **Sourcing** (choice B), linked to the customer order by **order number** — MIRRORS local (local supplier POs live in Suppliers/Production; China factory POs live in Sourcing).
- **Factory PO record** = one procurement: factory, product, customer order number, qty, RMB cost, RMB payment proof. Viewable **under Factory → that Product** (product's PO history) AND surfaced on the customer order as "procurement status".
- Step 7: PROCEED → INDENT quote **converts to a customer order** in /admin/orders (pulls the sourcing product + AUD price + qty). Reuses quote→order convert.
- Steps 8 & 9 independent, EITHER order: customer invoice = from the order (Generate Tax Invoice, built); factory PO = from Sourcing, **gated on PROCEED**.
- Step 10: factory invoice record (number + amount + date + optional file) on the factory PO.

## Confirmed: Payment model — DAD LOAN (steps 11–12)

- The RMB paid to the factory is **Dad's money** — Dad pays the factory in China via WeChat; QuirkyPromo **borrows** it and repays Dad in **AUD** to his Australian account. So "打澳币 / pay AUD" = **repay Dad**, NOT the forwarder.
- **Leg 1 — Factory RMB payments** (Dad's WeChat → factory): each = WeChat screenshot proof + RMB amount + FX that day + date. May be **deposit + balance (multiple)**; when Σ = PO total → **"factory fully paid"**. This also = how much QP owes Dad.
- **Leg 2 — AUD repayments to Dad** (QP → Dad's AUD account): each = AUD amount + date (+ which order/PO). May be staged.
- **"Owed to Dad" running ledger:** owed = Σ(factory RMB paid × FX) − Σ(AUD repaid to Dad). Mark "settled" when zero.
- Finance: factory cost (RMB→AUD) → **COGS**; AUD-to-Dad → real cash outflow (company → Dad).

## Still to discuss
- Steps 13–14: dispatch + tracking. Plan: customer-facing final-delivery tracking reuses the customer order's per-product freight (built). Internal forwarder leg (China→AU: forwarder invoice, actual freight AUD, international tracking) lives in Sourcing. NEED: how goods physically flow (China → straight to customer? or China → Australia → customer?) and whether the forwarder/international leg needs its own tracking.
- Backend text: all grey → black (do while building, same as orders page).
- Then: freeze design → plan build order → start.

## BUILD PROGRESS

Decision: product library = the existing `factory_quotes` + `quote_tiers` pipeline (already wired to costing + 比价), NOT a 3rd table. Enhance it. `sourcing_products` (MTO/public catalog) left untouched — different purpose.

Step 1 (product library) — IN PROGRESS:
- ✅ SQL `db/sourcing_product_library.sql` (RUN in Supabase): factories.short_code; factory_quotes += sku, image_url, group_id, status, setup/tooling/sample_cost_rmb; new factory_sku_counters table; indexes.
- ✅ `app/api/admin/sourcing/factories/route.js` — POST saves short_code.
- ✅ `app/admin/sourcing/factories/page.js` — factory form has 短代码 field.
- ✅ `app/api/admin/sourcing/quotes/route.js` — POST auto-generates SKU = {factory short_code}-{seq} via factory_sku_counters; saves image_url/group_id/status/one-off costs.
- ✅ `app/admin/sourcing/factories/[id]/page.js` — "报价历史" → "产品列表"; product group header shows image + SKU (navy monospace) + status. QuoteForm gained 产品图片 URL + Tooling/Setup/Sample (RMB) fields (image upload = URL for now, file-upload later).
- ✅ `app/admin/sourcing/sourcing.css` — `--muted` #8a8577 → #000 (all grey backend text → black in ONE change, covers Step 6 for sourcing pages).
STEP 1 DONE (esbuild clean). SQL ran. PUSH: db/, factories route+page, quotes route, factories/[id] page, sourcing.css, SOURCING_DESIGN.md.
NOTE Step 6 (grey→black) is effectively done for sourcing via the CSS var change.
NEXT: Step 2 — costing pulls product + INDENT quote on main Enquiries&Quotes board.
