'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import QuoteModal from '@/components/QuoteModal';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const CLOUD_BASE = 'https://res.cloudinary.com/dyz9r0fm7/image/upload';
const siteImg = (file, w) => `${CLOUD_BASE}/f_auto,q_auto,w_${w}/promohub/site/${file}`;

// ⬇️ 已上传图片的实际地址(Cloudinary 加了随机后缀且在根目录)。
//    以后新图上传后,把 Cloudinary 给的实际 URL 按同样格式填进来即可。
const IMG = {
  hero:           `${CLOUD_BASE}/f_auto,q_auto,w_1800/v1780553623/hero-main_ajlr8j.jpg`,
  fastPromo:      `${CLOUD_BASE}/f_auto,q_auto,w_800/v1780545551/fast-promo_l2t6gn.jpg`,
  customSourcing: `${CLOUD_BASE}/f_auto,q_auto,w_800/v1780545551/custom-sourcing_qfwk55.jpg`,
};

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

const TRUST_BAR = [
  { icon: '🇦🇺', title: 'Australian Stock',   sub: 'Local inventory' },
  { icon: '📦', title: 'Low Minimum Orders', sub: 'From just 10 units' },
  { icon: '🚚', title: 'Fast Turnaround',    sub: 'Quick local delivery' },
  { icon: '🏷️', title: 'Instant Pricing',    sub: 'See prices online' },
];

const FAST_POINTS = [
  'Low minimum orders',
  'Instant pricing online',
  'Fast local turnaround',
  'Order online or send a quote',
];

const CUSTOM_POINTS = [
  'Fully custom products',
  'OEM manufacturing',
  'Custom packaging',
  'Factory direct pricing',
];

const INDUSTRIES = [
  {
    name: 'Hospitality',
    img: siteImg('industry-hospitality.jpg', 800),
    desc: 'Branded merchandise for cafes, restaurants and hotels.',
    href: '/collections/hospitality',
  },
  {
    name: 'Corporate & HR',
    img: siteImg('industry-corporate.jpg', 800),
    desc: 'Employee gifts, welcome kits and brand promotions.',
    href: '/collections/corporate-and-business',
  },
  {
    name: 'Events & Conferences',
    img: siteImg('industry-events.jpg', 800),
    desc: 'Stand out with custom merchandise that gets remembered.',
    href: '/collections/conference',
  },
  {
    name: 'Real Estate',
    img: siteImg('industry-realestate.jpg', 800),
    desc: 'Settlement gifts and branded products for agencies.',
    href: '/collections/real-estate',
  },
];

const PROJECTS = [
  { img: siteImg('project-1.jpg', 600), title: '500 x Stainless Steel Bottles', sub: 'For a national wellness brand' },
  { img: siteImg('project-2.jpg', 600), title: '1000 x Canvas Tote Bags',       sub: 'For a sustainability campaign' },
  { img: siteImg('project-3.jpg', 600), title: 'Employee Welcome Kits',         sub: 'For a tech company' },
];

const GUARANTEES = [
  { icon: '🛡️', title: 'Quality Guaranteed',  sub: 'Premium products you can trust' },
  { icon: '🚚', title: 'Fast Turnaround',     sub: 'Reliable delivery across Australia' },
  { icon: '🌱', title: 'Sustainable Options', sub: 'Eco-friendly choices for your brand' },
  { icon: '🗺️', title: 'Australian Owned',    sub: 'Proudly supporting local businesses' },
];

