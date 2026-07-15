# GA4 埋点需求(交开发线)· 2026-07(v2,2026-07-05 恢复重建 + 补 source_location 枚举)

> 来源:WEEK1_ACTIONS.md ②。运营已定义事件,开发实现。Property 已建(时区 Sydney,货币 AUD)。
> 状态:基础 tag 已上线验证 ✅;purchase 已触发 ✅;product_view / quote_click / enquiry_submit / add_to_cart 待部署或待验证。

## 接入
- **Measurement ID:`G-06J4WRFMLY`**(建议放环境变量,如 `NEXT_PUBLIC_GA_ID`)。
- Next.js App Router 全站接入 GA4(gtag.js 或 @next/third-parties)。
- 所有金额参数 **ex-GST**,`currency: "AUD"`。

## 首批事件(6 个)

| # | 事件名 | 触发 | 参数 |
|---|---|---|---|
| 1 | `page_view` | GA4 自动 | — |
| 2 | `product_view` | PDP 加载(ProductClient 和 ASColourClient 都要) | `product_slug`, `supplier`, `decoration_model`, `category` |
| 3 | `quote_click` | 点击 Get a Quote / Request Quote(**全站每个入口都埋**) | `product_slug`(如有), `source_location` 枚举:`nav`(顶部导航)/ `pdp`(产品页)/ `category`(类目页)/ `landing`(落地页)/ `cart`(购物车)/ `footer`(如有) |
| 4 | `enquiry_submit` | `POST /api/quote` 成功返回后(前端触发) | `product_slug`(如有), `enquiry_type` |
| 5 | `add_to_cart` | 标准品加购 | `product_slug`, `value`, `currency` |
| 6 | `purchase` | Place Order/Pay 成功 | `transaction_id`, `value`, `currency`, `items[]`(slug/qty/price), `payment_type`(eft / stripe) |

## GA4 后台配置(Lily 操作,运营线给步骤)
1. `enquiry_submit`、`purchase` 标记为 **Key events**。
2. 自定义维度注册(Event scope,7 个全注册):`product_slug`、`supplier`、`decoration_model`、`source_location`、`payment_type`、`enquiry_type`、`category`。(value/currency/transaction_id/items 是标准参数,不用注册)
3. Referral 来源分组加 AI 转介:`chatgpt.com`、`perplexity.ai`、`copilot.microsoft.com`、`gemini.google.com`(GEO 监控用)。
4. 事件全通后:**内部流量过滤**(Data streams → Define internal traffic 加团队 IP;Data filters 启用),防测试数据污染。

## 验收
- Realtime/DebugView 里 6 个事件全部可见、参数齐。
- 漏斗可搭:product_view → quote_click → enquiry_submit → purchase。
- 已知遗留:2026-07-05 Lily 的测试 purchase 一笔(后台测试单需取消)。

## 第二批(仅记录,暂不实现)
`popup_signup`(留资弹窗)、`video_start`/`video_complete`、filter 使用事件。
