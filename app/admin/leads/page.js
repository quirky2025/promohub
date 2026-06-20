'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const STAGE_META = {
  lead:       { label: 'New',        bg: '#E6F1FB', color: '#0C447C' },
  contacted:  { label: 'Contacted',  bg: '#EEEDFE', color: '#3C3489' },
  quoted:     { label: 'Quote Sent', bg: '#FAEEDA', color: '#854F0B' },
  follow_up:  { label: 'Follow Up',  bg: '#FBEAF0', color: '#993556' },
  won:        { label: 'Won',        bg: '#EAF3DE', color: '#3B6D11' },
  lost:       { label: 'Lost',       bg: '#F1EFE8', color: '#5F5E5A' },
};
const STAGE_ORDER = ['lead', 'contacted', 'quoted', 'follow_up', 'won', 'lost'];
const aud = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function StagePill({ stage }) {
  const m = STAGE_META[stage] || STAGE_META.lead;
  return <span style={{ background: m.bg, color: m.color, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>{m.label}</span>;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [industryDraft, setIndustryDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/leads');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    setLeads(data.leads || []);
    setCounts(data.counts || {});
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function openDetail(lead) {
    setSelected(lead);
    setDetail(null);
    setDetailLoading(true);
    setNoteDraft(lead.notes || '');
    setIndustryDraft(lead.industry || '');
    const res = await fetch(`/api/admin/leads/${lead.id}`);
    const data = await res.json();
    setDetail(data);
    setDetailLoading(false);
  }

  async function patch(action, payload) {
    setSaving(true);
    const res = await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, action, ...payload }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.lead) {
      setLeads(prev => prev.map(l => l.id === data.lead.id ? { ...l, ...data.lead } : l));
      setSelected(prev => ({ ...prev, ...data.lead }));
    }
  }

  const filtered = leads.filter(l => {
    const stage = l.lifecycle_stage || 'lead';
    if (filter === 'needs_review') { if (!l.needs_review) return false; }
    else if (filter !== 'all' && stage !== filter) return false;
    if (search) {
      const hay = [l.name, l.industry, l.primary_contact?.email, l.primary_contact?.name].join(' ').toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const tabs = [
    { key: 'all', label: 'All' },
    ...STAGE_ORDER.map(s => ({ key: s, label: STAGE_META[s].label })),
    { key: 'needs_review', label: 'Needs review' },
  ];

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: NAVY, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '2px' }}>
            QUIRKY<span style={{ color: GOLD }}>PROMO</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px', letterSpacing: '1px' }}>ADMIN</span>
          </span>
          <nav style={{ display: 'flex', gap: '4px' }}>
            {[
              { label: 'Dashboard', href: '/admin' },
              { label: 'Leads', href: '/admin/leads' },
              { label: 'Artworks', href: '/admin/artworks' },
              { label: 'Orders', href: '/admin/orders' },
              { label: 'Quotes', href: '/admin/quotes' },
              { label: 'Products', href: '/admin/products' },
              { label: 'Sourcing', href: '/admin/sourcing' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ color: item.href === '/admin/leads' ? '#fff' : 'rgba(255,255,255,0.7)', background: item.href === '/admin/leads' ? 'rgba(255,255,255,0.12)' : 'transparent', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, color: NAVY, margin: 0 }}>Leads <span style={{ fontSize: '15px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>· Local Stock</span></h1>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name / email / industry…" style={{ width: '280px', padding: '9px 14px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }} />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {tabs.map(t => {
            const active = filter === t.key;
            const n = counts[t.key];
            return (
              <button key={t.key} onClick={() => setFilter(t.key)} style={{
                background: active ? NAVY : '#fff', color: active ? '#fff' : (t.key === 'needs_review' && counts.needs_review ? '#854F0B' : NAVY),
                border: '1px solid ' + (active ? NAVY : '#E0DDD7'), padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>{t.label}{n != null ? ` ${n}` : ''}</button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1.5fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A7570' }}>Loading…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A7570' }}>No leads in this view.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: '#7A7570', textAlign: 'left', background: '#FBFAF8' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Company</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Stage</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Q</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Enq</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Ord</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l.id} onClick={() => openDetail(l)} style={{ borderTop: '1px solid #F0EEED', cursor: 'pointer', background: selected?.id === l.id ? '#FDF8F0' : '#fff' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, color: NAVY, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {l.name || '(no name)'}
                          {l.needs_review && <span title="Needs review" style={{ color: '#BA7517' }}>⚠</span>}
                        </div>
                        <div style={{ color: '#9B958E', fontSize: '11px' }}>{l.primary_contact?.email || '—'}{l.industry ? ` · ${l.industry}` : ''}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}><StagePill stage={l.lifecycle_stage || 'lead'} /></td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#5A5550' }}>{l.quote_count}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#5A5550' }}>{l.enquiry_count}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#5A5550' }}>{l.order_count}</td>
                      <td style={{ padding: '10px 14px', color: '#7A7570' }}>{fmtDate(l.last_activity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selected && (
            <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', padding: '20px', position: 'sticky', top: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: 0 }}>{selected.name || '(no name)'}</h2>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#B0AAA3', cursor: 'pointer', lineHeight: 1 }}>×</button>
              </div>
              {selected.needs_review && (
                <div style={{ background: '#FAEEDA', color: '#854F0B', fontSize: '12px', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>⚠ Free-text data — review / merge</span>
                  <button onClick={() => patch('review_clear')} disabled={saving} style={{ background: '#854F0B', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>Mark reviewed</button>
                </div>
              )}

              <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Stage</div>
              <select value={selected.lifecycle_stage || 'lead'} onChange={e => patch('stage', { lifecycle_stage: e.target.value })} disabled={saving}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', background: '#fff' }}>
                {STAGE_ORDER.map(s => <option key={s} value={s}>{STAGE_META[s].label}</option>)}
              </select>

              <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Industry</div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                <input value={industryDraft} onChange={e => setIndustryDraft(e.target.value)} placeholder="e.g. Hospitality" style={{ flex: 1, padding: '8px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', background: '#fff' }} />
                <button onClick={() => patch('industry', { industry: industryDraft })} disabled={saving} style={{ background: '#fff', color: NAVY, border: '1px solid ' + NAVY, borderRadius: '8px', padding: '0 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
              </div>

              <div style={{ fontSize: '11px', color: '#7A7570', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Follow-up note</div>
              <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} rows={3} placeholder="Called 18/6, sending revised qty…"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', background: '#fff' }} />
              <button onClick={() => patch('note', { notes: noteDraft })} disabled={saving} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '8px', marginBottom: '16px' }}>{saving ? 'Saving…' : 'Save note'}</button>

              {detailLoading ? (
                <div style={{ color: '#7A7570', fontSize: '13px' }}>Loading history…</div>
              ) : detail && (
                <div style={{ borderTop: '1px solid #F0EEED', paddingTop: '14px', fontSize: '13px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: '6px' }}>Contacts ({detail.contacts.length})</div>
                    {detail.contacts.length === 0 ? <div style={{ color: '#9B958E' }}>—</div> : detail.contacts.map(c => (
                      <div key={c.id} style={{ color: '#5A5550', marginBottom: '3px' }}>
                        {[c.first_name, c.last_name].filter(Boolean).join(' ') || c.email}{c.title ? ` · ${c.title}` : ''}<br /><span style={{ color: '#9B958E', fontSize: '12px' }}>{c.email}{c.phone ? ` · ${c.phone}` : ''}{c.auth_user_id ? ' · ✓ registered' : ''}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: '6px' }}>Enquiries ({detail.enquiries.length})</div>
                    {detail.enquiries.length === 0 ? <div style={{ color: '#9B958E' }}>—</div> : detail.enquiries.map(e => (
                      <div key={e.id} style={{ color: '#5A5550', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #F6F4F1' }}>
                        <div>{e.message}</div>
                        <span style={{ color: '#9B958E', fontSize: '12px' }}>{fmtDate(e.created_at)}{e.quantity ? ` · qty ${e.quantity}` : ''}{e.source ? ` · ${e.source}` : ''}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: '6px' }}>Quotes ({detail.quotes.length})</div>
                    {detail.quotes.length === 0 ? <div style={{ color: '#9B958E' }}>—</div> : detail.quotes.map(q => (
                      <div key={q.id} style={{ color: '#5A5550', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{q.quote_number || q.product_name || 'Quote'}</span>
                        <span style={{ color: '#9B958E' }}>{aud(q.total)} · {q.status || '—'}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: '6px' }}>Orders ({detail.orders.length})</div>
                    {detail.orders.length === 0 ? <div style={{ color: '#9B958E' }}>—</div> : detail.orders.map(o => (
                      <div key={o.id} style={{ color: '#5A5550', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{o.order_number || 'Order'}</span>
                        <span style={{ color: '#9B958E' }}>{aud(o.total)}{o.payment_status ? ` · ${o.payment_status}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
