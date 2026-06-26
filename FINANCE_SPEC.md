# QuirkyPromo — FINANCE 模块规格 / 建设日志

> 本文件记录 Finance 模块的设计决策、数据模型、算法与上线计划。
> 任何 Finance 相关改动先看这一份。配套:DOC_STANDARDS.md(单据)、SOURCING_BUILD_SPEC.md(采购)。
> 状态:**v1 已建,未实跑测试**(沙箱当时不可用)。等跑 SQL + 部署后需逐项验证。

---

## 1. 关键决策(Decision log)

| 决策 | 结论 | 日期 |
|---|---|---|
| 用不用 Xero / MYOB | **都不用 → Finance 就是正式账本** | 2026-06 |
| 记账基础 | **现金制 + 银行优先**:每一笔进/出记一行,银行流水 = 唯一事实 | 2026-06 |
| 业务线 | 两条:`local_stock` 本地备货 / `sourcing` / `overhead` 日常,GST 分开供季度 BAS | 2026-06 |
| 本财年(2025/7–2026/6,已乱) | **不逐笔**。系统 7/1 开期初余额干净开始;旧账交会计按银行对账单 + 发票报税 | 2026-06 |
| 正式启用 | **2026-07-01** 起逐笔 + 银行对账 | 2026-06 |
| 货代难点 | 一笔澳币付清多张人民币发票 @ 当天汇率 + 手续费 → 按比例**分摊到每张订单** | 2026-06 |
| 银行流水录入 | 先**手动**,量大了再网银 CSV 导入 | 2026-06 |
| 订单号 | OC(客户)/ PO(供应商/工厂)跨本地与 Sourcing **共用一个号池**,是贯穿对账的主键 | 2026-06 |

---

## 2. 数据模型(表)

新建于 `outputs/finance/finance_schema_CREATE.sql`(依赖先建 `sourcing_orders`):

- **`bank_transactions`** — 银行台账,唯一事实。
  关键列:`txn_date, direction(in/out), amount_aud(含GST), gst_aud, business_line, category(科目code), counterparty, description, reference, reconciled, source(manual/import/system), linked_type, linked_id`。
- **`forwarder_bills`** — 货代人民币发票,挂到一张 `sourcing_orders`。
  `forwarder_name, invoice_number, amount_rmb, sourcing_order_id, order_number, status(unpaid/paid/...), payment_id, paid_aud, fee_share_aud`。
- **`forwarder_payments`** — 一笔澳币付款。
  `payment_date, fx_rate(RMB→AUD直算), bills_aud, handling_fee_aud, handling_fee_gst_aud, total_aud, bank_transaction_id`。
- **`forwarder_payment_allocations`** — 一笔付款如何拆到各账单/订单。
  `payment_id, bill_id, sourcing_order_id, order_number, amount_rmb, amount_aud, fee_share_aud, total_aud`。

RLS:anon 全关,后台 API 走 service role。

---

## 3. 科目表(Chart of accounts)

源文件:**`lib/financeAccounts.js`**(以后加/改名只动这一处)。
每个科目带 `section`,决定它进利润表哪一块:

- **收入 revenue**:`sales_local` 销售-本地 · `sales_sourcing` 销售-Sourcing · `other_income`
- **销货成本 cogs**:`cogs_goods` 货款 · `cogs_intl_freight` 国际运费(货代) · `cogs_local_freight` 本地快递 · `cogs_duty` 关税清关 · `cogs_decoration` 印刷加工
- **管理/运营 overhead**:`ovh_phone_internet` 话费网络 · `ovh_office` 办公 · `ovh_software` · `ovh_bank_fees` 手续费 · `ovh_wages` 工资 · `ovh_rent` 租金 · `ovh_marketing` · `ovh_insurance` · `ovh_other`
- **不计入利润表 other**:`opening_balance` 期初余额 · `transfer` 转账 · `gst_remittance` BAS缴税 · `owner_contribution` / `owner_drawing` 股东往来

记银行流水时「科目」是按这四类分组的下拉框。

---

## 4. 利润表 P&L

API `GET /api/admin/finance/pl?from=&to=`。规则:

- **现金制**:按 `txn_date` 落在区间内的银行流水。
- **不含 GST**:每笔取净额 `net = amount_aud − gst_aud`。
- **方向修正**:收入类按"进账为正",成本/费用类按"出账为正"(退款自动反向)。
- **section=other 的全部排除**(期初余额/转账/缴税/股东往来不进利润表)。
- 输出:收入合计 → 减 COGS = **毛利**;毛利 − 管理费 = **净利**;并按业务线拆。
- 期间:默认**澳洲财年**(7/1–6/30);页面可一键「本季度 / 本财年」或自定义日期。到 7/1 自动跳新财年,旧账不掺入。

