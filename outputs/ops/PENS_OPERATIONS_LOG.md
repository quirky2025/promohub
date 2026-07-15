# Pens 类目运营精修 · 操作记录（交开发线 / 团队可见）

**起于** 2026-07-13 · Lily + Claude(Cowork)。运营阶段第一个精修类目 = Pens,作为**样板**,后续类目照此复制。
本记录 = 所有代码改动 + 数据 SQL + 决策 + 状态,一处看全。

---

## 一、代码改动（需 commit/push 才生效）

| 文件 | 改动 | 影响面 |
|---|---|---|
| `components/SeoContent.jsx`(新) | seo_content 按 **HTML 渲染**(H2/H3/列表/链接)+ FAQ 折叠 + 拦截 "Get a Quote" 链接开**询价弹窗** | 全站类目页 |
| `app/[slug]/page.js` | 开头段用 **`seo_intro`**(≠ SEO meta);内容区换成 SeoContent;输出 **FAQPage schema**;+ 性能:ISR、generateStaticParams、payload 精简、子类查询 24→1 | 全站类目页 |
| `lib/urlPages.js` | 新增 **`collection`** filter 类型(交叉挂,extra_subcategories 标签);`getLiveUrlPage` 加 cache() 去重;`getAllLivePageSlugs` | 全站 |
| `components/Nav.jsx` / `next.config.mjs` | Pens 下拉新增 **Pen Gift Sets、Novelty Pens** | 导航 |
| `lib/filterAttributes.js` | 材质:**ABS→Plastic**、拆出 **Recycled Aluminium**、新增 **Paper / Wheat Straw**;价格档新增 **Under $1**(`<$1`,并把 `<$2` 拆成 `$1-2`) | 全站 filter |
| `lib/filterConfig.js` | 价格档顺序含 `<$1`;**BRAND 隐藏 Intex**(供应商非品牌) | 全站 filter |

**Push 命令:**
```
git add "app/[slug]/page.js" components/SeoContent.jsx lib/urlPages.js components/Nav.jsx next.config.mjs lib/filterAttributes.js lib/filterConfig.js
git commit -m "Pens: deep copy + Pen Gift Sets + Novelty Pens + filter fixes"
git push
```

## 二、数据 SQL（Supabase 各跑一次；整张跑）

| 文件 | 作用 | 状态 |
|---|---|---|
| `pens_page_copy.sql` | Pens 深化文案(title/meta/seo_intro/选购指南/6条FAQ)+ 加 `seo_intro` 列。链接:decoration-methods、eco-pens、**pen-presentation + pen-gift-sets**(executive gifts 那句)、Get-a-Quote 弹窗 | 待跑 |
| `pen_gift_sets_build.sql` | **Pen Gift Sets** 集合(33 个产品 extra_subcategories 打标 + url_pages `type=collection`)。笔+本主户口留 Notebooks,交叉挂到此 | 待跑 |
| `novelty_pens_build.sql` | **Novelty Pens** 子类(14 个造型/趣味笔移入 Pens/Novelty Pens,含把 P730 从 Toys 收回)+ url_pages | 待跑 |
| `pen_brand_backfill.sql` | 品牌回填:LAMY / Moleskine / Swiss Peak / Pierre Cardin 写入 brand 列(BRAND filter + 品牌落地页基础)。**Parker 已排除**(衬衫款式名误报);Cross 待人工挑 | ✅ 已跑(STEP 2/3) |

## 三、分类学决策（数据说话的结果）

- **保留类型子类**:Ballpoint / Stylus / Highlighter / Pencil(+ Eco Pens / Pen Presentation / Pen Gift Sets / **Novelty Pens** 新)。
- **不拆** Gel(6)/ Rollerball(10)/ Fineliner(11):量太小(pen_type_probe_v2 实测),留在 Ballpoint 靠 filter。
- **Ballpoint ~300 不是分错**:促销笔本就以 ballpoint 为主。
- **3 个趣味高光笔**(Spinner/Jumbo Highlighter)**留在 Highlighters**,不进 Novelty。
- **材料只做 filter**(Metal/Plastic/Bamboo/Paper/Recycled Alu…),不做类型子类。
- **Metal Pens / Plastic Pens 现存子类**(7/3,来自旧 Intex 导入)—— **暂不动**,计划改成"材料落地页"(见 roadmap 第1/3步,依赖 material_tags 齐)。
- **品牌是全站级**(Swiss Peak/Pierre Cardin/Moleskine 跨品类)→ 品牌落地页 = Shop by Brand。

## 四、落地页(LP)+ Also-Found-In 架构

详见 `dev_requests/LP_ARCHITECTURE_ROADMAP.md`。6 类 LP(类型/材料/机制/品牌/颜色/集合)+ PDP 的 "Also Found In" 把它们全链出来(含品牌链接)。引擎已有 collection + colour;待补 brand / material / mechanism 三个 filter 类型。

## 五、待办 / 待决策

- [ ] 跑 §二 的 SQL 1-3 + push §一 代码 → 上线 Pens 深化 / Gift Sets / Novelty。
- [ ] Metal/Plastic 子类 → 材料落地页(先查 material_tags 数据)。
- [ ] 首批 LP:Retractable(105)/ Metal / Bamboo / 品牌页(Bic/Swiss Peak/Moleskine/Pierre Cardin/LAMY)。
- [ ] **Hero 换图(Lily 主导)**:类目页第一屏现为 **navy 纯色底**(`Hero` 组件,`app/[slug]/page.js`)。计划换成**产品图 hero**(QLP 风)——**供应商现有产品图里有可用的**,不用另拍。待 Lily 选图 + 定版式后落地。范围:先 Pens,通用后推全站。
- [ ] Novelty Pens 产品图核对。
- [ ] Also-Found-In(PDP 内链块)。
- [ ] 卡片增强:"See it with your logo" + "+N more colours"(见 `dev_requests/CARD_ENHANCEMENTS_SPEC.md`)。
- [ ] Review 系统(独立工作流,待定评价来源)。
- [ ] Cross 品牌人工挑真·Cross 笔后回填。

## 六、验证清单(上线后)

`/branded-pens-australia`(新开头段 + 选购指南 H2/H3 + FAQ + Under $1 filter + Get-a-Quote 弹窗)、`/pen-gift-sets-australia`(33)、`/novelty-pens-australia`(14);BRAND filter 出现 LAMY/Moleskine/Swiss Peak/Pierre Cardin、无 Intex;材质出现 Paper/Bamboo/Recycled Aluminium。

---
*本记录随 Pens 精修推进持续更新。*
