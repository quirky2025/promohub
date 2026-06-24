# Homepage V1 — 主文档

> 定位:**产品发现入口 + SEO 权重分发 + Kit 转化**。不是 banner 秀、不是品牌故事页。
> 原型:`homepage-v1-prototype.html`(静态,已定稿方向)。Kit 模块细节见 `PROMO_KITS.md`;链接目标见 `FILTER.md` / url_pages。
> 摘要一行汇到 `NOW.md`。

---

## 1. 版块顺序（已锁定 2026-06-18）

1. **Nav** — Bags · Drinkware · Pens · Apparel · **Build a Kit** + Get a quote
2. **Hero**(短版)
3. **Build a Promo Kit**(8 场景卡 → Kit Picker 预选,紧贴 Hero 下)
4. **信任条** — "Easy. Fast. Transparent. Custom."
5. **Shop by Category**(8 个真 canonical 类目页)
6. **Shop Popular Products**(8 个真 subcategory 页)
7. **Buying Help**(4 条短信任点)
8. **What our clients say**(真实评价,沿用现有首页内容)
9. **Trusted by leading Australian brands**(真实 logo,沿用现有)
10. **底部 SEO 长文**(精简版)
11. **Footer**

---

## 2. 锁定文案

**Hero**
- H1:`Promotional Products, Branded Merchandise & Corporate Gifts Australia`
- 副:`Create branded products, promo kits and corporate gifts with transparent pricing, flexible MOQ and Australia-wide delivery.`
- CTA:`Browse products` · `Build a promo kit` · `Request a quote`(+ 搜索框)

**信任条**
- `Easy. Fast. Transparent. Custom.`
- `Australian-stocked options, local decoration, clear product pricing and flexible order quantities for businesses of every size.`

**底部 SEO 文（首页精简版;完整长版留作 About/SEO 页）**
> Quirky Promo helps Australian businesses create promotional products, branded merchandise and corporate gifts that are practical, memorable and easy to order.
>
> Browse thousands of products including drink bottles, coffee cups, tote bags, apparel, notebooks, technology accessories, conference giveaways and staff welcome kits. Many products are available from Australian inventory with local decoration, flexible minimum order quantities and Australia-wide delivery.
>
> For larger or more unique projects, our Custom Made & Global Sourcing service supports bespoke merchandise, retail-quality packaging, OEM manufacturing and large-scale sourcing. From trade shows and conferences to employee onboarding, client gifts and marketing campaigns, we help organisations build stronger brand connections through products people genuinely use and keep.

**真实评价**(沿用现有):Ian Westmoreland OAM(CEO, Kintsugi Heroes)、Jenny(Founder)、Matt(Account Manager)、Adam(Retail Sales Manager, Hornsby Mazda)。
**真实品牌**:Kintsugi Heroes · Ultra Violette · Netflix · Mazda · Hyegrove · + many more.

---

## 3. SEO

- **Title**:`Promotional Products & Corporate Gifts Australia | QuirkyPromo`
- **Meta description**:`Browse custom promotional products in Australia by category, colour, MOQ, price and branding option. Compare bags, drinkware, pens, apparel and more.`
- **结构化数据**:WebSite · Organization · SearchAction。**不放 Product schema**。
- 一个 H1,各版块 H2。

**SEO 保护线**
- 首页只链 canonical category / subcategory / 已批准 url_pages。
- 不链一堆 filter query URL;filter URL 默认 noindex。
- **Kit 结果页(`/kit-picker?...`)noindex、不进 sitemap**;`/promo-kits/<slug>` 才可 index。
- Shop by Colour 暂不放(等批准颜色页);不为 SEO 堆关键词。

---

## 4. 链接目标（真 canonical,已对 url_pages）

