'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './sourcing.css';

const TABS = [
  { href: '/admin/sourcing', label: 'Requests', exact: true },
  { href: '/admin/sourcing/made-to-order', label: 'Made-to-Order Products' },
  { href: '/admin/sourcing/factories', label: 'Factories' },
  { href: '/admin/sourcing/costing', label: 'Costing' },
  { href: '/admin/sourcing/quotes', label: 'Quote Search' },
  { href: '/admin/sourcing/trends', label: 'Trends' },
  { href: '/admin/sourcing/freight', label: 'Freight Rates' },
];

export default function SourcingLayout({ children }) {
  const pathname = usePathname() || '';
  return (
    <div className="srcx-wrap">
      <nav className="srcx-subnav">
        <Link href="/admin" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'none', paddingBottom: 10, marginRight: 4 }}>
          Back to Admin
        </Link>
        <span className="srcx-subnav-title">Sourcing</span>
        {TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link key={tab.href} href={tab.href} className={active ? 'active' : ''}>
              {tab.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
