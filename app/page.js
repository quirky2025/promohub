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

const CAT_CLOUD = 'https://res.cloudinary.com/dyz9r0fm7/image/upload/f_auto,q_auto,w_600';
const CATEGORIES = [
  { name: 'Apparel',    slug: 'apparel',    img: `${CAT_CLOUD}/v1780122413/APPAREL_mpga11.jpg` },
  { name: 'Headwear',   slug: 'headwear',   img: `${CAT_CLOUD}/v1780122418/HEADWARE_fejzwv.jpg` },
  { name: 'Bags',       slug: 'bags',       img: `${CAT_CLOUD}/v1780122420/BAGS_pqfdyh.jpg` },
  { name: 'Pens',       slug: 'pens',       img: `${CAT_CLOUD}/v1780122421/PENS_dd7ppl.jpg` },
  { name: 'Drinkware',  slug: 'drinkware',  img: `${CAT_CLOUD}/v1780122421/drinkware_hzczyq.jpg` },
  { name: 'Print',      slug: 'print',      img: `${CAT_CLOUD}/v1780122423/PRINT_sli6wx.jpg` },
  { name: 'Business',   slug: 'business',   img: `${CAT_CLOUD}/v1780122425/BUSINESS_ic2scz.jpg` },
  { name: 'Promotion',  slug: 'promotion',  img: `${CAT_CLOUD}/v1780122426/PROMOTION_bzsbo8.jpg` },
  { name: 'Technology', slug: 'technology', img: `${CAT_CLOUD}/v1780122429/TECHNOLOGY_n8iyvs.jpg` },
  { name: 'Packaging',  slug: 'packaging',  img: `${CAT_CLOUD}/v1780122430/PACKAGING_yel57o.jpg` },
  { name: 'Leisure',    slug: 'leisure',    img: `${CAT_CLOUD}/v1780123085/LEISURE_uzraay.jpg` },
  { name: 'Personal',   slug: 'personal',   img: `${CAT_CLOUD}/v1780123091/PERSONAL_m0pz8z.jpg` },
];
const WHY_US = [
  {
    icon: '💰',
    title: 'Transparent Pricing',
    desc: 'No hidden costs, ever. Unit price, GST, and $30 flat shipping all shown upfront. The more you order, the less you pay — tiered pricing on every product.',
  },
  {
    icon: '🖥️',
    title: 'Quote & Order Online',
    desc: 'Get an instant quote and order online, anytime. Free digital mockup within 2 hours, with full specs and options laid out before you commit.',
  },
  {
    icon: '⚡',
    title: 'Responsive & Reliable',
    desc: 'We reply within 1 hour. Standard production 7–10 business days with rush options. Trusted by Mazda, Netflix, NSW Government and more.',
  },
  {
    icon: '🌱',
    title: 'Responsibly Sourced',
    desc: 'Ethical and sustainable sourcing on request. ACCC compliant products, quality guarantee on every order, and production only starts after your written approval.',
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
   {
    quote: 'PLACEHOLDER — Adam 的正式文案待邮件回来后替换。Lily and the Quirky team have been fantastic to work with — responsive, reliable, and always delivering quality branded merchandise on time.',
    name: 'Adam',
    title: 'Retail Sales Manager',
    company: 'Mazda',
    initials: 'A',
  },
];

const CLOUD = 'https://res.cloudinary.com/dyz9r0fm7/image/upload';
// e_colorize 把 logo 统一染成 NAVY；h_88 统一高度(2x 清晰)
const TINT = 'h_88';
const logoUrl = (vId) => `${CLOUD}/${TINT}/${vId}`;
 
const BRANDS = [
  { name: 'NSW Government',            src: logoUrl('v1780103113/nsw-gov-logo_tfwp9l.png') },
  { name: 'Kintsugi Heroes',          src: logoUrl('v1780103111/KintsugiHeroes_Primary_black_cmmnoe.png') },

  { name: 'Ultra Violette',           src: logoUrl('v1780102503/UV_Master_Logo_440x_-_Copy_ofyma5.svg') },
  { name: 'Netflix',                  src: logoUrl('v1780102502/Netflix_Logo_PMS_copy_kgit7s.svg') },
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
  const [showAllCats, setShowAllCats] = useState(false);
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
      <div style={{ background: NAVY, padding: '100px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: `linear-gradient(135deg, transparent 40%, rgba(201,169,110,.08) 100%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '28px' }}>
            Australia's Premium B2B Promo Partner
          </div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '60px', fontWeight: 600, color: '#fff', margin: '0 0 24px', lineHeight: 1.1 }}>
            Australia's Most<br />
            <span style={{ color: GOLD }}>Transparent</span> Merch Company
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,.75)', lineHeight: 1.8, margin: '0 auto 40px', maxWidth: '600px' }}>
            13 years of merch expertise, now online — with real prices upfront.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/category/bags" style={{ background: GOLD, color: '#fff', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(201,169,110,.4)' }}>
              Browse Products →
            </Link>
            <Link href="/contact" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,.2)' }}>
              Get a Quote
            </Link>
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
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>Promotional Product Categories</h2>
          <p style={{ fontSize: '15px', color: '#7A7570', margin: 0 }}>Browse our full range across 12 categories</p>
        </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {(showAllCats ? CATEGORIES : CATEGORIES.slice(0, 8)).map(cat => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div
                onMouseEnter={() => setHoveredCat(cat.slug)}
                onMouseLeave={() => setHoveredCat(null)}
                style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E0DDD7', background: '#fff', transition: 'all .25s', cursor: 'pointer', boxShadow: hoveredCat === cat.slug ? '0 12px 28px rgba(27,42,74,.18)' : '0 1px 3px rgba(0,0,0,.04)', transform: hoveredCat === cat.slug ? 'translateY(-4px)' : 'none' }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', background: '#fff' }}>
                  <img src={cat.img} alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s', transform: hoveredCat === cat.slug ? 'scale(1.06)' : 'scale(1)' }} />
                </div>
                <div style={{ padding: '16px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY, letterSpacing: '0.02em' }}>{cat.name}</div>
                  <div style={{ fontSize: '12px', color: GOLD, marginTop: '4px', fontWeight: 600 }}>Shop now →</div>
                </div>
              </div>
            </Link>
         ))}
        </div>

        {/* View More / Show Less 按钮 */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button
            onClick={() => setShowAllCats(!showAllCats)}
            style={{ background: 'transparent', color: NAVY, border: `1.5px solid ${NAVY}`, padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {showAllCats ? 'Show Less ↑' : 'View More Categories ↓'}
          </button>
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
                <div style={{ fontSize: '36px', marginBottom: '16px',textAlign: 'center' }}>{w.icon}</div>
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
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: '#fff', margin: '0 0 10px', fontWeight: 600 }}>What Our Clients Say</h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.55)', margin: 0 }}>Trusted by leading Australian organisations</p>
          </div>
 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ textAlign: 'center', padding: '0 8px' }}>
                {/* 五星 */}
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '20px' }}>
                  {[0,1,2,3,4].map(i => (
                    <span key={i} style={{ color: GOLD, fontSize: '16px', lineHeight: 1 }}>★</span>
                  ))}
                </div>
                {/* 引用 */}
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.8)', lineHeight: 1.7, margin: '0 0 24px', fontStyle: 'italic' }}>
                  {t.quote}
                </p>
                {/* 姓名 + 头衔 */}
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '19px', fontStyle: 'italic', color: '#fff', margin: 0 }}>
                  {t.name}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', letterSpacing: '0.05em', marginTop: '4px' }}>
                  {t.title}{t.company ? `, ${t.company}` : ''}
                </p>
              </div>
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
