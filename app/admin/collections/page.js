'use client';

// Admin → Catalog → Collections (D8 Collections Manager).
// Rule-driven collections: rules pick products automatically, ops only fine-tunes.

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const TYPE_LABEL = { scenario: 'Scenario', colour: 'Colour', material: 'Material', industry: 'Industry', attribute: 'Attribute', brand: 'Brand' };

export default function CollectionsListPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/collections');
      const data = await res.json();
      if (!res.ok) alert(`Failed to load: ${data?.error || res.status}`);
      setCollections(data.collections || []);
    } catch (e) { alert(`Failed to load: ${e.message}`); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '24px 28px', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: NAVY, margin: 0 }}>Collections</h1>
        <Link href="/admin/collections/new"
          style={{ marginLeft: 'auto', background: GOLD, color: '#fff', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          ＋ New collection
        </Link>
      </div>
      <p style={{ fontSize: 13, color: '#000', margin: '0 0 16px' }}>
        Smart collections: set rules once (category, price, colour…) and matching products stay in automatically —
        including new imports. Pin favourites to the top, exclude anything that doesn&apos;t fit. Publishing creates the
        landing page at /slug; edit its copy in Content.
      </p>

      {loading ? <div style={{ padding: 40 }}>Loading…</div> : (
        <div style={{ border: '1px solid #E0DDD7', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Collection', 'Type', 'Status', 'Updated', ''].map(h => (
                  <th key={h} style={{ background: NAVY, color: '#fff', textAlign: 'left', padding: '11px 14px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {collections.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F0EEED' }}>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ fontWeight: 600, color: NAVY }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#000', fontFamily: 'monospace' }}>/{c.slug}</div>
                  </td>
                  <td style={{ padding: '11px 14px' }}>{TYPE_LABEL[c.ctype] || c.ctype}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: c.status === 'published' ? '#F0FAF4' : '#FEF3C7', color: c.status === 'published' ? '#166534' : '#92400E' }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>{c.updated_at ? new Date(c.updated_at).toLocaleDateString('en-AU') : '—'}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {c.status === 'published' && (
                      <>
                        <a href={`/${c.slug}`} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: 12, fontWeight: 700, marginRight: 12, textDecoration: 'none' }}>View →</a>
                        <Link href={`/admin/content/${c.slug}`} style={{ color: NAVY, fontSize: 12, fontWeight: 700, marginRight: 12, textDecoration: 'none' }}>Content →</Link>
                      </>
                    )}
                    <Link href={`/admin/collections/${c.id}`}
                      style={{ background: GOLD, color: '#fff', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {collections.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#000' }}>No collections yet — create the first one.</div>}
        </div>
      )}
    </div>
  );
}
