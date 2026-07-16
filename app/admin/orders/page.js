'use client';
// admin orders board — per-item artwork approval + production gate + invoice PDF

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import OrderDocuments from '@/components/OrderDocuments';
import { tierMargin, SHIPPING, GST } from '@/lib/pricing';

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

// Per-line-item stages (a single order can have some items shipped, some still in production)
const ITEM_STAGES = [
  { key: 'in_production', label: 'In Production', emoji: '🏭', bg: '#EDE9FE', color: '#5B21B6' },
  { key: 'dispatched',    label: 'Dispatched',    emoji: '🚚', bg: '#FEF9C3', color: '#854D0E' },
  { key: 'delivered',     label: 'Delivered',     emoji: '📦', bg: '#DCFCE7', color: '#166534' },
];

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

const CARRIERS = ['Australia Post', 'StarTrack', 'FedEx', 'DHL', 'TNT', 'Direct Freight Express', 'Courier'];

// Simplified list status — Lily wants the board to show only two states.
function simpleStatus(order) {
  const d = deriveStatus(order);
  if (d === 'cancelled') return { label: 'Cancelled', bg: '#FEE2E2', color: '#991B1B' };
  if (d === 'delivered') return { label: 'Completed', bg: '#DCFCE7', color: '#166534' };
  return { label: 'In Process', bg: '#DBEAFE', color: '#1E40AF' };
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
  const [editShipId, setEditShipId]   = useState(null);
  const [editShipForm, setEditShipForm] = useState({});
  const [showNew, setShowNew]         = useState(false);
  const [artworkBusy, setArtworkBusy] = useState(false);

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

  // Production gate: an order may only enter production once BOTH
  //   (1) artwork is approved  AND  (2) payment has been received.
  function prodBlockReason(o) {
    if (!o) return '';
    const approved = o.artwork_status === 'approved';
    const paid = o.payment_status === 'paid';
    if (approved && paid) return '';
    return `Can't start production yet:\n${approved ? '✓' : '✗'} Artwork approved\n${paid ? '✓' : '✗'} Payment received\n\nBoth are required before production.`;
  }

  async function updateStatus(id, status) {
    const o = orders.find(x => x.id === id) || (selected?.id === id ? selected : null);
    if (status === 'in_production') {
      const reason = prodBlockReason(o);
      if (reason) { alert(reason); return; }
    }
    const updates = { status };
    const now = new Date().toISOString();
    if (status === 'artwork_approved') updates.artwork_approved_at = now;
    if (status === 'in_production')    updates.production_started_at = now;
    if (status === 'dispatched')       updates.dispatched_at = now;

    await supabase.from('orders').update(updates).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
  }

  const [artBusyIdx, setArtBusyIdx] = useState(null);

  // Per-item artwork approval. Persists items[index].artwork_approved server-side;
  // the order-level artwork_status rolls up to 'approved' only when ALL items are.
  async function applyItemArtwork(index, { approved, fileUrl, fileName }) {
    try {
      const res = await fetch('/api/admin/orders/item-artwork', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selected.id, index, approved, fileUrl, fileName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert('Could not update artwork: ' + (data.error || `HTTP ${res.status}`)); return; }
      const patch = { items: data.items, artwork_status: data.artwork_status, artwork_approved_at: data.artwork_approved_at };
      setSelected(prev => ({ ...prev, ...patch }));
      setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, ...patch } : o));
    } catch (e) { alert('Could not update artwork: ' + (e?.message || 'network error')); }
  }

  // Upload the customer-approved artwork for ONE product → saved as evidence,
  // then that item is marked approved.
  async function uploadItemArtwork(index, file) {
    if (!file || !selected) return;
    setArtBusyIdx(index);
    try {
      const it = (selected.items || [])[index] || {};
      const pname = it.productName || it.product_description || it.name || `item ${index + 1}`;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('orderNumber', selected.invoice_number || selected.order_number);
      fd.append('docType', 'approved_artwork');
      fd.append('title', `Approved artwork — ${pname}`);
      const up = await fetch('/api/admin/orders/documents', { method: 'POST', body: fd });
      const upData = await up.json().catch(() => ({}));
      if (!up.ok) { alert('Upload failed: ' + (upData.error || `HTTP ${up.status}`)); setArtBusyIdx(null); return; }
      await applyItemArtwork(index, { approved: true, fileUrl: upData.document?.file_url, fileName: upData.document?.file_name });
    } catch (e) { alert('Upload failed: ' + (e?.message || 'network error')); }
    setArtBusyIdx(null);
  }

  const [orderDocs, setOrderDocs]   = useState([]);
  const [freightEdit, setFreightEdit] = useState({});
  const [docBusy, setDocBusy]       = useState(null);

  async function fetchDocs(orderNumber) {
    if (!orderNumber) { setOrderDocs([]); return; }
    try {
      const res = await fetch(`/api/admin/orders/documents?orderNumber=${encodeURIComponent(orderNumber)}`, { cache: 'no-store' });
      const data = await res.json();
      setOrderDocs(Array.isArray(data.documents) ? data.documents : []);
    } catch { setOrderDocs([]); }
  }

  // Parcels for a product: use the in-progress edit if present, else what's saved
  // on the item (fall back to legacy single freight fields, else one blank row).
  function parcelsOf(index, item) {
    if (freightEdit[index]) return freightEdit[index];
    if (Array.isArray(item.parcels) && item.parcels.length) return item.parcels;
    if (item.freight_carrier || item.freight_tracking || item.freight_deliver_to) {
      return [{ carrier: item.freight_carrier || '', tracking: item.freight_tracking || '', deliverTo: item.freight_deliver_to || '' }];
    }
    return [{ carrier: '', tracking: '', deliverTo: '' }];
  }
  const editParcels = (index, item, fn) => setFreightEdit(prev => {
    const cur = prev[index] ? prev[index].map(p => ({ ...p })) : parcelsOf(index, item).map(p => ({ ...p }));
    const next = fn(cur) || cur;
    return { ...prev, [index]: next };
  });
  const setParcel = (index, item, pIdx, key, val) => editParcels(index, item, cur => { cur[pIdx] = { ...cur[pIdx], [key]: val }; return cur; });
  const addParcel = (index, item) => editParcels(index, item, cur => { cur.push({ carrier: '', tracking: '', deliverTo: '' }); return cur; });
  const removeParcel = (index, item, pIdx) => editParcels(index, item, cur => { cur.splice(pIdx, 1); return cur.length ? cur : [{ carrier: '', tracking: '', deliverTo: '' }]; });

  async function saveItemFreight(index, item) {
    const parcels = (freightEdit[index] ?? parcelsOf(index, item)).filter(p => p.carrier || p.tracking || p.deliverTo);
    try {
      const res = await fetch('/api/admin/orders/item-freight', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selected.id, index, parcels }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert('Could not save freight: ' + (data.error || '')); return; }
      setSelected(prev => ({ ...prev, items: data.items }));
      setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, items: data.items } : o));
      setFreightEdit(prev => { const n = { ...prev }; delete n[index]; return n; });
    } catch { alert('Could not save freight'); }
  }

  const [notifyEmail, setNotifyEmail] = useState({});
  async function notifyShipment(index, parcelIndex, pc) {
    if (freightEdit[index]) { alert('Save freight first, then Notify.'); return; }
    const key = `${index}:${parcelIndex}`;
    const to = (notifyEmail[key] ?? pc.notifyEmail ?? selected.customer_email ?? '').trim();
    if (!to) { alert('Enter a recipient email.'); return; }
    if (!pc.carrier && !pc.tracking) { alert('Add carrier + tracking (and Save freight) first.'); return; }
    if (!confirm(`Email the shipping notice for product ${index + 1} to ${to}?`)) return;
    try {
      const res = await fetch('/api/admin/orders/notify-shipment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selected.id, index, parcelIndex, to }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert('Notify failed: ' + (data.error || '')); return; }
      if (data.items) {
        setSelected(prev => ({ ...prev, items: data.items }));
        setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, items: data.items } : o));
      }
      alert('Shipping notice sent ✅');
    } catch { alert('Notify failed'); }
  }

  // Revise a line to its FINAL spec / price (order recomputes; a paid order
  // captures amount_paid so a credit note / balance can be worked out).
  const [itemEdit, setItemEdit] = useState({});
  const [cnReason, setCnReason] = useState('');
  const startItemEdit = (i, item) => setItemEdit(p => ({ ...p, [i]: {
    branding: item.brandingMethod || item.branding || '',
    unitPrice: String(item.unitPrice ?? item.unit_price ?? ''),
    qty: String(item.qty ?? item.quantity ?? ''),
  } }));
  const cancelItemEdit = (i) => setItemEdit(p => { const n = { ...p }; delete n[i]; return n; });
  const setIE = (i, k, v) => setItemEdit(p => ({ ...p, [i]: { ...p[i], [k]: v } }));
  async function saveItemEdit(i) {
    const f = itemEdit[i] || {};
    try {
      const res = await fetch('/api/admin/orders/item-edit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selected.id, index: i, branding: f.branding, unitPrice: f.unitPrice, qty: f.qty }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert('Could not save: ' + (data.error || '')); return; }
      setSelected(data.order);
      setOrders(prev => prev.map(o => o.id === selected.id ? data.order : o));
      cancelItemEdit(i);
    } catch { alert('Could not save'); }
  }

  async function uploadItemDoc(index, docType, file) {
    if (!file || !selected) return;
    setDocBusy(`${index}:${docType}`);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('orderNumber', selected.invoice_number || selected.order_number);
      fd.append('docType', docType);
      fd.append('orderItemIndex', String(index));
      const res = await fetch('/api/admin/orders/documents', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert('Upload failed: ' + (data.error || `HTTP ${res.status}`)); setDocBusy(null); return; }
      fetchDocs(selected.invoice_number || selected.order_number);
    } catch (e) { alert('Upload failed: ' + (e?.message || 'network error')); }
    setDocBusy(null);
  }

  // Create one artwork card per product for this order (old/offline orders that
  // have no artwork records yet) → they appear on the Artwork Management board.
  async function sendForArtworkApproval() {
    if (!selected) return;
    setArtworkBusy(true);
    try {
      const res = await fetch('/api/admin/orders/create-artworks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selected.id }),
      });
      const data = await res.json();
      if (!res.ok) { alert('Failed: ' + (data.error || '')); setArtworkBusy(false); return; }
      alert(data.created > 0
        ? `Created ${data.created} artwork card(s). Go to Artwork Management to upload & send each product's proof.`
        : 'Artwork cards already exist for every product — open Artwork Management to send the proofs.');
    } catch { alert('Failed'); }
    setArtworkBusy(false);
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
    setFreightEdit({});
    fetchDocs(order.invoice_number || order.order_number);
  }

  async function setItemStatus(index, status) {
    const items = (selected.items || []).map((it, i) => i === index ? { ...it, status } : it);
    setSelected(prev => ({ ...prev, items }));
    setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, items } : o));
    try {
      const res = await fetch('/api/admin/orders/item-status', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selected.id, index, status }),
      });
      const data = await res.json();
      if (!res.ok) { alert('Could not update item status'); return; }
      if (data.overall) {
        setSelected(prev => ({ ...prev, status: data.overall }));
        setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, status: data.overall } : o));
      }
    } catch { alert('Could not update item status'); }
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

  function startEditShip(s) {
    setEditShipId(s.id);
    setEditShipForm({
      carrier: s.carrier || '', trackingNumber: s.tracking_number || '',
      recipientName: s.recipient_name || '', recipientEmail: s.recipient_email || '',
      address: s.address || '', contents: s.contents || '', shipDate: s.ship_date || '',
    });
  }
  async function saveEditShip() {
    if (!editShipId) return;
    await patchShipment(editShipId, editShipForm);
    setEditShipId(null);
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

  // Addresses already known for this order → offered in the "Deliver to" pickers.
  const knownAddresses = (() => {
    const out = [];
    const push = (a) => { const s = (a || '').trim(); if (s && !out.includes(s)) out.push(s); };
    if (selected) {
      push(selected.delivery_address);
      const j = selected.delivery_address_json;
      if (j) push([j.line1, j.line2, j.suburb, j.state, j.postcode].filter(Boolean).join(', '));
      (shipments || []).forEach(s => push(s.address));
      (selected.items || []).forEach(it => (it.parcels || []).forEach(p => push(p.deliverTo)));
    }
    return out;
  })();

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', textDecoration: 'none' }}>← Admin</Link>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: '#fff', margin: 0 }}>Orders</h1>
          <span style={{ background: GOLD, color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{orders.length}</span>
          <button onClick={() => setShowNew(true)}
            style={{ background: '#fff', color: NAVY, border: 'none', borderRadius: '8px', padding: '7px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            ＋ New Order
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>

        {/* LEFT — LIST (hidden full-screen when an order is open) */}
        <div style={{ display: selected ? 'none' : 'block', width: '100%', overflowY: 'auto', borderRight: '1px solid #E0DDD7' }}>
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
                  const st = simpleStatus(order);
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
                        <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{st.label}</span>
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

        {/* RIGHT — DETAIL (full width, one product per block) */}
        {selected && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', background: '#fff' }}>
           <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: NAVY, padding: 0, marginBottom: '12px' }}>← Back to orders</button>
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
            </div>

            {/* PAYMENT RECEIVED banner (whole order, one combined invoice) */}
            {(() => {
              const paid = selected.payment_status === 'paid';
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', background: paid ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${paid ? '#BBF7D0' : '#FDE68A'}`, borderRadius: '10px', padding: '10px 16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: paid ? '#166534' : '#92400E' }}>
                    {paid ? '✅ Payment received' : '⏳ Payment not received'} — {fmt(selected.total)}
                  </div>
                  <button onClick={() => window.open(`/api/admin/orders/invoice-pdf?id=${selected.id}`, '_blank')}
                    style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    🧾 Generate Tax Invoice
                  </button>
                </div>
              );
            })()}

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
                  const gated = s.key === 'in_production' && !!prodBlockReason(selected);
                  return (
                    <button key={s.key} onClick={() => updateStatus(selected.id, s.key)}
                      title={gated ? 'Needs artwork approved + payment received' : ''}
                      style={{ padding: '6px 12px', borderRadius: '20px', border: `2px solid ${gated ? '#E0DDD7' : isCurrent ? s.color : isDone ? '#D1FAE5' : '#E0DDD7'}`, background: gated ? '#F5F3F0' : isCurrent ? s.bg : isDone ? '#F0FDF4' : '#fff', color: gated ? '#B0AAA3' : isCurrent ? s.color : isDone ? '#166534' : '#B0AAA3', fontSize: '12px', fontWeight: 700, cursor: gated ? 'not-allowed' : 'pointer', opacity: gated ? 0.7 : 1, fontFamily: '"DM Sans", sans-serif' }}>
                      {gated ? '🔒 ' : ''}{s.emoji} {s.label}
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

            {/* PRODUCTION GATE — summary (upload/approve is per product, below) */}
            {(() => {
              const its = Array.isArray(selected.items) ? selected.items : [];
              const nApproved = its.filter(it => it.artwork_approved).length;
              const artOk = its.length > 0 && nApproved === its.length;
              const paid = selected.payment_status === 'paid';
              const ready = artOk && paid;
              const chip = (ok, label) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 700, background: ok ? '#D1FAE5' : '#FEE2E2', color: ok ? '#065F46' : '#991B1B' }}>
                  {ok ? '✓' : '✗'} {label}
                </span>
              );
              return (
                <div style={{ background: ready ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${ready ? '#BBF7D0' : '#FDE68A'}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Production Gate — both required</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {chip(artOk, `Artwork approved (${nApproved}/${its.length})`)}
                    {chip(paid, 'Payment received')}
                    {ready
                      ? <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>→ Ready for production ✅</span>
                      : <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>→ Production locked 🔒</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A7570', marginTop: '9px' }}>
                    Approve each product's artwork below (upload the approved file). Payment is marked in the Payment section.
                  </div>
                </div>
              );
            })()}

            {/* SEND PRODUCTS FOR ONLINE ARTWORK APPROVAL */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
              <button onClick={sendForArtworkApproval} disabled={artworkBusy}
                style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 700, cursor: artworkBusy ? 'wait' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {artworkBusy ? '⏳ Creating…' : '🎨 Send for artwork approval'}
              </button>
              <Link href="/admin/artworks" style={{ fontSize: '12px', color: GOLD, fontWeight: 700, textDecoration: 'none' }}>Open Artwork Management →</Link>
              <span style={{ fontSize: '11px', color: '#7A7570' }}>Creates one proof card per product; upload &amp; send each from the Artwork board.</span>
            </div>

            <datalist id="deliverToOpts">
              {knownAddresses.map(a => <option key={a} value={a} />)}
            </datalist>

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
                const istatus = item.status || 'in_production';
                return (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #F0EEED' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: GOLD, fontWeight: 700, fontFamily: 'monospace' }}>{selected.invoice_number}-{i + 1}</div>
                      <div style={{ fontWeight: 600, color: NAVY, fontSize: '13px' }}>{name}</div>
                      {sku && <div style={{ fontSize: '12px', color: '#000', fontFamily: 'monospace' }}>SKU: {sku}</div>}
                      {item.colour && <div style={{ fontSize: '12px', color: '#000' }}>Colour: {item.colour}</div>}
                      {branding && <div style={{ fontSize: '12px', color: '#000' }}>Branding: {branding}</div>}
                      {addons.map((a, j) => <div key={j} style={{ fontSize: '12px', color: '#000' }}>+ {a.name || a}</div>)}
                      <div style={{ fontSize: '12px', color: '#000' }}>Qty: {qty ?? '—'} × {fmt(unit)}</div>
                      {itemEdit[i] ? (
                        <div style={{ marginTop: '6px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '8px 10px' }}>
                          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4px', color: '#92400E', fontWeight: 700, marginBottom: '6px' }}>Revise to final spec</div>
                          <input value={itemEdit[i].branding} onChange={e => setIE(i, 'branding', e.target.value)} placeholder="Branding (final, e.g. Digital Print / 3 colour)" style={{ ...shipInput, width: '100%', marginBottom: '6px', boxSizing: 'border-box' }} />
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: '#7A7570' }}>Qty</span>
                            <input value={itemEdit[i].qty} onChange={e => setIE(i, 'qty', e.target.value)} inputMode="numeric" style={{ ...shipInput, width: '70px' }} />
                            <span style={{ fontSize: '11px', color: '#7A7570' }}>Unit $</span>
                            <input value={itemEdit[i].unitPrice} onChange={e => setIE(i, 'unitPrice', e.target.value)} inputMode="decimal" style={{ ...shipInput, width: '90px' }} />
                            <button onClick={() => saveItemEdit(i)} style={miniBtn(NAVY, '#fff')}>Save</button>
                            <button onClick={() => cancelItemEdit(i)} style={miniBtn('#fff', '#7A7570', '#E0DDD7')}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => startItemEdit(i, item)} style={{ marginTop: '4px', background: 'none', border: 'none', color: GOLD, fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: 0 }}>✎ Edit final spec / price</button>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, color: NAVY }}>{fmt(sub)}</div>
                  </div>
                  {/* per-product ARTWORK approval */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {item.artwork_approved ? (
                      <>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '16px', fontSize: '11px', fontWeight: 700, background: '#D1FAE5', color: '#065F46' }}>✓ Artwork approved</span>
                        {item.artwork_url && <a href={item.artwork_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', fontWeight: 700, color: NAVY }}>View file →</a>}
                        <button onClick={() => applyItemArtwork(i, { approved: false })} style={{ fontSize: '11px', fontWeight: 700, color: '#991B1B', background: 'none', border: 'none', cursor: 'pointer' }}>Reopen</button>
                      </>
                    ) : (
                      <>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '16px', fontSize: '11px', fontWeight: 700, background: '#FEF3C7', color: '#92400E' }}>⏳ Artwork pending</span>
                        <label style={{ display: 'inline-block' }}>
                          <input type="file" style={{ display: 'none' }} disabled={artBusyIdx === i}
                            onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) uploadItemArtwork(i, f); }} />
                          <span style={{ display: 'inline-block', padding: '5px 11px', borderRadius: '7px', background: NAVY, color: '#fff', fontSize: '11px', fontWeight: 700, cursor: artBusyIdx === i ? 'wait' : 'pointer' }}>
                            {artBusyIdx === i ? '⏳ Uploading…' : '⬆ Upload approved artwork'}
                          </span>
                        </label>
                        <button onClick={() => { if (confirm("Mark this product's artwork approved (approved offline)?")) applyItemArtwork(i, { approved: true }); }}
                          style={{ fontSize: '11px', fontWeight: 700, color: NAVY, background: 'none', border: `1.5px solid ${NAVY}`, borderRadius: '7px', padding: '4px 10px', cursor: 'pointer' }}>✓ Mark approved</button>
                      </>
                    )}
                  </div>
                  {/* per-product stage */}
                  <div style={{ display: 'flex', gap: '5px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {ITEM_STAGES.map(s => {
                      const on = istatus === s.key;
                      return (
                        <button key={s.key} onClick={() => setItemStatus(i, s.key)}
                          style={{ padding: '4px 10px', borderRadius: '20px', border: `1.5px solid ${on ? s.color : '#E0DDD7'}`, background: on ? s.bg : '#fff', color: on ? s.color : '#000', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                          {s.emoji} {s.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* per-product FREIGHT — one or more parcels (a product can ship to >1 address) */}
                  <div style={{ marginTop: '10px', background: '#FAF8F4', borderRadius: '8px', padding: '9px 11px' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4px', color: '#7A7570', marginBottom: '6px', fontWeight: 700 }}>🚚 Freight — this product ({parcelsOf(i, item).length} parcel{parcelsOf(i, item).length !== 1 ? 's' : ''})</div>
                    {parcelsOf(i, item).map((pc, pIdx) => {
                      const nkey = `${i}:${pIdx}`;
                      const emailVal = notifyEmail[nkey] ?? pc.notifyEmail ?? selected.customer_email ?? '';
                      const multi = parcelsOf(i, item).length > 1;
                      return (
                      <div key={pIdx} style={{ marginBottom: '8px', paddingBottom: multi ? '8px' : '0', borderBottom: multi ? '1px dashed #E8E2D6' : 'none' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#7A7570', width: '16px' }}>{pIdx + 1}.</span>
                          <select value={pc.carrier || ''} onChange={e => setParcel(i, item, pIdx, 'carrier', e.target.value)} style={{ ...shipInput, width: '150px', cursor: 'pointer' }}>
                            <option value="">Carrier…</option>
                            {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <input placeholder="Tracking #" value={pc.tracking || ''} onChange={e => setParcel(i, item, pIdx, 'tracking', e.target.value)} style={{ ...shipInput, width: '125px', fontFamily: 'monospace' }} />
                          <input list="deliverToOpts" placeholder="Deliver to — pick or type" value={pc.deliverTo || ''} onChange={e => setParcel(i, item, pIdx, 'deliverTo', e.target.value)} style={{ ...shipInput, flex: 1, minWidth: '150px' }} />
                          {multi && <button onClick={() => removeParcel(i, item, pIdx)} title="Remove this address" style={{ background: 'none', border: 'none', color: '#B4413E', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>✕</button>}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginTop: '5px', marginLeft: '22px' }}>
                          <span style={{ fontSize: '11px', color: '#7A7570' }}>Notify</span>
                          <input placeholder="customer email" value={emailVal} onChange={e => setNotifyEmail(p => ({ ...p, [nkey]: e.target.value }))} style={{ ...shipInput, width: '210px' }} />
                          <button onClick={() => notifyShipment(i, pIdx, pc)} style={miniBtn('#166534', '#fff')}>📧 Notify customer</button>
                          {pc.notified_at && <span style={{ fontSize: '10px', color: '#166534' }}>✓ sent {fmtDateTime(pc.notified_at)}</span>}
                        </div>
                      </div>
                      );
                    })}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <button onClick={() => addParcel(i, item)} style={miniBtn('#fff', NAVY, NAVY)}>＋ Add address</button>
                      <button onClick={() => saveItemFreight(i, item)} style={miniBtn(NAVY, '#fff')}>Save freight</button>
                    </div>
                  </div>

                  {/* per-product DOCUMENTS */}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4px', color: '#7A7570', marginBottom: '6px', fontWeight: 700 }}>Documents — this product</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[['invoice', '🧾 Invoice'], ['product_photo', '📷 Product photo'], ['supplier_payment_proof', '💳 Supplier payment proof']].map(([dt, label]) => (
                        <label key={dt} style={{ display: 'inline-block' }}>
                          <input type="file" style={{ display: 'none' }} disabled={docBusy === `${i}:${dt}`} onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) uploadItemDoc(i, dt, f); }} />
                          <span style={{ display: 'inline-block', fontSize: '11px', border: '1px solid #E0DDD7', borderRadius: '8px', padding: '5px 10px', color: NAVY, fontWeight: 700, cursor: docBusy === `${i}:${dt}` ? 'wait' : 'pointer' }}>{docBusy === `${i}:${dt}` ? '⏳ Uploading…' : '⬆ ' + label}</span>
                        </label>
                      ))}
                    </div>
                    {orderDocs.filter(d => d.order_item_index === i).length > 0 && (
                      <div style={{ marginTop: '6px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {orderDocs.filter(d => d.order_item_index === i).map(d => (
                          <a key={d.id} href={d.file_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: GOLD, textDecoration: 'none' }}>📎 {d.file_name || d.title} ↗</a>
                        ))}
                      </div>
                    )}
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
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F0EEED', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => window.open(`/api/admin/orders/invoice-pdf?id=${selected.id}`, '_blank')}
                  style={{ padding: '9px 16px', borderRadius: '8px', background: GOLD, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  🧾 Generate Tax Invoice (PDF)
                </button>
                <span style={{ fontSize: '11px', color: '#7A7570', alignSelf: 'center' }}>Opens a PDF you can save or send to the customer.</span>
              </div>

              {/* ADJUSTMENT — final spec changed after payment → credit / balance */}
              {selected.amount_paid != null && Math.abs((Number(selected.total) || 0) - Number(selected.amount_paid)) >= 0.01 && (() => {
                const paidAmt = Number(selected.amount_paid);
                const delta = Math.round(((Number(selected.total) || 0) - paidAmt) * 100) / 100;
                const credit = delta < 0;
                return (
                  <div style={{ marginTop: '14px', background: credit ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${credit ? '#BBF7D0' : '#FDE68A'}`, borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Order adjustment (final spec changed)</div>
                    <div style={{ fontSize: '13px', color: '#000', marginBottom: '2px' }}>Customer paid: <strong>{fmt(paidAmt)}</strong> · Revised total: <strong>{fmt(selected.total)}</strong></div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: credit ? '#166534' : '#92400E', marginBottom: '10px' }}>
                      {credit ? `↩ Credit due to customer: ${fmt(Math.abs(delta))}` : `➕ Balance owing from customer: ${fmt(delta)}`}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input value={cnReason} onChange={e => setCnReason(e.target.value)} placeholder="Reason (e.g. Pen: pad print → digital print)" style={{ ...shipInput, flex: 1, minWidth: '220px' }} />
                      <button onClick={() => window.open(`/api/admin/orders/credit-note-pdf?id=${selected.id}&reason=${encodeURIComponent(cnReason)}`, '_blank')}
                        style={{ padding: '9px 16px', borderRadius: '8px', background: NAVY, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                        {credit ? '🧾 Generate Credit Note' : '🧾 Generate Balance Invoice'}
                      </button>
                    </div>
                  </div>
                );
              })()}
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
                          <button onClick={() => startEditShip(s)} disabled={shipBusy}
                            style={miniBtn('#fff', '#000', '#E0DDD7')}>✏️ 编辑</button>
                          <button onClick={() => deleteShipment(s.id)} disabled={shipBusy}
                            style={miniBtn('#fff', '#991B1B', '#E0DDD7')}>Delete</button>
                        </div>
                        {editShipId === s.id && (
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #E0DDD7', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            <select value={editShipForm.carrier} onChange={e => setEditShipForm(f => ({ ...f, carrier: e.target.value }))} style={shipInput}>
                              <option value="">Carrier…</option>
                              <option value="FedEx">FedEx</option>
                              <option value="Australia Post">Australia Post</option>
                              <option value="StarTrack">StarTrack</option>
                              <option value="Direct Freight Express">Direct Freight Express</option>
                              <option value="Courier">Other / Courier</option>
                            </select>
                            <input value={editShipForm.trackingNumber} onChange={e => setEditShipForm(f => ({ ...f, trackingNumber: e.target.value }))} placeholder="Tracking number" style={shipInput} />
                            <input value={editShipForm.recipientName} onChange={e => setEditShipForm(f => ({ ...f, recipientName: e.target.value }))} placeholder="Recipient name" style={shipInput} />
                            <input type="email" value={editShipForm.recipientEmail} onChange={e => setEditShipForm(f => ({ ...f, recipientEmail: e.target.value }))} placeholder="Recipient email" style={shipInput} />
                            <input type="date" value={editShipForm.shipDate} onChange={e => setEditShipForm(f => ({ ...f, shipDate: e.target.value }))} style={shipInput} />
                            <input value={editShipForm.address} onChange={e => setEditShipForm(f => ({ ...f, address: e.target.value }))} placeholder="Delivery address" style={{ ...shipInput, gridColumn: '1 / -1' }} />
                            <input value={editShipForm.contents} onChange={e => setEditShipForm(f => ({ ...f, contents: e.target.value }))} placeholder="Contents" style={{ ...shipInput, gridColumn: '1 / -1' }} />
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '6px', marginTop: '2px' }}>
                              <button onClick={saveEditShip} disabled={shipBusy} style={{ ...miniBtn(NAVY, '#fff'), padding: '7px 16px' }}>{shipBusy ? '保存中…' : '保存'}</button>
                              <button onClick={() => setEditShipId(null)} style={miniBtn('#fff', '#000', '#E0DDD7')}>取消</button>
                            </div>
                          </div>
                        )}
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

            {/* DOCUMENTS / EVIDENCE VAULT */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #F0EEED' }}>
              <OrderDocuments orderNumber={selected.invoice_number || selected.order_number} />
            </div>

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
          </div>
        )}
      </div>

      {showNew && <NewOrderModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); fetchOrders(); }} />}
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

// ─── New Order (backend create for old / offline customers) ───
const niStyle = { width: '100%', padding: '9px 11px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', color: '#000', boxSizing: 'border-box', background: '#fff', outline: 'none' };
const niLabel = { fontSize: '11px', fontWeight: 700, color: '#1B2A4A', marginBottom: '4px', display: 'block' };
const money2 = (n) => '$' + (Number(n) || 0).toFixed(2);
function blankNewItem() { return { sku: '', name: '', colour: '', branding: '', qty: '', unitPrice: '', tiers: null, results: [], searching: false }; }

// Sell unit price for a qty from catalog cost tiers (base cost × tier margin).
function sellFromTiers(tiers, qty) {
  if (!Array.isArray(tiers) || !tiers.length) return 0;
  let idx = 0;
  for (let i = 0; i < tiers.length; i++) { if ((Number(qty) || 0) >= (tiers[i].minQty || 0)) idx = i; }
  const t = tiers[idx];
  return Math.round((t.base || 0) * tierMargin(idx) * 100) / 100;
}

function NewOrderModal({ onClose, onCreated }) {
  const [cust, setCust] = useState({ name: '', company: '', email: '', phone: '', address: '' });
  const [items, setItems] = useState([blankNewItem()]);
  const [shipping, setShipping] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const setC = (k, v) => setCust(p => ({ ...p, [k]: v }));
  const setI = (i, patch) => setItems(prev => prev.map((it, j) => j === i ? { ...it, ...patch } : it));
  const addRow = () => setItems(prev => [...prev, blankNewItem()]);
  const delRow = (i) => setItems(prev => prev.length > 1 ? prev.filter((_, j) => j !== i) : prev);

  async function searchSku(i, q) {
    setI(i, { sku: q });
    if (!q || q.trim().length < 2) { setI(i, { results: [] }); return; }
    setI(i, { searching: true });
    try {
      const res = await fetch(`/api/admin/products/cost-lookup?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setI(i, { results: Array.isArray(data.products) ? data.products.slice(0, 8) : [], searching: false });
    } catch { setI(i, { results: [], searching: false }); }
  }

  function pick(i, p) {
    const qty = Number(items[i].qty) || (p.tiers?.[0]?.minQty) || 1;
    const unit = sellFromTiers(p.tiers, qty);
    setI(i, { sku: p.sku || '', name: p.name || '', tiers: p.tiers || [], results: [], qty: String(qty), unitPrice: unit ? String(unit) : items[i].unitPrice });
  }

  // Qty change re-derives the auto sell price (still editable afterwards).
  function setQty(i, v) {
    const it = items[i];
    const patch = { qty: v };
    if (it.tiers && it.tiers.length) { const u = sellFromTiers(it.tiers, Number(v) || 0); if (u) patch.unitPrice = String(u); }
    setI(i, patch);
  }

  const lineTotal = (it) => (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
  const subtotal = Math.round(items.reduce((s, it) => s + lineTotal(it), 0) * 100) / 100;
  const nLines = items.filter(it => (it.name || it.sku)).length || items.length;
  const shipVal = shipping === '' ? SHIPPING * nLines : (Number(shipping) || 0);
  const gst = Math.round((subtotal + shipVal) * GST * 100) / 100;
  const total = Math.round((subtotal + shipVal + gst) * 100) / 100;

  async function submit() {
    setErr('');
    if (!cust.name.trim() || !cust.email.trim()) { setErr('Customer name and email are required.'); return; }
    const good = items.filter(it => (it.name || it.sku) && (Number(it.qty) > 0));
    if (!good.length) { setErr('Add at least one product with a quantity.'); return; }
    setBusy(true);
    try {
      const payload = {
        customer: cust,
        items: good.map(it => ({ productName: it.name || it.sku, sku: it.sku, colour: it.colour, branding: it.branding, qty: Number(it.qty) || 1, unitPrice: Number(it.unitPrice) || 0, subtotal: Math.round(lineTotal(it) * 100) / 100 })),
        subtotal, shipping: shipVal, gst, total, paymentMethod: 'eft', paymentTerms: 'prepaid', makeArtworks: true,
      };
      const res = await fetch('/api/admin/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Failed to create order'); setBusy(false); return; }
      alert(`Order ${data.orderNumber} created` + (data.artworks ? ` · ${data.artworks} artwork card(s) — send proofs from Artwork Management.` : '.'));
      onCreated();
    } catch { setErr('Failed to create order'); setBusy(false); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,42,74,0.55)', zIndex: 1200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '760px', boxShadow: '0 24px 64px rgba(27,42,74,0.3)', marginBottom: '40px' }}>
        <div style={{ background: NAVY, color: '#fff', padding: '16px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0 }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600 }}>New Order — offline / old customer</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px', fontFamily: '"DM Sans", sans-serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div><label style={niLabel}>Customer name *</label><input style={niStyle} value={cust.name} onChange={e => setC('name', e.target.value)} /></div>
            <div><label style={niLabel}>Company</label><input style={niStyle} value={cust.company} onChange={e => setC('company', e.target.value)} /></div>
            <div><label style={niLabel}>Email *</label><input style={niStyle} value={cust.email} onChange={e => setC('email', e.target.value)} /></div>
            <div><label style={niLabel}>Phone</label><input style={niStyle} value={cust.phone} onChange={e => setC('phone', e.target.value)} /></div>
          </div>
          <div style={{ marginBottom: '16px' }}><label style={niLabel}>Delivery address</label><input style={niStyle} value={cust.address} onChange={e => setC('address', e.target.value)} placeholder="Street, suburb, state, postcode" /></div>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Products</div>
          {items.map((it, i) => (
            <div key={i} style={{ border: '1px solid #ECE8E1', borderRadius: '10px', padding: '12px', marginBottom: '10px', position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <label style={niLabel}>SKU (search catalog)</label>
                  <input style={niStyle} value={it.sku} onChange={e => searchSku(i, e.target.value)} placeholder="Type SKU or name…" />
                  {it.results && it.results.length > 0 && (
                    <div style={{ position: 'absolute', zIndex: 5, top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '200px', overflowY: 'auto' }}>
                      {it.results.map(p => (
                        <div key={p.id} onClick={() => pick(i, p)} style={{ padding: '8px 10px', cursor: 'pointer', fontSize: '12px', borderBottom: '1px solid #F0EEED' }}>
                          <strong style={{ color: NAVY }}>{p.sku}</strong> — {p.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div><label style={niLabel}>Product name</label><input style={niStyle} value={it.name} onChange={e => setI(i, { name: e.target.value })} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 0.7fr 1fr 0.9fr', gap: '8px', alignItems: 'end' }}>
                <div><label style={niLabel}>Colour</label><input style={niStyle} value={it.colour} onChange={e => setI(i, { colour: e.target.value })} /></div>
                <div><label style={niLabel}>Branding</label><input style={niStyle} value={it.branding} onChange={e => setI(i, { branding: e.target.value })} placeholder="e.g. Pad print 2 col" /></div>
                <div><label style={niLabel}>Qty</label><input style={niStyle} inputMode="numeric" value={it.qty} onChange={e => setQty(i, e.target.value)} /></div>
                <div><label style={niLabel}>Unit $ ex GST</label><input style={niStyle} inputMode="decimal" value={it.unitPrice} onChange={e => setI(i, { unitPrice: e.target.value })} /></div>
                <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 700, color: NAVY, paddingBottom: '9px' }}>{money2(lineTotal(it))}</div>
              </div>
              {items.length > 1 && <button onClick={() => delRow(i)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: '#B4413E', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>Remove</button>}
            </div>
          ))}
          <button onClick={addRow} style={{ background: '#fff', border: `1.5px solid ${NAVY}`, color: NAVY, borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}>＋ Add product</button>

          <div style={{ background: '#FAF8F4', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}><span style={{ color: '#7A7570' }}>Subtotal (excl GST)</span><strong style={{ color: NAVY }}>{money2(subtotal)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', alignItems: 'center' }}>
              <span style={{ color: '#7A7570' }}>Shipping (${SHIPPING}/item · {nLines} item{nLines !== 1 ? 's' : ''})</span>
              <input style={{ ...niStyle, width: '90px', textAlign: 'right' }} inputMode="decimal" value={shipping} onChange={e => setShipping(e.target.value)} placeholder={String(SHIPPING * nLines)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}><span style={{ color: '#7A7570' }}>GST (10%)</span><strong style={{ color: NAVY }}>{money2(gst)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderTop: '1px solid #E0DDD7', paddingTop: '8px' }}><span style={{ color: NAVY, fontWeight: 700 }}>Total (incl GST)</span><strong style={{ color: NAVY }}>{money2(total)}</strong></div>
          </div>

          {err && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#B4413E', marginBottom: '12px' }}>{err}</div>}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ background: '#fff', border: '1.5px solid #E0DDD7', color: NAVY, borderRadius: '9px', padding: '11px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button onClick={submit} disabled={busy} style={{ background: busy ? '#D9CDB4' : GOLD, border: 'none', color: '#fff', borderRadius: '9px', padding: '11px 22px', fontSize: '13px', fontWeight: 700, cursor: busy ? 'wait' : 'pointer' }}>{busy ? '⏳ Creating…' : 'Create order + artwork cards'}</button>
          </div>
          <div style={{ fontSize: '11px', color: '#7A7570', marginTop: '10px', textAlign: 'right' }}>Creates a confirmed order (EFT · unpaid) + one artwork card per product. No email is sent to the customer.</div>
        </div>
      </div>
    </div>
  );
}
