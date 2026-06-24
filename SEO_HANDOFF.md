# QuirkyPromo SEO — 工作交接(贴进新对话即可无缝继续)

> 给新对话的 AI:这是 QuirkyPromo (Next.js 16 + Supabase,部署在 Vercel) 的产品 SEO 工程进度。请先读完本文件,按"工作流"和"硬规则"继续。**不要重述背景,直接接着做待办**。完整规则见 `Product_SEO_Rulebook_v3.md`(权威基准)。

---

## 0. 仓库与环境

- GitHub: `https://github.com/quirky2025/promohub.git`(分支 `main` = production)
- 本地工作目录: `C:\Users\jilin\Desktop\promohub`(⚠️ **git index 损坏 + 多摊未提交改动**,**不要**在这里直接 git 操作)
- DB: Supabase(用户能在 SQL 控制台跑 SQL;AI 无法直连库,也无法连 production/preview 抓取受保护内容)
- 站点: `https://www.quirkypromo.com.au`;Vercel 项目 `promohub-store`
- GSC: 已接入(Domain 资源,DNS 在 Hostinger 验证),已提交 `sitemap.xml`

## 当前进行中(2026-06-18)—— 总览见 `NOW.md`
三条线在飞:
- **SEO #5 颜色集合页**:18 页 live、监控中;6/24 跑 SQL、7/1 GSC 复盘。见本文件 #5 段 + `WEEKLY_SEO_CHECK.md` + `SEO_STATUS_ONEPAGER.md`。
- **Cloudinary 图片止血**:代码已产出待部署(`components/ProductImg.jsx` + `public/placeholder-product.svg` + `scripts/apply_product_img.mjs`);6/21 Round 3 kickoff。见 `CLOUDINARY_FIX.md` + `DEV_PROD_SEPARATION.md` + 部署步骤 `CLOUDINARY_DEPLOY_STEPS.md`。
- **FILTER**:设计/规格锁定,暂停在 Phase 0 profiling。见 `FILTER_AUDIT.md` + `FILTER_DATA_AUDIT.md`。
定时任务:`quirkypromo-colour-pages-health-check`(每周一)、`cloudinary-round3-kickoff`(2026-06-21)。

---

## 1. 工作流(每次改代码都这样,务必遵守)

> 因为本地仓库 index 损坏 + 有其它 chat 未提交的活,**绝不在本地仓库直接改/提交**。一律:

```
1. 全新克隆:    cd C:\Users\jilin\Desktop && git clone <repo> promohub-<feature>
2. 切分支:      cd promohub-<feature> && git checkout -b fix/<feature>
3. AI 产出文件 → 用户下载卡片到桌面 → cmd: copy /Y "桌面\file" "克隆\目标路径"
4. 看 diff 防呆: git diff main -- <path>(只应有本次改动)
5. commit + push → 开 PR → Vercel 自动 preview
6. 验收(preview 受 Vercel 保护,AI 抓不到 → 用户浏览器 view-source 贴给 AI / 或合并后在 production 抓)
7. 通过 → Merge PR → production
```

**环境坑(已踩过):**
- 用 **cmd.exe**(PowerShell 对路径里的 `[slug]` 当通配符;cmd 不会)。
- 路径含 `[slug]` 目录:cmd 的 `copy` 没问题;`git add` 用 `git add "app/products/[slug]/page.js"` 或进目录 add。
- Supabase 数据 SQL 改动:走 **dry-run(只读)→ apply(事务 BEGIN/COMMIT)→ 复验** 三段,用户分段跑(编辑器只显示最后结果)。
- `git diff` 在分页器里按 **q** 退出。
- 卡片下载若重名会变 `file(1).js`,copy 前先 `dir` 确认真实名。
- 用 Write 工具写文件偶发**末尾混入 NUL / 截断** → 写完务必 `node --check` + `grep -P "\x00"` 校验;不行就用 bash heredoc 重写。
- **本地 `main` 是旧的**(没 pull),不能当基线;克隆要从**远程**拉。

## 2. 硬规则(SEO,不可违背)

