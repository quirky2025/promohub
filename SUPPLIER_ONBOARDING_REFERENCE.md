# 新供应商接入参考清单 (New Supplier Onboarding Reference)

> 目的:系统里很多设置**目前是按 Trends 的标准写死的**。以后接任何新供应商,照这张清单**逐项核对/配置**,一项都不能漏 —— 否则会出现价格、交期、文案不一致。
>
> 状态:截至 2026-06-24,全站只有 **Trends** 产品。下面每一项标注了「当前 Trends 值」+「在系统哪里」+「新供应商要做什么」。
>
> ⭐ 标记 = 目前写死、新供应商来必须改的;✅ = 已经是"按供应商存"的(Suppliers 表里),无需改代码。

---

## A. 价格 / 成本 (Pricing & Cost)

**A1. ⭐ 产品成本价 (Cost of goods / base_price)**
- 当前:产品的 `base_price` = Trends 的进货成本(按数量分档:5+/10+/25+/50+/100+/250+)。
- 系统:products 表的 pricing_tiers。
- 新供应商:录入该供应商每个产品、每个数量档的**成本价**。

**A2. 利润系数 (MARGIN) = 1.40**
- 当前:售价 = 成本 × 1.40,全站统一 1.40。
- 系统:写死在 ~12 个文件里(ProductClient、QuoteBuilder、cart、place-order、各分类页…)。
- 新供应商:确认是否所有供应商用同一个 1.40,还是按供应商不同。**建议先抽成一个共享设置文件**(见文末"技术债")。

**A3. ⭐ 数量价格档 (Quantity tiers)**
- 当前:5+ / 10+ / 25+ / 50+ / 100+ / 250+。
- 新供应商:确认该供应商的起订量和分档是否一样。

---

## B. 印刷 / 装饰 (Decoration & Branding)

**B1. ⭐ 可用印刷方式**
- 当前(Trends):Screen Print、Pad Print、Laser Engraving、Colourflex Transfer、DigiFlex Transfer、Personalisation。
- 新供应商:该供应商支持哪些印刷方式,逐个录入。

**B2. ⭐ 每种印刷方式的成本**
- 当前:Setup 费(例 $56 / $40)+ 每件/每色/每位置单价 —— 按印刷方式不同。
- 新供应商:录入该供应商每种印刷方式的 **setup 费 + 每件单价**(成本面)。

**B3. ⭐ 印刷方式分类(影响文案显示)**
- 当前规则(按名字匹配):
  - "screen print" / "pad print" → 显示 **"X COL · 1 POS"**(按色数)
  - "laser / engrav / deboss / emboss / etch" → **只显示方式名**(无颜色,如 "Laser Engraving Per Position")
  - 其它(transfer 等)→ **"Full Colour · 1 POS"**
- 系统:`brandingLabel` 在两处(components/QuoteBuilder.jsx + app/products/[slug]/ProductClient.jsx)。
- 新供应商:若有新的印刷方式名,确认它该归哪一类,必要时改 `isColourMethod` / `isEngravingMethod` 的关键词。

**B4. ⭐ 印刷区尺寸 / 位置 (Print area size)**
- 当前:如 40×50mm、50×90mm(每个产品/方式不同)。
- 新供应商:录入各产品各方式的印刷区尺寸(也用于 artwork 模板)。

---

## C. 生产交期 (Production Lead Time)

**C1. ⭐ 生产交期 = "3-7 business days"**
- 当前:全站统一 **3-7 business days from artwork approval & full payment**(Trends 标准,按印刷方式略不同)。文案带 "(varies by branding method)"。
- 系统:order-confirmation 页、orderDocPdf(OC/Invoice PDF)、quote route(Quote PDF)、下单/审批/转单邮件、QuoteBuilder 的交期字段(默认 3-7,可填文本)。
- 新供应商:**该供应商的交期可能不同** → 接入时要能按供应商设交期(目前写死 3-7,未来做成供应商配置)。
- 注意:产品页的**运输时效表(2–5 / 5–7 / 5–15,air/sea)是物流时效,不是生产交期,与此无关,保留**。

---

## D. 运费 (Freight / Shipping)

