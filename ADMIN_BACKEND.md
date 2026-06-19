# 后台 Admin / Sourcing backend — 状态(从分支考古,2026-06-18)

> 原 chat 已丢。本文件从分支 `chore/admin-backend` 的提交/文件重建。**带"❓待确认"的是丢失的决策/计划,需 Lily 补。**
> 汇报惯例:在这条线有进展,先更新本文件,再把一行摘要汇到 `NOW.md`。

## 分支
- `chore/admin-backend`(= 本地当前工作分支;领先 main 2 个 commit + **本地有未提交改动**)。

## 这是什么
采购 / sourcing 后台:成本核算、订单、报价、定制下单、落地成本、下单到出货流程。

## 已建(从提交/文件可见)
- **页面**:`app/admin/sourcing/costing/page.js`(成本核算,~1451 行)、`app/admin/sourcing/made-to-order/page.js`。
- **API**:`app/api/admin/orders`、`/quotes`、`/sourcing/cost-sheets`、`/sourcing/products`、`/sourcing/requests`。
- **逻辑/鉴权**:`lib/sourcingCosting.js`(~397 行)、`lib/adminAuth.js`(加 `getAdminUser`)。
- **SQL schema(在 outputs/,❓是否已 apply 到生产库待确认)**:`order_to_dispatch_schema_CREATE.sql`、`sourcing_products_master_CREATE.sql`、`sourcing_landed_cost_schema_CREATE.sql`。
- 提交:`feat(admin): sourcing costing / orders / quotes backend`、`fix(admin): getAdminUser export`。

## 状态
🔧 进行中:功能分支已有实质代码 + 本地未提交。**❓完成度、还差什么、是否上线 待确认。**

## 排期里的位置
**第 2 步(站稳之后)**:后台要在**上新供应商货之前**完成 + 合并——它是管理/导入/QA 新货的工具。

## ❓待 Lily 补
- 这个后台还差哪些功能才算 v1 完成?
- 那 3 个 SQL schema 应用到生产库了吗?
- 本地未提交的改动是什么、要不要先提交?
- 上线计划(走标准 PR 流程)。

---

## 开工 Brief（给 Admin worker chat · 总控写于 2026-06-18）

### 现有后台地图（`app/admin/`,先看别急着改）
- `products/`(481 行)—— 产品管理:Classification / Content / **SEO** tab(`meta_title` 60 / `meta_description` 160 / `seo_description` / `alt_text`,**已接线上产品页**)+ Published 开关。
- `orders/` · `quotes/` · `sourcing/` · `artworks/` · `login/` + `mfa-setup/`(鉴权)。
- 入口 `page.js` + `layout.js`。

### 0. 顺序(别乱)
1. 读 `START_HERE.md`(工作流铁律 + 分支登记 + 角色分工)→ `NOW.md`(A 段第 5 行 Admin、B 段排期、C2 技术债 P2)→ 本文件。
2. **先摸清现有后台能力**(尤其 `products/` 那套 + SEO tab),再规划改造。
3. ⚠️ **第一件正经事 = 安全处理本地未提交的 admin WIP**(NOW.md C2「P2」):本地 `promohub` 卡在 `chore/admin-backend` + 有**未提交**后台 WIP(来自丢失的旧 chat),**git index 损坏**。**先把 WIP 安全 commit/push 到 `chore/admin-backend`(别丢一行),以它为干净基线**,再动新功能。这步没做好后面全在沙上盖楼。

### 1. 这条线要解决的(逐项和 Lily 确认 scope,一次一件)
- **SEO 后台升级 #17**:加 `seo_status`(auto / reviewed / needs-review)+ 产品列表可筛"待人工" + 批量 + (后)AI 辅助生成。详 `SEO_HANDOFF.md`。
- **现有产品"到位"管理**:一个 completeness 视图,显示每产品 `colour_slugs / material / price / image / category / min_qty / seo` 是否齐 —— 驱动 Lily「现有到位 → 再导 GFL」策略(NOW.md B 段)。
- **库存准确性**:加 stock freshness / confidence 字段(`STOCK_ACCURACY.md` Now #4);供应商库存 snapshot 是后期。
- **采购 / sourcing 后台**:看 `sourcing/` 现有到哪、补齐。
- GFL 导入工具 = **相关但单独的线**,别在这条里顺手做。

### 2. 铁律(重点重复)
- **别丢 WIP**;fresh clone → 分支 → preview → 验收 → **merge 前经总控把关**。
- 一次只推进一件;改完回写 `NOW.md`。
- ⚠️ **别改线上在用的 SEO 列名**(`meta_title / meta_description / seo_description / alt_text` 产品页正在读,改名/删字段会断线上)。

### 3. 交回总控
每做完一项,把 **PR diff / preview / 截图** 带回总控 chat,照该项验收清单把关,给"可合 / 要改"。

### 分支约定:每个改造一条分支（Lily 定 2026-06-18）
**每个改造单独开分支、单独 PR、单独 preview + 总控把关 + merge** —— 不堆一个大 admin 分支。命名 `admin-<feature>`:
- `admin-seo-status` —— `seo_status` 字段 + 产品列表筛"待人工"
- `admin-completeness` —— 产品"到位"视图(colour/material/price/image/category/min_qty/seo 齐不齐)
- `admin-quote` —— quotes 改造
- `admin-artwork` —— artworks 改造
- `admin-stock` —— stock freshness / confidence 字段
- `admin-sourcing` —— 采购/sourcing 后台
> ⚠️ 例外:现有**未提交 WIP** 先 commit/push 到 `chore/admin-backend` 保命;之后从 **main** 拉干净的 `admin-<feature>` 分支做新功能,**一次一条线**。
