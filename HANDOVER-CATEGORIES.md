# HANDOVER — 后台产品数量 + 分类不一致 + Banner 系统收尾

写给接手的新 chat。作者:上一个 chat(Lily 反馈后台 Products 页面数量不对、分类和前端不一样)。
日期:2026-07-18。

---

## 0. 先读这个

主交接文档是根目录的 **`HANDOVER.md`**(协作规则、技术坑、架构约定、SQL 清单)。
**先读完那份**,本文件只补充三件当前未完成的事。

Lily 的几条硬规则,请务必遵守:

1. **动 UI 之前先问清楚放在哪个页面**。她说过:"下次你一定要问清楚在哪里,这下又几个回合,浪费时间。"
2. **不要假设她没 push**。她说过:"全部 PUSH 过了,早就 PUSH 了,怎么还说没有 PUSH?"
3. 能做成她自己在后台点一下的功能,就不要写死在代码里。
4. 后台文字用**黑色 `#000`**,不要灰色/金色正文。后台英文为主,Sourcing 那几页中文可以。
5. 每个实体都要有完整增删改查,**包括「编辑」**。
6. 密钥永远不要向她索取,她自己在 Vercel 里配。

---

## 1. 问题一:后台产品数量不对(All 3000 / Published 2714 / Not Published 286)

### 根因(已定位,未修)

`app/api/admin/products/route.js` 第 18 行:

```js
let query = supabase
  .from('products')
  .select('id, name, slug, category, ... , description')
  .order('name')
  .limit(3000);          // ← 这里
```

后台 `app/admin/products/page.js` 的三个数字是**从返回的数组算出来的**,不是数据库真实计数。
所以 `All (3000)` 其实是"被截断到 3000 条"的意思,`2714 + 286 = 3000` 只是自洽,不代表真实库存数。

另外注意:Supabase PostgREST 自身还有 `max-rows` 上限(常见默认 1000),
即使把 `.limit()` 去掉也不一定能一次取全,需要 `.range()` 分页循环。

### 建议改法

1. 三个 tab 的数字改成**独立的精确计数查询**,不查数据:

```js
const { count } = await supabase
  .from('products')
  .select('*', { count: 'exact', head: true })
  .eq('is_published', true);
```

2. 列表本身改成**服务端分页**(`.range(from, to)` + 每页 100/200),或者保留大 limit 但在 UI 上
   明确标注"显示前 N 条,请用搜索缩小范围"。
3. 搜索/筛选条件要**同时**作用在计数查询和列表查询上,否则数字和列表对不上。

### 验收

先在 Supabase SQL Editor 跑一句拿到真值,再对比后台显示:

```sql
select
  count(*)                                        as total,
  count(*) filter (where is_published)            as published,
  count(*) filter (where is_published is not true) as not_published
from public.products;
```

后台三个数字必须和这三个值**完全一致**。

---

## 2. 问题二:后台 Products 的 CATEGORY 和前端不一样

这是 Lily 最新提的问题,**根因已查清,一行代码都还没动**。

### 真相:前台分类根本不是 `products.category`

前台有**两套**分类来源,后台 Products 页面显示的是**第三套**(数据库原始值),所以对不上。

**① 顶部导航菜单(`components/Nav.jsx`)**
从数据库视图 **`nav_subcategories`** 拉取,然后做三层加工:

- `HIDDEN_LEGACY_CATEGORIES` — 直接隐藏这些历史分类:
  `Business`、`Print`、`Personal`、`Promotion`、`Promotional`、`Leisure`
- `CROSS_CATEGORY_HOME` — 把某些子分类归到别的父类:
  `Note Pads → Office & Desk`、`Promotional → Promotion`、`Travel → Leisure`、
  `Drinkware Presentation → Drinkware`
- `FLAT_NAV_OVERRIDES` — 约 20 个主分类的**人工策划清单**,带自定义 SEO 链接

**② 客户实际看到的分类页(`app/[slug]/page.js` + `lib/urlPages.js`)**
这才是真正的类目页,数据来自 **`url_pages` 表**(`status = 'live'`),URL 是 SEO 长链:

| 后台 `products.category` | 客户实际访问的 URL |
|---|---|
| Bags | `/custom-bags-australia` |
| Drinkware | `/custom-drinkware-australia` |
| Apparel | `/custom-branded-apparel-australia` |
| Headwear | `/custom-headwear-australia` |
| Pens | `/branded-pens-australia` |
| Technology | `/corporate-tech-gifts-australia` |
| Flags & Displays | `/trade-show-displays-australia` |
| Pet | `/branded-pet-products-australia` |
| …(共约 20 个,见 `Nav.jsx` 的 `FLAT_NAV_OVERRIDES`) | |

`app/category/[category]/page.js`(`/category/bags` 这种)是**旧路由/次要路由**,
它用 `ilike('category', titleFromSlug(slug))` 直接匹配原始字段。它还活着,但不是主入口。

**③ 后台 Products 页面**
直接显示 `products.category` 原始值,没有任何映射。所以会出现前台已经隐藏/改名/合并的分类。

### 需要先问 Lily 的问题(不要自己拍板)

这个不是纯 bug,是**要定哪个是唯一真相**。建议直接问她二选一:

- **A. 后台跟随前台** — 后台 Products 的 CATEGORY 下拉只显示前台在用的分类
  (从 `url_pages` / `nav_subcategories` 取),改产品分类时只能选这些。
  好处:所见即所得,不会再选到隐藏的历史分类。
