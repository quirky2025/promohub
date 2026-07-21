'use client';

// Admin → Content: list of url_pages-driven pages.
// IA·B upgrade: category filter + tree view + content-health dots + duplicate-name alert.
// All text black #000 (no grey), navy headers, gold actions.

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const TYPE_LABEL = {
  product_category: 'Category',
  product_subcategory: 'Subcategory',
  collection: 'Collection',
  landing: 'Landing',
};
// Type 彩色徽章(IA·B4)
const TYPE_BADGE = {
  product_category: { bg: NAVY, fg: '#fff' },
  product_subcategory: { bg: '#E6EDF7', fg: NAVY },
  collection: { bg: '#F5EBDB', fg: '#7A5A1E' },
  landing: { bg: '#E8F5EE', fg: '#166534' },
};
const CTYPE_LABEL = { colour: '颜色', material: '材质', scenario: '场景', industry: '行业', brand: '品牌', attribute: '属性' };

const HEALTH_KEYS = [['title', 'T'], ['meta', 'M'], ['intro', 'I'], ['guide', 'G'], ['faq', 'F']];
const HEALTH_TITLE = { title: 'Title', meta: 'Meta description', intro: 'Intro', guide: 'Buying guide', faq: 'FAQ' };

function HealthDots({ health }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {HEALTH_KEYS.map(([k, letter]) => {
        const ok = !!health?.[k];
        return (
          <span key={k} title={`${HEALTH_TITLE[k]}: ${ok ? '✓' : '缺'}`}
            style={{
              width: 16, height: 16, borderRadius: '50%', fontSize: 9, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: ok ? '#166534' : '#fff', color: ok ? '#fff' : '#B91C1C',
              border: ok ? '1px solid #166534' : '1.5px solid #B91C1C', boxSizing: 'border-box',
            }}>{letter}</span>
        );
      })}
    </span>
  );
}

