'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

const EMPTY_REQUEST = {
  companyName: '',
  contactName: '',
  email: '',
  companyPhone: '',
  mobile: '',
  productName: '',
  productDescription: '',
  quantity: '',
  targetPrice: '',
  inHandsDate: '',
  freightPreference: '',
  productColour: '',
  pmsColour: '',
  logoPrintRequirements: '',
  brandingRequirements: '',
  colourRequirements: '',
  decorationMethod: '',
  forChildren: 'no',
  deliveryState: 'NSW',
  deliveryAddress: '',
  complianceNotes: '',
  notes: '',
  internalNotes: '',
};

const freightLabels = {
  express: 'Express',
  air: 'Air Freight',
  sea: 'Sea Freight',
  local: 'Local stock only',
};

function fieldAfterPrefix(value, prefix) {
  if (!value) return '';
  const line = String(value)
    .split('\n')
    .find((part) => part.toLowerCase().startsWith(prefix.toLowerCase()));
  return line ? line.slice(prefix.length).trim() : '';
}

function requestProductName(req) {
  return fieldAfterPrefix(req.product_description, 'Product name:') ||
    String(req.product_description || '').split('\n').find(Boolean) ||
    '';
}

function requestProductDetails(req) {
  const value = String(req.product_description || '');
  return value
    .replace(/^Product name:.*(\r?\n){0,2}/i, '')
    .replace(/^Details:\s*/i, '')
    .trim();
}

function requestLogoPrint(req) {
  const value = String(req.branding_requirements || '');
  if (!value.toLowerCase().startsWith('logo / print requirements:')) return '';
  return value
    .replace(/^Logo \/ print requirements:\s*/i, '')
    .split(/\n\n+/)[0]
    .trim();
}

function requestPhoneDisplay(req) {
  return String(req.phone || '').replace(/\s*\n+\s*/g, ' / ');
}

function requestDeliveryAddress(req) {
  const value = String(req.notes || '');
  if (!value.toLowerCase().startsWith('delivery address:')) return '';
  return value
    .replace(/^Delivery address:\s*/i, '')
    .split(/\n\n+/)[0]
    .trim();
}

function requestClientNotes(req) {
  const value = String(req.notes || '');
  if (!value.toLowerCase().startsWith('delivery address:')) return value;
  return value.replace(/^Delivery address:\s*[\s\S]*?(\n\n+|$)/i, '').trim();
}