**D1. ⭐ 运费 = $30 flat**
- 当前:全站 $30 澳洲境内统一运费(Trends)。
- 系统:SHIPPING = 30,写死在 cart、place-order、ProductClient、QuoteBuilder 等。
- 新供应商:运费**按供应商不同**(可能按重量/地区/件数)→ 接入时按供应商设运费规则。下 PO 时运费也手填/自动带该供应商的。

---

## E. 起订量 (Minimum Order Quantity)

**E1. ⭐ 起订量 = 5 units**
- 当前:产品页显示 "Minimum order: 5 units"。
- 系统:products 表 min_qty。
- 新供应商:确认该供应商每个产品的起订量。

---

## F. 付供应商的条件 (Supplier Payment & Contact)

**F1. ✅ 付款条件 (Prepaid / Monthly account)**
- 已按供应商存:Suppliers 表 payment_terms。后台 Suppliers 可编辑。
- 新供应商:在 Suppliers 里选 Prepaid 或 Monthly account。

**F2. ✅ 供应商联系人 / 邮箱 / 电话**
- 已按供应商存:Suppliers 表(用于一键发 PO)。
- 新供应商:在 Suppliers 里填邮箱等(否则 PO 一键发信没地址)。

---

## G. 美工 / Mockup 模板 (Artwork Templates)

**G1. ⭐ 产品印刷模板(用于自动出 proof)**
- 当前:Trends 提供每个产品的模板(线稿 + 红框印刷区坐标 + 尺寸 + 每色底图)。
- 系统:product_templates(印刷框 x,y,w,h pt + 尺寸mm + 印刷方式 + 每色底图)。
- 新供应商:**该供应商的产品模板要重新拿/重新标框**(不同供应商线稿不同)。

**G2. 客户上传美工格式**:AI / PDF / EPS / PNG / JPG(系统标准,通常不变)。

---

## H. 产品 / 目录 (Products & Catalog)

**H1. ⭐ 产品 SKU / Stock Code**:每个供应商自己的编号体系。
**H2. ⭐ 产品资料**:品名、颜色、尺寸、规格、图片 —— 按供应商录入。

---

## I. 采购单 & 编号 (PO & Numbering)

**I1. ✅ PO 白标**:给供应商的 PO **不出现供应商抬头**,Deliver To = 客户地址(系统标准,所有供应商一样)。
**I2. ✅ 编号**:客户订单 OC{YY}{NNNN}、税票 INV{YY}{NNNN}、供应商 PO{YY}{NNNN} —— 全局共享序列,所有供应商一套。

---

## J. 应付账款 (Accounts Payable)

**J1. ✅ 供应商发票 + 付款**:每张 PO 可记供应商发票号、Mark paid(按供应商)。
- 待建:上传供应商发票 PDF + Finance "应付" 视图(和成本模块一起)。

---

## ⚙️ 技术债 / 根治方案(强烈建议,做了就一劳永逸)
现在很多"按供应商不同"的值是**写死、且散落在多处**,容易漂移(已踩过坑:同产品报价 $7,259 vs $7,260;laser 文案两处不一致;交期 3 处不一)。建议:
1. **建一个集中配置**:`供应商配置`(每家供应商一行,存:成本价、运费规则、各印刷方式 setup+单价、交期、起订量…)。
2. **共享代码**:MARGIN/GST/SHIPPING/SETUP_FEE/交期/brandingLabel/算价函数抽到**一个共享文件**,全站 import → 物理上不可能再漂移。
3. Create PO / 报价 / 结账都从这套配置取值 → 自动带成本/售价/交期,毛利自动算。

---

## ✅ 新供应商上线检查清单(照着勾)
- [ ] A1 录入成本价(按数量档)
- [ ] A3 确认数量档 & 起订量(E1)
- [ ] B1 录入可用印刷方式
- [ ] B2 录入各印刷方式 setup + 单价
- [ ] B3 确认新印刷方式归类(COL / Full Colour / 雕刻)
- [ ] B4 录入印刷区尺寸
- [ ] C1 设该供应商生产交期
- [ ] D1 设该供应商运费规则
- [ ] F1 选付款条件(Prepaid / Monthly)
- [ ] F2 填供应商邮箱/联系人(发 PO 用)
- [ ] G1 拿/标该供应商产品模板(出 proof 用)
- [ ] H1/H2 录入产品 SKU + 资料
