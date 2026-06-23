# 交接 / 日志 — ORDERS 客户端线(2026-06-21)

> 本文件在 `orders-clean` 分支(从最新 main 拉)。NOW.md 在 `chore/admin-backend` 分支上,本条以后可并回 NOW.md。

## 当前分支与状态
- **弃用旧分支做部署源**:`chore/admin-backend` 落后 origin/main **110 个 commit**(前端/价格都是旧的)。
- 订单线在**新分支 `orders-clean`(从 origin/main)**重做,只放订单相关文件。
- **今日代码已在 `orders-clean` 工作区,⚠️ 待:** `npm run build` 绿 → 提交下面 6 个文件 → push → GitHub `orders-clean → main` 开 PR 合并上线。**尚未合并。**

## 今日完成(6 个文件)
`lib/orderDocPdf.js`(新)、`lib/emailLayout.js`(新)、`app/api/order/route.js`、`app/api/artwork/request-logo/route.js`、`app/api/artwork/upload/route.js`、`app/order-confirmation/page.js`

提交命令(只加这 6 个,别用 add -A):
```
git add lib/orderDocPdf.js lib/emailLayout.js app/api/order/route.js app/api/artwork/request-logo/route.js app/api/artwork/upload/route.js app/order-confirmation/page.js
git commit -m "Orders: OC+Tax Invoice two docs, Inv#, AMOUNT DUE stock reminder, black text, text-wordmark email signature"
git push origin orders-clean
```

内容要点:
- 一单**两份 PDF**:Order Confirmation + Tax Invoice,一封邮件两附件。
- 单据:抬头 Inv #: / Order #: / Order Date: / Page:(Inv# 仅发票);Tax Invoice 盖 **PAID** 或 **AMOUNT DUE: $X** + "Stock subject to availability — pay promptly to lock in stock & price";How to Pay 银行框(无底纹金边);**浅底字全纯黑**;NOTE → "Good to know" 两行;TOTAL 下拉留白;千分位;lead time **5–7 business days**。
- 邮件:主题 **"Order Confirmation & Tax Invoice — PO#"**;签名**文字版 logo "QuirkyPromo"**(金 Quirky+蓝 Promo,不用图片);Tel/Email/Web/ABN。
- 订单正确入库:status=confirmed + order_number + total_net/gst_total/total_gross(带缺列 fallback)。
- 落地页文案 + **Continue Shopping → /promotional-products**。
- 决策:永远出 Tax Invoice(同时发 Order Confirmation);银行户名 Grow Your Marketing。

## 环境坑(重要)
这个挂载**偶发写截断 / 塞 `\0`** → build 报 Unexpected end of input / Unterminated template / `\0`。`node --check`、`tail` 读旧缓存不可靠,**真正判官是 `npm run build`**。改完每个文件核字节数 + 看结尾,坏了从 /tmp 干净副本重写。

## Logo 文件(public/)
- `quirky-logo-light.png` = 深字(白底/邮件白底/PDF 白底用)
- `quirky-logo-quote.png` = 白字(深/navy 底用)
- 1400×256 透明 PNG;上线后 `https://www.quirkypromo.com.au/quirky-logo-light.png` 等。

## 客户上传的 logo 去哪了
`/upload/[token]` → 传 **Cloudinary** → 网址存 `artworks.logo_url`(status logo_received)→ 后台 **`/admin/artworks`** 看(service-role,已在 prod)。

## 📌 明日清单
1. **首页 LOGO**:`components/Nav.jsx` ~第500行现为**文字** `QUIRKY`+金`PROMO` → 换**礼盒图 logo**(`/quirky-logo-quote.png` 白版,配 navy 顶栏)。
2. **后台 ORDERS 看得到**:`app/admin/orders/page.js` 用 **anon** 读被 **RLS** 挡 → 改 **service-role API**(仿 `app/api/admin/artworks/route.js`)。+ **#23** Quote→Order 转单 + 手动 New Order。
3. **ARTWORK**:`/admin/artworks` 把 logo→mockup→审批 流程理顺/完善。

## 规矩(新立)
- 开新分支前先 `git checkout main && git pull`(从最新 main 起)。
- push/合并前先本机 `npm run build` 绿。

---

## 🎯 方向决策(2026-06-21 晚)— 客户 ACCOUNT 门户:订单 + Artwork 审批 + 记录

**参照 Trends 的 Order Approval 门户**(供应商给我们的范本):左 proof + 右订单信息 + Zoom/Save + 批准。Lily 定:**我们也要把这套放到客户自己的 `/account` 里**,作为客户登录后的**订单记录 + 在线审批**入口。

**为什么顺:**
- `/account` B2B 门户已建(公司/联系人/地址)。
- `orders`/`artworks`/`artwork_proofs` 已有 **RLS**:"authenticated 用户按 jwt email 只读自己的行" → **登录客户能安全读自己的订单/稿**(同一条 RLS 之前挡了后台 anon,但正好服务于客户自助)。

**客户 `/account` 要加(规划):**
- **My Orders**:列出本公司订单(状态、Order Confirmation/Tax Invoice PDF 下载、付款状态 PAID/AMOUNT DUE)。
- **每个订单的 Artwork**:显示 proof 图(产品线稿 + 红框印刷区 + 尺寸)、**Approve / Request Changes**(在线审批,落库 + 通知)。
- **记录/Timeline**:logo 上传、proof 发送、审批、付款、生产、发货历史。
- 与现有 `/artwork/[token]` 邮件链接并存:token = 游客/快速;account = 登录客户的长期记录。

**Mockup 出图(关键钥匙):** Trends 提供**每个产品的模板**(线稿 + 已标红框印刷区 + 尺寸)→ 把客户 logo 拖进框(Canva/Photopea,或以后后台自动叠)→ 即 proof。文案可抄:"Branding area can be moved within the red line"、尺寸标注、PMS 免责声明。

**待 Lily:** 确认能否从 Trends 下载产品模板;确认 `/account` 审批页是否照 Trends 布局(左 proof + 右订单 + 批准)。

---

## 🖊️ Artwork 审批政策(2026-06-21 定)
- **客户批准的是 QuirkyPromo 自己做的 proof**(用 Trends 模板:对的颜色/尺寸/印刷区)。
- 该 proof 给 Trends 后:
  - **Trends 退回无改动(最终=我们的)→ 原批准有效,直接进生产,不再二次审批。**
  - **Trends 有改动 → 把改后的最终稿再发客户审批一次,通过才生产。**
- 前提:proof 做准(照模板),Trends 一般不改 → **全程通常只批一次**。
- 门槛不变:**收款 + Artwork Approved → 生产**。
- 系统体现:proof 做准时,客户批的那张就是 final;若有 Trends 改动版,则在该订单下新增一版 proof 再审批(版本号递增)。

---

## 🤖 自动叠图 POC(2026-06-21 晚)— 已验证可行

