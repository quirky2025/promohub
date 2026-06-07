import Link from 'next/link';
import SupplyChainQuoteBar from '@/components/SupplyChainQuoteBar';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

export default function LogisticsPage() {
  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/supply-chain" style={{ color: '#7A7570', textDecoration: 'none' }}>Supply Chain</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Freight & Logistics</span>
        </div>
      </div>

      <SupplyChainQuoteBar />

      {/* HERO */}
      <div style={{ background: NAVY, padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>Freight & Logistics</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 600, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
            Save Up to 50% on International Freight
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8, margin: '0 0 32px' }}>
            Through our first-tier freight partnerships and strategic Asian routing, we deliver significantly better rates than standard international freight — across Express, Air, and Sea options.
          </p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Get a Freight Quote →
          </Link>
        </div>
      </div>

      {/* SAVINGS HIGHLIGHT */}
      <div style={{ background: '#fff', padding: '48px 40px', borderBottom: '1px solid #E0DDD7' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 16px', fontWeight: 600 }}>
              Why Our Freight Rates Are Lower
            </h2>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 16px' }}>
              Standard international freight booked through local carriers carries significant margin at every step. We work differently — our first-tier freight partnerships give us direct access to carrier rates that bypass the typical markup chain.
            </p>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 24px' }}>
              Through strategic routing — including consolidation hubs across Asia — we consistently deliver freight savings of up to 50% compared to standard international rates, without compromising on speed or reliability.
            </p>
            <div style={{ padding: '16px 20px', background: BG, borderRadius: '10px', borderLeft: `4px solid ${GOLD}` }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#3D3A36', lineHeight: 1.7 }}>
                <strong>The QuirkyPromo difference:</strong> We pass our freight savings directly to you — not as a profit margin, but as a genuine cost advantage for your merchandise program.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Potential Savings', value: 'Up to 50%', sub: 'vs standard rates' },
              { label: 'Freight Options', value: '3', sub: 'Express · Air · Sea' },
              { label: 'Express Lead Time', value: '5–7', sub: 'business days' },
              { label: 'Sea Lead Time', value: '45', sub: 'business days' },
            ].map(s => (
              <div key={s.label} style={{ background: BG, borderRadius: '12px', padding: '20px', border: '1px solid #E0DDD7', textAlign: 'center' }}>
                <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: GOLD, fontWeight: 600 }}>{s.value}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '2px' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: '#7A7570' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THREE OPTIONS */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 40px' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: NAVY, margin: '0 0 12px', fontWeight: 600, textAlign: 'center' }}>Three Freight Options</h2>
        <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 40px', textAlign: 'center' }}>Choose the right balance of speed and cost for your order</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            {
              icon: '⚡',
              badge: 'Fastest',
              badgeColor: '#DC2626',
              title: 'Express Freight',
              leadTime: '5–7 business days',
              best: 'Urgent orders, last-minute campaigns',
              points: [
                'Priority handling at origin and destination',
                'Door-to-door tracking throughout',
                'Ideal for time-sensitive corporate campaigns',
                'Available from most Asian manufacturing hubs',
              ],
            },
            {
              icon: '✈️',
              badge: 'Most Popular',
              badgeColor: NAVY,
              title: 'Air Freight',
              leadTime: '20 business days',
              best: 'Balanced speed and cost',
              points: [
                'Significantly lower cost than Express',
                'Reliable scheduled airline services',
                'Full tracking from factory to delivery',
                'Recommended for Indent Air orders',
              ],
            },
            {
              icon: '🚢',
              badge: 'Best Value',
              badgeColor: '#2D6A4F',
              title: 'Sea Freight',
              leadTime: '45 business days',
              best: 'Large volume, budget-conscious orders',
              points: [
                'Lowest cost per unit for large shipments',
                'Ideal for bulk indent orders',
                'Full container or LCL (less than container load)',
                'Recommended for planned campaigns',
              ],
            },
          ].map(o => (
            <div key={o.title} style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E0DDD7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '36px' }}>{o.icon}</span>
                <span style={{ background: o.badgeColor, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>{o.badge}</span>
              </div>
              <div>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 6px', fontWeight: 600 }}>{o.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: GOLD, fontFamily: '"DM Mono", monospace' }}>{o.leadTime}</span>
                  <span style={{ fontSize: '12px', color: '#7A7570' }}>lead time</span>
                </div>
              </div>
              <div style={{ padding: '10px 14px', background: BG, borderRadius: '8px', fontSize: '12px', color: '#5A5550' }}>
                <strong>Best for:</strong> {o.best}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {o.points.map((p, i) => <li key={i} style={{ fontSize: '13px', color: '#5A5550', marginBottom: '8px', lineHeight: 1.5 }}>{p}</li>)}
              </ul>
              <Link href="/contact" style={{ marginTop: 'auto', display: 'block', background: NAVY, color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                Get a Quote →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 32px', fontWeight: 600, textAlign: 'center' }}>At a Glance</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: NAVY }}>
                {['', 'Express', 'Air Freight', 'Sea Freight'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: h === '' ? 'left' : 'center', color: h === '' ? 'rgba(255,255,255,.5)' : '#fff', fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Lead Time', vals: ['5–7 days', '20 days', '45 days'] },
                { label: 'Cost', vals: ['Highest', 'Mid', 'Lowest'] },
                { label: 'Savings vs Standard', vals: ['Up to 30%', 'Up to 50%', 'Up to 50%'] },
                { label: 'Best For', vals: ['Urgent orders', 'Balanced', 'Large volume'] },
                { label: 'Tracking', vals: ['✅ Full', '✅ Full', '✅ Full'] },
              ].map((r, i) => (
                <tr key={r.label} style={{ background: i % 2 === 0 ? BG : '#fff' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: NAVY, fontSize: '13px' }}>{r.label}</td>
                  {r.vals.map((v, j) => (
                    <td key={j} style={{ padding: '14px 20px', textAlign: 'center', color: '#5A5550' }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '56px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: '#fff', margin: '0 0 12px' }}>Discuss Your Freight Requirements</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', margin: '0 0 28px', lineHeight: 1.7 }}>Tell us about your order volume and timeline and we'll put together the most cost-effective freight solution for your campaign.</p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Contact Our Team →
          </Link>
        </div>
      </div>
    </div>
  );
}
