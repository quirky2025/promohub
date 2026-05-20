# QuirkyPromo 项目进度文档
> 每次新Chat开始时，把这个文件内容发给Claude即可，按需再发具体文件。

---

## 工具和服务
- **框架**：Next.js 16.2.6（Turbopack）
- **数据库**：Supabase（https://ztfmeopyknfzmxvbpnxo.supabase.co）
- **部署**：Vercel（promohub-store.vercel.app）
- **图片存储**：Cloudinary
- **域名**：quirkypromo.com.au（在GoDaddy，考虑换域名，待绑定）
- **邮件服务**：Resend（待接入，用于发Invoice和询价邮件）
- **支付**：Stripe（待接入）
- **代码仓库**：GitHub（quirky2025/promohub）

---

## 项目基本信息
- **网站名称**：QuirkyPromo
- **业务**：澳洲B2B促销品电商
- **主要客户**：大企业/品牌部门
- **品牌定位**：高端专业（Premium & Corporate）
- **项目路径**：`C:\Users\jilin\Desktop\promohub`
- **线上网址**：https://promohub-store.vercel.app/

---

## 颜色方案
- NAVY = '#1B2A4A' 深藏青（主色）
- GOLD = '#C9A96E' 金色（强调色）
- BG = '#F8F7F4' 米白（背景）

## 字体方案
- Logo/标题：Cormorant Garamond
- 正文/导航：DM Sans
- 数字/SKU：DM Mono
- Google Fonts已在 app/layout.js 引入

---

## URL结构（树形，已完成）
```
/category/bags                          ← 分类页面（显示子分类网格）
/category/bags/backpacks               ← 子分类页面（显示产品列表）
/products/alumni-soft-touch-backpack   ← 产品详情页（无SKU号）
```

## Slug规则
- `&` → `-and-`，空格 → `-`
- 例：`Pads & Planners` → `pads-and-planners`
- 还原：先`-and-`→` & `，再`-`→空格
- 产品slug已去掉末尾SKU号（SQL: REGEXP_REPLACE(slug, '-\d+$', '')）

---

## 数据库结构（Supabase）
4个表：products / product_colours / pricing_tiers / decoration_options

**products主要字段：**
- id, supplier_sku, name, slug（干净格式，无SKU号）
- category, subcategory
- description, short_desc
- min_qty, setup_fee, shipping, margin, status
- packing, lead_time_days, has_rush, rush_multiplier
- **colours（jsonb）**：[{"name": "Navy", "hex": "", "images": [...]}, ...]

**product_colours：**
- images（jsonb，URL数组）— 按文件名数字排序
- 图片规律：images[0]=主图，images[1..N]=颜色图（N=colours字段颜色数量），images[N+1..]=包装图

**pricing_tiers：** id, product_id, min_qty, max_qty, base_price, sort_order

**decoration_options：** id, product_id, name, detail, per_unit, has_setup, setup_qty_editable, default_setup_qty, sort_order

---

## 定价逻辑
- MARGIN = 1.40（加价40%）
- GST = 10%
- SHIPPING = $30固定
- SETUP_FEE = $40（成本价）
- 零售价 = base_price × MARGIN

---

## 支付方案（已确认）
- **Pay Now** → Stripe，含2%手续费 → 付款成功 → 自动发Invoice（状态：PAID）
- **Pay by EFT** → 自动发Invoice（状态：UNPAID）→ 客户银行转账
- 两种都发Invoice，格式一样，只是付款状态不同

---

## 文件结构
```
promohub/
├── app/
│   ├── layout.js                       ✅ Google Fonts + Nav + Footer
│   ├── globals.css                     ✅ 全局样式
│   ├── page.js                         首页
│   ├── products/
│   │   └── [slug]/
│   │       ├── page.js                 ✅ 产品详情页
│   │       └── ProductClient.jsx       ✅ 产品详情客户端
│   ├── category/
│   │   └── [category]/
│   │       ├── page.js                 ✅ 分类页面（子分类网格）
│   │       └── [subcategory]/
│   │           └── page.js             ✅ 子分类页面（产品列表+Filter）
├── components/
│   ├── Nav.jsx                         ✅ hover正常
│   └── Footer.jsx                      ✅
├── lib/
│   └── supabase.js                     ✅
└── .env.local                          ✅ Supabase URL和Key
```

---

## 已完成 ✅
1. Header / Footer / Nav（hover正常）
2. 字体颜色主题（Cormorant + DM Sans + DM Mono）
3. Category页面 — 子分类网格
4. Subcategory页面 — 产品列表+Filter
5. 产品详情页 — 图片切换+颜色+价格+装饰+Add to Cart+Get a Quote+Tabs+Similar Products
6. URL树形结构：/category/[cat]/[subcat]/
7. 产品slug去掉SKU号
8. Vercel部署 + 环境变量
9. &符号URL修复

---

## 下一步 ⏳（按优先级）

1. **Get a Quote表单** ← 下一个！
   - 产品页"Get a Quote"按钮 → 弹窗
   - 表单：姓名、公司、邮件、电话、数量、颜色、备注
   - 提交 → 用Resend发邮件给你

2. **购物车 + 结账**
   - Add to Cart → 购物车页面
   - Pay Now（Stripe + 2%）→ Invoice PAID
   - Pay by EFT → Invoice UNPAID
   - 两种都自动发Invoice给客户

3. **客户登录/注册**（Supabase Auth）

4. **域名绑定**

## Phase 2
- 搜索功能
- 后台管理页面
- 产品数据整理

## Phase 3
- Artwork Mockup（Cloudinary）
- 月结账户
- Merch Store

---

## 联系信息
- 电话：02 9477 4748
- 运费：$30固定
- GST：10%
- 银行：（EFT付款时显示，待填写BSB和账号）

最后更新：2026-05-20