用 Lily 上传的 `128027_Branding Template_1.pdf` 跑通了自动 mockup:
- **从模板 PDF 自动抓印刷框**:`get_drawings()` 找到白色虚线矩形 = (x181.5, y320.1, w99.2, h141.7)pt = **正好 35×50mm**。
- **自动叠图**(Python PIL):logo 缩放到框内 88%、居中、alpha 合成。
- **产品改色**(numpy):蓝色像素 mask → 重映射到目标色(黑/白),保留亮度阴影。蓝→黑效果≈Trends 真实 proof;蓝→白做成浅灰才可见(纯白产品需描边特殊处理)。
- **logo 配色自动**:深产品用白 logo(quirky-logo-quote)、浅产品用深 logo(quirky-logo-light)。
- 产物:`outputs/auto_mockup_demo.png`(蓝)、`mockup_black.png`、`mockup_white.png`。

**正式做(ARTWORK 主线)要建:**
1. `product_templates` 表/配置:产品 + 印刷框(x,y,w,h pt)+ 尺寸mm + 印刷方式 + 每色底图(或改色规则)。设置半自动:上传 Trends 模板 PDF → 自动识别框 → 存。
2. 生成器 API:输入(模板 + 客户 logo + 颜色)→ 合成 proof(PNG/PDF),自动加尺寸标注/免责声明。
3. 接 `/admin/artworks`(一键出 proof)+ 客户 `/account`(看 + Approve/Request Changes)。
4. 颜色:优先每色一张 Trends 模板;白色产品加描边。

**待 Lily 提供:** 常卖产品的 Trends 模板 PDF(每色一份,至少黑),用来自动抓框 + 当底图。Illustrator 在买(手动出图 + 处理客户 AI/颜色)。

---

## 🔁 单据流程改版(2026-06-21 晚,**覆盖前面"下单就发两份"的决定**)
Lily 定:一开始就发 Tax Invoice 感觉不好。新流程:
1. **下单 → 只发 Order Confirmation**(确认单,非税务凭证,不触发 GST)。OC 上注明 "Tax invoice will follow once your artwork is approved"。
2. **Artwork Approval**(客户审批 proof)。
3. **审批通过 → 自动发 Tax Invoice**(Pay Now→PAID 收据 / Pay Later→AMOUNT DUE 催款 + How to Pay)。
4. **门槛:收款 + Approved → 生产。**

**要改的(并入 ARTWORK 主线):**
- `app/api/order/route.js`:下单只生成 + 附 **Order Confirmation**(去掉 Tax Invoice 那份);邮件主题改回 "Order Confirmation — PO#";OC 文案加 "税务发票将在审批后发出"。
- **新触发**:artwork `approved` 事件 → 生成 Tax Invoice(复用 `lib/orderDocPdf.js` docType='TAX INVOICE')+ 邮件发客户。
- `lib/orderDocPdf.js` 已支持 docType,直接复用。
- 注:今天上线版仍是"下单两份",改版随 ARTWORK 线上线。

### 🔁 单据流程 — 按订单类型细化(2026-06-21 最终版)
| 订单类型 | 下单时 | Artwork 批准后 |
|---|---|---|
| **Checkout — Pay Now**(Stripe,已付) | **OC + Tax Invoice(PAID 收据)** | —(已开票) |
| **Place Order — Pay Later**(在线 EFT) | **只发 Order Confirmation** | **自动发 Tax Invoice(AMOUNT DUE + How to Pay)** |
| **线下/手动订单** | **只发 Order Confirmation** | **自动发 Tax Invoice(AMOUNT DUE)** |

- 门槛:**收款 + Artwork Approved → 生产**(两类都是)。
- 实现:`/api/order` 按 `paymentMethod` 分支——stripe→OC+TaxInvoice(paid);eft/手动→只 OC。artwork `approved` 事件→给未开票的单自动发 Tax Invoice(amount due)。

---

## 🔢 编号体系(2026-06-21 定)— 客户单 vs 供应商 PO 要分开!
| 单据 | 标签(客户看) | 例 | 给谁 |
|---|---|---|---|
| 报价单 | **Quote #** | Q260012 | 客户 |
| 订单确认 OC | **Order #** (+ Quote Ref 若来自报价) | Order #: PO260028 · Quote Ref: Q260012 | 客户 |
| 税务发票 | **Inv #** (+ Order #) | Inv #: INV260028 · Order #: PO260028 | 客户 |
| **给供应商的采购单** | **Supplier PO #**(独立编号) | Supplier PO #: SP260028 | **供应商 Trends / 内部,绝不上客户单** |

- **客户那条 = "Order #";给供应商那条 = "Supplier PO #",彻底分开不混。**
- 待 Lily 定:客户订单号是否**去掉 "PO" 字样**(改 `O260028`,把 PO 留给供应商),还是保留 `PO260028` 靠 "Supplier" 区分。
- 实现:OC 抬头 `Order #` + 可选 `Quote Ref`;Invoice 抬头 `Inv #` + `Order #`;`product_templates`/orders 与 supplier PO(将来 `supplier_pos`)各自编号。

### 抬头版式(最终,2026-06-21)— 共用核心号
**核心号** N(一个订单一个,例 260028),OC#/Order#/Inv# 全用它。
- **Order Confirmation 抬头**:`OC #: N` / `Order Date:` / `Page:` (+ `Quote Ref: Q…` 若来自报价)
- **Tax Invoice 抬头**:`Inv #: N` / `Order #: N` / `Order Date:` / `Page:` (+ `Quote Ref: Q…`)
- **Supplier PO #**:独立编号,只在供应商 PO + 后台,绝不上客户单。
- 待定:核心号是否去掉 "PO" 字样(建议核心号用纯数字/`O` 前缀,把 "PO" 留给供应商)。

---

## 🎨 Artwork Approval Proof 设计(2026-06-21 定)
**不沿用供应商整页;只抠"产品图+印刷框"那块,用我们自己的品牌版面重做。**

**QuirkyPromo Artwork Approval proof 版面(与 OC/Invoice 同风格):**
- **navy 抬头 + QuirkyPromo logo**;标题 **ARTWORK APPROVAL**;右侧 **Order #** / Date /(Quote Ref)。
- **中部 mockup**:产品(改成下单颜色)+ 客户 logo 自动叠进印刷框(POC 已验证)。
- **Product Details**:Stock Code、品名、颜色、数量。
- **Branding Details**:印刷方式、**Size(如 35×50mm)、Position、颜色数**。
- **免责声明**:"Branding area can be moved within the red line" + PMS 提示。
- **(线上 `/account` / token 页)Approve / Request Changes**。

**生成在哪 / 怎么操作:**
- 后台 `/admin/artworks`:选订单(带出产品/颜色/印刷)+ 客户 logo → 点 **Generate Proof**。
- 服务端两步:① 把 logo 缩放居中叠进产品印刷框(从 `product_templates` 取框坐标);② 把该 mockup 放进品牌版面 + 抬头/明细 → 出 proof PDF/PNG。
- 复用 `lib/orderDocPdf.js` 的 navy 抬头/版式风格(可抽出公共"品牌头"函数:OC / Invoice / Artwork Approval 共用)。

**实现拆解(ARTWORK 主线开工顺序):**
1. `product_templates`:上传 Trends 模板 PDF → 自动抓印刷框(get_drawings)→ 存(产品 + 框 x/y/w/h + 尺寸mm + 印刷方式 + 每色底图)。
2. mockup 合成器(logo→框,改色,配色 logo)。
3. **Artwork Approval proof 生成器**(品牌抬头 + mockup + 明细)。
4. `/admin/artworks`:Generate Proof 按钮 + 发送。
5. `/account` + token 页:看 proof + Approve/Request Changes(approved 事件 → 触发 Tax Invoice + 解锁生产门槛)。

