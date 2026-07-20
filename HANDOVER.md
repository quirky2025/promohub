# HANDOVER — QuirkyPromo promohub(交接给新的对话)

> 用途:上一个对话太长了。把这份给新对话看,它就能直接接手,不用从头问。
> 详细的历史流水账在 **`WORKLOG.md`**(同一目录),需要背景就去翻。

---

## 1. 我是谁 / 怎么协作

- 用户:**Lily Zhu**(lily.zhu@quirkypromo.com.au),QuirkyPromo 创始人,**非技术**。
- 分工:**你(AI)改文件**;**她自己**在 Windows CMD 跑 git(push / merge to main,Vercel 自动部署),并在 **Supabase → SQL Editor** 手动跑 SQL。
- 她的项目目录:`C:\Users\jilin\Desktop\promohub`
- 她**不会**自己去翻代码/输网址找页面 —— 要给她**点哪里**的具体路径(左侧栏 → 哪个标签)。
- 沟通用**中文**;客户看到的文案必须**英文**。

### ⚠️ 协作铁律(她明确提过,别犯)
1. **加任何界面前,先问清楚"放在哪个页面、哪一块"**,确认了再动手。她因为反工发过火:"下次一定要问清楚在哪里,不要老是反工"。
2. **要统一,不要各做一套**。同一件事只有一份数据,多个地方是"同一记录的不同窗口"。
3. 大改动**先讨论确认再开工**(她说过"今天全部讨论好了确认了再动手")。
4. **STANDING RULE:每个实体都要有完整 CRUD,尤其 EDIT**。别只做"删除"。
5. **密钥永远不要贴给 AI**(Brevo/R2/Resend 等她自己在 Vercel 设)。
6. **能让她自己操作的,就不要写死在代码里。** 凡是她会经常改的内容(首页展示哪些产品、文案、开关、价格档…),都应该做成**后台勾一下/填一下**就生效,而不是每次找 AI 改代码。
   - 已完成的范例:首页 "New arrivals" 原本写死 4 个 slug,已改成自动读后台 Products 里的 **✨ New Arrival** 勾选(`is_new_arrival` + `is_published`,按时间取最新 4 个)。她勾一下首页就换。
   - 以后做新功能时先问自己:**这个她将来会想改吗?会 → 给她一个后台开关/字段。**

---

## 2. 技术栈 & 必知的坑

- **Next.js 16 (app router) + Supabase + Vercel + Resend(邮件) + Cloudflare R2(文件)**
- 服务端 DB:`lib/sourcingDb.js` 的 `sourcingDb()`(**service key**,绕过 RLS)
- 鉴权:`lib/adminAuth.js` → `getAdminUser` / `isAdmin` / `unauthorized`
- 邮件模板:`lib/emailLayout.js` → `quirkyEmail(bodyHtml)`
- 价格常量:**`lib/pricing.js`(唯一来源)** — `SHIPPING = 25`(每产品每地址)、`GST = 0.10`、`SETUP_FEE = 60`、`tierMargin(i)`

### 坑 1:FUSE 挂载会读到旧/截断的文件
`bash` / `esbuild` 有时读到**过期或被截断**的文件,报出假的语法错误(如 "Expected > but found end of file")。
→ **Read/Write/Edit 工具是 Windows 权威版本(= git = Vercel 实际构建的)**。用 Read 工具核对结构即可,别信 bash 的假报错。全新建的文件 esbuild 一般正常。

### 坑 2:前端直接写数据库会被 RLS 悄悄吃掉
`supabase.from('orders').update(...)` 在客户端**可能静默失败**(UI 变了、刷新回原样)。
→ **一律走服务端路由**(service key),并且**失败要弹错误**。订单页已有 `persistOrderField()` 走 `/api/admin/orders/update`。

### 坑 3:她常常 merge 了代码但忘了跑 SQL
→ 每次交付**把要跑的 SQL 用醒目方式列出来**,并提醒"没跑会报 could not find column"。

### 坑 4:文字颜色
后台文字一律 **黑色 #000**,不要灰色/金色文字。NAVY `#1B2A4A`、GOLD `#C9A96E` 只用于背景/边框/按钮。

---

## 3. 已确定的架构(别推翻,已达成共识)

