# Promo Kits（场景 Kit）— 主文档

> 这条线的主文档:**场景 = 入口,Kit Picker = 动作,产品库 = 底层。**
> 定位:**批量品牌 merch kit**(活动/员工/客户,印 logo,走量、MOQ 驱动)——不是 Parcelle 那种小量个人/奢华礼盒。
> 摘要一行汇到 `NOW.md`。

---

## 1. 三层架构（一套 kit 数据,两个出口）

1. **Kit 数据层** — 一套 kit = {scene/theme, 产品槽位(必选/可选), 目标预算}。复用 `url_pages` 的 `kit_themes` + `offer_types`(prebuilt_kit / custom_kit_template)。
2. **出口 A — 场景落地页（SEO,可 index）**:`/promo-kits/<slug>`,**人工策划**:有正文、稳定推荐组合、canonical。展示该场景预制 kit + "Customise / build your own"。
3. **出口 B — Kit Picker / Builder（noindex 工具）**:`/kit-picker`。用户选 Quantity / Budget / Timing / Must-have,右边实时出推荐组合 + 报价;可逐件换、按颜色配主题、MOQ 实算、加礼盒。
   - 首页"Shop kits by occasion"场景卡 + 每个场景页的"Customise"按钮 → 都深链到 Builder,**该场景模板已预选**。

放弃:**By Recipient（For Her/Him）轴不做**——那是小量个人送礼逻辑,不是我们的批量盘子。Industry 轴多被场景吸收,V1 不单列。

---

## 2. V1 八个场景（已锁定 2026-06-18）

> 必选 = kit 默认带;可选 = 用户在 Picker 里加。产品已对到真实子类目 canonical 页。

| # | 场景 | slug | 必选 | 可选 | 预算/人 |
|---|---|---|---|---|---|
| 1 | **New Starter Kit** | `new-starter` | Drink bottle · Notebook · Pen · Tote bag | Cap · Hoodie · Tech item | $15–35 |
| 2 | **Trade Show & Event Giveaway Kit** | `trade-show-giveaway` | Pen · Tote/Drawstring bag · Lanyard | Sticker · Keyring · Bottle | $3–10 |
| 3 | **Conference Kit** | `conference` | Tote/Drawstring bag · Notebook · Pen · Lanyard | Bottle · Power bank | $12–30 |
| 4 | **Client Thank You Kit** | `client-thank-you` | Drinkware · Notebook · Pen | Gift box · Keyring · Umbrella | $20–45 |
| 5 | **Real Estate Handover Kit** | `real-estate-handover` | Drinkware · Keyring · Gift box/card | Cooler/Picnic item · Candle/home item | $20–50 |
| 6 | **Outdoor Team Day Kit** | `outdoor-team-day` | Cooler bag · Bottle · Cap | Towel · Sunglasses · Picnic item | $15–40 |
| 7 | **EOFY & Christmas Gift Kit** | `eofy-christmas` | Drinkware · (Notebook or Gift box) | Pen · Apparel · Umbrella · Tech item | $20–60 |
| 8 | **School & Club Kit** | `school-club` | Drawstring bag · Bottle · Cap | Pen · Sticker · Stress ball | $10–25 |

差异化备注:**Trade Show**(原 Event Giveaway,改名为 SEO 意图更准)= 低单价、大量派发;**Conference** = 代表包、更完整、预算更高。两者分开。
V1.5 再加:**Wellness / Care Pack**(需要明确产品池:towel · bottle · stress item · hand sanitiser · wellness pouch)——先不扩。

---

## 3. 模板产品 → 真实子类目页 映射

| 产品槽 | canonical 页 |
|---|---|
| Drink bottle | `/custom-drink-bottles-australia` |
| Drinkware(通用) | `/custom-drinkware-australia` |
| Notebook | `/branded-notebooks-australia` |
| Pen | `/branded-pens-australia` |
| Tote bag | `/custom-tote-bags-australia` |
| Drawstring bag | `/custom-drawstring-bags-australia` |
| Cooler bag | `/custom-cooler-bags-australia` |
| Lanyard | `/custom-lanyards-australia` |
| Sticker | `/custom-stickers-australia` |
| Keyring | `/custom-keyrings-australia` |
| Cap | `/custom-caps-australia` |
| Hoodie / Apparel | `/custom-hoodies-australia` · `/custom-branded-apparel-australia` |
| Power bank / Tech | `/custom-power-banks-australia` · `/custom-usb-drives-australia` |
| Gift box | `/custom-gift-boxes-australia` |
| Umbrella | `/custom-umbrellas-australia` |
| Towel | `/custom-towels-australia` |
| Sunglasses | `/custom-sunglasses-australia` |
| Picnic item | `/picnic-and-bbq-australia` |
| Candle / home | `/candles-and-diffusers-australia` |
| Stress ball | `/custom-stress-balls-australia` |

---

## 4. SEO 规则（铁律）

**可 index（人工策划页）**:`/promo-kits`、`/promo-kits/new-starter`、`/promo-kits/trade-show-giveaway`、…(每个有正文 + 稳定推荐 + canonical)。
**不 index**:`/kit-picker?scene=new-starter&budget=20&qty=100` 这类动态结果页 → **noindex,不进 sitemap**。

每个 kit 页 + Builder 报价处**必须**写清价格口径:
> Prices are product estimates only · Ex GST · Branding, setup and freight quoted separately · Final pricing confirmed after artwork and stock check.

不堆关键词;场景页只链 canonical category/subcategory/已批准 url_pages。

---

## 4b. Kit Builder — 6 步流程 + 颜色规则（颜色 = kit 第一要素）

### 6 步流程
1. Choose a scene（场景,预填模板）
2. **Choose your kit colour**（用 colour family,不是 raw colour_slugs）
3. Choose quantity
4. Choose budget
5. Choose must-have products
6. Choose timing