### Artwork proof 必含文案(2026-06-21)
- 印刷区说明:**"Branding area can be moved anywhere within the red line."**
- 底部免责声明(用 Trends 原句):**"Please check this Artwork Approval carefully. Colours viewed on screen and paper do not accurately represent PMS colours."**
- (如适用)印刷过程提示:"As the printing process is done with the removal of the lid, exact alignment to the lid can't be guaranteed, and there will be variations in logo positioning between items."

### 🎨 Artwork Proof 版面 v2(2026-06-21,**覆盖前面半幅版**)— 参照 Promo Brands proof
Lily 要:**产品图占满整版(主角)**,抬头变小,明细挪到底部。
- **左上小徽标**:`ARTWORK APPROVAL | PROOF V1`(navy 小块,**带版本号 V1/V2…**,重出稿 +1)+ QuirkyPromo logo。
- **右上**:`Order #`(+ 品名、`Actual Print Size`、状态 NEW/UPDATED)。
- **中部**:**大图 mockup,满版宽**(产品改色 + logo 叠进印刷框 + 尺寸标注)。多件(如 notebook+pen)可并排。
- **底部信息带(分栏)**:Product Colour | Print Colour/s | Quantity;Print Method(勾选清单)| Colours Available(色块)。
- **Notes / Art Instructions**(黄框,可选,无则隐藏)。
- **最底**:Disclaimer(PMS 原句)+ Document Ref + Page。
- 版本号 V1/V2 对应"改稿新增一版重审"。

### Artwork Proof v2 — 明细带 & Disclaimer(2026-06-21 细化)
- **Print Colour/s**:显示颜色 + **PMS #**(例 `Black` / `PMS 432 C`)。
- **Print Method**:**不勾选/不列全部**——只输出**本单实际要求**的印刷方式,每个带尺寸。例:
  - `Digital Transfer (Front): 120 x 160 mm`
  - `Pad Print (Pen): 50 x 6 mm` 等(按订单实际)。
- **底部 Disclaimer notes(完整版,固定文案)**:
  > Colour proofs are to be used as a guide only. Line drawing is for approximate print positional guide only. Please familiarise yourself with the product prior to approving. It is not intended to be an exact scale or detailed representation. Small details or text, including ™®©, may fill in and not be legible. Dotted lines will not be printed and are for maximum print guide only. The fine lines and details in your logo may not be able to be produced clearly.

### Artwork Proof v2 — 版式定稿 + 签字方案(2026-06-22)
**版式微调(已出样 ArtworkProof_v2_sample.pdf):**
- 左上小徽标只放 **ARTWORK APPROVAL / PROOF V1**(不放我们 logo)。
- **我们的 logo 移到右上 Order# 上方**(白底用 quirky-logo-light.png 深字版)。
- **浅底字一律纯黑**(不要灰,要看得清)。
- 产品图上 Trends/PB 模板的标注**一个都不能少**:`X% of Actual Size` + 印刷方式、尺寸(35/50mm)、红色印刷框、底部 "Branding area can be moved within the red line" 及产品专属 note。
- **`% of Actual Size` = 比例尺**:proof 上的图相对真实产品的显示比例(100%=真实大小,70%=缩到 70% 因为放不下)。生成器**按产品高度自动算缩放比例**并标注 + 当前印刷方式。
- Disclaimer 里的 ™®© 目前用 (TM)(R)(C) 占位(避开写入坑),正式版换回真符号。

**✍️ 客户签字/审批方案(Lily 定:自己做,不用 PandaDoc):**
- **在线**:proof 邮件带专属 token 链接 → `/account` 或 `/artwork/[token]` 看图 → **Approve / Request Changes** → 落库(姓名 + 勾选 + 时间戳 + IP)→ **自动生成我们自己的 Certificate of Approval**(仿 PandaDoc:Ref 号、Sent/Viewed/Signed 时间戳、IP、Location、Email verified、二维码)→ 自动触发 Tax Invoice + 解锁生产门槛。
- **邮件**:后台 **"Mark Approved (email)"** 按钮,手动标记(像现在处理 Trends)+ 存备注。
- 理由:$0 月费、全程我们品牌、与订单流程打通(PandaDoc 要月费 + 独立系统 + 手动搬回后台)。
- 表:order_approvals(已存在)扩展存 signer/sent_at/viewed_at/signed_at/ip/location/method(online|email)/cert_ref。

### ⭐ 下一轮优先级(Lily 定 2026-06-22):先做"后台自动叠图按钮"
分支:`git checkout main && git pull && git checkout -b artwork-approval`
顺序(叠图优先于签字):
1. **product_templates 表** + 后台上传 Trends 模板 PDF → 自动识别印刷框(get_drawings,POC 已验证)。
2. **叠图生成器 API**:logo→框 + 产品改色 + 自动算 % of Actual Size + 标印刷方式/尺寸/红框 → 输出 proof v2 版式(已定稿,见 proof_v2.mjs / ArtworkProof_v2_sample.pdf)。
3. **/admin/artworks 加 "Generate Proof" 按钮**:Logo Received 订单一键出 proof → 预览 → 发客户(Lily 最想先在线点的)。
4. 之后:签字系统(token 审批页 + Certificate of Approval[样板已出 cert.mjs] + 签名盖回 proof + 自动 Tax Invoice + 生产门槛)。
样板脚本都在沙箱 outputs/ordergen/(proof_v2.mjs, proof_approved.mjs, cert.mjs, hero_bottle.png),正式版照搬即可。

### 🧩 模板库策略(Lily 定 2026-06-22):需求驱动,不预建全量
- **不给一万多产品预建模板。** 按客户 enquiry/order **用一个建一个**。
- 流程:来订单 → 后台 "Generate Proof":
  - **已有模板** → 一键自动叠图秒出。
  - **无模板**(首次) → 提示上传 Trends branding template PDF → 系统自动抽框 → 存(每产品一辈子一次)→ 出 proof。
- **按 Stock Code 存/匹配**,下次同产品自动复用。模板库越用越全。
- Trends 模板:每产品一个 PDF(如 128027),按需下需要的颜色。客户 logo 用后台 Logo Received 那张。

### 🎨 模板颜色处理(Lily 确认 2026-06-22):一个 PDF + 我们自动改色
- Trends 模板:**每产品一个 PDF(单一底色)**,不下多色。
- **颜色由生成器按订单自动改**(底色→目标色重映射,保留明暗阴影;POC 蓝→黑/白已验证)。
- 库里每产品存:模板 PDF + 印刷框坐标 + **改色规则(底色→目标色)**。
- 例外:**纯白/极浅色**改后在白纸上"隐身" → 自动加描边;金属色/多色渐变可能需手动微调(少数情况)。

