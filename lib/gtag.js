// lib/gtag.js — GA4 事件助手(事件定义见 GA4_TRACKING_SPEC.md)
// 用法:import { gaEvent } from '@/lib/gtag';  gaEvent('product_view', {...})
// 金额参数一律 ex-GST、currency 'AUD'。

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// 仅在浏览器且 gtag 就绪时发送;未装 GA / SSR 时静默,不报错。
export function gaEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', name, params);
  } catch (e) {
    /* no-op */
  }
}
