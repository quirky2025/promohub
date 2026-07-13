'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCartCount } from '@/lib/cart';
import { slugify } from '@/lib/slug';
import QuoteModal from '@/components/QuoteModal';
import { gaEvent } from '@/lib/gtag';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

// Category and subcategory labels are displayed alphabetically.
const LABEL_COLLATOR = new Intl.Collator('en-AU', {
  sensitivity: 'base',
  numeric: true,
});

function compareLabels(a = '', b = '') {
  return LABEL_COLLATOR.compare(a, b);
}

const HIDDEN_LEGACY_CATEGORIES = new Set([
  'Business',
  'Print',
  'Personal',
  'Promotion',
  'Promotional',
  'Leisure',
]);

// 后备清单:仅在数据库视图查询失败时使用,正常情况下菜单完全由库内数据驱动
const FALLBACK_PRODUCTS = {
  'Bags': ['Backpacks', 'Cooler Bags', 'Crossbody & Belt Bags', 'Drawstring Bags', 'Dry Bags', 'Duffle Bags', 'Jute Bags', 'Laptop Bags', 'Paper Bags', 'Satchel Bags', 'Toiletry Bags', 'Tote Bags'],
  'Drinkware': ['Ceramic Mugs', 'Coffee Cups', 'Cups & Tumblers', 'Drink Bottles - Glass', 'Drink Bottles - Metal', 'Drink Bottles - Plastic', 'Flasks', 'Glassware', 'Sports Shakers', 'Travel Mugs'],
  'Headwear': ['Beanies', 'Bucket Hats', 'Caps', 'Headwear Accessories', 'Headwear Express', 'Scarves', 'Straw Hats', 'Wide Brims'],
  'Pens': ['Bamboo', 'Deluxe', 'Metal', 'Novelty', 'Paper', 'Plastic', 'Stylus', 'Wood'],
};

