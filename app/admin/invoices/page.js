'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Enquiries & Quotes', href: '/admin/leads' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Artworks', href: '/admin/artworks' },
  { label: 'Invoices', href: '/admin/invoices' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Sourcing', href: '/admin/sourcing' },
];

const STATE = {
  awaiting: { bg: '#FEE2E2', color: '#991B1B', label: 'Awaiting Payment' },
  deposit:  { bg: '#FEF3C7', color: '#92400E', label: 'Deposit Paid' },
  paid:     { bg: '#D1FAE5', color: '#065F46', label: 'Paid' },
};

const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function payInfo(o) {
  const gross = Number(o.total_gross ?? o.total ?? 0);
  const paid = Number(o.amount_paid ?? 0);
  const state = o.payment_state || (paid <= 0 ? 'awaiting' : (gross > 0 && paid >= gross) ? 'paid' : 'deposit');
  return { gross, paid, balance: Math.max(gross - paid, 0), state };
}

export default function AdminInvoicesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [pay, setPay] = useState(null);      // order being paid
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('eft');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const data = await res.json();
      const list = (Array.isArray(data.orders) ? data.orders : [])
        .filter(o => o.status !== 'quote' && o.status !== 'cancelled');
      setOrders(list);
    } catch { setOrders([]); }
    setLoading(false);
  }

  function openPay(o) {
    const { balance } = payInfo(o);
    setPay(o);
    setAmount(balance ? balance.toFixed(2) : '');
    setMethod(o.payment_method === 'stripe' ? 'card' : 'eft');
    setNote('');
  }

  async function submitPay() {
    if (!pay || !Number(amount)) return;
    setSaving(true);
    const res = await fetch('/api/admin/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: pay.id, orderNumber: pay.order_number || pay.invoice_number,
        amount: Number(amount), method, note,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || data.error) { alert('Failed: ' + (data.error || 'unknown')); return; }
    setPay(null);
    load();
  }

  const shown = filter ? orders.filter(o => payInfo(o).state === filter) : orders;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ background: NAVY, padding: '0 32px', display: 'flex', alignItems: 'center', gap: '28px', height: '56px' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '1px' }}>
          QUIRKY<span style={{ color: GOLD }}>PROMO</span>
        </span>
        <nav style={{ display: 'flex', gap: '2px' }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              style={{ color: n.href === '/admin/invoices' ? '#fff' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: n.href === '/admin/invoices' ? 700 : 500, background: n.href === '/admin/invoices' ? 'rgba(255,255,255,0.1)' : 'none' }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, color: NAVY, margin: 0 }}>Invoices</h1>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['', 'awaiting', 'deposit', 'paid'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1.5px solid', borderColor: filter === f ? NAVY : '#E0DDD7', background: filter === f ? NAVY : '#fff', color: filter === f ? '#fff' : '#7A7570', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {f === '' ? 'All' : STATE[f].label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570', border: '1px solid #E0DDD7', borderRadius: '12px' }}>No invoices</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E0DDD7' }}>
                {['Order #', 'Job', 'Customer', 'Total', 'Paid', 'Balance', 'Status', 'Gate', ''].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#7A7570', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((o, i) => {
                const p = payInfo(o);
                const s = STATE[p.state] || STATE.awaiting;
                const job = o.job_name || o.customer_company || o.customer_name || '';
                const gateReady = p.state === 'paid' && o.artwork_status === 'approved';
                return (
                  <tr key={o.id} style={{ background: i % 2 === 0 ? '#fff' : BG, borderBottom: '1px solid #F0EEED' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: GOLD, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{o.order_number || o.invoice_number}</td>
                    <td style={{ padding: '12px 14px', color: NAVY }}>{job}</td>
                    <td style={{ padding: '12px 14px', color: '#5A5550' }}>{o.customer_name}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: NAVY, whiteSpace: 'nowrap' }}>{money(p.gross)}</td>
                    <td style={{ padding: '12px 14px', color: '#065F46', whiteSpace: 'nowrap' }}>{money(p.paid)}</td>
                    <td style={{ padding: '12px 14px', color: p.balance > 0 ? '#991B1B' : '#7A7570', fontWeight: p.balance > 0 ? 700 : 400, whiteSpace: 'nowrap' }}>{money(p.balance)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      {gateReady
                        ? <span style={{ color: '#065F46', fontWeight: 700, fontSize: '12px' }}>✅ Ready</span>
                        : <span style={{ color: '#B0AAA3', fontSize: '11px' }}>{o.artwork_status === 'approved' ? 'Awaiting payment' : 'Awaiting artwork'}</span>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.state !== 'paid' && (
                        <button onClick={() => openPay(o)}
                          style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Record payment
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {pay && (
        <div onClick={e => e.target === e.currentTarget && setPay(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '420px', width: '100%' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 4px' }}>Record payment</h2>
            <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 16px' }}>
              {pay.order_number || pay.invoice_number} · {pay.customer_name} · Balance {money(payInfo(pay).balance)}
            </p>
            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '15px', margin: '6px 0 14px', boxSizing: 'border-box' }} />
            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '6px 0 14px', boxSizing: 'border-box', background: '#fff' }}>
              <option value="eft">EFT Bank Transfer</option>
              <option value="card">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Note (optional)</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. 50% deposit"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '6px 0 18px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={submitPay} disabled={saving || !Number(amount)}
                style={{ flex: 1, background: !Number(amount) ? '#C8C4BC' : '#2D6A4F', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Saving...' : 'Record payment'}
              </button>
              <button onClick={() => setPay(null)}
                style={{ background: '#fff', color: '#7A7570', border: '1.5px solid #E0DDD7', borderRadius: '8px', padding: '12px 18px', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
