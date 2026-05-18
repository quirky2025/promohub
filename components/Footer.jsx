import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#1A1714', color: 'rgba(255,255,255,.6)', marginTop: 'auto' }}>

      {/* MAIN FOOTER */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '40px' }}>

        {/* BRAND */}
        <div>
          <div style={{ fontFamily: 'serif', fontSize: '22px', color: '#fff', letterSpacing: '1px', marginBottom: '12px' }}>
            PROMO<span style={{ color: '#E07050' }}>HUB</span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.8', marginBottom: '16px', color: 'rgba(255,255,255,.5)' }}>
            Premium promotional products for Australian businesses. High-quality branded merchandise delivered Australia-wide.
          </p>
          <a href="tel:0294774748" style={{ color: '#E07050', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            📞 02 9477 4748
          </a>
        </div>

        {/* PRODUCTS */}
        <div>
          <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Products</div>
          {['Bags', 'Drinkware', 'Headwear', 'Pens', 'Technology', 'Leisure'].map(cat => (
            <Link key={cat} href={`/category/${cat.toLowerCase()}`}
              style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,.5)', textDecoration: 'none', marginBottom: '8px' }}>
              {cat}
            </Link>
          ))}
        </div>

        {/* SERVICES */}
        <div>
          <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Services</div>
          {[
            { label: 'Decoration Methods', href: '/services/decoration-methods' },
            { label: 'Sourcing', href: '/services/sourcing' },
            { label: 'Logistics', href: '/services/logistics' },
            { label: 'Warehousing', href: '/services/warehousing' },
            { label: 'Merch Store', href: '/services/merch-store' },
          ].map(s => (
            <Link key={s.href} href={s.href}
              style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,.5)', textDecoration: 'none', marginBottom: '8px' }}>
              {s.label}
            </Link>
          ))}
        </div>

        {/* COMPANY */}
        <div>
          <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Company</div>
          {[
            { label: 'About Us', href: '/about' },
            { label: 'Portfolio', href: '/resources/portfolio' },
            { label: 'Sustainability', href: '/sustainability' },
            { label: 'Contact Us', href: '/contact' },
          ].map(s => (
            <Link key={s.href} href={s.href}
              style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,.5)', textDecoration: 'none', marginBottom: '8px' }}>
              {s.label}
            </Link>
          ))}
        </div>

        {/* RESOURCES */}
        <div>
          <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Resources</div>
          {[
            { label: 'PMS Colour Chart', href: '/resources/pms-chart' },
            { label: 'Best Sellers', href: '/best-sellers' },
            { label: 'New Arrivals', href: '/new-arrivals' },
            { label: 'My Account', href: '/account' },
          ].map(s => (
            <Link key={s.href} href={s.href}
              style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,.5)', textDecoration: 'none', marginBottom: '8px' }}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '16px 32px', maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
        <div style={{ color: 'rgba(255,255,255,.3)' }}>
          © {new Date().getFullYear()} PromoHub. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
