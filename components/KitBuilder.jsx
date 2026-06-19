'use client';
// Kit Builder — 6-step configurator (PROMO_KITS.md §4b). Client island.
// Rule-based V1: assembles the scene template, applies a colour theme + fallback note,
// estimates budget, and produces a pre-filled quote request. Live per-product / stock
// resolution comes later (needs product DB + colourFamiliesOf) — see PROMO_KITS.md.
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SCENES, PALETTE, QUANTITIES, TIMINGS, SLOT_LABEL, FALLBACK_MAP, KIT_DISCLAIMER, COLOUR_UI_COPY } from '@/lib/kits';

const NAVY = '#1B2A4A', GOLD = '#C9A96E', CREAM = '#F8F7F4', LINE = '#E0DDD7', MUTED = '#7A7570';
const serif = '"Cormorant Garamond", serif';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function KitBuilder() {
  const sp = useSearchParams();
  const [sceneSlug, setSceneSlug] = useState(SCENES[0].slug);
  const [colour, setColour] = useState('navy');
  const [qty, setQty] = useState(100);
  const [budget, setBudget] = useState('balanced');
  const [addons, setAddons] = useState([]);
  const [timing, setTiming] = useState(TIMINGS[0]);

  // Pre-select scene from ?scene= (deep link from homepage / scene pages).
  useEffect(() => {
    const s = sp?.get('scene');
    if (s && SCENES.some((x) => x.slug === s)) { setSceneSlug(s); setAddons([]); }
  }, [sp]);

  const scene = SCENES.find((s) => s.slug === sceneSlug) || SCENES[0];
  const toggleAddon = (k) => setAddons((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));

  const [lo, hi] = scene.budget;
  const totalLo = lo * qty, totalHi = hi * qty;
  const fallback = FALLBACK_MAP[colour] || [];
  const colourLabel = PALETTE.find((p) => p.key === colour)?.label || cap(colour);
  const items = [...scene.must, ...scene.optional.filter((k) => addons.includes(k))];

  const quoteHref = `/contact?kit=${scene.slug}&colour=${colour}&qty=${qty}&budget=${budget}`;

  const card = { background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, padding: '20px 22px', marginBottom: 18 };
  const stepLabel = { color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 13 };
  const chip = (active) => ({
    border: `1.5px solid ${active ? NAVY : LINE}`, background: active ? NAVY : '#fff', color: active ? '#fff' : '#3a3f45',
    padding: '9px 15px', borderRadius: 999, fontSize: 14, cursor: 'pointer', fontWeight: active ? 700 : 500,
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,360px)', gap: 26, alignItems: 'start' }}>
      {/* Steps */}
      <div>
        {/* 1. Scene */}
        <div style={card}>
          <div style={stepLabel}>Step 1 · Choose a scene</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {SCENES.map((s) => (
              <button key={s.slug} type="button" onClick={() => { setSceneSlug(s.slug); setAddons([]); }} style={chip(s.slug === sceneSlug)}>{s.emoji} {s.name.replace(' Kit', '')}</button>
            ))}
          </div>
        </div>

        {/* 2. Colour */}
        <div style={card}>
          <div style={stepLabel}>Step 2 · Choose your kit colour</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {PALETTE.map((p) => (
              <button key={p.key} type="button" onClick={() => setColour(p.key)} aria-pressed={colour === p.key}
                style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1.5px solid ${colour === p.key ? NAVY : LINE}`, background: '#fff', padding: '7px 13px 7px 8px', borderRadius: 999, cursor: 'pointer', fontWeight: colour === p.key ? 700 : 500, fontSize: 14, color: '#3a3f45' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: p.swatch, border: '1px solid rgba(0,0,0,.15)', display: 'inline-block' }} />
                {p.label}
              </button>
            ))}
          </div>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.55, marginTop: 13, marginBottom: 0 }}>{COLOUR_UI_COPY}</p>
        </div>

        {/* 3. Quantity */}
        <div style={card}>
          <div style={stepLabel}>Step 3 · Choose quantity</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {QUANTITIES.map((q) => (
              <button key={q} type="button" onClick={() => setQty(q)} style={chip(q === qty)}>{q} kits</button>
            ))}
          </div>
        </div>

        {/* 4. Budget */}
        <div style={card}>
          <div style={stepLabel}>Step 4 · Choose budget</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {[['lean', 'Lean'], ['balanced', 'Balanced'], ['premium', 'Premium']].map(([k, label]) => (
              <button key={k} type="button" onClick={() => setBudget(k)} style={chip(k === budget)}>{label}</button>
            ))}
          </div>
          <p style={{ color: MUTED, fontSize: 13, marginTop: 11, marginBottom: 0 }}>Guides product selection within the typical ${lo}–${hi} per-person range for this kit.</p>
        </div>

        {/* 5. Must-have add-ons */}
        <div style={card}>
          <div style={stepLabel}>Step 5 · Choose products</div>
          <div style={{ fontSize: 13.5, color: '#3a3f45', marginBottom: 10 }}>Always included: <strong>{scene.must.map((k) => SLOT_LABEL[k]).join(' · ')}</strong></div>
          <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 9 }}>Add popular extras:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {scene.optional.map((k) => (
              <button key={k} type="button" onClick={() => toggleAddon(k)} style={chip(addons.includes(k))}>{addons.includes(k) ? '✓ ' : '+ '}{SLOT_LABEL[k]}</button>
            ))}
          </div>
        </div>

        {/* 6. Timing */}
        <div style={card}>
          <div style={stepLabel}>Step 6 · Choose timing</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {TIMINGS.map((t) => (
              <button key={t} type="button" onClick={() => setTiming(t)} style={chip(t === timing)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Live summary */}
      <aside style={{ position: 'sticky', top: 18, background: CREAM, border: `1px solid ${LINE}`, borderRadius: 14, padding: '22px 22px 20px' }}>
        <div style={{ fontFamily: serif, fontSize: 24, color: NAVY, fontWeight: 600 }}>{scene.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 13.5, color: '#3a3f45' }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: PALETTE.find((p) => p.key === colour)?.swatch, border: '1px solid rgba(0,0,0,.15)' }} />
          {colourLabel} theme
        </div>
        {colour !== 'mixed' && fallback.length > 0 && (
          <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Closest match if unavailable: {cap(fallback[0])}</div>
        )}

        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
          {items.map((k) => (
            <li key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: 14, color: '#3a3f45' }}>
              <span>{SLOT_LABEL[k]}</span>
              <span style={{ color: scene.must.includes(k) ? GOLD : MUTED, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{scene.must.includes(k) ? 'Core' : 'Add-on'}</span>
            </li>
          ))}
        </ul>

        <div style={{ fontSize: 10.5, color: GOLD, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Indicative estimate</div>
        <div style={{ fontSize: 13, color: MUTED }}>{qty} kits · {timing}</div>
        <div style={{ fontFamily: serif, fontSize: 27, color: NAVY, fontWeight: 600, marginTop: 6 }}>
          ${totalLo.toLocaleString()}–${totalHi.toLocaleString()}
          <span style={{ fontSize: 13, color: MUTED, fontFamily: 'inherit', fontWeight: 400 }}> est. · ex GST</span>
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>≈ ${lo}–${hi} per person</div>

        <a href={quoteHref} style={{ display: 'block', textAlign: 'center', background: GOLD, color: NAVY, fontWeight: 700, padding: '13px 0', borderRadius: 8, textDecoration: 'none', marginTop: 16, fontSize: 15 }}>Request a quote for this kit →</a>
        <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.55, marginTop: 12, marginBottom: 0 }}>{KIT_DISCLAIMER}</p>
      </aside>
    </div>
  );
}
