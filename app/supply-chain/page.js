'use client';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const MODULES = [
  {
    icon: '🏭',
    title: 'Sourcing & Manufacturing',
    desc: 'Direct factory relationships across Asia. We source high-quality promotional products and manage production to your specifications — cutting out the middleman.',
    href: '/supply-chain/sourcing',
    stats: [{ label: 'Factory Partners', value: '200+' }, { label: 'Quote Turnaround', value: '24–48hrs' }],
    cta: 'Learn More →',
  },
  {
    icon: '✈️',
    title: 'Freight & Logistics',
    desc: 'Express, Air and Sea freight options with access to preferential rates through our first-tier freight partnerships. Save up to 50% versus standard international freight.',
    href: '/supply-chain/logistics',
    stats: [{ label: 'Freight Saving', value: 'Up to 50%' }, { label: 'Options', value: 'Express · Air · Sea' }],
    cta: 'Learn More →',
  },
  {
    icon: '🔍',
    title: 'Quality Inspection',
    desc: 'Independent third-party inspection at the factory before every shipment. Catch issues before goods leave — not after a 45-day sea freight journey.',
    href: '/supply-chain/inspection',
    stats: [{ label: 'Inspector', value: 'Independent' }, { label: 'Report', value: 'Within 24hrs' }],
    cta: 'Learn More →',
  },
  {
    icon: '📦',
    title: 'Warehousing & Fulfilment',
    desc: 'Flexible third-party warehousing solutions for bulk stock holding, pick-and-pack, and multi-location distribution across Australia.',
    href: '/supply-chain/warehousing',
    stats: [{ label: 'Delivery', value: 'Nationwide' }, { label: 'Turnaround', value: 'Same day' }],
    cta: 'Learn More →',
  },
  {
    icon: '🛡️',
    title: 'Compliance & Safety',
    desc: 'All products meet Australian safety standards. Full compliance documentation — ACCC, REACH, AS/NZS — available on request for government, education, and enterprise clients.',
    href: '/supply-chain/compliance',
    stats: [{ label: 'Standards', value: 'ACCC · REACH' }, { label: 'Docs', value: 'On Request' }],
    cta: 'Learn More →',
  },
  {
    icon: '⚙️',
    title: 'Made to Order',
    desc: 'Fully custom merchandise built from scratch to your exact specifications — colour, material, shape, and packaging. No off-the-shelf limitations. MOQ varies by product.',
    href: '/contact',
    stats: [{ label: 'Customisation', value: 'Full' }, { label: 'MOQ', value: 'Varies' }],
    cta: 'Contact Us to Discuss →',
  },
];

const STEPS = [
  { num: '01', title: 'Factory Sourcing', desc: 'We identify and vet the right factory for your product requirements.' },
  { num: '02', title: 'Compliance Check', desc: 'Products are verified against Australian safety and import standards.' },
  { num: '03', title: 'Production', desc: 'Manufacturing begins after artwork approval and quality benchmarks are set.' },
  { num: '04', title: 'Quality Inspection', desc: 'Independent third-party inspection ensures every order meets specification.' },
  { num: '05', title: 'Freight & Customs', desc: 'We manage international freight and Australian customs clearance.' },
  { num: '06', title: 'Delivery', desc: 'Your branded products are delivered to your door or our warehouse.' },
];

export default function SupplyChainPage() {
  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: BG, color: '#1a1a1a' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Supply Chain</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '64px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>
              End-to-End Supply Chain
            </div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 600, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
              Your Complete Branded Merchandise Supply Chain
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8, margin: '0 0 32px' }}>
              From factory floor to your front door — QuirkyPromo manages every step of the supply chain. Direct factory access, preferential freight rates, independent quality inspection, compliant products, and flexible fulfilment.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
                Talk to Our Team →
              </Link>
              <Link href="/category/bags" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
                Browse Products
              </Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { value: 'Up to 50%', label: 'Freight Cost Savings' },
              { value: '200+', label: 'Factory Partners' },
              { value: '24–48hrs', label: 'Quote Turnaround' },
              { value: 'ACCC', label: 'Compliant Products' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.07)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,.1)' }}>
                <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: GOLD, fontWeight: 600, marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* END-TO-END PROCESS */}
      <div style={{ background: '#fff', padding: '64px 40px', borderBottom: '1px solid #E0DDD7' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: NAVY, margin: '0 0 12px', fontWeight: 600 }}>
              How It Works
            </h2>
            <p style={{ fontSize: '15px', color: '#7A7570', margin: 0 }}>Our end-to-end process — from factory to your door</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 12px', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: '28px', right: '-8px', color: GOLD, fontSize: '20px', zIndex: 1 }}>›</div>
                )}
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: NAVY, color: GOLD, fontFamily: '"DM Mono", monospace', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{s.num}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: '#7A7570', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODULE CARDS */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: NAVY, margin: '0 0 12px', fontWeight: 600 }}>
            Our Supply Chain Capabilities
          </h2>
          <p style={{ fontSize: '15px', color: '#7A7570', margin: 0 }}>Six integrated services — use one or all of them</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {MODULES.map(m => (
            <Link key={m.href + m.title} href={m.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E0DDD7', height: '100%', transition: 'box-shadow .2s, transform .2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '36px' }}>{m.icon}</div>
                <div>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>{m.title}</h3>
                  <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #F0EEED', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {m.stats.map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: GOLD, fontFamily: '"DM Mono", monospace' }}>{s.value}</div>
                        <div style={{ fontSize: '11px', color: '#7A7570' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ color: GOLD, fontSize: '18px', flexShrink: 0 }}>→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* WHO WE WORK WITH */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: NAVY, margin: '0 0 12px', fontWeight: 600 }}>Who We Work With</h2>
          <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 40px' }}>Our supply chain solutions are built for Australian organisations with volume merchandise needs</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { icon: '🏢', title: 'Corporate & Enterprise', desc: 'Staff gifts, onboarding packs, client gifting programs' },
              { icon: '🏛️', title: 'Government & Education', desc: 'Compliant products with full safety documentation' },
              { icon: '🛍️', title: 'Retail & Events', desc: 'High-volume fulfilment and multi-location delivery' },
              { icon: '🌿', title: 'ESG-Focused Brands', desc: 'Eco-friendly sourcing with compliance certification' },
            ].map(w => (
              <div key={w.title} style={{ background: BG, borderRadius: '12px', padding: '28px 24px', border: '1px solid #E0DDD7' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{w.icon}</div>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: '15px', marginBottom: '8px' }}>{w.title}</div>
                <div style={{ fontSize: '13px', color: '#7A7570', lineHeight: 1.6 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '64px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: '#fff', margin: '0 0 16px', fontWeight: 600 }}>
            Ready to Streamline Your Supply Chain?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.7)', margin: '0 0 32px', lineHeight: 1.7 }}>
            Talk to our team about your merchandise requirements. We'll build a supply chain solution that fits your budget, timeline, and compliance needs.
          </p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '16px 36px', borderRadius: '10px', fontSize: '16px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Get a Free Consultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
