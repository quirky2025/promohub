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
const BG = '#ffffff';

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
  const [deliveryAddr, setDeliveryAddr] = useState('');
  const [carrier, setCarrier] = useState('');
  const [saving, setSaving]           = useState(false);
  const [shipments, setShipments]     = useState([]);
  const [shipForm, setShipForm]       = useState({ carrier: '', trackingNumber: '', shipDate: '', recipientName: '', recipientEmail: '', address: '', contents: '', notify: true });
  const [shipBusy, setShipBusy]       = useState(false);

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
      delivery_address: deliveryAddr,
      internal_notes: internalNote,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
    };
    const res = await fetch('/api/admin/orders/update', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    setSaving(false);
    if (!res.ok) { alert('Save failed'); return; }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
  }

  async function fulfil(action) {
    if (!selected) return;
    setSaving(true);
    const res = await fetch('/api/admin/orders/fulfilment', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: selected.id, action, trackingNumber, trackingUrl: (function(){ const m = { 'Australia Post': tn => `https://auspost.com.au/mypost/track/#/details/${tn}`, 'FedEx': tn => `https://www.fedex.com/fedextrack/?trknbr=${tn}` }; return (!trackingUrl && trackingNumber && m[carrier]) ? m[carrier](trackingNumber) : trackingUrl; })(), carrier }),
    });
    setSaving(false);
    if (res.ok) {
      alert(action === 'dispatch' ? 'Dispatched — customer notified ✅' : action === 'delivered' ? 'Marked delivered — customer notified ✅' : 'Feedback request sent ✅');
      setSelected(null);
      fetchOrders();
    } else alert('Failed');
  }

  function openDetail(order) {
    setSelected(order);
    setInternalNote(order.internal_notes || '');
    setTrackingNumber(order.tracking_number || '');
    setTrackingUrl(order.tracking_url || '');
    setDeliveryAddr(order.delivery_address || '');
    setCarrier(order.carrier || '');
    setShipments([]);
    setShipForm({ carrier: '', trackingNumber: '', shipDate: '', recipientName: '', recipientEmail: '', address: '', contents: '', notify: true });
    fetchShipments(order.id);
  }

  async function fetchShipments(orderId) {
    try {
      const res = await fetch(`/api/admin/orders/shipments?orderId=${orderId}`, { cache: 'no-store' });
      const data = await res.json();
      setShipments(Array.isArray(data.shipments) ? data.shipments : []);
    } catch { setShipments([]); }
  }

  async function addShipment() {
    if (!selected) return;
    if (!shipForm.carrier && !shipForm.trackingNumber && !shipForm.contents) {
      alert('Add at least a carrier, tracking number, or contents for this parcel.');
      return;
    }
    setShipBusy(true);
    const res = await fetch('/api/admin/orders/shipments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: selected.id, ...shipForm, status: shipForm.shipDate ? 'shipped' : 'pending' }),
    });
    setShipBusy(false);
    if (!res.ok) { alert('Could not add shipment'); return; }
    setShipForm({ carrier: '', trackingNumber: '', shipDate: '', recipientName: '', recipientEmail: '', address: '', contents: '', notify: true });
    fetchShipments(selected.id);
  }

  async function patchShipment(id, body) {
    setShipBusy(true);
    const res = await fetch('/api/admin/orders/shipments', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    });
    setShipBusy(false);
    if (!res.ok) { alert('Update failed'); return; }
    if (selected) fetchShipments(selected.id);
  }

  async function deleteShipment(id) {
    if (!confirm('Delete this shipment?')) return;
    setShipBusy(true);
    await fetch(`/api/admin/orders/shipments?id=${id}`, { method: 'DELETE' });
    setShipBusy(false);
    if (selected) fetchShipments(selected.id);
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
              {Array.isArray(selected.items) && selected.items.map((item, i) => {
                const name = item.productName || item.product_description || item.name || 'Product';
                const sku = item.sku || item.stock_code || item.productSku || item.stockCode || '';
                const qty = item.qty ?? item.quantity;
                const unit = item.unitPrice ?? item.unit_price;
                const sub = item.subtotal ?? item.line_total;
                const branding = item.brandingMethod || item.decoration_method || '';
                const addons = Array.isArray(item.addons) ? item.addons : [];
                return (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #F0EEED' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: NAVY, fontSize: '13px' }}>{name}</div>
                      {sku && <div style={{ fontSize: '12px', color: '#000', fontFamily: 'monospace' }}>SKU: {sku}</div>}
                      {item.colour && <div style={{ fontSize: '12px', color: '#000' }}>Colour: {item.colour}</div>}
                      {branding && <div style={{ fontSize: '12px', color: '#000' }}>Branding: {branding}</div>}
                      {addons.map((a, j) => <div key={j} style={{ fontSize: '12px', color: '#000' }}>+ {a.name || a}</div>)}
                      <div style={{ fontSize: '12px', color: '#000' }}>Qty: {qty ?? '—'} × {fmt(unit)}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: NAVY }}>{fmt(sub)}</div>
                  </div>
                </div>
                );
              })}
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
              {/* Prominent, editable delivery address — CHECK before dispatch */}
              <div style={{ background: '#FFF8EC', border: `2px solid ${GOLD}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, marginBottom: '6px' }}>
                  📍 Delivery Address <span style={{ fontSize: '11px', fontWeight: 600, color: '#B45309' }}>— check &amp; confirm before dispatch</span>
                </div>
                <textarea value={deliveryAddr} onChange={e => setDeliveryAddr(e.target.value)} rows={3}
                  placeholder="Delivery address..."
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', color: NAVY, outline: 'none', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box', background: '#fff' }} />
                <button onClick={() => saveDetails(selected.id)} disabled={saving}
                  style={{ marginTop: '8px', background: saving ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  {saving ? 'Saving...' : 'Save address'}
                </button>
              </div>

              {/* Carrier + Tracking */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ fontSize: '12px', color: '#7A7570', marginBottom: '6px', fontWeight: 600 }}>Carrier</div>
                <select value={carrier} onChange={e => setCarrier(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', marginBottom: '10px', boxSizing: 'border-box', background: '#fff' }}>
                  <option value="">Select carrier…</option>
                  <option value="Australia Post">Australia Post</option>
                  <option value="FedEx">FedEx</option>
                  <option value="Direct Freight Express">Direct Freight Express</option>
                  <option value="Courier">Other / Courier</option>
                </select>
                <div style={{ fontSize: '12px', color: '#7A7570', marginBottom: '6px', fontWeight: 600 }}>Tracking Details</div>
                <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Tracking number..."
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', marginBottom: '6px', boxSizing: 'border-box' }} />
                <input value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)}
                  placeholder="Tracking URL..."
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box' }} />
              </div>

              {/* Fulfilment actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => fulfil('dispatch')} disabled={saving}
                  style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  🚚 Mark Dispatched &amp; Notify
                </button>
                <button onClick={() => fulfil('delivered')} disabled={saving}
                  style={{ background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '8px', padding: '9px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  📦 Mark Delivered &amp; Notify
                </button>
                <button onClick={() => fulfil('feedback')} disabled={saving}
                  style={{ background: '#fff', color: '#7A7570', border: '1.5px solid #E0DDD7', borderRadius: '8px', padding: '9px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  💬 Send Feedback Request
                </button>
              </div>
              <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '8px 0 0' }}>Tip: single-parcel orders can use the tracking above. For split orders sent to several addresses / over several days, use <strong>Shipments</strong> below.</p>
            </Section>

            {/* SHIPMENTS (multi-parcel) */}
            <Section title="📮 Shipments — split / multi-address delivery">
              <p style={{ fontSize: '12px', color: '#000', margin: '0 0 12px' }}>
                For orders sent in more than one parcel (different addresses or different days), add each parcel here. Each gets its own tracking, and you can notify {selected.customer_name?.split(' ')[0] || 'the customer'} per parcel.
              </p>

              {/* Existing shipments */}
              {shipments.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  {shipments.map((s) => {
                    const badge = s.status === 'delivered' ? { bg: '#DCFCE7', color: '#166534', label: '📦 Delivered' }
                      : s.status === 'shipped' ? { bg: '#FEF9C3', color: '#854D0E', label: '🚚 Shipped' }
                      : { bg: '#FEF3C7', color: '#92400E', label: '🕐 Pending' };
                    const dd = s.ship_date ? s.ship_date.split('-').reverse().join('/') : null;
                    return (
                      <div key={s.id} style={{ border: '1.5px solid #E0DDD7', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ fontWeight: 700, color: NAVY, fontSize: '13px' }}>Parcel {s.seq || '—'}{s.recipient_name ? ` · ${s.recipient_name}` : ''}{s.recipient_email ? ` · ${s.recipient_email}` : ''}</div>
                          <span style={{ background: badge.bg, color: badge.color, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>{badge.label}</span>
                        </div>
                        {s.contents && <div style={{ fontSize: '12px', color: '#000', marginBottom: '3px' }}><strong>Contents:</strong> {s.contents}</div>}
                        {s.address && <div style={{ fontSize: '12px', color: '#000', marginBottom: '3px' }}><strong>To:</strong> {s.address}</div>}
                        <div style={{ fontSize: '12px', color: '#000', marginBottom: '3px' }}>
                          {s.carrier || 'Carrier —'}{s.tracking_number ? ` · ${s.tracking_number}` : ''}{dd ? ` · shipped ${dd}` : ''}
                          {s.tracking_url && <> · <a href={s.tracking_url} target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 600 }}>Track →</a></>}
                        </div>
                        {s.notified_at && <div style={{ fontSize: '11px', color: '#166534', marginBottom: '4px' }}>✓ Customer notified</div>}
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                          {s.status !== 'shipped' && s.status !== 'delivered' && (
                            <button onClick={() => patchShipment(s.id, { status: 'shipped', notify: true })} disabled={shipBusy}
                              style={miniBtn('#C9A96E', '#fff')}>🚚 Mark shipped + notify</button>
                          )}
                          {s.status !== 'delivered' && (
                            <button onClick={() => patchShipment(s.id, { status: 'delivered', notify: false })} disabled={shipBusy}
                              style={miniBtn('#fff', NAVY, NAVY)}>📦 Mark delivered</button>
                          )}
                          <button onClick={() => patchShipment(s.id, { notify: true, status: s.status === 'pending' ? 'shipped' : s.status })} disabled={shipBusy}
                            style={miniBtn('#fff', '#000', '#E0DDD7')}>✉️ Notify</button>
                          <button onClick={() => deleteShipment(s.id)} disabled={shipBusy}
                            style={miniBtn('#fff', '#991B1B', '#E0DDD7')}>Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add shipment form */}
              <div style={{ background: '#FDFBF7', border: '1.5px dashed #D8CFC0', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, marginBottom: '10px' }}>➕ Add a parcel</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <select value={shipForm.carrier} onChange={e => setShipForm(f => ({ ...f, carrier: e.target.value }))} style={shipInput}>
                    <option value="">Carrier…</option>
                    <option value="FedEx">FedEx</option>
                    <option value="Australia Post">Australia Post</option>
                    <option value="StarTrack">StarTrack</option>
                    <option value="Direct Freight Express">Direct Freight Express</option>
                    <option value="Courier">Other / Courier</option>
                  </select>
                  <input value={shipForm.trackingNumber} onChange={e => setShipForm(f => ({ ...f, trackingNumber: e.target.value }))} placeholder="Tracking number" style={shipInput} />
                  <input value={shipForm.recipientName} onChange={e => setShipForm(f => ({ ...f, recipientName: e.target.value }))} placeholder="Recipient name (e.g. Sarah)" style={shipInput} />
                  <input type="email" value={shipForm.recipientEmail} onChange={e => setShipForm(f => ({ ...f, recipientEmail: e.target.value }))} placeholder="Recipient email (tracking goes here)" style={shipInput} />
                  <input type="date" value={shipForm.shipDate} onChange={e => setShipForm(f => ({ ...f, shipDate: e.target.value }))} style={shipInput} />
                </div>
                <input value={shipForm.address} onChange={e => setShipForm(f => ({ ...f, address: e.target.value }))} placeholder="Delivery address for this parcel" style={{ ...shipInput, width: '100%', marginBottom: '8px', boxSizing: 'border-box' }} />
                <input value={shipForm.contents} onChange={e => setShipForm(f => ({ ...f, contents: e.target.value }))} placeholder="Contents, e.g. Badges ×4, Shirts ×2" style={{ ...shipInput, width: '100%', marginBottom: '8px', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', color: '#000', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={shipForm.notify} onChange={e => setShipForm(f => ({ ...f, notify: e.target.checked }))} />
                    Email {shipForm.recipientEmail ? shipForm.recipientEmail : 'the recipient'} this tracking{shipForm.recipientEmail ? '' : ' (falls back to buyer)'}
                  </label>
                  <button onClick={addShipment} disabled={shipBusy}
                    style={{ background: shipBusy ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '12px', fontWeight: 700, cursor: shipBusy ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    {shipBusy ? 'Saving…' : 'Add parcel'}
                  </button>
                </div>
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

const shipInput = { padding: '8px 10px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', color: '#000', outline: 'none', background: '#fff' };

function miniBtn(bg, color, border) {
  return { background: bg, color, border: border ? `1.5px solid ${border}` : 'none', borderRadius: '7px', padding: '6px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' };
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
