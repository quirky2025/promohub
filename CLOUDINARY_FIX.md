# Cloudinary 图片止血 — 应用指南

> 目标:开发时不再向 Cloudinary 烧 image 请求;线上列表页图片懒加载。
> 诊断已确认:全前端 0 处 `loading="lazy"` / `next/image`,列表页网格一次渲染 24–96 张原生 `<img src=cloudinary>`,dev 热更新/刷新反复打 Cloudinary。
> 已产出文件:`components/ProductImg.jsx`、`public/placeholder-product.svg`(把这两个 copy 进全新克隆的分支)。

---

## 第 0 步:今天就做,零代码(立即见效)
- 浏览器 DevTools → Network → **取消勾选 "Disable cache"**(不排查缓存时别开着)。
- 别用 **Ctrl + F5 硬刷**,普通刷新让浏览器缓存命中。
- 光这两点,开发时的 Cloudinary 请求就能降一大截。

## 第 1 步:开分支(按 SEO_HANDOFF 铁律,别动本地仓库)
```
cd C:\Users\jilin\Desktop && git clone <repo> promohub-cloudinary
cd promohub-cloudinary && git checkout -b fix/cloudinary-image-loading
```
然后把这两个新文件 copy 进去:
```
copy /Y "C:\Users\jilin\Desktop\promohub\components\ProductImg.jsx" "components\ProductImg.jsx"
copy /Y "C:\Users\jilin\Desktop\promohub\public\placeholder-product.svg" "public\placeholder-product.svg"
```
> `ProductImg` = dev 环境自动显示占位图(避免烧 Cloudinary)+ 懒加载 + decoding=async。开发时想看真实图:设 `NEXT_PUBLIC_REAL_IMAGES=1`。

## 第 2 步(推荐):一键脚本自动替换
把脚本也 copy 进 clone,跑一条命令,自动改好 **9 个列表页 + 商品详情页**(插 import + `<img>`→`<ProductImg>`,幂等):
```
copy /Y "C:\Users\jilin\Desktop\promohub\scripts\apply_product_img.mjs" "scripts\apply_product_img.mjs"
node scripts/apply_product_img.mjs
git diff      :: 复核:应只多出 import + <img>→<ProductImg>
```
> 已在沙箱用真实文件验证:9 列表页各 1 处 + ProductClient 5 处,全部命中。详情页主图 `eager`+`size="detail"`,缩略图/颜色图/相似品 `lazy`+`size="thumb"`。组件内已含 Cloudinary 缩略图改写(列表 `w_400`)+ 错图 fallback(= 第二轮的一部分,无需额外改)。

---

### 手动备选(若不想跑脚本)
列表页把产品 `<img>` 换成 `<ProductImg>`(止血主力)
每个文件:① 顶部加 import;② 把网格里的产品图标签名从 `img` 改成 `ProductImg`(属性原样保留)。

**import(加在各文件其它 import 后):**
```js
import ProductImg from '@/components/ProductImg';
```

**逐文件:把 `<img src={img} ... />` → `<ProductImg src={img} ... />`**(行号供定位,以实际为准):

| 文件 | 网格产品图(改这个) |
|---|---|
| `app/category/[category]/page.js` | ~L289(另可选 L194 子类卡 `sub.image`) |
| `app/category/[category]/[subcategory]/page.js` | ~L270 |
| `app/search/page.jsx` | ~L106 |
| `app/sale/page.js` | ~L200 |
| `app/new-arrivals/page.js` | ~L200 |
| `app/collections/[slug]/page.js` | ~L250 |
| `app/brands/[slug]/page.js` | ~L193 |
| `app/indent/IndentCatalog.jsx` | ~L207 |
| `app/page.js`(首页) | ~L484(产品网格);分类/行业卡 L300/L418 可选 |

例(category 页):
```jsx
// 改前
? <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
// 改后
? <ProductImg src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
```
> 只换**产品图**。`<div>📦</div>` 兜底、`alt`、`style` 都不动。

## 第 3 步:商品详情页 `app/products/[slug]/ProductClient.jsx`(谨慎)
⚠️ 此文件**本地有未提交改动**,务必在**全新克隆的 main 版本**上改,别用本地版覆盖。
- 主图 ~L259 → `<ProductImg ... eager />`(首屏,立即加载)
- 画廊缩略图 ~L268 → `<ProductImg ... />`(懒加载)
- 颜色图 ~L305 / L325 → `<ProductImg ... />`(懒加载;**进阶**:只在点击颜色时才加载大图)
- Similar products ~L852 → `<ProductImg ... />`(懒加载)

