'use client';

// components/SeoContent.jsx — 类目页产品网格下方的 SEO 内容区(选购指南 + FAQ)。
// - seo_content 按 HTML 渲染(支持 H2/H3/列表/链接)。
// - FAQ 折叠块;答案也按 HTML 渲染。
// - 拦截正文/FAQ 里带 data-quote 或 href="#quote" 的链接 → 打开询价弹窗(不跳 /contact)。

import { useState } from 'react';
import QuoteModal from '@/components/QuoteModal';
import { gaEvent } from '@/lib/gtag';

const NAVY = '#1B2A4A';
const BG = '#ffffff';

export default function SeoContent({ content, faq = [] }) {
  const [open, setOpen] = useState(false);

  function handleClick(e) {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (a.hasAttribute('data-quote') || href === '#quote') {
      e.preventDefault();
      gaEvent('quote_click', { source_location: 'seo_content' });
      setOpen(true);
    }
  }

  const hasFaq = Array.isArray(faq) && faq.length > 0;
  if (!content && !hasFaq) return null;

  return (
    <section
      onClick={handleClick}
      style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '54px 40px 64px' }}
    >
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        {content && (
          <div
            className="qp-seo-content"
            style={{ color: '#000', fontSize: '15px', lineHeight: 1.85 }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {hasFaq && (
          <div style={{ marginTop: content ? '40px' : 0 }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontSize: '30px', margin: '0 0 18px', fontWeight: 600 }}>
              FAQs
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {faq.map((item, index) => (
                <div key={`${item.question || 'faq'}-${index}`} style={{ border: '1px solid #E0DDD7', borderRadius: '8px', padding: '18px 20px', background: BG }}>
                  <div style={{ color: NAVY, fontWeight: 700, marginBottom: '7px' }}>{item.question}</div>
                  <div
                    style={{ color: '#000', fontSize: '14px', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: item.answer || '' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <QuoteModal open={open} onClose={() => setOpen(false)} source="seo_content" />

      <style>{`
        .qp-seo-content h2 { font-family: "Cormorant Garamond", serif; color: ${NAVY}; font-size: 28px; font-weight: 600; margin: 34px 0 14px; }
        .qp-seo-content h3 { color: ${NAVY}; font-size: 18px; font-weight: 700; margin: 22px 0 8px; }
        .qp-seo-content p { margin: 0 0 14px; }
        .qp-seo-content ul { margin: 0 0 16px; padding-left: 20px; }
        .qp-seo-content li { margin: 0 0 7px; }
        .qp-seo-content a { color: #C9A96E; font-weight: 600; text-decoration: none; }
        .qp-seo-content a:hover { text-decoration: underline; }
        .qp-seo-content h2:first-child, .qp-seo-content h3:first-child { margin-top: 0; }
      `}</style>
    </section>
  );
}
