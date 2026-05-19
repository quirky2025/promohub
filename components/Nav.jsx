'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const ALL_PRODUCTS = {
  'Apparel': ['Apparel Accessories', 'Jackets', 'Socks & Footwear', 'Sweatshirts'],
  'Bags': ['Backpacks', 'Cooler Bags', 'Crossbody & Belt Bags', 'Drawstring Bags', 'Duffle Bags', 'Jute Bags', 'Laptop Bags', 'Paper Bags', 'Satchel Bags', 'Tote Bags'],
  'Business': ['Highlighters', 'ID Holders', 'Lanyards', 'Note Pads', 'Notebooks', 'Stationery', 'Sticky Notes'],
  'Drinkware': ['Ceramic Mugs', 'Coffee Cups', 'Cups & Tumblers', 'Drink Bottles - Glass', 'Drink Bottles - Metal', 'Drink Bottles - Plastic', 'Drinkware Presentation', 'Flasks', 'Travel Mugs'],
  'Headwear': ['Beanies', 'Bucket Hats', 'Caps', 'Headwear Accessories', 'Headwear Express'],
  'Leisure': ['Camping & Outdoors', 'Chairs', 'Coasters', 'Games & Puzzles', 'Home & Living', 'Picnic & BBQ', 'Sport', 'Sunglasses', 'Tools', 'Towels', 'Umbrellas'],
  'Packaging': ['Gift Boxes', 'Packaging Accessories', 'Ribbons'],
  'Pens': ['Black Refill', 'Metal', 'Novelty', 'Paper', 'Plastic', 'Presentation', 'Refills'],
  'Personal': ['Candles & Diffusers', 'Hand Sanitiser', 'Lip Balms', 'Lotions & Sunscreens', 'Personal Care'],
  'Print': ['Pads & Planners', 'Signage'],
  'Promotion': ['Badges', 'Bottle Openers', 'Fidget Items', 'Key Rings', 'Pet Accessories', 'Promotional', 'Stress Items', 'Stubby & Can Holders', 'Wristbands'],
  'Technology': ['Charging Cables', 'Earbuds', 'Flash Drives', 'Headphones', 'Mouse Mats', 'Phone Wallets', 'Power Banks', 'Screen Cleaners', 'Sleeves & Cases', 'Speakers', 'Tech Accessories', 'USB Hubs', 'Wireless Chargers'],
};

const COLLECTIONS = [
  'Agriculture', 'Automotive', 'Children', 'Conference', 'Custom Shape',
  'Festivals & Events', 'Full Custom', 'Fundraising', 'Golf', 'Health & Beauty',
  'Hospitality', 'Logistics', 'Mailable Items', 'Natural', 'Price Buster',
  'Real Estate', 'Recycled', 'Rest Homes', 'Safety', 'Sports & Fitness',
  'Summer', 'Trades', 'Tradeshows', 'Travel', 'Winter',
];

const BRANDS = [
  'ARCHER', 'BRANDCRAFT', 'CamelBak', 'Impact Aware', 'Keepsake',
  'LAMY', 'Luigi Bormioli', 'Moleskine', 'NATURA', 'Osprey',
  'Pierre Cardin', 'Skullcandy', "SOL'S", 'Swiss Peak', 'Titleist',
  'TRENDSWEAR', 'WNSDY', 'XD Design',
];

