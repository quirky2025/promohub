'use client';

// Admin → Content → Editor. CMS Phase 1 (CMS_CONTENT_EDITOR_SPEC.md).
// Structured slots only: hero (reuses page_banners — same record as the Banners page),
// intro, guide blocks, FAQ, title/meta. Draft → Preview → Publish + rollback.
// Rich text is LIMITED: bold / link / lists. No fonts, no sizes, no colours.

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SeoContent from '@/components/SeoContent';
import AdminRichText, { compressImage } from '@/components/AdminRichText';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

// Compile blocks → HTML exactly like the server does (for Preview parity).
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function compilePreview(blocks) {
  const parts = [];
  for (const b of blocks || []) {
    if (b.level === 'raw') { if (b.html?.trim()) parts.push(b.html); continue; }
    const tag = b.level === 'h3' ? 'h3' : 'h2';
    if (b.heading?.trim()) parts.push(`<${tag}>${esc(b.heading)}</${tag}>`);
    if (b.image_url) parts.push(`<p><img src="${esc(b.image_url)}" alt="${esc(b.image_alt || '')}" style="max-width:100%;border-radius:8px" /></p>`);
    if (b.html?.trim()) parts.push(b.html);
  }
  return parts.join('\n');
}

// ---------- page ----------

export default function ContentEditorPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [payload, setPayload] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState('');
  const [tab, setTab] = useState('edit'); // edit | preview | versions
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/page?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (!res.ok) { alert(`Failed to load: ${data?.error || res.status}`); setLoading(false); return; }
      setPage(data.page);
      setRevisions(data.revisions || []);
      const p = data.draft?.payload || {
        title: data.page.title || '',
        meta_description: data.page.meta_description || '',
        seo_intro: data.page.seo_intro || '',
        guide_blocks: data.page.seo_content ? [{ level: 'raw', html: data.page.seo_content }] : [],
        faq: Array.isArray(data.page.faq) ? data.page.faq.map(f => ({ question: f.question || '', answer: f.answer || '' })) : [],
      };
      setPayload(p);
      setDirty(!!data.draft);
      // hero banner (same record the Banners page edits)
      const bRes = await fetch('/api/admin/banners?type=category');
      const bData = await bRes.json().catch(() => ({}));
      setBanner((bData.banners || []).find(b => b.page_key === slug && b.sort_order === 0) || null);
    } catch (e) { alert(`Failed to load: ${e.message}`); }
    setLoading(false);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  function upd(patch) { setPayload(prev => ({ ...prev, ...patch })); setDirty(true); }
  function updBlock(i, patch) {
    const blocks = [...(payload.guide_blocks || [])];
    blocks[i] = { ...blocks[i], ...patch };
    upd({ guide_blocks: blocks });
  }
  function moveBlock(i, dir) {
    const blocks = [...(payload.guide_blocks || [])];
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    upd({ guide_blocks: blocks });
  }
  function updFaq(i, patch) {
    const faq = [...(payload.faq || [])];
    faq[i] = { ...faq[i], ...patch };
    upd({ faq });
  }

  async function post(action, extra = {}) {
    const res = await fetch('/api/admin/content/page', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, action, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(`${action} failed: ${data?.error || res.status}`); return null; }
    return data;
  }

  // Image alt is REQUIRED before saving (spec 1.4)
  function missingAlt() {
    return (payload.guide_blocks || []).some(b => b.level !== 'raw' && b.image_url && !String(b.image_alt || '').trim());
  }

  async function saveDraft() {
    if (missingAlt()) { alert('Every image needs alt text before saving — describe the image, include the product term naturally.'); return; }
    setBusy('draft');
    const r = await post('save_draft', { payload });
    if (r) { setDirty(false); setNotice('Draft saved.'); setTimeout(() => setNotice(''), 3000); }
    setBusy('');
  }
  async function publish() {
    if (missingAlt()) { alert('Every image needs alt text before publishing.'); return; }
    if (!confirm('Publish these changes to the live site?')) return;
    setBusy('publish');
    const r = await post('publish', { payload });
    if (r) { setDirty(false); setNotice(`Published (v${r.version}). The live page updates within ~5 minutes.`); setTimeout(() => setNotice(''), 6000); load(); }
    setBusy('');
  }
  async function rollback(rev) {
    if (!confirm(`Roll the live page back to version ${rev.version} (${new Date(rev.published_at).toLocaleString('en-AU')})?`)) return;
    setBusy(`rb${rev.id}`);
    const r = await post('rollback', { revision_id: rev.id });
    if (r) { setNotice(`Rolled back — republished as v${r.version}.`); setTimeout(() => setNotice(''), 6000); load(); }
    setBusy('');
  }

  async function uploadImage(file, onUrl) {
    const blob = await compressImage(file);
    const fd = new FormData();
    fd.append('file', new File([blob], 'content.webp', { type: 'image/webp' }));
    fd.append('slug', slug);
    const res = await fetch('/api/admin/content/upload', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(`Upload failed: ${data?.error || res.status}`); return; }
    onUrl(data.image_url);
  }

  function pickImage(onUrl) {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = () => { const f = input.files?.[0]; if (f) uploadImage(f, onUrl).catch(e => alert(e.message)); };
    input.click();
  }

  function pickHeroImage() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async () => {
      const f = input.files?.[0]; if (!f) return;
      setBusy('hero');
      try {
        const blob = await compressImage(f);
        const fd = new FormData();
        fd.append('file', new File([blob], 'banner.webp', { type: 'image/webp' }));
        fd.append('pageType', 'category'); fd.append('pageKey', slug); fd.append('sortOrder', '0');
        const res = await fetch('/api/admin/banners', { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { alert(`Hero upload failed: ${data?.error || res.status}`); }
        else setBanner(data.banner);
      } catch (e) { alert(e.message); }
      setBusy('');
    };
    input.click();
  }
  async function saveHeroText(patch) {
    const res = await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageType: 'category', pageKey: slug, sortOrder: 0, ...patch }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) setBanner(data.banner);
    else alert(`Hero save failed: ${data?.error || res.status}`);
  }

  const label = { fontSize: 11, fontWeight: 700, color: NAVY, display: 'block', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' };
  const input = { width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: 8, fontSize: 14, color: '#000', outline: 'none', boxSizing: 'border-box', fontFamily: '"DM Sans", sans-serif' };
  const card = { background: '#fff', border: '1px solid #E0DDD7', borderRadius: 12, padding: 18, marginBottom: 18 };
  const smallBtn = { background: '#fff', border: '1px solid #E0DDD7', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: NAVY };

  if (loading) return <div style={{ padding: 40, fontFamily: '"DM Sans", sans-serif', color: '#000' }}>Loading…</div>;
  if (!page || !payload) return <div style={{ padding: 40, fontFamily: '"DM Sans", sans-serif', color: '#000' }}>Page not found. <Link href="/admin/content">Back</Link></div>;

  const titleLen = (payload.title || '').length;
  const metaLen = (payload.meta_description || '').length;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: '#000', background: '#fff', minHeight: '100vh' }}>
      {/* top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: NAVY, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/admin/content" style={{ color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontSize: 13 }}>← Content</Link>
        <div style={{ color: '#fff', fontWeight: 700 }}>{page.nav_label || page.h1 || page.slug}</div>
        <a href={`/${page.slug}`} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>View live →</a>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {notice && <span style={{ color: '#A7F3D0', fontSize: 12, fontWeight: 700 }}>{notice}</span>}
          {dirty && <span style={{ color: '#FDE68A', fontSize: 12, fontWeight: 700 }}>Unsaved changes</span>}
          <button onClick={saveDraft} disabled={busy === 'draft'}
            style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.35)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {busy === 'draft' ? 'Saving…' : 'Save draft'}
          </button>
          <button onClick={publish} disabled={busy === 'publish'}
            style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {busy === 'publish' ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '14px 24px 0' }}>
        {[['edit', 'Edit'], ['preview', 'Preview'], ['versions', `Versions (${revisions.length})`]].map(([id, lb]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ background: tab === id ? NAVY : '#fff', color: tab === id ? '#fff' : NAVY, border: `1px solid ${tab === id ? NAVY : '#E0DDD7'}`, borderRadius: 20, padding: '6px 18px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
            {lb}
          </button>
        ))}
      </div>

      {tab === 'edit' && (
        <div style={{ maxWidth: 860, padding: '18px 24px 60px' }}>

          {/* HERO — same record as admin → Banners */}
          <div style={card}>
            <label style={label}>Hero image <span style={{ color: '#000', fontWeight: 400, textTransform: 'none' }}>(shared with the Banners page — one record, two windows. Recommended ≥1600×600.)</span></label>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: 220, height: 88, borderRadius: 8, overflow: 'hidden', background: banner?.image_url ? '#eee' : NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {banner?.image_url
                  ? <img src={banner.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#fff', fontSize: 11 }}>No image · navy default</span>}
              </div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <input defaultValue={banner?.headline || ''} placeholder="Hero headline (blank = page H1)" style={input}
                    onBlur={e => saveHeroText({ headline: e.target.value })} />
                  <input defaultValue={banner?.subheadline || ''} placeholder="Hero sub-line (blank = intro text)" style={input}
                    onBlur={e => saveHeroText({ subheadline: e.target.value })} />
                </div>
                <button onClick={pickHeroImage} disabled={busy === 'hero'} style={{ ...smallBtn, background: NAVY, color: '#fff', border: 'none', padding: '7px 14px' }}>
                  {busy === 'hero' ? 'Uploading…' : (banner?.image_url ? 'Replace image' : 'Upload image')}
                </button>
                <span style={{ fontSize: 11, color: '#000', marginLeft: 10 }}>Leave headline blank to keep the SEO H1 — recommended for category pages.</span>
              </div>
            </div>
          </div>

          {/* TITLE / META */}
          <div style={card}>
            <label style={label}>Title tag</label>
            <input value={payload.title || ''} onChange={e => upd({ title: e.target.value })} style={input} />
            <div style={{ fontSize: 11, textAlign: 'right', color: titleLen > 60 ? '#B91C1C' : '#000', fontWeight: titleLen > 60 ? 700 : 400 }}>{titleLen}/60</div>

            <label style={{ ...label, marginTop: 10 }}>Meta description</label>
            <textarea value={payload.meta_description || ''} onChange={e => upd({ meta_description: e.target.value })} rows={3} style={{ ...input, resize: 'vertical' }} />
            <div style={{ fontSize: 11, textAlign: 'right', color: metaLen > 165 ? '#B91C1C' : '#000', fontWeight: metaLen > 165 ? 700 : 400 }}>{metaLen}/165</div>
          </div>

          {/* INTRO */}
          <div style={card}>
            <label style={label}>Intro paragraph <span style={{ color: '#000', fontWeight: 400, textTransform: 'none' }}>(shown under the H1, plain text)</span></label>
            <textarea value={payload.seo_intro || ''} onChange={e => upd({ seo_intro: e.target.value })} rows={4} style={{ ...input, resize: 'vertical', lineHeight: 1.7 }} />
          </div>

          {/* GUIDE BLOCKS */}
          <div style={card}>
            <label style={label}>Buying guide (below the product grid)</label>
            {(payload.guide_blocks || []).map((b, i) => (
              <div key={i} style={{ border: '1px solid #E0DDD7', borderRadius: 10, padding: 14, marginBottom: 12, borderLeft: `3px solid ${GOLD}` }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                  {b.level === 'raw' ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', background: '#FEF3C7', padding: '3px 10px', borderRadius: 12 }}>EXISTING CONTENT</span>
                  ) : (
                    <>
                      <select value={b.level || 'h2'} onChange={e => updBlock(i, { level: e.target.value })} style={{ ...input, width: 90, padding: '6px 8px' }}>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                      </select>
                      <input value={b.heading || ''} onChange={e => updBlock(i, { heading: e.target.value })} placeholder="Section heading" style={{ ...input, flex: 1, minWidth: 200 }} />
                    </>
                  )}
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <button style={smallBtn} onClick={() => moveBlock(i, -1)}>↑</button>
                    <button style={smallBtn} onClick={() => moveBlock(i, 1)}>↓</button>
                    <button style={{ ...smallBtn, color: '#991B1B', borderColor: '#E0C9C9' }}
                      onClick={() => { if (confirm('Delete this block?')) upd({ guide_blocks: payload.guide_blocks.filter((_, x) => x !== i) }); }}>✕</button>
                  </span>
                </div>
                <AdminRichText value={b.html || ''} onChange={html => updBlock(i, { html })} placeholder="Write the section content…" />
                {b.level !== 'raw' && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    {b.image_url && <img src={b.image_url} alt="" style={{ height: 44, borderRadius: 6 }} />}
                    <button style={smallBtn} onClick={() => pickImage(url => updBlock(i, { image_url: url }))}>
                      {b.image_url ? 'Replace image' : '+ Image (optional, ≥1200px wide)'}
                    </button>
                    {b.image_url && (
                      <>
                        <input value={b.image_alt || ''} onChange={e => updBlock(i, { image_alt: e.target.value })}
                          placeholder="Alt text (required) — describe the image, include the product term naturally"
                          style={{ ...input, flex: 1, minWidth: 240, borderColor: String(b.image_alt || '').trim() ? '#E0DDD7' : '#B91C1C' }} />
                        <button style={{ ...smallBtn, color: '#991B1B', borderColor: '#E0C9C9' }} onClick={() => updBlock(i, { image_url: '', image_alt: '' })}>Remove image</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button style={{ ...smallBtn, borderStyle: 'dashed', width: '100%', padding: '10px 0' }}
              onClick={() => upd({ guide_blocks: [...(payload.guide_blocks || []), { level: 'h2', heading: '', html: '' }] })}>
              + Add guide section
            </button>
          </div>

          {/* FAQ */}
          <div style={card}>
            <label style={label}>FAQs <span style={{ color: '#000', fontWeight: 400, textTransform: 'none' }}>(automatically output as FAQPage schema)</span></label>
            {(payload.faq || []).map((f, i) => (
              <div key={i} style={{ border: '1px solid #E0DDD7', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={f.question || ''} onChange={e => updFaq(i, { question: e.target.value })} placeholder="Question" style={{ ...input, fontWeight: 600 }} />
                  <button style={{ ...smallBtn, color: '#991B1B', borderColor: '#E0C9C9' }}
                    onClick={() => { if (confirm('Delete this FAQ?')) upd({ faq: payload.faq.filter((_, x) => x !== i) }); }}>✕</button>
                </div>
                <AdminRichText value={f.answer || ''} onChange={answer => updFaq(i, { answer })} minHeight={60} placeholder="Answer…" />
              </div>
            ))}
            <button style={{ ...smallBtn, borderStyle: 'dashed', width: '100%', padding: '10px 0' }}
              onClick={() => upd({ faq: [...(payload.faq || []), { question: '', answer: '' }] })}>
              + Add FAQ
            </button>
          </div>

          <div style={{ fontSize: 12, color: '#000' }}>
            URL: <span style={{ fontFamily: 'monospace' }}>/{page.slug}</span> (read-only — URL changes are an SEO operation, ask dev).
            Publishing updates the sitemap automatically. Live page refreshes within ~5 minutes.
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div style={{ padding: '18px 0 60px' }}>
          {/* hero preview — same layout family as the live page */}
          <section style={{
            background: banner?.image_url
              ? `linear-gradient(rgba(27,42,74,${(banner.overlay_pct ?? 45) / 100}), rgba(27,42,74,${(banner.overlay_pct ?? 45) / 100})), url(${banner.image_url}) center/cover no-repeat`
              : NAVY,
            padding: '54px 40px 58px',
          }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 48, lineHeight: 1.08, color: '#fff', fontWeight: 600, margin: '0 0 16px' }}>
                {banner?.headline || page.h1 || page.nav_label}
              </h1>
              {(banner?.subheadline || payload.seo_intro) && (
                <p style={{ color: 'rgba(255,255,255,.76)', fontSize: 16, lineHeight: 1.75, margin: 0, maxWidth: 780 }}>
                  {banner?.subheadline || payload.seo_intro}
                </p>
              )}
            </div>
          </section>
          <div style={{ textAlign: 'center', padding: '26px 0', color: '#000', fontSize: 13, borderBottom: '1px solid #E0DDD7' }}>
            — product grid appears here on the live page —
          </div>
          {/*真实前端组件渲染指南 + FAQ */}
          <SeoContent content={compilePreview(payload.guide_blocks)} faq={payload.faq || []} />
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '10px 24px', fontSize: 12, color: '#000' }}>
            <b>Title:</b> {payload.title || '—'}<br />
            <b>Meta:</b> {payload.meta_description || '—'}
          </div>
        </div>
      )}

      {tab === 'versions' && (
        <div style={{ maxWidth: 860, padding: '18px 24px 60px' }}>
          {revisions.length === 0 && <div style={{ color: '#000' }}>No published versions yet — versions appear every time you publish.</div>}
          {revisions.map(rev => (
            <div key={rev.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontWeight: 700, color: NAVY }}>v{rev.version}</div>
              <div style={{ fontSize: 13, color: '#000' }}>
                {rev.published_at ? new Date(rev.published_at).toLocaleString('en-AU') : '—'} · {rev.created_by || ''}
              </div>
              <button onClick={() => rollback(rev)} disabled={busy === `rb${rev.id}`}
                style={{ marginLeft: 'auto', background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
                {busy === `rb${rev.id}` ? 'Rolling back…' : 'Roll back to this version'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
