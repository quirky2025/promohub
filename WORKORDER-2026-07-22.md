# 工单 — 交给另一个 chat 执行(2026-07-22)

来自 Lily(QuirkyPromo)。三个任务,**先读根目录 `HANDOVER.md` 和 `HANDOVER-CATEGORIES.md` 的协作规则再动手。**

## 铁律(违反会被打回)
1. 动 UI 前先确认放在**哪个页面**,不要新建重复页面。
2. 写库一律走 **service-key API 路由**(`lib/sourcingDb.js` 的 `sourcingDb()`),客户端直接 `supabase.update()` 会被 RLS 静默吞掉。
3. 失败要 `alert()` 把错误抛给用户看,不要静默。
4. 后台文字**黑色 `#000`**,不要灰/金正文。后台英文为主,Sourcing 页中文可以。
5. 客户面向邮件/文档一律**英文**。
6. 每个实体都要有**编辑**能力。
7. 改完跑 esbuild 语法校验;需要她跑的 SQL **直接贴在聊天里**(她不翻 `db/` 文件夹)。
8. 不要假设她没 push —— 她的代码一般都已经 push。

---

## 任务 A(高优先,但先确认归属)—— PO 分行录入,和供应商发票一致

### 背景
Ian 那单改了印刷方式 + 加了一个收货地址,后台 PO 和客户 INVOICE 对不上。Lily 要求后台 PO 能像供应商发票一样**分行录入**:未印刷单价、印刷费、Setup charge、运费,合计 = PO 总额,和供应商发票一分不差。

> ⚠️ **动手前先问 Lily:这块是不是归你做?** 她说过"另外一个 chat 也在做,不要乱了"。别和另一个 chat 同时改同一批文件撞车。确认归你了再往下。

### 概念(已跟 Lily 讲清,别改这个逻辑)
PO(付供应商成本)和客户 INVOICE(收客户售价)本来就不同,差额=利润。要一致的是 **PO ↔ 供应商发票**。改 PO 只让账变准,不改变盈亏。

### 现状
- `purchase_orders.items` 是 **jsonb**,已能存多行:每行 `{stockCode, name, qty, unitCost, branding}`。
- PDF 生成器 `lib/poDocPdf.js`(`generatePurchaseOrderPDF`)**已经**逐行打印 + 单独一行 freight。数据层不用改。
- 缺口在 UI:`components/ProductSupplierPO.jsx` 的面板只有**一个「成本」总额框**(约第 116 行),不能分行。

### 要做
1. 把 `ProductSupplierPO.jsx` 的录入表单改成**可加多行成本行**,每行:名称/说明、数量、单价(ex GST)。至少支持这三类行:①产品未印刷(单价×数量)②印刷费 ③Setup charge;外加一个 freight 字段(已有)。
2. 保存时把这些行写进 `items`(沿用 `{name, qty, unitCost, stockCode?, branding?}` 结构),`costSubtotal` = 各行 `qty*unitCost` 之和,`freightCost` = 运费。POST/PATCH 路由 `app/api/admin/purchase-orders/route.js` 已按 `costSubtotal + freightCost` 算 `cost_total`,**不用改路由**。
3. 面板里成本展示、"标已付"金额现在用 `cost_total * 1.1`(GST-inclusive)。分行后合计口径保持含 GST 一致。
4. 每行可增删可编辑。
5. 验证:录入的行加起来 = PO 总额;点「✉ 发」生成的 PDF 每行都对得上供应商发票。

### 不要碰
- 不要改客户 INVOICE 的定价逻辑。
- 不要新建页面 —— 就在这个现有面板里。

---

## 任务 B —— 修 NOTIFY DELIVERED 不自动变 Delivered

### 现象
Lily 点了 NOTIFY DELIVERED,"上面 DELIVERED 好像不会自动"变。

### 先复现,别盲改
- 相关代码在 `app/admin/orders/page.js` 的 `notifyShipment()`,结尾应有:
  `await setItemStatus(index, delivered ? 'delivered' : 'dispatched');`
- 先确认 Lily 说的"上面"是哪个:
  - **整单状态**没变 → 可能是设计(整单需所有产品都 delivered 才翻),先跟她确认这是不是预期。
  - **那个产品自己的 stage** 也没变 → 这才是 bug。
- 若是 bug,查:`notifyShipment` 是否真的执行到 `setItemStatus` 那行;`setItemStatus` 是否走 service-key 路由写库、有没有报错;写的字段名/表是否存在。修完让 delivered 后**那个产品**自动显示 Delivered 并带日期。

---

## 任务 C —— 按产品发「Review 邀请」邮件(新功能)

### 需求
某个产品**交付后**,针对那个产品给客户发一封邀评邮件(不是整单一封)。

> ⚠️ **动手前先问 Lily:评价要收在哪?** 站内自己的评价墙(reviews/testimonials 表),还是引导客户去 Google 留评?这决定了模板里放什么链接、以及要不要建收集表/表结构。

### 要做(等她答复评价去向后)
1. 邮件模板:用 `lib/emailLayout.js` 的 `quirkyEmail()` 包壳,**英文**,客户面向。内容点名**具体产品**。
2. 后台每个产品行加一个「发送 Review 邀请」按钮,**delivered 之后才亮**(和任务 B 的 stage 联动)。位置:先跟 Lily 确认放订单详情的哪个产品区块。
3. 发送走 Resend(参考 `app/api/admin/purchase-orders/route.js` 里 `resend.emails.send(...)` 的写法)。
4. 记录已发送时间/状态,避免重复发;支持重发(编辑能力)。
5. 若走站内评价墙,需新表 + SQL(直接贴给 Lily 跑)。

---

## 交付前自检
- [ ] 每个改动都在确认过的页面里,没新建重复页面。
- [ ] 写库走 service-key 路由,失败有 alert。
- [ ] 新按钮/实体有编辑能力。
- [ ] esbuild 语法校验通过。
- [ ] 需要跑的 SQL 已直接贴在聊天里给 Lily。
- [ ] 改了哪些文件,列清单给 Lily,好让审核那边逐个核对。