const SEO_PARAGRAPHS = [
  "At Quirky Promo, we believe promotional products should do more than display a logo — they should help build meaningful connections between brands and people.",
  "We help businesses across Australia create memorable brand experiences through high-quality promotional products, branded merchandise and custom corporate gifts. Whether you're preparing for a trade show, conference, staff onboarding program, product launch or marketing campaign, our goal is simple: to help your brand stand out and stay remembered.",
  "Our platform makes ordering promotional products easier than ever. Browse thousands of Australian-stocked products, select your preferred branding method, view transparent pricing and place your order online or request a personalised quote. From branded drink bottles, coffee cups and tote bags to custom apparel, technology products and employee welcome kits, we offer solutions designed to support organisations of every size.",
  "What makes Quirky Promo different is our combination of speed, transparency and flexibility. Many promotional products are available from Australian inventory and decorated locally, allowing for fast turnaround times, low minimum order quantities and reliable Australia-wide delivery. Whether you need ten items or ten thousand, we make the process simple and efficient.",
  "Looking for something unique that isn't available in a standard catalogue? Our Custom Made & Global Sourcing service gives businesses access to fully customised merchandise solutions. From bespoke products and retail-quality packaging to OEM manufacturing and large-scale sourcing projects, we work directly with trusted factory partners to bring creative ideas to life. This allows our clients to create promotional products that are truly unique to their brand.",
  "We proudly support organisations across healthcare, education, corporate, professional services, events, hospitality, government and not-for-profit sectors. Whether you're rewarding employees, welcoming new team members, attracting event attendees or strengthening customer relationships, branded merchandise remains one of the most effective ways to increase brand recognition and engagement.",
  "Our most popular categories include promotional drinkware, branded bags, custom apparel, notebooks, technology accessories, conference giveaways and sustainable merchandise. Every project is backed by expert advice, transparent pricing and a commitment to quality, helping you build a stronger brand through products people genuinely use and keep.",
  "From fast-turnaround promotional products to fully customised sourcing solutions, Quirky Promo is your trusted partner for branded merchandise, corporate gifts and promotional products throughout Australia.",
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
    quote: 'Hornsby Mazda always receives fantastic service from Lily. She is very quick, efficient, and professional with every order we place. We are consistently impressed by her attention to detail and responsiveness. I would be happy to recommend this company to anyone looking for excellent service.',
    name: 'Adam',
    title: 'Retail Sales Manager',
    company: ' Hornsby Mazda',
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
  const [hoveredInd, setHoveredInd] = useState(null);
  const [showAllCats, setShowAllCats] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

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

      {/* ============ HERO (新版: 浅色背景图 + 左侧文案) ============ */}
      <div className="qp-hero" style={{
        position: 'relative', minHeight: '620px', display: 'flex', alignItems: 'center',
        backgroundImage: `url(${IMG.hero})`,
        backgroundSize: 'cover', backgroundPosition: 'center right', backgroundColor: '#F4F1EC',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '72px 40px', width: '100%', boxSizing: 'border-box' }}>
          <div className="qp-hero-inner" style={{ maxWidth: '560px' }}>
            <div style={{ color: GOLD, fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '18px' }}>
              Build Your Brand
            </div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '56px', fontWeight: 700, color: NAVY, margin: '0 0 14px', lineHeight: 1.08 }}>
              Custom Promotional Products That Build Your Brand
            </h1>
            <p style={{ fontSize: '20px', color: GOLD, fontWeight: 700, margin: '0 0 18px', letterSpacing: '0.5px' }}>
              Easy. Fast. Transparent. Custom.
            </p>
            <p style={{ fontSize: '16px', color: '#4A463F', lineHeight: 1.75, margin: '0 0 32px' }}>
              Australian stocked products with local branding, instant pricing and fast turnaround.<br />
              Need something unique? We can source and manufacture it for you.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button onClick={() => setQuoteOpen(true)}
                style={{ background: GOLD, color: '#fff', border: 'none', padding: '16px 34px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(201,169,110,.45)' }}>
                Get a Quote →
              </button>
              <Link href="/category/bags"
                style={{ background: 'rgba(255,255,255,.85)', color: NAVY, padding: '16px 34px', borderRadius: '10px', fontSize: '16px', fontWeight: 600, textDecoration: 'none', border: `1.5px solid ${NAVY}`, boxSizing: 'border-box' }}>
                Browse Products
              </Link>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 920px) {
            .qp-hero { background-position: 72% center !important; }
            .qp-hero-inner { background: rgba(255,255,255,.88); padding: 28px; border-radius: 16px; backdrop-filter: blur(2px); }
            .qp-hero-inner h1 { font-size: 40px !important; }
          }
        `}</style>
      </div>

      {/* ============ TRUST BAR (新版 4 项) ============ */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '22px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '56px', flexWrap: 'wrap' }}>
          {TRUST_BAR.map(b => (
            <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '26px' }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: NAVY }}>{b.title}</div>
                <div style={{ fontSize: '12px', color: '#7A7570' }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ CATEGORIES (保持原样) ============ */}
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

      {/* ============ TWO WAYS TO BUILD YOUR BRAND (新增) ============ */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>Two Ways to Build Your Brand</h2>
            <p style={{ fontSize: '15px', color: '#7A7570', margin: 0 }}>Fast Australian stock, or fully custom global sourcing — we do both</p>
          </div>

          <div className="qp-two-ways" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* 左卡: FAST PROMOTIONAL PRODUCTS (navy) */}
            <div style={{ background: NAVY, borderRadius: '18px', padding: '36px 32px' }}>
              <div style={{ color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                Australian Stock&nbsp; | &nbsp;Local Branding&nbsp; | &nbsp;Fast Delivery
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: '#fff', margin: '0 0 22px', fontWeight: 600 }}>
                Fast Promotional Products
              </h3>
              <div className="qp-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
                <div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                    {FAST_POINTS.map(p => (
                      <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'rgba(255,255,255,.85)', marginBottom: '12px' }}>
                        <span style={{ color: GOLD, fontWeight: 700 }}>✓</span> {p}
                      </li>
                    ))}
                  </ul>
                  <Link href="/category/bags"
                    style={{ background: GOLD, color: '#fff', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 16px rgba(201,169,110,.4)' }}>
                    Browse Products →
                  </Link>
                </div>
                <img src={IMG.fastPromo} alt="Fast promotional products with your logo"
                  style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
              </div>
            </div>

            {/* 右卡: CUSTOM MADE & GLOBAL SOURCING (light) */}
            <div style={{ background: BG, border: '1px solid #E0DDD7', borderRadius: '18px', padding: '36px 32px' }}>
              <div style={{ color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                Can't find exactly what you need?
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>
                Custom Made & Global Sourcing
              </h3>
              <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.7, margin: '0 0 22px' }}>
                We source and manufacture custom products directly from trusted factories.
              </p>
              <div className="qp-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
                <div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                    {CUSTOM_POINTS.map(p => (
                      <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#4A463F', marginBottom: '12px' }}>
                        <span style={{ color: GOLD, fontWeight: 700 }}>✓</span> {p}
                      </li>
                    ))}
                  </ul>
                  <Link href="/supply-chain/quote"
                    style={{ background: GOLD, color: '#fff', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 16px rgba(201,169,110,.4)' }}>
                    Start a Custom Project →
                  </Link>
                </div>
                <img src={IMG.customSourcing} alt="Custom made corporate gift sets"
                  style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
              </div>
            </div>

          </div>
        </div>
        <style>{`
          @media (max-width: 960px) {
            .qp-two-ways { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 560px) {
            .qp-card-body { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      {/* ============ SOLUTIONS FOR YOUR INDUSTRY (新增, 方案A) ============ */}
      <div style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>Solutions for Your Industry</h2>
            <p style={{ fontSize: '15px', color: '#7A7570', margin: 0 }}>Curated product ranges for the industries we know best</p>
          </div>
          <div className="qp-industries" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {INDUSTRIES.map(ind => (
              <Link key={ind.name} href={ind.href} style={{ textDecoration: 'none' }}>
                <div
                  onMouseEnter={() => setHoveredInd(ind.name)}
                  onMouseLeave={() => setHoveredInd(null)}
                  style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E0DDD7', height: '100%', boxSizing: 'border-box', transition: 'all .25s', boxShadow: hoveredInd === ind.name ? '0 12px 28px rgba(27,42,74,.18)' : '0 1px 3px rgba(0,0,0,.04)', transform: hoveredInd === ind.name ? 'translateY(-4px)' : 'none' }}
                >
                  <div style={{ width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', background: '#EDEAE4' }}>
                    <img src={ind.img} alt={ind.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s', transform: hoveredInd === ind.name ? 'scale(1.05)' : 'scale(1)' }} />
                  </div>
                  <div style={{ padding: '20px 18px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>{ind.name}</div>
                    <p style={{ fontSize: '13px', color: '#5A5550', lineHeight: 1.6, margin: '0 0 12px' }}>{ind.desc}</p>
                    <div style={{ fontSize: '13px', color: GOLD, fontWeight: 700 }}>Learn More →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 1100px) { .qp-industries { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 600px)  { .qp-industries { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>

      {/* ============ WHY QUIRKYPROMO (保持原样) ============ */}
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

      {/* ============ FEATURED PRODUCTS (保持原样) ============ */}
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

      {/* ============ RECENT PROJECTS (新增) ============ */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>Recent Projects</h2>
            <p style={{ fontSize: '15px', color: '#7A7570', margin: 0 }}>Real campaigns, delivered for Australian businesses</p>
          </div>
          <div className="qp-projects" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {PROJECTS.map(p => (
              <div key={p.title} style={{ background: BG, borderRadius: '14px', overflow: 'hidden', border: '1px solid #E0DDD7' }}>
                <div style={{ width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', background: '#EDEAE4' }}>
                  <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: '18px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: NAVY, marginBottom: '4px' }}>{p.title}</div>
                  <div style={{ fontSize: '13px', color: '#7A7570' }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .qp-projects { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>

       {/* ============ TESTIMONIALS (保持原样) ============ */}
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

       {/* ============ BRANDS (保持原样) ============ */}
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


      {/* ============ 保障条 + BOTTOM CTA (新版) ============ */}
      <div style={{ background: NAVY, padding: '56px 40px 72px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '56px', flexWrap: 'wrap', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,.12)', marginBottom: '48px' }}>
            {GUARANTEES.map(g => (
              <div key={g.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '26px' }}>{g.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{g.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.55)' }}>{g.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '40px', color: '#fff', margin: '0 0 14px', fontWeight: 600 }}>
              Ready to Bring Your Brand to Life?
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.7)', margin: '0 0 32px', lineHeight: 1.7 }}>
              Whether you need fast promotional products or a completely custom solution, we're here to help.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setQuoteOpen(true)}
                style={{ background: GOLD, color: '#fff', border: 'none', padding: '15px 34px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(201,169,110,.4)' }}>
                Get Your Free Quote →
              </button>
              <Link href="/category/bags" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', padding: '15px 34px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,.25)', boxSizing: 'border-box' }}>
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ============ SEO 文案区块 (新增, Footer 正上方) ============ */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 24px', fontWeight: 600, textAlign: 'center' }}>
            Promotional Products, Branded Merchandise & Corporate Gifts Australia
          </h2>
          {SEO_PARAGRAPHS.map((para, i) => (
            <p key={i} style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.85, margin: '0 0 16px' }}>
              {para}
            </p>
          ))}
          <p style={{ fontSize: '16px', color: GOLD, fontWeight: 700, textAlign: 'center', margin: '32px 0 6px', letterSpacing: '0.5px' }}>
            Easy. Fast. Transparent. Custom.
          </p>
          <p style={{ fontSize: '14px', color: '#7A7570', textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
            Because building your brand should be simple.
          </p>
        </div>
      </div>

      {/* GET A QUOTE 弹窗 */}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} source="homepage" />
    </div>
  );
}