export default function Nav() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);

  function handleMouseEnter(menu) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  }

  function handleMouseLeave() {
    // 400ms 给用户足够时间移动到dropdown
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 600);
  }

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  // 透明桥接样式 — 填补按钮和dropdown之间的空隙
  const bridgeStyle = {
    position: 'absolute',
    top: '-8px',       // 往上延伸8px覆盖空隙
    left: 0,
    right: 0,
    height: '8px',
    background: 'transparent',
  };

  return (
    <>
      {/* TOP BAR */}
      <div style={{ background: NAVY }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto', padding: '0 40px',
          height: '128px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '32px',
        }}>
          {/* LOGO */}
          <Link href="/" style={{
            fontFamily: '"Cormorant Garamond", "Cormorant", Georgia, serif',
            fontSize: '36px', color: '#ffffff', textDecoration: 'none',
            letterSpacing: '4px', flexShrink: 0, fontWeight: 600, lineHeight: 1,
          }}>
            QUIRKY<span style={{ color: GOLD }}>PROMO</span>
          </Link>

          {/* SEARCH */}
          <div style={{ flex: 1, maxWidth: '640px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              style={{
                width: '100%', padding: '16px 52px 16px 22px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.1)',
                color: '#ffffff', fontSize: '15px', outline: 'none',
                fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box', letterSpacing: '0.2px',
              }}
            />
            <span style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.6)', fontSize: '20px' }}>🔍</span>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexShrink: 0 }}>
            <a href="tel:0294774748" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>Call Us</span>
              <span style={{ fontFamily: '"DM Mono", "Courier New", monospace', fontSize: '22px', color: '#ffffff', fontWeight: 500, letterSpacing: '1.5px' }}>02 9477 4748</span>
            </a>
            <div style={{ width: '1px', height: '44px', background: 'rgba(255,255,255,.2)' }} />
            <Link href="/account/login" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 500 }}>
              👤 <span>Sign In</span>
            </Link>
            <Link href="/cart" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 500 }}>
              🛒 <span>Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORY NAV BAR */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', height: '56px', gap: '4px' }}>

          {/* ALL PRODUCTS */}
          <div
            style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <NavItem
              label="All Products"
              active={activeDropdown === 'products'}
              onEnter={() => handleMouseEnter('products')}
              onLeave={handleMouseLeave}
              navy={NAVY} gold={GOLD}
            />
          </div>

          {/* COLLECTIONS */}
          <div
            style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => handleMouseEnter('collections')}
            onMouseLeave={handleMouseLeave}
          >
            <NavItem label="Collections" active={activeDropdown === 'collections'} onEnter={() => handleMouseEnter('collections')} onLeave={handleMouseLeave} navy={NAVY} gold={GOLD} />
            {activeDropdown === 'collections' && (
              <div style={{
                position: 'absolute', top: '56px', left: 0,
                background: '#fff', borderTop: `2px solid ${GOLD}`,
                borderBottom: '1px solid #E0DDD7',
                boxShadow: '0 8px 32px rgba(0,0,0,.14)',
                zIndex: 200, padding: '20px 28px', minWidth: '300px',
                borderRadius: '0 0 8px 8px',
              }}>
                {/* 透明桥接 — 防止鼠标从按钮移到dropdown时消失 */}
                <div style={bridgeStyle} onMouseEnter={() => handleMouseEnter('collections')} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 32px' }}>
                  {COLLECTIONS.map(col => (
                    <Link
                      key={col}
                      href={`/collections/${encodeURIComponent(col.toLowerCase().replace(/ /g, '-'))}`}
                      onClick={() => setActiveDropdown(null)}
                      style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#111111', textDecoration: 'none', padding: '5px 0', display: 'block', fontWeight: 400 }}
                    >
                      {col}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BRANDS */}
          <div
            style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => handleMouseEnter('brands')}
            onMouseLeave={handleMouseLeave}
          >
            <NavItem label="Brands" active={activeDropdown === 'brands'} onEnter={() => handleMouseEnter('brands')} onLeave={handleMouseLeave} navy={NAVY} gold={GOLD} />
            {activeDropdown === 'brands' && (
              <div style={{
                position: 'absolute', top: '56px', left: 0,
                background: '#fff', borderTop: `2px solid ${GOLD}`,
                borderBottom: '1px solid #E0DDD7',
                boxShadow: '0 8px 32px rgba(0,0,0,.14)',
                zIndex: 200, padding: '20px 28px', minWidth: '220px',
                borderRadius: '0 0 8px 8px',
              }}>
                {/* 透明桥接 */}
                <div style={bridgeStyle} onMouseEnter={() => handleMouseEnter('brands')} />
                {BRANDS.map(brand => (
                  <Link
                    key={brand}
                    href={`/brands/${encodeURIComponent(brand.toLowerCase().replace(/ /g, '-'))}`}
                    onClick={() => setActiveDropdown(null)}
                    style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#111111', textDecoration: 'none', padding: '7px 0', display: 'block', borderBottom: '1px solid #F0EEED', fontWeight: 400 }}
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/sustainability" style={{ ...navLinkStyle, color: '#2D6A4F', fontWeight: 600 }}>🌿 Eco</Link>
          <Link href="/new-arrivals" style={navLinkStyle}>New Arrivals</Link>
          <Link href="/sale" style={{ ...navLinkStyle, color: '#C0392B', fontWeight: 600 }}>Sale</Link>
        </div>

        {/* ALL PRODUCTS MEGA DROPDOWN */}
        {activeDropdown === 'products' && (
          <div
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'absolute', top: '56px', left: 0, right: 0, background: '#fff', borderTop: `2px solid ${GOLD}`, borderBottom: '1px solid #E0DDD7', boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 200, padding: '28px 40px' }}
          >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 40px' }}>
                {Object.entries(ALL_PRODUCTS).map(([cat, subs]) => (
                  <div key={cat} style={{ marginBottom: '20px' }}>
                    <Link
                      href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
                      onClick={() => setActiveDropdown(null)}
                      style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 700, color: NAVY, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px', borderBottom: `1px solid ${GOLD}`, paddingBottom: '4px' }}
                    >
                      {cat}
                    </Link>
                    {subs.map(sub => (
                      <Link
                        key={sub}
                        href={`/subcategory/${encodeURIComponent(sub.toLowerCase().replace(/ /g, '-'))}`}
                        onClick={() => setActiveDropdown(null)}
                        style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#111111', textDecoration: 'none', display: 'block', padding: '3px 0', lineHeight: '1.9', fontWeight: 400 }}
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
      </nav>
    </>
  );
}

function NavItem({ label, active, onEnter, onLeave, navy, gold }) {
  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        padding: '0 16px', height: '56px', background: 'none', border: 'none',
        fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
        color: active ? navy : '#1a1a1a', cursor: 'pointer',
        borderBottom: active ? `2px solid ${gold}` : '2px solid transparent',
        display: 'flex', alignItems: 'center', gap: '4px',
        transition: 'color .15s', letterSpacing: '0.3px',
      }}
    >
      {label} <span style={{ fontSize: '11px', color: active ? gold : '#B0AAA3' }}>▾</span>
    </button>
  );
}

const navLinkStyle = {
  padding: '0 16px', height: '56px', fontSize: '15px', fontWeight: 500,
  fontFamily: '"DM Sans", sans-serif', color: '#1a1a1a', textDecoration: 'none',
  display: 'flex', alignItems: 'center', borderBottom: '2px solid transparent',
  letterSpacing: '0.3px',
};
