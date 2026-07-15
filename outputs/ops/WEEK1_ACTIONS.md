# 运营第一周具体动作清单(WEEK 1)· 2026-07(2026-07-05 恢复重建,含执行状态)

> 配套 `OPERATIONS_HANDOVER.md`(先读)/ `OPERATIONS_PLAYBOOK.md`(深度做法)。
> 本周三件事:**① GSC 建起来 ② GA4 埋点规格写给开发 ③ FAQ 首批 15 条**。都属【地基】,互相独立可并行。
> ⚠ 分工提醒:运营只产出**文档/规格/文案**;涉及代码写清需求交开发线。

---

## ① GSC 每周监控 —— ✅ 已建立
- Domain property 已存在(quirkypromo.com.au,不带前缀那个;另有一个误建的空壳 URL 前缀资源,无视或删除)。
- sitemap.xml 已提交,Success;动态 sitemap 上线后已重提交,核对 Discovered → 4,700+。
- 基线(2026-07-06 周):impressions 3K/3mo、clicks 5/3mo、avg position 52.4、Indexed 115、Not indexed 1.14K。
- **收录诊断结论**:Not indexed 中 945=旧 URL 404(改版旧地址+远古 PHP 地址,修复见 `REDIRECT_404_FIX_REQUEST.md`)、193=Crawled not indexed(年轻站正常)、5=零星。
- **每周一例行**(固定):Performance 三数 → Indexing 三类涨跌 → URL Inspection 抽查 3–5 页 → sitemap 状态 → 填 `WEEKLY_DASHBOARD.csv` → 异常开待办。

## ② GA4 埋点 —— 🔶 进行中
- Property 已建,**Measurement ID:G-06J4WRFMLY**;规格见 `GA4_TRACKING_SPEC.md`(v2)。
- 基础 tag 已验证 ✅;purchase 已触发 ✅;product_view / quote_click / enquiry_submit / add_to_cart 待开发补齐后 Realtime 验收。
- Lily 后台待做:Key events(enquiry_submit、purchase)、4 个自定义维度、AI 来源分组、(事件通后)内部流量过滤。
- ⚠ 2026-07-05 测试下单一笔,后台记得取消。

## ③ FAQ 首批 15 条 —— ✅ 文案定稿
- 定稿见 `FAQ_CONTENT.md`(15 条 + 分组 + 内链 + FAQPage schema 需求,已交开发线)。
- 口径(均 Lily 确认):价格 **ex-GST**;报价**当天回复(工作日)**;**同色可混尺码、不可混颜色**;第 13 条上线前与 /refund-return 核对。

---

## 本周完成标准
- [x] GSC 验证 + sitemap + 看板基线
- [x] GA4 property + 埋点需求文档交开发线
- [x] 15 条 FAQ 定稿(3 条口径已确认)+ 页面需求交开发线
- [ ] GA4 六事件 Realtime 验收全通(等开发补埋点)
- [ ] 下周一第一次例行,填看板第二行 + 盯 404 数下降

## 衍生待办(第一周新增)
- `REDIRECT_404_FIX_REQUEST.md` —— 945 个旧 URL 301/410(交开发线;部署后 GSC 点 Validate Fix)
- Keyword Map 首批词(90 天顺序第 2/3 条,运营线进行中)
- GA4 内部流量过滤(事件全通后做)
- 11.2 评价系统(GSC Product snippets 邮件提示 aggregateRating/review 缺失——非关键,评价系统上线时一并解决,**不造假评分**)
