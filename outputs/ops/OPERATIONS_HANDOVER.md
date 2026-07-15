# QuirkyPromo 运营交接（给专职运营 chat）· 2026-07

> 这份文档让你**接手运营**:上半部 = 网站全貌(建立地形认知),下半部 = 完整运营清单 + 业务红线 + 分工。
> 深度分解见配套 `OPERATIONS_PLAYBOOK.md`(12 大类的逐步做法)。**代码不由运营改**(见 Part D)。

---

# Part A — 网站全貌(先读)

## A1 品牌 / 定位
- **QuirkyPromo**(quirkypromo.com.au)—— 澳洲 **B2B 促销品 / 定制服装**电商:把客户 logo 印/绣到产品上,面向企业礼品、活动、员工装、队服。
- 卖点:13 年经验、免费数字打样(proof)、澳洲全境 $30 flat shipping、质量保证。
- 品牌视觉:**NAVY `#1B2A4A` + GOLD `#C9A96E`**(无米色/beige)。电话 02 9477 4748,邮箱 hello@quirkypromo.com.au。
- ⚠ **不做虚假宣传**(例:不写 "Aussie Owned",老板非澳籍);不显示假库存/假紧迫。

## A2 技术栈 / 基建
- **Next.js 16(App Router)+ Supabase(Postgres + PostgREST + Auth)+ Vercel** 部署。
- 图片在 **Cloudflare R2**(webp,多尺寸);**自建矢量→PNG 转换器**(Render,artwork proof 用)——已退役 Cloudinary。
- SEO 基建已打好:canonical、**Product JSON-LD**、sitemap、扁平类目 URL(`url_pages` 表)、颜色变体 noindex+canonical 合并。

## A3 供应商 / 品牌线 & 两种产品模型(**关键**)
- **供应商**:TRENDS(TRENDSWEAR)、PromoBrands、LOGOLINE、**AS Colour**(新,印刷定制服装)、GFL(Gear For Life,**已取消/下架**)。
- **两种产品模型**(运营写文案/落地页要分清):
  1. **标准品**(TRENDS/PB/LOGOLINE):**可买白款** + 按数量阶梯定价 + 印刷作为附加项。用 `ProductClient` 详情页。
  2. **印刷定制品**(AS Colour,以后 Gildan):`decoration_model='calculator'`,**只印不卖白款**,MIN 20,逐位置印刷计算器 + Get a Quote。用 `ASColourClient` 详情页。
- 计价通用:**margin 1.4**(售价=成本×1.4,ex-GST)、**GST 10%**、**$30 flat 运费**。AS 交期 **7–10 business days(after artwork approval)**。

## A4 前台页面地图
- **导航**(顶):All Products、Collections、Brands、Eco、New Arrivals、Sale、Australian Made、Indent、Get a Quote。
- **产品**:`/products/[slug]`(PDP)。**类目/子类目**:扁平 `/[slug]` + `/category/...`;**颜色集合页**(如 black-tote)。**搜索** `/search`(款号精确优先)。
- **Catalog** `/catalog`、**Collections**、**Eco / Australian Made / Sale / New Arrivals / Indent** 落地。
- **公司/支持**:/about、/contact、/reviews(Testimonials)、/faq、/refund-return、/track-order。
- **Supply Chain**:/supply-chain/{sourcing, logistics, inspection, warehousing, compliance, quote}。
- **Services**:/services/decoration-methods、**/services/merch-store(YOUR MERCH STORE — 还没做,先做说明+Enquiry 版)**、/resources/pms-chart。
- **法务**:/privacy、/sales-terms、/website-terms。
- (页面清单以实际代码/后台为准,不确定的跟开发线核对。)

## A5 后台 / 系统能力(已有)
- Admin 区:**artworks(打样/客户 logo 上传替换)**、**sourcing orders + finance(下单/账本/P&L)**、**quote-builder**、产品管理。
- **询盘/报价**:前台 Get a Quote → `POST /api/quote`;购物车 + Place Order/Pay。
- **artwork 流程**:客户上传 logo → 自建转换器出 PNG → 存 R2/Supabase → 生成 proof PDF。

## A6 数据模型要点(运营常用字段)
- `products`:name、slug、supplier、supplier_sku/supplier_code、category/subcategory、brand、gender、`colours`(jsonb)、`specs`(jsonb 数组 `[{name,value}]`:Fit/Fabric/Care/Credentials…)、`size_chart`、`size_pricing`、`print_methods`、`material_tags`、**`decoration_model`**、`is_published`、`margin`、`min_qty`、**`seo_description`/`meta_description`**(SEO 文案就在这)。
- `product_colours`(每色图)、`pricing_tiers`(base_price)、`decoration_options`、`product_variants`、`url_pages`(扁平 URL/canonical)。

