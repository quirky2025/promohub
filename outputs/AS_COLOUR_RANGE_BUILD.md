# AS Colour / Gildan Range — 建设 spec（2026-07 · 决策已定稿）

## 大方向
计价产品(`decoration_model='calculator'`：AS Colour + Gildan Brands)不混进现有 TRENDS 类目页,
而是各自进**品牌专区(Range)**。价格模型不同(计价器 vs 阶梯价),分开最干净。

- **AS Colour Range** — 单品牌(`supplier='AS Colour'`)
- **Gildan Range** — 一个入口,内含三个品牌 `Gildan / Comfort Colors / American Apparel`(`supplier='Gildan Brands'`,用 `brand` 字段区分),**加品牌 filter**

## 数据现状(已全部归位,487 款已发布)
两级 `category` / `subcategory`,和站点命名对齐:
- **Apparel**:T-Shirts(115)、Hoodies(62)、Pants & Shorts(45)、Jackets(32)、Tanks & Singlets(28)、Long Sleeves(27)、Shirts(11)、Polo Shirts(11)、Socks(10)、Activewear(10)、Aprons(8)、Sweatshirts(8)、Underwear(7)、Belts(4)、Overalls(4)、Dresses(3)
- **Bags**:Tote Bags(9)、Travel & Duffle(8)、Crossbody & Belt(6)、Backpacks(3)、Wallets(3)、Laptop(2)、Toiletry(1)
- **Headwear**:Caps(53)、Bucket Hats(11)、Beanies(6)
- 已下线 22 个非服装杂项(工具/宠物/凳子等 Gadgets+Accessories)

## 已完成
- ✅ **全局类目页排除计价产品**:`lib/urlPages.js` 的 `getProductsForUrlPage` 加了
  `.or('decoration_model.is.null,decoration_model.neq.calculator')`(标准产品 null 保留)。

## 待建
### 1. 卡片 "From $X"(计价产品)
类目/Range 卡片用 `getLowestPrice`,对计价产品返回 0 → 空白。需新增卡片版起步价:
复用 `lib/decorationPricing.js` 的 `startingUnitPrice(garmentBase, type)`(garment×1.4 + 最便宜装饰)。
**已确认公式(同 PDP `page.js` 的 offerPrice):**
```js
// 计价产品有 pricing_tiers,base_price = 空白衣服价
garmentBase = Math.min(...pricing_tiers.map(t => +t.base_price).filter(n => n > 0))
if (decoration_model === 'calculator')  price = startingUnitPrice(garmentBase, decoType(product))  // 装饰后 From $X
else                                     price = garmentBase * 1.4                                   // 标准空白价(现 getLowestPrice)
```
注意:`decoType(product)` 在 `page.js` + `ASColourClient` 里各有一份(必须一致),卡片要用得**抽到 lib 共用**,或卡片默认按 'apparel'(AS/Gildan 多为服装,基本安全)。

### 2. Range 页
- 路由:`/as-colour`、`/gildan`(自建 route,不走 url_pages,因为 getProductsForUrlPage 已排除计价产品)
- 查询:按 `supplier` 查(含计价产品)
- **已建 V1**:`app/as-colour/page.js` = Hero + "Browse by Subcategory" 卡片(按类型,图+数量,锚点跳转)+ 各类型产品区,卡片 From $X。**已能用、AS 不再是孤儿。**
- **V2(左侧 filter,待做)**:复用现有 `components/CategoryFilter`(左 FilterSidebar + 右网格)。
  - 需把 AS 产品**服务端 enrich**:`_image`(getFirstImage)、`_price`(**calculatorFromPrice**,不是 getLowestPrice)、`_swatches`、`_decorationNames` + 原始 facet 字段。
  - ⚠ `computeFacets`/`facetsFor(category)` 是**单类目**设计;Range 跨 3 类目,要么每类目区各挂一个 CategoryFilter,要么改 facetsFor 支持多类目。**这是要小心的集成。**
- Gildan 页加 **brand filter**(Gildan/Comfort Colors/American Apparel)

### 3. 导航
Apparel 大菜单加一栏 **"Shop by Range"** → AS Colour Range / Gildan Range

### 4. Filter(结构 = Type-first,Gender 做 filter 不做顶层)
- **Type**:现成(category/subcategory)✅
- **Print method**:decoration options 里有,基本可用
- **Material**:`specs.composition` 需规范成 Cotton/Poly/Blend
- **Gender**:⚠ 需**先造 gender 字段** —— 从名字/slug 推导:Women's→Women、Men's→Men、Kids/Youth→Kids、其余→Unisex(AS 多为 Unisex)

## 建设顺序
1. 卡片 From $X(地基)
2. Range 页(Type-first)+ Type filter + Gildan brand filter
3. 导航入口
4. 造 gender 字段 + 规范 material → Gender / Material filter
5.(以后)品牌+类型落地页,如 /custom-as-colour-t-shirts(SEO)

## 红线
- 现有 TRENDS 类目页保持不变(已排除计价产品)
- 卡片价格必须真实(From = startingUnitPrice),不虚标
