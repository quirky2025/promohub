# QuirkyPromo — Work Log (session 2026-07-16)

> Living log so nothing is lost if the chat dies. Newest section = current state.
> "RUN" = execute .sql in Supabase. "PUSH" = git add/commit/push + merge to main (Vercel deploys). Code files are NOT run in Supabase.

---

> 📌 **2026-07-21,Lily:**"想到当年请人做网站花的冤枉钱和走过的坑,终于在十年后我凭借 Claude 的帮忙实现了自己的网站。"
> 十年磨一剑。这个网站的每一个产品判断、每一条质量标准、每一句亲手跑的 SQL,都是 Lily 的。

## SESSION 2026-07-21(晚)— P1 · CMS 正文框失效热修 + D12 热销榜就绪

- **P1 已修(Lily 验收):** Content 编辑器 Buying Guide 正文 + FAQ 答案的富文本框(contenteditable)输入/粘贴全失效 → 换普通 textarea(`app/admin/content/[slug]/page.js`);纯文本保存时自动转 HTML(空行=分段 `<p>`,单换行=`<br/>`,含标签内容原样保留,`plainToHtml`/`normalisePayload`);B/Link/List 工具栏暂下线。Blog 编辑器仍用 AdminRichText,未报症状未动——若同病同治。
- **D12 · Popular 热销榜(代码就绪,等数据):** `db/popular_products.sql`(消耗=快照相邻日下降之和,忽略补货)+ `/api/admin/popular?days=` + 后台 Catalog→Popular 页(7/14/30 天切换,前三金色,View↗)。RUN SQL 后随快照积累生效,第二天起有数字。
- **PDP 库存表折叠:** 默认显库存前 3 色 + "Show all N colours ▼" 展开(Lily 指示)。

## SESSION 2026-07-21(下半场)— D11 · Trends 实时库存上线 ✅