- **所有客户订单**都在 `/admin/orders`,中国单打 **INDENT** 标签(`order_type='indent'`)。
- **Sourcing = 采购后台**:工厂管理 / 货代管理 / 产品库(factory_quotes + quote_tiers)/ 计价 / 工厂下单。
- **PO 模型**:本地 → `purchase_orders`;中国工厂 → `factory_pos`。
  两者**都显示在 Production 那一张表**里(中国的标 INDENT、显示 ¥)。
- **供应商发票 / 付款以 PO 为家**。订单页每产品的 PO 块 和 Production 表 是**同一条记录的两个窗口**,不复制不同步。
- **每个产品**各自有:artwork 批准、运费(可多包裹多地址)、文档、供应商 PO、阶段 + 阶段日期。
- **闸门**:进生产需 artwork 批准 + 收款;可用 **「无需印刷」**(`artwork_required=false`)和 **「月结·先做后付」**(`pay_on_account=true`)两个**每单开关**绕过(Lily 要 flexibility,不是全局政策)。
- **运费模型**:**$25 × 产品数 × 收货地址数**,`pricing.js` 是唯一来源。
- **中国单成本**:简化过 —— 工厂 PO 记 ¥ 金额,成本(¥→A$)写订单 Internal Notes;**"欠爸爸"总账已被砍掉**(她嫌复杂),别再加回来。

---

## 4. ✅ 原本的两个任务 —— 都已收口,不用做了

> **2026-07-18 更新:两件都结了。新对话不要再动这两块。**
>
> **任务 A(运费 $25)= 已完成并线上验收通过。** Lily 在线上结账页确认:3 个产品 = **Shipping $75.00**(3 × $25),底部文案 "$25 per item, per domestic address"。全部代码**早已 push + merge + 部署**。`lib/cart.js` 也已改成引用 `pricing.js`。全库无其它硬编码 $30。**此事已了。**
>
> **任务 B(公开购物车每产品填地址)= 取消,不做。** Lily 决定:**多地址让客户写在结账页的备注里就行,不要做复杂功能。** 而且 `app/place-order/page.js`(第 536–537 行)**已经有 Notes 备注框**,提示语就是 "e.g. ship to multiple addresses, special requirements…" —— 现成可用,零改动。
>
> 运费金额在所有情况下本来就正确:3 产品同一地址 = $75;3 产品三个地址 = $75;同一产品送两地址 = 客户加两行 = 2 × $25。**钱一直是对的**,缺的只是"每产品送哪"的记录,而这个用备注解决。

---

## 4b. (历史存档)原任务描述

### 任务 A:运费 $30 → $25 全链路核对(她说线上购物车行为仍不对)
她的原话要求:
> ① 最新代码是否已部署到生产;② 全库 grep 硬编码的 30(重点:PDP 价格汇总组件、"$30 Flat Shipping" USP 图标条、checkout 页、quote/发票模板),全部改为引用 pricing.js;③ 部署后跑验收:**2 产品 1 地址 = $50 运费,单产品 = $25**。

