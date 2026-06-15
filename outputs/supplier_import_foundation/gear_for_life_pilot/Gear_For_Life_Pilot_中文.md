# Gear For Life Raw Staging Pilot

这是第一家供应商 pilot 的中文执行说明。目标是验证整条安全流程，而不是马上把产品发布到前台。

## 为什么选 Gear For Life

Gear For Life 适合做第一家 pilot：

- 数据量相对小：472 source rows，470 unique SKUs。
- raw category path 数量较少：50 个。
- 分类结构比较清楚。
- 已有 mapping 结果比较稳。
- 只剩少量 manual review，可以验证人工 review 流程。

当前 mapping 概况：

| mapping status | raw category paths |
|---|---:|
| auto_mapped | 40 |
| auto_mapped_by_keyword | 2 |
| product_keyword_rules_applied | 2 |
| product_keyword_rules_partial | 6 |

已知 Gear For Life 剩余 manual review 产品：9 个。

## Pilot 目标

本阶段只做：

1. 建立字段映射。
2. 把 Gear For Life 原始数据进 raw staging。
3. 保留原始 SKU、分类、颜色、图片、价格、decoration 信息。
4. 跑 READONLY 检查。
5. 生成 transform preview。
6. 标记哪些可以 ready，哪些必须 manual review。

本阶段不做：

- 不直接写 `products`
- 不发布产品
- 不删除原始重复行
- 不猜颜色图片关系
- 不把 gift set / pack 硬塞进普通 category

## Gear For Life 优先导入范围

第一轮建议从这些清晰 category 开始：

| raw category path | target |
|---|---|
| Clothing / Shirts | Apparel > Shirts |
| Clothing / Polo Shirts | Apparel > Polo Shirts |
| Clothing / Jackets | Apparel > Jackets |
| Bags / Cooler Bags | Bags > Cooler Bags |
| Bags / Backpacks | Bags > Backpacks |
| Bags / Duffle/Sports Bags | Bags > Travel & Duffle Bags |
| Bags / Travel Bags | Bags > Travel & Duffle Bags |
| Bags / Laptops | Bags > Laptop Bags |
| Drinkware / Drink Bottles | Drinkware > Drink Bottles |
| Drinkware / Glassware | Drinkware > Glassware |
| Home & Living / Cheese Boards | Home & Living > Cheese & Serving Boards |
| Home & Living / Kitchenware | Home & Living > Kitchen & Dining |

先不要自动发布这些部分：

| raw category path | reason |
|---|---|
| Clothing / Merino | product-level mapping partial |
| Clothing / Pullovers | product-level mapping partial |
| Clothing / Fleece | product-level mapping partial |
| Leisure & Outdoors | mixed products |
| Leisure & Outdoors / Coolers | unresolved product remains |
| Home & Living / Miscellaneous Homeware | mixed products |

## 已知 manual review 产品

| SKU | product name | raw category path | 建议归类 | reason |
|---|---|---|---|---|
| OVT | Vantage Top | Clothing / Fleece | Apparel > Sweatshirts | Top under Fleece; confirm manually |
| BHZQM | Barkers Corporate Highlander Merino - Mens | Clothing / Merino | Apparel > Sweatshirts | Merino pullover/top signal; confirm manually |
| WEGMCD | Merino Cardigan - Womens | Clothing / Merino | Apparel > Sweatshirts | Merino cardigan; confirm manually |
| BT | Ballistic Top | Clothing / Pullovers | Apparel > Sweatshirts | Top under Pullovers; confirm manually |
| OTNT | Transition Top | Clothing / Pullovers | Apparel > Sweatshirts | Top under Pullovers; confirm manually |
| TNT | Transition Top | Clothing / Pullovers | Apparel > Sweatshirts | Top under Pullovers; confirm manually |
| PODCS | Decadent Cocktail 10 pcs Set | Home & Living / Miscellaneous Homeware | Barware & Accessories > Bar Accessories | cocktail set; confirm manually |
| PONS | Nature Secateurs | Leisure & Outdoors | Tools & Auto > Tool Sets & Screwdrivers | secateurs/tool item; confirm manually |
| POPIB | Polar Ice 7.2L Bucket | Leisure & Outdoors / Coolers | Barware & Accessories > Bar Accessories | ice bucket; confirm manually |

这些建议只为了人工一眼确认，不自动写入 `products`。先留 transform preview 的 `needs_review`。

## Top 歧义规则

`Top` 这个词本身有歧义，不能全站通用自动规则。

但是在 Gear For Life 这次 pilot 里：

- `Clothing / Fleece` 下的 `Top`
- `Clothing / Pullovers` 下的 `Top`
- `Clothing / Merino` 下的 Merino top / cardigan / pullover

建议人工优先看作：

```text
Apparel > Sweatshirts
```

这仍然是建议，不是自动规则。

## 颜色和图片规则

Gear For Life pilot 必须验证：

- 每个图片是否有颜色关系。
- 每个颜色是否有对应图片。
- 如果图片没有颜色关系，先标记 `image_unlinked`。
- 如果颜色没有图片，先标记 `colour_missing_image`。
- 不要把颜色图片打平到产品级图片。
- 如果图片对不上颜色，放到 `product_images`，作为 `gallery` 兜底图，不进入 `product_colours.images`。

最终产品页需要的是：

```text
product
  -> product_colours
       -> colour-specific images
  -> product_images
       -> gallery fallback images
```

不是：

```text
product
  -> random image list
```

## Transform Preview 必备列

Gear For Life transform preview 必须包含：

- `page_role`：普通产品分类写 `P`，防止误归到 F/filter-only 页面。
- `fulfillment`：默认 `local_stock`。

ready 行可以用 `P / local_stock`。manual review 行也先保留 `P / local_stock`，但 `mapping_status` 必须是 `needs_review`。

## 你接下来要做什么

现在不用跑任何 SQL。

下一步需要你确认两件事：

1. Gear For Life 就作为第一家 pilot。
2. 你能提供或确认 Gear For Life 原始文件的位置。

确认后，我下一步可以做：

- 根据真实 Gear For Life 文件字段，完善 field mapping。
- 生成 raw staging load SQL 或导入脚本草案。
- 生成 transform preview SQL 草案。
- 继续坚持：SQL 只生成给你检查，你手动在 Supabase 跑。
