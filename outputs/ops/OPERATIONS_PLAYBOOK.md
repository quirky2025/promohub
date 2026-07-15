# QuirkyPromo 运营 Playbook（全面开始运营 · 2026-07）

> 主线漏斗:**流量 → 产品浏览 → Enquiry / Quote → Artwork Proof → Order → Repeat**
> 一句话:**先让 Google 带来对的人 → 再让网站帮他们找到产品 → 再让后台把询盘变成订单 → 再把买过的人变复购。**
> 用法:10 大类,每类含「目标 / 一步步怎么做 / 用什么 / 看什么」。末尾有 90 天优先顺序 + 每周看板。原有 backlog(弹窗/live chat/定制器/Teamwear/Merch Pack)已归入对应类。

---

## 1. SEO 基础运营(持续维护技术 SEO 资产)
**目标**:不是"做完就不管",而是持续观察 Google 是否真的开始理解这些页面。

**一步步怎么做**
1. 每周固定时间打开 **Google Search Console(GSC)**,看:Impressions / Clicks / 平均排名趋势。
2. 进 **Pages → Indexing** 报告,重点盯:`Crawled - currently not indexed`、`Duplicate canonical`、`Discovered - not indexed` 三类数量是涨还是跌。
3. 抽查 3–5 个产品页 + 颜色集合页,用 **URL Inspection** 确认:已收录、canonical 正确、结构化数据无错。
4. 确认 **sitemap** 状态 = Success、URL 数对得上;有掉 URL 就查原因。
5. 把每周数字记进"数据看板"(第 10 类),对比上周。发现异常(canonical 乱、集合页迟迟不收录)开一条待办给开发线。

**用什么**:Google Search Console、我们已有的 sitemap / canonical 体系。
**看什么**:收录页数、not indexed 数、产品页 impressions/clicks、颜色集合页收录率。

---

## 2. Keyword / Landing Page 运营(每个页面都有关键词归属)
**目标**:每个页面明确对应一个搜索意图词;逐步扩出高意图落地页。

**现有归属(继续维护)**
- Custom Pens Australia → 类目页 · Black Promotional Pens → 颜色集合页 · Custom White Tote Bags → 子类目颜色页 · Corporate Gifts → 场景页 · Ambassador Pen → 产品页。

**一步步怎么做**
1. 建一张 **Keyword Map 表**(Google Sheet):列 = 关键词 / 意图 / 目标 URL / 状态(已上/待做)/ 月搜索量 / 当前排名。
2. 每批挑 5–10 个高意图词,先做**颜色 + 子类目页**(数据现成、转化高):如 Black Custom Tote Bags、White Corporate Polos。
3. 逐步扩这些类型的落地页:场景页(Trade Show Giveaways)、行业页(Hospitality Uniforms)、低 MOQ 页、Fast Turnaround 页、Eco 页、Corporate Gifts 页。
4. 每个落地页标准结构:H1 含关键词 → 一段意图文案 → 精选产品网格 → 相关 collections 内链 → FAQ。
5. 上线后进 GSC 观察 4–8 周,收录+有 impression 才算成功,再迭代标题/文案。

**关联 backlog**:Teamwear 从 Apparel 拆出来 + `/custom-teamwear-australia` 落地页(高意图词 custom teamwear / team uniforms / sports kits australia)。
**用什么**:Keyword Map(Sheet)、现有 `url_pages` / 集合页体系。
**看什么**:落地页数、每页收录状态、目标词排名。

---

## 3. Filter / Product Discovery(前台快速找到产品)
**目标**:让客户在类目页快速筛到产品;**精选组合才做成 SEO landing page,不是全部给 Google 收录**。

**一步步怎么做**
1. 类目页左侧 filter 维度做齐:**颜色 / MOQ / 材质 / 印刷方式 / Lead time / 品牌 / 用途 / 价格区间 / Eco / 本地现货**。
2. Filter 默认**不生成可索引 URL**(避免重复内容);只有"精选组合"(如 Black + Tote)才手工做成独立可索引 landing page(接第 2 类)。
3. 服装类目补 AS 已导入的 facet:Gender / Brand / Material / Print method(数据现成)。
4. 移动端 filter 收起、点开再展(已在 CategoryFilter 做过,继续保持)。

**用什么**:`components/FilterSidebar` / `CategoryFilter` / `lib/filterFacets`。
**看什么**:类目页 → 产品页点击率、filter 使用率、无结果率。

---

## 4. Product Page 转化(产品页持续优化)
**目标**:每个产品页把"价格/MOQ/颜色/印刷方式/上传logo/proof流程"讲清,推动 view → quote → enquiry。

