'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const STATUS_FLOW = [
  { key: 'pending',          label: 'Pending',           emoji: '🕐', bg: '#FEF3C7', color: '#92400E' },
  { key: 'artwork_sent',     label: 'Artwork Sent',       emoji: '🎨', bg: '#DBEAFE', color: '#1E40AF' },
  { key: 'artwork_approved', label: 'Artwork Approved',   emoji: '✅', bg: '#D1FAE5', color: '#065F46' },
  { key: 'in_production',    label: 'In Production',      emoji: '🏭', bg: '#EDE9FE', color: '#5B21B6' },
  { key: 'dispatched',       label: 'Dispatched',         emoji: '🚚', bg: '#FEF9C3', color: '#854D0E' },
  { key: 'delivered',        label: 'Delivered',          emoji: '📦', bg: '#DCFCE7', color: '#166534' },
  { key: 'cancelled',        label: 'Cancelled',          emoji: '✗',  bg: '#FEE2E2', color: '#991B1B' },
];

const STATUS_MAP = Object.fromEntries(STATUS_FLOW.map(s => [s.key, s]));

function deriveStatus(order) {
  const s = order.status;
  if (s === 'cancelled') return 'cancelled';
  if (s === 'in_production') return 'in_production';
  if (s === 'dispatched') return 'dispatched';
  if (s === 'delivered' || s === 'completed') return 'delivered';
  const a = order.artwork_status;
  if (a === 'approved') return 'artwork_approved';
  if (a === 'mockup_sent' || a === 'changes_requested') return 'artwork_sent';
  if (STATUS_MAP[s]) return s;
  return 'pending';
}

