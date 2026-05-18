'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = {
  'Bags': ['Backpacks', 'Briefcases', 'Cooler Bags', 'Drawstring Bags', 'Duffle Bags', 'Foldable Bags', 'Tote Bags', 'Waist Bags'],
  'Brands': ['Adidas', 'Moleskine', 'Contigo', 'Gear For Life', 'Slazenger'],
  'Business': ['Awards & Trophies', 'Business Cards', 'Desk Accessories', 'Lanyards', 'Name Badges'],
  'Collections': ['Corporate Gifting', 'Event Merchandise', 'Staff Uniforms', 'Welcome Packs'],
  'Drinkware': ['Ceramic Mugs', 'Coffee Cups', 'Cups & Tumblers', 'Drink Bottles - Glass', 'Drink Bottles - Metal', 'Drink Bottles - Plastic', 'Drinkware Presentation', 'Flasks', 'Travel Mugs'],
  'Headwear': ['Beanies', 'Bucket Hats', 'Caps', 'Sun Hats', 'Visors'],
  'Leisure': ['Beach & Outdoor', 'Games & Toys', 'Pets', 'Sports & Fitness', 'Travel'],
  'Packaging': ['Boxes', 'Gift Bags', 'Pouches', 'Tissue Paper', 'Wrapping'],
  'Pens': ['Ballpoint Pens', 'Fountain Pens', 'Highlighters', 'Markers', 'Rollerball Pens', 'Stylus Pens'],
  'Personal': ['Beauty & Wellness', 'Hand Sanitisers', 'Keyrings', 'Sunscreen', 'Umbrellas', 'Wallets'],
  'Promotion': ['Badges', 'Balloons', 'Calendars', 'Magnets', 'Stickers'],
  'Technology': ['Cables & Chargers', 'Earphones', 'Power Banks', 'USB Drives', 'Webcams'],
};

const SERVICES = [
  { label: 'Decoration Methods', href: '/services/decoration-methods' },
  { label: 'Sourcing', href: '/services/sourcing' },
  { label: 'Logistics', href: '/services/logistics' },
  { label: 'Warehousing & Fulfilment', href: '/services/warehousing' },
  { label: 'Merch Store', href: '/services/merch-store' },
];

const RESOURCES = [
  { label: 'Portfolio', href: '/resources/portfolio' },
  { label: 'PMS Colour Chart', href: '/resources/pms-chart' },
];

export default function Nav() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  function handleMouseEnter(menu) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  }

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div style={{ background: '#1A1714', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>

          {/* LOGO */}
          <Link href="/" style={{ fontFamily: 'serif', fontSize: '22px', color: '#fff', textDecoration: 'none', letterSpacing: '1px', flexShrink: 0 }}>
            PROMO<span style={{ color: '#E07050' }}>HUB</span>
          </Link>

          {/* SEARCH */}
          <div style={{ flex: 1, maxWidth: '560px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              style={{ width: '100%', padding: '10px 44px 10px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.4)', fontSize: '16px' }}>🔍</span>
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            <a href="tel:0294774748" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📞</span> 02 9477 4748
            </a>
            <Link href="/account/login" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👤</span> Sign In
            </Link>
            <Link href="/cart" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🛒</span> Cart
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORY NAV BAR */}
      <nav ref={navRef} style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', height: '48px', gap: '4px' }}>

          {/* PRODUCTS DROPDOWN */}
          <NavItem label="Products" onEnter={() => handleMouseEnter('products')} onLeave={handleMouseLeave} active={activeDropdown === 'products'} />

          {/* BEST SELLERS */}
          <Link href="/best-sellers" style={navLinkStyle}>Best Sellers</Link>

          {/* NEW ARRIVALS */}
          <Link href="/new-arrivals" style={navLinkStyle}>New Arrivals</Link>

          {/* SUSTAINABILITY */}
          <Link href="/sustainability" style={navLinkStyle}>Sustainability</Link>

          {/* SERVICES DROPDOWN */}
          <NavItem label="Services" onEnter={() => handleMouseEnter('services')} onLeave={handleMouseLeave} active={activeDropdown === 'services'} />

          {/* RESOURCES DROPDOWN */}
          <NavItem label="Resources" onEnter={() => handleMouseEnter('resources')} onLeave={handleMouseLeave} active={activeDropdown === 'resources'} />

          {/* ABOUT */}
          <Link href="/about" style={navLinkStyle}>About Us</Link>

          {/* CONTACT */}
          <Link href="/contact" style={navLinkStyle}>Contact</Link>
        </div>

        {/* PRODUCTS MEGA DROPDOWN */}
        {activeDropdown === 'products' && (
          <div
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'absolute', top: '48px', left: 0, right: 0, background: '#fff', borderTop: '2px solid #0C7A6B', borderBottom: '1px solid #E0DDD7', boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 200, padding: '24px 32px' }}
          >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 32px' }}>
                {Object.entries(CATEGORIES).map(([cat, subs]) => (
                  <div key={cat} style={{ marginBottom: '16px' }}>
                    <Link
                      href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
                      onClick={() => setActiveDropdown(null)}
                      style={{ fontSize: '13px', fontWeight: 700, color: '#0C7A6B', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}
                    >
                      {cat}
                    </Link>
                    {subs.map(sub => (
                      <Link
                        key={sub}
                        href={`/subcategory/${encodeURIComponent(sub.toLowerCase().replace(/ /g, '-'))}`}
                        onClick={() => setActiveDropdown(null)}
                        style={{ fontSize: '12px', color: '#7A7570', textDecoration: 'none', display: 'block', padding: '2px 0', lineHeight: '1.6' }}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SERVICES DROPDOWN */}
        {activeDropdown === 'services' && (
          <div
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'absolute', top: '48px', left: 0, background: '#fff', borderTop: '2px solid #0C7A6B', borderBottom: '1px solid #E0DDD7', boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 200, padding: '16px 0', minWidth: '220px' }}
          >
            {SERVICES.map(s => (
              <Link key={s.href} href={s.href} onClick={() => setActiveDropdown(null)}
                style={{ display: 'block', padding: '10px 24px', fontSize: '13px', color: '#3D3A36', textDecoration: 'none', fontWeight: 500 }}>
                {s.label}
              </Link>
            ))}
          </div>
        )}

        {/* RESOURCES DROPDOWN */}
        {activeDropdown === 'resources' && (
          <div
            onMouseEnter={() => handleMouseEnter('resources')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'absolute', top: '48px', left: 0, background: '#fff', borderTop: '2px solid #0C7A6B', borderBottom: '1px solid #E0DDD7', boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 200, padding: '16px 0', minWidth: '220px' }}
          >
            {RESOURCES.map(r => (
              <Link key={r.href} href={r.href} onClick={() => setActiveDropdown(null)}
                style={{ display: 'block', padding: '10px 24px', fontSize: '13px', color: '#3D3A36', textDecoration: 'none', fontWeight: 500 }}>
                {r.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

function NavItem({ label, onEnter, onLeave, active }) {
  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ padding: '0 12px', height: '48px', background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, color: active ? '#0C7A6B' : '#3D3A36', cursor: 'pointer', fontFamily: 'inherit', borderBottom: active ? '2px solid #0C7A6B' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px' }}
    >
      {label} <span style={{ fontSize: '10px' }}>▾</span>
    </button>
  );
}

const navLinkStyle = {
  padding: '0 12px', height: '48px', fontSize: '13px', fontWeight: 500,
  color: '#3D3A36', textDecoration: 'none', display: 'flex', alignItems: 'center',
  borderBottom: '2px solid transparent',
};