**一步步怎么做**
1. 保证每页 6 要素清楚:**价格、MOQ、颜色、印刷方式、上传 logo / Request Quote 明显、Similar products 有用、Artwork proof 流程可见**。
2. AS 计算器 PDP 已做到(逐位置计价 + Get a Quote 弹窗);TRENDS/PB 标准页对齐同样要素。
3. 埋点三段转化:**product view → quote click → enquiry → order**(用 GA4 事件)。
4. A/B 小优化:CTA 文案、Get a Quote 位置、Similar products 排序。

**关联 backlog**:**产品在线定制器 / web-to-print**(Zazzle 式,把 logo 放进印刷区实时预览)——大工程,build(Fabric.js/Konva)vs buy(Zakeke/Kickflip),和 artwork/proof 线相连。属产品页转化的进阶项,排后面。
**用什么**:ProductClient / ASColourClient、GA4 事件。
**看什么**:view→quote、quote→enquiry、enquiry→order 三个转化率。

---

## 5. Google Merchant Center(数据稳了再上,别太早)
**目标**:价格/图片/退货运费政策稳定后,把产品 feed 推上 Shopping surface。

**一步步怎么做**
1. **前置条件先满足**:价格准、图片齐、退货/运费政策页上线且和站内一致。
2. 建 Product feed(id/title/price/image/availability/GTIN/brand…),字段严格对齐规范。
3. 站内结构化数据(Product JSON-LD)和 feed 对齐(我们 AS 已发单价 Offer,TRENDS 是 AggregateOffer)。
4. Merchant Center 建账号 → 上 feed → 修 disapproval → 观察 listings。
5. **参考官方规范**(务必按它来,避免拒登):
   - Ecommerce SEO: https://developers.google.com/search/docs/specialty/ecommerce
   - Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
   - Merchant product data spec: https://support.google.com/merchants/answer/7052112
**看什么**:feed 通过率、disapproved 数、Shopping impressions/clicks。

---

## 6. 内容运营(写能带询盘的内容,不是纯博客)
**目标**:内容解决"怎么下单/怎么选印刷/送什么",并**内链回产品和 collections**。

**一步步怎么做**
1. 先写"决策/操作"类(带询盘力最强):How to order custom merchandise、Artwork proof guide、Logo printing methods explained、Screen print vs pad print vs laser engraving。
2. 再写"选品灵感"类:Best corporate gifts for staff、Trade show giveaway ideas、Welcome kit ideas。
3. 每篇结尾 + 正文都内链到相关产品页 / collection / Request Quote。
4. 每篇挂一个目标词(接第 2 类 Keyword Map)。

**看什么**:内容页 organic clicks、内容页 → 产品页点击、内容页带来的 enquiry。

---

## 7. 视频 / Visual 运营(降疑虑、提转化,最该做)
**目标**:用短视频把流程讲清,放在首页/FAQ/产品页/quote 页。

**一步步怎么做**
1. 拍 5 条核心短视频:**How to Order、How Artwork Proof Works、How to Upload Logo、Corporate Gift Ideas、Merch Store explainer**。
2. 每条 30–60 秒,字幕 + 品牌色,托管(YouTube/自托管)后嵌入。
3. 投放位:首页 hero 下、FAQ、产品页 proof 区、Get a Quote 弹窗旁。

**看什么**:视频播放/完成率、看过视频的页面转化 vs 没看过。

---

## 8. Enquiry / Sales 运营(询盘来了要有流程)
**目标**:流量来了别漏——自动确认 + 当天跟进 + 分级 + 定时 follow-up。

**一步步怎么做**
1. 询盘/quote 提交后 **5–10 分钟内自动确认**(邮件/短信自动回执)。
2. **当天人工跟进**;高价值(大量/大客户)标 **hot**。
3. 每条记录:buying trigger、产品/数量/deadline。
4. **报价后 24 / 48 / 72 小时**三次 follow-up(模板化)。
5. 用后台 **CRM / quote pipeline** 管全流程(不然流量来了也漏)。

**关联 backlog**:**Live Chat + AI 自动回复 + 转人工**(Intercom Fin / Tidio Lyro / Crisp,用我们 FAQ 喂 AI,转人工 + 手机 App 接;前提有人值守)——是询盘入口的一部分。
**看什么**:首次响应时间、enquiry→order 率、hot 客户转化率。

---

## 9. Email / Repeat 运营(B2B 价值在复购)+ Merch Store / Merch Pack
**目标**:买过一次就进复购系统;用 Merch Store / Merch Pack 把客户长期留住。

