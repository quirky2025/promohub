'use client';

// 统一商品图组件(第一轮止血 + 第二轮优化 + 第三轮 R2 迁移)。
// - 开发环境默认显示本地占位图,不烧 Cloudinary(设 NEXT_PUBLIC_REAL_IMAGES=1 可看真实图);生产永远真实图。
// - loading="lazy" + decoding="async":列表页用户没滚到的图不加载。
// - R2 迁移(TRENDS 试点):src 命中 TRENDS 扁平模式时,改指向 R2 预生成 webp;
//   未命中(Gear For Life 等)走原 Cloudinary 缩略图逻辑,完全不受影响。
// - 双层 fallback:R2 webp 失败 -> 退回原始 Cloudinary URL;原始再失败 -> 占位图。

import { useState } from 'react';
import { toR2 } from '../lib/img';

const USE_PLACEHOLDER =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_REAL_IMAGES !== '1';

const PLACEHOLDER = '/placeholder-product.svg';
const WIDTHS = { thumb: 160, list: 400, detail: 900, hero: 1200 };

function cloudinaryResize(url, width) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  const marker = '/image/upload/';
  const j = url.indexOf(marker);
  if (j === -1) return url;
  const after = url.slice(j + marker.length);
  const firstSeg = after.split('/')[0];
  if (/(^|,)(f_|q_|w_|h_|c_|dpr_|e_)/.test(firstSeg)) return url;
  return url.slice(0, j + marker.length) + `f_auto,q_auto,w_${width}/` + after;
}

export default function ProductImg({ src, alt = '', size = 'list', eager = false, style, ...rest }) {
  const [stage, setStage] = useState(0);

  const width = WIDTHS[size] || WIDTHS.list;
  const r2 = src ? toR2(src, width) : null;

  let finalSrc;
  if (USE_PLACEHOLDER || !src || stage >= 2) {
    finalSrc = PLACEHOLDER;
  } else if (r2 && stage === 0) {
    finalSrc = r2;
  } else {
    finalSrc = cloudinaryResize(src, width);
  }

  function handleError() {
    setStage((s) => {
      if (r2) return s < 2 ? s + 1 : s;
      return s < 1 ? 2 : s;
    });
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={handleError}
      style={style}
      {...rest}
    />
  );
}
