import Link from 'next/link';
 
const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
 
export default function Footer() {
  return (
    <footer style={{ background: NAVY, color: '#ffffff', marginTop: 'auto' }}>
 
      {/* SUBSCRIBE BAR */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,.08)', padding: '32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#fff', fontSize: '18px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, marginBottom: '6px' }}>Stay in the loop</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.7)', fontFamily: '"DM Sans", sans-serif' }}>Subscribe for new arrivals, promotions and industry tips.</div>
          </div>
          <div style={{ display: 'flex', gap: '0', flexShrink: 0 }}>
            <input
              type="email"
              placeholder="Enter your email address"
              style={{ padding: '12px 16px', border: 'none', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: '"DM Sans", sans-serif', borderRadius: '8px 0 0 8px', width: '280px' }}
            />
            <button style={{ background: GOLD, color: '#fff', border: 'none', padding: '12px 24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', borderRadius: '0 8px 8px 0' }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
 
      {/* MAIN FOOTER - 4 COLUMNS */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
 
        {/* COL 1 - ABOUT US */}
        <div>
          <div style={{ color: GOLD, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: '"DM Sans", sans-serif' }}>About Us</div>
          {[
            { label: 'About Us', href: '/about' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'Testimonials', href: '/testimonials' },
            { label: 'Google Reviews', href: '/reviews' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'block', fontSize: '13px', color: '#ffffff', textDecoration: 'none', marginBottom: '10px', lineHeight: '1.4', fontFamily: '"DM Sans", sans-serif' }}>
              {item.label}
            </Link>
          ))}
        </div>
 
        {/* COL 2 - SUPPLY CHAIN */}
        <div>
          <div style={{ color: GOLD, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: '"DM Sans", sans-serif' }}>Supply Chain</div>
          {[
            { label: 'Sourcing & Manufacturing', href: '/supply-chain/sourcing' },
            { label: 'Freight & Logistics', href: '/supply-chain/logistics' },
            { label: 'Quality Inspection', href: '/supply-chain/inspection' },
            { label: 'Warehousing & Fulfilment', href: '/supply-chain/warehousing' },
            { label: 'Compliance & Safety', href: '/supply-chain/compliance' },
            { label: 'Get a Sourcing Quote', href: '/supply-chain/quote' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'block', fontSize: '13px', color: '#ffffff', textDecoration: 'none', marginBottom: '10px', lineHeight: '1.4', fontFamily: '"DM Sans", sans-serif' }}>
              {item.label}
            </Link>
          ))}
        </div>
 
        {/* COL 3 - SUPPORT */}
        <div>
          <div style={{ color: GOLD, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: '"DM Sans", sans-serif' }}>Support</div>
          {[
            { label: 'FAQ', href: '/faq' },
            { label: 'Refund & Return', href: '/refund-return' },
            { label: 'Track Your Order', href: '/track-order' },
            { label: 'PMS Colour Match', href: '/resources/pms-chart' },
            { label: 'Decoration Methods', href: '/services/decoration-methods' },
            { label: 'Your Merch Store', href: '/services/merch-store' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'block', fontSize: '13px', color: '#ffffff', textDecoration: 'none', marginBottom: '10px', lineHeight: '1.4', fontFamily: '"DM Sans", sans-serif' }}>
              {item.label}
            </Link>
          ))}
        </div>
 
        {/* COL 4 - RESOURCES */}
        <div>
          <div style={{ color: GOLD, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: '"DM Sans", sans-serif' }}>Resources</div>
          {[
            { label: 'Digital Catalog', href: '/catalog' },
            { label: 'Blog', href: '/blog' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'block', fontSize: '13px', color: '#ffffff', textDecoration: 'none', marginBottom: '10px', lineHeight: '1.4', fontFamily: '"DM Sans", sans-serif' }}>
              {item.label}
            </Link>
          ))}
 
          {/* LOGO IN COL 4 */}
          <div style={{ marginTop: '32px' }}>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: '#fff', letterSpacing: '3px', marginBottom: '10px', fontWeight: 600 }}>
              QUIRKY<span style={{ color: GOLD }}>PROMO</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)', lineHeight: '1.8', margin: '0 0 12px', fontFamily: '"DM Sans", sans-serif' }}>
              Premium promotional products for Australian businesses.
            </p>
            <a href="tel:0294774748" style={{ color: GOLD, textDecoration: 'none', fontSize: '14px', fontWeight: 600, fontFamily: '"DM Mono", monospace' }}>
              📞 02 9477 4748
            </a>
          </div>
        </div>
      </div>
 
      {/* BOTTOM BAR */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
 
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.6)', fontFamily: '"DM Sans", sans-serif' }}>© {new Date().getFullYear()} QuirkyPromo. All rights reserved.</span>
          </div>
 
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' }}>Privacy Policy</Link>
            <span style={{ color: 'rgba(255,255,255,.3)' }}>|</span>
            <Link href="/sales-terms" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' }}>Sales Terms & Conditions</Link>
            <span style={{ color: 'rgba(255,255,255,.3)' }}>|</span>
            <Link href="/website-terms" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' }}>Website Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
 