**一步步怎么做（Email/CRM）**
1. 建自动化流:quote follow-up、abandoned enquiry(未成单跟进)、reorder reminder(按上次周期)。
2. 季节性群发:EOFY gifts、Christmas gifts、event reminders、seasonal corporate gifts。
3. 名单来源接上 **留资弹窗 + 首单券**(弹窗收邮箱/手机 → 首单 >$500 ex-GST 立减 10%;唯一要写代码=券核销接结账;⚠ 澳洲 Spam Act 合规:同意勾选 + 可退订)。

**Merch Store / Merch Pack（本页 + 产品化,均属运营)**
4. **YOUR MERCH STORE 页(还没做)**:给企业客户的**品牌专属订购门户**——他们自己/员工上去按预设产品和 logo 下单,我们统一生产发货。先做**说明页 + Enquiry**(讲能做什么、怎么开通),后期再做真正的专属 store 系统。属复购/长期绑定的核心。
5. **KIT / MERCH PACK(成套礼盒/Welcome Kit)**:把产品打包成套(新人礼盒、活动礼包、客户答谢盒),**拉高客单价 + 便于复购下单**。和现有 Collections 合并、别重复(见 `MERCH_PACK_PLAN.md`)。这是"运营化的产品",直接喂给 Email/季节性活动。

**看什么**:复购率、reorder 数、弹窗留资数、券核销数、Merch Store enquiry 数、礼盒客单价。

---

## 10. 数据看板(每周看)
**目标**:一张表看全,驱动下一步。

**每周记录**:Organic impressions / Organic clicks / Top queries / Top landing pages / Indexed pages / Quote enquiries / Enquiry source / Quote-to-order rate / Average order value / Gross margin / Response time。

**一步步怎么做**
1. 建一个 Google Sheet 每周同一天填(GSC + GA4 + 后台数据)。
2. 每格记本周 + 环比箭头;异常项直接开待办。
3. 每月回顾:哪类落地页/内容真的带来了询盘和订单,资源往那边倾斜。

---

## 90 天优先顺序(建议)
1. **Search Console + sitemap/indexing 监控**(第1类)——立刻、每周
2. 完成 **TRENDS 产品页/颜色页 SEO 观察**(第1/2类)
3. 做**第一批 keyword landing pages**:colour + subcategory / use case(第2类)
4. 做 **filter 地基 + 前台筛选**(第3类)
5. 做 **How to Order + Artwork Proof 视频**(第7类)
6. 做 **enquiry / quote 跟进流程**(第8类)——含 live chat 选型
7. 准备 **GFL 上线前 SEO pipeline**(第2类)
8. 再开 **Merchant Center**(第5类,数据准了才上)
9. 做 **email / CRM / reorder + 留资弹窗**(第9类)
10. 扩**更多供应商 + 更多 landing pages**(第2类)

> 并行小事:留资弹窗建议**尽早起**(攒名单越早越值);YOUR MERCH STORE 说明页可以早点上(先 Enquiry 版)。

---

## 归档:相关已有文档
- `OPERATIONS_BACKLOG.md`(弹窗/live chat/定制器 细节)
- `CATALOG_BACKLOG.md`(Teamwear 拆分 / PB 导入 bug)
- `MERCH_PACK_PLAN.md`(礼盒/套装规划)
- `HANDOVER_ASCOLOUR.md`(AS PDP 现状 + 待办)

---

## 11. 补充地基 / 资产(前面漏的,要补上)