const FLAT_NAV_OVERRIDES = {
  'Apparel': {
    href: '/custom-branded-apparel-australia',
    subcategories: [
      { label: 'T-Shirts', href: '/custom-t-shirts-australia' },
      { label: 'Polo Shirts', href: '/custom-polo-shirts-australia' },
      { label: 'Hoodies', href: '/custom-hoodies-australia' },
      { label: 'Sweatshirts', href: '/custom-sweatshirts-australia' },
      { label: 'Jackets', href: '/custom-jackets-australia' },
      { label: 'Shirts', href: '/custom-shirts-australia' },
      { label: 'Vests', href: '/custom-vests-australia' },
      { label: 'Pants & Shorts', href: '/workwear-pants-and-shorts-australia' },
      { label: 'Workwear', href: '/branded-workwear-australia' },
      { label: 'Teamwear', href: '/custom-teamwear-australia' },
      { label: 'Aprons', href: '/custom-aprons-australia' },
      { label: 'Socks', href: '/custom-socks-australia' },
      { label: 'Scarves & Gloves', href: '/branded-scarves-and-accessories-australia' },
      { label: 'Apparel Accessories', href: '/branded-apparel-accessories-australia' },
    ],
  },
  'Bags': {
    href: '/custom-bags-australia',
    subcategories: [
      { label: 'Tote Bags', href: '/custom-tote-bags-australia' },
      { label: 'Cotton Tote Bags', href: '/custom-cotton-tote-bags-australia' },
      { label: 'Cooler Bags', href: '/custom-cooler-bags-australia' },
      { label: 'Backpacks', href: '/custom-backpacks-australia' },
      { label: 'Paper Bags', href: '/custom-paper-bags-australia' },
      { label: 'Drawstring Bags', href: '/custom-drawstring-bags-australia' },
      { label: 'Travel & Duffle Bags', href: '/custom-duffle-bags-australia' },
      { label: 'Toiletry Bags', href: '/custom-toiletry-bags-australia' },
      { label: 'Jute Bags', href: '/jute-bags-australia' },
      { label: 'Laptop Bags', href: '/custom-laptop-bags-australia' },
      { label: 'Wine Carriers', href: '/wine-carriers-australia' },
      { label: 'Crossbody & Belt Bags', href: '/crossbody-bags-australia' },
      { label: 'Satchel Bags', href: '/satchel-bags-australia' },
      { label: 'Dry Bags', href: '/dry-bags-australia' },
    ],
  },
  'Travel': {
    href: '/branded-travel-accessories-australia',
    subcategories: [
      { label: 'Luggage Tags', href: '/custom-luggage-tags-australia' },
      { label: 'Passport Holders', href: '/passport-holders-australia' },
      { label: 'Travel Wallets', href: '/travel-wallets-australia' },
      { label: 'Travel Pillows & Comfort', href: '/travel-pillows-australia' },
      { label: 'Travel Accessories', href: '/travel-accessories-australia' },
    ],
  },
  'Drinkware': {
    href: '/custom-drinkware-australia',
    subcategories: [
      { label: 'Drink Bottles', href: '/custom-drink-bottles-australia' },
      { label: 'Coffee Cups', href: '/custom-coffee-cups-australia' },
      { label: 'Travel Mugs', href: '/custom-travel-mugs-australia' },
      { label: 'Tumblers', href: '/custom-tumblers-australia' },
      { label: 'Mugs', href: '/custom-mugs-australia' },
      { label: 'Glassware', href: '/branded-glassware-australia' },
      { label: 'Flasks', href: '/custom-flasks-australia' },
      { label: 'Teaware', href: '/custom-teaware-australia' },
    ],
  },
  'Barware & Accessories': {
    href: '/branded-barware-australia',
    subcategories: [
      { label: 'Coasters', href: '/custom-coasters-australia' },
      { label: 'Bottle Openers', href: '/custom-bottle-openers-australia' },
      { label: 'Stubby Holders', href: '/custom-stubby-holders-australia' },
      { label: 'Bar Mats', href: '/custom-bar-mats-australia' },
      { label: 'Wine Accessories', href: '/branded-wine-accessories-australia' },
      { label: 'Bar Accessories', href: '/bar-accessories-australia' },
    ],
  },
  'Flags & Displays': {
    href: '/trade-show-displays-australia',
    subcategories: [
      { label: 'A-Frames & Signage', href: '/a-frame-signage-australia' },
      { label: 'Feather & Teardrop Flags', href: '/custom-feather-flags-australia' },
      { label: 'Marquees', href: '/custom-marquees-australia' },
      { label: 'Media Walls', href: '/media-walls-australia' },
      { label: 'Pull Up Banners', href: '/pull-up-banners-australia' },
      { label: 'Table Covers', href: '/custom-table-covers-australia' },
    ],
  },
  'Giveaways & Event Accessories': {
    href: '/promotional-giveaways-australia',
    subcategories: [
      { label: 'Badges', href: '/custom-badges-australia' },
      { label: 'Balloons', href: '/custom-balloons-australia' },
      { label: 'ID Holders', href: '/id-card-holders-australia' },
      { label: 'Lanyards', href: '/custom-lanyards-australia' },
      { label: 'Magnets', href: '/custom-fridge-magnets-australia' },
      { label: 'Novelty Giveaways', href: '/novelty-giveaways-australia' },
      { label: 'Stickers & Patches', href: '/promotional-stickers-and-patches-australia' },
      { label: 'Temporary Tattoos', href: '/temporary-tattoos-australia' },
      { label: 'Wristbands', href: '/custom-wristbands-australia' },
    ],
  },
  'Headwear': {
    href: '/custom-headwear-australia',
    subcategories: [
      { label: 'Caps', href: '/custom-caps-australia' },
      { label: 'Beanies', href: '/custom-beanies-australia' },
      { label: 'Bucket Hats', href: '/custom-bucket-hats-australia' },
      { label: 'Wide Brim Hats', href: '/custom-wide-brim-hats-australia' },
      { label: 'Straw Hats', href: '/straw-hats-australia' },
      { label: 'Visors', href: '/custom-visors-australia' },
      { label: 'Novelty Headwear', href: '/novelty-headwear-australia' },
    ],
  },
  'Pens': {
    href: '/branded-pens-australia',
    subcategories: [
      { label: 'Ballpoint Pens', href: '/custom-ballpoint-pens-australia' },
      { label: 'Metal Pens', href: '/custom-metal-pens-australia' },
      { label: 'Plastic Pens', href: '/custom-plastic-pens-australia' },
      { label: 'Stylus Pens', href: '/custom-stylus-pens-australia' },
      { label: 'Highlighters', href: '/custom-highlighters-australia' },
      { label: 'Eco Pens', href: '/eco-pens-australia' },
      { label: 'Pencils', href: '/custom-pencils-australia' },
      { label: 'Pen Presentation', href: '/pen-presentation-australia' },
      { label: 'Pen Gift Sets', href: '/pen-gift-sets-australia' },
    ],
  },
  'Technology': {
    href: '/corporate-tech-gifts-australia',
    subcategories: [
      { label: 'Power Banks', href: '/custom-power-banks-australia' },
      { label: 'Bluetooth Speakers', href: '/custom-bluetooth-speakers-australia' },
      { label: 'Earbuds & Headphones', href: '/custom-earbuds-australia' },
      { label: 'Charging Cables & Chargers', href: '/custom-charging-cables-australia' },
      { label: 'Wireless Chargers', href: '/wireless-chargers-australia' },
      { label: 'Phone Accessories', href: '/custom-phone-accessories-australia' },
      { label: 'USB Flash Drives', href: '/custom-usb-drives-australia' },
      { label: 'Tech Accessories', href: '/tech-accessories-australia' },
    ],
  },
  'Tools & Auto': {
    href: '/branded-tools-and-car-accessories-australia',
    subcategories: [
      { label: 'Multi-Tools', href: '/custom-multi-tools-australia' },
      { label: 'Tape Measures', href: '/custom-tape-measures-australia' },
      { label: 'Torches & Lights', href: '/custom-torches-australia' },
      { label: 'Tool Sets & Screwdrivers', href: '/tool-sets-australia' },
      { label: 'Car Accessories', href: '/car-accessories-australia' },
    ],
  },
  'Office & Desk': {
    href: '/branded-office-supplies-australia',
    subcategories: [
      { label: 'Notebooks', href: '/branded-notebooks-australia' },
      { label: 'Note Pads', href: '/custom-note-pads-australia' },
      { label: 'Pads & Planners', href: '/custom-planners-australia' },
      { label: 'Sticky Notes', href: '/custom-sticky-notes-australia' },
      { label: 'Stationery', href: '/custom-stationery-australia' },
      { label: 'Desk Items', href: '/desk-accessories-australia' },
      { label: 'Portfolios & Compendiums', href: '/custom-compendiums-australia' },
      { label: 'Pencil Cases', href: '/custom-pencil-cases-australia' },
      { label: 'Rulers', href: '/custom-rulers-australia' },
    ],
  },
  'Packaging': {
    href: '/custom-packaging-australia',
    subcategories: [
      { label: 'Gift Boxes', href: '/custom-gift-boxes-australia' },
      { label: 'Gift Bags', href: '/custom-gift-bags-australia' },
      { label: 'Gift Tubes', href: '/gift-tubes-australia' },
      { label: 'Pouches', href: '/custom-pouches-australia' },
      { label: 'Tissue & Wrapping', href: '/custom-tissue-paper-australia' },
      { label: 'Ribbons & Gift Tags', href: '/ribbons-and-gift-tags-australia' },
      { label: 'Greeting & Gift Cards', href: '/greeting-cards-australia' },
    ],
  },
  'Home & Living': {
    href: '/branded-homewares-australia',
    subcategories: [
      { label: 'Kitchen & Dining', href: '/custom-kitchenware-australia' },
      { label: 'Cheese & Serving Boards', href: '/cheese-boards-australia' },
      { label: 'Home Decor', href: '/promotional-home-decor-australia' },
      { label: 'Candles & Diffusers', href: '/candles-and-diffusers-australia' },
    ],
  },
  'Outdoor & Sports': {
    href: '/outdoor-promotional-products-australia',
    subcategories: [
      { label: 'Sports Products', href: '/promotional-sports-products-australia' },
      { label: 'Golf Products', href: '/custom-golf-products-australia' },
      { label: 'Umbrellas', href: '/custom-umbrellas-australia' },
      { label: 'Towels', href: '/custom-towels-australia' },
      { label: 'Camping & Outdoors', href: '/camping-gear-australia' },
      { label: 'Picnic & BBQ', href: '/picnic-and-bbq-australia' },
      { label: 'Sunglasses', href: '/custom-sunglasses-australia' },
      { label: 'Blankets', href: '/picnic-blankets-australia' },
      { label: 'Supporter Gear', href: '/custom-supporter-gear-australia' },
    ],
  },
  'Personal Care': {
    href: '/branded-personal-care-products-australia',
    subcategories: [
      { label: 'Lip Balms', href: '/custom-lip-balm-australia' },
      { label: 'Hand Sanitiser', href: '/custom-hand-sanitiser-australia' },
      { label: 'Face Masks', href: '/custom-face-masks-australia' },
      { label: 'Sunscreen & Lotions', href: '/sunscreen-australia' },
      { label: 'First Aid', href: '/first-aid-kits-australia' },
      { label: 'Manicure Sets', href: '/manicure-sets-australia' },
      { label: 'Mirrors & Beauty Accessories', href: '/compact-mirrors-australia' },
      { label: 'Bath & Body', href: '/bath-and-body-gifts-australia' },
      { label: 'Grooming', href: '/grooming-products-australia' },
    ],
  },
  'Marketing Materials': {
    href: '/printed-marketing-materials-australia',
    subcategories: [
      { label: 'Business Cards', href: '/business-cards-australia' },
      { label: 'Labels & Stickers', href: '/custom-stickers-australia' },
      { label: 'Resin Labels', href: '/resin-labels-australia' },
    ],
  },
  'Key Rings': {
    href: '/custom-keyrings-australia',
    subcategories: [
      { label: 'Metal Keyrings', href: '/custom-metal-keyrings-australia' },
      { label: 'Leather Keyrings', href: '/leather-keyrings-australia' },
      { label: 'Silicone & PVC Keyrings', href: '/silicone-keyrings-australia' },
      { label: 'Eco Keyrings', href: '/eco-keyrings-australia' },
      { label: 'Functional Keyrings', href: '/functional-keyrings-australia' },
      { label: 'Novelty Keyrings', href: '/novelty-keyrings-australia' },
    ],
  },
  'Pet': {
    href: '/branded-pet-products-australia',
    subcategories: [
      { label: 'Pet Accessories', href: '/custom-pet-accessories-australia' },
    ],
  },
  'Toys & Games': {
    href: '/promotional-toys-and-games-australia',
    subcategories: [
      { label: 'Colouring & Kids Sets', href: '/colouring-sets-australia' },
      { label: 'Games & Puzzles', href: '/custom-games-and-puzzles-australia' },
      { label: 'Novelty Toys', href: '/novelty-toys-australia' },
      { label: 'Outdoor Toys', href: '/outdoor-toys-australia' },
      { label: 'Plush Toys', href: '/custom-plush-toys-australia' },
      { label: 'Stress Balls & Toys', href: '/custom-stress-balls-australia' },
      { label: 'Wooden Toys & Models', href: '/wooden-toys-and-models-australia' },
    ],
  },
};

