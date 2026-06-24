# Cloudflare 图片迁移 — 交接说明 (Image Migration Handoff Note)

> 转给负责图片迁移的人。一句话:**只把"产品目录照片"搬 Cloudflare;logo / 客户美工 / mockup / proof 这条线必须留在 Cloudinary,千万别动。**

---

## 1. 两条独立的图片线(不要混)

| 类型 | 文件格式 | 去向 |
|---|---|---|
| **产品目录照片** | 普通位图 JPG/PNG/WebP | ✅ 可以搬 Cloudflare |
| **logo / 客户美工 / mockup / proof** | 经常是 **AI / EPS / PDF / SVG 矢量** | ❌ **必须留 Cloudinary** |

---

## 2. 该改哪里 / 不该碰哪里

**✅ 要改(产品照片显示):**
- `components/ProductImg.jsx` 里的 `cloudinaryResize()` 函数 —— 这是全站产品图 URL/转换的**唯一出口**。把它改成指向 Cloudflare 即可。全站产品图都走 ProductImg,所以改这一个文件就覆盖了"显示"。
- 产品照片的**上传入口**(后台 products / 种子脚本那边)—— 注意大部分产品图是导入/种子进来的,确认一下后台上传流程。

**❌ 不要碰:**
- `lib/imageHost.js` —— 这是 logo/美工的**上传(`uploadImage`)+ 缩略图(`displayThumb`)**,**故意留在 Cloudinary**。别动。
- `lib/pricing.js`、报价/美工相关文件 —— 别的分支正在重构,别碰,免得冲突。

---

## 3. 为什么 logo 必须留 Cloudinary(关键原因)

Cloudflare Images 只支持位图(JPEG/PNG/GIF/WebP/AVIF)+ SVG(会被安全化,但**不缩放**)。
**它不支持 PDF / AI / EPS 转图。**
而我们的 logo / proof 经常是矢量/PDF,**靠 Cloudinary 把它们转成 PNG 预览**(后台 Artworks 缩略图 + proof 出图都依赖这个)。一旦搬走,这些会全部失效。

参考:
- https://developers.cloudflare.com/images/get-started/limits/
- https://developers.cloudflare.com/images/image-resizing/format-limitations/

---

## 4. Cloudinary 环境变量(logo 用,保留不动)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## 5. 工作约定(避免冲突)
- Cloudflare 的活**单开一个分支**(如 `feat/cloudflare-images`),跟其它重构分支分开。
- **别改** `lib/imageHost.js` / `lib/pricing.js` / 报价/美工文件。
- 产品图显示的改动基本就限于 `ProductImg.jsx` + 产品图上传 + Cloudflare 账号/CDN 配置。

---

## 6. 检查清单
- [ ] 配好 Cloudflare Images / R2 + 分发
- [ ] `ProductImg.jsx` 的产品图 URL 指向 Cloudflare
- [ ] 旧的 Cloudinary 产品图 URL 迁移(或让旧 URL 并行可用,平滑过渡)
- [ ] 验证:产品页 / 分类页 / 购物车 的产品照片正常显示
- [ ] **不要动 logo/美工(Cloudinary)** —— 顺手验证后台 Artworks 板缩略图 + proof 仍正常
