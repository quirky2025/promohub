'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuoteBuilder from '@/components/QuoteBuilder';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

const STATUS_META = {
  new:         { label: 'New',         bg: '#E6F1FB', color: '#0C447C' },
  in_progress: { label: 'In Progress', bg: '#EEEDFE', color: '#3C3489' },
  quote_sent:  { label: 'Quote Sent',  bg: '#FAEEDA', color: '#854F0B' },
  follow_up:   { label: 'Follow Up',   bg: '#FBEAF0', color: '#993556' },
  won:         { label: 'Won',         bg: '#EAF3DE', color: '#3B6D11' },
  lost:        { label: 'Lost',        bg: '#FCEBEB', color: '#A32D2D' },
  expired:     { label: 'Expired',     bg: '#F1EFE8', color: '#5F5E5A' },
};
const STATUS_ORDER = ['new', 'in_progress', 'quote_sent', 'follow_up', 'won', 'lost', 'expired'];
const LOST_REASONS = ['Too expensive', 'Went with another supplier', 'No budget / cancelled', 'No response', 'Timing — too late', 'Other'];

const aud = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const fmtAddr = (co) => { if (!co) return ''; const a = co.billing_address; if (!a) return ''; if (typeof a === 'string') return a; try { return Object.values(a).filter(Boolean).join(', '); } catch { return ''; } };