const CROSS_CATEGORY_HOME = {
  'Note Pads': 'Office & Desk',
  'Promotional': 'Promotion',
  'Personal Care': 'Personal Care',
  'Travel': 'Leisure',
  'Drinkware Presentation': 'Drinkware',
};

const COLLECTIONS = [
  'Children', 'Corporate & Business', 'Food & Beverage', 'Fundraising',
  'Gifts & Promotions', 'Health & Beauty', 'Natural', 'Price Buster',
  'Sports & Fitness', 'Summer', 'Tradeshow & Events', 'Travel & Outdoor',
];

const BRANDS = [
  'ARCHER', 'BRANDCRAFT', 'CamelBak', 'Frontier', 'Keepsake', 'Luigi Bormioli',
  'Moleskine', 'NATURA', 'Ocean Bottle', 'Osprey', 'Pierre Cardin',
  'SPICE', 'Swiss Peak', 'XD Design',
];

// 仅 Collections / Brands 仍用旧式转换(它们的页面按 -and- 往返,且无 " - " 名称,不受本次 bug 影响)
function legacySlug(name) {
  return name.toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/&/g, 'and')
    .replace(/ /g, '-');
}

function applyFlatNavOverrides(productsMap) {
  const merged = { ...productsMap };
  Object.entries(FLAT_NAV_OVERRIDES).forEach(([category, config]) => {
    merged[category] = [...config.subcategories]
      .sort((a, b) => compareLabels(a.label, b.label))
      .map((item) => item.label);
  });
  return Object.fromEntries(
    Object.entries(merged).sort(([a], [b]) => compareLabels(a, b))
  );
}