### 主题调色板（V1 先开 9 个）
`Black · White · Navy · Charcoal · Natural · Blue · Green · Red · Mixed`
- **Navy 独立于 Blue、Charcoal 独立于 Grey**（套装视觉气质不同、更企业感）;按 `colour_slugs` 具体词匹配,不用大家族。
- 暂不放(V1 不堆满,以后再加):Yellow / Orange / Pink / Purple / Teal / Clear / Gold / Silver / Brown。

### 颜色解析顺序（规则写死）
用户选 Black / Navy / Charcoal 等主题色 →
1. 每个槽位**优先找同 product type 且含该 colour family 的产品**（靠 1 万+ 库,换产品保颜色）。
2. 同类有多个 → 按 **local stock → price bucket → MOQ → popularity** 排序取一。
3. 该 product type **完全没有该主题色** → 才用**近似色**（见 fallback map）+ 标注。
4. 连近似色都没有 → **保留槽位,标 `Needs manual suggestion`**(不隐藏)。
5. 选 **Mixed** → 不过滤颜色。

### 近似色 fallback map（V1 简单版,以后按真实产品调）
```
Black    → Charcoal → Navy
White    → Natural → Light Grey
Navy     → Blue → Black
Charcoal → Black → Grey
Natural  → White → Brown
Blue     → Navy → Black
Green    → Natural → Black
Red      → Black → White
```

### 没货/没色的 UI（不隐藏槽位 —— 像专业采购助手）
```
Cap
Preferred: Navy
Selected: Charcoal
Reason: closest available colour
```
完全无替代:
```
Cap
Needs manual suggestion
```

### UI 文案
> We'll prioritise products in your selected kit colour. If an exact colour isn't available, we'll suggest the closest suitable alternative before quoting.

### 复用 & 实现
- 颜色匹配复用 FILTER 的 `colourFamiliesOf`(已上线);builder **数据驱动**,在产品库按"子类目 + 颜色家族"筛。
- **Navy / Charcoal 需按 `colour_slugs` 具体词匹配**(比 filter 家族细一档,避免 Navy kit 混进宝蓝/teal)。
- Kit 处必带 stock check 文案(见 `STOCK_ACCURACY.md` Now #3):下单前 stock confirmed,不承诺实时有货。

## 5. 建设顺序

1. **Homepage V1**:首页一块「Build a Promo Kit — Shop kits by occasion」+ 8 张场景卡 → 点卡进 Kit Picker(场景预选)。先上(纯转化,不依赖 SEO 页)。
2. **Kit Picker / Builder**（`/kit-picker`,noindex）:轻量规则推荐 + 自选/换货/颜色主题/MOQ 实算。
3. **场景落地页**（`/promo-kits/<slug>`,index）:等 kit 数据 curate 好 + Admin 就绪再做;正文 + 预制组合 + Customise 入口。
4. 依赖:后台需要"把产品组成一套 kit"的数据(kit 记录)——和 Admin 绑,先确认有没有。

---

## 6. 状态 / 变更记录

| 日期 | 变更 | 状态 |
|---|---|---|
| 2026-06-18 | 8 个 V1 场景 + 模板 + slug + SEO 规则锁定;Event Giveaway → Trade Show & Event Giveaway | ✅ 已定 |
| 2026-06-18 | Kit Builder 6 步流程 + 颜色规则(9 色调色板、换产品保颜色优先、fallback map、Needs manual suggestion)锁定 | ✅ 已定 |
| 2026-06-19 | **落地代码就绪(`feat/promo-kits`,待 preview)**:`/promotional-products` 数据驱动类目 hub(`getCategoryTree`,只链 live url_pages);`/promo-kits` hub + 6 步 builder(`KitBuilder.jsx`,`?scene/qty/budget/colour` → noindex);8 个 `/promo-kits/<slug>` 场景页(slot 链接经 `getLiveCanonicalMap` live 校验,非 live 降级纯文本);`lib/kits.js` SSOT;sitemap 收录 2 hub+8 场景页、builder 结果不进。每个面都带价格/库存免责。**V1 限制**:builder 是规则版,暂不解析实时单品/库存(等产品 DB+colourFamiliesOf,见 §4b/§5) | ⏸️ 已撤,见下 |
| 2026-06-19 | **⏸️ Kit 整条暂停 + 准备改名**。Lily 决定先停:首页/类目页移除所有 Kit 链接,`/promo-kits` 路由整套撤下(删 `app/promo-kits`、`lib/kits.js`、`KitBuilder.jsx`、sitemap kit 条目)。**类目 hub `/promotional-products` 保留并独立**(已从 Kit 分支拆出,见 `HOMEPAGE.md`)。Kit 旧代码留在 `promo-kits.patch` 备用 | ⏸️ 暂停 |
| **待定(回头商量)** | **改名 → 大概率 Merch Pack**(澳洲 Mercha + 欧洲 Monday Merch 两个头部都用 "Merch Pack")。三个要拍的:① 命名 Merch Pack / Kit / Gift Pack;② 模型 **Monday Merch 自助式**(产品化 pack:产品页 + 数量档 + 即时每件价 + Add to quote + "Goes well with")vs **Mercha 咨询式**(填项目需求 → 回策划好的 pack 选项 + 报价);③ 与 **Collections** 的关系(独立一块 vs 放进 Collections;pack 从现有 collection 抽货 vs 独立策划)。参考:Monday Merch `products.mondaymerch.com/en/collections/merch-packs`(34 个 "___ Gift Pack")、Mercha `mercha.com.au` "branded merch pack" 留资页 | 📋 待商量 |
| V1.5 | Wellness / Care Pack 场景 | 📋 backlog |
