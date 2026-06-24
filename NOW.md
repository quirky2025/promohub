# 当前进行中(总览)— 更新 2026-06-18

> 🆕 **新 chat 先读 `START_HERE.md`**(交接说明:工作流铁律、工具坑、当前状态、下一步)。

> 换 chat / 过几天忘了进度,**先读这页**:看现在在干嘛 → 再点进对应专题文档看细节。
> 惯例:每完成一件,在"已完成/修复记录"记一行。
> 结构:**`NOW.md` = 总缆**,每条线一个专题文档(分支级);更新时**先改分支文档,再把一行摘要汇到这里**。

---

## A. 正在飞的线

| # | 线 | 分支 | 状态 | 下一步 / 文档 |
|---|---|---|---|---|
| 1 | **SEO #5 颜色集合页** | (已并 main) | ✅ 18 页 live、监控中 | 6/24 跑 SQL、7/1 GSC 复盘。`SEO_HANDOFF.md` |
| 2 | **Cloudinary 图片止血** | `fix/cloudinary-image-loading` | ✅ 已合并 main(PR #17) | 观察 2–3 天 impression;6/21 第三轮 kickoff(自动) |
| 3 | **产品链接 " - " 404 修复** | `fix/product-slug-links` | ✅ 已合并 main | 完成。`PRODUCT_LINK_FIX.md` |
| 4 | **FILTER(分类筛选)** | (已并 main) | ✅ **已合并 main**:扁平类目/子分类页筛选上线(色块/同组单选/材质多源/Eco/交期/价格排序),SEO 无回归 | 观察;材质回填(方案C)入 backlog。`FILTER_SLUG_DEPLOY.md` |
| 5 | **后台 Admin backend** | `chore/admin-backend` | 🔧 启动改造(独立 worker chat);先救本地未提交 WIP | 采购/sourcing 后台 + SEO 后台#17 + 到位管理。`ADMIN_BACKEND.md` |
| 6 | **GFL 新供应商上线** | `gfl-import-data` / `codex/supplier-import-foundation` | 🟡 准备中(多为 dry-run) | 批量导入 + 上线。`GFL_IMPORT.md` |
| 7 | **Homepage + 类目页**(Kit 暂停) | `feat/homepage-v2`(`homepage-cleanup-all.patch`) | 🔧 **最终版待 merge**:首页(Hero 单张产品合成图 `hero-products.png` + Shop by Category 8 图卡 + Shop by Brand 4 logo + New Arrivals 4 真实产品 + How ordering works,小字纯黑)+ 类目页 `/promotional-products`(navy hero、彩色卡、字母序、Get a Quote 弹窗)。`#25` 首页已合;`feat/homepage-v2` 含余下全部(含 Kit 撤下)。旧 PR #28/#29 关闭 | Lily 推 `feat/homepage-v2` → merge。`HOMEPAGE.md` |
| 7b | **Merch Pack(原 Promo Kits)** | (暂停,代码存 `promo-kits.patch`) | ⏸️ **暂停 + 改名中**:Kit 整条从首页/类目/路由撤下。回头定:命名(→ Merch Pack)、模型(Monday Merch 自助式 vs Mercha 咨询式)、与 Collections 关系 | 见 `PROMO_KITS.md` §6「待定」。参考 Monday Merch / Mercha |

---

## B. 总排期(Lily 定,2026-06-18)

**原则:先把站稳住,再批量上新供应商产品。**

1. **站稳(先合并)**:产品链接修复 ✅ + Cloudinary 止血 ✅。
2. **后台 Admin**:完成 + 合并 —— 它是管理/导入/QA 新货的工具,上货前先就绪。
3. **FILTER**:✅ 已建好上线,新目录可筛选。
   - 注意:统一属性层(colour/material 家族等)的**回填最好在新货进库后再跑**,覆盖新产品。
4. **GFL 新供应商上线(最后)**:批量导入 + 上线。
   - 上货前每个新产品确保:✅ 正确 slug(避免 404)、✅ colour_slugs(进颜色页/筛选)、✅ 图走 ProductImg、✅ 跑一遍 `weekly_seo_audit.sql` + filter profiling 复验。

> 一句话:**站稳 ✅ → 后台就绪 → 筛选就绪 ✅ → 才上新供应商货。** 这个顺序稳。

### 现有产品到位清单 → 再导 GFL（Lily 定 2026-06-18）
**策略:先把现有 ~2459 个产品在网站上全部到位,再导入新(GFL)产品。** 在已知可控集上跑通标准,再倒进已验证的系统,避免半成品里返工。
"到位"分三档(别理解成逐个手工完美,要有终点):
1. **系统/模板到位(代码,一次覆盖全体)**:产品页 SEO 升级(H1 加 Custom + Product/Offer/Breadcrumb JSON-LD)· FILTER(已 live)· ProductImg · stock 文案("confirmed before order")· 后台 `seo_status` 字段。
2. **全体基线数据到位(每个产品都要有)**:`colour_slugs` · material · `pricing_tiers`(价)· image · 正确 category/subcategory · `min_qty`。← filter / schema / kit 的硬底线。
3. **重点产品人工精修(80/20)**:top/热卖手工 meta + 独特正文;其余靠模板兜底 + `seo_status=needs-review` 后补(或 AI #17)。
**①②③ 到位 = 可以导 GFL。** 之后 GFL 新货照同一套 checklist 进来,标准统一。

> 当前进度:站稳 ✅、筛选 ✅。**下一件建议:后台 Admin 收尾 + 合并**(或先清本地 promohub 卡分支的技术债)。

---

## C. 已完成 / 修复记录(每完成一件记一行)

| 日期 | 项 | 说明 | 状态 |
|---|---|---|---|
| 2026-06-17 | SEO #5 颜色集合页 18 页 | 第一批 8 + 第二批 10 上线 + 验收 | ✅ live |
| 2026-06-18 | 产品链接 " - " 404 bug | 5 页改用 `product.slug` + select 补 `slug`,救活 ~580 产品;`fix/product-slug-links` | ✅ 已合并 main |
| 2026-06-18 | Cloudinary 图片止血 | ProductImg 组件 + 9 列表页/详情页懒加载 + dev 占位 + Cloudinary 缩略图;`fix/cloudinary-image-loading` PR #17 | ✅ 已合并 main |
| 2026-06-18 | 类目页混进颜色页 修复 | 扁平类目页 "Browse by Subcategory" 排除 `page_type='collection'`;`fix/subcat-grid-exclude-colour` | ✅ 已合并 main |
| 2026-06-18 | **FILTER 分类筛选系统上线** | 扁平类目/子分类页筛选(颜色/价格/MOQ/品牌/装饰/交期/Eco/材质/容量);色块、同组单选、价格低→高、交期+Eco 永不隐藏、材质多源(产品名+materials+tags);SSR/SEO 无回归;54 测试;`feat/filter-slug` | ✅ 已合并 main |
| 2026-06-18 | **FILTER 增强:类目精细化** | Material 提全局并拆细(SS/Aluminium/Tritan/Glass/Ceramic/Polypropylene/Bamboo/RPET…);Drinkware 只取**瓶身主材质**(白名单+主体解析,滤掉盖/圈/把手/套)+ BPA Free + ml 容量;Apparel Gender;Stock/Eco/BPA 永不隐藏;79 测试;`feat/filter-drinkware-apparel` | ✅ 已合并 main |
| 2026-06-19 | **新首页上线**(PR #25) | server component:Shop by Category(8 静态图)+ Shop by Brand(4 logo)+ New Arrivals(4 真实产品)+ How ordering works;JSON-LD、单 H1 | ✅ 已合并 main |
| 2026-06-19 | **首页/类目页定稿 + Kit 撤下**(`feat/homepage-v2`,`homepage-cleanup-all.patch`) | 首页 hero 单张产品合成图 `hero-products.png`(navy 产品+金标)、小字纯黑;类目页 `/promotional-products` navy hero + 彩色卡 + 字母序 + Get a Quote 弹窗(`QuoteButton`→`QuoteModal`);删 `/promo-kits` 整套 + `lib/kits.js` + `KitBuilder` + sitemap kit + `kit-hero.svg` | 🔧 待 merge(`feat/homepage-v2`) |
| 2026-06-19 | **Promo Kits → 改名 Merch Pack(暂停)** | Kit 功能整条停;命名/模型/与 Collections 关系待 Lily 定;旧代码存 `promo-kits.patch`;竞品参考 Monday Merch + Mercha | ⏸️ 暂停,见 `PROMO_KITS.md` |

> 遗留:产品链接修复里 3 文件的死代码 `toSlug` 未删(Windows 换行符,无害);可选清理。

---

## C2. Bug / 待办清单(待修复 + 待办)

> 新 bug 来了加到这里;修好后挪到上面"已完成/修复记录"。大的功能线见 A 段,这里收**零散 bug、技术债、排期外增强**。

**🐛 已知 bug / 技术债(待修复)**
| 优先级 | 项 | 说明 | 文档 |
|---|---|---|---|
| ❌ 误报 | ~~类目 `&` 空白~~ | **不是 bug(2026-06-18 浏览器验证)**:`/category/toys-games` 会**重定向到扁平页** `/promotional-toys-and-games-australia`(正常有产品)。坏的 React 类目页被重定向绕过、用户碰不到。`fix/category-amp-match` 分支**撤销、不合并**。教训:报 bug 前先看真实渲染的 production,别只读代码 | ❌ 已撤销 |
| P3(待验证) | 相似产品过滤门 | `ProductClient` 用 `.eq('status','active')` 而非全站的 `is_published`,**是否真造成差异未验证**;先跑 `select status, is_published, count(*) from products group by 1,2` 看两字段是否等价,再决定改不改 | 待验证 |
| P2 | brands/collections slug 系统统一 | 生成端(Nav `legacySlug`)+ 匹配端(`toSlug`)都改用 `lib/slug`,连 `components/Nav.jsx` 一起改 + 测品牌/系列页 | `PRODUCT_LINK_FIX.md` |
| P3 | 旧 `---` 链接容错 | 已流出的 `---` URL(若被收录/分享):`products/[slug]` 用 `normalizeSlug` 容错 + canonical 回干净 slug(SEO 敏感) | `PRODUCT_LINK_FIX.md` |
| P3 | 死代码 `toSlug` 清理 | sustainability/sale/new-arrivals 里没删成(Windows 换行符);无害 | — |
| P1(风险) | **库存准确性:Local Stock ≠ 实时有货** | 前端标 Local Stock 但可能缺货;**Now**:改文案 `Stock confirmed before order` + Filter 不承诺实时库存 + Kit 写 stock check + Publish Checklist 加 stock freshness。后续:snapshot schema → 供应商 pilot → 自动替代 | `STOCK_ACCURACY.md` |
| P2 | **本地 promohub 卡在 admin-backend 分支** | 总文件夹停在 `chore/admin-backend` + 有未提交后台 WIP(来自丢失 chat)。不影响 clone 流程,但乱。**安全清理(单独做)**:先看 WIP→提交 push 到 admin-backend→再切 main / 重克隆。git index 损坏,需小心别丢 WIP | 待清理 |

**📋 待办 / 增强(排期外 / 数据门控)**
| 触发 | 项 | 文档 |
|---|---|---|
| 6/21 提醒 | Cloudinary 第三轮(next/image、静态图移出 Cloudinary、颜色图点击才加载、无限滚动) | `CLOUDINARY_FIX.md` |
| 7/1 数据后 | SEO 第三批颜色页(按 GSC 真实词决定) | `SEO_HANDOFF.md` |
| 7/1 后 | #9 FAQ / 长尾正文(给颜色页/产品页加) | `SEO_HANDOFF.md` |
| 现在可做 | **产品页 SEO 升级 V1**:H1 加 Custom + Product/Offer/Breadcrumb JSON-LD(不含星级/交期承诺) | `SEO_HANDOFF.md` |
| 后台线 | **SEO 后台升级 #17**:加 `seo_status`(auto/reviewed/needs-review)+ 列表筛待人工 + AI 辅助 | `SEO_HANDOFF.md` · `ADMIN_BACKEND.md` |
| 新货后 | **材质数据回填(方案C)** | Material 现靠关键词从产品名/materials/tags 推,覆盖不全;后台给每个产品补权威 `materials`/`material_tags`,前端逻辑不变 | `FILTER_DATA_AUDIT.md` |
| backlog | #17 SEO 编辑后台 · #18 主图 alt + 变体名人工精修 | `SEO_HANDOFF.md` |

---

## D. 文档地图(每个 MD 干嘛的)

**入口**
- `NOW.md` —— 本文件,总览 + 当前状态 + 排期 + 文档地图。

**SEO #5**
- `SEO_HANDOFF.md` —— 全量进度 / 工作流 / 硬规则(SEO 主文档)。
- `SEO_STATUS_ONEPAGER.md` —— 一页状态 + FILTER SEO 保护线。
- `WEEKLY_SEO_CHECK.md` + `weekly_seo_audit.sql` —— 每周体检手册 + 只读 SQL。
- `SEO_Weekly_Tracker.xlsx` —— 每周数据追踪表。
- `Product_SEO_Rulebook_v3.md` —— 权威 SEO 规则基准。

**Cloudinary 图片**
- `CLOUDINARY_FIX.md` —— 方案 + 三轮路线 + 第三轮待办。
- `CLOUDINARY_DEPLOY_STEPS.md` —— 一步步部署命令。
- `DEV_PROD_SEPARATION.md` —— 第三方服务 dev/prod 分离铁律。

**FILTER**(主文档 `FILTER.md`)
- `FILTER.md` —— ⭐ **主文档**:架构 + 所有 facet + 材质/BPA/Gender 规则 + **新品自动归类前提 + 上货 checklist** + 如何扩展 + 部署/验收。
- `FILTER_AUDIT.md` —— 架构 / 风险 / QLP 竞品对照(deep-dive)。
- `FILTER_DATA_AUDIT.md` —— profiling SQL + 判定矩阵 + Roadmap(deep-dive)。
- `FILTER_SLUG_DEPLOY.md` —— [slug] 接入部署步骤(deep-dive)。

**库存 / 供应链**
- `STOCK_ACCURACY.md` —— ⭐ 库存准确性风险 + 4 步 Now + 供应商同步时间线。

**Homepage / Promo Kits**
- `HOMEPAGE.md` —— ⭐ 首页主文档:版块顺序 + 锁定文案 + SEO + 链接目标 + 建设顺序。
- `PROMO_KITS.md` —— ⭐ 主文档:8 场景 + kit 模板 + slug + SEO 规则 + 建设顺序。
- (原型)`homepage-v1-prototype.html`、`kitting-page-prototype.html` —— 静态原型,定方向用。

**Bug 修复**
- `PRODUCT_LINK_FIX.md` —— 产品链接 " - " 404 修复记录 + 部署步骤。

**后台 / 新供应商(从分支考古)**
- `ADMIN_BACKEND.md` —— 采购/sourcing 后台状态(分支 `chore/admin-backend`)。
- `GFL_IMPORT.md` —— GFL 新供应商导入上线状态(分支 `gfl-import-data`)。

**项目自带(非本轮产出)**
- `AGENTS.md` / `CLAUDE.md` —— 给 AI 的项目说明。
- `README.md` —— 仓库说明。