- **已上线:** PDP 颜色区下方金边 Stock Availability 表(每颜色在库数量+下批到货+更新时间,全黑字;Indent 产品不显示)。数据:`product_stock`(当前)+ `product_stock_history`(每日快照,养热销榜)。
- **同步:** `/api/cron/trends-stock` — Trends Data API(`au.api.trends.nz/api/v1/stock/{sku}.json`,Bearer `TRENDS_API_TOKEN`);每日 UTC18:00 cron + 手动触发(`?key=TRENDS_PROBE_KEY`);时间预算循环+最旧优先+并发3+429退避重试+只删成功产品旧行(宁旧不丢);首轮全量 2101 产品/**2121 with rows**。
- **踩坑记录:** Vercel env 值误存 Note 栏/Shared 不挂项目/Sensitive 存后不可见;某次 merge Vercel 漏建 Production 构建(空 commit 重推解决);`after()` 自续跑在 Vercel 上不可靠(弃用);delete-then-insert 在限流下丢数据(已改);product_stock RLS 默认开启挡了前台匿名读(disable)。
- **探测工具(临时,可删):** `/api/cron/trends-probe`、`/api/cron/promobrands-probe`、`/api/admin/trends-probe`;OpenAPI 全谱存 `outputs/document.json`。
- **PromoBrands:** Cognito 认证代码就绪;去年的 Refresh Token `invalid_grant` 失效,已发邮件等新凭据(D11-5)。
- **其他:** 前台搜索框加清除 ×(Nav.jsx 三处);AGENTS.md 灰字禁令加强(辅助小字/时间戳也必须黑/navy)。
- **待办:** 热销榜报表(等 2-3 周快照);新品/下线自动对账(API 有 last_updated/active 字段,基建已备);AS Colour 库存;Merch Pack;Apparel 标题。

## SESSION 2026-07-21 — display_title 全类目批量完成(18 类目)+ 58 新品数据抓取 + 改类修正

- **标题批量(今日主任务,完成):** 18 个类目 ~4700+ 产品 display_title 全部手写交付(Pens 424 之前已交)。本场新增:Key Rings 144 / Marketing Materials 27 / Office & Desk 405 / Outdoor & Sports 305 / Packaging 85 / Personal Care 142 / Pet 39 / Technology 426 / Tools & Auto 104 / Toys & Games 279 / Travel 40;此前已交 Bags/Barware/Drinkware/Flags/Giveaways/Headwear/Home。**Apparel 按 Lily 指示挂起。**
- **交付位置:** `outputs/titles/` — 每类目 `*_FINAL(_QUALIFIED).csv`(sku,name,display_title,note)+ `*_IMPORT.sql`(update+meta_title 清空,begin/commit)。锁定规则:无逗号/≤68 字符/数字规格前置/限定词 md5(sku) 加权轮换(Custom30 Promo25 Customised15 LogoPrinted15 Imprinted10 Advertising5)/QLP 功能词/澳拼。
- **RUN(Lily,按序):** ① 各类目 `*_IMPORT.sql`(未跑的)② `TOOLS_RECATEGORISE_FIX.sql` + `TOYS_OFFICE_RECATEGORISE_FIX.sql` ③ 58 新品数据 UPDATE(chat 分段贴)④ `THINDATA_TITLES_PATCH.sql`(31 个升级标题,**最后跑**)。
- **58 新品数据抓取:** Trends 官网(trends.com.au,web_fetch 免登录)抓 specs/features/packing/materials/dimensions → UPDATE SQL 贴 chat。57 成功;129724 官网无页 → **下线**(SQL 已给)。133810 Kadi Large 经经销商镜像补齐。
- **下线(本场累计):** 129191/129192(Office 特价重复)、H337(Personal Care 口罩)、PS5115/PS5023/PS5092(无容量 U 盘)、129724。
- **改类(SQL 已给,含标题):** 128390 SPICE 笔礼盒→Pens/Pen Gift Sets;LL0030/LL3076→Toys & Games;LL3035/LL3033/LL3036→Home & Living(Candles & Diffusers);LL6370/LL8239→Home & Living/Kitchen & Dining;LL1002/LL6376→Home & Living;LN38/LN40→Key Rings;K235/K247/LL678/LN709→Giveaways/Novelty Giveaways。121121/121124/K228 分类先不动(Lily)。
- **数据修正:** K490 颜色 Custom→Clear;112193 电池 AA→AAA;PSSUN03 颜色确认 White。
- **挂起:** Merch Pack 集合(32 个,`MERCH_PACKS_LIST.csv`,标题收尾后一起弄)、Apparel 标题、供应商库存前端展示(讨论中)、搜索框加清除 X(待做)。

## SESSION 2026-07-20 — PRODUCT_TITLE_ENRICHMENT (display_title, Pens pilot) + pens material hardening

- **Answer to ops:** yes — front-end display splits cleanly from internal `name`. New `display_title` column feeds PDP H1, title template, Product JSON-LD (+colour variants), breadcrumb tail (visual + BreadcrumbList LD). `name` untouched for search/cart/invoices/supplier matching. All reads fall back to `name` → zero change until data lands.
- **RUN:** `alter table public.products add column if not exists display_title text;`
- **CODE — PUSH:** `app/products/[slug]/page.js` (metadata), `ProductClient.jsx` (H1+breadcrumb), `ASColourClient.jsx` (breadcrumb), `ProductJsonLd.jsx` (product/variant/breadcrumb names); `app/api/admin/product-titles/route.js` (NEW — preview CSV generator per spec formula: base minus type noun + Material(barrel) + Mechanism + Type singular, dedupe, ≤55, drop Mechanism→Material, no padding; Presentation/Gift Sets kept as-is).
- **Flow:** Lily downloads `/api/admin/product-titles?category=Pens` → reviews CSV → returns final → I emit UPDATE SQL. Slugs frozen (untouched).
- Also this session: pens material = barrel-primary via `penPrimaryMaterial` (component collocations "steel ball/metal clip/silicone grip" stripped before scan), PP folded into Plastic; collection rules share the same derivation.
- **PDP polish (Lily):** edit modal no longer closes on backdrop click (SEO editing session safety); ALL-CAPS colour names title-cased at display (`formatColourName` in lib/colourName.js — mixed-case untouched, data/slugs untouched); Materials & Dimensions unified into the LEFT gold blocks (specs-jsonb products fall back from Material/Size spec rows, duplicates dropped from the right table).
- Title enrichment CSV verdict: formula output too poor (Lily) — 424 pens titles to be hand-written by dev from full product data at NP115 standard ("Customised Six Coloured Pencil Sets in Tube with Sharpener" style); richer CSV export pending.

## SESSION 2026-07-19 (later 5) — TAXONOMY_V2 Pens (material subcats → rule collections)

- **CODE — PUSH:**
  - `app/api/admin/collections/route.js` — slug takeover: 409 `slug_taken` unless `allow_takeover`; publish then flips the EXISTING url_pages row to smart_collection supply (URL/title/meta/copy untouched). DELETE now soft-drafts the url_pages row (never hard-deletes SEO copy).
  - `app/admin/collections/[id]/page.js` — takeover confirm dialog on save.
  - `app/[slug]/page.js` + `lib/urlPages.js` + `lib/smartCollections.js` — smart_collection pages now render the SAME filter sidebar as subcategory pages (layout parity for converted URLs); category pages get "Shop by material" chips (published ctype='attribute' collections whose rules.category includes the page category) + secondary boxed nav block at top of the filter sidebar (visually separated from the Material FILTER).
  - `lib/filterConfig.js` — Pens Material facet excludes Silicone (stylus TIP component, §2.6; facet-layer only, data untouched).
  - `app/admin/products/page.js` — per-row "View ↗" link to the live PDP (Lily request).
- **Browse by Subcategory auto-cleanup:** taken-over pages become page_type='collection' → excluded from the subcategory card grid (existing filter in getChildPageCards). Nav dropdown links unchanged (still valid LPs).
- **DATA (Lily/data line):** §2.5 — 11 products with subcategory 'Metal Pens'/'Eco Pens' (non-pen-type values) to be re-typed; orphan check after. SQL given in chat.
- **PENDING Lily:** §5 Eco Pens — convert to collection same batch, or keep as-is for now.

## SESSION 2026-07-19 (later 4) — D10 · CMS Phase 2 Blog

- **RUN:** `db/blog_posts.sql`.
- **NEW/CHANGED CODE — PUSH:**
  - `lib/cmsHtml.js` — shared sanitize/compile/addHeadingIds; `app/api/admin/content/page/route.js` refactored to use it.
  - `components/AdminRichText.jsx` — rich text extracted from the page editor (content editor `[slug]/page.js` refactored to import it).
  - `app/api/admin/blog/route.js` — CRUD + publish/unpublish (slug locked after publish; alt text required for cover; content_html compiled at publish).
  - `app/admin/blog/page.js` + `app/admin/blog/[id]/page.js` — list + editor (cover, meta, target keyword internal, TOC toggle, blocks, related products/pages searchable multi-select). Catalog → Blog tab in `app/admin/layout.js`.
  - `app/blog/page.js` (index) + `app/blog/[slug]/page.js` (detail: breadcrumb, auto-TOC from H2 ids, body via SeoContent styles, Article JSON-LD, end CTA Get a Quote + related product grid + related page chips). ISR 300.
  - `app/sitemap.js` — /blog + published posts included.

## SESSION 2026-07-19 (later 3) — D9 · PDP "Also found in" (PDP_ALSO_FOUND_IN_SPEC.md)

- `lib/alsoFoundIn.js` — links per product: published smart collections (from materialised collection_products — no rule runs per request) > colour collection pages > its subcategory page > eco page (compound is_eco, fallback /sustainability) > brand page. Live + non-noindex only, cap 8, dedup.
- `app/products/[slug]/page.js` — computes list server-side, passes to both clients.
- `ProductClient.jsx` — chips row between specs/tabs and Similar Products. `ASColourClient.jsx` — chips row at page bottom.
- NOTE: colour/subcategory page "≥4 products" gate not re-checked per request (perf); those pages are seeded with stock, and smart collections enforce ≥4 at publish.

## SESSION 2026-07-19 (later 2) — D8 · Collections Manager built (COLLECTIONS_MANAGER_SPEC.md)

- **RUN:** `db/smart_collections.sql` — smart_collections (rules/pinned/excluded/status) + collection_products materialised map (FK cascade). Map feeds D9 Also Found In.
- **NEW CODE — PUSH:**
  - `lib/smartCollections.js` — rule engine (AND across fields, OR within; price/print-method post-filters; membership = hits + pinned − excluded). No import from urlPages (one-directional).
  - `app/api/admin/collections/route.js` (CRUD; slug validated vs reserved + url_pages clashes), `…/options/route.js` (distinct field values from products), `…/preview/route.js` (count + first 24, thin<4 warning), `…/publish/route.js` (publish = materialise + upsert url_pages live w/ product_filter {type:'smart_collection'}; unpublish = url_pages draft + clear map; refresh action for after product imports).
  - `app/admin/collections/page.js` + `app/admin/collections/[id]/page.js` — list + rule-builder editor (live preview, pin ordering, exclude blacklist, slug locked after publish).
  - `lib/urlPages.js` — getProductsForUrlPage handles type 'smart_collection' (LIVE rule resolution → new imports auto-appear; pinned first).
  - `app/admin/layout.js` — Catalog gets Collections tab.
- NOTE: product-data-change incremental refresh of the materialised map = manual "Refresh members" button for now (or republish). Collection pages themselves are always live-resolved.

## SESSION 2026-07-19 (later) — D7 · CMS Phase 1 built (CMS_CONTENT_EDITOR_SPEC.md)

- **RUN:** `db/cms_url_page_revisions.sql` — url_page_revisions table (draft/published history, unique draft per slug, keep last 10 published versions).
- **NEW CODE — PUSH:**
  - `app/api/admin/content/route.js` — page list (search) + has_draft flag.
  - `app/api/admin/content/page/route.js` — GET page/draft/revisions; POST save_draft / publish / rollback / discard_draft. Publish compiles structured guide blocks → `url_pages.seo_content` HTML (front end unchanged), updates title/meta/seo_intro/faq + `updated_at` (= sitemap lastmod). Server-side HTML sanitiser.
  - `app/api/admin/content/upload/route.js` — content images → R2 `content/<slug>/`, browser-compressed webp.
  - `app/admin/content/page.js` — Catalog → Content list.
  - `app/admin/content/[slug]/page.js` — editor: hero (REUSES page_banners record — same as Banners page, per Lily's "unify" decision), title/meta with 60/165 counters, intro textarea, repeatable guide blocks (H2/H3 + limited rich text: bold/link/lists only + optional image with REQUIRED alt), FAQ blocks (auto FAQPage schema via existing front end), paste-cleaning, Preview tab (renders real SeoContent component), Publish + version rollback. Existing seo_content imported as one "EXISTING CONTENT" raw block.
  - `app/admin/layout.js` — Catalog gets Content tab.
- Editor known scope (Phase 1): url slug read-only; colour/font locked; image library browsing deferred; Blog = Phase 2.

## SESSION 2026-07-19 — ops queue A/B/C (FAQ copy, pens $30 fix, subcat deep copy, Brevo)

- **A2/A3 DONE (code):** `app/faq/faqData.js` — #12 shipping answer swapped to 2026-07-17 wording (verbatim); payment answer + EFT sentence appended (verbatim, Lily approved). Pens 6-FAQ schema verified live (same source `url_pages.faq` renders text + FAQPage JSON-LD).
- **A1 (SQL, given to Lily):** replace `$30 flat shipping Australia-wide.` in `url_pages.seo_content` for `branded-pens-australia` with approved $25 sentence.
- **B4 (SQL, given to Lily):** eco-pens-australia + custom-metal-pens-australia title/meta/seo_intro/seo_content/faq from `PENS_SUBCATS_DEEP_COPY.md` (verbatim; internal Chinese note dropped; Corporate Gifts scenario page link skipped — page not live yet; /sustainability link skipped — no natural anchor in approved copy, flagged to ops).
- **C5 DONE (code):** subscribe SOURCE → `footer`; `lib/brevo.js` resolves Brevo list by name 'Newsletter' (env BREVO_LIST_ID still overrides); success msg → "You're in — welcome email on its way."
- **C6 BLOCKED:** `POPUP_LEAD_CAPTURE_SPEC.md` does NOT exist in outputs/dev_requests → reported back to ops line.
- D specs present: CMS_CONTENT_EDITOR_SPEC.md, COLLECTIONS_MANAGER_SPEC.md. Not started.

## SESSION 2026-07-18 — admin counts + category truth + banner keys (per HANDOVER-CATEGORIES.md §4)

**DECISION (Lily):** Option A — admin follows the live site. Category dropdowns read from live `url_pages`; legacy values (Business/Print/Personal/Promotion/Leisure…) shown in a separate "Legacy" group. Data cleanup (Option B) deferred.

**CODE CHANGED — needs PUSH:**
- `app/api/admin/products/route.js` — exact `count:'exact', head:true` tab counts (search/category filters applied to counts too); server-side `.range()` pagination (no more `.limit(3000)` truncation); "not published" now includes NULLs.
- `app/api/admin/categories/route.js` (NEW) — categories/subcategories from live `url_pages.product_filter`; legacy list from paged scan of `products.category`.
- `app/admin/products/page.js` — tabs use API counts; server pagination; category/subcategory dropdowns follow live site (+ legacy group/option); save/load failures now `alert()`.
- `app/admin/banners/page.js` — 分类 tab keys now from `url_pages` (status='live'), `page_key = url_pages.slug`, "看页面" opens the real SEO URL `/{slug}`; parents listed with children indented.
- `lib/pageBanners.js` (NEW) — shared server-side banner fetch.
- `app/[slug]/page.js` — SEO category pages' hero now shows `page_banners` (page_type='category', page_key=slug). NOTE: ISR revalidate=300 → banner changes appear within ~5 min.
- `app/category/[category]/page.js` — banner key unified to `url_pages.slug` (no duplicate records between old/new routes).
- `app/brands/[slug]/page.js` + `app/collections/[slug]/page.js` — heroes now display `page_banners` (previously save-only).

**SQL:** `db/page_banners.sql` must be RUN if not already (if-not-exists, safe to re-run). Old `db/category_banners.sql` remains obsolete — do NOT run.

All 9 files passed esbuild syntax check.

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

## PLANNED — Per-product online artwork approval for OLD/offline orders (DECISION LOCKED 2026-07-16)
Lily: everything artwork must be SPLIT BY PRODUCT — separate proof, separate approval per product (5-product order = 5 proofs/5 approvals). "分开才不会看花眼、乱套." Matches existing schema.
Existing online line (already built): Artwork Management board (/admin/artworks) → upload mockup / Generate Proof → "Send to Customer" (send-mockup route emails approve link → /artwork/{token}) → customer approves → approve route auto: cert + (EFT) Tax Invoice + payment info + production-start email. artworks table is ALREADY per-product: columns order_number, customer_name, customer_email, product_name, status(awaiting_logo|logo_received|mockup_sent|changes_requested|approved), token(hex), payment_method (see api/artwork/request-logo).
GAP: offline/SQL orders (Ian) have NO artworks rows → don't appear on the board → can't send approval. TO BUILD (on Lily's go, push together):
  1. New admin route + "Send for artwork approval" button on Orders modal → for EACH order item, insert an artworks row (order_number, customer name/email, product_name=item name, payment_method=order.payment_method, status 'logo_received' if we hold the file else 'awaiting_logo', fresh token). → items then show on Artwork board as separate cards.
  2. CONNECT-WIRE: when customer approves online, approve route currently updates artworks table only (+ EFT sets order.payment_status='invoiced') — it does NOT set the order's per-item artwork_approved. Need to link artworks row → order item and, on approve, set items[idx].artwork_approved=true (roll up to order.artwork_status='approved' when all done) so the NEW production gate auto-unlocks. Cleanest: add artworks.order_item_index (int) column (SMALL SQL) set at creation; approve route flips that item. (Matching by product_name is fragile — use index.)
  3. Board already renders one card per artwork row, so per-product "分开" is automatic.
Needs Lily present to run the small SQL + test the full loop. Hold build until she says go.

## LOG (append newest at bottom)
- 2026-07-16 (later 9): CREDIT NOTE reworked to match Lily's pricing model (line = UNBRANDED unit + PRINT unit/ea + SETUP charge; a print-method change only moves the print+setup layers). So the credit note is now driven by ADJUSTMENT LINES you enter directly (not a blended unit price). ⚠️ RUN SQL `db/orders_adjustments.sql` (orders.adjustments jsonb) + `db/orders_amount_paid.sql` (item-edit uses it). NEW route `app/api/admin/orders/adjustments/route.js` (save [{desc,amount}], amount ex-GST signed − credit/+ charge). credit-note-pdf REWORKED → sums order.adjustments, lists each as a PDF line, net<0 → 'CREDIT NOTE', net>0 → 'ADJUSTMENT - BALANCE DUE' (ex+GST). UI: Payment section has "Credit note / adjustment" editor (desc + ± amount rows, add/remove, Save adjustments) → shows Net ex GST + GST + Credit/Balance inc GST + Generate button. item-edit (Edit final spec/price per product) kept for updating the branding LABEL to final (Digital Print / 3 colour) — money handled by adjustments, original paid order untouched. IAN's case: enter "Pen: pad print → digital print" = −196, "Notebook: 2→3 colour" = +84 → net −112 ex GST → Credit $123.20 inc GST → Generate Credit Note. (cnReason state now unused — harmless.) adjustments route esbuild-clean; credit-note-pdf/page.js bash unverifiable (FUSE mount stale/null-byte) — logic verified via Read.
  (later 9b): CREDIT NOTE → BANK now wired. `db/orders_adjustments.sql` ALSO adds orders.adjustment_settled_at. NEW route `app/api/admin/orders/credit-settle/route.js` POST → posts bank_transactions (credit/net<0 → direction 'out' category 'credit_note'; balance/net>0 → 'in' category 'sales'; amount = |net×1.1|, linked_type 'order_adjustment', linked_id order id) + sets orders.adjustment_settled_at; DELETE ?id= undoes (removes txn + clears flag). UI: credit-note block shows "💸 Mark refunded (bank −)" / "💰 Mark balance received (bank +)" when saved adjustments exist + not settled; after → "✓ Refunded — bank updated <time>" + Undo. Full loop: enter adjustments → Save → Generate Credit Note PDF → Mark refunded → Finance bank decreases. credit-settle esbuild-clean.
  NEXT: tomorrow = JENNY / Parcelle (China / DG WC CLO) order in Sourcing. Still TODO (minor): per-product artwork send-for-approval on order block.

- 2026-07-16 (later 10): (a) credit-note-pdf WinAnsi-safe (winSafe strips → × — smart-quotes; fixed "WinAnsi cannot encode →" crash). (b) DELIVERED notification: notify-shipment route takes type 'shipped'|'delivered' → different email (delivered = "has been delivered + 7-day note", no track button) + stamps delivered_notified_at. UI: each parcel now "📧 Notify shipped" + "📦 Notify delivered" with ✓ shipped / ✓ delivered timestamps; item-freight preserves delivered_notified_at. PUSH: app/admin/orders/page.js + app/api/admin/orders/{notify-shipment,credit-note-pdf,item-freight}. All esbuild-clean.

- 2026-07-16 (later 11): artworks PK was PRIMARY KEY(order_number) → only 1 card/order → per-product "Send for artwork approval" crashed "duplicate key artworks_pkey". FIX: RUN `db/artworks_pk_to_id.sql` (surrogate id PK, order_number now non-unique + indexed; non-destructive). Lily ran it. THEN: website orders now AUTO-create per-product artwork cards → `lib/artworkCards.js` gained opts {onlyBranded (skip no-print items), status} + legacy-guard (skip if order already has a null-index card); `app/api/order/route.js` calls createArtworkCards(supabase, orderRow, {onlyBranded:true, status:'awaiting_logo'}) after insert. So 3 entry points create per-product cards: website order (auto, branded only), backend New Order (auto), existing order (manual Send-for-approval). PUSH: lib/artworkCards.js + app/api/order/route.js (+ everything from later 8-10). Both esbuild-clean.
  REMINDER for Lily: banner still $1680.87 because (a) net-banner code not pushed yet + (b) must click "Mark refunded". Ian's order is DONE (approved offline + dispatched) — no need to send proofs for it.

- 2026-07-16 (later 12): ⭐ ROOT CAUSE of "changes don't persist" (artwork approval / per-item status / freight parcels reverting on reload/deploy). `app/api/admin/orders/route.js` `legacyItems()` REBUILT each item keeping only a subset of fields → STRIPPED item.artwork_approved, item.parcels, item.status, item.branding, item.freight_* on every GET. Data WAS saved in orders.items jsonb; the list API dropped it on read. FIX: `legacyItems` now spreads `...item` first (keeps all original fields), then adds normalized aliases. Uploaded artwork survived because it's in order_documents (separate table). Refund persistence is separate: order-level cols (adjustments/adjustment_settled_at/amount_paid) are preserved by `...order` spread in normalizeOrder — they only "didn't save" because orders_adjustments.sql not yet run + credit-settle not yet deployed. PUSH: app/api/admin/orders/route.js. esbuild-clean.

- 2026-07-17 (Step dates timeline) — Lily: 每个 process 都要有日期(下单/印刷批准/生产/发货/送达)。
  - ⚠️ **RUN SQL** `db/orders_step_dates.sql` (orders += `artwork_sent_at`, `delivered_at`; 其余已存在).
  - ORDER PROGRESS 下的 Timeline 重建成逐步列表:下单/发印刷稿/印刷稿批准/进入生产/已发货/已送达,每步显示日期或灰色"待定 —"。无印刷单自动跳过两个印刷步骤。updateStatus 现在也给 artwork_sent_at 和 delivered_at 盖时间戳(点进度按钮时)。File: `app/admin/orders/page.js`.
  - **PUSH**: `db/orders_step_dates.sql`, `app/admin/orders/page.js`.
  - FIX (Lily, Ian 多产品): 生产/发货/送达每个产品时间不同 → 从**订单级时间线拿掉**这三步(订单级只留 下单/印刷稿),改成**每个产品下面**显示 进入生产/已发货/已送达 的日期。item-status route 现在给 `item.stage_dates[stage]=now` 盖时间戳(存 items jsonb,无需 SQL)。点每个产品的阶段按钮就记该产品的日期。Files: `app/api/admin/orders/item-status/route.js`, `app/admin/orders/page.js`.

- 2026-07-17 DONE — 计价 ③ **手填国际运费**:③ 加了「手填 Manual · 货代一口价」输入框(不走引擎,填 ¥就自动选中 → ⑤到岸 ⑦客户价出数)。¥185 = DHL HK 国际运费,放这里。File: `app/admin/sourcing/costing/page.js`。**PUSH** 它。¥185 是国际段(不是 ② 中国端)—— Parcelle 用手填 185 即可。

- 2026-07-18 运费统一核对(P0/P1)+ 设计边界记录:
  - **唯一漏网** `lib/cart.js` 之前硬写 `SHIPPING = 30`(+ 重复 MARGIN/GST/SETUP_FEE),已改成 `import { SHIPPING, GST } from './pricing'`(=**$25/产品/地址**),calcGrand 每产品 $25。**PUSH** `lib/cart.js`。
  - 其余全链路早已一致(核对过):app/cart(SHIPPING×产品数)· place-order · 订单 PDF/发票(用订单存的 shipping)· FAQ#12 & 运费问答 · PDP 价格区 & USP 图标条($25/item)· /sales-terms($25 per item, per domestic address)。/refund-return 不写具体金额。全库 grep 30/flat shipping 已无(除 PDF 排版 y-=30 无关)。
  - **⚠️ 设计边界(记下来别忘)**:运费模型 = **$25 × 产品数 × 收货地址数**。但**公开购物车/结账目前是"单收货地址"**(= 产品数 × $25,一个地址)。"× 多地址"只在**后台订单级**用每产品多包裹(parcels)实现。若将来要让**公开结账也支持一单多地址 × $25**,是一个独立的新功能(购物车要能拆地址),不在本次统一范围内。pricing.js SHIPPING 是唯一来源。

- 2026-07-17 DONE — 架构②③(PO/发票统一):
  - **①改**:不做单独「全部 PO」页(Lily 要在原表)。改成:Production 表**内联显示 China 工厂 PO**(标 INDENT,¥金额),和本地 PO 同表。factory_pos 按 order_number 归到对应订单行。INDENT 行的 Supplier Invoice 列也能 +发票号/📎传文件(写 factory_pos，action=setInvoice)。Files: production/page.js, factory-po route(setInvoice)。(单独 /admin/pos 页留着但没入口。)
  - **②每产品 Supplier PO**（本地）:⚠️ RUN SQL `db/purchase_orders_item_index.sql`(purchase_orders += order_item_index)。新组件 `components/ProductSupplierPO.jsx` 挂在订单每个产品下(order_type!=='indent'),接**同一张 purchase_orders**:建单(带 order_item_index)+ ✉发 + 发票号/📎文件 + 标已付 + 删 + PDF。**这里下的单自动进 Production + 全部PO,发票/付款两处同步**(一处数据两处看)。purchase-orders POST 存 order_item_index。Files: `db/purchase_orders_item_index.sql`, `app/api/admin/purchase-orders/route.js`, `components/ProductSupplierPO.jsx`, `app/admin/orders/page.js`.
  - 统一原则:PO 一张表 purchase_orders(本地) / factory_pos(China)；发票/付款以 PO 为家,订单页每产品 + Production 都是同一记录的窗口,不复制不同步。
  - **PUSH**: 上述所有 + WORKLOG。

- 2026-07-17 DONE — 统一 PO 总列表(架构①,旧,已并入②③):新页 `/admin/pos`「全部 PO」(Production 导航加入口)。合并 purchase_orders(LOCAL/AUD)+ factory_pos(INDENT/RMB),打 LOCAL/INDENT 标签,筛选+搜索,点订单号跳订单(deep-link)。读两表不迁移。无 SQL。Files: `app/admin/pos/page.js`, `app/admin/production/page.js`(nav)。**PUSH**。
  架构 TODO:② 本地订单每产品加 Supplier PO 块(接 purchase_orders)③ 订单文档区理顺(PO/供应商发票/客户发票/artwork/产品图)。

- 2026-07-17 FIX(持久化根因)+ 双日期:
  - **月结/无需印刷/status 一刷新就回退** 根因:前端 `supabase.from('orders').update()` 被 RLS 悄悄挡掉(或列没跑 SQL)。改成走 **/api/admin/orders/update 服务端(service key)**,失败弹红字(不再默默失败)。update route 允许字段加:artwork_required, status, required_date + 之前的。toggleArtworkRequired/toggleOnAccount/updateStatus 全改走服务端 persistOrderField。⚠️ 仍需跑 `orders_artwork_required.sql`+`orders_pay_on_account.sql`+`orders_step_dates.sql` 否则列不存在会弹错。
  - **双关键日期(醒目,本地+China 都有)**:订单顶部一排两大卡:🎯 **客户要求日期 REQUIRED(红框死线)** + 🗓 **预计发货/交货 EST. DISPATCH**(变色)。预计晚于要求 → 红色「⚠ 会迟」警告。⚠️ RUN SQL `db/orders_required_date.sql` + `db/orders_estimated_dispatch.sql`。Files: 两个 sql, update route, orders page。**PUSH**.

