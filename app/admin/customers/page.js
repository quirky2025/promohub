'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Enquiries & Quotes', href: '/admin/leads' },
  { label: 'Artworks', href: '/admin/artworks' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Sourcing', href: '/admin/sourcing' },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [addrDraft, setAddrDraft] = useState('');
  const [indDraft, setIndDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/customers');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    setCustomers(data.customers || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  function open(c) { setSelected(c); setAddrDraft(c.address || ''); setIndDraft(c.industry || ''); }

  async function patch(action, payload) {
    setSaving(true);
    const res = await fetch('/api/admin/customers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, action, ...payload }) });
    const data = await res.json();
    setSaving(false);
    if (data.customer) {
      const addr = data.customer.billing_address && (typeof data.customer.billing_address === 'string' ? data.customer.billing_address : Object.values(data.customer.billing_address).filter(Boolean).join(', '));
      setCustomers(prev => prev.map(x => x.id === selected.id ? { ...x, ...data.customer, address: addr, has_address: !!addr } : x));
      setSelected(prev => ({ ...prev, ...data.customer, address: addr, has_address: !!addr }));
    }
  }

  const filtered = customers.filter(c => {
    if (!search) return true;
    return [c.name, c.primary_email, c.industry].join(' ').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: NAVY, padding: '0 32px', display: 'flex', alignItems: 'center', height: '56px' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '2px', marginRight: '32px' }}>QUIRKY<span style={{ color: GOLD }}>PROMO</span><span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>ADMIN</span></span>
        <nav style={{ display: 'flex', gap: '4px' }}>
          {NAV.map(item => <Link key={item.href} href={item.href} style={{ color: item.href === '/admin/customers' ? '#fff' : 'rgba(255,255,255,0.7)', background: item.href === '/admin/customers' ? 'rgba(255,255,255,0.12)' : 'transparent', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}>{item.label}</Link>)}
        </nav>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, color: NAVY, margin: 0 }}>Customers <span style={{ fontSize: '15px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>· {customers.length} companies</span></h1>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name / email / industry…" style={{ width: '280px', padding: '9px 14px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1.5fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden' }}>
            {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7570' }}>Loading…</div>
            : filtered.length === 0 ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7570' }}>No companies.</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead><tr style={{ color: '#7A7570', textAlign: 'left', background: '#FBFAF8' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Company</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Reg.</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Address</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Quotes</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Orders</th>
                </tr></thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} onClick={() => open(c)} style={{ borderTop: '1px solid #F0EEED', cursor: 'pointer', background: selected?.id === c.id ? '#FDF8F0' : '#fff' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, color: NAVY }}>{c.name || '(no name)'}{c.needs_review && <span title="Needs review" style={{ color: '#BA7517' }}> ⚠</span>}</div>
                        <div style={{ color: '#9B958E', fontSize: '11px' }}>{c.primary_email || '—'}{c.industry ? ` · ${c.industry}` : ''}</div>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>{c.registered ? '✅' : '—'}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>{c.has_address ? '✅' : <span style={{ color: '#BA7517' }}>—</span>}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#5A5550' }}>{c.quote_count}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#5A5550' }}>{c.order_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selected && (
            <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', padding: '20px', position: 'sticky', top: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: 0 }}>{selected.name || '(no name)'}</h2>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#B0AAA3', cursor: 'pointer', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ color: '#7A7570', fontSize: '12px', marginBottom: '14px' }}>{selected.primary_email || '—'}{selected.registered ? ' · ✅ registered account' : ' · not registered'} · {selected.contact_count} contact(s) · {selected.quote_count} quote(s) · {selected.order_count} order(s) · since {fmtDate(selected.created_at)}</div>

              <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Delivery address</div>
              <textarea value={addrDraft} onChange={e => setAddrDraft(e.target.value)} rows={3} placeholder="Street, suburb, state, postcode — fills Build Quote next time" style={{ width: '100%', padding: '9px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', background: '#fff' }} />
              <button onClick={() => patch('address', { address: addrDraft })} disabled={saving} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '8px', marginBottom: '16px' }}>{saving ? 'Saving…' : 'Save address'}</button>

              <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Industry</div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                <input value={indDraft} onChange={e => setIndDraft(e.target.value)} placeholder="e.g. Hospitality" style={{ flex: 1, padding: '8px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', background: '#fff' }} />
                <button onClick={() => patch('industry', { industry: indDraft })} disabled={saving} style={{ background: '#fff', color: NAVY, border: '1px solid ' + NAVY, borderRadius: '8px', padding: '0 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
              </div>

              <div style={{ borderTop: '1px solid #F0EEED', paddingTop: '12px', fontSize: '12px', color: '#7A7570' }}>
                Payment terms: <strong style={{ color: NAVY }}>{selected.payment_terms || 'prepaid'}</strong> · Stage: <strong style={{ color: NAVY }}>{selected.lifecycle_stage || 'lead'}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
