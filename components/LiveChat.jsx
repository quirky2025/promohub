'use client';

// components/LiveChat.jsx — 站级在线客服聊天窗口(Tawk.to,免费)。
// ID 来自环境变量:
//   NEXT_PUBLIC_TAWK_PROPERTY_ID  (Tawk 后台 Admin → Channels → Chat Widget 的 Property ID)
//   NEXT_PUBLIC_TAWK_WIDGET_ID    (同页的 Widget ID,通常是 "default" 或一串 ID)
// 两个 ID 缺任一 → 不渲染(dev/preview 未配也不报错,不影响页面)。
// 离线留言 + 邮件通知由 Tawk 后台自带,无需前端处理。

import Script from 'next/script';

export default function LiveChat({ propertyId, widgetId }) {
  if (!propertyId || !widgetId) return null;
  return (
    <Script id="tawk-to" strategy="afterInteractive">
      {`var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/${propertyId}/${widgetId}';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`}
    </Script>
  );
}