- 2026-07-17 DONE — 订单预计发货/交货日期(旧,已并入上面双日期):⚠️ RUN SQL `db/orders_estimated_dispatch.sql`(orders += estimated_dispatch_date date)。订单顶部(客户信息下)一条 🗓 预计发货/交货,填工厂交期,改即存。变色:>3天绿、≤3天琥珀、逾期(未发货)红。update route 加 estimated_dispatch_date。Files: `db/orders_estimated_dispatch.sql`, `app/api/admin/orders/update/route.js`, `app/admin/orders/page.js`. **PUSH**. TODO 剩:Dashboard「⚠️交货提醒」高亮列表(列快到期/逾期单)+ 供应商付款字段。

- 2026-07-17 DONE — 货代管理:Sourcing 新 tab「货代管理」。⚠️ RUN SQL `db/forwarders.sql`(新表 forwarders + 银行字段;并 seed 了 Zhejiang Bing Supply Chain / Bank of China Yiwu / SWIFT BKCHCNBJ92H / AUD 354577334824 / 运费,幂等)。CRUD:名称/短代码/联系人/微信/电话/Email + 银行(Bank/支行/SWIFT/账号/币种/地址/条款/备注)。Files: `db/forwarders.sql`, `app/api/admin/sourcing/forwarders/route.js`, `app/admin/sourcing/forwarders/page.js`, `app/admin/sourcing/layout.js`(+tab)。**PUSH** 全部。NOTE:以后付货代运费,把 forwarder_payments 关联到 forwarders(现在 Finance 货代付款是 free-text name)—— 待办。

