'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const STATUS_COLOURS = {
  new:            { bg: '#FEF3C7', color: '#92400E', label: 'New' },
  reviewing:      { bg: '#DBEAFE', color: '#1E40AF', label: 'Reviewing' },
  supplier_quote: { bg: '#EDE9FE', color: '#5B21B6', label: 'Supplier Quote' },
  quoted:         { bg: '#D1FAE5', color: '#065F46', label: 'Quoted' },
  accepted:       { bg: '#1B2A4A', color: '#C9A96E', label: 'Accepted' },
  rejected:       { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
  archived:       { bg: '#F3F4F6', color: '#6B7280', label: 'Archived' },
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/admin/quotes?${params.toString()}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (ok) setQuotes(data.quotes || []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  async function updateStatus(id, status) {
    const res = await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'status', status }),
    });
    const data = await res.json();
    if (res.ok) {
      setQuotes(prev => prev.map(r => r.id === id ? data.quote : r));
      if (selected?.id === id) setSelected(data.quote);
    }
  }

  async function saveNote(id) {
    setSaving(true);
    const res = await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'note', internal_notes: internalNote }),
    });
    const data = await res.json();
    if (res.ok) {
      setQuotes(prev => prev.map(r => r.id === id ? data.quote : r));
      if (selected?.id === id) setSelected(data.quote);
    }
    setSaving(false);
  }

  function openDetail(q) {
    setSelected(q);
    setInternalNote(q.internal_notes || '');
  }

  const fmt = v => v != null ? `$${Number(v).toFixed(2)}` : '—';

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', textDecoration: 'none' }}>← Admin</Link>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: '#fff', margin: 0 }}>Quotes</h1>
          <span style={{ background: GOLD, color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{quotes.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['', ...Object.keys(STATUS_COLOURS)].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', background: statusFilter === s ? GOLD : 'rgba(255,255,255,.1)', color: '#fff' }}>
              {s === '' ? 'All' : STATUS_COLOURS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>

        {/* LEFT — LIST */}
        <div style={{ width: selected ? '50%' : '100%', overflowY: 'auto', borderRight: '1px solid #E0DDD7', transition: 'width .2s' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
          ) : quotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>No quotes yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fff', borderBottom: '2px solid #E0DDD7' }}>
                  {['Quote #', 'Date', 'Customer', 'Product', 'Qty', 'Total', 'Valid Until', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#7A7570', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.map((q, i) => {
                  const st = STATUS_COLOURS[q.display_status || q.status] || STATUS_COLOURS.new;
                  const isSelected = selected?.id === q.id;
                  return (
                    <tr key={q.id} onClick={() => openDetail(q)}
                      style={{ background: isSelected ? '#FDF8F0' : i % 2 === 0 ? '#fff' : BG, borderBottom: '1px solid #F0EEED', cursor: 'pointer', borderLeft: isSelected ? `3px solid ${GOLD}` : '3px solid transparent' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: GOLD, fontFamily: 'monospace' }}>{q.quote_number}</td>
                      <td style={{ padding: '12px 16px', color: '#7A7570', whiteSpace: 'nowrap' }}>
                        {q.created_at ? new Date(q.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: NAVY }}>
                        <div>{q.customer_name}</div>
                        {q.customer_company && <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 400 }}>{q.customer_company}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#5A5550', maxWidth: '180px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.product_name}</div>
                        {q.product_sku && <div style={{ fontSize: '11px', color: '#B0AAA3', fontFamily: 'monospace' }}>{q.product_sku}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', color: NAVY, fontWeight: 600 }}>{q.quantity || '—'}</td>
                      <td style={{ padding: '12px 16px', color: NAVY, fontWeight: 700 }}>{fmt(q.total)}</td>
                      <td style={{ padding: '12px 16px', color: '#7A7570', whiteSpace: 'nowrap' }}>{q.valid_until || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <a href={`mailto:${q.customer_email}?subject=Re: Quote ${q.quote_number}`}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: GOLD, fontWeight: 700, fontFamily: 'monospace', marginBottom: '4px' }}>{selected.quote_number}</div>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 4px' }}>{selected.customer_name}</h2>
                <div style={{ fontSize: '13px', color: '#7A7570' }}>
                  {selected.customer_company && `${selected.customer_company} · `}
                  <a href={`mailto:${selected.customer_email}`} style={{ color: GOLD }}>{selected.customer_email}</a>
                  {selected.customer_phone && ` · ${selected.customer_phone}`}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#B0AAA3' }}>×</button>
            </div>

            {/* STATUS */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {Object.entries(STATUS_COLOURS).map(([key, val]) => (
                <button key={key} onClick={() => updateStatus(selected.id, key)}
                  style={{ padding: '6px 14px', borderRadius: '20px', border: `2px solid ${(selected.display_status || selected.status) === key ? val.color : '#E0DDD7'}`, background: (selected.display_status || selected.status) === key ? val.bg : '#fff', color: (selected.display_status || selected.status) === key ? val.color : '#7A7570', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  {val.label}
                </button>
              ))}
            </div>

            {/* PRODUCT */}
            <Section title="📦 Product">
              <Row label="Product" value={selected.product_name} bold />
              {selected.product_sku && <Row label="SKU" value={selected.product_sku} mono />}
              <Row label="Quantity" value={selected.quantity} bold />
              {selected.colour && <Row label="Colour" value={selected.colour} />}
              {selected.branding_summary && <Row label="Branding" value={selected.branding_summary} />}
              {selected.addons && <Row label="Add-ons" value={selected.addons} />}
              {selected.required_date && <Row label="Required Date" value={selected.required_date} bold red />}
              {selected.delivery_address && <Row label="Delivery" value={selected.delivery_address} />}
              {selected.artwork_filename && <Row label="Artwork" value={`✅ ${selected.artwork_filename}`} />}
            </Section>

            {/* PRICING */}
            <Section title="💰 Pricing">
              <Row label="Subtotal (excl. GST)" value={fmt(selected.subtotal)} />
              <Row label="Shipping" value={fmt(selected.shipping)} />
              <Row label="GST (10%)" value={fmt(selected.gst)} />
              <Row label="Total (incl. GST)" value={fmt(selected.total)} bold />
              <Row label="Valid Until" value={selected.valid_until} />
            </Section>

            {/* NOTES */}
            {selected.notes && (
              <Section title="💬 Client Notes">
                <div style={{ fontSize: '13px', color: '#3D3A36', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.notes}</div>
              </Section>
            )}

            {/* INTERNAL NOTES */}
            <Section title="🔒 Internal Notes">
              <textarea
                value={internalNote}
                onChange={e => setInternalNote(e.target.value)}
                placeholder="Add internal notes, follow-up actions..."
                rows={4}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', color: NAVY, outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
              />
              <button onClick={() => saveNote(selected.id)} disabled={saving}
                style={{ marginTop: '8px', background: saving ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {saving ? 'Saving...' : 'Save Notes'}
              </button>
            </Section>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <a href={`mailto:${selected.customer_email}?subject=Re: Quote ${selected.quote_number} — ${selected.product_name}`}
                style={{ flex: 1, display: 'block', background: GOLD, color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                📧 Reply to Customer
              </a>
              {selected.customer_phone && (
                <a href={`tel:${selected.customer_phone}`}
                  style={{ display: 'block', background: NAVY, color: '#fff', textAlign: 'center', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  📞 Call
                </a>
              )}
            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: '#B0AAA3', textAlign: 'center' }}>
              {selected.created_at && `Submitted ${new Date(selected.created_at).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
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

function Row({ label, value, bold, red, mono }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '13px' }}>
      <span style={{ color: '#7A7570', width: '140px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: red ? '#C0392B' : '#1B2A4A', fontWeight: bold ? 700 : 400, fontFamily: mono ? 'monospace' : 'inherit', flex: 1 }}>{value}</span>
    </div>
  );
}
