# 新导入产品 — SEO 填写指南(Meta Title / Meta Description / Alt Text)

> 对象:补产品、导入产品时填 SEO 的人(Lily / 助理 / 做导入的 chat)。
> 目的:每个新产品的 meta title、meta description、图片 alt 都填对、不雷同、符合 Google 规则。
> 系统里这些字段在:**后台 → Products → 打开产品 → SEO 标签页**。
> 最后更新:2026-07-23。

---

## 0. 先搞清楚:哪些是自动的、哪些要人填

| 字段 | 导入时 | 前台没填时怎么办 | 要不要人工填 |
|---|---|---|---|
| `seo_description`(卡片短摘要) | ✅ 导入器自动从供应商描述抓(清洗后 400 字) | — | 可选,想更好就改 |
| `meta_title` | ❌ 导入是**空的** | 自动套 `Custom {产品名} with Logo \| QuirkyPromo` | **建议人工填**(自动的偏通用) |
| `meta_description` | ❌ 导入是**空的** | 自动套通用模板 | **建议人工填** |
| `alt_text`(主图 alt) | ❌ 导入是**空的** | 图片没有专属 alt | **建议人工填** |
| `display_title`(前台大标题/H1) | 视导入而定 | 用 `name` | 可选 |

> 关键:**空着不会报错,前台有自动兜底**,但自动的偏通用、容易和别的产品雷同。要排名好、就把下面三样填好。批量导入可先空着上线,再挑重点产品逐个补。

---

## 1. Meta Title(网页标题)

**作用**:Google 搜索结果里那条蓝色大标题;浏览器标签页标题。**最影响点击率的一项。**

### 规则(硬性)
- **长度 ≤ 60 个字符**(含空格)。后台有实时字数 `x/60`,别超。超了 Google 会截断成「…」。
- **品牌自动加**:系统会自动在结尾补 ` | QuirkyPromo`,**你自己不要再打品牌**,否则会变成两次。
- **每个产品都要不一样** —— 别几十个产品共用一句。
- 把**最重要的关键词放前面**(客户会搜的词)。

### 公式
```
Custom [产品名] with Logo
Custom Printed [产品名]
Branded [产品名] Australia
Personalised [产品名]
```
(系统自动补 ` | QuirkyPromo`,所以你写到这就够,别超 60 字)

### 例子

| 产品 | ✅ 好(≤60,含品牌自动) | ❌ 差 |
|---|---|---|
| Canvas Cooler Bag | `Custom Canvas Cooler Bags with Logo` | `Cooler Bag`(太短、无关键词) |
| Ceramic Coffee Mug | `Custom Printed Ceramic Coffee Mugs` | `Custom Ceramic Coffee Mug with Logo for Corporate Events and Gifts Australia`(超 60) |
| Bamboo Pen | `Branded Bamboo Pens Australia` | `Bamboo Pen \| QuirkyPromo`(自己又打了一遍品牌 → 重复) |

---

## 2. Meta Description(网页描述)

**作用**:Google 结果里标题下面那两行小字。不直接影响排名,但**影响点不点进来**。

### 规则(硬性)
- **长度 110–160 个字符**(后台上限 160,有字数提示)。太短浪费、太长被截。
- **每个产品都要不一样**,不能通用一句套所有。
- 里面自然带上:产品是什么 + 能印 logo + 用途(corporate gifts / events / promotions)+ 澳洲配送。
- 别堆砌关键词、别夸大(no "best/cheapest")。

### 公式(填空即可)
```
Custom [产品名] printed with your logo — ideal for [用途]. [一个卖点/材质]. Fast Australia-wide delivery and bulk quotes.
```

### 例子

✅ 好(约 150 字):
> `Custom canvas cooler bags printed with your logo — ideal for corporate events, staff gifts and promotions. Insulated, durable and eco-friendly. Fast Australia-wide delivery.`

✅ 好:
> `Branded ceramic coffee mugs with your logo — perfect for offices, cafés and client gifts. Dishwasher safe, 300ml. Bulk pricing and fast Australian delivery.`

❌ 差(通用、每个产品都一样):
> `Buy promotional products with your logo at QuirkyPromo. Best prices, fast delivery.`

---

## 3. Alt Text(图片替代文字)

**作用**:图片加载不出来时显示的文字;给盲人读屏软件用;Google 图片搜索靠它。**每张主图都该有。**

### 规则
- **描述图里是什么**,简短一句,自然带产品名 + "with logo / printed"。
- **别堆关键词**(Google 会判作弊)。别写 "image of / photo of"。
- 一句话,大约 8–15 个词。

### 公式
```
Custom [产品名] with company logo
Branded [产品名] printed with [颜色/特征]
```

### 例子

| 产品 | ✅ 好 | ❌ 差 |
|---|---|---|
| Cooler Bag | `Custom printed canvas cooler bag with company logo` | `cooler bag`(太笼统) |
| Coffee Mug | `Branded white ceramic coffee mug with logo print` | `mug mug coffee mug custom mug promotional mug`(堆砌) |
| Bamboo Pen | `Custom bamboo pen printed with brand name` | `image of a pen`(废话) |

---

## 4. 一条产品的完整示范

产品:**Custom Canvas Cooler Bag**(SKU CB123)

| 字段 | 填什么 |
|---|---|
| Meta Title | `Custom Canvas Cooler Bags with Logo`(系统自动补 ` \| QuirkyPromo`) |
| Meta Description | `Custom canvas cooler bags printed with your logo — ideal for corporate events, staff gifts and promotions. Insulated, eco-friendly. Fast Australia-wide delivery.` |
| Alt Text | `Custom printed canvas cooler bag with company logo` |
| SEO Description(卡片) | 导入已自动填,检查通顺即可 |

---

## 5. 硬规则汇总(来自 SEO Rulebook,别违背)

- **只用真实信息,绝不编造** —— 没价不写价、没库存不写 in stock、没评价不写星级。
- Meta title **≤ 60 字**;meta description **110–160 字**;每个产品**专属、不雷同**。
- **品牌 ` | QuirkyPromo` 系统自动加**,自己别重复打。
- 全部用**英文**(客户面向)。
- 关键词放前面,自然通顺,别硬塞、别夸大。

---

## 6. 批量导入的建议流程

1. **先按现状导入**(meta 三样空着)—— 前台有自动兜底,不会坏,可以先上线。
2. **挑重点产品优先补**:卖得好的、走量的、想冲排名的,先手工填 title / description / alt。
3. 长尾/冷门产品可以晚点补,或让自动模板先顶着。
4. 补的时候一个产品一个产品来,照第 1–3 节的公式套,看着后台字数提示别超。

> 想让导入器**自动生成**更好的 meta title/description(而不是留空)?可以做 —— 让做导入的 chat 在 `app/api/cron/import-products/route.js` 里按第 1、2 节的公式,用产品名 + 类目拼一个默认 meta_title / meta_description 写进去。这样导入即带基础 SEO,人工只需精修重点产品。**需要的话告诉我,我出改法。**

---

## 7. 相关文件 / 位置

| 在哪 | 管什么 |
|---|---|
| 后台 Products → SEO 标签 | 人工填 meta_title / meta_description / alt_text / seo_description |
| `app/api/cron/import-products/route.js` | 导入器(目前只自动填 seo_description) |
| `app/products/[slug]/page.js` `generateMetadata()` | 前台读这些字段;空则套自动模板 |
| `SEO_HANDOFF.md` | 全站 SEO 工程规则(权威基准) |
| `SUPPLIER_ONBOARDING_REFERENCE.md` | 新供应商接入配置清单 |
