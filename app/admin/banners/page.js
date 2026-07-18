// app/admin/banners/page.js
// Catalog → Banners. Set the hero image on each category page yourself.
// Images are compressed in the browser (max 1920px wide, WebP ~82%) before
// upload, so a 5 MB photo becomes ~200–400 KB and the site stays fast.
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slug';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const MAX_W = 1920;
const QUALITY = 0.82;

const kb = (n) => (n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB');

// Draw the picked file onto a canvas at max 1920px wide and re-encode as WebP.
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_W / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => blob ? resolve({ blob, w, h }) : reject(new Error('compress failed')), 'image/webp', QUALITY);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('not an image')); };
    img.src = url;
  });
}

export default function BannersPage() {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState({});   // slug -> row
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState({});         // slug -> "5.2 MB → 310 KB"

  async function load() {
    setLoading(true);
    const [{ data: prods }, res] = await Promise.all([
      supabase.from('products').select('category').eq('is_published', true),
      fetch('/api/admin/banners', { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
    ]);
    const names = [...new Set((prods || []).map(p => p.category).filter(Boolean))].sort();
    setCategories(names);
    const map = {}; (res.banners || []).forEach(b => { map[b.category_slug] = b; });
    setBanners(map);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function pickFile(name) {
    const slug = slugify(name);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      setBusy(slug);
      try {
        const { blob, w, h } = await compressImage(file);
        const fd = new FormData();
        fd.append('file', new File([blob], 'banner.webp', { type: 'image/webp' }));
        fd.append('categorySlug', slug);
        fd.append('categoryName', name);
        const res = await fetch('/api/admin/banners', { method: 'POST', body: fd });
        const d = await res.json();
        if (!res.ok) { alert('上传失败: ' + (d.error || '')); setBusy(''); return; }
        setNote(n => ({ ...n, [slug]: `${kb(file.size)} → ${kb(blob.size)} · ${w}×${h}` }));
        setBanners(b => ({ ...b, [slug]: d.banner }));
      } catch (e) { alert('上传失败: ' + e.message); }
      setBusy('');
    };
    input.click();
  }

  async function saveText(name, patch) {
    const slug = slugify(name);
    const res = await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorySlug: slug, categoryName: name, ...patch }),
    });
    const d = await res.json();
    if (res.ok) setBanners(b => ({ ...b, [slug]: d.banner }));
  }

  async function removeBanner(name) {
    const slug = slugify(name);
    if (!confirm(`移除 ${name} 的 banner 图?页面会回到原来的深蓝色。`)) return;
    await fetch(`/api/admin/banners?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
    setBanners(b => { const n = { ...b }; delete n[slug]; return n; });
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '24px 28px', color: '#000' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: NAVY, margin: '0 0 4px' }}>Banners</h1>
      <p style={{ fontSize: 13, color: '#000', margin: '0 0 20px' }}>
        给每个分类页换 banner 图。图片上传时**自动压缩**(最宽 1920px、转 WebP),不会拖慢网站。没设图的分类,页面保持原来的深蓝色。
      </p>

      {loading ? <div>Loading…</div> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {categories.map(name => {
            const slug = slugify(name);
            const b = banners[slug] || {};
            return (
              <div key={slug} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#fff', border: '1px solid #E0DDD7', borderRadius: 12, padding: 12 }}>
                <div style={{ width: 180, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: b.image_url ? '#eee' : NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {b.image_url
                    ? <img src={b.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#fff', fontSize: 11 }}>无图 · 深蓝</span>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: 15 }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#000', fontFamily: 'monospace', marginBottom: 8 }}>/category/{slug}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 8, marginBottom: 8 }}>
                    <input defaultValue={b.headline || ''} placeholder="标题(留空用默认 Custom Printed …)"
                      onBlur={e => saveText(name, { headline: e.target.value, subheadline: b.subheadline || '' })}
                      style={{ padding: '7px 9px', border: '1px solid #E0DDD7', borderRadius: 7, fontSize: 12.5, color: '#000' }} />
                    <input defaultValue={b.subheadline || ''} placeholder="副标题(留空用默认产品数那行)"
                      onBlur={e => saveText(name, { subheadline: e.target.value, headline: b.headline || '' })}
                      style={{ padding: '7px 9px', border: '1px solid #E0DDD7', borderRadius: 7, fontSize: 12.5, color: '#000' }} />
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => pickFile(name)} disabled={busy === slug}
                      style={{ background: busy === slug ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
                      {busy === slug ? '压缩上传中…' : (b.image_url ? '换图' : '上传 banner 图')}
                    </button>
                    {b.image_url && <button onClick={() => removeBanner(name)} style={{ background: 'none', border: '1px solid #E0C9C9', color: '#991B1B', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>移除</button>}
                    {b.image_url && <a href={`/category/${slug}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>看页面 →</a>}
                    {note[slug] && <span style={{ fontSize: 11, color: '#2D6A4F', fontWeight: 700 }}>已压缩 {note[slug]}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
