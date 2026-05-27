import Link from 'next/link';

const GOLD = '#C9A96E';
const NAVY = '#1B2A4A';

export default function SupplyChainQuoteBar({ title = 'Ready to Get Started?' }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: GOLD, padding: '14px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 2px 12px rgba(201,169,110,.4)',
    }}>
      <span style={{
        fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
        fontWeight: 600, color: '#fff',
      }}>
        {title}
      </span>
      <Link href="/supply-chain/quote" style={{
        background: NAVY, color: '#fff', padding: '10px 24px',
        borderRadius: '8px', fontSize: '14px', fontWeight: 700,
        textDecoration: 'none', whiteSpace: 'nowrap',
        fontFamily: '"DM Sans", sans-serif',
      }}>
        Get a Sourcing Quote →
      </Link>
    </div>
  );
}