- 2026-07-17 DONE — 产品页报价记录:每个产品下加「报价记录」表(折叠)。⚠️ RUN SQL `db/product_cost_records.sql`(新表 product_cost_records,挂 factory_quote_id+sku)。列:日期·数量·工厂成本¥·国内¥·国际运费¥·**Carrier**(DHL HK/大陆/Air/Sea/Express/其他)·总成本到岸 A$·我的报价 A$/个·毛利%。报价 = 毛利%自动算 或 勾「报价手动填」直接输(反算毛利)。表单实时预览。全 CRUD。Files: `db/product_cost_records.sql`, `app/api/admin/sourcing/product-records/route.js`, `components/ProductCostRecords.jsx`, `app/admin/sourcing/factories/[id]/page.js`(import+每产品下挂 <ProductCostRecords quoteId sku>). **PUSH** 全部。NOTE: 计价页的「保存」暂未自动写这个记录表 —— 目前在产品页手动加/算,后续可把计价页保存也 drop 一条进来。

- 2026-07-17 DESIGN（旧,已实现上面）— 计价/报价记录放在**产品页面**:
  - Lily:每个产品会算很多次,记录挂到产品页最清楚。每算一次(保存计价)存一行,产品详情页开一个「报价记录」表。
  - 列:日期 · 数量 · **工厂成本 EXW** · **国内部分**(内陆+单证+杂费)· **国际运费**(含手填 185,标 DHL HK/Air/Sea/手填)· **总成本(到岸)** · **我的报价(客户单价)** · 毛利%。一行 = 一次报价快照,工厂→国内→国际→总成本→报价 一条线。
  - **报价两种方式**:① MARGIN 自动算,② **手动直接填客户价**(手填优先,系统反算实际毛利%)。历史一口价(如 2.30)直接填。
  - 实现:保存计价时把这些字段(含 manualIntlRmb + 手填/算出的报价)写进记录,并 attach 到 factory product(factory_quotes.id / SKU);产品页(factories/[id])读该产品的记录列出来。数据可复用 sourcing_cost_sheets(加 sourcing_product_id 关联)或新表。⚠️ 待 Lily 说开工。

