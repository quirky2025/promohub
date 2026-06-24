# START HERE — 新 chat 交接说明

> 新对话(相当于新分支)**先读这页**,再读 `NOW.md`,再读对应主文档。读完就能接上。

## 项目
QuirkyPromo —— 澳洲促销品 e-commerce(Next.js 16 + Supabase + Vercel)。
仓库 `github.com/quirky2025/promohub`;正式站 `https://www.quirkypromo.com.au`。
品牌:navy `#1B2A4A` + 金 `#C9A96E` + cream `#F8F7F4`;字体 Cormorant Garamond(标题)+ DM Sans(正文)。

## 角色分工（总控 + worker）
- **总控 chat = 分配任务 + 把关(orchestrator / QC)**:
  - 定优先级、决定每条 worker chat 下一步做什么(写交接 brief + 验收清单)。
  - 维护 `NOW.md` / 分支登记 一致;协调跨线依赖。
  - **merge 前把关**:对照主文档规格 + SEO 保护线 + 测试 + 铁律,审 worker 的 preview/PR/diff,给"可合 / 要改"结论。
- **Worker chat = 单条线执行**:读 `START_HERE` + 本线主文档,在分支上建、preview;**未经总控把关不 merge**。
- **怎么把关(关键)**:总控看不到 worker chat 内部 —— 你把 worker 的产出(**PR diff / preview 链接 / 截图 / 文件**)带回总控,我对照清单审,给结论。
- **任务流转**:你说下一步 → 总控写 brief + 验收清单 → 你贴进 worker chat → worker 建+preview → 你把结果带回总控 → 总控 QC → 合并 → 总控回写 `NOW.md`。

### 把关清单（merge 前过一遍）
- [ ] 符合该线主文档的规格 / 范围,没跑偏
- [ ] SEO 保护线没破(canonical / 动态 URL noindex / 不堆词 / 不链一堆 filter URL)
- [ ] 测试通过(涉及 lib 时);`node --check` / build 无错
- [ ] preview 真机验过(Ctrl+U 看 SSR、链接不 404、样式、移动端)
- [ ] 只动了本线文件;`NOW.md` 已回写

## 分支登记（开一个 chat = 认领一条线 = 一个分支）
> **这个 chat 是哪条线?** 看你的开场白指的主文档。每条 chat 只动自己这条线。

| 线 / 分支 | 干什么 | 主文档 | 状态 |
|---|---|---|---|
| **Homepage + Promo Kits** | 首页 V1 + 场景 Kit + Kit Builder(颜色统一) | `HOMEPAGE.md` · `PROMO_KITS.md` | 🔧 **进行中(独立 worker chat)** |
| **FILTER** | 分类/子类页筛选(颜色/价/MOQ/材质/Eco/BPA/Gender) | `FILTER.md` | ✅ 已上线(维护/扩展) |
| **SEO** | 颜色集合页、关键词、FAQ、每周监控、GSC 复盘 | `SEO_HANDOFF.md` · `SEO_STATUS_ONEPAGER.md` · `WEEKLY_SEO_CHECK.md` | ✅ 18 页 live、监控;7/1 复盘 |
| **后台 Admin** | 采购/sourcing 后台 + SEO#17 + 到位管理 | `ADMIN_BACKEND.md` | 🔧 启动改造(独立 chat) |
| **GFL 新供应商上线** | 批量导入新供应商产品并上架 | `GFL_IMPORT.md` | 🟡 准备中 |
| **库存准确性 / 供应商库存** | 库存文案风控 → snapshot schema → 供应商同步 pilot → 自动替代 | `STOCK_ACCURACY.md` | 📋 Now 文案待做;同步后期 |
| **Cloudinary 图片** | 图片 CDN 止血 + 第三轮优化 | `CLOUDINARY_FIX.md` | ✅ 止血已合并;6/21 第三轮 |

> 新增一条线就在这表加一行。线之间的依赖/排期看 `NOW.md` B 段。

## 读文档的顺序
1. **`NOW.md`** —— 总览 hub:在飞的线、排期、已完成、待办(C2)、定时任务、**文档地图**、铁律。永远先读它。
2. 对应**主文档**(在 NOW.md 文档地图里):
   - `FILTER.md` 分类筛选(已上线) · `HOMEPAGE.md` 首页 V1 · `PROMO_KITS.md` 场景 Kit + builder + 颜色规则 · `STOCK_ACCURACY.md` 库存
   - `SEO_HANDOFF.md` / `SEO_STATUS_ONEPAGER.md` SEO · `ADMIN_BACKEND.md` / `GFL_IMPORT.md` 后台/新供应商
   - bug 记录:`PRODUCT_LINK_FIX.md`、`CLOUDINARY_FIX.md` 等

