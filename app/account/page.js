'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const MUTED = '#7A7570';
const BORDER = '#E0DDD7';

const PAY_STATUS = {
  unpaid: { bg: '#FEF2F2', text: '#DC2626', label: 'Awaiting Payment' },
  pending: { bg: '#FFFBEB', text: '#92400E', label: 'Pending' },
  partial: { bg: '#FFFBEB', text: '#92400E', label: 'Part Paid' },
  paid: { bg: '#F0FAF4', text: '#2D6A4F', label: 'Paid' },
  refunded: { bg: '#F3F4F6', text: '#374151', label: 'Refunded' },
};

const SECTIONS = [
  ['overview', 'Overview'],
  ['orders', 'My Orders'],
  ['quotes', 'My Quotes'],
  ['cart', 'My Cart'],
  ['artwork', 'My Artwork'],
  ['addresses', 'Addresses'],
  ['contacts', 'Company Contacts'],
];

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [contact, setContact] = useState(null);
  const [company, setCompany] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [team, setTeam] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [section, setSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/account/login'); return; }
      setUser(session.user);

      let comp = null;
      try {
        const res = await fetch('/api/account/resolve', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const j = await res.json();
        setContact(j.contact || null);
        comp = j.company || null;
        setCompany(comp);
      } catch (_) {}

      if (comp) {
        const [a, c, o, q] = await Promise.all([
          supabase.from('company_addresses').select('*').eq('company_id', comp.id).order('is_default', { ascending: false }),
          supabase.from('contacts').select('*').eq('company_id', comp.id).order('role'),
          supabase.from('orders').select('*').eq('company_id', comp.id).order('created_at', { ascending: false }),
          supabase.from('quotes').select('*').eq('company_id', comp.id).order('created_at', { ascending: false }),
        ]);
        setAddresses(a.data || []);
        setTeam(c.data || []);
        setOrders(o.data || []);
        setQuotes(q.data || []);
      } else {
        // fallback: no B2B company linked yet — show legacy email orders
        const { data } = await supabase.from('orders').select('*')
          .eq('customer_email', session.user.email).order('created_at', { ascending: false });
        setOrders(data || []);
      }
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
      <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: '"DM Sans", sans-serif', color: MUTED }}>Loading...</div>
      </div>
    );
  }

  const name = contact ? [contact.first_name, contact.last_name].filter(Boolean).join(' ') || (user?.email || '').split('@')[0]
    : (user?.user_metadata?.name || (user?.email || '').split('@')[0] || 'Customer');
  const companyName = company?.name || user?.user_metadata?.company || '';
  const initials = (name || 'U').split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const defaultAddr = addresses.find(a => a.is_default && a.kind === 'delivery') || addresses.find(a => a.kind === 'delivery') || addresses[0];

  const card = { background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '18px' };
  const cap = { fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: MUTED, textTransform: 'uppercase' };

  function OrdersTable({ rows }) {
    if (!rows.length) return <Empty label="No orders yet" sub="Add to cart and place an order, or request a quote." />;
    return (
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#ffffff', borderBottom: `1px solid ${BORDER}` }}>
            {['Order', 'Date', 'Total', 'Payment', 'Status'].map(h => (
              <th key={h} style={{ padding: '11px 14px', fontSize: '11px', fontWeight: 700, color: MUTED, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map((o, i) => {
              const st = PAY_STATUS[o.payment_status] || PAY_STATUS.unpaid;
              const d = o.created_at ? new Date(o.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
              return (
                <tr key={o.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid #F0EEED' : 'none' }}>
                  <td style={{ padding: '13px 14px', fontFamily: '"DM Mono", monospace', fontSize: '13px', fontWeight: 600, color: NAVY }}>{o.order_number || o.invoice_number || '—'}</td>
                  <td style={{ padding: '13px 14px', fontSize: '13px', color: MUTED, whiteSpace: 'nowrap' }}>{d}</td>
                  <td style={{ padding: '13px 14px', fontFamily: '"DM Mono", monospace', fontSize: '13px', fontWeight: 600, color: GOLD }}>${Number(o.total ?? o.total_gross ?? 0).toFixed(2)}</td>
                  <td style={{ padding: '13px 14px', fontSize: '12px', color: MUTED, textTransform: 'capitalize' }}>{o.payment_method === 'eft' ? 'EFT' : (o.payment_terms === 'monthly' ? 'Account' : (o.payment_method || '—'))}</td>
                  <td style={{ padding: '13px 14px' }}><span style={{ background: st.bg, color: st.text, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{st.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function Empty({ label, sub }) {
    return (
      <div style={{ ...card, padding: '40px', textAlign: 'center', borderStyle: 'dashed' }}>
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: '0 0 6px' }}>{label}</h3>
        {sub && <p style={{ color: MUTED, margin: '0 0 18px', fontSize: '13px' }}>{sub}</p>}
        <Link href="/promotional-products" style={{ background: GOLD, color: '#fff', textDecoration: 'none', padding: '10px 22px', borderRadius: '9px', fontWeight: 700, fontSize: '13px' }}>Browse Products</Link>
        <Link href="/quote" style={{ border: `1px solid ${NAVY}`, color: NAVY, textDecoration: 'none', padding: '10px 22px', borderRadius: '9px', fontWeight: 700, fontSize: '13px', marginLeft: '8px' }}>Get a Quote</Link>
      </div>
    );
  }

  function AddressCard({ a, compact }) {
    return (
      <div style={card}>
        <div style={cap}>{a.kind === 'billing' ? 'Billing' : 'Delivery'}{a.is_default ? <span style={{ color: '#2D6A4F' }}> ● default</span> : ''}{a.label ? ` · ${a.label}` : ''}</div>
        <div style={{ fontSize: '14px', color: '#1a1a1a', marginTop: '8px', lineHeight: 1.7 }}>
          {[a.line1, a.line2].filter(Boolean).join(', ')}<br />
          {[a.suburb, a.state, a.postcode].filter(Boolean).join(' ')}<br />{a.country || 'Australia'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: MUTED }}>
          <Link href="/" style={{ color: MUTED, textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span><span style={{ color: NAVY, fontWeight: 600 }}>My Account</span>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ ...card, textAlign: 'center' }}>
              <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: NAVY, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, margin: '0 auto 10px', fontFamily: '"Cormorant Garamond", serif' }}>{initials}</div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, fontWeight: 600 }}>{name}</div>
              {companyName && <div style={{ color: GOLD, fontWeight: 600, fontSize: '13px' }}>{companyName}</div>}
              {contact?.role && <span style={{ display: 'inline-block', marginTop: '6px', background: NAVY, color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>{contact.role}</span>}
              <div style={{ fontSize: '11px', color: MUTED, marginTop: '8px', wordBreak: 'break-all' }}>{user?.email}{contact?.phone ? <><br />{contact.phone}</> : null}</div>
            </div>

            <nav style={{ ...card, padding: '8px' }}>
              {SECTIONS.map(([key, label]) => (
                <button key={key} onClick={() => setSection(key)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: '14px', cursor: 'pointer',
                    background: section === key ? '#ffffff' : 'none', color: section === key ? NAVY : '#3a3a3a',
                    border: 'none', borderLeft: section === key ? `3px solid ${GOLD}` : '3px solid transparent',
                    borderRadius: '0 8px 8px 0', fontWeight: section === key ? 700 : 500, fontFamily: '"DM Sans", sans-serif' }}>
                  {label}{key === 'cart' ? '' : ''}
                </button>
              ))}
            </nav>

            <button onClick={handleSignOut} style={{ width: '100%', background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '10px', padding: '11px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>Sign Out</button>
          </div>

          {/* MAIN */}
          <div>
            {section === 'overview' && (
              <>
                <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 18px' }}>Account Overview</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={card}>
                    <div style={cap}>Company</div>
                    <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '19px', color: NAVY, margin: '4px 0 8px', fontWeight: 600 }}>{companyName || '—'}</div>
                    {company && <span style={{ background: GOLD, color: NAVY, fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '10px' }}>{company.payment_terms === 'monthly' ? 'Account · Monthly' : 'Prepaid'}</span>}
                    <div style={{ fontSize: '13px', color: '#3a3a3a', marginTop: '10px', lineHeight: 1.7 }}>Phone: {company?.phone || '—'}<br />ABN: {company?.abn || '—'}</div>
                  </div>
                  {defaultAddr ? <AddressCard a={defaultAddr} /> : <div style={card}><div style={cap}>Default Delivery</div><div style={{ fontSize: '13px', color: MUTED, marginTop: '8px' }}>No address yet. <button onClick={() => setSection('addresses')} style={{ color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Add one</button></div></div>}
                </div>

                <div style={{ ...card, marginTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={cap}>Company Contacts</div>
                    <button onClick={() => setSection('contacts')} style={{ fontSize: '12px', color: GOLD, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
                  </div>
                  {(team.length ? team : (contact ? [contact] : [])).slice(0, 3).map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', fontSize: '13px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: NAVY, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{[c.first_name, c.last_name].filter(Boolean).map(s => s[0]).join('').toUpperCase()}</div>
                      <div><strong style={{ color: NAVY }}>{[c.first_name, c.last_name].filter(Boolean).join(' ')}</strong> · <span style={{ color: MUTED }}>{c.role}{c.title ? ` · ${c.title}` : ''}</span><br /><span style={{ color: MUTED, fontSize: '12px' }}>{c.email}{c.phone ? ` · ${c.phone}` : ''}</span></div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '14px' }}><div style={{ ...cap, marginBottom: '8px' }}>Recent Orders</div><OrdersTable rows={orders.slice(0, 5)} /></div>
              </>
            )}

            {section === 'orders' && (<><h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 18px' }}>My Orders</h1><OrdersTable rows={orders} /></>)}

            {section === 'quotes' && (
              <><h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 18px' }}>My Quotes</h1>
                {quotes.length ? (
                  <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#ffffff', borderBottom: `1px solid ${BORDER}` }}>
                      {['Quote', 'Date', 'Product', 'Qty', 'Total', 'Status'].map(h => <th key={h} style={{ padding: '11px 14px', fontSize: '11px', fontWeight: 700, color: MUTED, textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>)}
                    </tr></thead><tbody>
                      {quotes.map((q, i) => (
                        <tr key={q.id} style={{ borderBottom: i < quotes.length - 1 ? '1px solid #F0EEED' : 'none' }}>
                          <td style={{ padding: '13px 14px', fontFamily: '"DM Mono", monospace', fontSize: '13px', color: NAVY }}>{q.quote_number || '—'}</td>
                          <td style={{ padding: '13px 14px', fontSize: '13px', color: MUTED }}>{q.created_at ? new Date(q.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                          <td style={{ padding: '13px 14px', fontSize: '13px', color: NAVY }}>{q.product_name || '—'}</td>
                          <td style={{ padding: '13px 14px', fontSize: '13px', color: MUTED }}>{q.quantity || '—'}</td>
                          <td style={{ padding: '13px 14px', fontFamily: '"DM Mono", monospace', fontSize: '13px', color: GOLD }}>{q.total != null ? `$${Number(q.total).toFixed(2)}` : '—'}</td>
                          <td style={{ padding: '13px 14px', fontSize: '12px', color: MUTED, textTransform: 'capitalize' }}>{q.status || '—'}</td>
                        </tr>
                      ))}
                    </tbody></table>
                  </div>
                ) : <Empty label="No quotes yet" sub="Request a quote on any product." />}
              </>
            )}

            {section === 'cart' && (<><h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 18px' }}>My Cart</h1><div style={{ ...card }}><p style={{ color: MUTED, margin: '0 0 14px' }}>Your cart is on the cart page.</p><Link href="/cart" style={{ background: GOLD, color: '#fff', textDecoration: 'none', padding: '10px 22px', borderRadius: '9px', fontWeight: 700, fontSize: '13px' }}>Go to Cart</Link></div></>)}

            {section === 'artwork' && (<><h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 18px' }}>My Artwork</h1><div style={{ ...card }}><p style={{ color: MUTED, margin: 0 }}>Your logos & proofs will appear here. (Coming soon.)</p></div></>)}

            {section === 'addresses' && (
              <><h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 18px' }}>Addresses</h1>
                {addresses.length ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>{addresses.map(a => <AddressCard key={a.id} a={a} />)}</div>
                  : <div style={{ ...card }}><p style={{ color: MUTED, margin: 0 }}>No saved addresses yet. Contact us to add one, or it will be set when you place your first order.</p></div>}
              </>
            )}

            {section === 'contacts' && (
              <><h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 18px' }}>Company Contacts</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(team.length ? team : (contact ? [contact] : [])).map(c => (
                    <div key={c.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: NAVY, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>{[c.first_name, c.last_name].filter(Boolean).map(s => s[0]).join('').toUpperCase()}</div>
                      <div style={{ fontSize: '13px' }}><strong style={{ color: NAVY }}>{[c.first_name, c.last_name].filter(Boolean).join(' ')}</strong> · <span style={{ color: MUTED }}>{c.role}{c.title ? ` · ${c.title}` : ''}{c.department ? ` · ${c.department}` : ''}</span><br /><span style={{ color: MUTED }}>{c.email}{c.phone ? ` · ${c.phone}` : ''}</span></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
