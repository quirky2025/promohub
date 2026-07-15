# Live Chat 上线方案(Tidio)· 2026-07(原 parked 项,条件成熟提前启动)

**决策**(Lily 2026-07-12):工具 Tidio;工作时间 Lily 手机 App 值守;先免费层,不急上 Lyro AI。

## Lily 做(注册配置,约 30 分钟)
1. tidio.com 注册(用 hello@quirkypromo.com.au),装手机 App + 开新消息推送。
2. 基础设置:品牌色 NAVY #1B2A4A;头像/名称 QuirkyPromo;**Business hours 设置**(悉尼时区工作时间)。
3. **离线行为**(关键):非工作时间聊天框变离线表单——文案:"Leave your email and what you need — we'll reply within 3 business hours next business day." 收到的留言进邮箱。
4. 预设快捷回复(从 FAQ 抄):MOQ / 交期 / proof 流程 / 运费 / get a quote 链接,共 5–8 条。
5. 欢迎语(访客打开时):"Hi! Questions about MOQ, pricing or artwork? Ask away — or request a quote and we'll come back within 3 business hours."

## 开发线做(5 分钟)
- Tidio 后台给的 script 一段,挂全站 </body> 前(建议 Next.js Script 组件,lazyOnload,别拖慢 LCP)。
- 上线后跑一次 PageSpeed,确认 LCP/CLS 没有明显回退(chat 脚本是常见性能杀手,lazyload 必须)。

## 规则
- ⚠ 聊天里收的邮箱只用于回复该询盘;要发营销邮件必须单独取得同意(Spam Act)。
- 聊天里不承诺未核实的库存/交期(红线),拿不准就转 quote 流程。
- Chat 是补充入口,Get a Quote 仍是主 CTA,别让弹窗抢戏(移动端注意别挡住加购按钮)。

## 后续(条件触发)
- 周聊天量 > 20 条且重复问题占多数 → 开 Lyro AI,用 /faq 内容喂,AI 答不上转人工。
- GA4 加 chat_open / chat_lead 事件(挖词器之后的批次,先不做)。

## 看什么(进周看板)
本周 chat 会话数 / chat 来源留资数 / chat→quote 转化。
