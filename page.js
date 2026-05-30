'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const CATEGORIES = [
  { name: 'Bags', icon: '👜', slug: 'bags' },
  { name: 'Drinkware', icon: '☕', slug: 'drinkware' },
  { name: 'Technology', icon: '💻', slug: 'technology' },
  { name: 'Apparel', icon: '👕', slug: 'apparel' },
  { name: 'Headwear', icon: '🧢', slug: 'headwear' },
  { name: 'Pens', icon: '🖊️', slug: 'pens' },
  { name: 'Business', icon: '📋', slug: 'business' },
  { name: 'Leisure', icon: '⛱️', slug: 'leisure' },
  { name: 'Personal', icon: '✨', slug: 'personal' },
  { name: 'Promotion', icon: '🎁', slug: 'promotion' },
  { name: 'Print', icon: '🖨️', slug: 'print' },
  { name: 'Packaging', icon: '📦', slug: 'packaging' },
];

const WHY_US = [
  {
    icon: '🏭',
    title: 'Factory Direct',
    desc: 'Direct relationships with 200+ factories across Asia. No middlemen — better prices, faster turnaround.',
  },
  {
    icon: '✈️',
    title: 'Save Up to 50% on Freight',
    desc: 'First-tier freight partnerships give you significantly better rates on Express, Air and Sea shipping.',
  },
  {
    icon: '🛡️',
    title: 'ACCC Compliant',
    desc: 'All products meet Australian safety standards. Full compliance documentation available on request.',
  },
  {
    icon: '🎨',
    title: 'Free Digital Proof',
    desc: 'Every order includes a free mockup from our design team. Production only starts after your approval.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'The merchandise provided was of high quality, beautifully branded, and very competitively priced. The attention to detail in the presentation and finish of the products was excellent, and the final items reflected positively on our organisation.',
    name: 'Ian Westmoreland OAM',
    title: 'CEO',
    company: 'Kintsugi Heroes',
    initials: 'IW',
  },
  {
    quote: 'I have worked with Lily for many years and she has been such a great help with sourcing very custom and unique products for us. From sample, arranging freight and all the in-betweens, Lily has ensured everything is always perfect!',
    name: 'Jenny',
    title: 'Founder',
    company: '',
    initials: 'J',
  },
  {
    quote: 'We have used Lily and the Quirky team for several years now for our promotional and offshore product sourcing. She always does her best to find the right solution at the right price and on deadline, and handles the whole import and customs process with ease.',
    name: 'Matt',
    title: 'Account Manager',
    company: '',
    initials: 'M',
  },
];

const CLOUD = 'https://res.cloudinary.com/dyz9r0fm7/image/upload';
// e_colorize 把 logo 统一染成 NAVY；h_88 统一高度(2x 清晰)
const TINT = 'e_colorize,co_rgb:1B2A4A,h_88';
const logoUrl = (vId) => `${CLOUD}/${TINT}/${vId}`;
 
