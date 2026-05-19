# QuirkyPromo 项目进度文档
> 每次新Chat开始时，把这个文件内容发给Claude，他就能立刻了解所有背景。

---

## 项目基本信息
- **网站名称**：QuirkyPromo
- **域名**：quirkypromo.com.au
- **业务**：澳洲B2B促销品电商
- **主要客户**：大企业/品牌部门
- **品牌定位**：高端专业（Premium & Corporate）
- **项目路径**：`C:\Users\jilin\Desktop\promohub`
- **框架**：Next.js 16.2.6（Turbopack）
- **数据库**：Supabase
- **Supabase URL**：`https://ztfmeopyknfzmxvbpnxo.supabase.co`
- **Vercel项目名**：promohub-store

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

## 数据库结构（Supabase）
4个表：products / product_colours / pricing_tiers / decoration_options

**products主要字段：**
- id, supplier_sku, name
- slug（格式：name-SKU，如alumni-soft-touch-backpack-127717）
- category, subcategory
- description, short_desc
- min_qty, setup_fee, shipping, margin, status
- packing, lead_time_days, has_rush, rush_multiplier
- **colours（jsonb）**：颜色名称，格式：[{"name": "Navy", "hex": "", "images": [...]}, ...]

**product_colours：**
- id, product_id, name（大部分是"Default"）, hex（大部分NULL）
- images（jsonb，URL数组）— 按文件名数字排序
- 图片规律：images[0]=主图，images[1..N]=颜色图（N=colours字段颜色数量），images[N+1..]=包装/feature图

**pricing_tiers：** id, product_id, min_qty, max_qty, base_price, sort_order

**decoration_options：** id, product_id, name, detail, per_unit, has_setup, setup_qty_editable, default_setup_qty, sort_order

---

## 导航结构（方案B）
All Products（mega下拉）/ Collections / Brands / Eco / New Arrivals / Sale

---

## 定价逻辑
- MARGIN = 1.40（加价40%）
- GST = 10%
- SHIPPING = $30固定
- SETUP_FEE = $40（成本价）
- 零售价 = base_price × MARGIN

---

## 支付方案（已确认）
- Pay Now → Stripe，含2% surcharge
- Pay by EFT → 银行转账，自动发Invoice，生产前必须付款

---

## 文件结构（重要文件）
```
promohub/
├── app/
│   ├── layout.js                       ✅ 含Google Fonts + Nav + Footer
│   ├── globals.css                     ✅ 全局样式（含dropdown link hover样式）
│   ├── page.js                         首页
│   ├── products/
│   │   └── [slug]/
│   │       ├── page.js                 ✅ 产品详情页（slug查询，解析colours字段）
│   │       └── ProductClient.jsx       ✅ 产品详情客户端
│   ├── subcategory/
│   │   └── [slug]/
│   │       └── page.js                 ✅ 子分类页面含Filter
│   ├── category/                       ⏳ 待做（显示Coming Soon）
│   └── ...其他页面（coming soon）
├── components/
│   ├── Nav.jsx                         ✅ 完成，hover正常
│   └── Footer.jsx                      ✅ 完成
├── lib/
│   └── supabase.js                     ✅ Supabase客户端
└── .env.local                          ✅ 含Supabase URL和Key
```

---

## Vercel部署
- 已push到GitHub，但Vercel部署失败
- **原因**：Vercel没有设置环境变量
- **待办**：去Vercel → Settings → Environment Variables 添加：
  - NEXT_PUBLIC_SUPABASE_URL = https://ztfmeopyknfzmxvbpnxo.supabase.co
  - NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY
  - 添加后Redeploy

---

## 已完成 ✅
1. Header — Logo + 搜索 + 电话(02 9477 4748) + Sign In + Cart，128px高
2. Footer — 4列，Subscribe栏，白色文字
3. Nav — ✅ hover正常，mega下拉，Collections/Brands跟按钮走，hover变蓝色底色
4. 字体 — 全站统一三种字体
5. Subcategory页面 — Filter + 产品网格 + 价格 + 颜色圆点
6. 产品详情页 — 图片切换（主图+颜色缩略图）+ 颜色名称（从products.colours读取）+ 阶梯价格 + 装饰选项 + 价格计算 + Add to Cart + Get a Quote + Trust badges + Tabs + Similar Products

---

## 明天继续 ⏳
1. **Vercel环境变量设置** — 让线上网站能用（Settings → Environment Variables）
2. **Category页面** — 点All Products下拉里的分类，显示该分类下所有子分类
3. **Get a Quote表单** — 弹窗，发邮件给你
4. **客户登录/注册** — Supabase Auth
5. **购物车**
6. **结账** — Stripe + EFT
7. **Invoice自动生成**

## Phase 2（之后）
- 搜索功能
- 收藏夹
- 历史订单
- 后台管理页面
- 产品数据整理

## Phase 3（长期）
- Artwork Mockup（Cloudinary）
- 月结账户
- Merch Store

---

## 联系
- 电话：02 9477 4748
- 运费：$30
- GST：10%

最后更新：2026-05-19
