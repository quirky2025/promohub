'use client';

// 统一商品图组件(第一轮止血 + 第二轮优化合一)。
// - 开发环境默认显示本地占位图,不烧 Cloudinary(设 NEXT_PUBLIC_REAL_IMAGES=1 可看真实图);生产永远真实图。
// - loading="lazy" + decoding="async":列表页用户没滚到的图不加载。
// - Cloudinary 缩略图:按 size 注入 f_auto,q_auto,w_*(仅对未带 transform 的 Cloudinary URL,安全,不双重处理)。
// - 错图自动 fallback 到占位图。
// 以后所有商品图都走这个组件;新页面别裸写 <img src={cloudinaryUrl}>。

import { useState } from 'react';

const USE_PLACEHOLDER =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_REAL_IMAGES !== '1';

const PLACEHOLDER = '/placeholder-product.svg';
const WIDTHS = { thumb: 160, list: 400, detail: 900, hero: 1200 };

// 仅对标准 Cloudinary delivery URL 且"/upload/ 后还没有 transform"的注入缩略图参数。
function cloudinaryResize(url, width) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  const marker = '/image/upload/';
  const j = url.indexOf(marker);
  if (j === -1) return url;
  const after = url.slice(j + marker.length);
  const firstSeg = after.split('/')[0];
  if (/(^|,)(f_|q_|w_|h_|c_|dpr_|e_)/.test(firstSeg)) return url; // 已有 transform → 不动
  return url.slice(0, j + marker.length) + `f_auto,q_auto,w_${width}/` + after;
}

export default function ProductImg({ src, alt = '', size = 'list', eager = false, style, ...rest }) {
  const [errored, setErrored] = useState(false);
  let finalSrc;
  if (USE_PLACEHOLDER || errored || !src) finalSrc = PLACEHOLDER;
  else finalSrc = cloudinaryResize(src, WIDTHS[size] || WIDTHS.list);
  return (
    <img
      src={finalSrc}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => { if (!errored) setErrored(true); }}
      style={style}
      {...rest}
    />
  );
}