const PAYMENT_STATUS = {
  paid:    { bg: '#D1FAE5', color: '#065F46', label: 'Paid' },
  unpaid:  { bg: '#FEE2E2', color: '#991B1B', label: 'Unpaid' },
  pending: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [saving, setSaving]           = useState(false);

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    const updates = { status };
    const now = new Date().toISOString();
    if (status === 'artwork_approved') updates.artwork_approved_at = now;
    if (status === 'in_production')    updates.production_started_at = now;
    if (status === 'dispatched')       updates.dispatched_at = now;

    await supabase.from('orders').update(updates).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
  }

  async function saveDetails(id) {
    setSaving(true);
    const updates = {
      internal_notes: internalNote,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
    };
    await supabase.from('orders').update(updates).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
    setSaving(false);
  }

  function openDetail(order) {
    setSelected(order);
    setInternalNote(order.internal_notes || '');
    setTrackingNumber(order.tracking_number || '');
    setTrackingUrl(order.tracking_url || '');
  }

  const fmt = v => v != null ? `$${Number(v).toFixed(2)}` : '—';
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' }) : null;
  const fmtDateTime = d => d ? new Date(d).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null;

  const currentStatus = selected ? (STATUS_MAP[deriveStatus(selected)] || STATUS_FLOW[0]) : null;
  const shown = statusFilter ? orders.filter(o => deriveStatus(o) === statusFilter) : orders;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', textDecoration: 'none' }}>← Admin</Link>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: '#fff', margin: 0 }}>Orders</h1>
          <span style={{ background: GOLD, color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{orders.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button onClick={() => setStatusFilter('')}
            style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600, background: statusFilter === '' ? GOLD : 'rgba(255,255,255,.1)', color: '#fff' }}>
            All
          </button>
          {STATUS_FLOW.map(s => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)}
              style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600, background: statusFilter === s.key ? GOLD : 'rgba(255,255,255,.1)', color: '#fff' }}>
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>

        {/* LEFT — LIST */}
        <div style={{ width: selected ? '50%' : '100%', overflowY: 'auto', borderRight: '1px solid #E0DDD7', transition: 'width .2s' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
          ) : shown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>No orders yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fff', borderBottom: '2px solid #E0DDD7' }}>
                  {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#7A7570', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const st = STATUS_MAP[deriveStatus(order)] || STATUS_FLOW[0];
                  const pay = PAYMENT_STATUS[order.payment_status] || PAYMENT_STATUS.pending;
                  const isSelected = selected?.id === order.id;
                  const itemCount = Array.isArray(order.items) ? order.items.length : 0;
                  return (
                    <tr key={order.id} onClick={() => openDetail(order)}
                      style={{ background: isSelected ? '#FDF8F0' : i % 2 === 0 ? '#fff' : BG, borderBottom: '1px solid #F0EEED', cursor: 'pointer', borderLeft: isSelected ? `3px solid ${GOLD}` : '3px solid transparent' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: GOLD, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{order.invoice_number}</td>
                      <td style={{ padding: '12px 16px', color: '#7A7570', whiteSpace: 'nowrap' }}>{fmtDate(order.created_at)}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: NAVY }}>
                        <div>{order.customer_name}</div>
                        {order.customer_company && <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 400 }}>{order.customer_company}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#5A5550' }}>
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </td>
                      <td style={{ padding: '12px 16px', color: NAVY, fontWeight: 700 }}>{fmt(order.total)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: pay.bg, color: pay.color, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>{pay.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{st.emoji} {st.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <a href={`mailto:${order.customer_email}?subject=Re: Order ${order.invoice_number}`}
                          onClick={e => e.stopPropagation()}
                          style={{ color: GOLD, fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                          Reply →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT — DETAIL */}
        {selected && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: GOLD, fontWeight: 700, fontFamily: 'monospace', marginBottom: '4px' }}>{selected.invoice_number}</div>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 4px' }}>{selected.customer_name}</h2>
                <div style={{ fontSize: '13px', color: '#7A7570' }}>
                  {selected.customer_company && `${selected.customer_company} · `}
                  <a href={`mailto:${selected.customer_email}`} style={{ color: GOLD }}>{selected.customer_email}</a>
                  {selected.customer_phone && ` · ${selected.customer_phone}`}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#B0AAA3' }}>×</button>
            </div>

            {/* ORDER PROGRESS */}
            <div style={{ background: BG, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Order Progress</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {STATUS_FLOW.filter(s => s.key !== 'cancelled').map((s, i) => {
                  const statusKeys = STATUS_FLOW.filter(x => x.key !== 'cancelled').map(x => x.key);
                  const currentIdx = statusKeys.indexOf(selected.status);
                  const thisIdx = statusKeys.indexOf(s.key);
                  const isDone = thisIdx <= currentIdx;
                  const isCurrent = s.key === selected.status;
                  return (
                    <button key={s.key} onClick={() => updateStatus(selected.id, s.key)}
                      style={{ padding: '6px 12px', borderRadius: '20px', border: `2px solid ${isCurrent ? s.color : isDone ? '#D1FAE5' : '#E0DDD7'}`, background: isCurrent ? s.bg : isDone ? '#F0FDF4' : '#fff', color: isCurrent ? s.color : isDone ? '#166534' : '#B0AAA3', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                      {s.emoji} {s.label}
                    </button>
                  );
                })}
                <button onClick={() => updateStatus(selected.id, 'cancelled')}
                  style={{ padding: '6px 12px', borderRadius: '20px', border: `2px solid ${selected.status === 'cancelled' ? '#991B1B' : '#E0DDD7'}`, background: selected.status === 'cancelled' ? '#FEE2E2' : '#fff', color: selected.status === 'cancelled' ? '#991B1B' : '#B0AAA3', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  ✗ Cancel
                </button>
              </div>

              {/* Timeline */}
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#7A7570', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {selected.created_at && <span>🕐 Ordered: {fmtDateTime(selected.created_at)}</span>}
                {selected.artwork_approved_at && <span>✅ Approved: {fmtDateTime(selected.artwork_approved_at)}</span>}
                {selected.production_started_at && <span>🏭 Production: {fmtDateTime(selected.production_started_at)}</span>}
                {selected.dispatched_at && <span>🚚 Dispatched: {fmtDateTime(selected.dispatched_at)}</span>}
              </div>
            </div>

            {/* ORDER ITEMS */}
            <Section title="📦 Order Items">
              {Array.isArray(selected.items) && selected.items.map((item, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #F0EEED' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: NAVY, fontSize: '13px' }}>{item.productName}</div>
                      {item.colour && <div style={{ fontSize: '12px', color: '#7A7570' }}>Colour: {item.colour}</div>}
                      {item.addons?.map((a, j) => <div key={j} style={{ fontSize: '12px', color: '#7A7570' }}>+ {a.name}</div>)}
                      <div style={{ fontSize: '12px', color: '#7A7570' }}>Qty: {item.qty} × {fmt(item.unitPrice)}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: NAVY }}>{fmt(item.subtotal)}</div>
                  </div>
                </div>
              ))}
            </Section>

            {/* PRICING */}
            <Section title="💰 Payment">
              <Row label="Subtotal (excl. GST)" value={fmt(selected.subtotal)} />
              <Row label="Shipping" value={fmt(selected.shipping)} />
              <Row label="GST (10%)" value={fmt(selected.gst)} />
              <Row label="Total (incl. GST)" value={fmt(selected.total)} bold />
              <Row label="Payment Method" value={selected.payment_method === 'eft' ? 'EFT Bank Transfer' : 'Credit Card (Stripe)'} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <span style={{ color: '#7A7570', fontSize: '13px', width: '140px' }}>Payment Status</span>
                {['paid', 'unpaid'].map(p => {
                  const ps = PAYMENT_STATUS[p];
                  return (
                    <button key={p} onClick={async () => {
                      await supabase.from('orders').update({ payment_status: p }).eq('id', selected.id);
                      setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, payment_status: p } : o));
                      setSelected(prev => ({ ...prev, payment_status: p }));
                    }}
                      style={{ padding: '4px 12px', borderRadius: '20px', border: `2px solid ${selected.payment_status === p ? ps.color : '#E0DDD7'}`, background: selected.payment_status === p ? ps.bg : '#fff', color: selected.payment_status === p ? ps.color : '#B0AAA3', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      {ps.label}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* DELIVERY */}
            <Section title="🚚 Delivery">
              {selected.delivery_address && <Row label="Address" value={selected.delivery_address} />}

              {/* Tracking */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', color: '#7A7570', marginBottom: '6px', fontWeight: 600 }}>Tracking Details</div>
                <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Tracking number..."
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', marginBottom: '6px', boxSizing: 'border-box' }} />
                <input value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)}
                  placeholder="Tracking URL..."
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box' }} />
              </div>
            </Section>

            {/* INTERNAL NOTES */}
            <Section title="🔒 Internal Notes">
              <textarea value={internalNote} onChange={e => setInternalNote(e.target.value)}
                placeholder="Add internal notes, production details, supplier info..."
                rows={4}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', color: NAVY, outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }} />
              <button onClick={() => saveDetails(selected.id)} disabled={saving}
                style={{ marginTop: '8px', background: saving ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {saving ? 'Saving...' : 'Save Details'}
              </button>
            </Section>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <a href={`mailto:${selected.customer_email}?subject=Re: Order ${selected.invoice_number}`}
                style={{ flex: 1, display: 'block', background: GOLD, color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                📧 Email Customer
              </a>
              {selected.customer_phone && (
                <a href={`tel:${selected.customer_phone}`}
                  style={{ display: 'block', background: NAVY, color: '#fff', textAlign: 'center', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  📞 Call
                </a>
              )}
            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: '#B0AAA3', textAlign: 'center' }}>
              {selected.created_at && `Ordered ${new Date(selected.created_at).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #F0EEED' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, bold }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '13px' }}>
      <span style={{ color: '#7A7570', width: '140px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1B2A4A', fontWeight: bold ? 700 : 400, flex: 1 }}>{value}</span>
    </div>
  );
}
