'use client';

import { useState } from 'react';
import Link from 'next/link';
import QuoteModal from '@/components/QuoteModal';
import { FAQ_SECTIONS } from './faqData';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

function FAQItem({ q, a, onQuoteClick }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F0EEED' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
      >
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', fontWeight: 600, color: NAVY, lineHeight: 1.5 }}>{q}</span>
        <span style={{ color: GOLD, fontSize: '20px', flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
      </button>
      {open && (
        <div
          className="faq-answer"
          style={{ paddingBottom: '18px', paddingRight: '32px' }}
          onClick={onQuoteClick}
          dangerouslySetInnerHTML={{ __html: a }}
        />
      )}
    </div>
  );
}

export default function FaqClient() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  // "Get a Quote" links inside answer HTML (data-quote) open the same modal as the nav.
  const handleQuoteClick = (e) => {
    const link = e.target.closest('a[data-quote]');
    if (link) { e.preventDefault(); setQuoteOpen(true); }
  };

  const displayed = activeCategory
    ? FAQ_SECTIONS.filter(f => f.category === activeCategory)
    : FAQ_SECTIONS;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', minHeight: '100vh', background: '#ffffff' }}>

      {/* Answer HTML styling (links / lists inside dangerouslySetInnerHTML) */}
      <style>{`
        .faq-answer p { margin: 0 0 10px; font-size: 14px; color: #5A5550; line-height: 1.8; }
        .faq-answer p:last-child { margin-bottom: 0; }
        .faq-answer ul { margin: 8px 0 10px; padding-left: 20px; }
        .faq-answer li { font-size: 14px; color: #5A5550; line-height: 1.7; margin-bottom: 6px; }
        .faq-answer a { color: ${GOLD}; text-decoration: underline; }
        .faq-answer a:hover { color: ${NAVY}; }
        .faq-answer strong { color: ${NAVY}; }
      `}</style>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>FAQ</span>
        </div>
      </div>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '48px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '44px', fontWeight: 600, color: '#fff', margin: '0 0 12px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '15px', margin: '0 0 28px', lineHeight: 1.7 }}>
            Everything you need to know about ordering custom branded merchandise with QuirkyPromo.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px' }}>Can't find your answer?</span>
            <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Contact Us →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', alignItems: 'start' }}>

        {/* SIDEBAR NAV */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #E0DDD7' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B0AAA3', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Jump to</div>
            <button
              onClick={() => setActiveCategory(null)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeCategory === null ? 700 : 400, color: activeCategory === null ? GOLD : '#3D3A36', background: activeCategory === null ? '#FDF8F0' : 'none', marginBottom: '4px', fontFamily: '"DM Sans", sans-serif' }}
            >
              All Questions
            </button>
            {FAQ_SECTIONS.map(f => (
              <button
                key={f.category}
                onClick={() => setActiveCategory(activeCategory === f.category ? null : f.category)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeCategory === f.category ? 700 : 400, color: activeCategory === f.category ? GOLD : '#3D3A36', background: activeCategory === f.category ? '#FDF8F0' : 'none', marginBottom: '4px', fontFamily: '"DM Sans", sans-serif' }}
              >
                {f.icon} {f.category}
              </button>
            ))}
          </div>

          {/* CONTACT CARD */}
          <div style={{ marginTop: '20px', background: NAVY, borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px', fontFamily: '"Cormorant Garamond", serif' }}>Still need help?</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', margin: '0 0 14px', lineHeight: 1.6 }}>Our team replies the same business day.</p>
            <a href="mailto:hello@quirkypromo.com.au" style={{ display: 'block', background: GOLD, color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '8px' }}>
              📧 hello@quirkypromo.com.au
            </a>
            <a href="tel:0294774748" style={{ display: 'block', background: 'rgba(255,255,255,.1)', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              📞 02 9477 4748
            </a>
          </div>
        </div>

        {/* FAQ CONTENT */}
        <div>
          {displayed.map(section => (
            <div key={section.category} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: `2px solid ${GOLD}` }}>
                <span style={{ fontSize: '24px' }}>{section.icon}</span>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 600, color: NAVY, margin: 0 }}>
                  {section.category}
                </h2>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '0 24px', border: '1px solid #E0DDD7' }}>
                {section.questions.map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} onQuoteClick={handleQuoteClick} />
                ))}
              </div>
            </div>
          ))}

          {/* BOTTOM CTA */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #E0DDD7', textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 10px' }}>Ready to get started?</h3>
            <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 20px', lineHeight: 1.7 }}>Browse our full product range or contact our team for expert advice on your next campaign.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/promotional-products" style={{ background: GOLD, color: '#fff', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                Browse Products →
              </Link>
              <Link href="/contact" style={{ background: '#fff', color: NAVY, padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', border: `1.5px solid ${NAVY}` }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} source="faq" />
    </div>
  );
}
