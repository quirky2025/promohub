import Link from 'next/link';
import SupplyChainQuoteBar from '@/components/SupplyChainQuoteBar';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

export default function CompliancePage() {
  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: BG }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/supply-chain" style={{ color: '#7A7570', textDecoration: 'none' }}>Supply Chain</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Compliance & Safety</span>
        </div>
      </div>

      <SupplyChainQuoteBar />

      {/* HERO */}
      <div style={{ background: NAVY, padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>Compliance & Safety</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 600, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
            Every Product. Every Standard. Every Time.
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8, margin: '0 0 32px' }}>
            All products supplied by QuirkyPromo meet Australian safety and import standards. For government, education, and enterprise clients — full compliance documentation is available on request.
          </p>
          <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Request Compliance Docs →
          </Link>
        </div>
      </div>

      {/* WHY IT MATTERS */}
      <div style={{ background: '#fff', padding: '64px 40px', borderBottom: '1px solid #E0DDD7' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 16px', fontWeight: 600 }}>Why Compliance Matters</h2>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 16px' }}>
              Australian Consumer Law requires that all products supplied in Australia meet mandatory safety standards. For promotional merchandise — particularly items distributed to employees, clients, or the public — non-compliant products can expose your organisation to significant legal and reputational risk.
            </p>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 16px' }}>
              Government departments, educational institutions, healthcare organisations, and ASX-listed companies increasingly require compliance documentation before approving merchandise purchases. We make this easy.
            </p>
            <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: 0 }}>
              At QuirkyPromo, compliance is built into our sourcing process — not an afterthought. Every factory partner is assessed for compliance capability, and documentation is available for any product in our range.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '🏛️', title: 'Government & Public Sector', desc: 'Mandatory compliance documentation for procurement processes' },
              { icon: '🎓', title: 'Education', desc: 'Children\'s product safety standards for school and university merchandise' },
              { icon: '🏥', title: 'Healthcare', desc: 'Strict material safety requirements for patient-facing products' },
              { icon: '📊', title: 'ASX-Listed Companies', desc: 'ESG and supply chain due diligence documentation for annual reporting' },
            ].map(s => (
              <div key={s.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: BG, borderRadius: '10px', padding: '14px 16px', border: '1px solid #E0DDD7' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: NAVY, marginBottom: '3px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: '#7A7570' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STANDARDS WE MEET */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 40px' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 12px', fontWeight: 600, textAlign: 'center' }}>Standards We Work To</h2>
        <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 40px', textAlign: 'center' }}>Our products are sourced and tested against the following Australian and international standards</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            {
              badge: 'ACCC',
              badgeColor: '#1E40AF',
              title: 'Australian Consumer Law',
              desc: 'All products comply with mandatory safety standards enforced by the Australian Competition and Consumer Commission (ACCC). This includes mandatory standards for products such as children\'s items, electrical goods, and food contact materials.',
              docs: ['Product Safety Declaration', 'ACCC Compliance Confirmation'],
            },
            {
              badge: 'REACH',
              badgeColor: '#2D6A4F',
              title: 'REACH Chemical Safety',
              desc: 'REACH (Registration, Evaluation, Authorisation and Restriction of Chemicals) is the EU\'s comprehensive chemical safety regulation. Our factory partners test products to REACH standards, ensuring they are free from restricted hazardous substances.',
              docs: ['REACH Compliance Certificate', 'Substance Declaration'],
            },
            {
              badge: 'AS/NZS',
              badgeColor: '#7C3AED',
              title: 'Children\'s Product Safety',
              desc: 'Products intended for use by or around children meet Australian and New Zealand Standards (AS/NZS) for toy safety and children\'s product safety. This includes testing for physical, mechanical, and chemical hazards.',
              docs: ['AS/NZS Test Report', 'Children\'s Product Safety Declaration'],
            },
            {
              badge: 'RoHS',
              badgeColor: '#B45309',
              title: 'RoHS — Restricted Substances',
              desc: 'The Restriction of Hazardous Substances directive limits the use of specific hazardous materials in electronic and electrical products. Our technology and electronic promotional products are tested accordingly.',
              docs: ['RoHS Compliance Certificate'],
            },
            {
              badge: 'BSCI',
              badgeColor: '#BE185D',
              title: 'Ethical Manufacturing',
              desc: 'We prioritise factory partners who meet Business Social Compliance Initiative (BSCI) standards, ensuring ethical working conditions, fair wages, and responsible manufacturing practices throughout our supply chain.',
              docs: ['BSCI Audit Reports', 'Factory Compliance Statement'],
            },
            {
              badge: 'CA Prop 65',
              badgeColor: '#0F766E',
              title: 'California Proposition 65',
              desc: 'For clients distributing products internationally or with strict chemical safety requirements, we can source products tested to California Proposition 65 standards — one of the world\'s most stringent chemical safety benchmarks.',
              docs: ['Prop 65 Test Report'],
            },
          ].map(s => (
            <div key={s.title} style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #E0DDD7', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: s.badgeColor, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.5px' }}>{s.badge}</span>
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: 0, fontWeight: 600 }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: '#5A5550', lineHeight: 1.7, margin: 0, flex: 1 }}>{s.desc}</p>
              <div style={{ paddingTop: '12px', borderTop: '1px solid #F0EEED' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Available Documents</div>
                {s.docs.map(d => (
                  <div key={d} style={{ fontSize: '12px', color: '#5A5550', marginBottom: '3px' }}>✓ {d}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW TO REQUEST */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '64px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', color: NAVY, margin: '0 0 16px', fontWeight: 600 }}>How to Request Compliance Documentation</h2>
          <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 40px', lineHeight: 1.7 }}>Compliance documentation is available for any product in our range. Simply follow these steps:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
            {[
              { num: '1', title: 'Identify Your Products', desc: 'Note the product SKU or name from your quote or order.' },
              { num: '2', title: 'Contact Our Team', desc: 'Email hello@quirkypromo.com.au with the products and standards required.' },
              { num: '3', title: 'Receive Documentation', desc: 'We\'ll provide the relevant certificates and test reports within 2 business days.' },
            ].map(s => (
              <div key={s.num} style={{ background: BG, borderRadius: '12px', padding: '24px', border: '1px solid #E0DDD7' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: NAVY, color: GOLD, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>{s.num}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#7A7570', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '56px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: '#fff', margin: '0 0 12px' }}>Need Compliance Documentation?</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', margin: '0 0 28px', lineHeight: 1.7 }}>Contact our team with your product requirements and the standards you need to meet. We'll make sure you have everything required for your procurement process.</p>
          <a href="mailto:hello@quirkypromo.com.au" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            hello@quirkypromo.com.au →
          </a>
        </div>
      </div>
    </div>
  );
}
