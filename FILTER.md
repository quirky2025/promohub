# FILTER（分类筛选系统）— 主文档

> FILTER 这条线的**主文档**。换 chat / 忘了细节,先读这页。
> 深挖子文档:`FILTER_AUDIT.md`(架构/竞品)、`FILTER_DATA_AUDIT.md`(profiling SQL + 判定矩阵 + Roadmap)、`FILTER_SLUG_DEPLOY.md`(部署步骤)。
> 摘要一行汇到 `NOW.md`。

---

## 1. 这是什么 / 在哪

扁平类目页 / 子分类页左侧的筛选侧栏(颜色、价格、材质…)。**只在类目/子分类页出现,颜色集合页不出现。**

代码位置:
- `app/[slug]/page.js` —— 真渲染器(SSR)。`filterable = product_filter.type ∈ {category, subcategory}` 时,SSR 出产品网格 **+** 挂 `<CategoryFilter>`。
- `components/CategoryFilter.jsx` —— 客户端壳:管 `selected` 状态、算 facets、渲染侧栏 + 过滤后的网格。
- `components/FilterSidebar.jsx` —— 纯展示侧栏(色块、计数、Show all、清空)。
- `lib/filterConfig.js` —— **每个类目有哪些 facet** + 每个 facet 怎么从产品取值。
- `lib/filterAttributes.js` —— 把原始字段/文本**关键词归类**成家族(颜色/材质/装饰/Gender 等)。
- `lib/filterFacets.js` —— 算 facet 选项+计数(`computeFacets`)、按勾选过滤(`applyFilters`)。

---

## 2. 工作原理(为什么 SEO 安全)

- **服务端 SSR** 先把默认产品网格渲染进 HTML（Google 看得到产品）,filter 是客户端在这批产品上做**纯前端**过滤。
- **不写 URL**:勾选只改 React state,地址栏始终不变,**不产生 `?colour=` 之类可被索引的参数页**。
- filter 值是**渲染时实时算**的(不是预存标签)→ 见 §5 新品自动归类。

---

## 3. Facet 清单 + 数据来源

**全局(每个类目都有)** — `GLOBAL`
| Facet | 来源字段 | 说明 |
|---|---|---|
| Colour | `colour_slugs` | token 归 ~15 个色系 + Multi;带色块 |
| Price | `pricing_tiers`(最低价×margin,ex-GST) | 档:`<$2 / $2-5 / $5-10 / $10-25 / $25+`,**低→高** |
| Min Qty | `min_qty` | 档:`<=25…>500`,低→高 |
| Brand | `brand` | |
| Branding | `decoration_options.name` | 6 类:Full Colour / Screen·Pad Print / Transfer / Embroidery / Laser Engraving / Special |
| Stock / Lead time | `fulfillment` | Local Stock / Indent Air / Indent Sea。**noThin(永不隐藏)** |
| Eco | `is_eco` | "Eco / Sustainable"。**noThin** |
| Material | 产品名 + `materials` + `material_tags` 并集 | 见 §4。全局,没数据自动隐藏 |

**类目专属** — `CATEGORY`
| 类目 | 额外 facet | 来源 |
|---|---|---|
| Bags | Bag Type(子类目)、Capacity(升档) | `subcategory`、`capacity` |
| Drinkware | Capacity(ml 档)、**BPA Free**(Safety) | `capacity`、名+`materials` |
| Pens | Pen Type、Mechanism、Ink Colour | `subcategory`、`pen_mechanism`、`pen_ink_colour` |
| Apparel | **Gender**(Men/Women/Kids/Unisex) | 名 + `subcategory` |

> 子分类页:把"类型"facet(Bag Type / Pen Type)自动去掉(因为它就是当前页)。

---

## 4. 规则细节

- **材质家族**(关键词,可多值):RPET、Non-Woven、Stainless Steel、Aluminium、Tritan、Glass、Ceramic、Bamboo、Silicone、Cotton、Canvas、Jute、Nylon、Wool、Polyester、Wood、Metal、Plastic。
  - 优先级防误判:`recycled poly→RPET`(不算 Polyester);`non-woven→Non-Woven`(不算 Plastic);`stainless/aluminium/tritan` 各自独立、压掉通用 Metal/Plastic;`Juco→Jute+Cotton`。
  - 三源并集:产品名 + `materials`(自由文本)+ `material_tags`。