- 2026-07-17 TODO（Lily 说全部都做）— 货代管理 + 供应商付款信息 + 交货日期提醒:
  - **货代管理(forwarder 主数据 + 银行/付款信息)** —— 像工厂那样能录入/编辑货代。Lily 给的第一家货代:
    - 名称 Zhejiang Bing Supply Chain Management Co., Ltd(微信联系)
    - 银行 Bank of China, Yiwu Branch · 地址 No.500, Chouzhou North Road, Yiwu City, Zhejiang, PR China
    - SWIFT BKCHCNBJ92H · **AUD 账号 354577334824** · 备注 运费
    - 用途:国际运费(DHL HK 等)。以后**付货代运费**要能记账(Finance 已有「货代付款」tab + forwarder API)。
  - **供应商(suppliers)加付款信息字段** —— 供应商那块要能填付款信息(银行/账号/付款方式/条款等),像客户/货代一样。
  - **预计交货日期 + Dashboard 提醒**(设计已确认):订单顶部 estimated_delivery_date(琥珀/红),Dashboard「⚠️交货提醒」高亮列表。
  - 顺序建议:货代主数据(带银行)→ 供应商付款字段 → 交货日期+提醒。下一批做。

- 2026-07-17 PLANNED（Lily 说先测流程,别改）— 预计交货日期 + 提醒:
  - 确认设计:订单**顶部**加「预计交货日期 estimated_delivery_date」(可改),到期变琥珀、逾期变红。提醒 = **Dashboard 首页「⚠️ 交货提醒」高亮列表**(快到期/逾期的单红色置顶,不发邮件那版)。每日邮件提醒暂不做。
  - 待建:SQL orders += estimated_delivery_date date;订单顶部日期输入+变色;Dashboard 加提醒块(查 orders where estimated_delivery_date 临近/已过 且未 delivered)。等 Lily 测完流程再开工。

- 2026-07-17 (Invoices 列表页) — Lily 问有没有"所有发票"页 → 没有,建了。放 **Finance → 发票 Invoices** 标签。
  - 一张表:Inv# · Order# · 客户 · 日期 · 金额 · 状态(已收/未收/月结) · **📄 Tax Invoice** 按钮(开 /api/admin/orders/invoice-pdf?id=)。顶部三卡:已开票总额 / 已收 / 未收。搜索框 + "只看未收"勾选(方便追款)。数据来自 GET /api/admin/orders。无 SQL,无新路由(复用现有)。
  - File: `app/admin/finance/page.js`(加 invoices tab + Invoices 组件)。**PUSH**: `app/admin/finance/page.js`。任务 #36 核心完成(mark-paid 暂没做,Lily 只要 PDF)。

- 2026-07-17 (理顺订单顶部) — 可改日期 + 月结灵活 + 无需印刷:
  - **可改历史日期**: 订单级时间线每步(下单/印刷稿/批准)后面加 datetime-local 输入框,直接改;每个产品的 进入生产/发货/送达 也各有可改日期框。存:order-level→ /api/admin/orders/update(现允许 created_at/artwork_sent_at/artwork_approved_at/production_started_at/dispatched_at/delivered_at);per-product→ item-status route 加 `dateOnly` 模式(只改 stage_dates 不动 status)。无 SQL(日期列已有 + stage_dates 在 items jsonb)。
  - **月结灵活(每单自己控)**: ⚠️ RUN SQL `db/orders_pay_on_account.sql`(orders += pay_on_account bool)。生产闸门旁加按钮 **月结·先做后付**(每张单独立开关,不是全局政策 —— Lily 要 flexibility)。开了 → 闸门的"Payment received"算满足,不用真收款也能进生产。prodBlockReason + gate summary 都认 `pay_on_account`。
  - **无需印刷**: 闸门右上「无需印刷 No artwork」按钮点一下 → 印刷两步 + 印刷闸消失(此单 Jenny 无印刷,点它即可)。这功能之前就有,提醒用。
  - **PUSH**: `db/orders_pay_on_account.sql`, `app/api/admin/orders/update/route.js`, `app/api/admin/orders/item-status/route.js`, `app/admin/orders/page.js`.

- 2026-07-17 SOURCING Step 5 — 国际快递 carriers + tracking:
  - 每产品运费的 Carrier 下拉里加了国际选项:**DHL (Hong Kong)**、**DHL (China Mainland)**、**Air Freight**、**Sea Freight**(本地 AusPost/StarTrack/FedEx/DHL/TNT/Direct Freight/Courier 保留)。INDENT 工厂直发客户就选 DHL (Hong Kong) 之类。
  - Notify shipped 邮件的 Track 链接:DHL HK / DHL Mainland → DHL 官方跟踪页(和 DHL 一样)。Air/Sea 没有标准跟踪页,邮件只显示 carrier + 单号,无 Track 按钮。
  - Files: `app/admin/orders/page.js` (CARRIERS), `app/api/admin/orders/notify-shipment/route.js` (TRACK_URL)。无 SQL。
  - **PUSH**: `app/admin/orders/page.js`, `app/api/admin/orders/notify-shipment/route.js`. 这就是 China 5 步的最后一步 —— 全流程打通。

