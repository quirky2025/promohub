# 需求:自建挖词器 v1(交开发线,低优先级——GA4/FAQ/301 之后)· 2026-07

**目的**:半自动生成每个品类的候选词表,替代人肉三件套。产出 CSV,运营拿去 Planner 补量。

## 输入
`seeds.csv`:品类种子词(如 custom pens / promotional pens / engraved pens)

## 三个数据源(按此顺序实现,每个都独立可用)

### 1. Google Autocomplete 扩展(核心,先做这个)
- 端点:`https://suggestqueries.google.com/complete/search?client=firefox&gl=au&q={seed}%20{expansion}`
- 扩展策略:每个 seed × {空格, a–z, 修饰词表} 修饰词表 = australia / bulk / with logo / cheap / no minimum / for business / sydney / melbourne / eco
- 问句模式:{how much do, best, where to buy} × seed
- **限速:每请求间隔 ≥2s,单品类 ≤100 请求**,UA 正常,失败就跳过(非官方端点,别硬打)
- 已人肉验证可用(2026-07-05,gl=au 参数生效)

### 2. GSC API 拉自有 query(最有价值,第二做)
- Search Console API,property 已验证,拉近 90 天 query + page + impressions + position
- 每周日自动跑,追加进一张累计表(这是我们的私有真实词库,越攒越值钱)
- 需要:Google Cloud 项目 + Search Console API 启用 + OAuth/服务账号(Lily 授权一次)

### 3. 竞品 title 抓取(第三做,可选)
- 竞品清单(运营维护):promotionalpens.com.au / expresspromo.com.au / pensonly.com.au / paylesspromotions.com.au / promotionsonly.com.au / vistaprint.com.au / promoshop.com.au
- 只抓公开类目页的 <title> 和 <h1>,频率每月一次,尊重 robots.txt

## 输出
`kw_{category}_{date}.csv`:keyword / 来源 / 出现次数 / 建议归属(空,运营填)
自动过滤:含 canada|uk|nz|ireland|toronto|officeworks 等非目标词直接标记剔除列。

## 红线
- 不爬 Google SERP(排名数据不做,违反 TOS 且易封)
- autocomplete 限速必须遵守
- 竞品只抓公开页面 title,不抓价格库存做镜像