## 多-chat 协作约定（一条线 = 一个 chat = 一个分支）
- **一条大线一个 chat**(Homepage+Kit 一个、后台 Admin 一个…),各自聚焦,上下文不互挤。
- **`NOW.md` 是几条 chat 共用的单一真相源**:每条 chat **先读 NOW、改完回写 NOW**(更新那条线状态 + C 段"已完成"记录)。
- **同一时间别让两条 chat 改同一个文件 / 同一条线**,避免冲突。
- 每条 chat 只动**自己那条线**的代码和主文档;跨线的事先在 NOW.md 记一行,别顺手改别人的。
- 新 chat 开场白模板:"先读 `START_HERE.md` + `NOW.md` + <本线主文档>,我们做 <X> 这条线,从 <队列第 N 步> 接着干。"

## 工作流（铁律,别破坏）
- 改代码:**全新克隆 main → 新分支 → 覆盖文件 / codemod → PR → Vercel preview → 验收 → merge**。
- **绝不直接改本地 `C:\Users\jilin\Desktop\promohub`**(git index 损坏 + 有未提交 admin WIP);它只当"作者草稿/参考",部署都在 fresh clone。
- **一次只推进一件**:开下一个前当前先合并/收尾;每件在 NOW.md 记录(待办→进行中→已完成)。
- **报 bug 前先在真实 production 验证**(浏览器渲染/SQL),别只读代码就当 bug。
- 第三方服务 **dev/prod 分离**(`DEV_PROD_SEPARATION.md`)。
- **SEO 保护线**:页面只链 canonical category/subcategory/已批准 url_pages;filter/kit 动态 URL **noindex、不进 sitemap**;颜色页只链已批准;不堆关键词。

## 工具坑（实战踩过,省时间）
- 写含 `${...}` 或较长的文件,Edit/Write 会**截断** → 一律用 **bash heredoc**(`cat > f <<'EOF'`)写,写完 `node --check` 或 babel 验证 JSX。
- codemod 要 **EOL-safe**(Windows CRLF):规范成 LF 改、再还原 CRLF;**幂等**(done-marker)。
- 每个改动配测试(`scripts/test_filterAttributes.mjs` / `test_filterFacets.mjs` 那套)+ 验证步骤。
- 全局 Nav/Footer 在 `app/layout.js`(server component),页面别自带。

## 当前状态（2026-06-18 收工时）
- **FILTER** ✅ 已上线(基础 + 材质/BPA/Gender 精细化)。
- **Homepage V1** 🔧 真代码已写好:`app/page.js`(server component + metadata + JSON-LD)+ `public/kit-hero.svg`(line-draw 主视觉)+ `components/HomeKitPicker.jsx`(留作 /promo-kits 用)。**待 push `feat/homepage-v1` 看 preview**。详 `HOMEPAGE.md`。
- **Promo Kits** 📋 方案全定稿:8 场景 + builder 6 步 + 9 色调色板 + 颜色解析(换产品保颜色优先→近似色兜底→Needs manual suggestion)。详 `PROMO_KITS.md`。**待建页面**。
- **Stock** 📋 风险 + 时间线已记;Now 4 条文案待做。详 `STOCK_ACCURACY.md`。
- **后台 Admin / GFL** 🔧 单独的线,见各自 doc(建议另开 chat)。

## Homepage + Kit 线 — 下一步队列
1. push 首页 `feat/homepage-v1` → preview 验收 → merge。
2. `/promotional-products` 总览页(21 类目,每类 3–6 子类;可 index;内链中心)。
3. `/promo-kits` hub(builder + 8 场景卡 + 颜色步骤;hub 可 index,`?scene=` 结果 noindex)。
4. 8 个 `/promo-kits/<slug>` 场景页(轻内容:H1 + 说明 + 模板 + 预算 + CTA + 免责)。
5. 库存 Now 4 条文案(跟 Filter 一起)。

## 真 canonical 页（部署前确认已发布,发布字段不是 is_live —— 先查列名）
类目:`/custom-bags-australia` `/custom-drinkware-australia` `/branded-pens-australia` `/custom-branded-apparel-australia` `/corporate-tech-gifts-australia` `/outdoor-promotional-products-australia` `/custom-headwear-australia` `/branded-office-supplies-australia`(共 21 个,见 url_pages)。