- **B. 清洗数据** — 把 `products.category` 里的历史值(Business / Print / Personal /
  Promotion / Promotional / Leisure 等)批量改成正式分类,让三套合一。
  好处:一劳永逸;风险:要动 3000 条数据,**必须先备份**。

我的倾向是 **先 A 再 B**:A 立刻止血且零风险,B 找个时间单独做并逐条确认映射关系。
但**一定要她拍板**,不要直接开工。

### 做 B 之前必须先跑的盘点 SQL

```sql
select category, count(*) as n
from public.products
group by category
order by n desc;
```

把结果给 Lily 看,让她逐个确认哪些是要保留的、哪些要合并到哪里。

---

## 3. 问题三:Banner 系统还没收尾(而且有一个我引入的 bug)

### 已完成并已 push

- `db/page_banners.sql` — 通用 banner 表(`page_type` / `page_key` / `sort_order`)
  **Lily 已被告知要跑这个;旧的 `db/category_banners.sql` 作废,不要跑。**
- `app/api/admin/banners/route.js` — 通用 API(multipart 上传到 R2 + upsert;JSON 改文案;DELETE)
- `app/admin/banners/page.js` — 后台四个 tab:分类 / 品牌 / 系列 / 首页轮播,
  浏览器端压缩(最宽 1920px、WebP 0.82)
- `components/HomeCarousel.jsx` — 首页轮播(6 秒自动切换、圆点导航、没有图时 `return null`)
- `app/page.js` — 已挂载 `<HomeCarousel />`,在 trust strip 之前。
  首页原有的 H1 大标题**故意保留**(SEO 关键),只让图片可换。
- `app/category/[category]/page.js` — hero 已接 `page_banners`

全部通过 esbuild 语法校验。

### ⚠️ 我引入的 bug — 必须修

`app/admin/banners/page.js` 里的 `loadKeys()` 是这样取分类列表的:

```js
const { data } = await supabase.from('products').select(col).eq('is_published', true);
// → 然后 slugify(名字) 当作 page_key
```

**这正好踩中第 2 节的坑。**两个后果:

1. 分类 tab 会列出前台**已经隐藏**的历史分类(Business / Print / Personal…),Lily 会看到一堆
   根本不存在的页面。
2. 每行的「看页面 →」链接指向 `/category/{slug}`,但那约 20 个主分类客户实际是访问
   `/custom-bags-australia` 这种 SEO 链接的。**她在后台传了图,去看 SEO 页面会发现没变化**,
   因为 `app/[slug]/page.js` 根本还没接 `page_banners`。

**修法:**

- 分类 tab 的 key 改成从 **`url_pages`(status='live')** 取,`page_key` 直接用 `url_pages.slug`,
  「看页面 →」用 `/{slug}` 或 `canonical_url`。这样后台列表 = 客户真实页面,一一对应。
- 然后在 `app/[slug]/page.js` 的 hero 接上 `page_banners`
  (`page_type='category'`、`page_key=slug`、`is_active=true`),写法照抄
  `app/category/[category]/page.js` 里已经写好的那段 `useEffect` + 背景渐变叠加。
- `app/category/[category]/page.js` 可以保留现状(旧路由),但要注意两条路由的 `page_key`
  规则要统一,否则同一个分类会存出两条 banner 记录。

### 还没做的

- **品牌页** `app/brands/[slug]/page.js` — hero 还没接 `page_banners`(能存,不显示)
- **系列页** `app/collections/[slug]/page.js` — 同上
- 上面这两个我已经**明确告诉 Lily**「存得进去、但页面还没显示」,等她确认分类页方向对了再接。
  不要让她以为已经好了。

---

## 4. 建议的推进顺序

1. **先问 Lily 第 2 节的 A/B 选择**(这个决定会影响 Banner 的 key 用什么)。
2. 修 **第 1 节的产品数量**(独立、低风险、她马上能看到效果)。
3. 按她的选择修 **Banner 的 key 来源**,并把 `app/[slug]/page.js` 的 hero 接上。
4. 接 **品牌页 / 系列页** 的 hero。
5. 全部 esbuild 校验 → 给她 push 命令 → 让她实际传一张图验收。

---

## 5. 其他挂起中的事(来自 `HANDOVER.md`,未开工)

- **供应商付款字段** — 给 `suppliers` 表加银行/账号/付款方式字段(照抄 `forwarders` 的做法)。她已同意,没开始。
- **Dashboard「⚠️ 交货提醒」** — 快到期/已逾期订单高亮列表。方案已确认,没开始。
- **POA 铺开** — 分类页/系列页/品牌页/new-arrivals/sale 等列表页要不要也显示 POA。已问,她没回。
- 大视频直传 R2 + 内嵌播放 — 提过,她没要求。

---

## 6. 每次动手前的自检

- [ ] 这个 UI 放在**哪个页面**?已经跟 Lily 确认过了吗?
- [ ] 有没有和已有功能重复?(她说过:"你下次做的时候要统一,不要老是反工")
- [ ] 新实体有没有**编辑**功能?
- [ ] 写库走的是 service-key API 路由吗?(客户端直接 `supabase.update()` 会被 RLS 静默吞掉)
- [ ] 失败有没有 `alert` 把错误抛给她看?
- [ ] 改完有没有跑 esbuild 校验?
- [ ] 有没有需要她跑的 SQL?**SQL 内容要直接贴在聊天里**,她不习惯去翻 `db/` 文件夹。