### ✅ 自动叠图 v1 已建(branch artwork-approval, 2026-06-22)
新增/改动文件(只 commit 这些,别 add -A):
- `lib/proofGen.js`(新)— 图床中立引擎:从网址取模板图+客户 logo,叠进印刷框,出 proof v2 版式。
- `app/api/admin/artworks/generate-proof/route.js`(新)— 接口:按 stock_code 找模板→生成→存 Supabase Storage(mockups 桶)→写 mockup_url。
- `app/admin/artworks/page.js`(改)— 上传弹窗里加 "Generate proof automatically"(输 stock code/颜色/PMS → Generate → 预览 → Send)。
- `public/templates/128027.png`(新)— Aura 杯黑色模板(种子)。
- `outputs/artwork/product_templates_CREATE.sql`(新)— 建表 + 128027 种子(在 Supabase SQL 跑)。

注意:
- 沙箱跑不了 `next build`(SWC 原生二进制 bus error);已用 babel/node --check 静态校验通过。**本机 push 前先 `npm run build` 绿。**
- 依赖:Supabase `mockups` 桶(已有)、`NEXT_PUBLIC_SITE_URL`、public 下 quirky-logo-light.png(已有)。
- 印刷框坐标用图片分数(0..1, y 从上)。128027: x0.210 y0.372 w0.245 h0.193。
- 改色在"建模板时"一次做好(种子已是黑杯);运行时只叠 logo,中立。
- 待办:#33 自助建模板 UI(上传+拖框);改色规则自动化;白色描边;签字系统(#25-29)。

### ✅ Artwork 签字/邮件/证书/发票 (2026-06-22, branch artwork-approval)
**已建并待 push 合并:**
- **自动叠图 Generate Proof**(后台 /admin/artworks 弹窗):有模板秒出 proof v2;proof 上传 **Cloudinary**(缩略图/客户预览用 pg_1→jpg)。模板按 stock_code,种子 128027。
- **邮件全部统一**新版 `quirkyEmail`(暖色、文字 wordmark、无 navy 横条):send-mockup / approve / changes / request-logo / upload —— 旧版 navy-bar 衬线全清掉。
- **证书升级** `lib/certGen.js`(PandaDoc 同款 + 礼盒图 logo)。客户批准后附件 `ArtworkApproval_<order>.pdf` = **第1页 ARTWORK proof + 最后一页 CERTIFICATE 合并**。抓 IP(x-forwarded-for)。
- **EFT 审批后**:除合并包外,再附**真正的 Tax Invoice PDF**(generateOrderDocPDF, AMOUNT DUE + How to Pay)。
- **Tax Invoice 文案改**(lib/orderDocPdf.js "Good to know"):
  1. "Production only begins after artwork approval and payment received."
  2. "Production lead time is 5–7 business days."

**新增/改动文件:** lib/proofGen.js, lib/certGen.js, lib/orderDocPdf.js, app/api/admin/artworks/generate-proof/route.js, app/api/admin/artworks/send-mockup/route.js, app/api/artwork/approve/route.js, app/api/artwork/changes/route.js, app/admin/artworks/page.js, public/templates/128027.png, outputs/artwork/product_templates_CREATE.sql。(提交只 add 这些,别 add -A)