类目:`/custom-bags-australia` · `/custom-drinkware-australia` · `/branded-pens-australia` · `/custom-branded-apparel-australia` · `/corporate-tech-gifts-australia` · `/outdoor-promotional-products-australia` · `/custom-headwear-australia` · `/branded-office-supplies-australia`
Popular:`/custom-tote-bags-australia` · `/custom-drink-bottles-australia` · `/custom-cooler-bags-australia` · `/branded-pens-australia` · `/branded-notebooks-australia` · `/custom-caps-australia` · `/custom-t-shirts-australia` · `/custom-umbrellas-australia`
> 上线前确认这些 url_pages 都 **已发布**(发布字段非 `is_live`;先 `select column_name from information_schema.columns where table_name='url_pages'` 找列名)。

---

## 5. 建设顺序

1. `/kit-picker` builder 页（noindex）：场景预选 + 自选换货 + 颜色主题 + **MOQ 实算** + 报价。原型 `kitting-page-prototype.html`。
2. 首页进 Next.js：本结构 + 锁定文案 + 真实评价/logo;Nav 加 Build a Kit。分支 → preview → 验 SEO 保护线 → merge。
3. `/promo-kits/<slug>` 场景页（index）：等 kit 数据 + Admin 就绪。

---

## 7. Worker 验收清单（总控 merge 前把关用）

> worker 做完一项,把 **preview 链接 / PR diff / 截图** 带回总控,照下面验。

**首页 PR(`feat/homepage-v1`)**
- [ ] Hero:H1 + 副标 + **两个按钮**(Browse products → `/promotional-products`、Build a promo kit → `/promo-kits`)+ **line-draw 视觉**显示;**已删 Request a Quote**。
- [ ] Kit 区 = **入口模块 + 4 张场景小卡**(不内嵌完整 builder)。
- [ ] Category(8 真 canonical)/ Popular(8)/ Buying help(含 "Local stock — stock confirmed before order")/ 真实评价 / 真实 logo / 底部 SEO 文 —— 都在。
- [ ] **server component**:Ctrl+U 看源码有 H1/产品名/评价 + `application/ld+json`(SSR + schema ✅)。
- [ ] Nav / Footer 来自 `layout.js`(页面没自带)。
- [ ] 移动端不崩;品牌色/字体对。
- [ ] 容忍:`/promotional-products`、`/promo-kits` 还没建 → 点了 404(预期内)。
- [ ] 部署前确认链接的 url_pages **已发布**(发布字段非 `is_live`)。

**后续每页(各自验收时补)**:`/promotional-products`(21 类目+子类,可 index)、`/promo-kits`(builder+8卡+颜色;`?scene=` noindex)、8 个场景页(轻内容+独特正文防薄)、库存 Now 4 条。

## 6. 状态 / 变更记录

