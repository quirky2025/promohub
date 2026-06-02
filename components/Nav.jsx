'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCartCount } from '@/lib/cart';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const ALL_PRODUCTS = {
  'Apparel': ['Apparel Accessories', 'Jackets', 'Socks & Footwear', 'Sweatshirts'],
  'Bags': ['Backpacks', 'Cooler Bags', 'Crossbody & Belt Bags', 'Drawstring Bags', 'Duffle Bags', 'Jute Bags', 'Laptop Bags', 'Paper Bags', 'Satchel Bags', 'Tote Bags'],
  'Business': ['Highlighters', 'ID Holders', 'Lanyards', 'Note Pads', 'Notebooks', 'Stationery', 'Sticky Notes'],
  'Drinkware': ['Ceramic Mugs', 'Coffee Cups', 'Cups & Tumblers', 'Drink Bottles - Glass', 'Drink Bottles - Metal', 'Drink Bottles - Plastic', 'Drinkware Presentation', 'Flasks', 'Travel Mugs'],
  'Headwear': ['Beanies', 'Bucket Hats', 'Caps', 'Headwear Accessories', 'Headwear Express'],
  'Leisure': ['Camping & Outdoors', 'Chairs', 'Coasters', 'Games & Puzzles', 'Home & Living', 'Picnic & BBQ', 'Sport', 'Sunglasses', 'Tools', 'Towels', 'Travel', 'Umbrellas'],
  'Packaging': ['Gift Boxes', 'Packaging Accessories', 'Ribbons'],
  'Pens': ['Black Refill', 'Metal', 'Novelty', 'Paper', 'Plastic', 'Presentation', 'Refills'],
  'Personal': ['Candles & Diffusers', 'Hand Sanitiser', 'Lip Balms', 'Lotions & Sunscreens', 'Personal Care'],
  'Print': ['Pads & Planners', 'Signage'],
  'Promotion': ['Badges', 'Bottle Openers', 'Fidget Items', 'Key Rings', 'Pet Accessories', 'Promotional', 'Stress Items', 'Stubby & Can Holders', 'Wristbands'],
  'Technology': ['Charging Cables', 'Earbuds', 'Flash Drives', 'Headphones', 'Mouse Mats', 'Phone Wallets', 'Power Banks', 'Screen Cleaners', 'Sleeves & Cases', 'Speakers', 'Tech Accessories', 'USB Hubs', 'Wireless Chargers'],
};

const COLLECTIONS = [
  'Children', 'Corporate & Business', 'Food & Beverage', 'Fundraising',
  'Gifts & Promotions', 'Health & Beauty', 'Natural', 'Price Buster',
  'Sports & Fitness', 'Summer', 'Tradeshow & Events', 'Travel & Outdoor',
];

const BRANDS = [
  'ARCHER', 'CamelBak', 'Frontier', 'Keepsake', 'Luigi Bormioli',
  'Moleskine', 'NATURA', 'Ocean Bottle', 'Osprey', 'Pierre Cardin',
  'SPICE', 'Swiss Peak', 'XD Design',
];

function toSlug(name) {
  return name.toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/&/g, 'and')
    .replace(/ /g, '-');
}

const dropdownLinkStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '14px',
  color: '#111',
  textDecoration: 'none',
  display: 'block',
  padding: '5px 8px',
  borderRadius: '4px',
  transition: 'background .15s, color .15s',
};