### 11.1 FAQ SEO（重要 · 之前只当 AI 素材,没当 SEO 资产）
**目标**:用 FAQ 抓**长尾问句词** + 支撑转化 + 喂 live chat AI。三重收益。
**一步步怎么做**
1. 建/扩 FAQ 页,按主题分组:下单流程、MOQ、Lead time、Artwork/Proof、印刷方式、运费/退货、付款、Eco。
2. 每条标题用**真实买家问句**(How long does printing take? What's the minimum order? Can I see a proof first?)。
3. 加 **FAQPage 结构化数据**(schema.org/FAQPage)——即使 Google 富媒体收窄,仍利于理解+部分展现,且直接喂 AI 客服。
4. FAQ 答案**内链**回相关产品 / collection / 落地页。
5. 产品页放一个"该产品相关 FAQ"小块(印刷方式/交期/MOQ)。
**看什么**:FAQ 页 organic clicks、问句词排名、FAQ→产品点击。

### 11.2 Reviews / 评价 / 客户背书（B2B 转化关键 · 现在没有）
**怎么做**:订单后自动邀评 → 展示 testimonials → 加 **Review / AggregateRating 结构化数据**;做**企业 logo 墙**(合作过的客户)+ 案例(礼盒/队服),放首页/产品页/quote 页降疑虑。
**看什么**:有评价 vs 没评价页面的转化差。

### 11.3 Analytics & 转化追踪（地基 · 先埋好才谈优化）
**怎么做**:GA4 装好 + 关键事件 product_view / quote_click / enquiry_submit / order;漏斗对齐第10类看板;来源归因(organic/direct/referral/paid)。**没埋点 = 后面所有优化都在盲猜。**

### 11.4 技术健康 / Core Web Vitals（持续）
**怎么做**:每月看 GSC 的 Core Web Vitals + PageSpeed;图片已上 R2/webp,继续盯 LCP/CLS。慢页面直接掉排名和转化。

### 11.5 信任 & 政策页（也是 Merchant Center 前置）
**怎么做**:Shipping、Returns/Refund、Privacy、Terms 页齐全且与站内/feed **一致**(Merchant 会查);加 **Organization 结构化数据**(公司名/logo/电话/地址)。

### 11.6 内链策略（把权重导给重点页）
**怎么做**:内容→产品/collection、产品→相关产品/落地页、集合页互链;重点落地页多拿内链,别让好页成孤岛。

### 11.7（以后)本地 & 付费渠道
- **Google Business Profile**:抓 "promotional products [城市]" + 本地信任。
- **Google Ads / Shopping**:地基 + Merchant 稳了再上,高意图词先跑小预算测。

> 归属:11.1 FAQ SEO / 11.6 内链 属【地基~运营之间】;11.3 埋点 / 11.4 技术健康 / 11.5 政策页 属【地基】;11.2 评价 属【运营】;11.7 属【支撑/以后】。

---

## 12. GEO — AI 答案引擎优化（Generative Engine Optimization）
**目标**:客户问 AI(ChatGPT / Perplexity / Google AI Overviews / Gemini / Copilot)"澳洲哪里定制 X / 最好的促销品供应商" 时,让 AI **认识 → 引用 → 推荐**我们。

**核心认知**:GEO ≈ **把 SEO 地基做扎实 + 补"被引用 / 实体清晰 / 评价"**。约 80% 和你 90 天地基重合,不用当独立大工程。

**GEO 特有的额外动作**
1. **答案式内容**:FAQ、how-to、对比表(screen vs pad vs laser)——LLM 直接抽这些(接 11.1 / 第6类)。
2. **实体 & 品牌清晰**:About 页 + 一致 NAP(名称/地址/电话)+ **Organization schema**,让 AI 明确"你是谁/做什么/在澳洲"(接 11.5)。
3. **被别处提及/引用**:目录、行业站、Google 评价、媒体。LLM **很看重第三方提及**——"被谈论"比传统 SEO 权重更高。
4. **可抽取的事实**:MOQ / 交期 / 价格区间 / 材质 / 印刷方式,清楚写在页面(PDP 已做到 ✅)。
5. **评价 & 口碑**:AI 推荐"靠谱供应商"部分看评价情感(接 11.2)。
6. **AI 爬虫准入(robots.txt)**:决定放不放 GPTBot / PerplexityBot / Google-Extended。想要 AI 可见,一般放行带转介的(Perplexity / Google),这是取舍。
7. **监控 AI 转介**:GA4 加来源分组(chatgpt.com / perplexity.ai 等)+ 盯 Google AI Overviews 里有没有你。
8. (可选,新)**llms.txt**:有站点加它引导 LLM,尚早,低优先。

**一步步(务实版)**
1. 先做好 **11.1 FAQ + 11.2 评价 + 11.5 Organization schema**(一箭双雕,SEO+GEO 都吃)。
2. 内容写成"**直接回答问题 + 清楚事实/对比表**"的形式。
3. 布局**第三方提及**:Google Business Profile、行业目录、拿几条真实评价。
4. GA4 加 **AI 来源分组**,每月看 AI 转介数 + AI Overview 曝光。
5. **robots.txt** 定 AI 爬虫策略(可先放行 Google-Extended + Perplexity,观察效果)。

**看什么**:AI 转介流量(chatgpt/perplexity 来源)、Google AI Overviews 曝光、被 AI 提及/推荐的次数(手动抽查:直接去问 AI"澳洲定制 X 供应商")。

**层归属**:【地基~运营之间】,和 11.1 / 11.2 / 11.5 强绑定。
**注**:GEO 变化很快,**每季度回看一次最佳实践**再微调。
