'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';
const BORDER = '#E0DDD7';

const STATUS_FLOW = [
  { key: 'quote', label: 'Quote', bg: '#F3F4F6', color: '#4B5563' },
  { key: 'confirmed', label: 'Confirmed', bg: '#FEF3C7', color: '#92400E' },
  { key: 'proof_sent', label: 'Proof Sent', bg: '#DBEAFE', color: '#1E40AF' },
  { key: 'approved', label: 'Approved', bg: '#D1FAE5', color: '#065F46' },
  { key: 'in_production', label: 'Production', bg: '#EDE9FE', color: '#5B21B6' },
  { key: 'dispatched', label: 'Dispatched', bg: '#FEF9C3', color: '#854D0E' },
  { key: 'completed', label: 'Completed', bg: '#DCFCE7', color: '#166534' },
  { key: 'cancelled', label: 'Cancelled', bg: '#FEE2E2', color: '#991B1B' },
];

const STATUS_MAP = Object.fromEntries(STATUS_FLOW.map((item) => [item.key, item]));

const PAYMENT_STATUS = [
  { key: 'unpaid', label: 'Unpaid' },
  { key: 'pending', label: 'Pending' },
  { key: 'partial', label: 'Partial' },
  { key: 'paid', label: 'Paid' },
  { key: 'refunded', label: 'Refunded' },
];

function fmtMoney(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number === 0) return '$0.00';
  return `$${number.toFixed(2)}`;
}

function fmtDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
}

function fmtDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusStyle(status) {
  return STATUS_MAP[status] || STATUS_MAP.quote;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({});
  const [schemaMissing, setSchemaMissing] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [details, setDetails] = useState({
    po_number: '',
    payment_terms: 'prepaid',
    payment_status: 'unpaid',
    supplier: '',
    ship_date: '',
    tracking_number: '',
    tracking_url: '',
    internal_notes: '',
  });

  const selected = useMemo(
    () => orders.find((order) => order.id === selectedId) || null,
    [orders, selectedId]
  );

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders(nextSearch = search) {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (nextSearch.trim()) params.set('search', nextSearch.trim());

    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || 'Failed to load orders');
      setOrders([]);
    } else {
      setOrders(json.orders || []);
      setCounts(json.counts || {});
      setSchemaMissing(json.schema_missing || {});
      if (selectedId && !(json.orders || []).some((order) => order.id === selectedId)) {
        setSelectedId(null);
      }
    }
    setLoading(false);
  }

  async function updateStatus(orderId, status) {
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, action: 'status', status }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.error || 'Failed to update status');
    await fetchOrders();
    setSaving(false);
  }

  async function saveDetails() {
    if (!selected) return;
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, action: 'details', ...details }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.error || 'Failed to save order details');
    await fetchOrders();
    setSaving(false);
  }

  function submitSearch(event) {
    event.preventDefault();
    fetchOrders(search);
  }

  function syncDetailsFromOrder(order) {
    setDetails({
      po_number: order.po_number || '',
      payment_terms: order.payment_terms || 'prepaid',
      payment_status: order.payment_status || 'unpaid',
      supplier: order.supplier || '',
      ship_date: order.ship_date || '',
      tracking_number: order.tracking_number || '',
      tracking_url: order.tracking_url || '',
      internal_notes: order.internal_notes || '',
    });
  }

  function openOrder(order) {
    setSelectedId(order.id);
    syncDetailsFromOrder(order);
  }

  const missingTables = Object.entries(schemaMissing)
    .filter(([, missing]) => missing)
    .map(([name]) => name);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: NAVY, fontFamily: '"DM Sans", sans-serif' }}>
      <header style={{ background: NAVY, color: '#fff', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,.65)', fontSize: '13px', textDecoration: 'none' }}>Back to Admin</Link>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Order Flow</h1>
          <span style={{ background: GOLD, color: '#fff', borderRadius: '999px', padding: '3px 10px', fontSize: '12px', fontWeight: 700 }}>{orders.length}</span>
        </div>
        <form onSubmit={submitSearch} style={{ display: 'flex', gap: '8px', minWidth: '280px' }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, customer, supplier"
            style={{ width: '260px', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.08)', color: '#fff', outline: 'none' }}
          />
          <button type="submit" style={navButtonStyle(true)}>Search</button>
        </form>
      </header>

      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '10px 28px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        <button onClick={() => setStatusFilter('')} style={filterStyle(statusFilter === '')}>
          All
        </button>
        {STATUS_FLOW.map((status) => (
          <button key={status.key} onClick={() => setStatusFilter(status.key)} style={filterStyle(statusFilter === status.key)}>
            {status.label}
            <span style={{ marginLeft: '6px', color: statusFilter === status.key ? '#fff' : '#7A7570' }}>{counts[status.key] || 0}</span>
          </button>
        ))}
      </div>

      {missingTables.length > 0 && (
        <div style={{ margin: '16px 28px 0', border: '1px solid #F59E0B', background: '#FFFBEB', color: '#92400E', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
          Schema pending: {missingTables.join(', ')}. Review and run outputs/admin_order_flow/order_to_dispatch_schema_CREATE.sql in Supabase to enable normalized items, proof versions and audit logs.
        </div>
      )}

      {error && (
        <div style={{ margin: '16px 28px 0', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#991B1B', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
          {error}
        </div>
      )}

      <main style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(520px, 1fr) minmax(420px, 520px)' : '1fr', minHeight: 'calc(100vh - 118px)' }}>
        <section style={{ overflow: 'auto', borderRight: selected ? `1px solid ${BORDER}` : 'none' }}>
          {loading ? (
            <EmptyState label="Loading orders..." />
          ) : orders.length === 0 ? (
            <EmptyState label="No orders found" />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
                  {['Order', 'Date', 'Customer', 'Items', 'Terms', 'Total', 'Status', ''].map((head) => (
                    <th key={head} style={{ textAlign: 'left', padding: '11px 14px', color: '#7A7570', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const status = statusStyle(order.display_status);
                  const isSelected = selected?.id === order.id;
                  return (
                    <tr key={order.id} onClick={() => openOrder(order)} style={{ cursor: 'pointer', borderBottom: '1px solid #F0EEED', background: isSelected ? '#FDF8F0' : index % 2 ? '#fff' : '#FAFAF9', borderLeft: isSelected ? `3px solid ${GOLD}` : '3px solid transparent' }}>
                      <td style={cellStyle}>
                        <div style={{ color: GOLD, fontWeight: 800, fontFamily: 'monospace' }}>{order.order_number || '-'}</div>
                        {order.po_number && <div style={{ fontSize: '11px', color: '#7A7570' }}>PO {order.po_number}</div>}
                      </td>
                      <td style={{ ...cellStyle, color: '#7A7570', whiteSpace: 'nowrap' }}>{fmtDate(order.created_at)}</td>
                      <td style={cellStyle}>
                        <div style={{ fontWeight: 700 }}>{order.customer_name || '-'}</div>
                        <div style={{ color: '#7A7570', fontSize: '12px' }}>{order.customer_company || order.customer_email || ''}</div>
                      </td>
                      <td style={cellStyle}>{order.items?.length || 0}</td>
                      <td style={cellStyle}>{order.payment_terms || 'prepaid'}</td>
                      <td style={{ ...cellStyle, fontWeight: 800 }}>{fmtMoney(order.total_gross)}</td>
                      <td style={cellStyle}>
                        <span style={{ background: status.bg, color: status.color, padding: '4px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>{status.label}</span>
                      </td>
                      <td style={cellStyle}>
                        <a href={`mailto:${order.customer_email || ''}?subject=Re: Order ${order.order_number || ''}`} onClick={(event) => event.stopPropagation()} style={{ color: GOLD, fontWeight: 700, textDecoration: 'none' }}>
                          Email
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        {selected && (
          <aside style={{ padding: '22px 24px', overflow: 'auto', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div style={{ color: GOLD, fontFamily: 'monospace', fontSize: '12px', fontWeight: 800 }}>{selected.order_number || '-'}</div>
                <h2 style={{ margin: '4px 0', fontSize: '24px', lineHeight: 1.1 }}>{selected.customer_name || 'Customer'}</h2>
                <div style={{ color: '#7A7570', fontSize: '13px', lineHeight: 1.6 }}>
                  {selected.customer_company && <span>{selected.customer_company} / </span>}
                  <a href={`mailto:${selected.customer_email || ''}`} style={{ color: GOLD }}>{selected.customer_email || '-'}</a>
                  {selected.customer_phone && <span> / {selected.customer_phone}</span>}
                </div>
              </div>
              <button onClick={() => setSelectedId(null)} style={{ border: 'none', background: 'transparent', color: '#7A7570', cursor: 'pointer', fontSize: '20px' }}>x</button>
            </div>

            <Panel title="Status">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {STATUS_FLOW.map((status) => {
                  const active = selected.display_status === status.key;
                  return (
                    <button key={status.key} disabled={saving} onClick={() => updateStatus(selected.id, status.key)} style={{ border: `2px solid ${active ? status.color : BORDER}`, background: active ? status.bg : '#fff', color: active ? status.color : '#7A7570', borderRadius: '999px', padding: '6px 10px', fontSize: '12px', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer' }}>
                      {status.label}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: '10px', color: '#7A7570', fontSize: '12px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <span>Created {fmtDateTime(selected.created_at)}</span>
                {selected.artwork_approved_at && <span>Approved {fmtDateTime(selected.artwork_approved_at)}</span>}
                {selected.production_started_at && <span>Production {fmtDateTime(selected.production_started_at)}</span>}
                {selected.dispatched_at && <span>Dispatched {fmtDateTime(selected.dispatched_at)}</span>}
              </div>
            </Panel>

            <Panel title="Commercial">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="PO Number" value={details.po_number} onChange={(value) => setDetails((prev) => ({ ...prev, po_number: value }))} />
                <Select label="Payment Terms" value={details.payment_terms} onChange={(value) => setDetails((prev) => ({ ...prev, payment_terms: value }))} options={[{ key: 'prepaid', label: 'Prepaid' }, { key: 'monthly', label: 'Monthly' }]} />
                <Select label="Payment Status" value={details.payment_status} onChange={(value) => setDetails((prev) => ({ ...prev, payment_status: value }))} options={PAYMENT_STATUS} />
                <Field label="Supplier" value={details.supplier} onChange={(value) => setDetails((prev) => ({ ...prev, supplier: value }))} />
              </div>
            </Panel>

            <Panel title="Dispatch">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="Ship Date" type="date" value={details.ship_date} onChange={(value) => setDetails((prev) => ({ ...prev, ship_date: value }))} />
                <Field label="Tracking Number" value={details.tracking_number} onChange={(value) => setDetails((prev) => ({ ...prev, tracking_number: value }))} />
              </div>
              <Field label="Tracking URL" value={details.tracking_url} onChange={(value) => setDetails((prev) => ({ ...prev, tracking_url: value }))} />
            </Panel>

            <Panel title="Order Items">
              {selected.items?.length ? (
                <div style={{ border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
                  {selected.items.map((item) => (
                    <div key={item.id} style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{item.product_description}</div>
                          <div style={{ color: '#7A7570', fontSize: '12px', marginTop: '3px' }}>
                            {item.stock_code || item.supplier_sku || 'No SKU'}
                            {item.colour && <span> / {item.colour}</span>}
                            {item.decoration_method && <span> / {item.decoration_method}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 800, whiteSpace: 'nowrap' }}>{fmtMoney(item.line_total)}</div>
                      </div>
                      <div style={{ marginTop: '5px', color: '#7A7570', fontSize: '12px' }}>
                        Qty {item.quantity} x {fmtMoney(item.unit_price)}
                        {Number(item.setup_cost || 0) > 0 && <span> + setup {fmtMoney(item.setup_cost)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SmallEmpty label="No item rows yet" />
              )}
            </Panel>

            <Panel title="Pricing">
              <Row label="Net" value={fmtMoney(selected.total_net)} />
              <Row label="GST" value={fmtMoney(selected.gst_total)} />
              <Row label="Gross" value={fmtMoney(selected.total_gross)} bold />
            </Panel>

            <Panel title="Artwork Proofs">
              {selected.artwork_proofs?.length ? (
                selected.artwork_proofs.map((proof) => (
                  <div key={proof.id} style={{ border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <strong>v{proof.version} / {proof.status}</strong>
                      {proof.proof_pdf_url && <a href={proof.proof_pdf_url} target="_blank" style={{ color: GOLD, fontWeight: 700 }}>Open PDF</a>}
                    </div>
                    <div style={{ color: '#7A7570', fontSize: '12px', marginTop: '5px' }}>
                      {proof.print_method || 'Method TBC'} / {proof.print_position || 'Position TBC'} / {proof.print_size || 'Size TBC'}
                    </div>
                    {proof.comment && <div style={{ marginTop: '6px', fontSize: '12px' }}>{proof.comment}</div>}
                  </div>
                ))
              ) : (
                <SmallEmpty label="No proof versions yet" />
              )}
            </Panel>

            <Panel title="Approvals">
              {selected.approvals?.length ? (
                selected.approvals.map((approval) => (
                  <Row key={approval.id} label={approval.method} value={`${approval.signer_email || '-'} / ${fmtDateTime(approval.signed_at)}`} />
                ))
              ) : (
                <SmallEmpty label="No approval recorded" />
              )}
            </Panel>

            <Panel title="Status Log">
              {selected.status_log?.length ? (
                selected.status_log.map((event) => (
                  <div key={event.id} style={{ fontSize: '12px', borderBottom: '1px solid #F0EEED', padding: '7px 0' }}>
                    <strong>{event.status}</strong>
                    <span style={{ color: '#7A7570' }}> / {fmtDateTime(event.created_at)}</span>
                    {event.note && <div style={{ color: '#7A7570', marginTop: '3px' }}>{event.note}</div>}
                  </div>
                ))
              ) : (
                <SmallEmpty label="No status log yet" />
              )}
            </Panel>

            <Panel title="Internal Notes">
              <textarea
                value={details.internal_notes}
                onChange={(event) => setDetails((prev) => ({ ...prev, internal_notes: event.target.value }))}
                rows={4}
                style={{ width: '100%', resize: 'vertical', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '9px 10px', boxSizing: 'border-box', color: NAVY, fontFamily: 'inherit', lineHeight: 1.5 }}
              />
              <button disabled={saving} onClick={saveDetails} style={{ marginTop: '10px', width: '100%', background: saving ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 14px', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save Details'}
              </button>
            </Panel>
          </aside>
        )}
      </main>
    </div>
  );
}

function navButtonStyle(active) {
  return {
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    background: active ? GOLD : 'rgba(255,255,255,.12)',
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  };
}

function filterStyle(active) {
  return {
    border: `1px solid ${active ? NAVY : BORDER}`,
    background: active ? NAVY : '#fff',
    color: active ? '#fff' : NAVY,
    borderRadius: '6px',
    padding: '7px 12px',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };
}

const cellStyle = {
  padding: '12px 14px',
  verticalAlign: 'top',
};

function EmptyState({ label }) {
  return <div style={{ padding: '70px 24px', textAlign: 'center', color: '#7A7570' }}>{label}</div>;
}

function SmallEmpty({ label }) {
  return <div style={{ border: `1px dashed ${BORDER}`, borderRadius: '8px', padding: '12px', color: '#7A7570', fontSize: '13px', textAlign: 'center' }}>{label}</div>;
}

function Panel({ title, children }) {
  return (
    <section style={{ borderTop: '1px solid #F0EEED', paddingTop: '15px', marginTop: '15px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#7A7570', textTransform: 'uppercase', letterSpacing: '.06em' }}>{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label style={{ display: 'block', fontSize: '12px', color: '#7A7570', fontWeight: 700 }}>
      {label}
      <input
        type={type}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        style={{ display: 'block', marginTop: '5px', width: '100%', border: `1px solid ${BORDER}`, borderRadius: '7px', padding: '8px 9px', boxSizing: 'border-box', color: NAVY, fontFamily: 'inherit' }}
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: 'block', fontSize: '12px', color: '#7A7570', fontWeight: 700 }}>
      {label}
      <select
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        style={{ display: 'block', marginTop: '5px', width: '100%', border: `1px solid ${BORDER}`, borderRadius: '7px', padding: '8px 9px', boxSizing: 'border-box', color: NAVY, background: '#fff', fontFamily: 'inherit' }}
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function Row({ label, value, bold }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', fontSize: '13px', padding: '5px 0' }}>
      <span style={{ color: '#7A7570' }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 500, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
