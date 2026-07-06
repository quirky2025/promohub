import Link from 'next/link';
import SupplyChainQuoteBar from '@/components/SupplyChainQuoteBar';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

export default function WarehousingPage() {
  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#000' }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/supply-chain" style={{ color: '#000', textDecoration: 'none' }}>Supply Chain</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Warehousing & Fulfilment</span>
        </div>
      </div>

      <SupplyChainQuoteBar />

      {/* HERO */}
      <div style={{ background: NAVY, padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>Warehousing & Fulfilment</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 600, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
            Store, Pick, Pack & Deliver — Nationwide
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8, margin: '0 0 32px' }}>
            Flexible third-party warehousing and fulfilment solutions for Australian businesses with ongoing merchandise programs. Buy in bulk, store centrally, and distribute on demand.
          </p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Enquire Now →
          </Link>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: '#fff', padding: '64px 40px', borderBottom: '1px solid #E0DDD7' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 40px', fontWeight: 600, textAlign: 'center' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative' }}>
            {[
              { icon: '📦', title: 'Bulk Import', desc: 'Your merchandise arrives at our partner warehouse via Sea or Air freight.' },
              { icon: '🏬', title: 'Secure Storage', desc: 'Stock is held securely with real-time inventory visibility.' },
              { icon: '🗂️', title: 'Pick & Pack', desc: 'Orders are picked, packed, and labelled to your specifications.' },
              { icon: '🚚', title: 'Distribution', desc: 'Delivered to one address or hundreds — anywhere in Australia.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 24px', position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', top: '28px', right: '-8px', color: GOLD, fontSize: '20px' }}>›</div>}
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{s.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY, marginBottom: '10px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#000', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 40px' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 40px', fontWeight: 600, textAlign: 'center' }}>Warehousing Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: '📋', title: 'Inventory Management', desc: 'Real-time stock visibility so you always know what\'s available. We\'ll alert you when stock reaches reorder levels.' },
            { icon: '🎁', title: 'Pick & Pack', desc: 'Individual orders picked and packed to your specifications — ideal for staff gifting, client packs, and event kits.' },
            { icon: '🏢', title: 'Multi-Location Delivery', desc: 'Deliver to multiple offices, venues, or retail locations from one central stock holding.' },
            { icon: '🔄', title: 'On-Demand Fulfilment', desc: 'Ship only what you need, when you need it. No minimum dispatch quantities.' },
            { icon: '🏷️', title: 'Custom Packaging', desc: 'Gift boxes, branded packaging, and tissue paper available for premium presentation.' },
            { icon: '📊', title: 'Reporting', desc: 'Regular inventory reports so you can track usage, plan replenishment, and manage your merchandise budget.' },
          ].map(s => (
            <div key={s.title} style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #E0DDD7' }}>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{s.icon}</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: '#000', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHO IT SUITS */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 16px', fontWeight: 600, textAlign: 'center' }}>Who This Is For</h2>
          <p style={{ fontSize: '15px', color: '#000', margin: '0 0 32px', lineHeight: 1.7, textAlign: 'center' }}>Warehousing and fulfilment works best for organisations with ongoing or repeat merchandise needs</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              '🏢 Large enterprises with regular staff gifting programs',
              '🛍️ Retail brands with multi-location distribution needs',
              '🎪 Event companies managing merchandise across multiple venues',
              '🏛️ Government and education with rolling merchandise campaigns',
              '🌿 Brands importing large eco-product volumes for staged distribution',
              '📦 Any business wanting to reduce per-unit freight costs by consolidating shipments',
            ].map((item, i) => (
              <div key={i} style={{ background: BG, borderRadius: '10px', padding: '16px 20px', border: '1px solid #E0DDD7', fontSize: '14px', color: '#3D3A36', lineHeight: 1.5 }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '56px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: '#fff', margin: '0 0 12px' }}>Ready to Simplify Your Merchandise Logistics?</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', margin: '0 0 28px', lineHeight: 1.7 }}>Tell us about your storage and distribution requirements and we'll put together a warehousing solution that works for your program.</p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Contact Our Team →
          </Link>
        </div>
      </div>
    </div>
  );
}