const BRANDS = [
  { name: 'Newcastle Grammar School', src: logoUrl('v1780103113/NGS_Logo_formal_horizontal_rev_-_Copy_-_Copy_xnhqwc.webp') },
  { name: 'NSW Government',            src: logoUrl('v1780103113/nsw-gov-logo_tfwp9l.png') },
  { name: 'Kintsugi Heroes',          src: logoUrl('v1780103111/KintsugiHeroes_Primary_black_cmmnoe.png') },
  { name: 'Core Success',             src: logoUrl('v1780102504/CORE_SUCCESS_T_Shirt_drxlq0.svg') },
  { name: 'Ultra Violette',           src: logoUrl('v1780102503/UV_Master_Logo_440x_-_Copy_ofyma5.svg') },
  { name: 'Netflix',                  src: logoUrl('v1780102502/Netflix_Logo_PMS_copy_kgit7s.svg') },
  { name: 'Northern Beaches Council', src: logoUrl('v1780102502/logo-nbc_gasvok.svg') },
  { name: 'Mazda',                    src: logoUrl('v1780102501/mazda_lvip9m.svg') },
  { name: 'Hyegrove Willoughby',      src: logoUrl('v1780102498/Hyegrove_Willoughby_Logo_sv8z7n.svg') },
  { name: 'Foxtel',                   src: logoUrl('v1780102498/foxtel-logo-2020_-_Copy_-_Copy_pwfskq.svg') },
  { name: 'Barker College',           src: logoUrl('v1780102496/barker-logo-tagline-red_s5paps.svg') },
  // ⬇️ 文件名无法辨认,确认品牌后改 name；不要就删掉该行
  { name: '待确认-1', src: logoUrl('v1780103111/Image_20250822153602_83_z2v86l.png') },
  { name: '待确认-2', src: logoUrl('v1780103113/sitelogo_-_Copy_-_Copy_xsyiod.png') },
  { name: '待确认-4', src: logoUrl('v1780103111/Image_20250822153700_85_lvahlx.png') },
  { name: '待确认-6', src: logoUrl('v1780103024/1631335438386_ywn42e.png') },
];
function toSlug(name) {
  return name.toLowerCase().replace(/ & /g, '-and-').replace(/&/g, 'and').replace(/ /g, '-');
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, slug, supplier_sku, category, subcategory, is_published, product_colours(images, sort_order), pricing_tiers(base_price)')
      .eq('is_published', true)
      .limit(8)
      .then(({ data }) => { if (data) setProducts(data); });
  }, []);

  function getFirstImage(product) {
    const sorted = [...(product.product_colours || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const imgs = sorted[0]?.images;
    const arr = Array.isArray(imgs) ? imgs : imgs ? Object.values(imgs) : [];
    return arr[0] || null;
  }

  function getLowestPrice(product) {
    if (!product.pricing_tiers?.length) return 0;
    return Math.min(...product.pricing_tiers.map(t => parseFloat(t.base_price))) * 1.40;
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: BG, color: '#1a1a1a' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: `linear-gradient(135deg, transparent 40%, rgba(201,169,110,.08) 100%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '24px' }}>
              Australia's Premium B2B Promo Partner
            </div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '56px', fontWeight: 600, color: '#fff', margin: '0 0 20px', lineHeight: 1.15 }}>
              Branded Merchandise<br />
              <span style={{ color: GOLD }}>Done Right.</span>
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8, margin: '0 0 36px', maxWidth: '480px' }}>
              Factory-direct promotional products for Australian businesses. Free digital proof, $30 flat shipping, and a quality guarantee on every order.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/category/bags" style={{ background: GOLD, color: '#fff', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(201,169,110,.4)' }}>
                Browse Products →
              </Link>
              <Link href="/contact" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,.2)' }}>
                Get a Quote
              </Link>
            </div>
          </div>
          {/* HERO STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { value: '1,800+', label: 'Products in Range' },
              { value: 'Up to 50%', label: 'Freight Savings' },
              { value: '$30', label: 'Flat Rate Shipping' },
              { value: 'ACCC', label: 'Compliant Products' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.06)', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,.1)', textAlign: 'center' }}>
                <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: GOLD, fontWeight: 600, marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.55)', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '20px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { icon: '🎨', text: 'Free digital proof on every order' },
            { icon: '🚚', text: '$30 flat rate shipping Australia-wide' },
            { icon: '✅', text: 'Quality guarantee' },
            { icon: '💬', text: 'Reply within 1 business hour' },
            { icon: '🛡️', text: 'ACCC compliant products' },
          ].map(b => (
            <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#5A5550', fontWeight: 500 }}>
              <span>{b.icon}</span><span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>Shop by Category</h2>
          <p style={{ fontSize: '15px', color: '#7A7570', margin: 0 }}>12 categories — 1,800+ products</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div
                onMouseEnter={() => setHoveredCat(cat.slug)}
                onMouseLeave={() => setHoveredCat(null)}
                style={{ background: hoveredCat === cat.slug ? NAVY : '#fff', borderRadius: '14px', padding: '24px 16px', textAlign: 'center', border: '1px solid #E0DDD7', transition: 'all .2s', cursor: 'pointer', boxShadow: hoveredCat === cat.slug ? '0 8px 24px rgba(27,42,74,.2)' : 'none' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cat.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: hoveredCat === cat.slug ? '#fff' : NAVY }}>{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* WHY QUIRKYPROMO */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>Why QuirkyPromo</h2>
            <p style={{ fontSize: '15px', color: '#7A7570', margin: 0 }}>Built for Australian businesses that demand quality, reliability, and value</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {WHY_US.map(w => (
              <div key={w.title} style={{ background: BG, borderRadius: '14px', padding: '32px 24px', border: '1px solid #E0DDD7' }}>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{w.icon}</div>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>{w.title}</h3>
                <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.7, margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/supply-chain" style={{ background: NAVY, color: '#fff', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
              Our Supply Chain Capabilities →
            </Link>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      {products.length > 0 && (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: NAVY, margin: '0 0 6px', fontWeight: 600 }}>Featured Products</h2>
              <p style={{ fontSize: '14px', color: '#7A7570', margin: 0 }}>A selection from our range of 1,800+ products</p>
            </div>
            <Link href="/category/bags" style={{ color: GOLD, fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>View All Products →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {products.map(product => {
              const img = getFirstImage(product);
              const price = getLowestPrice(product);
              const isHovered = hoveredId === product.id;
              return (
                <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7', boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,.1)' : 'none', transform: isHovered ? 'translateY(-2px)' : 'none', transition: 'all .2s' }}
                  >
                    <div style={{ height: '200px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {img ? <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                        : <div style={{ fontSize: '40px', color: '#D0CCC8' }}>📦</div>}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '8px', lineHeight: 1.3 }}>{product.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {price > 0 && (
                          <div>
                            <div style={{ fontSize: '11px', color: '#7A7570' }}>As low as</div>
                            <div style={{ fontSize: '18px', color: GOLD, fontWeight: 400 }}>${price.toFixed(2)}</div>
                          </div>
                        )}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: '#7A7570' }}>{product.subcategory || product.category}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      <div style={{ background: NAVY, padding: '80px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: '#fff', margin: '0 0 10px', fontWeight: 600 }}>What Our Clients Say</h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.55)', margin: 0 }}>Trusted by leading Australian organisations</p>
          </div>

          {/* Active Testimonial */}
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255,255,255,.1)', marginBottom: '24px', minHeight: '200px' }}>
            <div style={{ fontSize: '40px', color: GOLD, fontFamily: 'serif', lineHeight: 1, marginBottom: '16px' }}>"</div>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.85)', lineHeight: 1.8, margin: '0 0 28px', fontStyle: 'italic' }}>
              {TESTIMONIALS[activeTestimonial].quote}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: GOLD, color: NAVY, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {TESTIMONIALS[activeTestimonial].initials}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{TESTIMONIALS[activeTestimonial].name}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.55)' }}>
                  {TESTIMONIALS[activeTestimonial].title}{TESTIMONIALS[activeTestimonial].company ? ` · ${TESTIMONIALS[activeTestimonial].company}` : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === activeTestimonial ? GOLD : 'rgba(255,255,255,.3)', border: 'none', cursor: 'pointer', transition: 'all .2s', padding: 0 }} />
            ))}
          </div>
        </div>
      </div>

          {/* BRANDS */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '56px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', padding: '0 40px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: '0 0 8px', fontWeight: 600 }}>Trusted By Leading Australian Brands</h2>
          <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 36px' }}>From ASX-listed companies to government departments and fast-growing startups</p>
        </div>
 
        {/* 横向无限滚动跑马灯 */}
        <div className="qp-logo-marquee">
          <div className="qp-logo-track">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div key={i} className="qp-logo-item">
                <img src={brand.src} alt={brand.name}
                  style={{ height: '40px', width: 'auto', objectFit: 'contain', opacity: 0.85 }} />
              </div>
            ))}
          </div>
        </div>
 
        <p style={{ fontSize: '12px', color: '#B0AAA3', margin: '36px 0 0', textAlign: 'center' }}>
          + many more Australian businesses, government departments, and education institutions
        </p>
 
        <style>{`
          .qp-logo-marquee { width:100%; overflow:hidden;
            -webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);
            mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent); }
          .qp-logo-track { display:flex; width:max-content; animation:qp-scroll 45s linear infinite; }
          .qp-logo-item { flex:0 0 auto; display:flex; align-items:center; justify-content:center; padding:0 44px; }
          .qp-logo-track:hover { animation-play-state:paused; }
          @keyframes qp-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
          @media (prefers-reduced-motion:reduce){ .qp-logo-track{animation:none;flex-wrap:wrap;justify-content:center;gap:24px} }
        `}</style>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ background: BG, borderTop: '1px solid #E0DDD7', padding: '64px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: NAVY, margin: '0 0 16px', fontWeight: 600 }}>
            Ready to Start Your Next Campaign?
          </h2>
          <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 32px', lineHeight: 1.7 }}>
            Browse our range of 1,800+ products or contact our team for expert advice on your next branded merchandise campaign.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/category/bags" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(201,169,110,.4)' }}>
              Browse Products →
            </Link>
            <Link href="/contact" style={{ background: '#fff', color: NAVY, padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: `1.5px solid ${NAVY}` }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