## 第 4 步:静态图移到 public/(可选,非止血关键)
logo、首页固定 banner(`IMG.fastPromo`/`customSourcing`)、品牌图标(`brand.src`)、装饰图这些**不需要 Cloudinary** → 放 `public/` 直接引用。Cloudinary 只留真正的商品图/用户上传图。
> 这些静态图**不要**换成 `ProductImg`(否则 dev 也被占位)——给它们单独加 `loading="lazy"` 即可,或移到 public。

## 第 5 步:验收 + 观察
- `npm run dev` → 打开分类/搜索/首页,DevTools Network 过滤 `cloudinary`,**刷新应几乎为 0**(显示占位图)。
- 设 `NEXT_PUBLIC_REAL_IMAGES=1` 重启 → 应能看到真实图(确认逃生口好用)。
- `node --check`(或本地 build)通过 → PR → Vercel preview 验收(**生产环境必须显示真实图**,因为 NODE_ENV=production)。
- merge 后**观察 2–3 天 Cloudinary impression 日增长**,那个数字才接近真实消耗;稳了再决定要不要升级额度。

---
## 路线图(三轮)

**第一轮 — 机械止血(= 本指南上面的步骤)**
列表页 `.map()` 的产品 `<img>` → `<ProductImg>`(= 你说的 `<ProductImage>`),自动 lazy + decoding + dev 占位;详情页主图 `eager`、缩略图/颜色图/相似品 lazy。
> **效率提示**:组件已建好,**直接换组件**,不要"先手动加 lazy、之后再换组件"——否则每个文件改两遍。
> 新产品入库自动受益(改的是渲染逻辑,不用逐个处理)。

**第二轮 — 充实统一组件(零改调用点)**
只改 `ProductImg` 内部,所有页面自动生效:Cloudinary URL 优化参数(列表 `w_400` / 详情大图 + `f_auto,q_auto`)、错图 fallback、尺寸规范、首屏 `priority`、dev 占位。

**第三轮 — 更深优化(正式放量前)**
- `next/image` 接管远程图 + 配置 Cloudinary remote pattern
- 列表只取 `w_400` 缩略图,详情才取大图
- 商品详情颜色图**点击才加载**,不全预加载
- 列表分页 / 无限滚动(注:分类页已是 24 + Load More,lazy 后下方图也不加载,压力已小)
- logo / 固定 banner / 静态分类图**移出 Cloudinary** → `public/`

**新页面铁律**:以后新 collection / 推荐区 / carousel / admin preview,**不要裸写 `<img src=cloudinaryUrl>`**,一律用 `ProductImg`(至少加 `loading="lazy"`)。可选:加一条 eslint 规则禁止裸 `<img>`,防漏。

---

## 第三轮待办 + 排期(目标日:2026-06-21)

**前提**:第一轮+二轮止血已 merge 上线、观察 2–3 天 impression 趋势(止血需在 ~6/19 前部署)。已设 **6/21 一次性提醒**。

1. **next/image 接管远程图**:`next.config.mjs` 配 `images.remotePatterns`(`res.cloudinary.com`,cloud `dyz9r0fm7`);列表/详情图改 next/image(要 width/height 或 fill,**注意布局别错位**),或在 `ProductImg` 内部切换到 next/image。
2. **缩略图 vs 大图**:组件已按 `size` 注入 `w_400`/`w_900`,确认线上生效;必要时细化各页 `size`。
3. **颜色图点击才加载**:商品详情页颜色大图不全预加载,改 `ProductClient.jsx`。
4. **列表分页/无限滚动**:分类页已 24 + Load More;检查 search / collections / brands 等是否一次性渲染过多。
5. **静态图移出 Cloudinary**:logo、首页 banner(`IMG.fastPromo`/`customSourcing`)、分类静态图、品牌图标 → **下载真实图放 `public/`(需 Lily 提供图二进制)**,改引用;这些不走 `ProductImg`。
6. 全程照 `DEV_PROD_SEPARATION.md`,不裸写 `<img src=外部URL>`。