- **只用真实数据,绝不伪造**:无价不输出 offers;无库存不输出 availability;无评价不输出 aggregateRating;无每色 SKU 不输出 sku。
- canonical 唯一、self-reference、与 schema `url` 一致。
- title ≤60 渲染长度;meta description 110–160;都要产品专属、不雷同。
- **TRENDS 现有 slug 不动**(只修 canonical/meta/schema);新版 slug 仅 GFL/新品。
- 颜色清洗统一走 **`lib/colourName.js`**(`cleanColour(raw)→{name,mode,secondary}`,mode∈solid/compound/full_colour/placeholder/unknown);schema `color` 仅 solid/compound。
- 变体 URL 用 `?colour=`,canonical 回主页,不进 sitemap、不 index。
- 数据质量门(进 sitemap / 输出 schema):published + 有 name + 有 slug + 有主图。

## 3. 已上线 production(✅ 完成)

| 项 | 内容 |
|---|---|
| canonical | 产品页 `generateMetadata` 输出 per-product canonical(原继承首页 `/` 的 bug 已修);分支 fix/product-canonical-seo |
| title 去重 | 202 组重复 → 名称消歧 + 32 长名精简 + bamboo 修正;**2629 产品 0 重复 / 0 超长**(数据层 UPDATE) |
| description | >160 收敛到 110–160(句号优先截断);0 超长 / 0 过短 |
| meta logo 意图 | 456 个缺 logo 的按**真实 decoration 方式**补(laser/emb/print…);100% 含 logo/branding 意图;§6.8 |
| image alt (#3) | 主图用 `alt_text`、画廊填空、颜色图 `[Colour] [Name] with logo`;0 空 alt;`app/products/[slug]/ProductClient.jsx` |
| Schema 4A | `Product`+`BreadcrumbList` JSON-LD(真实数据,扁平面包屑,AggregateOffer AUD ex-GST);`app/products/[slug]/ProductJsonLd.jsx`;Rich Results 三品通过 |
| sitemap | 产品页加入 sitemap(分页全量,门槛过滤);`app/sitemap.js`;2629 产品已进 |
| GSC | 已验证 + 提交 sitemap |

## 4. 进行中 / 待收尾

- ✅ **fix/alt-colour-clean**:共享 `lib/colourName.js`(`cleanColour→{name,mode,secondary}`,mode 五态 + 多部件保留 1 个次要部件)+ ProductClient import 它。**已合并 main(PR #9)**。
- ✅ **全彩→Custom 数据整洁**:`products.colours` 句子型统一成 `Custom`。**已跑**(审计实测候选 901 内 full_colour/placeholder = 0,确认到位)。

## 5. 待办(下一步,优先级)

1. **4B 变体基础** — 设计见 `Variant_Foundation_4B1_Design.md`;4B-2 全部产物 + 决策见 `seo_variants_4b2/`(estimate SQL / audit.mjs / generate.mjs / DDL / Decisions.md)。
   - **三档**:① 单色→Product+color;② 多色无图→Product+"Available colours"文字;③ 多色有图→进 `product_variants`。
   - ✅ **4B-2 已完成(2026-06-17)**:`product_variants` 建表 + 回填 **5754 行 / 901 产品**(variant_ready 5753 + image_missing 1);口径对账 972 = 901 进表 + 71 档②(pool_only 66 + neither 5)。**每色图来源 = 真实 inline `colours[].image`**(不是 product_colours 图池 index 切片);**无每色 SKU → `supplier_variant_sku`/`availability` 留 NULL,零伪造**;`internal_variant_code = slug--colour_slug`;同色重复去重(Matte Red)。双 unique 约束、RLS 只读 variant_ready。**无代码合并**(colourName.js 早在 main)。
   - ✅ **4B-3 已完成(2026-06-17,PR `fix/variant-colour-ssr` 已合并 main)**:产品页支持 `?colour=`(SSR 选色;canonical 仍回 `/products/<slug>`;变体 URL `noindex,follow`、不进 sitemap)。改 3 文件:`lib/colourName.js`(加 `export colourSlug`)、`app/products/[slug]/page.js`(generateMetadata 读 searchParams 加 robots;ProductPage 算 initialColourIndex)、`ProductClient.jsx`(`useState(initialColourIndex ?? null)`)。
     - **preview 验收 8 项全过**(podium-medal-65mm):变体 `noindex,follow` ✅ / canonical 回主 URL ✅ / SSR 预选(alt 显示 `Bronze and light blue`)✅ / colour_slug 命中 ✅ / 基础页 `?colour=`=0 无可爬内链 ✅ / Product+BreadcrumbList 在、ProductGroup=0 ✅ / sitemap 无 `?colour=` ✅ / `node --check lib/colourName.js` ✅。
     - **验收标准**:
       ```
       node --check pass (lib/colourName.js; page/ProductClient 含 JSX 用 preview 构建验)
       product page SSR includes variants (SSR 预选颜色)
       Inbound colour URLs use ?colour=[colour_slug] and resolve correctly
       Colour swatches/buttons do NOT create indexable internal links (仍是 button,非 a href)
       variant URL canonical remains /products/[slug]
       variant URLs not in sitemap
       Product schema 4A remains valid
       no ProductGroup yet
       colour_slug matches DB-generated value
       ```
     - **Faceted 策略(策略 A,已定)**:`?colour=[colour_slug]` 可访问/可分享/SSR 预选/noindex/canonical 回主页/不进 sitemap;页面颜色切换保持 button,**不**生成可爬 `?colour=` 内链(避免 Google 顺内链爬一堆参数页)。
   - ✅ **4B-4 已完成(2026-06-17,PR `feat/variant-productgroup-schema` 已合并 main)**:`ProductJsonLd.jsx` 读 `product_variants`,**≥2 variant_ready 才升级**为 `ProductGroup + hasVariant`(否则保持 4A `Product`)。每变体=`Product`:color=colour_name、image=image_url、url=`?colour=<slug>`、`inProductGroupID`、offers 继承产品级 pricing_tiers×1.40 ex-GST AUD;**变体无每色 sku**(仅 group 层产品级 sku);`variesBy:[color]`。preview 验收(podium-medal-65mm 33 变体)全过;合并后用 Google Rich Results 测正式站。
   - **🎉 4B 变体基础整条线完成**:4B-1 设计 → 4B-2 建表回填(5754 行)→ 4B-3 `?colour=` SSR+noindex → 4B-4 ProductGroup schema。
   - 4B-4:`ProductGroup + hasVariant` schema(读 product_variants,**≥2 variant_ready 才输出**;color=colour_name、image=image_url、offers 继承产品级 pricing_tiers×1.40 ex-GST AUD)。
2. ✅ **#2 颜色可见文字 已完成(2026-06-17,PR `feat/available-colours-text` 已合并 main)**:`ProductClient.jsx` 在色块下渲染服务端 `Available colours: <清洗后色名,去重,≥2 才显示>`(import `cleanColour`,跳过 Custom/占位)。多色无图(档②)产品也覆盖。preview 验收通过(podium-medal-65mm 显示 `Silver and white, …`;单色产品不出;基础页 `?colour=`=0 不变)。Rulebook §11.2。
3. **#5 颜色+品类集合页**(§11.5,接入 url_pages;颜色 SEO 真正杠杆)。
   - ✅ **地基已完成(2026-06-17)**:`products.colour_slugs text[]` 列建好 + 回填 **2515 行**(SSOT = `slugify(cleanColour(name).name)` 主色 token);GIN 索引;DDL=`products_colour_slugs_DDL.sql`、回填=`colour_slugs_backfill_generate.mjs`。
   - ✅ **filter 代码已合并 main(2026-06-17)**:`lib/urlPages.js` 加 `colour_category` 分支(第 285 行;`query.eq('category',…).contains('colour_slugs',[slug])`;无 colour_category 行时 no-op)。产物 = `seo_variants_4b2/urlPages.MAIN.js`。
   - ✅ **第一批 8 页试点已 LIVE + 验收通过(2026-06-17)**:种子 = `colour_pages_pilot_seed.sql`(8 行 `url_pages`,status=live、noindex=false、幂等)。文案 = `colour_pages_pilot_content.md`。slug 规则 `[颜色]-[品类slug]`(pens 用 `black-promotional-pens-australia`/parent `branded-pens-australia`;apparel 用 `white-branded-apparel-australia`)。production 抓取验收:bags(223)/pens(99)/apparel(115) 三页 200、title/canonical 自指/非 noindex/产品列表非空/breadcrumb 正确;sitemap 自动收录(`status='live'`)。8 页产品数:223/162/151/125/115/99/71/67。
   - **两层架构约定(2026-06-17 锁定,hub & spoke)**:
     - **第一层 颜色×大类目(hub,宽泛入口)**:slug = `[颜色]-[现有类目落地 slug]`,如 `black-custom-bags-australia`。product_filter = `{type:colour_category, category, colour_slug}`。门槛 **≥50**。已 live 8 页,**不动**。
     - **第二层 颜色×子类目/产品类型(spoke,长尾转化)**:slug = `custom-[颜色]-[产品类型]-australia` 形式,但**修饰词继承该子类目落地页**(如 `custom-tote-bags-australia` → `custom-white-tote-bags-australia`),不随机。product_filter = `{type:colour_category, category, subcategory, colour_slug}`(filter 代码已支持 optional subcategory,零改动)。门槛 **≥25**(更精准,可比第一层薄;低于门槛不做或 noindex)。breadcrumb 父级 = **子类目落地页**。
     - **slug 修饰词规则**:custom/promotional/branded **跟随父级落地 slug**(确定性、不撞);**绝不为措辞美观改 slug**(slug=URL+库主键)。
     - **文案(title/H1/meta/intro)修饰词规则**:放开变化以满足 §B/§G 不雷同——custom/promotional/branded + with logo/printed/embroidered,但**按产品类型 + 真实装饰方式选**(服饰=branded/embroidered;笔杯硬货=promotional/printed;包=custom/printed),不给只能印刷的产品写 embroidered(§2 只用真实数据)。核心词 `[颜色]+[产品类型]+Australia` 保留,title ≤60。
     - **pens 特例**:第二层下钻到**笔型**(ballpoint/stylus/metal)如 `custom-black-ballpoint-pens-australia`,**不做** `custom-black-pens-australia`(会与已 live 的第一层 `black-promotional-pens-australia` 意图重叠/自相蚕食)。
   - ✅ **第二批 10 页(tier-2 颜色×子类目)已 LIVE + 验收通过(2026-06-17)**:种子 = `colour_pages_batch2_seed.sql`、文案 = `colour_pages_batch2_content.md`。子类目×颜色库存审计(`cross join lateral unnest(colour_slugs) ... having count>=25`)选出。10 页:custom-black-drink-bottles(88)、custom-black-ballpoint-pens(79)、custom-white-drink-bottles(67)、**branded**-black-notebooks(56,父级 branded-notebooks 故 slug 用 branded)、custom-black-backpacks(43)、custom-black-tote-bags(34)、custom-natural-tote-bags(31)、custom-white-t-shirts(33)、custom-black-caps(30)、custom-white-mugs(27)-australia。product_filter 带 subcategory;breadcrumb 父级=子类目落地页(全部存在)。production 抓取验收 notebooks/caps/mugs:200/title/canonical 自指/非 noindex/子类目面包屑/产品数=审计值。文案修饰词按真实装饰变化(notebooks=branded、caps=embroidered、bottles/pens/mugs=printed)。应 Lily 偏好,promotional 打头占 5/10(drink bottles black、ballpoint pens black、tote bags black 三页由 Custom→Promotional,仅改 title/h1/meta、slug 不动)。
   - **#5 累计 18 个颜色集合页 LIVE**(第一批 8 + 第二批 10)。
   - **惯例(Lily 要求)**:每完成一步/一批,**立刻回写本 SEO_HANDOFF.md**(防聊天记录丢失;2026-06-17 已踩过一次,文件是唯一可靠续接点)。
   - **下一步**:① 让这 18 页在 GSC 攒 1–2 周数据(impressions/indexed/CTR/crawled-not-indexed),用 search queries 校准 "custom [colour] [type]" 真实词组;② 据此定第三批——审计 ≥25 候选还剩很多(Drink Bottles 其余色 red/yellow/light-blue/orange/navy/clear、Ballpoint Pens red/white/light-blue/orange、Glassware clear 38、Coffee Cups white 37、Towels white 36、Cooler Bags black 43、Umbrellas black 29、Jute/Paper Bags 等);③ ✅ **已设每周自动健康检查(2026-06-17)**:定时任务 `quirkypromo-colour-pages-health-check`(每周一早,文件 `C:\Users\jilin\Claude\Scheduled\quirkypromo-colour-pages-health-check\SKILL.md`),重抓 18 页确认 200/非 noindex/canonical 自指/产品数不跌破门槛,只在异常时提醒。独立运行,不依赖任何 chat。**每周 SEO 体检运行手册 = `WEEKLY_SEO_CHECK.md`**(清单 + 只读 SQL + GSC 清单全在内;SQL 可跑副本 `weekly_seo_audit.sql`)。第一层候选总 204 组见 `colour_index_audit.mjs`。
   - **节奏(Lily 定)**:现在→6/24 只监控不新增;~7/1 看 GSC indexing+impressions+search queries,按真实搜索词(如 `custom black cooler bags`/`custom clear glassware`/`custom white towels`)定第三批。
4. **#9 FAQ/正文长尾**(with company logo / embroidery / print …)。**⏸ 暂缓到 7/1**(决定 2026-06-17):18 个颜色页正当实验组,现在加 FAQ 会污染 7/1 GSC 数据;`url_pages.seo_content`/`faq` 列已就绪,7/1 看完数据再决定哪些页加。
   - **⚠️ FILTER 开发 SEO 保护线**(勿破坏):产品页 canonical / `?colour=` noindex 逻辑 / Product·ProductGroup·Breadcrumb schema / sitemap 收录规则 / 18 颜色页 URL·title·h1·noindex。完整清单 + 上线自检见 **`SEO_STATUS_ONEPAGER.md`**。
5. ✅ **#10/#11 已完成(2026-06-17,PR `feat/search-noindex` 已合并 main)**。
   - **关键发现**:类目/列表页(category 等)是客户端组件,筛选/排序/分页全是 React 状态、**不写进 URL** → 天然无 `?sort=`/`?page=`/`?material=` 参数页,无 crawl 浪费。全站真正用查询参数的只有产品 `?colour=`(4B-3 已 noindex)和搜索 `?q=`。
   - **#10**:新增 `app/search/layout.js`(server)给 `/search?q=…` 设 `robots: noindex,follow`(client 组件 search/page.jsx 无法自设 metadata)。preview 验收:`/search?q=pen` = `noindex, follow` ✅、产品页 noindex=0 ✅。
   - **#11**:sitemap 准入门已达标(published+name+slug+有图;schema/title/meta/报价路径每个产品页普遍满足),无需改动。
   - 待选收尾:`collections`/`catalog` 未逐一扫(按客户端筛选模式大概率也无参数页);如需彻底确认再抽查。
6. **#17 SEO 编辑后台** Admin>Products>SEO(title/meta/H1/alt_text + seo_status 工作流);**#18 主图 alt_text + 变体显示名人工精修**(高价值产品,颜色+材质+部件+用途)。
   - 例:奖牌类 `Bronze/Light Blue` 自动清洗成 `Bronze and light blue`,人工应精修为 **"Bronze Medal with Light Blue Lanyard"**(`/` 实为 medal/lanyard 语义,机器不可知)。
   - **铁律**:人工精修只改**展示字段**(变体 `colour_name` 显示名 / `alt_text` / H1),**绝不动 `colour_slug`**(它是 `?colour=` URL + 库主键级值,改了 URL 崩、与 DB 失配)。slug 冻结,显示名/alt 可优化。
7. 之后:GFL 上线 SEO 准备、Merchant Center feed(数据稳定后)。

## 6. 关键数字 / 字段速查

- 已发布产品 **2629**;价格模型 = `pricing_tiers.base_price × 1.40`(margin),ex-GST,AUD。
- 颜色名真源 = `products.colours`(JSON: name/hex/image);`product_colours.name` 几乎全是 `Default`(只 images 有用);`colour_label` 是占位符,别用。
- `products` 表**无** `updated_at`(sitemap 因此不填 lastModified);**无**每色 SKU/库存/独立 URL。
- `Custom` = **全彩定制**(full colour),不是占位、也不是离散颜色。
- 后台产品编辑已有部分 SEO 字段(meta_title/meta_description/alt_text 等)。

## 7. 配套文件(当前布局)

- `Product_SEO_Rulebook_v3.md`(promohub 根)— **权威规则**(North Star + §1–§13 + Part II 治理 + backlog)。本 Handoff = 进度/流程,Rulebook = 规则标准,重叠以 Rulebook 为准。
- `Variant_Foundation_4B1_Design.md` — 4B 变体设计(审计/三档)。
- **`seo_variants_4b2/`(promohub 子目录)= 4B-2/4B-3 全部产物:**
  - `variant_backfill_estimate_READONLY.sql` — 回填前只读检查(PART A–H,含 PART G 候选导出)
  - `variant_backfill_audit.mjs` — 权威 dry-run 审计(import 真实 `lib/colourName`)
  - `variant_backfill_generate.mjs` — INSERT DRAFT 分片生成器
  - `product_variants_DDL.sql` — 建表 DDL(已 apply)
  - `Variant_4B2_Backfill_Decisions.md` — **决策锁定记录**(口径/逐字段规则/colour_slug SSOT/完成状态)
  - 4B-3 改后文件:`colourName.UPDATED_for_4B3.js`(→lib/colourName.js)、`page.4B3.js`(→app/products/[slug]/page.js)、`ProductClient.MAIN.jsx`(→…/ProductClient.jsx,已就地改好)
  - `4B3_implementation_guide.md` — 4B-3 实施指南 + 验收清单
- `lib/colourName.js` — 共享颜色清洗,**已在 main**(PR #9 `fix/alt-colour-clean`);4B-3 给它加 `export colourSlug`。
- 历史数据脚本 `*_apply.sql` / `*_READONLY.sql`(早期 outputs,非 4B)。

---

## SEO 层次架构 + 分工 + 路线（记于 2026-06-18）

> 解答"之前批量 SEO 和后来做的会不会冲突/白搞":**不冲突,是四个互补的层。**

### 四层（互补,不互相覆盖）
- **A · 产品页**(每产品 title/meta/alt):后台 SEO tab 填 `meta_title / meta_description / seo_description / alt_text`;产品页代码**用这些字段,空则模板兜底**(`Custom {name} with Logo`)+ canonical + `withBrand`(品牌名只加一次、不重复)+ alt 校验。→ **override + fallback,零冲突。** 当初就是为 TRENDS 批量产品配套设计的。
- **B · 集合/类目/颜色页**:18 个颜色集合页(`/black-custom-bags-australia`…)、`/promotional-products`、`/promo-kits`。独立 `url_pages`,与产品 meta **零重叠**。
- **C · 站点结构 / 技术 SEO**:首页 metadata + JSON-LD(Org/WebSite/SearchAction)、sitemap、canonical 规则、filter/builder 参数 noindex、产品链接 404 修复、FILTER SEO 护栏。
- **D · 规则 / 文档**:`Product_SEO_Rulebook_v3.md`、本文件、每周体检。

### "SEO 后台" 现状
- ✅ 已有:后台产品编辑器的 **SEO tab**(逐产品手填,接线上)= 现在你有的。
- ❌ 未有(升级项 **#17**):**管理/规模层** —— `seo_status`(auto/reviewed/needs-review)+ 列表筛"待人工" + 批量 + AI 辅助生成。

### 还差什么 + 三步路线（Lily 定 2026-06-18）
1. **现在做（产品页小代码任务,独立线)**:H1 加 "Custom"(`<h1>Custom {name}</h1>`,产品名已含 Custom 的不重复)+ **Product / Offer / BreadcrumbList JSON-LD**(name/image/brand/价格 from pricing_tiers/AUD)。**不含 `aggregateRating`**(无逐产品真实评分,禁造假);**不含 `availability`/交期承诺**(stock 风险,见 `STOCK_ACCURACY.md`)。验收:Google Rich Results Test。
2. **接着（产品页内容,代码)**:加"按产品变"的内容区块(Why this {category} · Branding options(来自 `decoration_options`)· How we add your logo · Lead time · FAQ)。⚠️ 必须按类目/材质/装饰**真不同**,否则薄/重复内容反伤。
3. **长期（内容 + 后台)**:top/热卖产品人工精修;`seo_status` 管理层 + AI 辅助生成(= #17 SEO 后台)。
