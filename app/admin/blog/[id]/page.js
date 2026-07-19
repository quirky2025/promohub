'use client';

// Admin → Blog → editor (CMS Phase 2). Same structured blocks + limited rich
// text as the page editor. Slug editable while draft, locked after publish.

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { slugify } from '@/lib/slug';
import AdminRichText, { compressImage } from '@/components/AdminRichText';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const EMPTY = {
  title: '', slug: '', status: 'draft', author: 'QuirkyPromo Team',
  cover_image_url: '', cover_image_alt: '', meta_description: '', target_keyword: '',
  show_toc: true, blocks: [], related_products: [], related_pages: [],
};

export default function BlogEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [post, setPost] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [prodQ, setProdQ] = useState('');
  const [prodRes, setProdRes] = useState([]);
  const [pageQ, setPageQ] = useState('');
  const [pageRes, setPageRes] = useState([]);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const res = await fetch(`/api/admin/blog?id=${id}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data?.error || 'Failed to load'); router.push('/admin/blog'); return; }
      setPost({ ...EMPTY, ...data.post });
      setSlugTouched(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // related product search
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!prodQ.trim()) { setProdRes([]); return; }
      const res = await fetch(`/api/admin/products?search=${encodeURIComponent(prodQ)}&pageSize=8`);
      const data = await res.json().catch(() => ({}));
      setProdRes((data.products || []).map(p => ({ id: p.id, name: p.name, slug: p.slug })));
    }, 300);
    return () => clearTimeout(t);
  }, [prodQ]);

  // related page search
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!pageQ.trim()) { setPageRes([]); return; }
      const res = await fetch(`/api/admin/content?search=${encodeURIComponent(pageQ)}`);
      const data = await res.json().catch(() => ({}));
      setPageRes((data.pages || []).filter(p => p.status === 'live').slice(0, 8)
        .map(p => ({ slug: p.slug, label: p.nav_label || p.h1 || p.slug })));
    }, 300);
    return () => clearTimeout(t);
  }, [pageQ]);

  function upd(patch) { setPost(prev => ({ ...prev, ...patch })); }
  function updBlock(i, patch) {
    const blocks = [...post.blocks]; blocks[i] = { ...blocks[i], ...patch }; upd({ blocks });
  }
  function moveBlock(i, dir) {
    const blocks = [...post.blocks]; const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; upd({ blocks });
  }

  function missingAlt() {
    if (post.cover_image_url && !String(post.cover_image_alt || '').trim()) return true;
    return (post.blocks || []).some(b => b.level !== 'raw' && b.image_url && !String(b.image_alt || '').trim());
  }

  async function doAction(action) {
    if (!post.title.trim()) { alert('Title required'); return; }
    if (missingAlt()) { alert('Every image needs alt text — describe the image, include the product term naturally.'); return; }
    if (action === 'publish' && !confirm('Publish this post to /blog?')) return;
    setBusy(action);
    const res = await fetch('/api/admin/blog', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, id: isNew ? undefined : id, slug: post.slug || slugify(post.title), action }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy('');
    if (!res.ok) { alert(`${action} failed: ${data?.error || res.status}`); return; }
    setPost(prev => ({ ...prev, ...data.post }));
    if (isNew) router.replace(`/admin/blog/${data.post.id}`);
    setNotice(action === 'publish' ? `Published — live at /blog/${data.post.slug} within ~5 minutes.` : action === 'unpublish' ? 'Unpublished.' : 'Saved.');
    setTimeout(() => setNotice(''), 5000);
  }

  async function remove() {
    if (!confirm('Delete this post permanently?')) return;
    const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin/blog');
    else alert('Delete failed');
  }

  function pickImage(onUrl) {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async () => {
      const f = input.files?.[0]; if (!f) return;
      try {
        const blob = await compressImage(f);
        const fd = new FormData();
        fd.append('file', new File([blob], 'blog.webp', { type: 'image/webp' }));
        fd.append('slug', `blog-${post.slug || 'post'}`);
        const res = await fetch('/api/admin/content/upload', { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { alert(`Upload failed: ${data?.error || res.status}`); return; }
        onUrl(data.image_url);
      } catch (e) { alert(e.message); }
    };
    input.click();
  }

  const label = { fontSize: 11, fontWeight: 700, color: NAVY, display: 'block', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' };
  const input = { width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: 8, fontSize: 14, color: '#000', outline: 'none', boxSizing: 'border-box', fontFamily: '"DM Sans", sans-serif', background: '#fff' };
  const card = { background: '#fff', border: '1px solid #E0DDD7', borderRadius: 12, padding: 18, marginBottom: 16 };
  const smallBtn = { background: '#fff', border: '1px solid #E0DDD7', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: NAVY };
  const chip = { display: 'inline-flex', alignItems: 'center', gap: 6, background: NAVY, color: '#fff', fontSize: 12, padding: '3px 10px', borderRadius: 12, marginRight: 6, marginBottom: 6 };

  const metaLen = (post.meta_description || '').length;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: NAVY, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/admin/blog" style={{ color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontSize: 13 }}>← Blog</Link>
        <div style={{ color: '#fff', fontWeight: 700 }}>{post.title || 'New post'}</div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: post.status === 'published' ? '#D1FAE5' : '#FEF3C7', color: post.status === 'published' ? '#065F46' : '#92400E' }}>{post.status}</span>
        {post.status === 'published' && <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>View live →</a>}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {notice && <span style={{ color: '#A7F3D0', fontSize: 12, fontWeight: 700 }}>{notice}</span>}
          {!isNew && <button onClick={remove} style={{ background: 'none', border: '1px solid rgba(255,255,255,.4)', color: '#FCA5A5', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Delete</button>}
          {post.status === 'published' && (
            <button onClick={() => doAction('unpublish')} disabled={!!busy} style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.35)', borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Unpublish</button>
          )}
          <button onClick={() => doAction('save')} disabled={!!busy} style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.35)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {busy === 'save' ? 'Saving…' : 'Save draft'}
          </button>
          <button onClick={() => doAction('publish')} disabled={!!busy} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {busy === 'publish' ? 'Publishing…' : post.status === 'published' ? 'Republish' : 'Publish'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, padding: '18px 24px 60px' }}>
        <div style={card}>
          <label style={label}>Title (H1)</label>
          <input value={post.title} style={input}
            onChange={e => {
              const title = e.target.value;
              setPost(prev => ({ ...prev, title, slug: (!slugTouched && prev.status !== 'published') ? slugify(title) : prev.slug }));
            }} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginTop: 10 }}>
            <div>
              <label style={label}>URL slug {post.status === 'published' && <span style={{ color: '#000', fontWeight: 400, textTransform: 'none' }}>(locked after publish)</span>}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 13 }}>/blog/</span>
                <input value={post.slug} disabled={post.status === 'published'}
                  onChange={e => { setSlugTouched(true); upd({ slug: slugify(e.target.value) }); }}
                  style={{ ...input, fontFamily: 'monospace', background: post.status === 'published' ? '#F5F4F2' : '#fff' }} />
              </div>
            </div>
            <div>
              <label style={label}>Author</label>
              <input value={post.author} onChange={e => upd({ author: e.target.value })} style={input} />
            </div>
          </div>
          <label style={{ ...label, marginTop: 10 }}>Meta description</label>
          <textarea value={post.meta_description || ''} onChange={e => upd({ meta_description: e.target.value })} rows={2} style={{ ...input, resize: 'vertical' }} />
          <div style={{ fontSize: 11, textAlign: 'right', color: metaLen > 165 ? '#B91C1C' : '#000', fontWeight: metaLen > 165 ? 700 : 400 }}>{metaLen}/165</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={label}>Target keyword <span style={{ color: '#000', fontWeight: 400, textTransform: 'none' }}>(internal note, never shown)</span></label>
              <input value={post.target_keyword || ''} onChange={e => upd({ target_keyword: e.target.value })} style={input} />
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 600, color: NAVY, paddingBottom: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={post.show_toc !== false} onChange={e => upd({ show_toc: e.target.checked })} /> Table of contents (auto from H2s)
            </label>
          </div>
        </div>

        <div style={card}>
          <label style={label}>Cover image</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {post.cover_image_url && <img src={post.cover_image_url} alt="" style={{ height: 64, borderRadius: 8 }} />}
            <button style={smallBtn} onClick={() => pickImage(url => upd({ cover_image_url: url }))}>
              {post.cover_image_url ? 'Replace' : 'Upload (wide, ≥1200px)'}
            </button>
            {post.cover_image_url && (
              <>
                <input value={post.cover_image_alt || ''} onChange={e => upd({ cover_image_alt: e.target.value })}
                  placeholder="Alt text (required)" style={{ ...input, flex: 1, minWidth: 220, width: 'auto', borderColor: String(post.cover_image_alt || '').trim() ? '#E0DDD7' : '#B91C1C' }} />
                <button style={{ ...smallBtn, color: '#991B1B', borderColor: '#E0C9C9' }} onClick={() => upd({ cover_image_url: '', cover_image_alt: '' })}>Remove</button>
              </>
            )}
          </div>
        </div>

        <div style={card}>
          <label style={label}>Body</label>
          {(post.blocks || []).map((b, i) => (
            <div key={i} style={{ border: '1px solid #E0DDD7', borderRadius: 10, padding: 14, marginBottom: 12, borderLeft: `3px solid ${GOLD}` }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <select value={b.level || 'h2'} onChange={e => updBlock(i, { level: e.target.value })} style={{ ...input, width: 90, padding: '6px 8px' }}>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                </select>
                <input value={b.heading || ''} onChange={e => updBlock(i, { heading: e.target.value })} placeholder="Section heading" style={{ ...input, flex: 1, minWidth: 200, width: 'auto' }} />
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <button style={smallBtn} onClick={() => moveBlock(i, -1)}>↑</button>
                  <button style={smallBtn} onClick={() => moveBlock(i, 1)}>↓</button>
                  <button style={{ ...smallBtn, color: '#991B1B', borderColor: '#E0C9C9' }}
                    onClick={() => { if (confirm('Delete this section?')) upd({ blocks: post.blocks.filter((_, x) => x !== i) }); }}>✕</button>
                </span>
              </div>
              <AdminRichText value={b.html || ''} onChange={html => updBlock(i, { html })} placeholder="Write the section…" />
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {b.image_url && <img src={b.image_url} alt="" style={{ height: 44, borderRadius: 6 }} />}
                <button style={smallBtn} onClick={() => pickImage(url => updBlock(i, { image_url: url }))}>
                  {b.image_url ? 'Replace image' : '+ Image (optional)'}
                </button>
                {b.image_url && (
                  <>
                    <input value={b.image_alt || ''} onChange={e => updBlock(i, { image_alt: e.target.value })}
                      placeholder="Alt text (required)" style={{ ...input, flex: 1, minWidth: 220, width: 'auto', borderColor: String(b.image_alt || '').trim() ? '#E0DDD7' : '#B91C1C' }} />
                    <button style={{ ...smallBtn, color: '#991B1B', borderColor: '#E0C9C9' }} onClick={() => updBlock(i, { image_url: '', image_alt: '' })}>Remove image</button>
                  </>
                )}
              </div>
            </div>
          ))}
          <button style={{ ...smallBtn, borderStyle: 'dashed', width: '100%', padding: '10px 0' }}
            onClick={() => upd({ blocks: [...(post.blocks || []), { level: 'h2', heading: '', html: '' }] })}>
            + Add section
          </button>
        </div>

        <div style={card}>
          <label style={label}>Related products <span style={{ color: '#000', fontWeight: 400, textTransform: 'none' }}>(shown as a grid at the end of the post)</span></label>
          <div>
            {(post.related_products || []).map(p => (
              <span key={p.id} style={chip}>{p.name}<span style={{ cursor: 'pointer', fontWeight: 700 }} onClick={() => upd({ related_products: post.related_products.filter(x => x.id !== p.id) })}>✕</span></span>
            ))}
          </div>
          <input value={prodQ} onChange={e => setProdQ(e.target.value)} placeholder="Search products…" style={input} />
          {prodRes.length > 0 && (
            <div style={{ border: '1px solid #E0DDD7', borderRadius: 8, marginTop: 6 }}>
              {prodRes.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderBottom: '1px solid #F0EEED', fontSize: 13 }}>
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <button style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => { if (!(post.related_products || []).some(x => x.id === p.id)) upd({ related_products: [...(post.related_products || []), p] }); setProdQ(''); }}>
                    + Add
                  </button>
                </div>
              ))}
            </div>
          )}

          <label style={{ ...label, marginTop: 14 }}>Related collection / category pages</label>
          <div>
            {(post.related_pages || []).map(p => (
              <span key={p.slug} style={chip}>{p.label}<span style={{ cursor: 'pointer', fontWeight: 700 }} onClick={() => upd({ related_pages: post.related_pages.filter(x => x.slug !== p.slug) })}>✕</span></span>
            ))}
          </div>
          <input value={pageQ} onChange={e => setPageQ(e.target.value)} placeholder="Search pages…" style={input} />
          {pageRes.length > 0 && (
            <div style={{ border: '1px solid #E0DDD7', borderRadius: 8, marginTop: 6 }}>
              {pageRes.map(p => (
                <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderBottom: '1px solid #F0EEED', fontSize: 13 }}>
                  <span style={{ flex: 1 }}>{p.label} <span style={{ fontFamily: 'monospace', fontSize: 11 }}>/{p.slug}</span></span>
                  <button style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => { if (!(post.related_pages || []).some(x => x.slug === p.slug)) upd({ related_pages: [...(post.related_pages || []), p] }); setPageQ(''); }}>
                    + Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