**待办 / 已知问题:**
- **缩略图**:旧 proof(Supabase)不显示;新 proof(Cloudinary)若 **Strict Transformations 开着**也会被挡。**本周要搬图床(离开 Cloudinary)** → 下一轮 #34:生成时**额外存一张 PNG 预览**,缩略图直连,不依赖任何图床转换(搬 Cloudflare 也稳)。先不折腾 Cloudinary 开关。
- 自动叠图**只放 logo,不改色 / logo 实际尺寸**:客户签字稿要准 → 正式稿 Lily 用 **Inkscape** 手画,上传后套品牌版式 + 签字流程(自动叠图降级为快速草图)。
- 签字补全(#25/#26):Sent/Viewed 时间戳、/account 看订单+审批记录。
- 沙箱跑不了 next build(SWC bus error)→ 本机 push 前 npm run build。FUSE 偶发写截断 → 从 /tmp 干净写。

### 🗺️ PROJECT 全流程设计(2026-06-22 定)
**核心:每单 = 一个 PROJECT(JOB)**,order# = 项目号(主线 code),加 **Job Name**(默认"客户+产品",如 Gigamon — Aura Bottle,可手改),**印在所有单据**(OC/Invoice/Artwork proof/Supplier PO)。

**9 阶段流水(绑订单状态)+ 总览页(每项目一行 + 横向进度条,点阶段进详情):**
Enquiry/Quote → Order Confirmed → Artwork → Invoice(Awaiting/Received)→ Production(供应商PO)→ Dispatched → Delivered → **Feedback(送达后 7 天延时,独立阶段,定时任务触发)**

**导航重排:** Dashboard · Customers · Enquiries & Quotes · **Orders · Artworks · Invoices · Production · Dispatch** · Products · Sourcing(Orders 移到 Artworks 前)。

**各阶段:**
- **Orders** = Order Confirmation(已做)。
- **Invoice** = 两状态 **AWAITING PAYMENT / RECEIVED**。EFT 批准后自动发 AMOUNT DUE(已做);**收款 Lily 后台手动点 "Mark as Paid"**(记日期)→ RECEIVED;Stripe 自动。门槛:**RECEIVED + Artwork Approved → 解锁 Production**。
- **Production**:选供应商 → Supplier PO#(独立编号,绝不上客户单)→ 下 PO;记供应商发票(预付/月结、金额、付否)→ 生产中。
  - **供应商表:单独新建(Local Stock 用),不复用 Sourcing 的 factories**(两者不同)。建 supplier_pos + 供应商发票字段。
- **Dispatch**:输物流单号 → 自动发客户"已发货+单号"。
- **Delivered**(标记送达 → 立刻发"货已到")**与 Feedback(7 天后自动问反馈)分开两步。**

**财务闭环(每 project 挂 order# 下):**
- **Sales** = 客户 Invoice(ex-GST);**Freight 两边都单独列**(收客户的运费 + 付出去的运费成本);**Cost** = Supplier PO(产品成本)→ **毛利 = Sales − 产品成本 − 运费成本**。
- 给 Sales/COGS/Freight 各配 account code,可导出对账。
- **决策待定 A/B**:(A) 自建**项目财务管理层**(推荐,不碰合规,7/1 可上)vs (B) 完全取代 Xero/MYOB 法定记账报税(风险大、一周不现实)。建议 A 先上,B 跟会计确认。新财年 7/1 起项目财务进系统。

**决策小结:** Job Name 自动可改 ✓ / EFT 手动 Received ✓ / 供应商单独表(Local Stock)✓ / Feedback 7 天 ✓ / 运费两边单列 ✓。
**下一步(明天):先做 INVOICE(收款门槛:Awaiting→Received,Mark as Paid,解锁 Production)。**

### 💰 财务系统决策更新(2026-06-22):自建(Sole Trader 规模)
Lily 现为 **Sole Trader** → 合规轻(收支进个人税表、无公司税申报、无 payroll、无审计、ATO 不强制软件,自有记录准确完整留 5 年即合法)。**决定:自建财务系统**,不用 Xero/MYOB。
做对这几样即可:
1. **GST**(若已注册):销售 GST + 采购进项 GST 分开记 → **BAS-ready**(发票已单列 GST,供应商账单同样记)。
2. **可导出汇总**(收入/支出/GST/毛利)给会计或自报,记录留 5 年。
3. **手动对账**:Lily 点 "Mark as Paid" = 人工对账,够用,不做银行自动接口。
报税时让会计过一遍年度税表 + 确认 GST 设置。新财年 **7/1 起项目财务进系统**。

### 🧭 后台总地图(2026-06-23 定)— 按业务域分组
导航太挤,改成**左侧按域分组**,点大区进子页。各域:
- **Overview**:Dashboard
- **Sales & Fulfilment(Local Stock 全程)**:Enquiries & Quotes · **Orders · Artworks · Invoices · Production · Dispatch · Delivered/Feedback** · Customers
- **Suppliers & Stock**:供应商目录&库存(Trends 等)· Suppliers(本地供应商表)· Purchase Orders
- **Sourcing(定制/海外)**:Sourcing · Factories · Cost Sheets · Made-to-order · Requests
- **Catalog(Product & SEO)**:Products · Categories/URL pages · SEO · Collections/Kits
- **Finance**:项目 P&L · 应收(发票)· 应付(供应商账单)· 现金流 · GST/BAS 导出
- **Content**:Blog(晚点做)
- **Settings**:定价参数 · 公司/银行 · 邮件模板 · 用户

**核心模型(解 Lily 的 confuse):Orders ↔ 工作台**
- **Orders = 项目总表**(每项目一行 + 当前阶段进度条)。这里的 Artwork/Invoice 只是**状态标签**(到哪了)。
- **Artworks / Invoices / Production / Dispatch = 各阶段"工作台"**(= Orders 筛到该阶段 + 干这步活的按钮)。
- 两边用 **order#(项目号)**互链:Orders 点阶段→跳工作台;工作台点 order#→跳回订单。**同一项目、不同视角,不重复劳动。**(技术上 orders 表 ↔ artworks 表按 order_number 关联,已成立。)

**Orders 状态流(改版,对齐 9 阶段):**
All · **Confirmed** · **Artwork** · **Awaiting Payment** · In Production · Dispatched · Delivered · (Feedback) · **Cancelled**
- Pending→Confirmed;Artwork Sent+Approved 合成 Artwork(细节在 Artworks 页);**新增 Awaiting Payment**(收款这格,和 Invoices 页联动);门槛:收款+批准→In Production。

**⚠️ Orders 空 bug:** `app/admin/orders/page.js` 用 **anon** 读 orders 被 RLS 挡 → 永远 "No orders yet"。**修法:改调已有的 service-role API `/api/admin/orders`**(能看到全部订单+明细/审批/状态)。

### 🔌 供应商库存 + 新品(Suppliers & Stock 线,2026-06-23)
问题:无供应商库存可见 → 可能下到缺货品;Trends 出新品入不了库。**Trends 有 API**(Lily 确认)。
- 基础已起:`outputs/supplier_import_foundation`(Gear For Life 试点导入产品数据)。
- **Phase 1(先做):后台"供应商目录 & 库存"页** —— 接 Trends API 拉**实时库存 + 新品**,内部可见(确认订单前查库存),**先不接前端**。
- **Phase 2:** 再决定是否前端显示库存 / 新品自动上架。
- **待 Lily 提供:** Trends ① API 文档 ② 凭证(key/token)③ 确认能查实时库存+新品列表。供应商家数待定。

### ✅ 构建优先级(逐步做,每步完成写日志)
1. **修 Orders 空 bug(改 service API)+ 状态流改版 + 导航 Orders 移到 Artworks 前**
2. **INVOICE**:schema(job_name + 订金/尾款 + paid_at)→ 独立 Invoices 页(Awaiting/Deposit/Paid + Mark as Paid)→ Job Name 自动生成上单据 → 生产门槛(全款+批准)
3. **Production**:本地供应商表 + Supplier PO(独立编号)+ 供应商发票(预付/月结/付否)
4. **Dispatch / Delivered / Feedback(7天延时,定时任务)**
5. **Suppliers & Stock**(Trends API:库存+新品,内部)
6. **Finance**(项目 P&L / 应收应付 / 现金流 / GST-BAS,7/1 启用)
7. 导航按域分组重排;Catalog/Blog 以后

### 📌 进度(2026-06-23)
- ✅ 进度条 UI 方案定稿(每项目一行:做完实心打勾 / 当前金色高亮 / 未到灰色 / Awaiting Payment 红标 Payment due / Cancelled 灰)。Lily 通过。
- ✅ **Invoice schema 已起草** `outputs/invoices/invoice_schema_CREATE.sql`(orders+job_name、order_payments 流水表、触发器自动算 amount_paid + payment_state[awaiting/deposit/paid] + paid_in_full_at)。**待跑 Supabase**。
- ⏳ **VM(沙箱)宕机** → 代码暂不能安全写/校验。恢复后立即:① 修 Orders 空 bug(改 service API `/api/admin/orders`)+ 状态流改版(加 Awaiting Payment)+ 导航 Orders 移到 Artworks 前 → ② Invoices 页(Mark as Paid/Deposit)→ ③ Job Name 自动生成 → ④ 生产门槛。
- 并行可做:Lily 去 Trends 要 API 文档 + 凭证(Suppliers & Stock 线)。

### 🧭 总路线图(2026-06-23 Lily 批准)
- **Phase 1 — Sales & Fulfilment(现在,赚钱主线)**:Orders(修 bug+状态流+排序)→ Invoices(订金/尾款)→ **Production(含 本地 Suppliers 表 + Purchase Orders,一起做)** → Dispatch → Delivered/Feedback。
- **Phase 2 — Finance(盯 7/1)**:靠 Phase 1 喂数据(销售=发票、成本=供应商PO、运费两边)。7/1 前先上**基础视图**(项目毛利+应收应付+现金流),深度报表/BAS 导出随后。
- **Phase 3 — Sourcing 块**做完整。
- **Phase 4 — Catalog/Collections**(等全部产品上线后):后台**产品选择器**自己组 Collections。
- **Phase 5 — Blog(最后)。Settings 随做随补。**
- 注:**Suppliers(本地)+ PO 跟 Production 一起做(现在)**;**Trends API 库存/新品同步 = 不急,以后**。

### 🔧 进度(2026-06-23 续)— Orders 修复(VM 仍宕,用文件工具写,待 Lily 本机 build)
改了 2 文件:
- `app/admin/orders/page.js`:fetchOrders 改调 **`/api/admin/orders`(service)**;新增 `deriveStatus()` 合并 order.status + artwork_status → 显示正确阶段(PO260024 → Artwork Approved);标签客户端筛选。
- `app/api/admin/orders/route.js`:GET 增 **按 order_number 拉 artworks 表**,normalizeOrder 附 `artwork_status` / `artwork_mockup_url`。
- **未做(留给 INVOICE 步):** 详情页改状态/标付款按钮仍用 anon(RLS 挡),下一步换 service API PATCH。状态流改版(加 Awaiting Payment)+ 进度条 UI 也在 INVOICE/后续。
- ⚠️ VM 宕 → 没跑 build 自检;Lily 本机 `npm run build` 把关,错了贴回修。
- ✅ **预览版验证通过(2026-06-23)**:29 单全显示;PO260024 → Artwork Approved + $1767.04;PO260022/29 Approved、21/23 Artwork Sent,艺术稿状态正确联动。**先不 merge,接着做 INVOICE,做完一起测一起合。**

### 💵 INVOICE 已建(2026-06-23,VM 仍宕,文件工具写,待本机 build)
- `outputs/invoices/invoice_schema_CREATE.sql` —— **Supabase 先跑**(order_payments 流水表 + orders.amount_paid/payment_state/paid_in_full_at + 触发器自动汇总)。
- `app/api/admin/invoices/route.js`(新)—— POST 记一笔付款(service role 插 order_payments,触发器更新订单 + 同步 legacy payment_status)。
- `app/admin/invoices/page.js`(新)—— 独立 Invoices 页:列 应收/已付/余额/状态(Awaiting/Deposit/Paid)+ **Record payment**(订金/尾款,选方式)+ **Gate 列(全款+Approved → ✅ Ready)**。
- `app/admin/artworks/page.js`(改)—— 导航 **Orders 移到 Artworks 前 + 加 Invoices**。
- **测试前必须先跑 SQL**,否则记付款会报错(无 order_payments 表)。Invoices 列表能开(读 orders),但没跑 SQL 前全显示 Awaiting。
- 未做:Job Name 自动生成上单据(#37)、状态流加 Awaiting Payment 格 + 进度条 UI、Orders 详情页改状态/标付款按钮换 service API(仍 anon)。

### 🏛️ 后台版面蓝图(2026-06-23 Lily 定稿)— 混合式导航
**布局:左侧边栏切「域」+ 顶部横排该域子项 + 内容区**(经典后台,装得下所有域,又保留 Lily 习惯的顶部横排)。
- **侧边栏(域):** Dashboard · **Local Stock** · Sourcing · Catalog · Finance · **Customers(独立成域)** · Content · Settings
- **Local Stock 顶部横排子项:** Enquiries & Quotes · Orders · Artworks · Invoices · Production · **Suppliers(本地)**
- **Dispatch / Delivered / Feedback 不上导航** —— 是 Orders 点开后的**流程步骤**(填单号+通知、送达通知、7天后求反馈都在订单内)。
- **Orders 点开 = 该单流程子导航**(Confirmed→Artwork→Awaiting Payment→Production→Dispatch→Delivered→Feedback),点某步看该单现状;与顶部全局工作台(Artworks/Invoices/Production)同数据、两视角,按 order# 联动。
- 各域子项(待排):Sourcing=Sourcing·Factories·Cost Sheets·Made-to-order;Catalog=Products·Categories/SEO·Collections/Kits;Finance=P&L·应收·应付·现金流·GST/BAS;Settings=定价·公司银行·邮件·用户。
- 名字/分组 Lily 确认**不改**。
- **节奏:** 蓝图先定;导航改造(侧边栏+顶部横排,要做共享组件、动每个页面)作为**独立"统一导航"步,等 VM 回来一次性做稳**;在此之前继续用现有顶栏把功能补齐(Invoices→Production)。

### 🏛️ 蓝图 refinement(2026-06-23 Lily 定)— LS 只留客户面,钱/供应商各自成域
**核心:LS 导航只放销售/履约会碰的;钱和供应商各自成域;Orders 当主轴串状态(同一 order# 数据,处处同步)。**
- **LOCAL STOCK(只客户面):** Enquiries & Quotes · Orders · Artworks
- **FINANCE:** **Invoices/应收(记客户收款)** · 应付(供应商账单)· P&L · 现金流 · GST/BAS
- **SUPPLIERS & PRODUCTION(采购):** Suppliers · **Purchase Orders(下 PO · 收供应商发票 · 付供应商)**
- **Orders = 主轴**:点开看 Invoice/Production/Dispatch/Delivered/Feedback 状态;**动作**(记收款、下 PO、付供应商)在 Finance / Suppliers&Production 里做。两边同数据,order# 联动。
- **生产"进度跟踪"(到哪步/发货)放 Orders 流程里看;"下 PO/收票/付款"采购动作放 Suppliers & Production 域。**
- 数据已是单一来源:记付款→order.payment_state 自动更新→Orders/Invoices/Finance 都读同一份。
- 注:Invoices 页(已建)只是**菜单归属改到 Finance**,功能不变。

### 🏭 PRODUCTION 已建(2026-06-23,VM 仍宕,文件工具写,待本机 build)+ Invoice merged 上生产
- Invoice 那批已 **merge 上生产**(artwork-approval → main)。Supabase **一个项目**(预览/生产同库),invoice SQL 已生效,不用再跑。新分支 `production` 上继续。
- `outputs/production/suppliers_po_schema_CREATE.sql` —— **Supabase 先跑**(suppliers 表 + purchase_orders 表;PO 带 cost_subtotal/freight_cost/cost_total 分开 + 供应商发票 + 付款字段 = 财务闭环)。
- `app/api/admin/suppliers/route.js`(新)GET/POST 供应商。
- `app/api/admin/purchase-orders/route.js`(新)GET/POST(自动生成独立 PO 号 **SP{YY}{4位}**)/PATCH(status / invoice / pay / details)。
- `app/admin/production/page.js`(新)Production 页:列订单 + Gate(paid+approved=Ready)→ **Raise PO**(选/加供应商、填产品成本+运费成本)→ 记供应商发票 → Mark paid。
- 导航加 Production(dashboard/artworks/invoices 页)。
- **测试:** 先跑 suppliers_po SQL → push → 预览 `/admin/production` → 对 Ready 的单 Raise PO(SP 号)→ 记票 → 付款。
- `app/admin/suppliers/page.js`(新)Suppliers 管理页:加供应商 + **payment_terms 预付/月付(prepaid/account)标注**;Production 页 PO 行显示供应商条款 badge,Raise PO 新增供应商时也能选条款。
- 未做:PO 发邮件给供应商/出 PO PDF;Production 状态回写 Orders 进度;Dispatch/Delivered/Feedback;统一导航(共享组件);Finance 汇总。

### 📋 Order 详情页设计参考(2026-06-23,参考 Trends Order Dashboard)
Trends 状态用数字编号(如 "21 - Invoiced"=状态码21,**不是日期**);我们用名字,不抄编号。
点开一单的详情页要有(抄 Trends 的好处 + 我们的流程):
- **流程进度条**(我们的 stepper:Confirmed→Artwork→Payment→Production→Dispatch→Delivered→Feedback)。
- **Order Details**:Order# / Supplier PO# / 状态 / 类型 / Job(=job_name)/ Branding / Scheduled Ship Date / Email。
- **Delivery Address**。
- **Time Stamps 时间线**:Order Received / Last Proofed / Approved / Dispatched(已有时间字段)。
- **Documents/Media**:Invoice · Proof · **Photo(成品照,新增)** · Tracking —— 可看/下载。
- **明细表**(Code/Description/Qty/Price/Gross + Subtotal)。
- **Order Repeat(一键返单)** —— 从此单复制开新单。
- Dispatch/Delivered/Feedback 的操作就在这页(填单号+通知、送达通知、7天后求反馈)。

### 🧾 PO PDF 已建(2026-06-23,VM 仍宕,文件工具写)
- 术语:**PURCHASE ORDER=给供应商;ORDER CONFIRMATION=给客户**(两个文档,不混)。
- `lib/poDocPdf.js`(新)采购单 PDF,**复用 Invoice 风格**:礼盒 logo(quirky-logo-quote.png,fs 读 + fetch 生产URL 兜底)、navy 抬头、**Stock Code 列**;列产品名/数量/**印刷方式(branding)**、产品成本 + **运费单列** + 总成本、供应商 + 付款条款(Prepaid/Monthly account)+ 交付地址。
- `app/api/admin/purchase-orders/pdf/route.js`(新)GET ?id= → 出 PO PDF(po.items 空时回退订单明细)。
- production 页:PO 号点开看 PDF;Raise PO **自动带订单明细**;成本列 **edit 可改**(价格保留可改,供应商确认价可能变)。
- 价格 = 供应商 Order Confirmation 上的价,**手动填、可随时改**。
- 现状:给供应商下单本来只是邮件随手写;PO PDF 升级成正规表单(可发供应商,也可继续邮件)。
- 待:把 PO 真发给供应商(邮件)留待以后(届时先用自己邮箱测)。

### 🧾 PO v2(2026-06-23 Lily 细化)
- **不印供应商**在 PO 文档上(白标/drop-ship,内部知道即可)。
- **DELIVER TO = 客户**:收件人姓名+电话+地址(从订单带,往往是客户地址不是我们的)。
- **JOB NAME** 显示(= job_name / 客户公司)。
- **逐行成本明细**:产品 / Setup / Branding 各行(描述+数量+单价),**运费单列** → 像 Trends 发票那样;连财务。
- **价格可改**:成本列 `edit` → 重开逐行编辑器(POST 新建 / PATCH 编辑,items 存 jsonb,触发 cost_subtotal/total)。
- 价 = 供应商 Order Confirmation 上的价,手动填。
- **多供应商**:一单可挂多张 PO(产品商 + 印刷厂分开,产品商不印刷)—— 数据库支持(order_id 多对一),**UI 待加"再加一张 PO"**。
- 改动文件:lib/poDocPdf.js、app/api/admin/purchase-orders/route.js(+pdf/route.js)、app/admin/production/page.js。

## 📐 文档/单据统一标准(2026-06-23 必须遵守 — 别再犯,省时间)
适用业务单据:**Quote · Order Confirmation · Tax Invoice · Purchase Order**(抬头必须逐字一致)。Artwork Proof / Certificate 布局可不同,但 logo/品牌色一致。
1. **浅底文字一律纯黑** rgb(0.08),**绝不用灰**。生成器里 GREY 常量直接 = 黑(从根上)。
2. **统一抬头(navy band)**:
   - navy 横条高 **110**。
   - **礼盒图 logo** `quirky-logo-quote.png`:x=40, y=H-42, 宽 150(高 150*256/1400);fs 读 + fetch 生产 URL 兜底。
   - 联系块 ABN/Phone/Email/Web:x=40, size 9, 标签 bold 白 + 值 reg 白, 行距 12, 起点 cy=H-64。
   - **标题**(QUOTE / ORDER CONFIRMATION / TAX INVOICE / PURCHASE ORDER):右对齐 W-40, y=H-44, **size 18 bold 白**(统一 18,**不能比 logo 大**)。
   - **meta(单号/日期等)**:标签**左对齐 x=392** size 9 bold 白;值**右对齐 W-40** size 9 reg 白;行距 12, 起点 H-60。
3. **金额千分位**:`toLocaleString('en-AU',{minimumFractionDigits:2,maximumFractionDigits:2})` → $1,234.00。
4. **编号**:客户 = **OC{YY}{4}**(下单生成,印在 OC/发票/订单号);供应商采购单 = **PO{YY}{4}**。**SP 弃用;客户单绝不用 PO 前缀。**
5. **分隔线别压字**:totals 的横线放在文字上方留足间距(line y = text baseline + ~12)。
6. **DELIVER TO**(采购单):公司名(粗)+ Attn 收件人 + 电话 + 地址(常是客户地址);标题(DELIVER TO / JOB)大号黑体,内容小一号。
7. ⚠️ **Quote 生成器(app/api/quote/route.js)抬头还没统一**(band 100、文字 logo)→ 待改成上面标准。
8. 已统一:orderDocPdf(OC/发票)、poDocPdf(PO)、quote/route.js(都已改:抬头 110、礼盒 logo、标题 18 与 logo 垂直居中 y=H-35、meta x392、全黑)。**标准独立文件:`DOC_STANDARDS.md`(新表单先看它)。**

### 🚚 A:Dispatch / Delivered / Feedback 已建(2026-06-23)
- `app/api/admin/orders/fulfilment/route.js`(新)POST {orderId, action: dispatch|delivered|feedback}(service role):dispatch→status=dispatched+dispatched_at+tracking,发"已发货+单号"邮件;delivered→status=completed+delivered_at,发"已送达";feedback→发"求反馈"。全 quirkyEmail。
- `app/admin/orders/page.js`:Delivery 区加 3 按钮(Mark Dispatched&Notify / Mark Delivered&Notify / Send Feedback Request)→ 调上面接口。
- `outputs/fulfilment/fulfilment_columns.sql`:orders 加 dispatched_at/delivered_at/feedback_requested_at(**Supabase 先跑**)。
- **待:Feedback 7 天自动**(Vercel cron 每日扫 delivered_at 满 7 天且未发的单 → 发反馈)。Dispatch/Delivered/Feedback 是 Orders 流程步骤,不上主导航(已定)。
- merge:Lily 已把 production 合并到 main(继续在 production 上累积 → 再合)。

### 🧭 统一侧边栏导航已建(2026-06-23)
- `app/admin/layout.js`:**共享布局** = 左侧域侧边栏 + 顶部该域子项(usePathname 判定 active 域/tab)。域:Dashboard/Local Stock/Suppliers&Production/Finance/Sourcing/Catalog/Customers/Settings。
  - Local Stock tabs: Enquiries&Quotes(/admin/leads)· Orders · Artworks。
  - Suppliers&Production: Production · Suppliers。Finance: Invoices。
- 各页**移除自带顶部导航**:page(dashboard)、invoices、production、suppliers、artworks。(残留未用 NAV/Link/handleLogout = lint 警告,非错误。)
- **待收尾:** Orders 页自带状态筛选条(精简掉重复 logo/Admin,只留状态 tabs);Sourcing 有嵌套 layout 可能与父布局叠;Catalog/Content/Settings 子项待补;Invoices 归 Finance 域(已在 Finance tab 下)。
- 下一步:Finance 汇总。

### ✅ 端到端测试中(2026-06-23)— 待改文案(先记,Lily 看完整条流程再一起改)
- **OC260001 验证通过**:客户新订单号走 OC ✅。
- **Order Placed 页(`app/order-confirmation/page.js`)文案改:**
  1. 去掉 "and Tax Invoice" → 只 "Your **Order Confirmation** has been emailed (PDF)"(Pay Later 只发 OC;**最好按付款方式条件显示**,Pay Now 才 OC+Tax Invoice)。
  2. "We'll send you a free digital proof to approve shortly once we receive your logo." → **按订单有无 logo 两种文案**:已传 logo → "we'll send your mockup shortly";没传 → "once we receive your logo (check inbox for upload link)"。
  3. "Production only begins after artwork approval and payment received."
  4. "Estimated lead time: 5 business days from then."(3、4 别重复 "after artwork approval and payment received")。
- **下单确认邮件(`app/api/order/route.js`)按付款方式改:**
  - **Pay Later/EFT/线下**:**只发 Order Confirmation**(去掉 Tax Invoice 附件、去掉 "& Tax Invoice" 主题/正文、**去掉 How to Pay 银行框**)。收款信息 + Tax Invoice(AMOUNT DUE)等**艺术稿审批后**才发。
  - **Pay Now/Stripe**:OC + Tax Invoice(PAID 收据),不放 How to Pay(已付)。
  - 保留:OC 附件 + What happens next + 暖心结尾 + wordmark 签名。
  - = 落实之前定的"按订单类型单据流程"(下单只 OC,审批后才税票)。
- **Tax Invoice 抬头编号**:Inv# 现在错显成 OC260001。应:**Inv #: `INV{YY}{NNNN}`(发票独立号)+ Order #: `OC{YY}{NNNN}`(客户订单)**。改 `lib/orderDocPdf.js` 接受独立 `invoiceNumber`(Inv# 用它、Order# 用 orderNumber);生成方(approve 路由的 generateInvoiceNumber 出 INV#)传两个号。OC 给 Order#、INV 给 Inv#。
- **Artworks 列表 LOGO 缩略图空白**:客户传的是矢量(AI/PDF/SVG),`<img>` 显示不了 → 用 **Cloudinary f_png 转图**显示缩略图(Download 留原矢量)。改 `app/admin/artworks/page.js` 的 logo 缩略图 src(套 cld f_png,类似 rasterLogoUrl)。Mockup 缩略图同理(之前已对 mockup 做 pg_1,logo 也要)。
- **客户审批页 mockup 看不到(破图,只能下载)**:`app/artwork/[token]/page.js` 的 MockupViewer 把 PDF 用 **`<iframe>`/`<embed>` 内嵌显示**(任何来源都能看),客户当场看 proof 再批;图片格式用 `<img>`;Download 保留。
- **【共同根因】PDF/矢量进不了 `<img>`** → 统一方案:Cloudinary 文件用 pg_1/f_png 转图当缩略图;大图预览(审批页)用 iframe 内嵌。涉及:Artworks 列表 logo+mockup 缩略图、客户审批页 mockup。
- **Suppliers 页面不能编辑**:`app/admin/suppliers/page.js` 只有 Add,没有 Edit。需加编辑(邮箱/联系人/电话/付款条件)。改:行尾加 edit 按钮 → 复用 Add 弹窗(预填)→ 走 PATCH(需在 `app/api/admin/suppliers/route.js` 加 PATCH)。
- **PO 一键发供应商邮箱【Lily 确认要】**:Create PO 现在只建记录+PDF,不发信。要加:Create PO 后(或 PO 行上加按钮)把 PO PDF 发到供应商邮箱(类似客户邮件,quirkyEmail + pdf 附件)。依赖上面的 Suppliers 编辑(得先能存供应商邮箱)。两件一起做。
- **`/products` 404【客户可见,live bug】**:无 `/products` 总览页,只有 `/products/[slug]`。下单后购物车清空 → `app/place-order/page.js:115` `router.push('/products')` → 落到 404(Lily 从 order-confirmation 往后退看到)。还有 `app/category/[category]/page.js:163` 面包屑 "All Products" 也链 `/products`。canonical 全品页 = `/promotional-products`。修:① next.config.mjs 加 301 `/products`→`/promotional-products`;② 改上面两处源头链接到 `/promotional-products`。
- **PO Stock Code 列空(小修,进批次)**:`app/admin/production/page.js` Raise PO 弹窗成本行只有 描述/Qty/Unit$,没 Stock Code 框;手加的行无编号 → PO PDF 那列空。订单本身带 SKU(税票上 128382)。修:每行加一个 Stock Code 小 input,`linesFromOrder` 自动带出订单 SKU(`it.sku||it.productSku||it.stockCode`),可改;submitPo 已存 stockCode,poDocPdf 已会画。

- **下 PO 自动把订单跳 In Production(小修,进批次)**:现在 Create PO 只写 purchase_orders,不改订单 status,Orders 还停在 Artwork Approved。要:`app/admin/production/page.js` submitPo 建 PO 成功后,PATCH 订单 `status='in_production'` + `production_started_at=now`(经 `/api/admin/orders/fulfilment` 或直接 service update)。这样 Orders 板自动显示 🏭 In Production。

## ✅ 上面这批已全部改完(2026-06-23,待 Lily push + build)
改动文件:order-confirmation/page.js(文案)、api/order/route.js(Pay Later 只发 OC、Pay Now OC+TaxInvoice、去银行框)、lib/orderDocPdf.js(Inv#=INV / Order#=OC、Reference=INV)、api/artwork/approve/route.js(传 orderNumber=OC + invoiceNumber=INV)、next.config.mjs(/products→/promotional-products 301)、place-order/page.js + category/[category]/page.js(链接改 /promotional-products)、artwork/[token]/page.js(mockup iframe 内嵌预览)、admin/artworks/page.js(toDisplayUrl 支持 pdf/ai/eps/svg→f_png,logo 缩略图)、admin/production/page.js(成本行加 Stock Code 框 + ✉ Send 按钮 + sendPo)、api/admin/purchase-orders/route.js(POST 自动 in_production、PATCH action='send' 发供应商)、admin/suppliers/page.js + api/admin/suppliers/route.js(编辑 + PATCH)。
无需新 SQL(suppliers 列已存在;production_started_at 缺列已容错)。

## 大项(和财务一起立项,不在当前批次)
- **SKU 成本 + 印刷定价 price book**:按编号的价格表。① 每个产品 SKU → cost of goods(进货成本);② 每种印刷方式(screen/pad/embroidery/DTF…)有编号 + 收费规则(setup + 每色/位置单价,按量分档)。下 PO 自动带成本价、客户报价自动带售价 + 算毛利。涉及新表(product_costs / decoration_methods / decoration_pricing)、产品后台加成本字段、报价器 + PO 都接表。Lily 提出,定位为财务模块,单独规划。

## 财务/成本模块 — 设计要点(Lily 确认,留到 Finance 项目一起做)
- 价格表分两面:成本价(供应商) vs 售价(客户)。产品成本 ≈ base_price;售价 = base_price × MARGIN。
- **运费 + Setup charge + 各印刷方式成本 = 按供应商不同** → 配置存在每个 supplier 上(供应商专属成本设置),不是全局。
- Create PO 选供应商后自动带出:产品成本(base_price×qty)+ 该供应商运费 + 该供应商印刷/setup 成本;毛利自动算。
- 应付账款(Payables):PO 行上传供应商发票 PDF;Finance 分两本账 = 应收(客户 Invoices)+ 应付(供应商)。
- 现状:手动填成本/运费够用,不急。
