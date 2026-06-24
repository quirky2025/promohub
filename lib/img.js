// lib/img.js
// 图片迁移(Cloudinary -> Cloudflare R2 + 预生成 WebP)。
// 唯一职责:把 TRENDS 试点的旧 Cloudinary 产品图 URL,改写成 R2 上的预生成 webp。
// 规则极其保守:只命中 TRENDS 的"扁平 + 数字-数字"模式;其它一律原样返回(走旧逻辑/Cloudinary)。
// 因此 Gear For Life 等带子目录/版本号/文字文件名的 URL 完全不受影响。
//
// 旧: https://res.cloudinary.com/<cloud>/image/upload/promohub/products/125062-3.jpg
// 新: https://pub-fbec7c9199f04af8ab95a413a4620d37.r2.dev/suppliers/trends/products/_variants/w400/125062-3.webp

const R2_BASE = 'https://pub-fbec7c9199f04af8ab95a413a4620d37.r2.dev';
const R2_TRENDS_PREFIX = 'suppliers/trends/products';

const VARIANT_WIDTHS = [160, 400, 900];
function pickVariant(width) {
  const w = Number(width) || 400;
  for (const vw of VARIANT_WIDTHS) if (w <= vw) return vw;
  return VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1];
}

const TRENDS_RE =
  /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:[^/]+\/)*promohub\/products\/(\d+-\d+)\.(?:jpg|jpeg|png|webp)(?:\?.*)?$/i;

export function toR2(src, width) {
  if (!src || typeof src !== 'string') return null;
  const m = src.match(TRENDS_RE);
  if (!m) return null;
  const stem = m[1];
  const vw = pickVariant(width);
  return `${R2_BASE}/${R2_TRENDS_PREFIX}/_variants/w${vw}/${stem}.webp`;
}