| 日期 | 变更 | 状态 |
|---|---|---|
| 2026-06-18 | V1 结构/文案/原型定稿;锁定 Hero 短版 + 信任条 + 底部 SEO 文;真实评价/logo 接入 | ✅ 已定 |
| 2026-06-18 | V1 落地:`app/page.js`(server component + metadata + JSON-LD)+ `components/HomeKitPicker.jsx`;`feat/homepage-v1` | 🚀 部署/preview 中 |
| 2026-06-19 | `feat/homepage-v1` 干净分支就绪:**只含 `app/page.js`(684→184)+ `public/kit-hero.svg`**(从卡在 admin-backend 的本地草稿抽离,未带 Nav/layout 的 admin WIP);JSON-LD(Organization+WebSite+SearchAction)、单 H1、esbuild 解析已验。sandbox 无 push 权限 → patch + 步骤交 Lily 自推(`PUSH_homepage-v1.md`)。`HomeKitPicker.jsx` 不进本 PR(首页未引用,改由 `KitBuilder.jsx` 承接,在 `feat/promo-kits`) | 🚀 patch 交 Lily 自推/preview |
| 2026-06-19 | **首页改版上线**:Shop by Category(8 静态图卡,`public/categories/`)+ Shop by Brand(4 logo:Moleskine/Swiss Peak/Pierre Cardin/CamelBak,`public/brands/`)+ New Arrivals(4 真实产品按 slug 拉)+ How ordering works;标题居中、ISR revalidate;**Kit 整条暂停**(删 kit-hero 图、删 /promo-kits) | ✅ 已合并 main |
| 2026-06-19 | 首页 hero 加**产品拼图**(T-Shirts/Notebooks/Bags/Drinkware/Pens 各取一图,`getHeroProductImages`)+ 加高、保持米白;`/promotional-products` hero 改 **navy**(同其它类目页)、类目卡**按字母排序** | ⤴️ 被下一行取代 |
| 2026-06-19 | **最终版 `feat/homepage-v2`(`homepage-cleanup-all.patch`)**:① 首页 hero 改成**单张产品合成图** `public/hero-products.png`(navy 产品 + 金色 "YOUR BRAND" 贴标,AI 出图;取代上一行的 5 张小图);② **全站小字改纯黑 `#000`**(`MUTED` 常量,首页+类目页,米色底上更清楚);③ 类目页 navy hero(同 ARCHER 品牌页)+ 类目卡字母序;④ Get a Quote → 本地 `QuoteModal` 弹窗(新 `components/QuoteButton`),不再跳 /contact;⑤ **Kit 整套撤下**(删 `app/promo-kits`、`lib/kits.js`、`KitBuilder`、sitemap kit、`kit-hero.svg`)。旧 PR #28/#29 作废关闭 | 🚀 待 merge(`feat/homepage-v2`) |

### 📌 首页当前结构(2026-06-19 实际,已不含 Kit)
Nav → **Hero**(标题 + Browse products + **单张产品合成图** `hero-products.png`,米色底)→ 信任条 → **Shop by Category**(8 静态图卡 `public/categories/` + View all → `/promotional-products`)→ **Shop by Brand**(4 logo `public/brands/`:Moleskine/Swiss Peak/Pierre Cardin/CamelBak → `/brands/<slug>`,无 hub 故无 View all)→ **New Arrivals**(4 真实产品按 slug,`getNewArrivals` + View all → `/new-arrivals`)→ **How ordering works**(原 Buying help 改名)→ 真实评价 → 品牌 logo 墙 → 底部 SEO 文 → Footer。三块标题居中、小字纯黑、ISR `revalidate=600`。

### ⭐ Quote 按钮规则(铁律,别接错)
站里有**两个不同的 quote**:
- **Get a Quote(本地 stock)** = `components/QuoteModal`(弹窗,跟导航栏一致)。给促销品/本地货。**首页、类目页、产品页的 "Get a Quote" 一律用它**——用 `components/QuoteButton`(client,内部调 QuoteModal,`source` 传页面名),**不要**链到 `/contact`。
- **Get a Sourcing Quote** = `/supply-chain/quote` 页面。只给 Custom Made & Global Sourcing 用,别和本地 quote 混。

### ⚠️ Kit 状态(2026-06-19)
首页/类目页**已移除所有 Kit 内容与链接**,`/promo-kits` 路由整套撤下。**Kit 功能暂停 + 正在改名**(大概率改叫 **Merch Pack**),待 Lily 想好命名 + 模型 + 与 Collections 关系后重做。详见 `PROMO_KITS.md`。旧 Kit 代码留在 `promo-kits.patch`。

### 版本路线
- **V1（当前）**:发现 hub + Kit Picker 入口 + 真实评价/logo + SEO 文。整体替换旧首页。
- **V1.1**:Nav 加 "Build a Kit";`/kit-picker` builder 上线后接上;"Build my kit" 真链。
- **V2 候选**:精选/热卖产品条(需 best-seller 字段/规则)、Quote 用 QuoteModal 弹窗替代 /contact、Shop by Colour(等批准颜色页)、Shop by Occasion 行(等 `/promo-kits/<slug>` 上线)。
- **V3 候选**:个性化推荐、行业/收礼人轴(若验证有需求)、动态 featured by season。
- 完整长版品牌文案 → 放 **About / SEO 页**(不进首页)。