**上一个对话已经做过的**:
- 已修 `lib/cart.js`:原本硬写 `SHIPPING = 30`(还重复定义 MARGIN/GST/SETUP_FEE),**已改成 `import { SHIPPING, GST } from './pricing'`**,`calcGrand` 每产品 $25。**这个改动可能还没 push**。
- 已全库 grep:`app/ components/ lib/` 里**没有其它**硬编码的 $30 运费(只剩 costing 页一个 `y -= 30` 是 PDF 排版,无关)。
- 已确认这些**早就是 $25** 了:`app/cart/page.js`(`SHIPPING × cart.length`,引用 pricing.js)、`app/place-order/page.js`、`app/faq/faqData.js`(#12 等)、`app/products/[slug]/ProductClient.jsx` 与 `ASColourClient.jsx`(USP 图标条已是 "$25 / item Shipping · Per domestic address")、`app/sales-terms/page.js`。订单 PDF/发票用订单里存的 `shipping` 值,无硬编码。`/refund-return` 不写具体金额。

**→ 所以最可能的原因是「代码没部署上去」**。请先:
1. 确认 `lib/cart.js` 的修改**已 commit + push + merge 到 main**,且 **Vercel 最新一次 deploy 成功**。
2. 再用**无痕窗口**打开线上购物车验收(避免 localStorage 里旧的 `grand` 缓存干扰 —— 注意:购物车存在 **localStorage**,老数据里可能带着按 $30 算的 `grand`,必要时让她清空购物车重加)。
3. 验收:1 产品 = $25;2 产品(同一地址)= $50。

### 任务 B:公开购物车支持"一个产品一个地址一个运费"(她说「现在改」)
现状:**公开购物车/结账是单收货地址**(运费 = 产品数 × $25,一个地址)。多地址目前只在**后台订单级**用每产品多包裹实现。
她要求:公开结账也要 **一个产品 → 一个地址 → 一个 $25**。

**未定的设计问题(她说"讨论"、还没拍板)**:
1. 收货地址在哪一步填?(A) **结账页**每个产品下面填 / (B) **购物车页**每一行就填
2. 同一产品要送两个地址?(A) **加两行**(各自数量/地址)= 2×$25 / (B) 一行内拆多地址+分配数量

**上一个对话给的建议(她还没最终确认)**:选 **A + A** —— 地址放结账页(购物车保持简单),拆地址用"加两行"(和现有购物车结构天生吻合,运费 = 行数 × $25,做得快)。

**实现要点(定了之后)**:每个购物车行带一个 `deliverTo` 地址 → 下单时写进 `items[i]`(后台每产品运费那块已经有 `deliverTo` 的概念)→ 运费 = 行数 × `SHIPPING`。数学其实**现在就是对的**,缺的是"每行填地址 + 传到订单"。

---

## 5. ⚠️ 她需要在 Supabase 跑的 SQL(可能有没跑的,一律 if not exists,重复跑无害)

订单字段(合成一段跑最省事):
```sql
alter table public.orders
  add column if not exists artwork_required        boolean default true,
  add column if not exists pay_on_account          boolean default false,
  add column if not exists required_date           date,
  add column if not exists estimated_dispatch_date date,
  add column if not exists artwork_sent_at         timestamptz,
  add column if not exists delivered_at            timestamptz,
  add column if not exists delivery_addresses      jsonb,
  add column if not exists order_type              text default 'local',
  add column if not exists sourcing_quote_ref      text;
```
其它文件(在 `db/` 目录,按顺序):
- `db/sourcing_factory_po.sql`(建 factory_pos 等 3 表)→ **然后** `db/factory_pos_spec.sql`(顺序不能反)
- `db/product_cost_records.sql`(产品报价记录)
- `db/purchase_orders_item_index.sql`(purchase_orders += order_item_index,每产品 PO 用)
- `db/forwarders.sql`(货代表 + 已 seed 一家:Zhejiang Bing Supply Chain / Bank of China Yiwu / SWIFT BKCHCNBJ92H / AUD 354577334824)
- `db/sourcing_product_details.sql`(factory_quotes 尺寸/材质/工艺)
- `db/sourcing_indent_quote.sql`(quotes += quote_type/sourcing_product_id/unit_price)

数据修正(一次性,可能已跑):
- 删 OC260707 重复的 credit_note 银行流水(只留 1 条)
- 把 PO273004 / PO273005 的银行支出改成含 GST
- Make Badges PO273002 手动补一笔银行支出 $117.92(含 GST)

---

## 6. 队列里还没做的

- **供应商付款字段**:`suppliers` 主数据加银行/账号/付款方式(像 `forwarders` 那样)。她点头了但还没开工。
- **Dashboard「⚠️ 交货提醒」**:首页列出快到期/逾期的订单(配合订单顶部的"预计发货日期")。设计已定,未做。
- 大视频直传(工厂视频 >4.5MB 走服务器会失败)+ 视频内联播放 —— 提过,未做。
- 自动发 INDENT 报价邮件(不带 PDF)+ 客户在线点 PROCEED —— 设计聊过,未做。
- 计价页"一键存到产品报价记录"的连接 —— 故意没做(计价页的产品身份和产品库不一定是同一条,怕对错)。

---

## 7. 交接时怎么开场

建议新对话第一步:
1. 读 `HANDOVER.md`(本文件)+ `WORKLOG.md` 最上面几条。
2. **第 4 节那两个任务已经结了,别再做**(运费已验收 $75 正确;多地址用备注解决)。
3. 直接问她现在要做什么;第 6 节是排队但没开工的候选(供应商付款字段 / Dashboard 交货提醒 等)。
4. 每次交付都要给她:**要跑的 SQL** + **git add/commit/push 的具体命令**(她照抄执行)。
5. **不要假设"你可能还没 push"** —— 她一直都很及时地 push/merge。要确认就直接问一句,或看代码,别猜。
