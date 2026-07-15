# 营销邮件体系搭建 · 2026-07-14(决策:Brevo + 弹窗带券本周启动)

> 前提说明:询盘/报价流程邮件后台已全自动 ✅,本计划只管**营销线**。
> 法律地基(Spam Act 2003):发营销邮件必须 ①对方同意 ②发件人可识别 ③一键退订。**询盘邮箱不得直接进营销列表**(可在回复里邀请对方订阅,见文末话术)。

## 一、本周搭建(三路并行)

### Lily 做 · Brevo 开户(30 分钟)
1. brevo.com 注册(用 hello@quirkypromo.com.au)
2. Settings → Senders & Domains:添加 quirkypromo.com.au,按它给的 **DKIM/SPF DNS 记录**清单交给开发/自己在 DNS 加上(不做必进垃圾箱)
3. 建 List:`Newsletter`;字段:email、first name(选填)、来源(footer/popup)
4. 打开每封邮件自动带退订链(Brevo 默认开,确认即可)

### 开发线做 · 两件事(需求见 `dev_requests/POPUP_LEAD_CAPTURE_SPEC.md`)
1. **页脚订阅框接活**:现有 "Stay in the loop" 框 → Brevo API 建联系人(来源标 footer),成功提示 "You're in — welcome email on its way."
2. **留资弹窗 + 首单券**(spec 内含触发规则/合规红线/券核销逻辑)

### 运营线(我)· 文案全套(见下)
欢迎邮件、弹窗文案、订阅 consent 微文案——已写好在本文档第三节。

## 二、首批邮件日历(名单攒起来就发)
| 时间 | 主题 | 素材来源 |
|---|---|---|
| 8 月初 | Trade show season is here(Reed Gift Fairs Melbourne 8/8–12)| 知识库 trade_shows.md |
| 8 月中 | Winter staff apparel(AS Colour hoodies,南半球正当季)| 知识库 apparel_decoration.md |
| 9 月 | Christmas merch: order early(倒推生产交期)| 季节 + 7–10 天交期教育 |
| 之后 | 每月一封 newsletter 节奏,新品/案例/一条实用知识 | 知识库滚动供弹 |

## 三、文案(英文定稿)

### 弹窗文案
**标题**:Get 10% off your first order
**正文**:Join our list and get 10% off your first order over $500 (ex-GST) — plus practical merch ideas for Australian businesses, about once a month.
**按钮**:Send me the code
**微文案(输入框下,小字)**:By subscribing you agree to receive occasional marketing emails from QuirkyPromo. Unsubscribe anytime.

### 欢迎邮件(弹窗触发,带券)
**Subject**:Your 10% code is here 🎉
**正文**:
Hi {first name|there},
Welcome aboard! Here's your code for **10% off your first order over $500 ex-GST**:
**WELCOME10**(核销规则以开发实现为准)
A few things we're known for: a free digital proof before anything goes to print, $30 flat shipping Australia-wide, and 396 pens if you're into that sort of thing.
Browse the range → [quirkypromo.com.au/promotional-products]
Questions? Just reply — a real person reads this inbox.
— The QuirkyPromo Team
*[Unsubscribe]*

### 页脚订阅成功欢迎邮件(不带券版)
同上去掉券段,首句改 "Thanks for subscribing — about once a month we'll send practical merch ideas for Australian businesses."

### 询盘回复里的合规邀订话术(给 Microsoft 这类)
"P.S. If you'd like occasional merch ideas and seasonal reminders from us (about once a month), just say the word and we'll add you to the list."(对方回复同意 = express consent,截图留档)

## 四、进周看板
名单数(footer/popup 分列)/ 打开率 / 点击率 / 券核销数 / 退订率(>0.5% 要警惕)
