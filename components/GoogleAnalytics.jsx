'use client';

// components/GoogleAnalytics.jsx — GA4 gtag.js 站级注入。
// ID 来自 NEXT_PUBLIC_GA_ID(Vercel 环境变量,当前 G-06J4WRFMLY)。
// 无 ID 时不渲染(dev/preview 未配也不报错)。page_view 由 GA4 自动上报;
// 自定义事件用 lib/gtag.js 的 gaEvent()。

import Script from 'next/script';

export default function GoogleAnalytics({ gaId }) {
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${gaId}', { currency: 'AUD' });`}
      </Script>
    </>
  );
}
