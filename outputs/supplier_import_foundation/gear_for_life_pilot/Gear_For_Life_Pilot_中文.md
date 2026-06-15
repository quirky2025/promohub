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

| SKU | product name | raw category path | reason |
|---|---|---|---|
| OVT | Vantage Top | Clothing / Fleece | no high-confidence keyword match |
| BHZQM | Barkers Corporate Highlander Merino - Mens | Clothing / Merino | no high-confidence keyword match |
| WEGMCD | Merino Cardigan - Womens | Clothing / Merino | no high-confidence keyword match |
| BT | Ballistic Top | Clothing / Pullovers | no high-confidence keyword match |
| OTNT | Transition Top | Clothing / Pullovers | no high-confidence keyword match |
| TNT | Transition Top | Clothing / Pullovers | no high-confidence keyword match |
| PODCS | Decadent Cocktail 10 pcs Set | Home & Living / Miscellaneous Homeware | no high-confidence keyword match |
| PONS | Nature Secateurs | Leisure & Outdoors | no high-confidence keyword match |
| POPIB | Polar Ice 7.2L Bucket | Leisure & Outdoors / Coolers | no high-confidence keyword match |

这些不要自动进 `products`，先留 transform preview 的 `needs_review`。

## 颜色和图片规则

Gear For Life pilot 必须验证：

- 每个图片是否有颜色关系。
- 每个颜色是否有对应图片。
- 如果图片没有颜色关系，先标记 `image_unlinked`。
- 如果颜色没有图片，先标记 `colour_missing_image`。
- 不要把颜色图片打平到产品级图片。

最终产品页需要的是：

```text
product
  -> product_colours
       -> colour-specific images
```

不是：

```text
product
  -> random image list
```

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