## A7 现状:已上 / 进行中 / 未做
- ✅ **已上/稳定**:TRENDS/PB/LOGOLINE 产品线、SEO 基建、artwork proof、R2 图片、搜索。
- 🔶 **进行中**:**AS Colour 441 款**印刷定制 PDP(功能做完,`is_published=false` 暂存,合并+发布后上线);name/slug 有 Women's 抓取脏数据待修 SQL(见 `HANDOVER_ASCOLOUR.md`)。
- ⬜ **未做**:YOUR MERCH STORE 页、Merch Pack/礼盒系统、Teamwear 从 Apparel 拆分、留资弹窗、Live Chat、Merchant Center、评价系统、GA4 埋点(部分)、FAQ SEO、Google Business。

---

# Part B — 完整运营清单(12 大类 · 可执行)

> 详细逐步在 `OPERATIONS_PLAYBOOK.md`;这里给每类「目标 + 关键动作 + 看什么」。分层:【地基】先做 → 【运营】发力 → 【支撑】贯穿。

**【地基】**
1. **SEO 监控**:每周 GSC 看 impressions/clicks、Indexing(crawled-not-indexed / duplicate canonical)、sitemap、抽查产品页+颜色页收录。→ 看:收录数、not-indexed 数。
2. **Keyword / Landing**:每页有关键词归属;建 Keyword Map;先做**颜色+子类目页**,再扩场景/行业/低MOQ/fast-turnaround/eco 页(含 Teamwear 拆分+落地页)。→ 看:落地页收录、目标词排名。
3. **Filter / Discovery**:类目页 filter 齐(颜色/MOQ/材质/印刷/交期/品牌/用途/价/eco);filter 默认不可索引,精选组合才做 SEO landing。→ 看:类目→产品点击率。
4. **Product Page 转化**:每页 6 要素清楚(价/MOQ/颜色/印刷/上传logo/proof);埋点 view→quote→enquiry→order。进阶:在线定制器(build vs Zakeke)。→ 看:三段转化率。

**【运营】**
6. **内容**:写"决策/操作"类(How to order、Artwork proof guide、印刷方式对比)+"选品灵感"类;内链回产品/collection;每篇挂目标词。→ 看:内容→产品点击、带来的 enquiry。
7. **视频**:5 条(How to Order / Proof / Upload Logo / Gift Ideas / Merch Store),放首页/FAQ/产品页/quote。→ 看:看过 vs 没看过的转化。
8. **Enquiry / Sales**:提交后 5–10 分钟自动确认、当天人工跟进、hot 分级、24/48/72h follow-up、CRM/quote pipeline。**Live Chat + AI(parked,有人值守再上,用 FAQ 喂 AI + 转人工)**。→ 看:首响时间、enquiry→order。
9. **Email / 复购 + Merch Store / Merch Pack**:自动化(quote follow-up / abandoned / reorder)、季节群发(EOFY/Christmas)、**留资弹窗+首单券**(>$500 立减 10%,券核销要写代码,⚠ Spam Act 合规);**YOUR MERCH STORE**(企业专属订购门户,先说明+Enquiry)、**Merch Pack**(成套礼盒,拉客单价+复购)。→ 看:复购率、reorder、留资数、礼盒客单价。

**【支撑】**
5. **Merchant Center**:数据准了才上——feed(id/title/price/image/availability…)对齐官方规范 + 站内结构化数据一致。→ 看:feed 通过率、Shopping 曝光。
10. **数据看板**:每周一张 Sheet:organic impressions/clicks、top queries/landing、indexed pages、quote enquiries、enquiry source、quote→order、AOV、gross margin、response time。

**【补充地基/资产(11)】**
- **11.1 FAQ SEO**:FAQ 页按主题分组 + 真实问句标题 + **FAQPage schema** + 内链 + 产品页放相关 FAQ(SEO/GEO/AI客服 三吃)。
- **11.2 评价/背书**:邀评 + Review schema + 企业 logo 墙 + 案例。
- **11.3 GA4 埋点**:关键事件先埋好(没埋=盲猜)。
- **11.4 技术健康**:每月 Core Web Vitals / PageSpeed。
- **11.5 信任/政策页**:Shipping/Returns/Privacy/Terms 一致 + Organization schema(也是 Merchant 前置)。
- **11.6 内链策略**:权重导给重点落地页。
- **11.7 本地/付费(以后)**:Google Business Profile、Ads/Shopping。

