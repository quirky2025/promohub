// lib/imageHost.js
// Artwork 上传 + 预览。R2 + 自建栅格化服务(Ghostscript/ImageMagick/librsvg),不再用 Cloudinary。
// 矢量 logo(AI/EPS/PDF/SVG)在上传时一次性转成 PNG 存 R2,预览/proof 直接用 PNG。

// 上传一个文件(浏览器)→ 我们自己的 /api 路由(原件存 R2 + 转 PNG 存 R2)。
// orderNumber:有则按 artwork/<订单号>/<kind>/ 命名并覆盖式;kind: 'logo'(默认) 或 'mockup'。
// 返回 { logo_url, logo_png_url },失败返回 null。
export async function uploadImage(file, orderNumber, kind) {
  if (!file) return null;
  const fd = new FormData();
  fd.append('file', file);
  if (orderNumber) fd.append('orderNumber', orderNumber);
  if (kind) fd.append('kind', kind);
  const res = await fetch('/api/artwork/rasterize-upload', { method: 'POST', body: fd });
  if (!res.ok) return null;
  return await res.json(); // { logo_url, logo_png_url }
}

// PNG 预览已在上传时预生成(logo_png_url),这里无需再做任何变换。
export function displayThumb(url) { return url; }
