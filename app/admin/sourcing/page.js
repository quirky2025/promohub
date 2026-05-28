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

const STATUS_COLOURS = {
  new: { bg: '#FEF3C7', color: '#92400E', label: 'New' },
  in_progress: { bg: '#DBEAFE', color: '#1E40AF', label: 'In Progress' },
  quoted: { bg: '#D1FAE5', color: '#065F46', label: 'Quoted' },
  closed_won: { bg: '#1B2A4A', color: '#C9A96E', label: 'Closed Won' },
  closed_lost: { bg: '#FEE2E2', color: '#991B1B', label: 'Closed Lost' },
};

export default function AdminSourcingPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  async function fetchRequests() {
    setLoading(true);
    let query = supabase
      .from('sourcing_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (statusFilter) query = query.eq('status', statusFilter);
    const { data } = await query;
    if (data) setRequests(data);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase.from('sourcing_requests').update({ status }).eq('id', id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  }

  async function saveInternalNote(id) {
    setSaving(true);
    await supabase.from('sourcing_requests').update({ internal_notes: internalNote }).eq('id', id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, internal_notes: internalNote } : r));
    if (selected?.id === id) setSelected(prev => ({ ...prev, internal_notes: internalNote }));
    setSaving(false);
  }

  function openDetail(req) {
    setSelected(req);
    setInternalNote(req.internal_notes || '');
  }

  const freightLabels = {
    express: 'Express (5–7 days)',
    air: 'Air Freight (20 days)',
    sea: 'Sea Freight (45 days)',
    local: 'Local stock only',
  };

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: BG, minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', textDecoration: 'none' }}>← Admin</Link>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: '#fff', margin: 0 }}>Sourcing Requests</h1>
          <span style={{ background: GOLD, color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{requests.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'new', 'in_progress', 'quoted', 'closed_won', 'closed_lost'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', background: statusFilter === s ? GOLD : 'rgba(255,255,255,.1)', color: '#fff' }}>
              {s === '' ? 'All' : STATUS_COLOURS[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>

        {/* LEFT — LIST */}
        <div style={{ width: selected ? '45%' : '100%', overflowY: 'auto', borderRight: '1px solid #E0DDD7', transition: 'width .2s' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>No sourcing requests yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fff', borderBottom: '2px solid #E0DDD7' }}>
                  {['Date', 'Company', 'Product', 'Qty', 'State', 'In-Hands', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#7A7570', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => {
                  const st = STATUS_COLOURS[req.status] || STATUS_COLOURS.new;
                  const isSelected = selected?.id === req.id;
                  return (
                    <tr key={req.id}
                      onClick={() => openDetail(req)}
                      style={{ background: isSelected ? '#FDF8F0' : i % 2 === 0 ? '#fff' : BG, borderBottom: '1px solid #F0EEED', cursor: 'pointer', borderLeft: isSelected ? `3px solid ${GOLD}` : '3px solid transparent' }}>
                      <td style={{ padding: '12px 16px', color: '#7A7570', whiteSpace: 'nowrap' }}>
                        {new Date(req.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: NAVY }}>{req.company_name}</td>
                      <td style={{ padding: '12px 16px', color: '#5A5550', maxWidth: '200px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.product_description}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: NAVY, fontWeight: 600 }}>{req.quantity}</td>
                      <td style={{ padding: '12px 16px', color: '#5A5550' }}>{req.delivery_state}</td>
                      <td style={{ padding: '12px 16px', color: req.in_hands_date ? '#C0392B' : '#B0AAA3', fontWeight: req.in_hands_date ? 600 : 400, whiteSpace: 'nowrap' }}>
                        {req.in_hands_date ? new Date(req.in_hands_date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <a href={`mailto:${req.email}?subject=Re: Sourcing Quote — ${req.company_name}`}
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
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 4px' }}>{selected.company_name}</h2>
                <div style={{ fontSize: '13px', color: '#7A7570' }}>
                  {selected.contact_name} · <a href={`mailto:${selected.email}`} style={{ color: GOLD }}>{selected.email}</a>
                  {selected.phone && ` · ${selected.phone}`}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#B0AAA3' }}>×</button>
            </div>

            {/* STATUS */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {Object.entries(STATUS_COLOURS).map(([key, val]) => (
                <button key={key} onClick={() => updateStatus(selected.id, key)}
                  style={{ padding: '6px 14px', borderRadius: '20px', border: `2px solid ${selected.status === key ? val.color : '#E0DDD7'}`, background: selected.status === key ? val.bg : '#fff', color: selected.status === key ? val.color : '#7A7570', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  {val.label}
                </button>
              ))}
            </div>

            {/* PRODUCT */}
            <Section title="📦 Product Requirements">
              <Row label="Description" value={selected.product_description} pre />
              <Row label="Quantity" value={selected.quantity} bold />
              {selected.target_price && <Row label="Target Price" value={selected.target_price} />}
              {selected.in_hands_date && <Row label="In-Hands Date" value={new Date(selected.in_hands_date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })} bold red />}
              {selected.freight_preference && <Row label="Freight" value={freightLabels[selected.freight_preference] || selected.freight_preference} />}
            </Section>

            {/* BRANDING */}
            <Section title="🎨 Branding & Compliance">
              <Row label="Branding" value={selected.branding_requirements} pre />
              {selected.colour_requirements && <Row label="Colours" value={selected.colour_requirements} />}
              {selected.decoration_method && <Row label="Decoration" value={selected.decoration_method} />}
              <Row label="For Children" value={selected.for_children} />
              <Row label="Delivery State" value={selected.delivery_state} bold />
              {selected.compliance_notes && <Row label="Compliance" value={selected.compliance_notes} pre />}
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
                placeholder="Add internal notes, factory options considered, follow-up actions..."
                rows={5}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', color: NAVY, outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
              />
              <button onClick={() => saveInternalNote(selected.id)} disabled={saving}
                style={{ marginTop: '8px', background: saving ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {saving ? 'Saving...' : 'Save Notes'}
              </button>
            </Section>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <a href={`mailto:${selected.email}?subject=Re: Sourcing Quote Request — ${selected.company_name}`}
                style={{ flex: 1, display: 'block', background: GOLD, color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                📧 Reply to Client
              </a>
              <a href={`tel:${selected.phone}`}
                style={{ display: 'block', background: NAVY, color: '#fff', textAlign: 'center', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                📞 Call
              </a>
            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: '#B0AAA3', textAlign: 'center' }}>
              Submitted {new Date(selected.created_at).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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

function Row({ label, value, bold, red, pre }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '13px' }}>
      <span style={{ color: '#7A7570', width: '140px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: red ? '#C0392B' : '#1B2A4A', fontWeight: bold ? 700 : 400, whiteSpace: pre ? 'pre-wrap' : 'normal', flex: 1 }}>{value}</span>
    </div>
  );
}