export default function ContentListPage() {
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [view, setView] = useState('list'); // list | tree
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (!res.ok) { alert(`Failed to load pages: ${data?.error || res.status}`); setPages([]); }
      else setPages(data.pages || []);
    } catch (e) {
      alert(`Failed to load pages: ${e.message}`);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  // 品类下拉选项(来自数据)
  const catOptions = useMemo(() => {
    const s = new Set();
    pages.forEach(p => (p.categories || (p.category ? [p.category] : [])).forEach(c => s.add(c)));
    return [...s].sort();
  }, [pages]);

  // 重名报警(IA·B4:今日 Plastic 撞车的教训)——展示名相同的多条目标红
  const dupNames = useMemo(() => {
    const count = {};
    pages.forEach(p => {
      const name = (p.nav_label || p.h1 || '').trim().toLowerCase();
      if (name) count[name] = (count[name] || 0) + 1;
    });
    return new Set(Object.keys(count).filter(n => count[n] > 1));
  }, [pages]);

  const filtered = useMemo(() => {
    if (!cat) return pages;
    return pages.filter(p => (p.categories || []).includes(cat) || p.category === cat);
  }, [pages, cat]);

  // 树状分组:品类 → [类目页, 子类页, 颜色/材质集合, 场景/其他集合, landing]
  const tree = useMemo(() => {
    const groups = {};
    const misc = [];
    filtered.forEach(p => {
      const c = p.category || (p.categories || [])[0];
      if (c) { (groups[c] = groups[c] || []).push(p); } else misc.push(p);
    });
    const rank = (p) => {
      if (p.page_type === 'product_category') return 0;
      if (p.page_type === 'product_subcategory') return 1;
      if (p.page_type === 'collection') {
        if (p.ctype === 'colour' || p.ctype === 'material') return 2;
        return 3;
      }
      return 4;
    };
    Object.values(groups).forEach(list => list.sort((a, b) => rank(a) - rank(b) || (a.slug || '').localeCompare(b.slug || '')));
    return { groups, misc };
  }, [filtered]);

  const nameOf = (p) => p.nav_label || p.h1 || p.slug;
  const isDup = (p) => dupNames.has((p.nav_label || p.h1 || '').trim().toLowerCase());

  function Row({ p, indent = 0 }) {
    const badge = TYPE_BADGE[p.page_type] || { bg: '#F0EEED', fg: '#000' };
    return (
      <tr key={p.slug} style={{ borderBottom: '1px solid #F0EEED' }}>
        <td style={{ padding: '10px 14px', paddingLeft: 14 + indent * 22 }}>
          <div style={{ fontWeight: 600, color: NAVY, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {indent > 0 && <span style={{ color: '#000' }}>└</span>}
            {nameOf(p)}
            {isDup(p) && (
              <span style={{ fontSize: 10, fontWeight: 700, background: '#B91C1C', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>重名!</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#000', fontFamily: 'monospace' }}>/{p.slug}</div>
        </td>
        <td style={{ padding: '10px 14px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: badge.bg, color: badge.fg }}>
            {TYPE_LABEL[p.page_type] || p.page_type || '—'}
          </span>
          {p.ctype && <span style={{ fontSize: 11, color: '#000', marginLeft: 6 }}>{CTYPE_LABEL[p.ctype] || p.ctype}</span>}
        </td>
        <td style={{ padding: '10px 14px', color: '#000', fontSize: 12 }}>{(p.categories || []).join(', ') || p.category || '—'}</td>
        <td style={{ padding: '10px 14px' }}><HealthDots health={p.health} /></td>
        <td style={{ padding: '10px 14px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: p.status === 'live' ? '#F0FAF4' : '#FEF3C7', color: p.status === 'live' ? '#166534' : '#92400E' }}>
            {p.status || '—'}{p.noindex ? ' · noindex' : ''}
          </span>
          {p.has_draft && <span style={{ fontSize: 10, fontWeight: 700, color: '#92400E', background: '#FEF3C7', padding: '2px 8px', borderRadius: 10, marginLeft: 6 }}>DRAFT</span>}
        </td>
        <td style={{ padding: '10px 14px', color: '#000', fontSize: 12 }}>{p.updated_at ? new Date(p.updated_at).toLocaleDateString('en-AU') : '—'}</td>
        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
          <Link href={`/admin/content/${p.slug}`}
            style={{ background: GOLD, color: '#fff', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            Edit
          </Link>
        </td>
      </tr>
    );
  }

  const TableShell = ({ children }) => (
    <div style={{ border: '1px solid #E0DDD7', borderRadius: 12, overflow: 'hidden', marginBottom: 18 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Page', 'Type', 'Categories', 'Health', 'Status', 'Updated', ''].map(h => (
              <th key={h} style={{ background: NAVY, color: '#fff', textAlign: 'left', padding: '11px 14px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '24px 28px', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: NAVY, margin: '0 0 4px' }}>Content</h1>
      <p style={{ fontSize: 13, color: '#000', margin: '0 0 16px' }}>
        Edit page copy yourself — intro, buying guide, FAQs, title &amp; meta. Health dots: T=Title M=Meta I=Intro G=Guide F=FAQ(红圈=缺).
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by slug or title…"
          style={{ flex: 1, minWidth: 240, maxWidth: 420, padding: '10px 14px', border: '1.5px solid #E0DDD7', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        />
        <select value={cat} onChange={e => setCat(e.target.value)}
          style={{ padding: '10px 14px', border: '1.5px solid #E0DDD7', borderRadius: 8, fontSize: 13.5, color: '#000', background: '#fff' }}>
          <option value="">All categories</option>
          {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['list', 'List'], ['tree', 'Tree']].map(([id, lb]) => (
            <button key={id} onClick={() => setView(id)}
              style={{ background: view === id ? NAVY : '#fff', color: view === id ? '#fff' : NAVY, border: `1px solid ${view === id ? NAVY : '#E0DDD7'}`, borderRadius: 18, padding: '7px 18px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
              {lb}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div style={{ padding: 40, color: '#000' }}>Loading…</div> : view === 'list' ? (
        <>
          <TableShell>{filtered.map(p => <Row key={p.slug} p={p} />)}</TableShell>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#000' }}>No pages found</div>}
        </>
      ) : (
        <>
          {Object.keys(tree.groups).sort().map(c => (
            <div key={c}>
              <div style={{ fontWeight: 700, color: NAVY, fontSize: 15, margin: '14px 0 8px' }}>{c}</div>
              <TableShell>
                {tree.groups[c].map(p => <Row key={p.slug} p={p} indent={p.page_type === 'product_category' ? 0 : 1} />)}
              </TableShell>
            </div>
          ))}
          {tree.misc.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, color: NAVY, fontSize: 15, margin: '14px 0 8px' }}>Site pages(未挂品类)</div>
              <TableShell>{tree.misc.map(p => <Row key={p.slug} p={p} />)}</TableShell>
            </div>
          )}
        </>
      )}
    </div>
  );
}