function StatusPill({ status }) {
  const m = STATUS_META[status] || STATUS_META.new;
  return <span style={{ background: m.bg, color: m.color, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>{m.label}</span>;
}
function KindTag({ kind }) {
  const q = kind === 'quote';
  return <span style={{ background: q ? '#1B2A4A' : '#F1EFE8', color: q ? '#fff' : '#5F5E5A', padding: '2px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{q ? 'Quote' : 'Enquiry'}</span>;
}

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Enquiries & Quotes', href: '/admin/leads' },
  { label: 'Artworks', href: '/admin/artworks' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Sourcing', href: '/admin/sourcing' },
];

export default function AdminDealsPage() {
  const [deals, setDeals] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [actType, setActType] = useState('note');
  const [actBody, setActBody] = useState('');
  const [actSaving, setActSaving] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderPrefill, setBuilderPrefill] = useState(null);
  const [converting, setConverting] = useState(false);
  const router = useRouter();

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/deals');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    setDeals(data.deals || []);
    setCounts(data.counts || {});
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  async function openDetail(d) {
    setSelected(d);
    setDetail(null);
    setDetailLoading(true);
    setNoteDraft('');
    setLostReason(d.lost_reason || '');
    let data = {};
    try {
      const res = await fetch(`/api/admin/deals/detail?kind=${d.kind}&id=${d.id}`);
      data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      if (!data.record) data = { error: data.error || `HTTP ${res.status} — no record` };
    } catch (e) { data = { error: String(e) }; }
    setDetail(data);
    setNoteDraft(data.record?.internal_notes || '');
    setDetailLoading(false);
  }

  async function patch(action, payload) {
    setSaving(true);
    const res = await fetch('/api/admin/deals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, kind: selected.kind, action, ...payload }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.deal) {
      const ns = data.deal.status || selected.status;
      setDeals(prev => prev.map(x => (x.id === selected.id && x.kind === selected.kind) ? { ...x, status: ns, lost_reason: data.deal.lost_reason ?? x.lost_reason } : x));
      setSelected(prev => ({ ...prev, status: ns, lost_reason: data.deal.lost_reason ?? prev.lost_reason }));
      fetchDeals();
    }
  }

  async function convertToOrder() {
    if (!selected || selected.kind !== 'quote') return;
    const isIndent = detail?.record?.quote_type === 'indent';
    const msg = isIndent
      ? '转成 INDENT 订单？\n\n这是工厂订单，不会自动发邮件给客户或工厂。只在 Orders 里生成订单，之后你自己下工厂 PO、发发票。'
      : 'Convert this quote into an order? An Order Confirmation will be emailed to the customer.';
    if (!confirm(msg)) return;
    setConverting(true);
    const res = await fetch('/api/admin/quotes/convert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quoteId: selected.id }) });
    const data = await res.json().catch(() => ({}));
    setConverting(false);
    if (res.ok && data.orderNumber) {
      alert(isIndent
        ? `已转成订单 ${data.orderNumber}（INDENT，未发任何邮件）。在 Orders 里可以看到。`
        : `Converted to order ${data.orderNumber}. Order Confirmation emailed — it's now in the Orders board.`);
      fetchDeals();
      openDetail(selected);
    } else {
      alert('Convert failed: ' + (data.error || 'unknown'));
    }
  }

  async function markProceed() {
    if (!selected || selected.kind !== 'quote') return;
    if (!confirm('标记 PROCEED — 表示客户已同意这张 INDENT 报价，可以转成订单了。')) return;
    await patch('status', { status: 'won' });
  }

  async function deleteDeal() {
    if (!selected) return;
    const label = selected.kind === 'quote' ? '报价' : '询盘';
    const who = selected.customer_company || selected.customer_name || '';
    if (!confirm(`彻底删除这个${label}${who ? '（' + who + '）' : ''}？此操作不可恢复。`)) return;
    const res = await fetch(`/api/admin/deals?kind=${selected.kind}&id=${encodeURIComponent(selected.id)}`, { method: 'DELETE' });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { alert('删除失败: ' + (d.error || 'unknown')); return; }
    setSelected(null); setDetail(null); fetchDeals();
  }

  async function addActivity() {
    if (!detail?.company?.id || !actBody.trim()) return;
    setActSaving(true);
    const res = await fetch('/api/admin/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ company_id: detail.company.id, type: actType, body: actBody }) });
    const data = await res.json();
    setActSaving(false);
    if (data.entry) { setDetail(prev => ({ ...prev, activity: [data.entry, ...(prev.activity || [])] })); setActBody(''); }
  }

  const ACT_LABEL = { note: 'Note', email_out: 'Email sent', email_in: 'Email received', call: 'Call', followup: 'Follow-up', stage: 'Stage' };

  const filtered = deals.filter(d => {
    if (['enquiry', 'quote'].includes(filter)) { if (d.kind !== filter) return false; }
    else if (filter !== 'all' && d.status !== filter) return false;
    if (search) {
      const hay = [d.customer_name, d.customer_company, d.customer_email, d.summary, d.reference].join(' ').toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'enquiry', label: 'Enquiries' },
    { key: 'quote', label: 'Quotes' },
    { key: 'quote_sent', label: 'Quote Sent' },
    { key: 'follow_up', label: 'Follow Up' },
    { key: 'won', label: 'Won' },
    { key: 'lost', label: 'Lost' },
  ];

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: NAVY, padding: '0 32px', display: 'flex', alignItems: 'center', height: '56px' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '2px', marginRight: '32px' }}>
          QUIRKY<span style={{ color: GOLD }}>PROMO</span><span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px', letterSpacing: '1px' }}>ADMIN</span>
        </span>
        <nav style={{ display: 'flex', gap: '4px' }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} style={{ color: item.href === '/admin/leads' ? '#fff' : 'rgba(255,255,255,0.7)', background: item.href === '/admin/leads' ? 'rgba(255,255,255,0.12)' : 'transparent', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}>{item.label}</Link>
          ))}
        </nav>
      </div>

      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, color: NAVY, margin: 0 }}>Enquiries &amp; Quotes <span style={{ fontSize: '15px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>· Local Stock</span></h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer / email / product…" style={{ width: '260px', padding: '9px 14px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }} />
            <button onClick={() => { setBuilderPrefill(null); setBuilderOpen(true); }} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>＋ New Quote</button>
          </div>
        </div>


        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {tabs.map(t => {
            const active = filter === t.key;
            const n = counts[t.key];
            return <button key={t.key} onClick={() => setFilter(t.key)} style={{ background: active ? NAVY : '#fff', color: active ? '#fff' : NAVY, border: '1px solid ' + (active ? NAVY : '#E0DDD7'), padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t.label}{n != null ? ` ${n}` : ''}</button>;
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1.5fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden' }}>
            {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7570' }}>Loading…</div>
            : filtered.length === 0 ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7570' }}>Nothing in this view.</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead><tr style={{ color: '#7A7570', textAlign: 'left', background: '#FBFAF8' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Detail</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Date</th>
                </tr></thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={`${d.kind}-${d.id}`} onClick={() => openDetail(d)} style={{ borderTop: '1px solid #F0EEED', cursor: 'pointer', background: (selected?.id === d.id && selected?.kind === d.kind) ? '#FDF8F0' : '#fff' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, color: NAVY }}>{d.customer_company || d.customer_name || '(no name)'}</div>
                        <div style={{ color: '#9B958E', fontSize: '11px' }}>{d.customer_email || '—'}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}><KindTag kind={d.kind} /></td>
                      <td style={{ padding: '10px 14px', color: '#5A5550', maxWidth: '280px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.summary || '—'}</div></td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: '#5A5550', fontFamily: '"DM Mono", monospace' }}>{d.kind === 'quote' ? aud(d.total) : '—'}</td>
                      <td style={{ padding: '10px 14px' }}><StatusPill status={d.status} /></td>
                      <td style={{ padding: '10px 14px', color: '#7A7570', whiteSpace: 'nowrap' }}>{fmtDateTime(d.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selected && (
            <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', padding: '20px', position: 'sticky', top: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><KindTag kind={selected.kind} />{detail?.record?.quote_type === 'indent' && <span style={{ background: '#7C2D12', color: '#fff', padding: '2px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>INDENT</span>}<StatusPill status={selected.status} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={deleteDeal} title="删除" style={{ background: 'none', border: '1px solid #E0C9C9', color: '#991B1B', fontSize: '12px', fontWeight: 700, cursor: 'pointer', borderRadius: '6px', padding: '4px 10px' }}>🗑 删除</button>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#B0AAA3', cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>
              </div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '6px 0 2px' }}>{selected.customer_company || selected.customer_name || '(no name)'}</h2>
              <div style={{ color: '#7A7570', fontSize: '12px', marginBottom: '14px' }}>{selected.customer_name}{selected.customer_email ? ` · ${selected.customer_email}` : ''}</div>

              <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Status</div>
              <select value={selected.status} onChange={e => patch('status', { status: e.target.value })} disabled={saving}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', background: '#fff' }}>
                {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
              </select>

              {selected.status === 'lost' && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Lost reason</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select value={lostReason} onChange={e => setLostReason(e.target.value)} style={{ flex: 1, padding: '8px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', background: '#fff' }}>
                      <option value="">Select reason…</option>
                      {LOST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button onClick={() => patch('lost', { lost_reason: lostReason })} disabled={saving} style={{ background: '#fff', color: NAVY, border: '1px solid ' + NAVY, borderRadius: '8px', padding: '0 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                  </div>
                </div>
              )}

              {detailLoading ? <div style={{ color: '#7A7570', fontSize: '13px' }}>Loading…</div> : (detail && !detail.record) ? (
                <div style={{ color: '#A32D2D', fontSize: '13px', padding: '8px 0' }}>Couldn't load details. {detail.error || ''}</div>
              ) : detail && (
                <>
                  <div style={{ background: '#ffffff', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#1B2A4A', marginBottom: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {selected.kind === 'quote'
                      ? <>{detail.record.product_name} · qty {detail.record.quantity}{detail.record.colour ? ` · ${detail.record.colour}` : ''}<br />{detail.record.branding_summary || ''}<br /><strong>{aud(detail.record.total)}</strong> incl. GST{detail.record.quote_number ? ` · ${detail.record.quote_number}` : ''}</>
                      : (detail.record.message || '—')}
                    {detail.record.required_date ? <><br /><span style={{ color: '#7A7570' }}>Required: {detail.record.required_date}</span></> : null}
                    {detail.record.date_needed ? <><br /><span style={{ color: '#7A7570' }}>Required: {detail.record.date_needed}</span></> : null}
                  </div>

                  {selected.kind === 'enquiry' && (
                    <button onClick={() => { setBuilderPrefill({ name: selected.customer_name, company: selected.customer_company, email: selected.customer_email, phone: detail.record?.phone || '', delivery: detail.company?.delivery_address || '' }); setBuilderOpen(true); }} style={{ width: '100%', background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginBottom: '14px' }}>＋ Build Quote</button>
                  )}

                  {selected.kind === 'quote' && (
                    detail.record.converted_order_number
                      ? <div style={{ background: '#EAF3DE', color: '#3B6D11', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>✓ Converted to order {detail.record.converted_order_number}</div>
                      : detail.record.quote_type === 'indent'
                        ? ((selected.status === 'won' || selected.status === 'accepted')
                            ? <button onClick={convertToOrder} disabled={converting} style={{ width: '100%', background: converting ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '14px', fontWeight: 700, cursor: converting ? 'not-allowed' : 'pointer', marginBottom: '14px' }}>{converting ? '转换中…' : '→ 转成订单 (INDENT · 不发邮件)'}</button>
                            : <div style={{ marginBottom: '14px' }}>
                                <div style={{ background: '#FAEEDA', color: '#854F0B', borderRadius: '8px', padding: '9px 12px', fontSize: '12px', lineHeight: 1.5, marginBottom: '8px' }}>这是 INDENT（工厂）报价。客户同意后先点 PROCEED，才能转成订单。转订单不会自动发邮件。</div>
                                <button onClick={markProceed} disabled={saving} style={{ width: '100%', background: saving ? '#B0AAA3' : GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? '…' : '✓ 标记 PROCEED（客户同意）'}</button>
                              </div>)
                        : <button onClick={convertToOrder} disabled={converting} style={{ width: '100%', background: converting ? '#B0AAA3' : '#2D6A4F', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '14px', fontWeight: 700, cursor: converting ? 'not-allowed' : 'pointer', marginBottom: '14px' }}>{converting ? 'Converting…' : '→ Convert to Order'}</button>
                  )}

                  <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Internal note</div>
                  <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} rows={2} placeholder="Called 18/6, sending revised qty…" style={{ width: '100%', padding: '9px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', background: '#fff' }} />
                  <button onClick={() => patch('note', { note: noteDraft })} disabled={saving} style={{ background: '#fff', color: NAVY, border: '1px solid ' + NAVY, borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '8px', marginBottom: '16px' }}>{saving ? 'Saving…' : 'Save note'}</button>

                  <div style={{ borderTop: '1px solid #F0EEED', paddingTop: '12px', fontSize: '13px' }}>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: '6px' }}>Customer history{detail.company ? ` · ${detail.company.name}` : ''}</div>
                    {!detail.company ? <div style={{ color: '#9B958E' }}>Not linked to a company account.</div> : (
                      <div style={{ color: '#5A5550' }}>
                        <div>{detail.contacts?.length || 0} contact(s) · {detail.history?.quotes?.length || 0} quote(s) · {detail.history?.enquiries?.length || 0} enquiry(s) · {detail.history?.orders?.length || 0} order(s)</div>
                      </div>
                    )}
                  </div>

                  {detail.company && (
                    <div style={{ borderTop: '1px solid #F0EEED', paddingTop: '12px', marginTop: '12px', fontSize: '13px' }}>
                      <div style={{ fontWeight: 700, color: NAVY, marginBottom: '8px' }}>Timeline</div>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <select value={actType} onChange={e => setActType(e.target.value)} style={{ padding: '7px 8px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '12px', background: '#fff' }}>
                          {Object.entries(ACT_LABEL).filter(([k]) => k !== 'stage').map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <input value={actBody} onChange={e => setActBody(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addActivity(); }} placeholder="Log a note / email / call…" style={{ flex: 1, padding: '7px 10px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '12px', background: '#fff' }} />
                        <button onClick={addActivity} disabled={actSaving || !actBody.trim()} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '0 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                      </div>
                      <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                        {(detail.activity || []).length === 0 ? <div style={{ color: '#9B958E', fontSize: '12px' }}>No entries yet.</div> : detail.activity.map(a => (
                          <div key={a.id} style={{ padding: '7px 0', borderBottom: '1px solid #F6F4F1' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                              <span style={{ background: '#F1EFE8', color: '#5F5E5A', fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '5px', textTransform: 'uppercase' }}>{ACT_LABEL[a.type] || a.type}</span>
                              <span style={{ fontSize: '11px', color: '#9B958E' }}>{fmtDate(a.created_at)}</span>
                            </div>
                            <div style={{ color: '#3D3A36', fontSize: '12.5px', whiteSpace: 'pre-wrap' }}>{a.body}</div>
                            {a.author && <div style={{ fontSize: '10.5px', color: '#B0AAA3' }}>{a.author}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <QuoteBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} prefill={builderPrefill} onSent={() => { setBuilderOpen(false); fetchDeals(); }} />
    </div>
  );
}
