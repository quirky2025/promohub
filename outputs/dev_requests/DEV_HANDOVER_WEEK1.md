# 开发线交接:运营需求包(2026-07-05 恢复重建,含最新状态)

> 来自运营线。需求/文案已定稿,**实现全部由开发线做**,运营不碰代码。
> 文件都在 `outputs/`。有疑问回运营线确认,别自行改口径。
> ⚠ **铁律:不得删除/移动 outputs/ 里非本线创建的文件。**(2026-07-05 已发生一次误删事故,本批文档为恢复重建版)

## 任务 1:GA4 事件埋点(基础 tag 已通,补事件)
- 文档:`outputs/dev_requests/GA4_TRACKING_SPEC.md`(v2)
- 状态:tag ✅、purchase ✅;**product_view / quote_click / enquiry_submit / add_to_cart 未触发**,请补齐。
- 注意:quote_click 全站每个入口都埋,`source_location` 枚举 nav/pdp/category/landing/cart/footer;金额 ex-GST、AUD;product_view 覆盖 ProductClient + ASColourClient。
- 验收:Realtime 六事件全通。

## 任务 2:Sitemap 动态生成 —— ✅ 已完成
- 文档:`outputs/dev_requests/SITEMAP_UPDATE_REQUEST.md`(留档)
- 运营已重提交 GSC,持续核对 Discovered ≈ 4,700+。

## 任务 3:FAQ 页重排 + FAQPage schema
- 文案:`outputs/dev_requests/FAQ_CONTENT.md`(15 条定稿,6 组,含内链)
- 第 13 条上线前措辞与 `/refund-return` 核对;文案要改先回运营线。

## 任务 4(新):945 个旧 URL 的 301/410
- 文档:`outputs/dev_requests/REDIRECT_404_FIX_REQUEST.md`
- 核心:旧嵌套 `/category/.../<slug>` 按 slug 动态 301 → `/products/<slug>`;远古 `productlist.php` 全 410;**禁止统一甩首页**。
- 部署后告知运营线,GSC 点 Validate Fix。

## 顺序建议
1(GA4 补事件,最快)→ 4(301/410)→ 3(FAQ)。完成逐项回报运营线。
