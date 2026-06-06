// app/catalog/CatalogClient.jsx —— Catalog 页面主体
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import QuoteModal from '@/components/QuoteModal';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

/* ============================================================
   画册清单 —— 以后上/下架画册只改这里,每本三到五行:
   - title:    显示名称
   - src:      供应商 COPY EMBED 里 iframe 的 src 链接
   - tags:     标签(随意,显示在卡片上)
   - featured: true = 当季主推(显示在 Featured 区,默认打开)
   换季节就把旧的 featured 改 false、新的改 true;
   拿到带 QuirkyPromo LOGO 的版本后,把 src 换成新链接即可。
   ============================================================ */
const CATALOGS = [
  {
    title: 'Winter Essentials — Edition 5',
    src: 'https://e.issuu.com/embed.html?d=winter_essentials_edition_5_-_unbranded&hideIssuuLogo=true&u=trendscollection',
    tags: ['Seasonal', 'Winter 2026'],
    featured: true,
  },
  {
    title: 'Impact Aware — Edition 2',
    src: 'https://e.issuu.com/embed.html?d=impact_aware_edition_2_-_draft&hideIssuuLogo=true&u=trendscollection',
    tags: ['Eco & Sustainable'],
    featured: false,
  },
  // 新画册照这个样子往下加:
  // {
  //   title: 'Summer Collection 2027',
  //   src: 'https://e.issuu.com/embed.html?d=xxxx&hideIssuuLogo=true&u=xxxx',
  //   tags: ['Seasonal'],
  //   featured: false,
  // },
];

export default function CatalogClient() {
  const featuredIndex = Math.max(0, CATALOGS.findIndex(c => c.featured));
  const [active, setActive] = useState(featuredIndex);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const viewerRef = useRef(null);

  function openCatalog(i) {
    setActive(i);
    // 平滑滚到阅读器
    setTimeout(() => {
      viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  const current = CATALOGS[active];

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', minHeight: '100vh', background: '#F8F7F4', color: '#1a1a1a' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Catalogues</span>
        </div>
      </div>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '52px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: '#8a6d34', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '20px', marginBottom: '18px' }}>
            📖 Browse Online
          </div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '46px', fontWeight: 600, color: '#fff', margin: '0 0 14px', lineHeight: 1.1 }}>
            Product Catalogues
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, margin: 0 }}>
            Flip through our latest catalogues right here. See something you like?
            Note the page number or item code and request a quote — we&apos;ll get back to you fast.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

        {/* 画册选择卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {CATALOGS.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.title}
                onClick={() => openCatalog(i)}
                style={{
                  textAlign: 'left', cursor: 'pointer', background: isActive ? NAVY : '#fff',
                  border: isActive ? `2px solid ${GOLD}` : '1px solid #E0DDD7',
                  borderRadius: '12px', padding: '18px 20px',
                  boxShadow: isActive ? '0 8px 24px rgba(27,42,74,.25)' : '0 2px 6px rgba(0,0,0,.05)',
                  transition: 'all .2s', fontFamily: '"DM Sans", sans-serif',
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '8px' }}>📖</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: isActive ? '#fff' : NAVY, lineHeight: 1.35, marginBottom: '8px' }}>
                  {c.title}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {c.tags.map(t => (
                    <span key={t} style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: isActive ? NAVY : '#fff', background: isActive ? GOLD : '#8a6d34', padding: '3px 9px', borderRadius: '20px' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '12.5px', color: isActive ? GOLD : '#7A7570', marginTop: '10px', fontWeight: 600 }}>
                  {isActive ? '▼ Reading below' : 'Click to read →'}
                </div>
              </button>
            );
          })}
        </div>

        {/* 内嵌翻页阅读器(只加载当前选中那本) */}
        <div ref={viewerRef} style={{ scrollMarginTop: '20px' }}>
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #E0DDD7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 600, color: NAVY }}>
                {current.title}
              </div>
              <div style={{ fontSize: '12.5px', color: '#7A7570' }}>
                Tip: click the ⛶ icon inside the viewer for fullscreen
              </div>
            </div>
            <iframe
              key={current.src}
              src={current.src}
              allowFullScreen
              title={current.title}
              style={{ border: 'none', width: '100%', height: '72vh', minHeight: '480px', display: 'block', background: '#2b2b2b' }}
            />
          </div>
        </div>

        {/* GET A QUOTE CTA */}
        <div style={{ marginTop: '48px', background: NAVY, borderRadius: '16px', padding: '40px', textAlign: 'center', border: `1px solid ${GOLD}` }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>✏️</div>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: '#fff', margin: '0 0 10px', fontWeight: 600 }}>
            Found something you like?
          </h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.75)', maxWidth: '540px', margin: '0 auto 22px', lineHeight: 1.7 }}>
            Send us the catalogue name and page number (or item code), along with your quantity
            and logo — we&apos;ll come back with pricing and a free digital proof.
          </p>
          <button
            onClick={() => setQuoteOpen(true)}
            style={{ background: GOLD, color: '#fff', border: 'none', padding: '13px 36px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.5px', boxShadow: '0 2px 10px rgba(201,169,110,.35)' }}
          >
            GET A QUOTE
          </button>
        </div>
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} source="catalog" />
    </div>
  );
}