function categoryHref(category) {
  return FLAT_NAV_OVERRIDES[category]?.href || `/category/${slugify(category)}`;
}

function subcategoryHref(category, subcategory) {
  const override = FLAT_NAV_OVERRIDES[category]?.subcategories.find(
    (item) => item.label === subcategory
  );
  return override?.href || `/category/${slugify(category)}/${slugify(subcategory)}`;
}

const dropdownLinkStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '16px',
  fontWeight: 600,
  color: '#111',
  textDecoration: 'none',
  display: 'block',
  padding: '5px 8px',
  borderRadius: '4px',
  transition: 'background .15s, color .15s',
};

const desktopDropdownItemStyle = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '15px',
  fontWeight: 700,
  color: NAVY,
  textDecoration: 'none',
  display: 'block',
  padding: '12px 16px',
  borderBottom: '1px solid #E0DDD7',
  transition: 'background .15s, color .15s',
};
const desktopDropdownSubItemStyle = {
  ...desktopDropdownItemStyle,
  fontWeight: 400,
};

export default function Nav() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);      // 移动端抽屉开关
  const [mobileCat, setMobileCat] = useState(null);          // 抽屉里展开的类目
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [navProducts, setNavProducts] = useState(FALLBACK_PRODUCTS);
  const visibleNavProducts = applyFlatNavOverrides(navProducts);
  const visibleCategoryNames = Object.keys(visibleNavProducts);
  const router = useRouter();
  const navRef = useRef(null);

  // 动态拉取已发布产品的 category/subcategory,菜单与库内永远同步
  useEffect(() => {
    async function fetchNav() {
      const { data, error } = await supabase
        .from('nav_subcategories')
        .select('category, subcategory');
      if (error || !data || data.length === 0) return; // 失败时保留后备清单
      const map = {};
      data.forEach(({ category, subcategory }) => {
        if (!category || !String(category).trim()) return;
        if (HIDDEN_LEGACY_CATEGORIES.has(category)) return;
        const homeCategory = CROSS_CATEGORY_HOME[subcategory];
        if (homeCategory && homeCategory !== category) return;
        if (!subcategory || !String(subcategory).trim()) return;
        if (!map[category]) map[category] = new Set();
        map[category].add(subcategory);
      });
      const ordered = {};
      const cats = Object.keys(map).sort(compareLabels);
      cats.forEach(cat => {
        ordered[cat] = [...map[cat]].sort(compareLabels);
      });
      setNavProducts(ordered);
    }
    fetchNav();
  }, []);

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
    function onCartUpdate() { setCartCount(getCartCount()); }
    const cartTimer = window.setTimeout(onCartUpdate, 0);
    window.addEventListener('cart-updated', onCartUpdate);
    return () => {
      window.clearTimeout(cartTimer);
      subscription.unsubscribe();
      window.removeEventListener('cart-updated', onCartUpdate);
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  // 抽屉打开时锁住背景滚动;关闭恢复
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function go(href) {
    setMobileOpen(false);
    setActiveDropdown(null);
    router.push(href);
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
        <div className="qp-topbar" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', height: '128px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
          {/* 汉堡按钮 — 仅手机显示 */}
          <button
            className="qp-hamburger"
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', flexShrink: 0 }}
          >
            <span style={{ display: 'block', width: '26px', height: '2px', background: '#fff', margin: '5px 0', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '26px', height: '2px', background: '#fff', margin: '5px 0', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '26px', height: '2px', background: '#fff', margin: '5px 0', borderRadius: '2px' }} />
          </button>

          <Link href="/" onClick={() => setActiveDropdown(null)} className="qp-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/quirky-logo-quote.png" alt="QuirkyPromo" style={{ height: '42px', width: 'auto', display: 'block' }} />
          </Link>
          <div className="qp-search" style={{ flex: 1, maxWidth: '640px', position: 'relative' }}>
            <input type="text" placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              style={{ width: '100%', padding: '16px 52px 16px 22px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: '15px', outline: 'none', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box' }} />
            <span onClick={handleSearchClick} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.6)', fontSize: '20px', cursor: 'pointer' }}>🔍</span>
          </div>
          <div className="qp-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '32px', flexShrink: 0 }}>
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
              <><Link href="/account/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 500 }}>👤 <span>Sign In</span></Link><Link href="/account/register" style={{ color: 'rgba(255,255,255,.85)', textDecoration: 'none', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>Register</Link></>
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

      {/* 移动端搜索条 — 仅手机显示,在深蓝栏下方 */}
      <div className="qp-mobile-search" style={{ display: 'none', background: NAVY, padding: '0 16px 14px' }}>
        <div style={{ position: 'relative' }}>
          <input type="text" placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: '15px', outline: 'none', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box' }} />
          <span onClick={handleSearchClick} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.6)', fontSize: '18px', cursor: 'pointer' }}>🔍</span>
        </div>
      </div>

      {/* NAV BAR */}
      <nav ref={navRef} style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <div className="qp-desktop-menu" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', height: '56px', gap: '4px' }}>

          {/* ALL PRODUCTS - Click */}
          <button onClick={() => toggleDropdown('products')}
            style={{ padding: '0 16px', height: '56px', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: activeDropdown === 'products' ? NAVY : '#000', cursor: 'pointer', borderBottom: activeDropdown === 'products' ? `2px solid ${GOLD}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
            All Products <span style={{ fontSize: '11px', color: activeDropdown === 'products' ? GOLD : '#000' }}>▾</span>
          </button>

          {/* COLLECTIONS - Click */}
          <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => toggleDropdown('collections')}
              style={{ padding: '0 16px', height: '56px', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: activeDropdown === 'collections' ? NAVY : '#000', cursor: 'pointer', borderBottom: activeDropdown === 'collections' ? `2px solid ${GOLD}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
              Collections <span style={{ fontSize: '11px', color: activeDropdown === 'collections' ? GOLD : '#000' }}>▾</span>
            </button>
            {activeDropdown === 'collections' && (
              <div style={{ ...dropPanel, left: 0, minWidth: '320px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
                  {COLLECTIONS.map(col => (
                    <Link key={col}
                      href={`/collections/${legacySlug(col)}`}
                      onClick={() => setActiveDropdown(null)}
                      style={{ ...desktopDropdownItemStyle, whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = NAVY; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY; }}
                    >{col}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BRANDS - Click */}
          <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => toggleDropdown('brands')}
              style={{ padding: '0 16px', height: '56px', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: activeDropdown === 'brands' ? NAVY : '#000', cursor: 'pointer', borderBottom: activeDropdown === 'brands' ? `2px solid ${GOLD}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
              Brands <span style={{ fontSize: '11px', color: activeDropdown === 'brands' ? GOLD : '#000' }}>▾</span>
            </button>
            {activeDropdown === 'brands' && (
              <div style={{ ...dropPanel, left: 0, minWidth: '260px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
                  {BRANDS.map(brand => (
                    <Link key={brand}
                      href={`/brands/${legacySlug(brand)}`}
                      onClick={() => setActiveDropdown(null)}
                      style={{ ...desktopDropdownItemStyle }}
                      onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = NAVY; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY; }}
                    >{brand}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/sustainability" onClick={() => setActiveDropdown(null)} style={{ ...navLinkStyle, color: '#2D6A4F', fontWeight: 600 }}>🌿 Eco</Link>
          <Link href="/new-arrivals" onClick={() => setActiveDropdown(null)} style={navLinkStyle}>New Arrivals</Link>
          <Link href="/sale" onClick={() => setActiveDropdown(null)} style={{ ...navLinkStyle, color: '#C0392B', fontWeight: 600 }}>Sale</Link>
          <Link href="/australian-made-promotional-products-australia" onClick={() => setActiveDropdown(null)} style={navLinkStyle}>Australian Made</Link>

          {/* INDENT - Click */}
          <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => toggleDropdown('indent')}
              style={{ padding: '0 16px', height: '56px', background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: activeDropdown === 'indent' ? NAVY : '#000', cursor: 'pointer', borderBottom: activeDropdown === 'indent' ? `2px solid ${GOLD}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
              Indent <span style={{ fontSize: '11px', color: activeDropdown === 'indent' ? GOLD : '#000' }}>▾</span>
            </button>
            {activeDropdown === 'indent' && (
              <div style={{ ...dropPanel, left: 0, minWidth: '220px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #E0DDD7' }}>
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
                    <div style={{ fontSize: '11px', color: '#000' }}>Made to order</div>
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
                    <div style={{ fontSize: '11px', color: '#000' }}>Made to order</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* GET A QUOTE - 金色按钮,右端,打开弹窗 */}
          <button onClick={() => { gaEvent('quote_click', { source_location: 'nav' }); setActiveDropdown(null); setQuoteOpen(true); }}
            style={{ marginLeft: 'auto', background: GOLD, color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', letterSpacing: '0.5px', whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(201,169,110,.35)' }}>
            Get a Quote
          </button>

        </div>

        {/* ALL PRODUCTS MEGA DROPDOWN — 子类来自数据库,只显示已发布有货的 */}
       {activeDropdown === 'products' && (() => {
          const cats = visibleCategoryNames;
          const current = activeCat && visibleNavProducts[activeCat] ? activeCat : cats[0];
          return (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderTop: `2px solid ${GOLD}`, borderBottom: '1px solid #E0DDD7', boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 200 }}>
              <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'stretch' }}>

              {/* 左栏:类目列表 */}
                <div style={{ width: '260px', flexShrink: 0, borderRight: '1px solid #E0DDD7', padding: '12px 0', background: '#FAFAF8', overflowY: 'visible' }}>
                  {cats.map(cat => (
                    <div key={cat}
                      onMouseEnter={() => setActiveCat(cat)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '15px', fontWeight: 700, color: NAVY, background: current === cat ? GOLD : 'transparent', borderLeft: current === cat ? `3px solid ${NAVY}` : '3px solid transparent', borderBottom: '1px solid #E0DDD7', transition: 'all .12s' }}>
                      <Link href={categoryHref(cat)} onClick={() => setActiveDropdown(null)}
                        style={{ color: 'inherit', textDecoration: 'none', flex: 1 }}>{cat}</Link>
                      <span style={{ color: current === cat ? NAVY : GOLD, fontSize: '12px' }}>›</span>
                    </div>
                  ))}
                </div>

                {/* 右栏:当前类目的子类 */}
                <div style={{ flex: 1, padding: '24px 36px', overflowY: 'visible' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `1px solid ${GOLD}`, paddingBottom: '8px', marginBottom: '16px' }}>
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '1px' }}>{current}</span>
                    <Link href={categoryHref(current)} onClick={() => setActiveDropdown(null)}
                      style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: GOLD, textDecoration: 'none', fontWeight: 600 }}>
                      View all {current} →
                    </Link>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px 32px' }}>
                    {(visibleNavProducts[current] || []).map(sub => (
                      <Link key={sub}
                        href={subcategoryHref(current, sub)}
                        onClick={() => setActiveDropdown(null)}
                        style={{ ...desktopDropdownSubItemStyle, borderRadius: '0' }}
                        onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = NAVY; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY; }}
                      >{sub}</Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          );
        })()}
        </nav>
      {/* ===== 移动端抽屉菜单 ===== */}
      {mobileOpen && (
        <div className="qp-drawer-overlay" onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: '#fff', boxShadow: '-8px 0 30px rgba(0,0,0,.25)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

            {/* 抽屉头部 */}
            <div style={{ background: NAVY, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 2 }}>
              <img src="/quirky-logo-quote.png" alt="QuirkyPromo" style={{ height: '38px', width: 'auto', display: 'block' }} />
              <button onClick={() => setMobileOpen(false)} aria-label="Close"
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>×</button>
            </div>

            {/* 顶部:搜索 + 账户 + 购物车 */}
            <div style={{ padding: '14px 20px 4px' }}>
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <input type="text" placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setMobileOpen(false); handleSearch(e); } }}
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '8px', border: '1px solid #D8D2C6', background: '#ffffff', color: '#000', fontSize: '15px', outline: 'none', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box' }} />
                <span onClick={() => { setMobileOpen(false); handleSearchClick(); }} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9A958C', fontSize: '17px', cursor: 'pointer' }}>🔍</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {user ? (
                  <button onClick={() => go('/account')} style={mAccountBtn}>👤 {user.user_metadata?.name?.split(' ')[0] || 'Account'}</button>
                ) : (
                  <><button onClick={() => go('/account/login')} style={mAccountBtn}>👤 Sign In</button><button onClick={() => go('/account/register')} style={mAccountBtn}>Register</button></>
                )}
                <button onClick={() => go('/cart')} style={mAccountBtn}>🛒 Cart{cartCount > 0 ? ` (${cartCount})` : ''}</button>
              </div>
            </div>

            <div style={{ padding: '4px 0 28px' }}>
              {/* GET A QUOTE — 置顶 */}
              <div style={{ padding: '10px 20px 14px' }}>
                <button onClick={() => { gaEvent('quote_click', { source_location: 'nav' }); setMobileOpen(false); setQuoteOpen(true); }}
                  style={{ width: '100%', background: GOLD, color: '#fff', border: 'none', padding: '13px 0', borderRadius: '8px', fontSize: '15px', fontWeight: 700, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', letterSpacing: '0.5px' }}>
                  GET A QUOTE
                </button>
              </div>

              {/* Shop by Categories */}
              <div style={mSection}>Shop by Categories</div>
              {visibleCategoryNames.map(cat => (
                <div key={cat}>
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    <button onClick={() => go(categoryHref(cat))}
                      style={{ ...mItem, flex: 1, width: 'auto', borderBottom: 'none', paddingLeft: '20px' }}>{cat}</button>
                    <button onClick={() => setMobileCat(mobileCat === cat ? null : cat)}
                      aria-label="Expand"
                      style={{ width: '52px', background: 'none', border: 'none', color: '#000', fontSize: '13px', cursor: 'pointer' }}>
                      {mobileCat === cat ? '⌄' : '›'}
                    </button>
                  </div>
                  {mobileCat === cat && (
                    <div style={{ paddingBottom: '6px' }}>
                      {(visibleNavProducts[cat] || []).map(sub => (
                        <button key={sub} onClick={() => go(subcategoryHref(cat, sub))}
                          style={mSub}>{sub}</button>
                      ))}
                    </div>
                  )}
                  <div style={mLine} />
                </div>
              ))}

              {/* Shop by Collections */}
              <div style={mSection}>Shop by Collections</div>
              {COLLECTIONS.map(col => (
                <button key={col} onClick={() => go(`/collections/${legacySlug(col)}`)} style={mItem}>{col}</button>
              ))}

              {/* Shop by Brands */}
              <div style={mSection}>Shop by Brands</div>
              {BRANDS.map(brand => (
                <button key={brand} onClick={() => go(`/brands/${legacySlug(brand)}`)} style={mItem}>{brand}</button>
              ))}

              {/* Trending */}
              <div style={mSection}>Trending</div>
              <button onClick={() => go('/sustainability')} style={{ ...mItem, color: '#2D6A4F' }}>🌿 Eco</button>
              <button onClick={() => go('/new-arrivals')} style={mItem}>New Arrivals</button>
              <button onClick={() => go('/sale')} style={{ ...mItem, color: '#C0392B' }}>Sale</button>
              <button onClick={() => go('/australian-made-promotional-products-australia')} style={mItem}>Australian Made</button>

              {/* Made to Order */}
              <div style={mSection}>Made to Order</div>
              <button onClick={() => go('/indent/air')} style={mItem}>✈️ Indent Air</button>
              <button onClick={() => go('/indent/sea')} style={mItem}>🚢 Indent Sea</button>

              {/* 底部:电话 */}
              <a href="tel:0294774748" style={{ ...mItem, display: 'block', textDecoration: 'none', marginTop: '12px', color: NAVY, fontWeight: 600 }}>📞 02 9477 4748</a>
            </div>
          </div>
        </div>
      )}

      {/* GET A QUOTE 弹窗 */}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} source="nav" />
    </div>
  );
}

