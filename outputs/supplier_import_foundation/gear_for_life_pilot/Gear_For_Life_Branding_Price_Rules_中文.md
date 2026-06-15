# Gear For Life Branding 价格导入规则

这份说明专门记录 Gear For Life / The Source 这种“产品价格”和“branding 价格分开”的供应商规则。

## 核心原则

前台可以继续显示成现在 TRENDS 那种 Branding & Decoration 表格，但后台导入不能把不同供应商硬压成同一张横向表。

Gear For Life 的产品价格和 branding 价格要分开保存：

```text
产品本身数量价格
  -> supplier_price_rows

branding 方式 / 位置 / 尺寸 / setup
  -> supplier_decoration_options

branding 数量阶梯单价
  -> supplier_decoration_price_rows
```

最终前台展示时，再把这三层组合成客户看到的 rows。

## 为什么不能只存一个 Pad Print

同一个产品可能有多个 Pad Print 位置，例如：

- Box Lid - max 70x40mm
- Bottle - 45x45mm
- Silicone base - 20x60mm

这些不能合并成一个笼统的 `Pad Print`。它们应该是三个 decoration options，因为位置和尺寸不同，客户选择时含义也不同。

## 需要保留的字段

每个 branding option 至少要能保留：

- `supplier_sku`：必须能对上产品 SKU / Code。
- `decoration_method`：Pad Print、Laser Engraving、UVDTF、Transfer、Embroidery 等。
- `decoration_area`：供应商原始文字，例如 `Box Lid - max 70x40mm`。
- `decoration_location`：规范化位置，例如 `Box Lid`、`Bottle`、`Silicone base`。
- `artwork_size_label`：原始尺寸，例如 `70x40mm`、`100x120mm`。
- `max_width_mm` / `max_height_mm`：只有尺寸明确时才拆成数字。
- `setup_cost`：例如 Pad/Laser setup `$75.00`，UVDTF setup `$55.00`。
- `repeat_setup_cost`：如果供应商提供 repeat setup，要保留。
- `price_status`：`priced`、`poa`、`request_quote`、`included`、`unavailable`。
- `additional_colour_policy`：例如 additional colour print requirement POA。

## 数量阶梯怎么存

每一个 `method + location + size + qty break` 都是一条 `supplier_decoration_price_rows`。

例如：

```text
Pad Print / Box Lid / 70x40mm / 25+  -> 4.70
Pad Print / Box Lid / 70x40mm / 50+  -> 4.10
Pad Print / Bottle / 45x45mm / 25+   -> 4.70
Laser Engraving / Bottle / 35x40mm or 20x80mm / 25+ -> 4.75
UVDTF / Bottle / 100x120mm / 1+      -> 16.10
UVDTF / Bottle / 200x150mm / 1+      -> 20.00
```

这样做可以避免把 Bottle 的 UV 价格套到 Box Lid，也可以避免把 Laser 的 setup 当成 Pad Print 的 setup。

## POA 和 Request Quote

供应商写 `POA`、没有固定 branding 价格、或者尺寸/规则不完整时，不要猜价格。

这些行要标记为：

```text
price_status = request_quote
```

或：

```text
price_status = poa
```

前台可以显示询价或不显示自动价格，但后台必须保留原始信息，方便人工报价。

## 和 TRENDS 的关系

TRENDS 的原始格式是一行里同时有产品价、branding 方法、branding 单价和 setup fee，所以看起来简单。

Gear For Life 不一样：产品价格和 branding 价格来自不同位置。导入时不是把 GFL 变成 TRENDS 原始表，而是让它们最后都进入统一的内部结构。

```text
TRENDS 横向表
  -> 拆成 supplier_price_rows + supplier_decoration_options + supplier_decoration_price_rows

GFL 产品文件 + branding price list
  -> 对齐 SKU
  -> 拆成 supplier_price_rows + supplier_decoration_options + supplier_decoration_price_rows
```

## 检查规则

GFL branding 导入后，READONLY 检查必须能发现：

- branding price row 对不上产品 SKU。
- decoration option 没有数量阶梯价格。
- 数量阶梯为 0 或负数。
- `unit_cost` 为负数。
- `min_qty` 大于 `max_qty`。
- `priced` 状态但没有 `unit_cost`。
- `POA` / `request_quote` 行需要人工确认。
- area 或 size 缺失，需要人工确认是否能前台展示。

## 重要提醒

40% margin 不在 supplier staging 层计算。staging 层只保存供应商原始成本和规则。

最终 margin、setup fee 是否加价、前台显示方式、报价计算，应该在 QuirkyPromo 的 pricing / quote 层处理。
