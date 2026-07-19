'use client';

// Admin → Catalog → Blog (CMS Phase 2). List of posts.
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (!res.ok) alert(`Failed to load: ${data?.error || res.status}`);
      setPosts(data.posts || []);
    } catch (e) { alert(`Failed to load: ${e.message}`); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '24px 28px', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: NAVY, margin: 0 }}>Blog</h1>
        <Link href="/admin/blog/new"
          style={{ marginLeft: 'auto', background: GOLD, color: '#fff', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          ＋ New post
        </Link>
      </div>
      <p style={{ fontSize: 13, color: '#000', margin: '0 0 16px' }}>
        Posts publish to /blog with automatic table of contents, Article schema and a Get-a-Quote CTA with related products at the end.
      </p>

      {loading ? <div style={{ padding: 40 }}>Loading…</div> : (
        <div style={{ border: '1px solid #E0DDD7', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Post', 'Author', 'Status', 'Published', ''].map(h => (
                  <th key={h} style={{ background: NAVY, color: '#fff', textAlign: 'left', padding: '11px 14px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F0EEED' }}>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ fontWeight: 600, color: NAVY }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: '#000', fontFamily: 'monospace' }}>/blog/{p.slug}</div>
                  </td>
                  <td style={{ padding: '11px 14px' }}>{p.author}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: p.status === 'published' ? '#F0FAF4' : '#FEF3C7', color: p.status === 'published' ? '#166534' : '#92400E' }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString('en-AU') : '—'}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {p.status === 'published' && (
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: 12, fontWeight: 700, marginRight: 12, textDecoration: 'none' }}>View →</a>
                    )}
                    <Link href={`/admin/blog/${p.id}`}
                      style={{ background: GOLD, color: '#fff', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#000' }}>No posts yet — write the first one.</div>}
        </div>
      )}
    </div>
  );
}
