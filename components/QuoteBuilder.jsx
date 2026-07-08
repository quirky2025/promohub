'use client';
import { useState, useEffect, useCallback } from 'react';
import { MARGIN, GST, SHIPPING, SETUP_FEE, decoUnitPrice, brandingLabel, isColourMethod, isOneColourLocked } from '@/lib/pricing';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const aud = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inp = { width: '100%', padding: '9px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', background: '#fff', boxSizing: 'border-box', outline: 'none', fontFamily: '"DM Sans", sans-serif' };
const lbl = { fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' };

export default function QuoteBuilder({ open, onClose, prefill, onSent }) {
  const [cust, setCust] = useState({ name: '', company: '', email: '', phone: '' });
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState('');
  const [colour, setColour] = useState('');
  const [customColour, setCustomColour] = useState(false);
  const [custQ, setCustQ] = useState('');
  const [custResults, setCustResults] = useState([]);
  const [addon, setAddon] = useState({});
  const [override, setOverride] = useState('');
  const [leadTime, setLeadTime] = useState('3-7');
  const [disc, setDisc] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [delivery, setDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const defaultMessage = (nm) => `Hi ${nm ? String(nm).split(' ')[0] : 'there'},\n\nThank you so much for your enquiry — it was great to hear from you. I've put together a quote for you, attached as a PDF.\n\nAny questions at all, just reply to this email or call me on 02 9477 4748.\n\nKind regards,\nThe QuirkyPromo Team`;
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setCust({ name: prefill?.name || '', company: prefill?.company || '', email: prefill?.email || '', phone: prefill?.phone || '' });
      setQ(''); setResults([]); setProduct(null); setQty(''); setColour(''); setCustomColour(false); setAddon({}); setOverride(''); setLeadTime('7'); setDisc(''); setRequiredDate(''); setDelivery(prefill?.delivery || ''); setNotes(''); setMessage(defaultMessage(prefill?.name)); setStatus('idle'); setError(''); setCustQ(''); setCustResults([]);
    }
  }, [open, prefill]);

  const search = useCallback(async (term) => {
    if (!term.trim()) { setResults([]); return; }
    setSearching(true);
    const res = await fetch(`/api/admin/quote-builder?q=${encodeURIComponent(term)}`);
    const data = await res.json();
    setResults(data.products || []);
    setSearching(false);
  }, []);

  useEffect(() => { const t = setTimeout(() => search(q), 300); return () => clearTimeout(t); }, [q, search]);

  const fmtAddr = (a) => { if (!a) return ''; if (typeof a === 'string') return a; try { return Object.values(a).filter(Boolean).join(', '); } catch { return ''; } };
  useEffect(() => {
    if (!custQ.trim()) { setCustResults([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/quote-builder?customer=${encodeURIComponent(custQ)}`);
      const data = await res.json();
      setCustResults(data.customers || []);
    }, 300);
    return () => clearTimeout(t);
  }, [custQ]);
  function pickCustomer(c) {
    setCust({ name: c.name || '', company: c.company || '', email: c.email || '', phone: c.phone || '' });
    setDelivery(c.delivery || '');
    setMessage(m => (!m || m.startsWith('Hi ')) ? defaultMessage(c.name || c.company) : m);
    setCustResults([]); setCustQ('');
  }

  async function pick(p) {
    setResults([]); setQ(p.name);
    const res = await fetch(`/api/admin/quote-builder?id=${p.id}`);
    const data = await res.json();
    if (data.product) {
      setProduct(data.product);
      setQty(String(data.product.min_qty || '')); setColour(''); setCustomColour(false);
      const a = {}; (data.product.decoration_options || []).forEach(d => { a[d.id] = { on: false, setupQty: d.default_setup_qty || 1 }; });
      setAddon(a);
    }
  }

  if (!open) return null;

  const tiers = product?.pricing_tiers || [];
  const colourOpts = (() => { let arr = []; const cj = product?.colours; if (cj) { try { arr = Array.isArray(cj) ? cj : JSON.parse(cj); } catch {} } let names = (arr || []).map(c => (typeof c === 'string' ? c : c?.name)).filter(Boolean); if (!names.length) names = (product?.product_colours || []).map(c => c.name).filter(Boolean); return [...new Set(names)]; })();
  const decos = product?.decoration_options || [];
  const nQty = parseInt(qty) || 0;
  const activeTier = tiers.filter(t => nQty >= t.min_qty).sort((a, b) => b.min_qty - a.min_qty)[0] || tiers[0] || null;
  const selectedDecos = decos.filter(d => addon[d.id]?.on);
  const brandingDecos = selectedDecos.filter(d => d.type !== 'addon');
  const addonDecos = selectedDecos.filter(d => d.type === 'addon');

  let autoUnit = 0;
  if (activeTier && nQty > 0) {
    autoUnit = activeTier.base_price * MARGIN;
    selectedDecos.forEach(d => {
      autoUnit += decoUnitPrice(d.per_unit) * (addon[d.id]?.setupQty || 1);
      if (d.has_setup) autoUnit += (SETUP_FEE * (addon[d.id]?.setupQty || 1) / nQty);
    });
  }
  const unitPrice = override !== '' ? (parseFloat(override) || 0) : Math.round(autoUnit * 100) / 100;
  const discPct = parseFloat(disc) || 0;
  const subtotal = Math.round(unitPrice * nQty * (1 - discPct / 100) * 100) / 100;
  const gst = Math.round((subtotal + SHIPPING) * GST * 100) / 100;
  const total = subtotal + SHIPPING + gst;
  const brandingSummary = brandingDecos.map(d => brandingLabel(d, addon[d.id]?.setupQty)).join(' · ') || 'Unbranded';
  const canSend = cust.name && cust.email && product && nQty > 0;

  async function send() {
    setStatus('sending'); setError('');
    const rd = requiredDate ? new Date(requiredDate + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    try {
      const res = await fetch('/api/quote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cust.name, company: cust.company, email: cust.email, phone: cust.phone,
          qty: nQty, colour,
          brandingMethod: brandingDecos.map(d => d.name).join(', '),
          brandingSummary, extraOptions: addonDecos.map(d => d.name),
          requiredDate: rd, deliveryAddress: delivery, artworkFileName: '', notes,
          productName: product.name, productSku: product.supplier_sku || '',
          status: 'quote_sent',
          leadTimeDays: leadTime || '3-7', disc: discPct, customerMessage: message,
          unitPrice, subtotal, shipping: SHIPPING, gst, total,
        }),
      });
      if (!res.ok) { setError('Send failed. Check email/details and try again.'); setStatus('idle'); return; }
      setStatus('sent');
      if (onSent) onSent();
    } catch (e) { setError(String(e)); setStatus('idle'); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,42,74,0.55)', zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #E0DDD7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: 0 }}>Build a Quote</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', color: '#000', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {status === 'sent' ? (
          <div style={{ padding: '40px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: '0 0 8px' }}>Quote sent</h3>
            <p style={{ fontSize: '13px', color: '#000', margin: '0 0 20px' }}>PDF emailed to {cust.email}. It now shows in the board under Quotes.</p>
            <button onClick={onClose} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <div style={lbl}>Customer</div>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <input placeholder="Search registered customer (name / company / email)…" value={custQ} onChange={e => setCustQ(e.target.value)} style={inp} />
                {custResults.length > 0 && (
                  <div style={{ position: 'absolute', zIndex: 6, left: 0, right: 0, background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', marginTop: '4px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}>
                    {custResults.map((c, i) => (
                      <div key={i} onClick={() => pickCustomer(c)} style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #F0EEED', fontSize: '13px' }}>
                        <div style={{ fontWeight: 600, color: NAVY }}>{c.company || c.name || '(no name)'}</div>
                        <div style={{ fontSize: '11px', color: '#9B958E' }}>{[c.name, c.email].filter(Boolean).join(' · ') || '—'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input placeholder="Name *" value={cust.name} onChange={e => setCust({ ...cust, name: e.target.value })} style={inp} />
                <input placeholder="Company" value={cust.company} onChange={e => setCust({ ...cust, company: e.target.value })} style={inp} />
                <input placeholder="Email *" value={cust.email} onChange={e => setCust({ ...cust, email: e.target.value })} style={inp} />
                <input placeholder="Phone" value={cust.phone} onChange={e => setCust({ ...cust, phone: e.target.value })} style={inp} />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={lbl}>Product</div>
              <input placeholder="Search by name or SKU…" value={q} onChange={e => { setQ(e.target.value); setProduct(null); }} style={inp} />
              {results.length > 0 && !product && (
                <div style={{ position: 'absolute', zIndex: 5, left: 0, right: 0, background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', marginTop: '4px', maxHeight: '220px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}>
                  {results.map(p => (
                    <div key={p.id} onClick={() => pick(p)} style={{ padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid #F0EEED', fontSize: '13px' }}>
                      <div style={{ fontWeight: 600, color: NAVY }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#9B958E', fontFamily: '"DM Mono", monospace' }}>{p.supplier_sku} · min {p.min_qty}</div>
                    </div>
                  ))}
                </div>
              )}
              {searching && <div style={{ fontSize: '11px', color: '#9B958E', marginTop: '4px' }}>Searching…</div>}
              {product && <div style={{ fontSize: '11px', color: '#000', marginTop: '5px', fontFamily: '"DM Mono", monospace' }}>SKU: {product.supplier_sku || '—'} · min {product.min_qty}</div>}
            </div>

            {product && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <div style={lbl}>Quantity *</div>
                    <input type="text" inputMode="numeric" value={qty} onChange={e => setQty(e.target.value)} placeholder={`min ${product.min_qty}`} style={{ ...inp, fontFamily: '"DM Mono", monospace' }} />
                  </div>
                  <div>
                    <div style={lbl}>Colour</div>
                    {colourOpts.length > 0 && !customColour ? (
                      <select value={colour} onChange={e => { if (e.target.value === '__custom__') { setCustomColour(true); setColour(''); } else setColour(e.target.value); }} style={inp}>
                        <option value="">Select…</option>
                        {colourOpts.map((nm, i) => <option key={i} value={nm}>{nm}</option>)}
                        <option value="__custom__">Other / type my own…</option>
                      </select>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input value={colour} onChange={e => setColour(e.target.value)} placeholder="Type colour…" style={inp} autoFocus />
                        {colourOpts.length > 0 && <button type="button" onClick={() => { setCustomColour(false); setColour(''); }} title="Back to list" style={{ border: '1px solid #E0DDD7', borderRadius: '8px', background: '#fff', padding: '0 10px', fontSize: '12px', cursor: 'pointer', color: NAVY }}>List</button>}
                      </div>
                    )}
                  </div>
                </div>

                {decos.length > 0 && (
                  <div>
                    <div style={lbl}>Branding (optional)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {decos.map(d => {
                        const st = addon[d.id] || { on: false, setupQty: 1 };
                        const locked = !isColourMethod(d) || isOneColourLocked(d);
                        return (
                          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${st.on ? GOLD : '#E0DDD7'}`, borderRadius: '8px', padding: '7px 10px', background: st.on ? '#FDF8F0' : '#fff' }}>
                            <input type="checkbox" checked={st.on} onChange={() => setAddon({ ...addon, [d.id]: { ...st, on: !st.on } })} style={{ accentColor: GOLD }} />
                            <div style={{ flex: 1, fontSize: '12px', color: NAVY }}>{d.name}{d.detail && d.detail !== 'EMPTY' ? <span style={{ color: '#9B958E' }}> · {d.detail}</span> : null}</div>
                            {isColourMethod(d) && !isOneColourLocked(d) && (
                              <input type="number" min="1" value={st.setupQty} disabled={!st.on} onChange={e => setAddon({ ...addon, [d.id]: { ...st, setupQty: Math.max(1, parseInt(e.target.value) || 1) } })} title="# colours" style={{ width: '46px', padding: '4px', border: '1px solid #C8C4BC', borderRadius: '6px', fontSize: '12px', textAlign: 'center' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <div style={lbl}>Required date</div>
                    <input type="date" value={requiredDate} onChange={e => setRequiredDate(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <div style={lbl}>Unit price (override)</div>
                    <input type="number" step="0.01" value={override} onChange={e => setOverride(e.target.value)} placeholder={aud(autoUnit).replace('$', '')} style={{ ...inp, fontFamily: '"DM Mono", monospace' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <div style={lbl}>Lead time (business days)</div>
                    <input type="text" value={leadTime} onChange={e => setLeadTime(e.target.value)} placeholder="e.g. 3-7" style={{ ...inp, fontFamily: '"DM Mono", monospace' }} />
                  </div>
                  <div>
                    <div style={lbl}>Discount %</div>
                    <input type="number" step="0.01" min="0" value={disc} onChange={e => setDisc(e.target.value)} placeholder="0" style={{ ...inp, fontFamily: '"DM Mono", monospace' }} />
                  </div>
                </div>

                <div>
                  <div style={lbl}>Delivery address</div>
                  <textarea value={delivery} onChange={e => setDelivery(e.target.value)} rows={2} placeholder="Street, suburb, state, postcode — shown on the quote" style={{ ...inp, resize: 'vertical' }} />
                </div>

                <div>
                  <div style={lbl}>Notes <span style={{ color: '#9B958E', fontWeight: 400, textTransform: 'none' }}>(internal only)</span></div>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes — internal, not shown to customer…" style={{ ...inp, resize: 'vertical' }} />
                </div>

                <div>
                  <div style={lbl}>Message to customer <span style={{ color: '#9B958E', fontWeight: 400, textTransform: 'none' }}>(this is the email they receive)</span></div>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={7} placeholder="Write your message…" style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
                </div>

                <div style={{ background: NAVY, borderRadius: '10px', padding: '14px 16px', color: '#fff' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)', marginBottom: '4px' }}>{product.name} · qty {nQty || '—'}{colour ? ` · ${colour}` : ''} · {brandingSummary}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}><span>Unit (excl. GST)</span><span style={{ fontFamily: '"DM Mono", monospace' }}>{aud(unitPrice)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}><span>Subtotal + ship + GST</span><span style={{ fontFamily: '"DM Mono", monospace' }}>{aud(subtotal)} + {aud(SHIPPING)} + {aud(gst)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 700, color: GOLD, marginTop: '6px', borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: '8px' }}><span style={{ color: '#fff' }}>Total (incl. GST)</span><span style={{ fontFamily: '"DM Mono", monospace' }}>{aud(total)}</span></div>
                </div>
              </>
            )}

            {error && <div style={{ background: '#FCEBEB', color: '#A32D2D', fontSize: '12px', padding: '8px 12px', borderRadius: '8px' }}>{error}</div>}

            <button onClick={send} disabled={!canSend || status === 'sending'} style={{ width: '100%', background: !canSend ? '#C8C4BC' : GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: !canSend || status === 'sending' ? 'not-allowed' : 'pointer' }}>
              {status === 'sending' ? 'Sending…' : `Send Quote${product && nQty ? ` — ${aud(total)}` : ''}`}
            </button>
            {!canSend && <div style={{ fontSize: '11px', color: '#9B958E', textAlign: 'center' }}>Need customer name, email, a product and quantity.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
