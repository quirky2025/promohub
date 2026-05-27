import Link from 'next/link';
import SupplyChainQuoteBar from '@/components/SupplyChainQuoteBar';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

export default function InspectionPage() {
  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: BG }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/supply-chain" style={{ color: '#7A7570', textDecoration: 'none' }}>Supply Chain</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Quality Inspection</span>
        </div>
      </div>

      <SupplyChainQuoteBar />

      {/* HERO */}
      <div style={{ background: NAVY, padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>
            Quality Inspection
          </div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 600, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
            Independent Inspection Before Every Shipment
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8, margin: '0 0 32px' }}>
            Every bulk order can be independently inspected at the factory before it leaves — giving you complete confidence that what you approved is exactly what gets shipped.
          </p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Request an Inspection →
          </Link>
        </div>
      </div>

      {/* WHY INSPECT */}
      <div style={{ background: '#fff', padding: '64px 40px', borderBottom: '1px solid #E0DDD7' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 16px', fontWeight: 600 }}>
              Why Third-Party Inspection Matters
            </h2>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 16px' }}>
              When merchandise is manufactured overseas, the biggest risk isn't the factory — it's the gap between what was approved and what was produced. Colours shift. Dimensions drift. Print quality varies. Without an independent check before shipment, these issues only become visible when the goods arrive in Australia.
            </p>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 16px' }}>
              A third-party pre-shipment inspection puts an independent set of eyes on your order at the factory — before it's packed into containers and shipped. Any discrepancies are caught and resolved at the source, not after a 45-day sea freight journey.
            </p>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: 0 }}>
              We arrange independent inspection through accredited third-party inspection companies. The inspection report is shared with you directly, giving you full transparency over your order quality.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '🔍', title: 'Catch Issues Early', desc: 'Problems identified at the factory are fixed before shipping — not after arrival in Australia.' },
              { icon: '📋', title: 'Independent Report', desc: 'You receive a detailed inspection report directly — not filtered through the factory or supplier.' },
              { icon: '✅', title: 'Ship with Confidence', desc: 'Only approve shipment once you\'ve seen the inspection results. Full control, every time.' },
              { icon: '💰', title: 'Protect Your Investment', desc: 'For large orders, inspection costs a fraction of the cost of a rejected or reprinted shipment.' },
            ].map(s => (
              <div key={s.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: BG, borderRadius: '10px', padding: '14px 16px', border: '1px solid #E0DDD7' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: NAVY, marginBottom: '3px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: '#7A7570', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT WE CHECK */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 40px' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 12px', fontWeight: 600, textAlign: 'center' }}>
          What Gets Inspected
        </h2>
        <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 40px', textAlign: 'center' }}>
          Our inspection partners check every critical aspect of your order against the approved specifications
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            {
              icon: '📏',
              title: 'Dimensions & Weight',
              points: ['Product dimensions vs specification', 'Weight tolerances', 'Packaging dimensions and weight'],
            },
            {
              icon: '🎨',
              title: 'Colour & Appearance',
              points: ['Colour match vs approved sample', 'Surface finish quality', 'Logo placement and alignment'],
            },
            {
              icon: '🖨️',
              title: 'Print & Decoration Quality',
              points: ['Print resolution and sharpness', 'Colour accuracy vs approved proof', 'Embroidery stitch count and coverage'],
            },
            {
              icon: '🔢',
              title: 'Quantity Verification',
              points: ['Carton count vs purchase order', 'Units per carton verification', 'Total unit count confirmation'],
            },
            {
              icon: '📦',
              title: 'Packaging & Labelling',
              points: ['Packaging condition and quality', 'Labels and barcodes (if applicable)', 'Carton markings and shipping marks'],
            },
            {
              icon: '⚙️',
              title: 'Function & Safety',
              points: ['Functional testing where applicable', 'No sharp edges or hazardous defects', 'Material feel and construction quality'],
            },
          ].map(s => (
            <div key={s.title} style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #E0DDD7' }}>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{s.icon}</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: '0 0 14px', fontWeight: 600 }}>{s.title}</h3>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                {s.points.map((p, i) => (
                  <li key={i} style={{ fontSize: '13px', color: '#5A5550', marginBottom: '6px', lineHeight: 1.5 }}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* PROCESS */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 40px', fontWeight: 600, textAlign: 'center' }}>
            How the Inspection Process Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0' }}>
            {[
              { num: '01', icon: '📝', title: 'Request', desc: 'Let us know you want an inspection when placing your order or at any point before production is complete.' },
              { num: '02', icon: '🏭', title: 'Factory Ready', desc: 'Once production is complete, the factory notifies us and the inspection is scheduled.' },
              { num: '03', icon: '🔍', title: 'On-Site Inspection', desc: 'An independent inspector visits the factory and checks your order against the approved specifications.' },
              { num: '04', icon: '📊', title: 'Report Delivered', desc: 'You receive a detailed inspection report with photos and findings — typically within 24 hours of the inspection.' },
              { num: '05', icon: '✅', title: 'Approve & Ship', desc: 'You review the report and either approve shipment or request remediation before goods leave the factory.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 16px', position: 'relative' }}>
                {i < 4 && (
                  <div style={{ position: 'absolute', top: '28px', right: '-8px', color: GOLD, fontSize: '20px', zIndex: 1 }}>›</div>
                )}
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: NAVY, color: GOLD, fontFamily: '"DM Mono", monospace', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{s.num}</div>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{s.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: '#7A7570', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHEN TO USE */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 40px' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 16px', fontWeight: 600, textAlign: 'center' }}>
          When We Recommend an Inspection
        </h2>
        <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 32px', textAlign: 'center', lineHeight: 1.7 }}>
          Inspection is strongly recommended for the following types of orders
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {[
            '📦 Large volume orders (typically 500+ units)',
            '✈️ All Indent Air and Indent Sea shipments',
            '🎨 Orders with complex decoration or multiple print positions',
            '🌿 Eco or compliance-sensitive products',
            '🏛️ Government, education, or healthcare orders',
            '⚙️ Made to Order or fully custom products',
            '🆕 First-time orders with a new factory or product',
            '📅 Time-sensitive campaigns where reprints aren\'t possible',
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '10px', padding: '14px 18px', border: '1px solid #E0DDD7', fontSize: '14px', color: '#3D3A36', lineHeight: 1.5 }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '56px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: '#fff', margin: '0 0 12px' }}>
            Add Inspection to Your Order
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', margin: '0 0 28px', lineHeight: 1.7 }}>
            Contact us to arrange a third-party inspection for your next order. We'll handle the logistics and deliver the report directly to you.
          </p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Talk to Our Team →
          </Link>
        </div>
      </div>
    </div>
  );
}
