# 库存准确性（Stock Accuracy）— 主文档

> **风险**:目前前端标 "Local Stock"(来自 `fulfillment` 字段,只表示"履约方式=本地备货"),**不等于实时有货**。某些标 Local Stock 的可能已缺货。在我们能实时核库存前,**文案不能承诺有货**,下单前必须 stock check。
> Lily 定的优先级 + 时间线如下。摘要一行汇到 `NOW.md`。

---

## 1. Now（风险控制,跟 Homepage / Filter 一起做）

1. 前端文案:`In Stock` → **`Local Stock` / `Stock confirmed before order`**。
2. Filter **不承诺实时库存**(Local Stock facet 只说履约方式;加一句"stock confirmed before order" 提示,不暗示现货)。
3. Kit Picker 写清 **`stock check required`**(已有价格免责"final price confirmed after artwork and stock check",补"stock"措辞)。
4. **Product Publish Checklist** 加 **stock freshness / stock confidence** 字段/项。

> 这步是纯文案 + 一个 gate,低成本、先上,避免对客户做出我们兑现不了的承诺。

---

## 2. After Filter Phase 1（库存数据层）

- `supplier_inventory_snapshots` 表设计(供应商库存快照)。
- `stock_status` 派生规则(由 snapshot + fulfillment 推出)。
- 库存 **freshness 口径**(快照多久算"新鲜"/可信)。
- 只读 **precheck / postcheck**(下单前/后核对,先只读不写)。

> 依赖同一套 `supplier_sku` / variant / colour-size 关系 —— 所以等 Filter 数据层稳定后做,能复用。

---

## 3. Before publishing many GFL products / before real checkout（第一家供应商同步 pilot）

- 先选 **1 个供应商做 pilot**(GFL 或 TRENDS —— 谁的 feed/API 更易拿先做谁)。
- 同步方式:API / CSV / 手动上传 都行。
- 跑通这条链:`supplier feed → snapshot → product stock status → product page / filter / kit 使用`。
- **不要一开始就同步所有供应商**,先 pilot 跑通。

---

## 4. Later

- 扩到更多供应商。
- **自动替代推荐**(缺货时自动推同类有货产品 —— 正好接 Kit 的"换产品保颜色"逻辑)。

---

## 5. 时间线（Lily 定）

| 阶段 | 做什么 |
|---|---|
| **Now** | 改库存文案 + 加 stock check gate(跟 Homepage / Filter 一起) |
| **After Filter Phase 1** | 建库存 snapshot schema + 报告 |
| **Before 大量 GFL 上架 / 真实结账** | 第一个 supplier inventory pilot |
| **Later** | 扩更多供应商 + 自动替代推荐 |

---

## 6. 状态 / 变更记录

| 日期 | 变更 | 状态 |
|---|---|---|
| 2026-06-18 | 记录风险 + 4 步 Now + 三阶段时间线(Lily 定) | 📋 已记录,待排期 |
