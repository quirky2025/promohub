# QuirkyPromo 项目进度文档
> 每次新Chat开始时，把这个文件内容发给Claude即可，按需再发具体文件。

---

## 工具和服务
- **框架**：Next.js 16.2.6（Turbopack）
- **数据库**：Supabase（https://ztfmeopyknfzmxvbpnxo.supabase.co）
- **部署**：Vercel（promohub-store.vercel.app）
- **图片存储**：Cloudinary（待配置Upload Preset）
- **域名**：quirkypromo.com.au（已绑定Vercel，DNS在Hostinger）
- **邮件服务**：Resend（已验证quirkypromo.com.au）
- **支付**：Stripe（已安装，Live Key已配置，付款方式待开启）
- **代码仓库**：GitHub（quirky2025/promohub）

---

## 项目基本信息
- **网站名称**：QuirkyPromo
- **业务**：澳洲B2B促销品电商
- **主要客户**：大企业/品牌部门
- **品牌定位**：高端专业（Premium & Corporate）
- **项目路径**：`C:\Users\jilin\Desktop\promohub`
- **线上网址**：https://www.quirkypromo.com.au

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

## URL结构（已完成）
/category/bags                          ← 分类页面（显示子分类网格）
/category/bags/backpacks               ← 子分类页面（显示产品列表）
/products/alumni-soft-touch-backpack   ← 产品详情页
/cart                                  ← 购物车
/checkout                              ← 结账
/order-confirmation                    ← 订单确认

## Slug规则
- & → -and-，空格 → -
- 例：Pads & Planners → pads-and-planners
- 还原：先-and-→ & ，再-→空格
- 产品slug已去掉末尾SKU号

---

## 数据库结构（Supabase）
5个表：products / product_colours / pricing_tiers / decoration_options / orders

**products主要字段：**
- id, supplier_sku, name, slug（干净格式，无SKU号）
- category, subcategory, description, short_desc
- min_qty, setup_fee, shipping, margin, status
- packing, lead_time_days, has_rush, rush_multiplier
- colours（jsonb）：[{"name": "Navy", "hex": "", "images": [...]}, ...]

**product_colours：**
- images（jsonb，URL数组）— 按文件名数字排序
- 图片规律：images[0]=主图，images[1..N]=颜色图，images[N+1..]=包装图

**pricing_tiers：** id, product_id, min_qty, max_qty, base_price, sort_order

**decoration_options：** id, product_id, name, detail, per_unit, has_setup, setup_qty_editable, default_setup_qty, sort_order

**orders：** id, invoice_number, customer_name, customer_email, customer_phone, customer_company, delivery_address, items(jsonb), subtotal, shipping, gst, total, payment_method, payment_status, created_at
- RLS: DISABLED
- Invoice格式：QP-2026-0001

---

## 定价逻辑
- MARGIN = 1.40（加价40%）
- GST = 10%
- SHIPPING = $30固定（整个订单只收一次）
- SETUP_FEE = $40（成本价）
- 零售价 = base_price × MARGIN
- Stripe surcharge = 2%

---

## 邮件设置
- 发件人：QuirkyPromo <noreply@quirkypromo.com.au>
- 询盘收件：hello@quirkypromo.com.au
- 客户自动回复：replyTo = hello@quirkypromo.com.au
- Resend：域名已验证，API Key已配置

---

## 支付方案
- Pay by EFT → 生成Invoice（UNPAID）→ 发邮件给客户+老板
  - 银行：ANZ，BSB：012-306，账号：192040129
  - 账户名：Grow Your Marketing，ABN：95 656 714 270
- Pay Now → Stripe → 生成Invoice（PAID）→ 发邮件
  - Stripe Live Key已配置到.env.local和Vercel
  - 待开启：Cards、Apple Pay/Google Pay、PayID、Afterpay

---

## 文件结构
promohub/
├── app/
│   ├── layout.js                       ✅ Google Fonts + Nav + Footer
│   ├── globals.css                     ✅ 全局样式（placeholder颜色已修复）
│   ├── page.js                         首页（待做）
│   ├── api/
│   │   ├── quote/route.js              ✅ Get a Quote发邮件
│   │   ├── order/route.js              ✅ 订单处理+发邮件+Supabase
│   │   └── stripe/create-payment-intent/route.js  ⏳ 待放入
│   ├── products/[slug]/
│   │   ├── page.js                     ✅
│   │   └── ProductClient.jsx           ✅ 含Add to Cart + Get a Quote
│   ├── cart/page.js                    ✅ 购物车（$30固定运费）
│   ├── checkout/page.js                ⏳ 待更新含Stripe（checkout-stripe-page.js）
│   ├── order-confirmation/page.js      ✅ 订单确认
│   └── category/[category]/
│       ├── page.js                     ✅ 分类页面
│       └── [subcategory]/page.js       ✅ 子分类页面
├── components/
│   ├── Nav.jsx                         ✅ 含Cart数量角标
│   └── Footer.jsx                      ✅
├── lib/
│   ├── supabase.js                     ✅
│   └── cart.js                         ✅ localStorage购物车
└── .env.local                          ✅ Supabase + Resend + Stripe Keys

---

## 已完成 ✅
1. Header / Footer / Nav（Cart角标）
2. 字体颜色主题
3. Category / Subcategory / 产品详情页
4. URL树形结构
5. Vercel部署 + 域名绑定
6. Resend邮件配置
7. Get a Quote升级版表单
8. Add to Cart + 购物车页面
9. 结账页面（EFT完成，Stripe框架完成）
10. 订单API（Invoice编号 + Supabase + 邮件）
11. 订单确认页面
12. Stripe包安装

---

## 明天待做 ⏳

1. **完成Stripe接入**
   - 放入 stripe-payment-intent.js → app/api/stripe/create-payment-intent/route.js
   - 更新 checkout/page.js（用checkout-stripe-page.js）
   - Stripe Dashboard开启：Cards、Apple Pay/Google Pay、PayID、Afterpay
   - 测试信用卡付款

2. **客户登录/注册**（Supabase Auth）

3. **首页设计**（最后做）

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
- 运费：$30固定（整单）
- GST：10%
- 银行：ANZ，BSB：012-306，账号：192040129，户名：Grow Your Marketing
- ABN：95 656 714 270

最后更新：2026-05-21