- 2026-07-17 (Factory PO form = 下单给工厂 + Artworks text black):
  - 新建工厂 PO 表单改成"给工厂下单"用:顶部 **搜产品/SKU**(查产品库 factory_quotes,/api/admin/sourcing/quotes?product=)→ 选中自动带出 产品名/SKU/工厂/**规格 SPEC**(尺寸·材质·工艺)/¥单价(首档 tier)。加 **规格 SPEC** 文本框(尺寸/颜色/3M adhesive backing 等)。**去掉** 汇率 + 本单成本 A$(成本写订单 Notes)。发票字段保留但标"可选,后补"。PO 卡片显示规格,不再显示 A$ 成本。⚠️ **RUN SQL** `db/factory_pos_spec.sql`(factory_pos += product_spec)。PO PDF 现在带 SKU · 规格。发工厂 = ✉ 发工厂(需工厂 Email)。Files: `db/factory_pos_spec.sql`, `app/api/admin/orders/factory-po/route.js`, `components/FactoryProcurement.jsx`.
  - **Artworks 页文字全黑**: `app/admin/artworks/page.js` 所有灰(#7A7570/#9CA3AF/#C8C4BC)+ 金(color: GOLD)文字 → #000。状态色(绿/琥珀 pill)保留。
  - **PUSH**: `db/factory_pos_spec.sql`, `app/api/admin/orders/factory-po/route.js`, `components/FactoryProcurement.jsx`, `app/admin/artworks/page.js`.

- 2026-07-17 (Delivery address on every order) — Lily: 每单顶部一定要有 DELIVERY ADDRESS,默认来自客户账户,可改、可加多个(Ian 2 个地址)。
  - ⚠️ **RUN SQL** `db/orders_delivery_addresses.sql` (orders += `delivery_addresses` jsonb — array of address strings; first mirrors into delivery_address for the invoice).
  - Orders detail 顶部(客户信息下面、Payment banner 上面)新增 **🚚 Delivery Address** 块:多地址列表,每个可编辑;**＋ Add address** 加更多;每个可 ×删;**📇 用账户地址** 从客户账户拉默认地址(fetch /api/admin/quote-builder?customer=);**Save address** 存。openDetail 时若订单没地址,自动从账户拉一个默认显示。第一个地址镜像到 delivery_address → 显示在发票上(发票已有账户回退)。多地址也进 knownAddresses,per-product 运费的 Deliver-to 选择器能选到。
  - Files: `app/admin/orders/page.js` (deliveryList state + fillFromAccount + saveDeliveryList + 顶部 UI 块 + knownAddresses), `app/api/admin/orders/update/route.js` (allow delivery_addresses).
  - **PUSH**: `db/orders_delivery_addresses.sql`, `app/admin/orders/page.js`, `app/api/admin/orders/update/route.js`.

- 2026-07-17 (SIMPLIFY Step 4) — Lily: 欠爸爸账本太复杂,看不到。砍掉。
  - Lily's model: per order = ¥付了多少 · 汇率 → =A$成本(打给爸爸)。就这样,不要全局账本/还爸爸记录/采购总览页。
  - **工厂 PO 面板砍简单** (`components/FactoryProcurement.jsx` rewritten): 只留 (a) 工厂 PO 建/编辑/删 + **📄 PO PDF** + **✉ 发工厂**; (b) **工厂发票** (号/额/日期/文件); (c) **支付凭证** 上传(微信截图,存 order_documents docType payment_proof, 缩略图+删除); (d) **本单成本**: 工厂总额 ¥ ÷ 汇率 = **A$ 成本**(绿字,PO 卡片直接显示 + 表单里实时算)。**删掉**: 欠爸爸结余卡、RMB 多笔付款腿的复杂 UI、还爸爸记录、Stat 组件。
  - **删掉 Sourcing「采购/欠爸爸」页**: 移除 layout.js 的 tab; `app/admin/sourcing/procurement/page.js` 改成 redirect 到 /admin/sourcing/orders。
  - API `app/api/admin/orders/factory-po/route.js` 不变(savePO 存 total_rmb+fx_rate; savePayment/saveRepayment/summary actions 现在没人调,留着无害)。表 `factory_po_payments`/`dad_repayments` 现在不用了(留在库里无害)。
  - **PUSH**: `components/FactoryProcurement.jsx`, `app/admin/sourcing/layout.js`, `app/admin/sourcing/procurement/page.js`. (SQL `db/sourcing_factory_po.sql` 若还没跑要跑 —— factory_pos 表要有;你既然看到过面板应该跑过了。)

- 2026-07-17 (Invoice polish) — INDENT Tax Invoice fixes + product size/spec line:
  - **Deliver-To** now falls back to the customer's **company account address** when the order has none (INDENT orders convert from a quote with no address). `app/api/admin/orders/invoice-pdf/route.js` resolves via company_id → name match → company_addresses (default delivery) → billing (uses lib/companyAddress). So Parcelle's address shows instead of "TO BE CONFIRMED".
  - Removed from the invoice/OC PDF (`lib/orderDocPdf.js`): the "**Stock is subject to availability…**" line and the whole "**Good to know / Production only begins… / lead time**" block.
  - **Product size / spec line** (e.g. "Size: 8.5cm · 3M adhesive backing", English): new editable `spec` field. Enter it on the order via **✎ Edit final spec / price** → new top input "Size / spec". Stored on items[i].spec (item-edit route), shown under the product name on the order AND on the invoice line. Files: `lib/orderDocPdf.js` (renders it.spec first detail line), `app/api/admin/orders/invoice-pdf/route.js` (maps spec), `app/api/admin/orders/item-edit/route.js` (accepts+stores spec), `app/admin/orders/page.js` (input + display).
  - **AUTO spec from factory product**: enter size/material/craft ONCE on the factory product (Sourcing → 工厂 → product: 产品尺寸 / 材质 / 工艺). (1) quote→order convert now snapshots `Size: {product_size} · {material} · {craft}` into item.spec (`app/api/admin/quotes/convert/route.js`, reads factory_quotes by sourcing_product_id). (2) invoice-pdf has a LIVE fallback: for INDENT lines with no manual spec, it reads the factory product's size/material/craft at generate-time (`app/api/admin/orders/invoice-pdf/route.js`) — so editing the product in Sourcing auto-updates the invoice, even for Jenny's existing order (no need to touch the order). Manual "Edit final spec" still overrides. Needs `db/sourcing_product_details.sql` run (factory_quotes.product_size/material/craft) — likely already run in Step 1.
  - **PUSH**: `lib/orderDocPdf.js`, `app/api/admin/orders/invoice-pdf/route.js`, `app/api/admin/orders/item-edit/route.js`, `app/admin/orders/page.js`, `app/api/admin/quotes/convert/route.js`. (No new SQL.)

- 2026-07-17 (Step 4 follow-ups) — Factory PO PDF/email + Delete orders&quotes + No-artwork orders:
  - **A. Factory PO PDF + 发工厂邮件** — the 工厂采购 panel PO card now has **📄 PO PDF** (opens `/api/admin/orders/factory-po?pdf=1&poId=…`, reuses `lib/factoryPoDocPdf.generateFactoryPoPDF`) and **✉ 发工厂** (prompts for/uses factory Email, emails the PO PDF via Resend; needs factory Email in 工厂管理; auto-sets PO status draft→sent). New POST action `sendPO` + GET `pdf` branch in `app/api/admin/orders/factory-po/route.js`.
  - **B. Delete Orders & Quotes** — Orders board detail: **🗑 Delete order** (top-right, next to ← Back) → `DELETE /api/admin/orders?id=` (hard delete + best-effort cleanup of artworks/order_documents/order_shipments/factory_pos by order number; does NOT auto-reverse bank — settle payment/refund first). Enquiries&Quotes detail: **🗑 删除** (next to ×) → `DELETE /api/admin/deals?kind=&id=`. Both confirm-gated. Use these to delete the **duplicate Jenny order** and old quotes (**FlagDisplays, AdoreEco**).
  - **C. No-artwork orders** — ⚠️ **RUN SQL** `db/orders_artwork_required.sql` (orders += `artwork_required` bool default true). Production gate now: if `artwork_required=false` → artwork requirement skipped, gate = **payment only**; gate panel shows green “无需印刷 No artwork needed” + a toggle **无需印刷 / ↩改回需要印刷**; the artwork progress steps (Artwork Sent/Approved), the “Send for artwork approval” button, and the per-product artwork upload/approve row are all hidden. INDENT convert auto-sets `artwork_required=false` when every item has no branding (so future no-print China orders start correct). Jenny's existing order: just click **无需印刷** on it.
  - **PUSH**: `db/orders_artwork_required.sql`, `app/api/admin/orders/route.js`, `app/api/admin/deals/route.js`, `app/api/admin/quotes/convert/route.js`, `app/api/admin/orders/factory-po/route.js`, `components/FactoryProcurement.jsx`, `app/admin/orders/page.js`, `app/admin/leads/page.js`. (FUSE mount served a truncated FactoryProcurement.jsx to bash/esbuild — real Windows file is 305 lines, verified complete via Read; Vercel builds the real file.)

- 2026-07-17 SOURCING Step 4 — Factory PO + RMB payments (Dad's WeChat) + 欠爸爸 ledger:
  - Confirmed with Lily: put it **两边都要** (on the order AND a Sourcing summary), payments = **定金+尾款 multi-leg**. FX convention = **¥ per A$1** (e.g. 4.5), AUD = RMB ÷ fx.
  - ⚠️ **RUN SQL**: `db/sourcing_factory_po.sql` — creates 3 tables: `factory_pos` (SPO number, order_number link, factory, qty, RMB total, factory invoice #/amt/date/file, status), `factory_po_payments` (multi-leg deposit/balance: amount_rmb + fx + amount_aud + paid_date + proof_url + kind), `dad_repayments` (AUD repaid to Dad + date/method/proof, optional order/PO link).
  - **On the order** (`/admin/orders`, only when `order_type='indent'`): new **🏭 工厂采购** panel via `components/FactoryProcurement.jsx`. Shows a **欠爸爸 ledger** (已付工厂¥ · 折澳币=欠爸爸 · 已还爸爸 · **还欠爸爸**), factory PO cards (create/edit/delete, factory dropdown, auto total = 单价×数量+额外, factory-invoice fields + file upload), RMB payment legs (加一笔付款: 定金/尾款, ¥ + 当天汇率 → auto 折澳币, WeChat 截图上传, edit/delete; PO status auto → deposit_paid/paid), and Dad AUD repayments (加一笔还爸爸, edit/delete). Owed = Σ(¥÷fx) − Σ(还爸爸 AUD). All full CRUD.
  - **Sourcing side**: new tab **采购 / 欠爸爸** → `/admin/sourcing/procurement` — lists ALL factory POs (PO#, 客户订单 link, 工厂, 产品, 工厂总额/已付/还差, 状态) + global 欠爸爸 totals. Read-only overview; edits happen on the order.
  - API `app/api/admin/orders/factory-po/route.js` (GET by orderNumber → bundle{pos,payments,repayments,ledger}; GET ?all=1 → global summary; POST action = savePO/deletePO/savePayment/deletePayment/saveRepayment/deleteRepayment). SPO number = `SPO{FY}{seq from 1001}`. Proof uploads reuse `/api/admin/orders/documents` (R2, docType payment_proof/factory_invoice).
  - **PUSH**: `db/sourcing_factory_po.sql`, `app/api/admin/orders/factory-po/route.js`, `components/FactoryProcurement.jsx`, `app/admin/orders/page.js` (import + INDENT panel), `app/admin/sourcing/layout.js` (+采购 tab), `app/admin/sourcing/procurement/page.js`.
  - NOT wired yet (do when Lily hits it): generate Factory PO **PDF** / email factory from this new panel (existing send-po is tied to the old cost-sheet sourcing_orders, not factory_pos). Core money-tracking is complete.

- 2026-07-17 SOURCING Step 2+3 — INDENT quote → PROCEED gate → order (China flow):
  - Step 2 (product library → INDENT quote): factory 产品列表 with SKU/tiers; IndentQuoteModal on factory detail page creates a customer quote tagged `quote_type='indent'` via POST `/api/admin/quotes` (Q-number auto). It lands on the main Enquiries & Quotes board (`/admin/leads`) like any local quote, but shows an **INDENT** badge.
  - Step 3 (gate + convert): on `/admin/leads`, an INDENT quote does NOT show the plain green "Convert" button. Instead: (1) a gold **✓ 标记 PROCEED（客户同意）** button → sets quote status to **Won** (= customer agreed). (2) only AFTER PROCEED does the navy **→ 转成订单 (INDENT · 不发邮件)** button appear. Converting an INDENT quote is SILENT — `app/api/admin/quotes/convert/route.js` now skips BOTH the customer Order-Confirmation email AND the auto artwork-card/upload-logo email when `quote_type==='indent'` (Lily controls factory artwork + invoicing herself). Server also gates: refuses INDENT convert unless status is won/accepted ("请先标记 PROCEED"). Converted order gets `order_type='indent'` + `sourcing_quote_ref` = the Q-number, and each item carries `sourcing_product_id` + `indent:true` to link back to the factory product.
  - ⚠️ **RUN SQL** (2 files, add-if-not-exists, safe): `db/sourcing_indent_quote.sql` (quotes += quote_type/sourcing_product_id/unit_price — from Step 2, run if not already) + `db/orders_indent_type.sql` (orders += order_type/sourcing_quote_ref).
  - **PUSH**: `app/admin/leads/page.js` (INDENT badge + PROCEED button + gated convert + indent-aware confirm/alert), `app/api/admin/quotes/convert/route.js` (skip emails/artwork for indent + PROCEED gate + order_type tags), `app/api/admin/quotes/route.js` (POST create indent quote + PATCH action='edit' — from Step 2).
  - NOTE: the raw local green "Convert to Order" (which emails the customer) is intentionally hidden for INDENT — Lily was nervous about accidentally emailing Jenny. NOT YET DONE: Step 4 (factory PO + RMB WeChat payment + Dad ledger), Step 5 (international carriers). Main-board EDIT UI for an existing INDENT quote deferred (server PATCH action='edit' already exists).

- 2026-07-16 (later 13): (a) orders board: list TOTAL now shows NET after a settled refund (strikethrough original + net) via netTotal(o) = total + settled-adjustment×1.1. Needs page.js pushed. (b) credit-settle hardened: save settled flag FIRST (clear error "run orders_adjustments.sql" if col missing) + delete prior 'order_adjustment' bank txns before posting one (fixes duplicate refunds from repeated clicks). (c) STYLE: all grey text (#7A7570,#B0AAA3,#9CA3AF,#5A5550) + gold text (color: GOLD) → #000 black in app/admin/orders/page.js (DOC_STANDARDS: text always black, never grey). Gold kept for backgrounds/borders/buttons only. (d) Removed order-level "🚚 Delivery" + "📮 Shipments" sections (wrapped in {false && (<>…</>)} — freight is now per-product). page.js 1300 lines, esbuild CLEAN. PUSH: app/admin/orders/page.js (+ credit-settle from later12b).

## PLANNED — Customer product REVIEW request (Lily asked 2026-07-16 night)
Send the customer a link to leave a REVIEW on the product page — ideally after Delivered. Needs: product-page review display + submit (check if a reviews table/UI exists first), a "request a review" branded email with a per-product/per-order link, ideally triggered off the delivered notification. Do AFTER China/Sourcing unless Lily prioritises.

## TOMORROW — CHINA / SOURCING full flow (Jenny/Parcelle) — SPEC from Lily 2026-07-16 night
Sequence: (1) create FACTORY → (2) create PRODUCT → (3) FACTORY cost quote (RMB) → (4) FORWARDER freight = ESTIMATED → (5) QUOTE TO JENNY (often NO PDF, just email, BUT must keep a RECORD + status) → (6) Jenny says PROCEED (approval gate — no factory PO until proceed) → (7) Jenny places order → (8) Jenny INVOICE → (9) FACTORY PO → (10) factory INVOICE → (11) I pay factory RMB via WeChat + upload PAYMENT PROOF → (12) after full payment, pay AUD → (13) await dispatch → (14) TRACKING → closed.
KEY RULES:
- ARTWORK is OPTIONAL per product — this Parcelle item has NO print → no artwork; but MOST products DO. Artwork step toggles by product has-print / no-print.
- Quote to Jenny can be email-only (no PDF) but the system MUST store a quote record + status.
- PROCEED gate: cannot raise the factory PO until Jenny approves/says proceed.
- Steps 8 (Jenny invoice) & 9 (factory PO) order is FLEXIBLE — often 9 BEFORE 8; Jenny invoice not urgent. Do NOT force invoice-before-PO.
- Payment has two legs: factory RMB (WeChat screenshot proof) + AUD — must reconcile.
Existing to build on: Sourcing module (sourcing_orders, factories, cost sheets/costing, freight engine RMB, factory PO RMB PDF, quotes, Finance). Task = run Jenny's real order through + fill gaps (email-only quote record, PROCEED gate, optional artwork, RMB WeChat proof upload, tracking).

- 2026-07-16 (later 8): Carrier dropdown + Deliver-to picker + CREDIT NOTE / order adjustment. ⚠️ RUN SQL `db/orders_amount_paid.sql` (orders.amount_paid). (a) Freight carrier = <select> (CARRIERS list: AusPost/StarTrack/FedEx/DHL/TNT/Direct Freight Express/Courier). (b) Deliver-to = datalist "deliverToOpts" — pick from addresses already known on the order (delivery_address + delivery_address_json + order_shipments addresses + existing parcels) OR type new. (c) CREDIT NOTE / ADJUSTMENT (двунаправл — order reflects FINAL spec; customer prepaid): per product "✎ Edit final spec / price" inline (branding + qty + unit) → NEW route item-edit recomputes order subtotal/gst/total AND on first edit of a paid order captures amount_paid = pre-edit total. Payment section shows "Order adjustment": Paid vs Revised total → Credit due (overpaid) OR Balance owing (underpaid) + reason field + NEW route credit-note-pdf?id=&reason= → generates 'CREDIT NOTE' (credit, delta<0) or 'ADJUSTMENT - BALANCE DUE' (owing) PDF via generateOrderDocPDF (delta split ex+GST). Handles Lily's real case: Pen pad→digital, Notebook 2→3 colour. PUSH: app/admin/orders/page.js + app/api/admin/orders/{item-edit,credit-note-pdf}/route.js (+ notify-shipment, item-freight from later7). Both new routes esbuild-clean; page.js verified via Read (bash mount stale). NOTE not yet wired: adjustment → bank (credit out / balance in) on settlement — do later.
  Also (later 8b): each parcel now has RECIPIENT (datalist recipientOpts) + notify EMAIL (datalist emailOpts) pickers — pick from known recipients/emails on the order (customer + order_shipments recipient_name/email + existing parcels) OR type new. item-freight route persists recipient/notifyEmail/notified_at on the parcel; notify-shipment greets pc.recipient. NOT DONE: actually revising Ian's Pen (pad→digital) + Notebook (2→3 col) data — need final unit prices from Lily (tool built, data not changed).

- 2026-07-16 (later 7): Per-product customer notifications + sub-numbering. (a) Each product now shows sub-number OC#-1 / -2 / -3 (order number + item index+1). (b) Each freight parcel has a "Notify" email field (DEFAULT = order customer email, EDITABLE) + "📧 Notify customer" button → NEW route `app/api/admin/orders/notify-shipment/route.js` sends a branded (quirkyEmail) shipping notice with carrier + tracking + a Track-your-parcel link (auspost/fedex/dhl/startrack/tnt); stamps parcels[p].notified_at + notifyEmail; shows "✓ sent <time>". Selectable per parcel (click the ones you want). Must Save freight before Notify (guarded). PUSH: app/admin/orders/page.js + app/api/admin/orders/notify-shipment/route.js (+ item-freight from later6).
  STILL TODO (next, Lily asked): per-product ARTWORK "Send for approval" ON the order block — upload proof + send to customer (default-editable email) → customer approves online → auto reflect Sent/Changes/Approved on the product (reuse send-mockup + approve; needs a combined route). Unified quirkyEmail template for both. ⚠️ STILL PENDING SQL: db/order_documents_item_index.sql + db/artworks_order_item_index.sql (flag every time — Lily merges code but forgets SQL).

- 2026-07-16 (later 6): (a) Per-product freight now supports MULTIPLE parcels (a product can ship to >1 address, e.g. Name Tag → NSW + VIC). items[i].parcels = [{carrier,tracking,deliverTo}]; item-freight route rewritten to save the array; UI has "＋ Add address" + per-parcel remove + Save freight. (b) Orders board: REMOVED the top status-filter button row (Lily). (c) List STATUS column simplified to just "In Process" / "Completed" (+ Cancelled for cancelled) via simpleStatus(). PUSH: app/admin/orders/page.js + app/api/admin/orders/item-freight/route.js.
  ⚠️ TWO one-line SQLs STILL PENDING (fix current live errors, no push needed): `db/order_documents_item_index.sql` (per-product doc upload "could not find order_item_index column of order_documents") + `db/artworks_order_item_index.sql` (Send-for-approval / New Order "could not find order_item_index column of artworks"). Lily keeps merging code but not running SQL — flag prominently.

- 2026-07-16 (later 5): ROOT CAUSE of "Upload failed" = `order_documents` table didn't exist in DB (never ran the schema). Fixed by running `db/order_documents_schema.sql` (doc_type FREE TEXT, no constraint). Then "Could not update artwork" = orders missing lifecycle cols → ran `db/orders_artwork_columns.sql` (artwork_status/artwork_approved_at/production_started_at/dispatched_at add-if-not-exists). Flow now fully works end-to-end. Improved error surfacing in uploadItemArtwork + applyItemArtwork (show server error, not generic).
  THEN: FULL-WIDTH per-product order layout. ⚠️ RUN SQL `db/order_documents_item_index.sql` (adds order_documents.order_item_index — REQUIRED or per-product doc upload hard-fails on missing column). Files (PUSH): `app/admin/orders/page.js` (list hidden when order open + "← Back"; Payment-received banner on top with Generate Tax Invoice; each product block now also has per-product FREIGHT [carrier/tracking/deliver-to → items jsonb via item-freight route] + per-product DOCUMENTS [invoice/product_photo/supplier_payment_proof upload, tagged order_item_index, listed per block]; maxWidth 1080 centered), NEW `app/api/admin/orders/item-freight/route.js`, `app/api/admin/orders/documents/route.js` (accepts orderItemIndex + new doc types invoice/product_photo/supplier_payment_proof). Freight stored on items[i].freight_carrier/freight_tracking/freight_deliver_to. Bash/esbuild couldn't verify (FUSE mount stale at 748 lines vs real 1043) — verified structure via Read tool at all edit points, balanced. Mockup approved by Lily first.
  NEXT (task #93): Credit Note on the Invoice side.

- 2026-07-16 (later 4): Backend order entry for OLD/OFFLINE customers + per-product artwork bridge + approve→gate wire. ⚠️ RUN SQL: `db/artworks_order_item_index.sql` (adds artworks.order_item_index — needed for the approve→gate wire). Files (PUSH): NEW `lib/artworkCards.js` (createArtworkCards: one artwork card per order item, order_item_index, status 'logo_received', no email), NEW `app/api/admin/orders/create-artworks/route.js` (POST orderId → cards for existing order — for Ian), NEW `app/api/admin/orders/create/route.js` (New Order: allocate OC, insert confirmed order, per-product artwork cards, no email), EDIT `app/api/artwork/approve/route.js` (after approve, if order_item_index set → flip that order item's artwork_approved + roll up artwork_status/approved_at → unlocks per-product production gate), EDIT `app/admin/orders/page.js` (+New Order button + NewOrderModal [customer + product rows with SKU catalog search → auto sell price base×tierMargin, editable; auto totals $25/item + 10% GST]; + "🎨 Send for artwork approval" button on order modal → create-artworks; import tierMargin/SHIPPING/GST). esbuild OK on all new routes+lib; orders page verified via Read tool (FUSE mount still stale in bash — Windows file is 946 lines, clean).
  ARCHITECTURE (Lily): TWO paths converge at ORDER→ARTWORK(per product)→payment→production→dispatch. (A) fully ONLINE: website order. (B) OFFLINE/old: generally starts from a QUOTE → send → convert quote→order → artwork. New Order (direct) = shortcut for repeat/known offline orders (skip the quote). NOTE: the offline quote-first path EXISTS (quotes/convert) but is SINGLE-PRODUCT + creates 1 artwork; to fully match the per-product world it needs to become MULTI-PRODUCT quote + multi-product convert (creates a card per product). That's the next offline piece.

- 2026-07-16 (later 3): Artwork approval made PER-PRODUCT (Lily: each product its own artwork, upload belongs under each item not one panel on top). NEW route `app/api/admin/orders/item-artwork/route.js` (POST {orderId,index,approved,fileUrl,fileName} → sets items[i].artwork_approved + optional artwork_url/file; rolls order.artwork_status→'approved' ONLY when ALL items approved, else 'mockup_sent'/null; sets/clears artwork_approved_at). Orders page: each item row now shows ✓ Artwork approved / ⏳ pending + "⬆ Upload approved artwork" (saved to order_documents doc_type approved_artwork, title "Approved artwork — <product>") + "✓ Mark approved" (offline) + View file/Reopen. Top gate panel changed to READ-ONLY summary "Artwork approved (n/N) · Payment received · Ready/Locked". Gate unchanged: In Production locked until all items approved AND payment_status paid. NO SQL (per-item flags live in items jsonb). Architecture confirmed by Lily: CUSTOMER = one Order + one whole Invoice; SUPPLIER = one PO per product (same-supplier combine still optional). ⚠️ FUSE mount went stale/truncated → bash/esbuild read a cut-off copy and threw phantom syntax errors; verified the REAL file via Read tool (Windows-authoritative = git = Vercel), structure sound. PUSH: app/admin/orders/page.js, app/api/admin/orders/item-artwork/route.js (NEW), app/api/admin/orders/invoice-pdf/route.js (NEW), app/api/admin/orders/documents/route.js.

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
