'use client';

// Admin → Content: list of url_pages-driven pages, search + open editor.
// CMS Phase 1 (CMS_CONTENT_EDITOR_SPEC.md). Structured slots, not a free canvas.

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const TYPE_LABEL = {
  product_category: 'Category',
  product_subcategory: 'Subcategory',
  collection: 'Collection',
  landing: 'Landing',
};

export default function ContentListPage() {
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState('');
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

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '24px 28px', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: NAVY, margin: '0 0 4px' }}>Content</h1>
      <p style={{ fontSize: 13, color: '#000', margin: '0 0 16px' }}>
        Edit page copy yourself — intro, buying guide, FAQs, title &amp; meta. Draft → Preview → Publish, with version rollback.
        Layout, fonts and colours stay locked to the site design.
      </p>

      <input
        type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by slug or title…"
        style={{ width: '100%', maxWidth: 480, padding: '10px 14px', border: '1.5px solid #E0DDD7', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }}
      />

      {loading ? <div style={{ padding: 40, color: '#000' }}>Loading…</div> : (
        <div style={{ border: '1px solid #E0DDD7', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Page', 'Type', 'Status', 'Draft', 'Last published change', ''].map(h => (
                  <th key={h} style={{ background: NAVY, color: '#fff', textAlign: 'left', padding: '11px 14px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map(p => (
                <tr key={p.slug} style={{ borderBottom: '1px solid #F0EEED' }}>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ fontWeight: 600, color: NAVY }}>{p.nav_label || p.h1 || p.slug}</div>
                    <div style={{ fontSize: 11, color: '#000', fontFamily: 'monospace' }}>/{p.slug}</div>
                  </td>
                  <td style={{ padding: '11px 14px', color: '#000' }}>{TYPE_LABEL[p.page_type] || p.page_type || '—'}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: p.status === 'live' ? '#F0FAF4' : '#FEF3C7', color: p.status === 'live' ? '#166534' : '#92400E' }}>
                      {p.status || '—'}{p.noindex ? ' · noindex' : ''}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    {p.has_draft ? <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', background: '#FEF3C7', padding: '3px 10px', borderRadius: 12 }}>DRAFT</span> : <span style={{ color: '#000' }}>—</span>}
                  </td>
                  <td style={{ padding: '11px 14px', color: '#000' }}>{p.updated_at ? new Date(p.updated_at).toLocaleDateString('en-AU') : '—'}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                    <Link href={`/admin/content/${p.slug}`}
                      style={{ background: GOLD, color: '#fff', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#000' }}>No pages found</div>}
        </div>
      )}
    </div>
  );
}