---

## 5. 货代分摊算法(核心)

记一笔付款时,选中若干未付账单,填**当天汇率 fx** + **手续费 fee**:

1. 每张账单:`amountAud = round(amount_rmb × fx, 2)`
2. `billsAud = Σ amountAud`
3. 手续费按 AUD 占比**分摊**:前 n−1 张 `feeShare = round(fee × amountAud / billsAud, 2)`,最后一张拿余数(保证合计精确等于 fee)
4. 该订单真实运费 `total = amountAud + feeShare` → 写回 `sourcing_orders.actual_freight_aud`(同一订单多张则累加),并写 `forwarder_invoice_number` + 事件 `freight_reconciled`
5. 生成**一笔银行出账** `total_aud = billsAud + fee`,科目 `cogs_intl_freight`,业务线 `sourcing`

**例**:¥3000 / ¥4500 / ¥2500 @ 0.213,手续费 $20
→ 639.00 / 958.50 / 532.50(billsAud = 2130.00)
→ 手续费分摊 6.00 / 9.00 / 5.00(余数落最后一张)
→ 各单真实运费 645.00 / 967.50 / 537.50
→ 银行实付 **$2,150.00**

---

## 6. 文件清单

| 类型 | 路径 |
|---|---|
| SQL | `outputs/finance/finance_schema_CREATE.sql`(先跑 `outputs/sourcing_orders/sourcing_orders_schema_CREATE.sql`) |
| 科目表 | `lib/financeAccounts.js` |
| API · 银行 | `app/api/admin/finance/bank/route.js` |
| API · 货代 | `app/api/admin/finance/forwarder/route.js` |
| API · 利润表 | `app/api/admin/finance/pl/route.js` |
| 页面 | `app/admin/finance/page.js`(标签:银行流水 / 货代付款 / 利润表) |
| 号码分配(共用) | `lib/docNumbers.js` |

---

## 7. 部署步骤

1. Supabase 先跑 `sourcing_orders_schema_CREATE.sql`,**再**跑 `finance_schema_CREATE.sql`(后者外键依赖前者)。两者皆 `create table if not exists`,只增表、不动旧数据。
2. 部署代码(新分支 PR):
   ```
   git add -u
   git add lib/docNumbers.js lib/factoryPoDocPdf.js lib/financeAccounts.js \
           app/api/admin/sourcing/orders app/admin/sourcing/orders \
           app/api/admin/finance app/admin/finance
   git commit -m "Finance v1: bank ledger + forwarder allocation + chart of accounts + P&L"
   git checkout -b feat/sourcing-orders-finance
   git push -u origin feat/sourcing-orders-finance
   ```

---

## 8. 上线计划(2026-07-01)

- 记**一笔**「期初余额」:方向进账 · 科目 `opening_balance` · 金额 = 当天银行实际余额 · 日期 2026-07-01。
  (只进银行余额,不进利润表 —— 它是本金不是收入。)
- 之后每笔进/出都记;货代一付多单用分摊工具。
- 旧财年不碰系统,交会计。

---

## 9. 待办 / 开放问题

- [x] **Invoices「Record payment」→ 自动银行进账**(已建,2026-06):`/api/admin/invoices` 记一笔收款时,自动往 `bank_transactions` 写一笔进账(科目 `sales_local`,GST = 金额/11,linked_type=order)。非致命:finance 表没建好也不影响收款。导航:Finance 域下新增「记账 / 利润表」标签 → `/admin/finance`。
      待办延伸:Sourcing 客户收款也接同样的钩子(目前只接了本地 Invoices);收款被改/删时银行行不会自动回滚(v1 可接受)。
- [ ] 银行流水 **CSV 导入**(网银对账单)。
- [ ] **工厂货款(RMB 定金/尾款)** 是否也做成 bills→payment 分摊流程(目前先按一笔银行出账 `cogs_goods` 手记)。
- [ ] 手续费 GST:确认货代/支付手续费是否含 GST(`handling_fee_gst_aud` 已留字段)。
- [ ] BAS 季度报:目前顶部有 GST 销项/进项/净额,后续可出一张季度 BAS 汇总页。
- [ ] 银行对账(reconcile)对账单逐笔打勾的 UI(字段 `reconciled` 已留)。
- [ ] 全部为**盲建未实跑**,上线后逐项验证(第一笔货代付款的分摊数字重点核对)。

---

_最后更新:2026-06-26_
