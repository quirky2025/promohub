'use client';

// Multi-step "Get a Quote" wizard (replaces the old single-page QuoteModal).
// Steps: 1 Product (colour + qty + print method)  2 Your details (contact + delivery)
//        3 Artwork (logo + required date + notes)  4 Review (+ live estimated price)
// Design rules: ALL text is pure black (#000) — never grey. Fonts match the site
// (DM Sans body, Cormorant Garamond headings, DM Mono numbers). Navy #1B2A4A and
// gold #C9A96E are brand accents only. Submits the SAME payload to /api/quote as before.

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { gaEvent } from '@/lib/gtag';
import { uploadImage } from '@/lib/imageHost';
import { GST, SHIPPING, SETUP_FEE, decoUnitPrice, brandingLabel } from '@/lib/pricing';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BLACK = '#000000';
const DM = '"DM Sans", sans-serif';
const SERIF = '"Cormorant Garamond", serif';
const MONO = '"DM Mono", monospace';
const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
const STEPS = ['Product', 'Your details', 'Artwork', 'Review'];
const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const IN = { width: '100%', padding: '9px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: DM, color: BLACK, boxSizing: 'border-box', background: '#fff', outline: 'none' };
const SEL = { ...IN, cursor: 'pointer' };
const LB = { fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: DM };

export default function QuoteWizard({ product, colours = [], decorations = [], pricingTiers = [], calcUnit, addonState = {}, setAddonState, selectedColour = '', qty = 1, onClose }) {
  const [step, setStep] = useState(0);
  const [wizColour, setWizColour] = useState(selectedColour || '');
  const [colourErr, setColourErr] = useState(false);
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({
    qty: String(qty), requiredDate: '', purpose: '',
    street: '', street2: '', suburb: '', state: '', postcode: '',
    name: '', company: '', email: '', phone: '',
    notes: '', artworkFileName: '', artworkUrl: '', artworkUploading: false,
  });

  const brandingDecos = decorations.filter((d) => d.type !== 'addon');
  const addonDecos = decorations.filter((d) => d.type === 'addon');
  const selectedDecos = decorations.filter((d) => addonState?.[d.id]?.on);
  const brandingSel = selectedDecos.filter((d) => d.type !== 'addon');
  const addonSel = selectedDecos.filter((d) => d.type === 'addon');
  // Print pricing is per COLOUR, per POSITION. We drive the existing engine by
  // setting setupQty = colours × positions (calcUnit already multiplies both the
  // per-unit rate AND the setup fee by setupQty — so the maths comes out exactly right).
  const isEngrave = (d) => /laser|engrav|deboss|emboss|etch/i.test(d?.name || '');
  const dimOf = (d) => { const st = addonState?.[d.id] || {}; return { c: Math.max(1, st.colours ?? st.setupQty ?? 1), p: Math.max(1, st.positions ?? 1) }; };
  const bumpDim = (id, key, delta) => setAddonState((prev) => {
    const st = prev[id] || {};
    let c = Math.max(1, st.colours ?? st.setupQty ?? 1);
    let p = Math.max(1, st.positions ?? 1);
    if (key === 'c') c = Math.max(1, c + delta);
    if (key === 'p') p = Math.max(1, p + delta);
    return { ...prev, [id]: { ...st, on: true, colours: c, positions: p, setupQty: c * p } };
  });
  const brandingSummary = brandingSel.map((d) => { const { c, p } = dimOf(d); return isEngrave(d) ? `${d.name} — ${p} POS` : `${d.name} — ${c} COL × ${p} POS`; }).join(' · ') || 'Unbranded';

  const formQty = parseInt(form.qty) || qty;
  const matchedTier = pricingTiers.reduce((best, t) => (formQty >= t.min_qty ? (!best || t.min_qty > best.min_qty ? t : best) : best), null) || pricingTiers[0];
  const matchedTierIndex = matchedTier ? pricingTiers.findIndex((t) => t.id === matchedTier.id) : 0;
  const unitPrice = matchedTier ? calcUnit(matchedTier.base_price, formQty, matchedTierIndex) : 0;
  const subtotal = Math.round(unitPrice * formQty * 100) / 100;
  const gst = Math.round((subtotal + SHIPPING) * GST * 100) / 100;
  const total = subtotal + SHIPPING + gst;

  const colourMissing = colours.length > 0 && !wizColour;
  const emailOk = (form.email || '').includes('@') && (form.email || '').includes('.');
  // Each step's required fields must be filled before "Next" is enabled.
  const stepBlocked =
    (step === 0 && (colourMissing || !(formQty >= (product.min_qty || 1)))) ||
    (step === 1 && (!form.name.trim() || !emailOk || !form.street.trim() || !form.suburb.trim() || !form.state || !form.postcode.trim()));
  const showPrice = subtotal > 0;
  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const handleChange = (e) => setF(e.target.name, e.target.value);
  const toggleDeco = (id) => setAddonState((prev) => ({ ...prev, [id]: { ...prev[id], on: !prev[id]?.on } }));

  async function submit() {
    if (!form.name || !form.email) { setStep(1); return; }
    setStatus('sending');
    const requiredDate = form.requiredDate ? form.requiredDate.split('-').reverse().join('/') : '';
    const deliveryAddress = [form.street, form.street2, form.suburb, form.state, form.postcode, 'Australia'].filter(Boolean).join(', ');
    try {
      const payload = {
        ...form, colour: wizColour || '', requiredDate, deliveryAddress,
        brandingMethod: brandingSel.map((d) => d.name).join(', '), brandingSummary,
        extraOptions: addonSel.map((d) => d.name),
        productName: product.name, productSku: product.supplier_sku,
        unitPrice, subtotal, shipping: SHIPPING, gst, total, qty: formQty,
      };
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(s ? { Authorization: `Bearer ${s.access_token}` } : {}) },
        body: JSON.stringify(payload),
      });
      if (res.ok) { gaEvent('enquiry_submit', { product_slug: product.slug, enquiry_type: 'product_enquiry' }); setStatus('success'); }
      else setStatus('error');
    } catch { setStatus('error'); }
  }

  function next() {
    if (stepBlocked) { if (step === 0 && colourMissing) setColourErr(true); return; }
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  }
  const back = () => step > 0 && setStep(step - 1);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,42,74,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '94vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(27,42,74,0.3)' }}>

        <div style={{ background: NAVY, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', position: 'sticky', top: 0, zIndex: 5 }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: '24px', fontWeight: 600 }}>Get a Quote</div>
            <div style={{ fontFamily: DM, fontSize: '12px', color: '#fff' }}>{product.name}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {status === 'success' ? (
          <div style={{ padding: '46px 30px', textAlign: 'center', fontFamily: DM }}>
            <div style={{ fontSize: '46px', marginBottom: '12px' }}>✅</div>
            <h3 style={{ fontFamily: SERIF, fontSize: '26px', fontWeight: 600, color: NAVY, margin: '0 0 8px' }}>Quote request received</h3>
            <p style={{ fontSize: '14px', color: BLACK, margin: '0 0 6px' }}>Thanks {form.name || ''} — we'll email your formal quote within <strong>3 business hours</strong>.</p>
            <p style={{ fontSize: '13px', color: BLACK, margin: '0 0 22px' }}>You'll get a free digital proof before anything is printed. No payment until you approve.</p>
            <button onClick={onClose} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 32px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: DM }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex' }}>
              <aside style={{ width: '162px', flexShrink: 0, background: '#FAF8F4', borderRight: '1px solid #ECE8E1', padding: '18px 14px' }}>
                {STEPS.map((s, i) => {
                  const on = i === step, done = i < step;
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '7px 0' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, fontFamily: DM, background: on ? GOLD : done ? '#DDEBE2' : '#ECE8E1', color: on ? '#fff' : done ? '#1B5E3A' : NAVY }}>{done ? '✓' : i + 1}</span>
                      <span style={{ fontFamily: DM, fontSize: '12px', fontWeight: on ? 700 : 500, color: on ? NAVY : BLACK }}>{s}</span>
                    </div>
                  );
                })}
                <div style={{ marginTop: '20px', background: '#EEF3FA', borderRadius: '9px', padding: '12px' }}>
                  <div style={{ fontFamily: DM, fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>Quote with confidence</div>
                  {['Free quote within 3 hrs', 'No obligation', 'Free proof before printing', 'No payment until approved'].map((t) => (
                    <div key={t} style={{ fontFamily: DM, fontSize: '11px', color: BLACK, lineHeight: 1.5, marginBottom: '5px', display: 'flex', gap: '5px' }}>
                      <span style={{ color: '#1B5E3A' }}>✓</span><span>{t}</span>
                    </div>
                  ))}
                </div>
              </aside>

              <div style={{ flex: 1, minWidth: 0, padding: '18px 20px', fontFamily: DM }}>
                {step === 0 && (
                  <>
                    <label style={LB}>Product colour *</label>
                    {colours.length > 0 ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px', marginBottom: '6px' }}>
                          {colours.map((c) => {
                            const on = wizColour === c.name;
                            return (
                              <button key={c.name} onClick={() => { setWizColour(c.name); setColourErr(false); }} style={{ display: 'flex', alignItems: 'center', gap: '7px', textAlign: 'left', border: on ? `2px solid ${GOLD}` : '1px solid #E0DDD7', background: on ? '#FDF8F0' : '#fff', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' }}>
                                {c.image ? <img src={c.image} alt="" style={{ width: '22px', height: '22px', objectFit: 'contain', flexShrink: 0 }} /> : <span style={{ width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0, border: '1px solid #ddd', background: '#eee' }} />}
                                <span style={{ fontSize: '11.5px', fontWeight: on ? 700 : 500, color: BLACK }}>{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                        {colourErr && <div style={{ color: '#B4413E', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>Please choose a colour to continue.</div>}
                      </>
                    ) : <div style={{ fontSize: '13px', color: BLACK, marginBottom: '12px' }}>One colour — no selection needed.</div>}

                    <label style={{ ...LB, marginTop: '14px' }}>Quantity *</label>
                    <input name="qty" inputMode="numeric" value={form.qty} onChange={handleChange} placeholder={`min. ${product.min_qty || 1}`} style={{ ...IN, maxWidth: '130px', fontFamily: MONO, marginBottom: '16px' }} />

                    {brandingDecos.length > 0 && (
                      <>
                        <label style={LB}>Print method</label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {brandingDecos.map((d) => {
                            const on = !!addonState?.[d.id]?.on;
                            const { c, p } = dimOf(d);
                            const eng = isEngrave(d);
                            return (
                              <div key={d.id} style={{ border: on ? `2px solid ${GOLD}` : '1px solid #E0DDD7', background: on ? '#FDF8F0' : '#fff', borderRadius: '8px', padding: '9px 11px' }}>
                                <div onClick={() => toggleDeco(d.id)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: NAVY }}>{on ? '☑ ' : '☐ '}{d.name}</span>
                                  <span style={{ fontSize: '11px', color: BLACK, textAlign: 'right' }}>+{money(decoUnitPrice(d.per_unit))}/unit{d.has_setup ? ` · setup ${money(d.setup_fee ?? SETUP_FEE)}` : ''}<br /><span style={{ color: '#6B7280', fontSize: '10px' }}>per colour · per position</span></span>
                                </div>
                                {on && (
                                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
                                    {!eng && <Stepper label="Colours" val={c} onDec={() => bumpDim(d.id, 'c', -1)} onInc={() => bumpDim(d.id, 'c', 1)} />}
                                    <Stepper label="Positions" val={p} onDec={() => bumpDim(d.id, 'p', -1)} onInc={() => bumpDim(d.id, 'p', 1)} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ fontSize: '11px', color: BLACK, marginTop: '8px' }}>Tap to add or remove. Choose colours &amp; positions — pricing is per colour, per position. Leave all off for unbranded.</div>
                      </>
                    )}

                    {addonDecos.length > 0 && (
                      <>
                        <label style={{ ...LB, marginTop: '16px' }}>Add-ons (optional)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {addonDecos.map((d) => {
                            const on = !!addonState?.[d.id]?.on;
                            return (
                              <button key={d.id} onClick={() => toggleDeco(d.id)} style={{ textAlign: 'left', border: on ? `2px solid ${GOLD}` : '1px solid #E0DDD7', background: on ? '#FDF8F0' : '#fff', borderRadius: '8px', padding: '9px 11px', cursor: 'pointer' }}>
                                <div style={{ fontSize: '12.5px', fontWeight: 700, color: NAVY }}>{on ? '☑ ' : '☐ '}{d.name}</div>
                                <div style={{ fontSize: '11px', color: BLACK }}>+{money(decoUnitPrice(d.per_unit))}/unit</div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}

                {step === 1 && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div><label style={LB}>Your name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={IN} /></div>
                      <div><label style={LB}>Company</label><input name="company" value={form.company} onChange={handleChange} placeholder="Company" style={IN} /></div>
                      <div><label style={LB}>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" style={IN} /></div>
                      <div><label style={LB}>Phone</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="04xx xxx xxx" style={{ ...IN, fontFamily: MONO }} /></div>
                    </div>
                    <div style={{ borderTop: '1px dashed #ECE8E1', margin: '16px 0 14px' }} />
                    <label style={LB}>Delivery address *</label>
                    <input name="street" value={form.street} onChange={handleChange} placeholder="Address line 1" style={{ ...IN, marginBottom: '8px' }} />
                    <input name="street2" value={form.street2} onChange={handleChange} placeholder="Address line 2 (optional)" style={{ ...IN, marginBottom: '8px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '8px' }}>
                      <input name="suburb" value={form.suburb} onChange={handleChange} placeholder="Suburb" style={IN} />
                      <select name="state" value={form.state} onChange={handleChange} style={SEL}><option value="">State</option>{STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                      <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="Postcode" style={{ ...IN, fontFamily: MONO }} />
                    </div>
                    <div style={{ marginTop: '9px', fontSize: '11px', color: BLACK }}>Delivering to more than one address? Please list them in Notes (next step).</div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <label style={LB}>Upload logo / artwork</label>
                    <div onClick={() => document.getElementById('qwArtwork').click()} style={{ border: `1.5px dashed ${GOLD}`, background: '#FDF8F0', borderRadius: '8px', padding: '18px', textAlign: 'center', cursor: 'pointer', marginBottom: '4px' }}>
                      <div style={{ fontSize: '20px' }}>🎨</div>
                      <div style={{ fontSize: '13px', color: BLACK }}>Click to upload (AI, PDF, PNG, JPG, EPS, SVG)</div>
                      <input id="qwArtwork" type="file" accept=".ai,.pdf,.png,.jpg,.jpeg,.eps,.svg" style={{ display: 'none' }} onChange={async (e) => {
                        const file = e.target.files[0]; if (!file) return;
                        setForm((p) => ({ ...p, artworkFileName: file.name, artworkUrl: '', artworkUploading: true }));
                        try { const url = (await uploadImage(file))?.logo_url; setForm((p) => ({ ...p, artworkUrl: url, artworkUploading: false })); }
                        catch { setForm((p) => ({ ...p, artworkUploading: false })); }
                      }} />
                    </div>
                    {form.artworkFileName && <div style={{ fontSize: '12px', color: form.artworkUploading ? BLACK : '#1B5E3A', marginBottom: '12px' }}>{form.artworkUploading ? '⏳ Uploading… ' : '✅ '}{form.artworkFileName}</div>}

                    <label style={{ ...LB, marginTop: '10px' }}>Required date (DD/MM/YYYY)</label>
                    <input name="requiredDate" type="date" value={form.requiredDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} style={{ ...IN, maxWidth: '200px', cursor: 'pointer' }} />
                    {form.requiredDate && <div style={{ fontSize: '12px', color: BLACK, fontWeight: 600, margin: '5px 0 0' }}>Selected: {form.requiredDate.split('-').reverse().join('/')}</div>}
                    <div style={{ height: '14px' }} />

                    <label style={LB}>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Anything else? If delivering to multiple addresses, please list them here." style={{ ...IN, resize: 'vertical', lineHeight: 1.6, fontFamily: DM }} />
                  </>
                )}

                {step === 3 && (
                  <>
                    <div style={{ background: '#FDF8F0', border: `1.5px solid ${GOLD}`, borderRadius: '11px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>{product.name}</div>
                      {[['Colour', wizColour || '—'], ['Quantity', formQty], ['Print method', brandingSummary], ['Customer', [form.name, form.company].filter(Boolean).join(' · ') || '—'], ['Delivery', [form.suburb, form.state].filter(Boolean).join(' ') || '—'], ['Est. total (ex GST)', showPrice ? money(subtotal) : 'By quote']].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F0EEED', fontSize: '13px' }}>
                          <span style={{ color: BLACK }}>{k}</span><span style={{ fontWeight: 700, color: NAVY }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', color: BLACK, marginTop: '10px' }}>We'll send your formal quote within 3 business hours. Freight for multiple addresses is confirmed on the quote.</div>
                    {status === 'error' && <div style={{ marginTop: '10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', color: '#B4413E' }}>Something went wrong. Please try again or call 02 9477 4748.</div>}
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '13px 20px', borderTop: '1px solid #ECE8E1', background: '#FAF8F4', position: 'sticky', bottom: 0 }}>
              <div>
                <div style={{ fontSize: '11px', color: BLACK, fontFamily: DM }}>Estimated total (ex GST)</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: NAVY, fontFamily: MONO, lineHeight: 1.1 }}>{showPrice ? money(subtotal) : 'By quote'}</div>
                <div style={{ fontSize: '10px', color: BLACK, fontFamily: DM }}>Final quote confirmed by us · + GST + freight</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {step > 0 && <button onClick={back} style={{ background: '#fff', border: '1.5px solid #E0DDD7', color: NAVY, borderRadius: '9px', padding: '11px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: DM }}>← Back</button>}
                <button onClick={next} disabled={stepBlocked || status === 'sending'} style={{ background: (stepBlocked || status === 'sending') ? '#D9CDB4' : GOLD, border: 'none', color: '#fff', borderRadius: '9px', padding: '11px 22px', fontSize: '13px', fontWeight: 700, cursor: (stepBlocked || status === 'sending') ? 'not-allowed' : 'pointer', fontFamily: DM }}>
                  {status === 'sending' ? '⏳ Sending…' : step === STEPS.length - 1 ? 'Request My Quote' : 'Next →'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const stBtn = { width: '26px', height: '26px', border: '1.5px solid #E0DDD7', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: NAVY, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 };
function Stepper({ label, val, onDec, onInc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: BLACK, fontFamily: DM }}>{label}</span>
      <button type="button" onClick={onDec} style={stBtn}>−</button>
      <span style={{ minWidth: '18px', textAlign: 'center', fontWeight: 700, color: NAVY, fontFamily: MONO }}>{val}</span>
      <button type="button" onClick={onInc} style={stBtn}>+</button>
    </div>
  );
}
