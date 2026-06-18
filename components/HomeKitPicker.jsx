'use client';

// Homepage "Build a promo kit" module — scene cards pre-fill a recommended kit.
// Conversion tool (noindex behaviour lives on /kit-picker). Client island.
import { useState } from 'react';

const NAVY = '#1B2A4A', GOLD = '#C9A96E', GOLD_DK = '#B2925A', CREAM = '#F8F7F4', LINE = '#E0DDD7', MUTED = '#7A7570';

const SCENES = [
  { k: 'new-starter', n: 'New Starter', emoji: '👋', occ: 'New employee onboarding', pp: '$15 – $35',
    prods: [['Drink Bottle', '🧴'], ['Notebook', '📓'], ['Pen', '🖊️'], ['Tote Bag', '👜']],
    musts: ['Tote Bag', 'Drink Bottle', 'Pen', 'Notebook'] },
  { k: 'trade-show-giveaway', n: 'Trade Show & Event', emoji: '🎪', occ: 'Trade show & event giveaway', pp: '$3 – $10',
    prods: [['Pen', '🖊️'], ['Tote Bag', '👜'], ['Lanyard', '🪪'], ['Sticker', '🏷️']],
    musts: ['Pen', 'Tote / Drawstring', 'Lanyard'] },
  { k: 'conference', n: 'Conference', emoji: '🎤', occ: 'Conference delegate pack', pp: '$12 – $30',
    prods: [['Drawstring Bag', '🎒'], ['Notebook', '📓'], ['Pen', '🖊️'], ['Lanyard', '🪪'], ['Drink Bottle', '🧴']],
    musts: ['Tote / Drawstring', 'Notebook', 'Pen', 'Lanyard'] },
  { k: 'client-thank-you', n: 'Client Thank You', emoji: '🤝', occ: 'Client thank you gift', pp: '$20 – $45',
    prods: [['Drink Bottle', '🧴'], ['Notebook', '📓'], ['Pen', '🖊️'], ['Gift Box', '🎁']],
    musts: ['Drinkware', 'Notebook', 'Pen'] },
  { k: 'real-estate-handover', n: 'Real Estate Handover', emoji: '🏠', occ: 'Real estate handover / settlement', pp: '$20 – $50',
    prods: [['Drinkware', '☕'], ['Keyring', '🔑'], ['Gift Box / Card', '🎁'], ['Cooler / Picnic', '🧺']],
    musts: ['Drinkware', 'Keyring', 'Gift box / card'] },
  { k: 'outdoor-team-day', n: 'Outdoor Team Day', emoji: '⛺', occ: 'Outdoor team day', pp: '$15 – $40',
    prods: [['Cooler Bag', '🧊'], ['Drink Bottle', '🧴'], ['Cap', '🧢'], ['Towel', '🏖️']],
    musts: ['Cooler bag', 'Bottle', 'Cap'] },
  { k: 'eofy-christmas', n: 'EOFY & Christmas', emoji: '🎁', occ: 'EOFY & Christmas gift', pp: '$20 – $60',
    prods: [['Drinkware', '☕'], ['Notebook', '📓'], ['Gift Box', '🎁'], ['Apparel', '👕']],
    musts: ['Drinkware', 'Notebook or Gift box'] },
  { k: 'school-club', n: 'School & Club', emoji: '🏫', occ: 'School & club', pp: '$10 – $25',
    prods: [['Drawstring Bag', '🎒'], ['Drink Bottle', '🧴'], ['Cap', '🧢'], ['Pen', '🖊️']],
    musts: ['Drawstring bag', 'Bottle', 'Cap'] },
];

const sel = { width: '100%', height: 38, border: `1.5px solid ${LINE}`, borderRadius: 9, padding: '0 11px', fontFamily: 'inherit', fontSize: 14, background: '#fff', color: NAVY };
const chip = (on) => ({ background: on ? NAVY : '#fff', color: on ? '#fff' : NAVY, border: `1.5px solid ${on ? NAVY : LINE}`, fontSize: 12.5, fontWeight: 600, padding: '5px 11px', borderRadius: 999 });

