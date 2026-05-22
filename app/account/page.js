'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const STATUS_COLORS = {
  unpaid: { bg: '#FEF2F2', text: '#DC2626', label: 'Awaiting Payment' },
  paid: { bg: '#F0FAF4', text: '#2D6A4F', label: 'Paid' },
  in_production: { bg: '#EEF4FF', text: '#1D4ED8', label: 'In Production' },
  complete: { bg: '#F0FAF4', text: '#2D6A4F', label: 'Complete' },
};

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/account/login');
        return;
      }
      setUser(session.user);

      // Fetch orders by email — links guest orders too
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', session.user.email)
        .order('created_at', { ascending: false });

      setOrders(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div style={{ background: '#F8F7F4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: '"DM Sans", sans-serif', color: '#7A7570' }}>Loading...</div>
      </div>
    );
  }

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Customer';
  const userCompany = user?.user_metadata?.company || '';

  return (
    <div style={{ background: '#F8F7F4', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>My Account</span>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>

          {/* LEFT: Account Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>
                👤
              </div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: NAVY, margin: '0 0 4px' }}>{userName}</h2>
              {userCompany && <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 8px' }}>{userCompany}</p>}
              <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 20px', wordBreak: 'break-all' }}>{user?.email}</p>
              <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '13px', color: '#7A7570' }}>
                  Total Orders: <strong style={{ color: NAVY }}>{orders.length}</strong>
                </div>
              </div>
            </div>

            <button onClick={handleSignOut}
              style={{ width: '100%', background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
              Sign Out
            </button>

            <Link href="/products" style={{ display: 'block', textAlign: 'center', background: GOLD, color: '#fff', textDecoration: 'none', padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}>
              Continue Shopping
            </Link>
          </div>

          {/* RIGHT: Orders */}
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', fontWeight: 600, color: NAVY, margin: '0 0 24px' }}>
              Order History
            </h1>

            {orders.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 8px' }}>No orders yet</h3>
                <p style={{ color: '#7A7570', margin: '0 0 24px', fontSize: '14px' }}>Start shopping to place your first order.</p>
                <Link href="/products" style={{ background: GOLD, color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '14px' }}>
                  Browse Products
                </Link>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8F7F4', borderBottom: '1px solid #E0DDD7' }}>
                      {['Invoice', 'Date', 'Products', 'Total', 'Payment', 'Status'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#7A7570', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => {
                      const status = STATUS_COLORS[order.payment_status] || STATUS_COLORS.unpaid;
                      const items = Array.isArray(order.items) ? order.items : [];
                      const productNames = items.map(item => item.productName).join(', ');
                      const date = new Date(order.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

                      return (
                        <tr key={order.id} style={{ borderBottom: i < orders.length - 1 ? '1px solid #F0EEED' : 'none', transition: 'background .15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '13px', fontWeight: 600, color: NAVY }}>{order.invoice_number}</span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7A7570', whiteSpace: 'nowrap' }}>{date}</td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: NAVY, maxWidth: '240px' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={productNames}>
                              {productNames || '—'}
                            </div>
                            {items.length > 0 && (
                              <div style={{ fontSize: '11px', color: '#7A7570', marginTop: '2px' }}>
                                {items.reduce((sum, i) => sum + i.qty, 0)} units total
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', fontFamily: '"DM Mono", monospace', fontSize: '13px', fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>
                            ${Number(order.total).toFixed(2)}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '12px', color: '#7A7570', textTransform: 'capitalize' }}>
                            {order.payment_method === 'eft' ? 'EFT' : 'Credit Card'}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ background: status.bg, color: status.text, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