export default function AdminSourcingPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState(EMPTY_REQUEST);
  const [manualSaving, setManualSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const url = statusFilter
        ? `/api/admin/sourcing/requests?status=${encodeURIComponent(statusFilter)}`
        : '/api/admin/sourcing/requests';
      const res = await fetch(url);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) setError(data.error || 'Failed to load sourcing requests');
      else {
        setRequests(data.requests || []);
        setError('');
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  function refetch(nextStatus = statusFilter) {
    setLoading(true);
    setStatusFilter(nextStatus);
  }

  function openDetail(req) {
    setSelected(req);
    setInternalNote(req.internal_notes || '');
    setMessage('');
  }

  async function updateStatus(id, status) {
    const res = await fetch('/api/admin/sourcing/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to update status');
      return;
    }
    setRequests((prev) => prev.map((row) => (row.id === id ? data.request : row)));
    if (selected?.id === id) setSelected(data.request);
  }

  async function saveInternalNote(id) {
    setSaving(true);
    const res = await fetch('/api/admin/sourcing/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, internalNotes: internalNote }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Failed to save note');
      return;
    }
    setRequests((prev) => prev.map((row) => (row.id === id ? data.request : row)));
    setSelected(data.request);
    setMessage('Internal note saved.');
  }

  function setManual(key, value) {
    setManualForm((current) => ({ ...current, [key]: value }));
  }

  async function createManualRequest() {
    setManualSaving(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/sourcing/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manualForm),
    });
    const data = await res.json();
    setManualSaving(false);
    if (!res.ok) {
      setError(data.error || 'Failed to create request');
      return;
    }
    setManualForm(EMPTY_REQUEST);
    setShowManualForm(false);
    setRequests((prev) => [data.request, ...prev]);
    setSelected(data.request);
    setInternalNote(data.request.internal_notes || '');
    setMessage('Manual sourcing request added.');
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ background: NAVY, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', textDecoration: 'none' }}>Back to Admin</Link>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: '#fff', margin: 0 }}>Sourcing Requests</h1>
          <span style={{ background: GOLD, color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{requests.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['', 'new', 'in_progress', 'quoted', 'closed_won', 'closed_lost'].map((status) => (
            <button
              key={status}
              onClick={() => refetch(status)}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', background: statusFilter === status ? GOLD : 'rgba(255,255,255,.1)', color: '#fff' }}
            >
              {status === '' ? 'All' : STATUS_COLOURS[status]?.label || status}
            </button>
          ))}
          <button
            onClick={() => { setShowManualForm((value) => !value); setSelected(null); setMessage(''); }}
            style={{ padding: '8px 14px', borderRadius: '7px', border: `1px solid ${GOLD}`, cursor: 'pointer', fontSize: '12px', fontWeight: 800, fontFamily: '"DM Sans", sans-serif', background: GOLD, color: '#fff' }}
          >
            {showManualForm ? 'Close Form' : '+ Add Request'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ margin: '16px 24px 0', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
          {error}
        </div>
      )}
      {message && (
        <div style={{ margin: '16px 24px 0', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
          {message}
        </div>
      )}

      {showManualForm && (
        <ManualRequestForm
          form={manualForm}
          setManual={setManual}
          saving={manualSaving}
          onSave={createManualRequest}
        />
      )}

      <div style={{ display: 'flex', height: showManualForm ? 'auto' : 'calc(100vh - 65px)' }}>
        <div style={{ width: selected ? '45%' : '100%', overflowY: 'auto', borderRight: selected ? '1px solid #E0DDD7' : 'none', transition: 'width .2s' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>No sourcing requests yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fff', borderBottom: '2px solid #E0DDD7' }}>
                  {['Date', 'Company', 'Product', 'Qty', 'State', 'In-Hands', 'Status', 'Action'].map((head) => (
                    <th key={head} style={{ padding: '12px 16px', textAlign: 'left', color: '#7A7570', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => {
                  const st = STATUS_COLOURS[req.status] || STATUS_COLOURS.new;
                  const isSelected = selected?.id === req.id;
                  return (
                    <tr
                      key={req.id}
                      onClick={() => openDetail(req)}
                      style={{ background: isSelected ? '#FDF8F0' : index % 2 === 0 ? '#fff' : BG, borderBottom: '1px solid #F0EEED', cursor: 'pointer', borderLeft: isSelected ? `3px solid ${GOLD}` : '3px solid transparent' }}
                    >
                      <td style={{ padding: '12px 16px', color: '#7A7570', whiteSpace: 'nowrap' }}>
                        {req.created_at ? new Date(req.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : '-'}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: NAVY }}>{req.company_name}</td>
                      <td style={{ padding: '12px 16px', color: '#5A5550', maxWidth: '240px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{requestProductName(req)}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: NAVY, fontWeight: 600 }}>{req.quantity}</td>
                      <td style={{ padding: '12px 16px', color: '#5A5550' }}>{req.delivery_state || '-'}</td>
                      <td style={{ padding: '12px 16px', color: req.in_hands_date ? '#C0392B' : '#B0AAA3', fontWeight: req.in_hands_date ? 600 : 400, whiteSpace: 'nowrap' }}>
                        {req.in_hands_date ? new Date(`${req.in_hands_date}T00:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <a
                          href={`mailto:${req.email}?subject=Re: Sourcing Quote - ${encodeURIComponent(req.company_name || '')}`}
                          onClick={(event) => event.stopPropagation()}
                          style={{ color: GOLD, fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                        >
                          Reply
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <RequestDetail
            selected={selected}
            internalNote={internalNote}
            setInternalNote={setInternalNote}
            saving={saving}
            updateStatus={updateStatus}
            saveInternalNote={saveInternalNote}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}

function ManualRequestForm({ form, setManual, saving, onSave }) {
  return (
    <div style={{ margin: '18px 24px 0', background: BG, border: '1px solid #E0DDD7', borderRadius: '10px', padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', color: NAVY, fontFamily: '"Cormorant Garamond", serif', fontSize: '24px' }}>Add Manual Sourcing Request</h2>
          <div style={{ color: '#7A7570', fontSize: '13px' }}>For old customers who send requirements by email, phone, or WeChat.</div>
        </div>
        <button onClick={onSave} disabled={saving} style={{ background: saving ? '#B0AAA3' : GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving...' : 'Save Request'}
        </button>
      </div>

      <div style={{ color: NAVY, fontSize: '13px', fontWeight: 800, marginBottom: 8 }}>Customer</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
        <Field label="Company *"><input value={form.companyName} onChange={(e) => setManual('companyName', e.target.value)} /></Field>
        <Field label="Contact *"><input value={form.contactName} onChange={(e) => setManual('contactName', e.target.value)} /></Field>
        <Field label="Email *"><input type="email" value={form.email} onChange={(e) => setManual('email', e.target.value)} /></Field>
        <Field label="Company phone"><input value={form.companyPhone} onChange={(e) => setManual('companyPhone', e.target.value)} placeholder="Office / reception number" /></Field>
        <Field label="Mobile"><input value={form.mobile} onChange={(e) => setManual('mobile', e.target.value)} placeholder="Direct mobile" /></Field>
      </div>

      <div style={{ color: NAVY, fontSize: '13px', fontWeight: 800, margin: '16px 0 8px' }}>Product Brief</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
        <Field label="Product name *"><input value={form.productName} onChange={(e) => setManual('productName', e.target.value)} placeholder="e.g. Stainless steel bottle" /></Field>
        <Field label="Quantity *"><input type="number" value={form.quantity} onChange={(e) => setManual('quantity', e.target.value)} /></Field>
        <Field label="Product colour"><input value={form.productColour} onChange={(e) => setManual('productColour', e.target.value)} placeholder="Black, white, assorted..." /></Field>
        <Field label="PMS colour">
          <input value={form.pmsColour} onChange={(e) => setManual('pmsColour', e.target.value)} placeholder="Optional, e.g. PMS 186C" />
        </Field>
        <Field label="Target price"><input value={form.targetPrice} onChange={(e) => setManual('targetPrice', e.target.value)} /></Field>
        <Field label="In-hands date"><input type="date" value={form.inHandsDate} onChange={(e) => setManual('inHandsDate', e.target.value)} /></Field>
        <Field label="Delivery state">
          <select value={form.deliveryState} onChange={(e) => setManual('deliveryState', e.target.value)}>
            {['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT', 'TBA'].map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
        </Field>
        <Field label="Freight preference">
          <select value={form.freightPreference} onChange={(e) => setManual('freightPreference', e.target.value)}>
            <option value="">Not sure</option>
            <option value="express">Express</option>
            <option value="air">Air</option>
            <option value="sea">Sea</option>
            <option value="local">Local only</option>
          </select>
        </Field>
        <Field label="Decoration method"><input value={form.decorationMethod} onChange={(e) => setManual('decorationMethod', e.target.value)} placeholder="Screen print, laser, digital..." /></Field>
        <Field label="For children">
          <select value={form.forChildren} onChange={(e) => setManual('forChildren', e.target.value)}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
            <option value="mixed">Mixed</option>
          </select>
        </Field>
      </div>

      <div style={{ marginTop: '12px' }}>
        <Field label="Delivery address"><textarea rows={3} value={form.deliveryAddress} onChange={(e) => setManual('deliveryAddress', e.target.value)} placeholder="Street address, suburb, postcode, receiving contact if known..." /></Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <Field label="Product details"><textarea rows={5} value={form.productDescription} onChange={(e) => setManual('productDescription', e.target.value)} placeholder="Material, size, packaging, reference link, special features..." /></Field>
        <Field label="Logo / print requirements"><textarea rows={5} value={form.logoPrintRequirements} onChange={(e) => setManual('logoPrintRequirements', e.target.value)} placeholder="Logo position, print size, number of colours, PMS if needed..." /></Field>
        <Field label="Client notes / pasted email"><textarea rows={5} value={form.notes} onChange={(e) => setManual('notes', e.target.value)} /></Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <Field label="Extra colour notes"><textarea rows={3} value={form.colourRequirements} onChange={(e) => setManual('colourRequirements', e.target.value)} placeholder="Assorted colours, matched stock colour, not PMS critical..." /></Field>
        <Field label="Extra branding notes"><textarea rows={3} value={form.brandingRequirements} onChange={(e) => setManual('brandingRequirements', e.target.value)} /></Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <Field label="Compliance notes"><textarea rows={3} value={form.complianceNotes} onChange={(e) => setManual('complianceNotes', e.target.value)} /></Field>
        <Field label="Internal notes"><textarea rows={3} value={form.internalNotes} onChange={(e) => setManual('internalNotes', e.target.value)} /></Field>
      </div>
    </div>
  );
}

function RequestDetail({ selected, internalNote, setInternalNote, saving, updateStatus, saveInternalNote, onClose }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 4px' }}>{selected.company_name}</h2>
          <div style={{ fontSize: '13px', color: '#7A7570' }}>
            {selected.contact_name} / <a href={`mailto:${selected.email}`} style={{ color: GOLD }}>{selected.email}</a>
            {selected.phone && ` / ${requestPhoneDisplay(selected)}`}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#B0AAA3' }}>x</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_COLOURS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => updateStatus(selected.id, key)}
            style={{ padding: '6px 14px', borderRadius: '20px', border: `2px solid ${selected.status === key ? val.color : '#E0DDD7'}`, background: selected.status === key ? val.bg : '#fff', color: selected.status === key ? val.color : '#7A7570', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
          >
            {val.label}
          </button>
        ))}
      </div>

      <Section title="Product Requirements">
        <Row label="Product Name" value={requestProductName(selected)} bold />
        <Row label="Product Details" value={requestProductDetails(selected)} pre />
        <Row label="Quantity" value={selected.quantity} bold />
        <Row label="Colour / PMS" value={selected.colour_requirements} pre />
        <Row label="Target Price" value={selected.target_price} />
        {selected.in_hands_date && <Row label="In-Hands Date" value={new Date(`${selected.in_hands_date}T00:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })} bold red />}
        <Row label="Freight" value={freightLabels[selected.freight_preference] || selected.freight_preference} />
        <Row label="Delivery Address" value={requestDeliveryAddress(selected)} pre />
      </Section>

      <Section title="Branding & Compliance">
        <Row label="Logo / Print" value={requestLogoPrint(selected) || selected.branding_requirements} pre />
        <Row label="Decoration" value={selected.decoration_method} />
        <Row label="For Children" value={selected.for_children} />
        <Row label="Delivery State" value={selected.delivery_state} bold />
        <Row label="Compliance" value={selected.compliance_notes} pre />
      </Section>

      {requestClientNotes(selected) && (
        <Section title="Client Notes">
          <div style={{ fontSize: '13px', color: '#3D3A36', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{requestClientNotes(selected)}</div>
        </Section>
      )}

      <Section title="Internal Notes">
        <textarea
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
          placeholder="Add factory options, follow-up actions, pasted email context..."
          rows={5}
          style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', color: NAVY, outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
        />
        <button onClick={() => saveInternalNote(selected.id)} disabled={saving} style={{ marginTop: '8px', background: saving ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
      </Section>

      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <a href={`mailto:${selected.email}?subject=Re: Sourcing Quote Request - ${encodeURIComponent(selected.company_name || '')}`} style={{ flex: 1, display: 'block', background: GOLD, color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
          Reply to Client
        </a>
        <Link href={`/admin/sourcing/costing?request=${encodeURIComponent(selected.id)}`} style={{ display: 'block', background: NAVY, color: '#fff', textAlign: 'center', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
          Open Costing
        </Link>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', fontSize: '12px', color: '#7A7570', fontWeight: 700 }}>
      {label}
      <div style={{ marginTop: '5px' }}>{children}</div>
      <style jsx>{`
        input, select, textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1.5px solid #E0DDD7;
          border-radius: 7px;
          padding: 8px 10px;
          font: inherit;
          color: ${NAVY};
          background: #fff;
        }
      `}</style>
    </label>
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
      <span style={{ color: red ? '#C0392B' : NAVY, fontWeight: bold ? 700 : 400, whiteSpace: pre ? 'pre-wrap' : 'normal', flex: 1 }}>{value}</span>
    </div>
  );
}
