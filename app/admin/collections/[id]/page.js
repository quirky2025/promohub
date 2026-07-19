'use client';

// Admin → Collections → editor (D8). Rules AND across fields, OR inside a field.
// Live preview shows hit count + first 24; <4 hits warns "too thin to publish".

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { slugify } from '@/lib/slug';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const EMPTY_RULES = {
  category: [], subcategory: [], brand: [], supplier: [], colours: [],
  material_tags: [], decoration_model: [], print_methods: [],
  price_min: '', price_max: '', min_qty_max: '', is_eco: false,
};

export default function CollectionEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [col, setCol] = useState({ name: '', slug: '', ctype: 'scenario', status: 'draft', rules: EMPTY_RULES, pinned: [], excluded: [] });
  const [slugTouched, setSlugTouched] = useState(false);
  const [options, setOptions] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pinInfo, setPinInfo] = useState({});     // product_id -> {name, sku}
  const [searchQ, setSearchQ] = useState('');
  const [searchRes, setSearchRes] = useState([]);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const previewTimer = useRef(null);

  // ---- load ----
  useEffect(() => {
    (async () => {
      const oRes = await fetch('/api/admin/collections/options');
      const oData = await oRes.json().catch(() => ({}));
      if (oRes.ok) setOptions(oData);

      if (!isNew) {
        const res = await fetch('/api/admin/collections');
        const data = await res.json().catch(() => ({}));
        const found = (data.collections || []).find(c => c.id === id);
        if (!found) { alert('Collection not found'); router.push('/admin/collections'); return; }
        setCol({ ...found, rules: { ...EMPTY_RULES, ...(found.rules || {}) } });
        setSlugTouched(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function updRules(patch) { setCol(prev => ({ ...prev, rules: { ...prev.rules, ...patch } })); }

  // ---- live preview (debounced) ----
  const runPreview = useCallback(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/collections/preview', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rules: col.rules, pinned: col.pinned, excluded: col.excluded }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setPreview(data);
          const info = {};
          (data.sample || []).forEach(p => { info[p.id] = { name: p.name }; });
          setPinInfo(prev => ({ ...prev, ...info }));
        }
      } catch { /* keep last preview */ }
    }, 500);
  }, [col.rules, col.pinned, col.excluded]);

  useEffect(() => { runPreview(); }, [runPreview]);

  // ---- product search for pin / exclude ----
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!searchQ.trim()) { setSearchRes([]); return; }
      try {
        const res = await fetch(`/api/admin/products?search=${encodeURIComponent(searchQ)}&pageSize=10`);
        const data = await res.json().catch(() => ({}));
        const list = Array.isArray(data.products) ? data.products : [];
        setSearchRes(list.map(p => ({ id: p.id, name: p.name, sku: p.supplier_sku })));
        const info = {};
        list.forEach(p => { info[p.id] = { name: p.name, sku: p.supplier_sku }; });
        setPinInfo(prev => ({ ...prev, ...info }));
      } catch { setSearchRes([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  // ---- actions ----
  async function save({ silent } = {}) {
    if (!col.name.trim()) { alert('Name required'); return null; }
    setBusy('save');
    const res = await fetch('/api/admin/collections', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...col, slug: col.slug || slugify(col.name) }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy('');
    if (!res.ok) { alert(`Save failed: ${data?.error || res.status}`); return null; }
    setCol(prev => ({ ...prev, ...data.collection, rules: { ...EMPTY_RULES, ...(data.collection.rules || {}) } }));
    if (isNew) { router.replace(`/admin/collections/${data.collection.id}`); }
    if (!silent) { setNotice('Saved.'); setTimeout(() => setNotice(''), 3000); }
    return data.collection;
  }

  async function publishAction(action) {
    const saved = await save({ silent: true });
    if (!saved) return;
    setBusy(action);
    const res = await fetch('/api/admin/collections/publish', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: saved.id, action }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy('');
    if (!res.ok) { alert(`${action} failed: ${data?.error || res.status}`); return; }
    setCol(prev => ({ ...prev, status: data.status }));
    setNotice(action === 'publish'
      ? `Published (${data.count} products). Live at /${saved.slug} within ~5 minutes — edit copy in Content.`
      : action === 'refresh' ? `Membership refreshed (${data.count} products).` : 'Unpublished.');
    setTimeout(() => setNotice(''), 6000);
  }

  async function remove() {
    if (!confirm('Delete this collection? Its landing page is removed too.')) return;
    const res = await fetch(`/api/admin/collections?id=${col.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin/collections');
    else alert('Delete failed');
  }

  // ---- ui bits ----
  const label = { fontSize: 11, fontWeight: 700, color: NAVY, display: 'block', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' };
  const input = { padding: '9px 12px', border: '1.5px solid #E0DDD7', borderRadius: 8, fontSize: 13.5, color: '#000', outline: 'none', boxSizing: 'border-box', fontFamily: '"DM Sans", sans-serif', background: '#fff' };
  const card = { background: '#fff', border: '1px solid #E0DDD7', borderRadius: 12, padding: 16, marginBottom: 14 };
  const chip = { display: 'inline-flex', alignItems: 'center', gap: 6, background: NAVY, color: '#fff', fontSize: 12, padding: '3px 10px', borderRadius: 12, marginRight: 6, marginBottom: 6 };
  const chipX = { cursor: 'pointer', fontWeight: 700 };

  function MultiPick({ field, title, values, disabled }) {
    const selected = col.rules[field] || [];
    return (
      <div style={{ marginBottom: 12 }}>
        <label style={label}>{title}</label>
        <div>
          {selected.map(v => (
            <span key={v} style={chip}>{v}<span style={chipX} onClick={() => updRules({ [field]: selected.filter(x => x !== v) })}>✕</span></span>
          ))}
        </div>
        <select value="" disabled={disabled} style={{ ...input, width: 260 }}
          onChange={e => { const v = e.target.value; if (v && !selected.includes(v)) updRules({ [field]: [...selected, v] }); }}>
          <option value="">+ Add {title.toLowerCase()}…</option>
          {(values || []).filter(v => !selected.includes(v)).map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
    );
  }

  const subcatOptions = (col.rules.category?.length
    ? col.rules.category.flatMap(c => options?.subcategories?.[c] || [])
    : Object.values(options?.subcategories || {}).flat()
  ).filter((v, i, a) => a.indexOf(v) === i).sort();

  const pName = (pid) => pinInfo[pid]?.name || `…${String(pid).slice(-6)}`;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: '#000', background: '#fff', minHeight: '100vh' }}>
      {/* top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: NAVY, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/admin/collections" style={{ color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontSize: 13 }}>← Collections</Link>
        <div style={{ color: '#fff', fontWeight: 700 }}>{col.name || 'New collection'}</div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: col.status === 'published' ? '#D1FAE5' : '#FEF3C7', color: col.status === 'published' ? '#065F46' : '#92400E' }}>{col.status}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {notice && <span style={{ color: '#A7F3D0', fontSize: 12, fontWeight: 700 }}>{notice}</span>}
          {!isNew && <button onClick={remove} style={{ background: 'none', border: '1px solid rgba(255,255,255,.4)', color: '#FCA5A5', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Delete</button>}
          {col.status === 'published' && (
            <>
              <button onClick={() => publishAction('refresh')} disabled={!!busy} style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.35)', borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
                {busy === 'refresh' ? 'Refreshing…' : 'Refresh members'}
              </button>
              <button onClick={() => publishAction('unpublish')} disabled={!!busy} style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.35)', borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
                Unpublish
              </button>
            </>
          )}
          <button onClick={() => save()} disabled={!!busy} style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.35)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {busy === 'save' ? 'Saving…' : 'Save'}
          </button>
          <button onClick={() => publishAction('publish')} disabled={!!busy || preview?.thin}
            title={preview?.thin ? 'Fewer than 4 products match — collection too thin to publish' : ''}
            style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: preview?.thin ? 'not-allowed' : 'pointer', opacity: preview?.thin ? 0.6 : 1 }}>
            {busy === 'publish' ? 'Publishing…' : col.status === 'published' ? 'Republish' : 'Publish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 18, padding: '18px 24px 60px', flexWrap: 'wrap' }}>
        {/* LEFT: settings + rules + pin/exclude */}
        <div style={{ flex: '1 1 460px', minWidth: 380, maxWidth: 640 }}>
          <div style={card}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={label}>Name</label>
                <input value={col.name} style={{ ...input, width: '100%' }}
                  onChange={e => {
                    const name = e.target.value;
                    setCol(prev => ({ ...prev, name, slug: (!slugTouched && prev.status !== 'published') ? slugify(name) : prev.slug }));
                  }} />
              </div>
              <div>
                <label style={label}>Type</label>
                <select value={col.ctype} onChange={e => setCol(prev => ({ ...prev, ctype: e.target.value }))} style={{ ...input, width: '100%' }}>
                  {['scenario', 'colour', 'industry', 'attribute', 'brand'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <label style={label}>URL slug {col.status === 'published' && <span style={{ color: '#000', fontWeight: 400, textTransform: 'none' }}>(locked after publish)</span>}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13 }}>/</span>
              <input value={col.slug} disabled={col.status === 'published'}
                onChange={e => { setSlugTouched(true); setCol(prev => ({ ...prev, slug: slugify(e.target.value) })); }}
                style={{ ...input, flex: 1, fontFamily: 'monospace', background: col.status === 'published' ? '#F5F4F2' : '#fff' }} />
            </div>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, color: NAVY, marginBottom: 10 }}>Rules <span style={{ fontWeight: 400, fontSize: 12 }}>(a product must match EVERY rule; inside one rule, any value counts)</span></div>
            {!options ? <div>Loading options…</div> : (
              <>
                <MultiPick field="category" title="Category" values={options.categories} />
                <MultiPick field="subcategory" title="Subcategory" values={subcatOptions} />
                <MultiPick field="colours" title="Colours" values={options.colours} />
                <MultiPick field="material_tags" title="Materials" values={options.material_tags} />
                <MultiPick field="brand" title="Brand" values={options.brands} />
                <MultiPick field="supplier" title="Supplier" values={options.suppliers} />
                <MultiPick field="print_methods" title="Print methods" values={options.print_methods} />
                <MultiPick field="decoration_model" title="Decoration model" values={options.decoration_models} />
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 4 }}>
                  <div>
                    <label style={label}>Price from $</label>
                    <input type="number" min="0" step="0.1" value={col.rules.price_min} onChange={e => updRules({ price_min: e.target.value })} style={{ ...input, width: 100 }} />
                  </div>
                  <div>
                    <label style={label}>to $</label>
                    <input type="number" min="0" step="0.1" value={col.rules.price_max} onChange={e => updRules({ price_max: e.target.value })} style={{ ...input, width: 100 }} />
                  </div>
                  <div>
                    <label style={label}>Min qty ≤</label>
                    <input type="number" min="0" value={col.rules.min_qty_max} onChange={e => updRules({ min_qty_max: e.target.value })} style={{ ...input, width: 100 }} />
                  </div>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 600, color: NAVY, paddingBottom: 9, cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!col.rules.is_eco} onChange={e => updRules({ is_eco: e.target.checked })} /> 🌿 Eco only
                  </label>
                </div>
                <div style={{ fontSize: 11, color: '#000', marginTop: 8 }}>Price = the &quot;As low as&quot; card price (ex-GST, cheapest tier).</div>
              </>
            )}
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8 }}>Pin / Exclude</div>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search a product by name or SKU…" style={{ ...input, width: '100%' }} />
            {searchRes.length > 0 && (
              <div style={{ border: '1px solid #E0DDD7', borderRadius: 8, marginTop: 6 }}>
                {searchRes.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderBottom: '1px solid #F0EEED', fontSize: 13 }}>
                    <span style={{ flex: 1 }}>{p.name} <span style={{ color: '#000', fontFamily: 'monospace', fontSize: 11 }}>{p.sku || ''}</span></span>
                    <button style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => { if (!col.pinned.includes(p.id)) setCol(prev => ({ ...prev, pinned: [...prev.pinned, p.id], excluded: prev.excluded.filter(x => x !== p.id) })); }}>
                      📌 Pin
                    </button>
                    <button style={{ background: '#fff', color: '#991B1B', border: '1px solid #E0C9C9', borderRadius: 6, padding: '4px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => { if (!col.excluded.includes(p.id)) setCol(prev => ({ ...prev, excluded: [...prev.excluded, p.id], pinned: prev.pinned.filter(x => x !== p.id) })); }}>
                      🚫 Exclude
                    </button>
                  </div>
                ))}
              </div>
            )}

            {col.pinned.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <label style={label}>Pinned (shown first, in this order)</label>
                {col.pinned.map((pid, i) => (
                  <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13 }}>
                    <span style={{ color: GOLD, fontWeight: 700 }}>{i + 1}.</span>
                    <span style={{ flex: 1 }}>{pName(pid)}</span>
                    <button style={{ ...input, padding: '2px 8px', cursor: 'pointer' }} onClick={() => { const p = [...col.pinned]; if (i > 0) { [p[i - 1], p[i]] = [p[i], p[i - 1]]; setCol(prev => ({ ...prev, pinned: p })); } }}>↑</button>
                    <button style={{ ...input, padding: '2px 8px', cursor: 'pointer' }} onClick={() => { const p = [...col.pinned]; if (i < p.length - 1) { [p[i + 1], p[i]] = [p[i], p[i + 1]]; setCol(prev => ({ ...prev, pinned: p })); } }}>↓</button>
                    <button style={{ ...input, padding: '2px 8px', cursor: 'pointer', color: '#991B1B' }} onClick={() => setCol(prev => ({ ...prev, pinned: prev.pinned.filter(x => x !== pid) }))}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {col.excluded.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <label style={label}>Excluded (never shown)</label>
                {col.excluded.map(pid => (
                  <span key={pid} style={{ ...chip, background: '#7F1D1D' }}>{pName(pid)}<span style={chipX} onClick={() => setCol(prev => ({ ...prev, excluded: prev.excluded.filter(x => x !== pid) }))}>✕</span></span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: live preview */}
        <div style={{ flex: '1 1 380px', minWidth: 340 }}>
          <div style={{ ...card, position: 'sticky', top: 72 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
              <div style={{ fontWeight: 700, color: NAVY }}>Live preview</div>
              <div style={{ fontSize: 13 }}>{preview ? `${preview.count} products match` : '…'}</div>
            </div>
            {preview?.thin && (
              <div style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 8, padding: '8px 12px', fontSize: 12.5, fontWeight: 600, marginBottom: 10 }}>
                ⚠ Fewer than 4 products — too thin to publish. Loosen the rules.
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
              {(preview?.sample || []).map(p => (
                <div key={p.id} style={{ border: '1px solid #E0DDD7', borderRadius: 8, overflow: 'hidden', fontSize: 10.5 }}>
                  <div style={{ height: 72, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image ? <img src={p.image} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} /> : <span>📦</span>}
                  </div>
                  <div style={{ padding: '5px 7px', borderTop: '1px solid #F0EEED' }}>
                    <div style={{ fontWeight: 600, color: NAVY, lineHeight: 1.25, maxHeight: 26, overflow: 'hidden' }}>{p.name}</div>
                    {p.price > 0 && <div style={{ color: GOLD }}>${p.price.toFixed(2)}</div>}
                  </div>
                </div>
              ))}
            </div>
            {preview && preview.count > 24 && <div style={{ fontSize: 11, color: '#000', marginTop: 8 }}>Showing first 24 of {preview.count}.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