const navLinkStyle = {
  padding: '0 16px', height: '56px', fontSize: '15px', fontWeight: 500,
  fontFamily: '"DM Sans", sans-serif', color: '#000', textDecoration: 'none',
  display: 'flex', alignItems: 'center', borderBottom: '2px solid transparent',
  letterSpacing: '0.3px', whiteSpace: 'nowrap',
};

// 移动端抽屉样式(无底色,靠字重+留白分层,参考清爽风格)
const mSection = {
  padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: '#fff',
  fontFamily: '"DM Sans", sans-serif', letterSpacing: '1.2px', textTransform: 'uppercase',
  background: NAVY, marginTop: '6px',
};
const mItem = {
  width: '100%', textAlign: 'left', background: 'none', border: 'none',
  borderBottom: '1px solid #F2F0ED', padding: '13px 20px', fontSize: '15px',
  fontWeight: 400, color: '#2b2b2b', fontFamily: '"DM Sans", sans-serif',
  cursor: 'pointer', letterSpacing: '0.2px',
};
const mSub = {
  width: '100%', textAlign: 'left', background: 'none', border: 'none',
  padding: '8px 20px 8px 34px', fontSize: '14px', fontWeight: 300, color: '#6b6a64',
  fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
};
const mLine = { borderBottom: '1px solid #F2F0ED' };
const mAccountBtn = {
  flex: 1, textAlign: 'center', background: '#ffffff', border: '1px solid #E6E1D8',
  borderRadius: '8px', padding: '11px 0', fontSize: '14px', fontWeight: 600,
  color: NAVY, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
};