export default function Nav() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const navRef = useRef(null);

  function handleSearch(e) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setActiveDropdown(null);
    }
  }

  function handleSearchClick() {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setActiveDropdown(null);
    }
  }

  function toggleDropdown(menu) {
    setActiveDropdown(prev => prev === menu ? null : menu);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    setCartCount(getCartCount());
    function onCartUpdate() { setCartCount(getCartCount()); }
    window.addEventListener('cart-updated', onCartUpdate);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('cart-updated', onCartUpdate);
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const dropPanel = {
    position: 'absolute',
    top: '56px',
    background: '#fff',
    borderTop: `2px solid ${GOLD}`,
    borderBottom: '1px solid #E0DDD7',
    boxShadow: '0 8px 32px rgba(0,0,0,.12)',
    zIndex: 200,
    padding: '20px 28px',
  };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* TOP BAR */}
      <div style={{ background: NAVY }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', height: '128px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
          <Link href="/" onClick={() => setActiveDropdown(null)} style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '36px', color: '#fff', textDecoration: 'none', letterSpacing: '4px', flexShrink: 0, fontWeight: 600, lineHeight: 1 }}>
            QUIRKY<span style={{ color: GOLD }}>PROMO</span>
          </Link>
          <div style={{ flex: 1, maxWidth: '640px', position: 'relative' }}>
            <input type="text" placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              style={{ width: '100%', padding: '16px 52px 16px 22px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: '15px', outline: 'none', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box' }} />
            <span onClick={handleSearchClick} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.6)', fontSize: '20px', cursor: 'pointer' }}>🔍</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexShrink: 0 }}>
            <a href="tel:0294774748" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>Call Us</span>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '22px', color: '#fff', fontWeight: 500, letterSpacing: '1.5px' }}>02 9477 4748</span>
            </a>
            <div style={{ width: '1px', height: '44px', background: 'rgba(255,255,255,.2)' }} />
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/account" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 500 }}>
                  👤 <span>{user.user_metadata?.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                <button onClick={handleSignOut} style={{ background: 'none', border: '1px solid rgba(255,255,255,.3)', borderRadius: '6px', color: 'rgba(255,255,255,.7)', fontSize: '12px', padding: '4px 10px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/account/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 500 }}>👤 <span>Sign In</span></Link>
            )}
            <Link href="/cart" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 500, position: 'relative' }}>
              🛒 <span>Cart</span>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: '#C9A96E', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <nav ref={navRef} style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', height: '56px', gap: '4px' }}>

          {/* ALL PRODUCTS - Click */}
          <button onClick={() => toggleDropdown('products')}
            style={{ padding: '0 16px', height: '56px', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: activeDropdown === 'products' ? NAVY : '#1a1a1a', cursor: 'pointer', borderBottom: activeDropdown === 'products' ? `2px solid ${GOLD}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
            All Products <span style={{ fontSize: '11px', color: activeDropdown === 'products' ? GOLD : '#B0AAA3' }}>▾</span>
          </button>

          {/* COLLECTIONS - Click */}
          <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => toggleDropdown('collections')}
              style={{ padding: '0 16px', height: '56px', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: activeDropdown === 'collections' ? NAVY : '#1a1a1a', cursor: 'pointer', borderBottom: activeDropdown === 'collections' ? `2px solid ${GOLD}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
              Collections <span style={{ fontSize: '11px', color: activeDropdown === 'collections' ? GOLD : '#B0AAA3' }}>▾</span>
            </button>
            {activeDropdown === 'collections' && (
              <div style={{ ...dropPanel, left: 0, minWidth: '300px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 24px' }}>
                  {COLLECTIONS.map(col => (
                    <Link key={col}
                      href={`/collections/${toSlug(col)}`}
                      onClick={() => setActiveDropdown(null)}
                      style={dropdownLinkStyle}
                      onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = NAVY; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
                    >{col}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BRANDS - Click */}
          <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => toggleDropdown('brands')}
              style={{ padding: '0 16px', height: '56px', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: activeDropdown === 'brands' ? NAVY : '#1a1a1a', cursor: 'pointer', borderBottom: activeDropdown === 'brands' ? `2px solid ${GOLD}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
              Brands <span style={{ fontSize: '11px', color: activeDropdown === 'brands' ? GOLD : '#B0AAA3' }}>▾</span>
            </button>
            {activeDropdown === 'brands' && (
              <div style={{ ...dropPanel, left: 0, minWidth: '220px' }}>
                {BRANDS.map(brand => (
                  <Link key={brand}
                    href={`/brands/${toSlug(brand)}`}
                    onClick={() => setActiveDropdown(null)}
                    style={{ ...dropdownLinkStyle, borderBottom: '1px solid #F0EEED' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = NAVY; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
                  >{brand}</Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/sustainability" onClick={() => setActiveDropdown(null)} style={{ ...navLinkStyle, color: '#2D6A4F', fontWeight: 600 }}>🌿 Eco</Link>
          <Link href="/new-arrivals" onClick={() => setActiveDropdown(null)} style={navLinkStyle}>New Arrivals</Link>
          <Link href="/sale" onClick={() => setActiveDropdown(null)} style={{ ...navLinkStyle, color: '#C0392B', fontWeight: 600 }}>Sale</Link>

          {/* INDENT - Click */}
          <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => toggleDropdown('indent')}
              style={{ padding: '0 16px', height: '56px', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: activeDropdown === 'indent' ? NAVY : '#1a1a1a', cursor: 'pointer', borderBottom: activeDropdown === 'indent' ? `2px solid ${GOLD}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
              Indent <span style={{ fontSize: '11px', color: activeDropdown === 'indent' ? GOLD : '#B0AAA3' }}>▾</span>
            </button>
            {activeDropdown === 'indent' && (
              <div style={{ ...dropPanel, left: 0, minWidth: '220px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #E0DDD7' }}>
                  Made-to-Order from China
                </div>
                <Link href="/indent/air"
                  onClick={() => setActiveDropdown(null)}
                  style={{ ...dropdownLinkStyle, display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 8px', borderBottom: '1px solid #F0EEED' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FFF8E7'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: '20px' }}>✈️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: '14px' }}>Indent Air</div>
                    <div style={{ fontSize: '11px', color: '#7A7570' }}>Made to order</div>
                  </div>
                </Link>
                <Link href="/indent/sea"
                  onClick={() => setActiveDropdown(null)}
                  style={{ ...dropdownLinkStyle, display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 8px' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: '20px' }}>🚢</span>
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: '14px' }}>Indent Sea</div>
                    <div style={{ fontSize: '11px', color: '#7A7570' }}>Made to order</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* ALL PRODUCTS MEGA DROPDOWN */}
        {activeDropdown === 'products' && (
          <div style={{ position: 'absolute', top: '56px', left: 0, right: 0, background: '#fff', borderTop: `2px solid ${GOLD}`, borderBottom: '1px solid #E0DDD7', boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 200, padding: '28px 40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 40px' }}>
                {Object.entries(ALL_PRODUCTS).map(([cat, subs]) => (
                  <div key={cat} style={{ marginBottom: '20px' }}>
                    <Link href={`/category/${toSlug(cat)}`}
                      onClick={() => setActiveDropdown(null)}
                      style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 700, color: NAVY, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px', borderBottom: `1px solid ${GOLD}`, paddingBottom: '4px' }}>
                      {cat}
                    </Link>
                    {subs.map(sub => (
                      <Link key={sub}
                        href={`/category/${toSlug(cat)}/${toSlug(sub)}`}
                        onClick={() => setActiveDropdown(null)}
                        style={dropdownLinkStyle}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = NAVY; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
                      >{sub}</Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

const navLinkStyle = {
  padding: '0 16px', height: '56px', fontSize: '15px', fontWeight: 500,
  fontFamily: '"DM Sans", sans-serif', color: '#1a1a1a', textDecoration: 'none',
  display: 'flex', alignItems: 'center', borderBottom: '2px solid transparent',
  letterSpacing: '0.3px', whiteSpace: 'nowrap',
};
