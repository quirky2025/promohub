import Link from 'next/link';
import SupplyChainQuoteBar from '@/components/SupplyChainQuoteBar';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

export default function SourcingPage() {
  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/supply-chain" style={{ color: '#7A7570', textDecoration: 'none' }}>Supply Chain</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Sourcing & Manufacturing</span>
        </div>
      </div>

      <SupplyChainQuoteBar />

      {/* HERO */}
      <div style={{ background: NAVY, padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>Sourcing & Manufacturing</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 600, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
            Direct Factory Access. No Middlemen.
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8, margin: '0 0 32px' }}>
            We work directly with vetted factories across Asia to source high-quality promotional products at competitive prices — with full quality control and compliance at every step.
          </p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Discuss Your Requirements →
          </Link>
        </div>
      </div>

      {/* HOW WE SOURCE */}
      <div style={{ background: '#fff', padding: '64px 40px', borderBottom: '1px solid #E0DDD7' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 16px', fontWeight: 600 }}>How We Source Your Products</h2>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 16px' }}>
              Our sourcing team maintains direct relationships with over 200 factory partners across China, Vietnam, Bangladesh, and India. We visit trade shows including Canton Fair, Reed, and PPAI to stay across new products, materials, and manufacturing capabilities.
            </p>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 24px' }}>
              Every factory partner is vetted for quality standards, ethical manufacturing practices, and compliance capability before we place a single order. When you order through QuirkyPromo, you're getting factory-direct pricing with the confidence of a professional sourcing team behind it.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[{ value: '200+', label: 'Factory Partners' }, { value: '8', label: 'Countries' }, { value: '12', label: 'Product Categories' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: GOLD, fontWeight: 600 }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: '#7A7570' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { step: '01', title: 'Briefing', desc: 'You share your product requirements, quantity, timeline, and budget.' },
              { step: '02', title: 'Factory Match', desc: 'We identify the right factory based on product type, quality tier, and compliance needs.' },
              { step: '03', title: 'Sampling', desc: 'A pre-production sample is created and reviewed before bulk manufacturing begins.' },
              { step: '04', title: 'Quality Inspection', desc: 'Pre-shipment inspection confirms every unit meets your specification.' },
              { step: '05', title: 'Shipment', desc: 'Goods are shipped via your chosen freight option with full tracking.' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: NAVY, color: GOLD, fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: '"DM Mono", monospace' }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: NAVY, marginBottom: '3px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: '#7A7570', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 40px' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 40px', fontWeight: 600, textAlign: 'center' }}>What We Offer</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: '🏷️', title: 'Catalogue Sourcing', desc: 'Order from our existing range of 1,800+ products with confidence in quality and compliance.' },
            { icon: '⚙️', title: 'Custom Sourcing', desc: 'Need something not in our catalogue? We\'ll source it. Tell us what you need and we\'ll find the right factory.' },
            { icon: '🌿', title: 'Eco-Friendly Sourcing', desc: 'Sustainable materials, ethical factories, and certified eco products for brands with ESG commitments.' },
            { icon: '🔍', title: 'Quality Control', desc: 'Pre-production samples and pre-shipment inspections ensure every order meets your specification.' },
            { icon: '📋', title: 'Compliance Documentation', desc: 'Full safety testing documentation available on request for government, education, and enterprise clients.' },
            { icon: '💰', title: 'Competitive Pricing', desc: 'Direct factory access means you pay less. No hidden margin at every step of the chain.' },
          ].map(o => (
            <div key={o.title} style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #E0DDD7' }}>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{o.icon}</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>{o.title}</h3>
              <p style={{ fontSize: '13px', color: '#5A5550', lineHeight: 1.7, margin: 0 }}>{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '56px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: '#fff', margin: '0 0 12px' }}>Tell Us What You Need</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', margin: '0 0 28px', lineHeight: 1.7 }}>Whether it's in our catalogue or a completely custom product, our sourcing team can find the right solution at the right price.</p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Start a Conversation →
          </Link>
        </div>
      </div>
    </div>
  );
}
