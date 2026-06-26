'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

function StatCard({ title, value, sub, color, href }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '20px 24px', cursor: 'pointer', transition: 'box-shadow .2s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,42,74,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
        <div style={{ fontSize: '13px', color: '#7A7570', marginBottom: '8px', fontFamily: '"DM Sans", sans-serif' }}>{title}</div>
        <div style={{ fontSize: '32px', fontWeight: 700, color: color || NAVY, fontFamily: '"DM Mono", monospace', marginBottom: '4px' }}>{value}</div>
        {sub && <div style={{ fontSize: '12px', color: '#7A7570' }}>{sub}</div>}
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', fontWeight: 600, color: NAVY, margin: '0 0 24px' }}>Dashboard</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <StatCard title="Total Orders" value={stats?.orders || '—'} sub="All time" href="/admin/orders" />
          <StatCard title="Pending Artworks" value={stats?.artworks_pending || '—'} sub="Awaiting mockup" color="#C9A96E" href="/admin/artworks" />
          <StatCard title="Pending Quotes" value={stats?.quotes_pending || '—'} sub="Awaiting response" href="/admin/leads" />
          <StatCard title="Total Revenue" value={stats?.revenue ? `$${stats.revenue.toLocaleString()}` : '—'} sub="Excl. GST" color="#2D6A4F" href="/admin/orders" />
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: '0 0 16px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: '👥 Customers', href: '/admin/customers', color: NAVY },
              { label: '🎯 Enquiries & Quotes', href: '/admin/leads', color: NAVY },
              { label: '🎨 Upload Mockup', href: '/admin/artworks', color: GOLD },
              { label: '📦 View Orders', href: '/admin/orders', color: NAVY },
              { label: '🛍️ Edit Products', href: '/admin/products', color: NAVY },
              { label: '🏭 Sourcing Requests', href: '/admin/sourcing', color: NAVY },
              { label: '💰 Finance', href: '/admin/finance', color: NAVY },
            ].map(a => (
              <Link key={a.href} href={a.href} style={{ background: a.color, color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: 0 }}>Recent Orders</h2>
            <Link href="/admin/orders" style={{ fontSize: '13px', color: GOLD, textDecoration: 'none' }}>View all →</Link>
          </div>
          {stats?.recent_orders?.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E0DDD7' }}>
                  {['PO Number', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#7A7570', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F0EEED' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: GOLD, fontFamily: '"DM Mono", monospace' }}>{order.invoice_number}</td>
                    <td style={{ padding: '10px 12px', color: NAVY }}>{order.customer_name}</td>
                    <td style={{ padding: '10px 12px', fontFamily: '"DM Mono", monospace' }}>${order.total?.toFixed(2)}</td>
                    <td style={{ padding: '10px 12px', color: '#7A7570' }}>{order.payment_method?.toUpperCase()}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: order.payment_status === 'paid' ? '#D1FAE5' : '#FEF3C7', color: order.payment_status === 'paid' ? '#065F46' : '#92400E', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                        {order.payment_status?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#7A7570' }}>{new Date(order.created_at).toLocaleDateString('en-AU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#7A7570' }}>No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