**【GEO(12)】AI 答案引擎优化**
- 让 ChatGPT/Perplexity/Google AI Overviews 认识+推荐你。**≈ SEO 地基做扎实 + 补"被引用/实体清晰/评价"**,80% 和地基重合。
- 额外:答案式内容、Organization/实体清晰、**第三方提及(目录/评价/媒体)**、可抽取事实、robots.txt 定 AI 爬虫、GA4 看 AI 转介。
- **站内 chatbot 与 GEO 是两条线,互不依赖**;chatbot 目前 parked(之前因图片 impression 高关过相关的,与 GEO 无关)。
- 变化快,每季度回看。

## 90 天优先顺序
1 GSC 监控(立刻) → 2 TRENDS 产品/颜色页 SEO 观察 → 3 第一批 colour+subcategory / use-case 落地页 → 4 filter 地基 → 5 How to Order + Proof 视频 → 6 enquiry/quote 跟进流程(含 live chat 选型) → 7 GFL/新供应商上线前 SEO pipeline → 8 Merchant Center → 9 email/CRM/reorder + 留资弹窗 → 10 扩更多供应商 + landing pages。
> 可并行早起:**留资弹窗**(越早攒名单越值)、**GSC 监控**、**FAQ + GA4 埋点**(一箭多雕)、**YOUR MERCH STORE 说明页**。

---

# Part C — 运营必须知道的业务事实 & 红线
- **MOQ**:AS 印刷定制 = 20 起;标准品看各自 min_qty。
- **计价**:售价 = 成本 × **1.4**(ex-GST);**GST 10%**;**运费 $30 flat / 澳洲地址**;setup 单独一行(不摊进单价)。
- **交期**:印刷定制 **7–10 business days after artwork approval**;Indent(工厂直)另议。
- **AS 是"只印不卖白款"**,起价 = 衣服 + 最便宜印刷("From $X")。
- **混色混码**:同色可混尺码凑 MOQ;**不可混颜色**(2026-07-05 Lily 确认)。
- **Credentials**(AS):amfori / vegan / UPF50+ / Australian Cotton(有 logo)。
- **合规**:营销邮件/短信走**澳洲 Spam Act 2003**(明确同意 + 发件人标识 + 可退订)。
- **红线**:❌ 假宣传(不写 Aussie Owned)❌ 假库存/假紧迫 ❌ 米色/beige(只用 navy+gold)❌ 未核实就报具体交期/库存。

---

# Part D — 分工边界(避免上次的事故)
- **运营 chat(你)= 做运营**:SEO/GEO 策略、关键词/落地页规划、内容/视频/FAQ 文案、询盘/email/复购流程、看板、Merchant/评价规划。产出**文案、清单、Sheet、规划文档**。
- **不碰代码文件**(`app/`、`lib/`、组件)。需要页面/功能改动 → **写清"改哪个页面、要什么效果、放什么文案",交给开发/总控那条 chat 实现**。
- **数据/SQL** → 交给数据/上新品那条 chat。
- **任何 chat 不得删除/移动 outputs/ 里非自己创建的文件**(2026-07-05 新增:开发线清理误删过一批运营文档)。
- 原因:之前多条 chat 同改一个文件互相覆盖,丢过一整天活。**单一来源、各管一段。**

---

# Part E — 相关文档(2026-07 归档后路径,相对 `outputs/`,总索引见 `README_INDEX.md`)
- `ops/` —— 运营主线:本文档、`OPERATIONS_PLAYBOOK.md`(12 大类详版)、`OPERATIONS_CADENCE_AND_GOALS.md`(3/6月目标+日周月检)、`ROADMAP_OVERVIEW.md`(四层全貌)、`WEEK1_ACTIONS.md`、`WEEKLY_DASHBOARD.csv`、`LANDING_PAGE_MAP.csv`、`KEYWORD_MAP.csv`。
- `dev_requests/` —— 交开发/数据线需求包,入口 `DEV_HANDOVER_WEEK1.md`;含 GA4 / sitemap / 301 / FAQ / meta / 挖词器规格。
- `categories/{品类}/` —— 每品类深化包:文案 + 词表(首个:`categories/pens/`)。
- 仓库根目录 `MERCH_PACK_PLAN.md` 仍在;`OPERATIONS_BACKLOG.md`/`CATALOG_BACKLOG.md`/`ascolour/HANDOVER_ASCOLOUR.md` 于 2026-07-05 误删事故丢失,需要时找原 chat 线重建。
