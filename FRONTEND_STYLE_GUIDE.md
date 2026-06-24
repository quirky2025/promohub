# QuirkyPromo 前端统一风格规范 (Frontend Style Guide)

> 全站前台页面（客户能看到的页面）必须遵守这份规范。
> 改任何页面前先读这里；新页面照这套做。**目的：不再反复出现"这页发灰 / 这页表头不一样 / 这个 navy 高度不对"这类不一致。**
> Customer-facing copy must always be in **English**. This doc is internal.

---

## 1. 颜色 Colors（唯一来源）

| 用途 | 颜色 | 说明 |
|---|---|---|
| 品牌深色 NAVY | `#1B2A4A` | hero band、CTA band、表格标题栏、折叠条表头 |
| 品牌金色 GOLD | `#C9A96E` | 按钮、左侧竖边 accent、步骤序号圆圈、分隔短线 |
| 页面/卡片/表格底色 | `#ffffff` | **一律纯白。不准再用米灰 `#F8F7F4`** |
| 正文字色（浅底上） | `#1a1a1a` | **黑字。绝不用灰字**（`#5A5A5A` / `#7A7570` / `#888` 等都禁止做正文） |
| 边框/分隔线 | `#E0DDD7` | 只用于 border/线，**不能拿来当背景** |
| navy 底上的标题字 | `#ffffff` | |
| navy 底上的副标题字 | `rgba(255,255,255,0.82)` | 比纯白柔一点，做层次 |
| 选中/高亮的"暖色"底 | `#FDF8F0` | **唯一允许的暖色淡底**，只用于价格表"当前档位"高亮（配 GOLD 字） |
| 状态提示底色 | 红 `#FEF2F2` / 黄 `#FEF3C7` / 蓝 `#EFF6FF` / 绿 `#F0FAF4` | 错误/警告/信息/成功，**保留不动** |

**铁律：** 浅色背景 = 纯白 `#fff`；浅色背景上的字 = 黑 `#1a1a1a`。深色区域 = navy `#1B2A4A` + 白字。除此之外别造新灰。

---

## 2. 字体 Typography

- 标题 Headings：`"Cormorant Garamond", Georgia, serif`
- 正文 / UI：`"DM Sans", sans-serif`
- 字重只用两档：`400` 常规、`600/700` 加粗。

---

## 3. 表格 Tables（PDP 价格表、印刷表、规格表等）

- **标题栏**（如 UNBRANDED PRICING / BRANDING & DECORATION / Size Chart / Price Summary）：
  `background: NAVY; color: #fff; textAlign: center; textTransform: uppercase; letterSpacing: 0.8px; padding: 11px 14px; fontWeight: 700`
- **列头行 / 折叠条表头**：navy 底白字（折叠箭头也用白色 `#fff`）。
- **数据行**：白底黑字。
- **当前档位高亮**：GOLD 字 + `#FDF8F0` 淡底（唯一例外）。
- 规格区每个小块左侧竖边一律 **GOLD** `borderLeft: 3px solid #C9A96E`（不要混用灰边）。

---

## 4. Hero / Navy 横幅高度（统一，别用一次性数值）

| 页面类型 | padding | 例子 |
|---|---|---|
| 居中 hero（内容/信息/条款/About/Contact） | `80px 40px` | about, contact, terms, privacy, faq(48) |
| 列表页（分类/新品/特价/品牌/合集） | `56px 40px` | category, new-arrivals, sale, brands, collections |
| 子分类页 | `36–44px 40px` | category/[x]/[sub] |

**不要再出现 `100px` 这种一次性高度。** 同类页面用同一个值。

---

## 5. 按钮 & CTA 区块

- **主按钮（CTA）**：`background: GOLD; color: #fff; padding: 16px 40px; borderRadius: 8px; fontWeight: 700; letterSpacing: 0.5px`
- **CTA / 信任条（trust strip）**：navy 底；serif 白色标题；副标题 `rgba(255,255,255,0.82)`；可选 GOLD 按钮。
  - 标准文案（首页 & About 结尾统一用这套）：
    标题 `Easy. Fast. Transparent. Custom.`
    副标题 `Australian-stocked options, local decoration, clear product pricing and flexible order quantities for businesses of every size.`

---

## 6. 链接 / 路由 Routes（避免 404）

**站上没有这些总页：`/category`、`/products`、`/catalog`** —— 链到它们会 404。
浏览产品的有效入口只有：

- `/promotional-products` ← "Browse Our Products / 所有产品"统一用这个
- `/new-arrivals`、`/sale`、`/indent`
- `/category/[category]`、`/category/[category]/[subcategory]`
- 品牌页 `/brands/[slug]`、合集页 `/collections/[slug]`

**加任何"浏览/查看产品"按钮前，先确认目标是真实存在的路由。**

---

## 7. 单一数据源（别硬编码）

- 价格/印刷常量（MARGIN、GST、SHIPPING、SETUP_FEE、LEAD_TIME、品牌标签）→ 全部从 `lib/pricing.js` 引入。
- 图片上传 / 显示转图 → 用 `lib/imageHost.js` 的 `uploadImage()` / `displayThumb()`。
- 交期文案默认 `3-7 business days`（目前仅 TRENDS；将来按供应商配置）。

---

## 8. Lead time（提醒）

`3-7 business days` 是 **TRENDS** 的标准，且随印刷方式不同。**别的供应商上线后会不一样** —— 将来做成按供应商/印刷方式配置，不要写死成全站统一。

---

_最后更新：2026-06-25。改动全站风格时同步更新这份文件。_
