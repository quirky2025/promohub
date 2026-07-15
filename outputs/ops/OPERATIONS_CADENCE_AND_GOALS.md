# 运营目标 & 日/周/月检节奏 · 2026-07(基线:7 月第 1 周)

> 配套 ROADMAP_OVERVIEW.md(层次)/ WEEKLY_DASHBOARD.csv(记录)。
> 目标数字是**可调靶子**,不是军令状——每月复盘一次,按实际斜率调,但方向不许变。

---

## 三个月目标(至 2026-10 上旬)

| 指标 | 基线(7月) | 3 个月靶 |
|---|---|---|
| GSC Indexed | 115 | **600+**(sitemap 4,700 已提交,404 已修) |
| Organic impressions | ~250/周 | **1,500+/周** |
| Organic clicks | ~0.4/周 | **30+/周** |
| 目标词进前 20 | 0 | **3–5 个**(custom pens australia 等深化页主词) |
| 深化类目页 | 1(Pens 样板) | **12–15 页**(P1 全部) |
| 新落地页(颜色/场景) | 0 | **4–6 页** |
| 周询盘(organic 来源) | 未知(GA4 刚通) | 先摸清基线,后定靶 |
| 询盘首响 | — | **3 工作小时承诺 100% 兑现** |
| 评价体系 | 无 | **上线邀评,攒 10+ 条真实评价** |

## 六个月目标(至 2027-01 上旬)

| 指标 | 6 个月靶 |
|---|---|
| GSC Indexed | **2,000+** |
| Organic impressions | **8,000+/周** |
| Organic clicks | **150+/周** |
| 目标词进前 10 | **5–8 个**;前 20:15+ |
| 落地页体系 | L3/L4/L7 P1P2 全部上线(含 Teamwear) |
| Merchant Center | **已上线 + free listings 出数据**(见下) |
| Blog 内容 | 8–12 篇决策类(How to order 系列全齐) |
| 视频 | 5 条核心视频上线 |
| Email/复购 | 留资弹窗 + 自动确认 + reorder 提醒跑通 |
| quote→order 转化率 | 摸清基线 + 环比提升 |
| Google Ads | **仍不开**,除非上述数据齐且客单/转化率算得过账 |

---

## 日检(每天 10 分钟,上午固定时间)

1. **询盘/quote 收件箱**——3 工作小时承诺,新询盘当场处理或转报价
2. **订单异常**——新单、支付失败、可疑单
3. 网站冒烟测试(30 秒):打开首页 + 随机 1 个产品页,能开、图在、能加购即过
> 不做:SSL/服务器巡检(Vercel 托管)、全站产品巡查、竞品日盯——低产出仪式感,砍掉。

## 周检(每周一,约 1 小时)

1. **GSC 例行**:Performance 三数 → Indexing(盯 404 ↓、Indexed ↑)→ sitemap 状态 → 抽查 2–3 个深化页收录
2. **看板填行**(WEEKLY_DASHBOARD.csv):GSC + GA4 + 询盘数,环比箭头
3. **GA4 漏斗一眼**:product_view → quote_click → enquiry_submit 三段数
4. **本周产出**:深化/新建 3–5 页文案(运营主业,雷打不动)
5. 询盘 pipeline 过一遍:24/48/72h follow-up 有没有漏

## 月检(每月第一个周一,半天)

1. **目标 vs 实际**:上面两张表对一遍,偏差大的找原因、调靶或调打法
2. **Core Web Vitals / PageSpeed**(GSC 报告)
3. **Meta/schema 抽检**:新上页面 title/meta/结构化数据合规
4. **Keyword Map 复盘**:GSC query 数据回流,补词/换词/重归属(站越老这步越值钱)
5. **竞品扫一眼**(月度,不是每日):主要对手新页面/价格动作/排名变化
6. 每季度加:GEO 抽查(直接问 ChatGPT/Perplexity"澳洲定制笔哪家"看提没提我们)+ robots/AI 爬虫策略回看

---

## Google Merchant Center:什么时候进

**答案:条件触发,不是日期触发。** 满足以下全部就动手(预估 9 月前后):

- [ ] 价格体系稳定(margin 1.4 跑顺,无频繁改价)——基本已满足
- [ ] Shipping / Returns / Privacy / Terms 页面齐全且与站内实际一致(Merchant 会人工审)
- [ ] Organization schema 上线(公司名/logo/电话/地址)
- [ ] 产品数据字段齐:id / title / description / image / price / availability / brand(GTIN 促销品多数没有,用 identifier_exists=false 处理)
- [ ] 深化页/收录趋势健康(说明 Google 信任度在涨,feed 审核更顺)

**进场姿势**:先上 **free listings**(免费展示,零成本试水,B2B 也吃得到流量)→ feed 跑顺、无 disapproval → 数据积累 → 那时再评估 Shopping Ads(对应 ROADMAP 第 3 层)。
**准备工作可提前**:8 月让数据线按 Google product data spec 出一版 feed 草稿,运营对字段,开发挂 feed 端点。

---

## 关于小红书那套清单的定论(备查)
- 采纳:每日纪律、量化目标、节奏分层、竞品月度扫描
- 拒绝:批量注册账号 / 伪原创 / 论坛&FB 群发外链 / 友链交换 / 目录站群发 / 第 5 周上 Ads——过时且违反 Google spam policy + 我们的红线
- 替代:第三方提及走合法路径 = GBP + 真实评价 + 行业目录精选 + GEO(Playbook 第 12 类)