export default function HomeKitPicker() {
  const [idx, setIdx] = useState(0);
  const sc = SCENES[idx];
  const nums = sc.pp.replace(/[^0-9]/g, ' ').trim().split(/\s+/).map(Number);
  const total = '$' + (nums[0] * 50).toLocaleString() + ' – $' + (nums[1] * 100).toLocaleString();

  return (
    <div>
      {/* scene cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, margin: '24px 0' }}>
        {SCENES.map((s, i) => {
          const on = i === idx;
          return (
            <button key={s.k} onClick={() => setIdx(i)} style={{ textAlign: 'left', cursor: 'pointer', border: `1.5px solid ${on ? NAVY : LINE}`, background: on ? NAVY : '#fff', borderRadius: 13, padding: 15, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 22 }}>{s.emoji}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: on ? '#fff' : NAVY, lineHeight: 1.25 }}>{s.n} Kit</span>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: on ? 'rgba(255,255,255,.55)' : MUTED }}>/promo-kits/{s.k}</span>
            </button>
          );
        })}
      </div>

      {/* form + recommended */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', border: `1px solid ${LINE}`, borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ background: CREAM, padding: 22, borderRight: `1px solid ${LINE}` }}>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, color: NAVY, fontWeight: 700, margin: 0 }}>{sc.n} Kit</h3>
          <p style={{ fontSize: 13, color: MUTED, margin: '3px 0 14px' }}>Tell us the basics — we suggest a practical branded set.</p>
          {[['Occasion', [sc.occ]], ['Quantity', ['25', '50 – 100', '100', '250', '500+']], ['Budget / person', ['Under $5', '$5 – $10', '$10 – $25', '$25+']], ['Timing', ['Local stock (fast)', 'Standard (7–14 days)', 'Flexible']]].map(([lab, opts]) => (
            <div key={lab} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 4 }}>{lab}</label>
              <select style={sel} defaultValue={opts[1] || opts[0]}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 4 }}>Must-have products</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sc.musts.map((m) => <span key={m} style={chip(true)}>{m}</span>)}
              <span style={{ ...chip(false), borderStyle: 'dashed' }}>+ Add</span>
            </div>
          </div>
          <a href={`/kit-picker?scene=${sc.k}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 12, background: GOLD, color: NAVY, fontWeight: 600, fontSize: 14.5, padding: '11px 20px', borderRadius: 8, textDecoration: 'none' }}>Build my kit →</a>
        </div>

        <div style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
            <div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, color: NAVY, fontWeight: 700, margin: 0 }}>Recommended kit</h3>
              <div style={{ fontSize: 12.5, color: '#2D6A4F', fontWeight: 600, marginTop: 2 }}>✓ Based on {sc.n}</div>
            </div>
            <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 11.5, color: MUTED }}>Product estimate only</div>
              <div style={{ fontSize: 20, color: NAVY, fontWeight: 600 }}>{sc.pp}</div>
              <div style={{ fontSize: 11.5, color: MUTED }}>per person · ex GST</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sc.prods.length}, 1fr)`, gap: 10 }}>
            {sc.prods.map((p, i) => (
              <div key={i} style={{ border: `1px solid ${LINE}`, borderRadius: 11, padding: 10, textAlign: 'center' }}>
                <div style={{ height: 70, borderRadius: 8, background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 7 }}>{p[1]}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: NAVY, lineHeight: 1.25, minHeight: 28 }}>{p[0]}</div>
                <div style={{ fontSize: 10.5, color: GOLD_DK, fontWeight: 600, marginTop: 3 }}>View product</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', background: CREAM, borderRadius: 11, padding: '12px 15px', marginTop: 13 }}>
            <div style={{ fontSize: 12.5, color: NAVY }}><b style={{ display: 'block' }}>{sc.prods.length} products</b><small style={{ color: MUTED }}>in your kit</small></div>
            <div style={{ fontSize: 12.5, color: NAVY }}><b style={{ display: 'block' }}>50–100 qty</b><small style={{ color: MUTED }}>selected</small></div>
            <div style={{ fontSize: 12.5, color: NAVY }}><b style={{ display: 'block' }}>{total}</b><small style={{ color: MUTED }}>total estimate (ex GST)</small></div>
            <a href="/contact" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 15px', border: `1.5px solid ${GOLD}`, color: GOLD_DK, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>Request a quote</a>
          </div>
          <p style={{ fontSize: 11, color: MUTED, marginTop: 10, lineHeight: 1.5 }}>Product estimate only · ex GST · branding, setup and freight quoted separately · final price confirmed after artwork and stock check.</p>
        </div>
      </div>
    </div>
  );
}