- **BPA Free**:文案明写 "BPA free" **或** 材质天然无 BPA(不锈钢/玻璃/陶瓷/Tritan/竹/硅胶)。普通塑料、铝**不自动认**(避免乱贴安全声明)。
- **Gender**:从名/子类目关键词推(`\bmen\b` 不会误命中 "women")。
- **交互**:同组**单选**(点新的自动取消旧的;再点当前的=取消);跨组 AND。
- **阈值**:某值少于 **2** 个产品默认隐藏(`THIN_HIDE=2`),避免一堆 count-1 杂项;但标了 **`noThin`** 的(Stock、Eco、BPA)**永不隐藏**,哪怕只有 1 个(否则像"只有 1 个 Indent Air"会筛不到)。
- **色块**:Colour 每个值前一个圆色块,Multi=彩虹圈。

---

## 5. 新产品会自动进 filter 吗?✅ 会

filter 是渲染时实时算的 → **新产品一发布、进了对应类目,就自动被归类,不用手动维护 filter、不用重跑脚本。**

**前提:上货时字段填齐(垃圾进垃圾出)。空字段 = 该产品在对应 facet 里缺席(不报错)。**

上货 checklist:
- ✅ 正确 slug(避免 404)
- ✅ `colour_slugs`(进颜色页 + 颜色 filter)
- ✅ `pricing_tiers` / `min_qty`(价格 / MOQ)
- ✅ `brand`、`fulfillment`、`is_eco`
- ✅ `materials` 或产品名带材质词(材质 / BPA)
- ✅ `capacity`(容量)
- ✅ 图走 ProductImg
- ✅ 跑 `weekly_seo_audit.sql` + filter profiling 复验

**唯二要回来改代码的情况**(都很小):
1. 出现**没见过的新词**(如新材质 "Hemp")→ 加一行关键词。
2. **全新大类目**(如 "Tech")→ 先只有全局 filter,要给它配专属 facet。

---

## 6. 如何扩展

- **加一个材质/颜色词**:在 `lib/filterAttributes.js` 对应家族的关键词数组/正则里加。
- **给某类目加专属 facet**:在 `lib/filterConfig.js` 定义 facet(`{key,label,get}`,可加 `order`/`noThin`/`isType`),挂到 `CATEGORY[类目名]`。⚠️ **类目名要和库里 `category` 字段完全一致**(现用 Bags/Drinkware/Pens/Apparel)。
- **测试**:`node scripts/test_filterAttributes.mjs`(属性归类)+ `node scripts/test_filterFacets.mjs`(facet 计算/过滤)。

---

## 7. 部署 + preview 验收

标准流程:全新克隆 main → 新分支 → 覆盖改过的 `lib/`、`components/` 文件 →（只有新增查询字段时才）跑 `node scripts/wire_slug_filters.mjs` → commit/push → preview 验收 → merge。

**preview 验收清单**:
- 🔴 颜色集合页(如 `/black-custom-bags-australia`)**无** filter;类目页**有**。
- 🔴 SSR:`/custom-bags-australia` **查看网页源代码(Ctrl+U)** 搜得到产品名 + 价格。
- 🔴 勾 filter 后**地址栏不变**(不冒 `?` 参数)。
- 色块、Price 低→高、同组单选、各 facet 计数合理。
- 类目专属 facet 真的出现(Drinkware 的 BPA/容量、Apparel 的 Gender)——没出现多半是类目名对不上,见 §6。

---

## 8. SEO 铁律(别破坏)

canonical / `?colour=` noindex / schema / sitemap / 18 颜色页 5 条保护线(见 `SEO_STATUS_ONEPAGER.md`);filter **不写 URL、不造参数页**。

---

## 9. 状态 / 变更记录

| 日期 | 变更 | 状态 |
|---|---|---|
| 2026-06-18 | FILTER 接入扁平 `[slug]` 页(全局 + Bags/Pens 专属);色块、同组单选、价格低→高、Stock/Eco noThin、材质多源 | ✅ 已合并 main |
| 2026-06-18 | Material 全局+拆细;Drinkware 只取瓶身主材质(白名单+主体解析,滤配件)+ BPA + ml 容量;Apparel Gender;Polypropylene 全称 | ✅ 已合并 main |
| 等产品多了 | **Apparel 细化**(Size S–XXL 抽变体、Fit/Sleeve 等)——衣服产品量起来后按 preview 计数再加,随时可做 | 📋 backlog |
| 后续 | 材质权威回填(方案C,入库后)、Drinkware 其它专属维度 | 📋 backlog |
