# Intex 导入日志（Import Log）

**日期:** 2026-07-12  
**执行:** Lily + Claude（Cowork）  
**结果:** 376 个 Intex 产品全量导入成功（products / pricing_tiers / product_colours / decoration_options 四表）。

---

## 1. 范围与数量

| 项 | 数量 | 说明 |
|---|---|---|
| 上线清单（go-live） | 392 | `intex_392_codes.csv` |
| 排除服装类 | −16 | 见下方 SKU |
| **实际导入** | **376** | `intex_final_376_codes.csv` |
| 现货（shoppable，`fulfillment=local_stock`） | 187 | 有本地散单价 |
| 询价（indent，`quote_only=true`，`fulfillment=indent_sea`） | 189 | 只有 indent 工厂价、无现货散单价 |

**被排除的 16 个服装 SKU：**
`OCH100 OCH200 OCH300 OCP100LS OCP100MS OCP700LS OCP700MS OCSG100MS OCSG200MS OCT100KID OCT100LS OCT100MS OCT200MS OCT300MS OCT400MS OCT500MS`

> 注:同事那份图库/mapping 是 **392**（他不知道我们删了服装),多出的 16 个只当图源、不引用,不冲突。

## 2. 各表写入量

| 表 | 行数 | 备注 |
|---|---|---|
| products | 376 | — |
| pricing_tiers | 873 | 仅现货产品有梯度价 |
| product_colours | 376 | 每产品一条画廊记录 |
| decoration_options | 651 | 覆盖 362 个产品;14 个纯包装类无印刷,已正确跳过 |

## 3. 关键字段规则

- **supplier = `IntexGlobal`**（供应商公司真名,与 `Gildan Brands`/`PromoBrands` 风格一致）；**brand = `Intex`**。查询用 `supplier='IntexGlobal'` 或 `supplier ilike 'intex%'`。
- **decoration_model = `null`** → 走标准 `ProductClient`（和 TRENDS/PB/LL 同一套模板）。**不能填 `calculator`**，那会被路由到服装自由计算器（AS 模板)。
- **现货 vs 询价判定:** 有 `UNBRANDED` + `Local` 价表且 lead time ∈ {5 / 12 WORKING DAYS} → 现货;否则 → `quote_only=true`、`quote_ref_price=` 最便宜 indent 价、`fulfillment=indent_sea`、min_qty=250。
- **定价:** per_unit 存 Intex 成本;前台 ×1.4 向上取整到 $0.10。梯度毛利 50/45/40%（仅基价,印刷固定 40%,quote_only 不分层）。

## 4. 图片（双表结构,对齐 TRENDS/PB）

图源 = **`intex_r2_mapping.json`**（Lily 扫本机 `supplier\intex` 实际文件名生成,已抽查 URL 可打开）。

- `products.colours`（jsonb）= `[{name, hex:"", image}]` → **色块**（每色各自分色图,点击换大图）
- `product_colours.images`（jsonb 数组）= `[main, ft1…ftN, deco1…]` → **画廊**,第 0 张 = 主图（真 MAIN,非某个颜色图）
- **DECO 印刷示意图** 放画廊**最后**,不进色块。
- R2 URL 规则:`…/w400/<sku>/<slugify(image_file)>.webp`（swatch 另有 w160)。
- 文件名以扫描实际为准:主图是 `<sku>-main.webp`（不是 `-main-1`）。

## 5. Features / Specs 来源

- **Features**（左栏）← file1 `hightlights` 列,按 `|` 拆成 `product.features` 数组。
- **Specs**（中栏）← file1 `detail1`(Size) + `hightlights` 里的短 “Label: value” 对,写入 `product.specs` = `[{name,value}]`。
- **Description**（右栏）← file1 `description`,**已去 HTML 标签 + 去换行**（否则会撑破 SQL 且前台显示原始标签）。

## 6. 徽章制版费（唯一的前端新增）

Intex 徽章有独立制版费,别的供应商都是死值 $60:

- **Metal Badge** → `setup_fee = 100`,**PU Badge** → `setup_fee = 80`（各 22 个产品）。其余印刷 `setup_fee = null` → 前台回落 $60。
- 新增列:`alter table decoration_options add column if not exists setup_fee numeric;`
- **前端改动（需 commit/push）:**
  - `app/products/[slug]/page.js` — 查询加 `setup_fee` 字段
  - `app/products/[slug]/ProductClient.jsx` — 4 处 `d.setup_fee ?? SETUP_FEE`
  - `components/QuoteBuilder.jsx` — 1 处同上
  - （`lib/pricing.js` 的 tierMargin 之前已提交）
  - 提交命令只 add 这 3 个文件,勿 `git add .`。

## 7. 交付文件与跑法

分片导入（SQL Editor 有大小上限,单文件太大会报 “Query is too large”）:

```
01a_products_1.sql   ← 备份 + 清旧所有 Intex + setup_fee 列 + 前 188 产品
01b_products_2.sql   ← 后 188 产品
02_pricing_tiers.sql
03_product_colours.sql
04_decoration.sql
```

- **顺序不能乱**（01a 先建产品,后面才挂得上）。每个文件**只跑一次**。
- 01a 开头会 `create table if not exists products_bak_intex_import_0712`（备份）+ 删所有旧 Intex → **可重跑**;若某步报错或重复跑撞 slug,从 01a 重来即可清干净。
- 全量单文件版 `intex_import_FULL.sql` 保留备查(SQL Editor 跑不动,可用直连数据库)。

## 8. 踩过的坑（备忘）

1. `decoration_model='calculator'` 把 Intex 错误路由到服装计算器 → 改 null。
2. 颜色曾用「每色一条 product_colours 记录」错误结构 → 改回双表(`products.colours` + 单条 `product_colours.images`)。
3. `fulfillment='indent'` 违反 CHECK 约束 → 用 `indent_sea`(合法值:local_stock / indent_air / indent_sea / custom_sourcing)。
4. description 带换行/HTML → 撑破单行 INSERT → esc() 去换行 + clean_text() 去标签。
5. 图源一度缺失,后由 `intex_r2_mapping.json` 补齐(392 全含)。

## 8b. 上线后修正补丁（`intex_fixes_patch.sql`，376 条 UPDATE，只改 products 表）

导入后发现并修正的 4 类问题,已合成一个补丁（不删库、不动其它表,整块跑一次）:

1. **Category 名不对齐** → 4 个改名对齐系统权威:`Barware`→`Barware & Accessories`、`Outdoor & Lifestyle`→`Outdoor & Sports`、`Promotional Giveaways`→`Giveaways & Event Accessories`、`Tech`→`Technology`。
2. **Indent MOQ 掉成 1** → 生成器原来只读名为 `UNBRANDED` 的价表,漏掉了名为 `PRICE INCLUDES FULL COL PRINT` 等 Indent 表。改为读**所有 type=Indent** 表,取真实最小档做 MOQ（例:PS4001L=500）。
3. **Indent 无 From 价** → 同上根因;`quote_ref_price` 取 indent 最便宜档,前台 ×1.4 显示 “From $X”。仍有 17 个产品完全无价表 → 保持 `quote_ref_price=null`（真无数据）。
4. **全定制/单图产品色板灰块** → 颜色 `image` 为空且无 hex 时,色板回落用主图（例:PS4001L 的 Custom 色板显示印好的袋子图）。

> 生成器（`/tmp/intex_full.py`）已同步修正,以后重跑即正确。补丁避坑记:抠 colours 时不能用正则（specs 也以 `[{"name"` 开头会误抓),改用生成器算好的 `colours_sql` 直接输出 UPDATE。

## 9. 后续可精修（非阻塞）

- **6 个 subcategory 无 url_pages 页**:Apparel Accessories、Cotton Tote Bags、Eco/Metal/Plastic Pens、Pen Presentation（产品照常挂大类下,子分类页暂缺,可后补 url_pages 入口）。
- **17 个 indent 无价表** → 无 From 价、显示 “Price on application”,待补价。

- indent 占比 189/376 偏高,可抽查是否有该现货被判成询价的。
- 部分产品 features/specs 可再丰富(目前取自 file1)。
- category 映射细节(`intex_category_mapping_DRAFT.csv`)可继续微调。
