# 新开发线入职交接 v2 · 2026-07-14(前任 dev chat 已失效,本文档为唯一入口)

## 0. 先读(按序)
1. 仓库根目录 `CLAUDE.md` / `AGENTS.md`(项目技术上下文)
2. `outputs/README_INDEX.md`(文档目录结构)
3. 本文档(工作队列)

## 1. 铁律(前任的教训)
- **不得删除/移动 outputs/ 里非你创建的文件**(发生过误删事故,全部运营文档曾丢失)
- **文案类文档一字不改照用**,要改先经 Lily 回运营线
- 每完成一项回报 Lily,由她转达运营线(运营线要做 GSC Request Indexing)
- 不承诺交期/库存类文案自己加戏;红线见 `outputs/ops/OPERATIONS_HANDOVER.md` Part C

## 2. 已完成的工作(前任 dev 交付,勿重复)
- GA4 基础 tag + 6 事件埋点(G-06J4WRFMLY,规格 `GA4_TRACKING_SPEC.md`)
- 动态 sitemap(从 DB 生成,已重提交 GSC)
- 945 个旧 URL 的 301/410(`REDIRECT_404_FIX_REQUEST.md`)
- FAQ 页重排 + FAQPage schema(`FAQ_CONTENT.md`,注意第 8 条已更新为 3 business hours)
- Tidio chat 脚本(如未挂,见 `CHAT_WIDGET_PLAN.md` 开发部分:script 挂全站,lazyOnload,过 PageSpeed)

## 3. 当前工作队列(按优先级)

### P1 · Pens 三页深化文案上线(本周)
- `outputs/categories/pens/PENS_CATEGORY_DEEP_COPY.md` → /branded-pens-australia(FAQ 6 条进 schema)
- `outputs/categories/pens/PENS_SUBCATS_DEEP_COPY.md` → /eco-pens-australia + /custom-metal-pens-australia
- 版式位置说明在文档内(意图段网格上方,指南+FAQ 网格下方,title/meta 替换)

### P2 · Pens filter 加 "<$1" 价格档
- `outputs/dev_requests/FILTER_PRICE_BAND_PENS.md`

### P3 · PDP "Also Found In" 内链块(全站)
- `outputs/dev_requests/PDP_ALSO_FOUND_IN_SPEC.md`(按产品字段自动生成集合链接,规则在文档)

### P4 · Pens 页面图片补强(素材由 Lily 提供,进行中)
- Lily 正在整理供应商图片做内容素材;图片走**现有 R2 pipeline**(webp 多尺寸,存 pub-…r2.dev,规范参考现有产品图 variants 结构)
- 收到素材后:类目页/子类页顶部或指南区按文案版式插入;注意 alt 文本写实描述(含产品词,不堆砌)
- ⚠ 供应商图片仅用图,**供应商的文字描述不得复制上站**

### 待确认追加(运营评估中,先别做)
- 产品卡升级:"See it with your logo" 链接 / "+N more colours" / Best Seller 角标

## 4. 验收与回报格式
每项完成回报:改了什么文件/页面 + 部署状态 + 可核查的 URL。运营线会抽查(文案一致性、schema 检测、PageSpeed)。
