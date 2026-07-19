'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const DOMAINS = [
  { key: 'dashboard', label: 'Dashboard', href: '/admin', tabs: [] },
  { key: 'local', label: 'Local Stock', tabs: [
    { label: 'Enquiries & Quotes', href: '/admin/leads' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Artworks', href: '/admin/artworks' },
  ] },
  { key: 'supprod', label: 'Suppliers & Production', tabs: [
    { label: 'Production', href: '/admin/production' },
    { label: 'Suppliers', href: '/admin/suppliers' },
  ] },
  { key: 'finance', label: 'Finance', tabs: [
    { label: 'Invoices', href: '/admin/invoices' },
    { label: '记账 / 利润表', href: '/admin/finance' },
  ] },
  { key: 'sourcing', label: 'Sourcing', tabs: [
    { label: 'Sourcing', href: '/admin/sourcing' },
  ] },
  { key: 'catalog', label: 'Catalog', tabs: [
    { label: 'Products', href: '/admin/products' },
    { label: 'Content', href: '/admin/content' },
    { label: 'Collections', href: '/admin/collections' },
    { label: 'Banners', href: '/admin/banners' },
  ] },
  { key: 'customers', label: 'Customers', href: '/admin/customers', tabs: [] },
  { key: 'settings', label: 'Settings', href: '/admin/settings', tabs: [] },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/admin/login')) return children;

  let active = DOMAINS[0];
  let bestLen = -1;
  DOMAINS.forEach(d => {
    [d.href, ...d.tabs.map(t => t.href)].filter(Boolean).forEach(h => {
      if ((pathname === h || pathname.startsWith(h + '/')) && h.length > bestLen) { bestLen = h.length; active = d; }
    });
  });
  if (pathname === '/admin') active = DOMAINS[0];
  const tabs = active.tabs || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', background: '#fff' }}>
      <aside style={{ width: '190px', background: NAVY, flexShrink: 0, padding: '14px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '0 16px 14px', fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', fontWeight: 600, color: '#fff', letterSpacing: '1px' }}>
          QUIRKY<span style={{ color: GOLD }}>PROMO</span>
        </div>
        {DOMAINS.map(d => {
          const isActive = d.key === active.key;
          const to = d.href || (d.tabs[0] && d.tabs[0].href) || '/admin';
          return (
            <Link key={d.key} href={to}
              style={{ display: 'block', padding: '9px 16px', fontSize: '13px', textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,.7)',
                background: isActive ? 'rgba(255,255,255,.12)' : 'none',
                borderLeft: isActive ? `3px solid ${GOLD}` : '3px solid transparent',
                fontWeight: isActive ? 700 : 500 }}>
              {d.label}
            </Link>
          );
        })}
        <Link href="/admin/login" style={{ display: 'block', padding: '9px 16px', fontSize: '12px', color: 'rgba(255,255,255,.5)', textDecoration: 'none', marginTop: '12px' }}>Logout</Link>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {tabs.length > 0 && (
          <div style={{ borderBottom: '1px solid #E0DDD7', padding: '0 24px', display: 'flex', gap: '4px', background: '#fff', minHeight: '52px', alignItems: 'center', flexWrap: 'wrap' }}>
            {tabs.map(t => {
              const on = pathname === t.href || pathname.startsWith(t.href + '/');
              return (
                <Link key={t.href} href={t.href}
                  style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', fontWeight: on ? 700 : 500,
                    color: on ? '#fff' : '#5A5550', background: on ? NAVY : 'transparent' }}>
                  {t.label}
                </Link>
              );
            })}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
