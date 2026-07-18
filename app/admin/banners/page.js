// app/admin/banners/page.js
// Catalog → Banners. One place to set the banner on every page type:
// 分类 / 品牌 / 系列 / 首页轮播. Images are compressed in the browser
// (max 1920px wide, WebP ~82%) before upload, so the site stays fast.
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slug';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const MAX_W = 1920;
const QUALITY = 0.82;

const TABS = [
  // 分类页的 key = url_pages.slug,「看页面」直接打开客户真实访问的 SEO 链接(如 /custom-bags-australia)
  { key: 'category', label: '分类页', path: (s) => `/${s}` },
  { key: 'brand', label: '品牌页', path: (s) => `/brands/${s}` },
  { key: 'collection', label: '系列页', path: (s) => `/collections/${s}` },
  { key: 'home', label: '首页轮播', path: () => `/` },
];

const kb = (v) => (v >= 1048576 ? (v / 1048576).toFixed(1) + ' MB' : Math.round(v / 1024) + ' KB');
const inp = { padding: '7px 9px', border: '1px solid #E0DDD7', borderRadius: 7, fontSize: 12.5, color: '#000', width: '100%', boxSizing: 'border-box' };

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_W / img.width);
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      c.toBlob(b => b ? resolve({ blob: b, w, h }) : reject(new Error('compress failed')), 'image/webp', QUALITY);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('这个文件不是图片(iPhone HEIC 请先存成 JPG)')); };
    img.src = url;
  });
}

export default function BannersPage() {
  const [tab, setTab] = useState('category');
  const [keys, setKeys] = useState([]);        // [{name, slug}]
  const [rows, setRows] = useState([]);        // page_banners rows
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState({});

  const loadBanners = useCallback(async () => {
    const d = await fetch('/api/admin/banners', { cache: 'no-store' }).then(r => r.json()).catch(() => ({}));
    setRows(d.banners || []);
  }, []);

  // Build the list of pages for the current tab.
  // 分类 tab:从 url_pages(status='live')取 —— 这才是客户实际看到的页面清单,
  // page_key 直接用 url_pages.slug,和前台一一对应(不再用 products.category 的历史值)。
  const loadKeys = useCallback(async (which) => {
    if (which === 'home') { setKeys([]); return; }
    if (which === 'category') {
      const { data } = await supabase
        .from('url_pages')
        .select('slug, nav_label, h1, page_type, breadcrumb_parent')
        .eq('status', 'live');
      const rows = data || [];
      const label = (r) => r.nav_label || r.h1 || r.slug;
      // 主分类在前,各自的子分类页跟在后面(缩进显示)
      const tops = rows
        .filter(r => r.page_type === 'product_category' && !r.breadcrumb_parent)
        .sort((a, b) => label(a).localeCompare(label(b)));
      const out = [];
      tops.forEach(top => {
        out.push({ name: label(top), slug: top.slug });
        rows
          .filter(r => r.breadcrumb_parent === top.slug && r.page_type !== 'collection')
          .sort((a, b) => label(a).localeCompare(label(b)))
          .forEach(child => out.push({ name: `└ ${label(child)}`, slug: child.slug }));
      });
      setKeys(out);
      return;
    }
    const col = which === 'brand' ? 'brand' : 'collection';
    const { data } = await supabase.from('products').select(col).eq('is_published', true);
    const names = new Set();
    (data || []).forEach(p => {
      const v = p[col];
      if (Array.isArray(v)) v.forEach(x => x && names.add(String(x)));
      else if (v) names.add(String(v));
    });
    setKeys([...names].sort().map(nm => ({ name: nm, slug: slugify(nm) })));
  }, []);

  useEffect(() => { (async () => { setLoading(true); await Promise.all([loadKeys(tab), loadBanners()]); setLoading(false); })(); }, [tab, loadKeys, loadBanners]);

  const find = (type, key, sort = 0) => rows.find(r => r.page_type === type && r.page_key === key && r.sort_order === sort) || {};
  const slides = rows.filter(r => r.page_type === 'home' && r.page_key === 'carousel').sort((a, b) => a.sort_order - b.sort_order);

  async function pickFile(pageType, pageKey, sortOrder = 0) {
    const id = `${pageType}:${pageKey}:${sortOrder}`;
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      setBusy(id);
      try {
        const { blob, w, h } = await compressImage(file);
        const fd = new FormData();
        fd.append('file', new File([blob], 'banner.webp', { type: 'image/webp' }));
        fd.append('pageType', pageType); fd.append('pageKey', pageKey); fd.append('sortOrder', String(sortOrder));
        const res = await fetch('/api/admin/banners', { method: 'POST', body: fd });
        const d = await res.json();
        if (!res.ok) { alert('上传失败: ' + (d.error || '')); setBusy(''); return; }
        setNote(nt => ({ ...nt, [id]: `${kb(file.size)} → ${kb(blob.size)} · ${w}×${h}` }));
        await loadBanners();
      } catch (e) { alert('上传失败: ' + e.message); }
      setBusy('');
    };
    input.click();
  }

  async function saveText(pageType, pageKey, sortOrder, patch) {
    const res = await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageType, pageKey, sortOrder, ...patch }),
    });
    if (res.ok) loadBanners();
  }

  async function del(id) {
    if (!id) return;
    if (!confirm('删除这个 banner?页面会回到默认样式。')) return;
    await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
    loadBanners();
  }

  const Thumb = ({ url }) => (
    <div style={{ width: 180, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: url ? '#eee' : NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {url ? <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ color: '#fff', fontSize: 11 }}>无图 · 默认</span>}
    </div>
  );

  // One editable banner row (used by every tab).
  function BannerRow({ pageType, pageKey, sortOrder, title, subtitle, viewHref, b, withCta }) {
    const id = `${pageType}:${pageKey}:${sortOrder}`;
    return (
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#fff', border: '1px solid #E0DDD7', borderRadius: 12, padding: 12 }}>
        <Thumb url={b.image_url} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: NAVY, fontSize: 15 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: '#000', fontFamily: 'monospace', marginBottom: 8 }}>{subtitle}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))', gap: 8, marginBottom: 8 }}>
            <input defaultValue={b.headline || ''} placeholder="标题(留空用默认)" style={inp}
              onBlur={e => saveText(pageType, pageKey, sortOrder, { headline: e.target.value })} />
            <input defaultValue={b.subheadline || ''} placeholder="副标题(留空用默认)" style={inp}
              onBlur={e => saveText(pageType, pageKey, sortOrder, { subheadline: e.target.value })} />
            {withCta && <input defaultValue={b.cta_label || ''} placeholder="按钮文字(如 Shop now)" style={inp}
              onBlur={e => saveText(pageType, pageKey, sortOrder, { ctaLabel: e.target.value })} />}
            {withCta && <input defaultValue={b.cta_href || ''} placeholder="按钮链接(如 /new-arrivals)" style={inp}
              onBlur={e => saveText(pageType, pageKey, sortOrder, { ctaHref: e.target.value })} />}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => pickFile(pageType, pageKey, sortOrder)} disabled={busy === id}
              style={{ background: busy === id ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
              {busy === id ? '压缩上传中…' : (b.image_url ? '换图' : '上传图片')}
            </button>
            <label style={{ fontSize: 12, color: '#000', display: 'inline-flex', gap: 5, alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked={b.is_active !== false}
                onChange={e => saveText(pageType, pageKey, sortOrder, { isActive: e.target.checked })} /> 显示
            </label>
            <span style={{ fontSize: 12, color: '#000' }}>遮罩
              <input type="number" min="0" max="80" defaultValue={b.overlay_pct ?? 45} style={{ ...inp, width: 62, display: 'inline-block', marginLeft: 5 }}
                onBlur={e => saveText(pageType, pageKey, sortOrder, { overlayPct: e.target.value })} />%
            </span>
            {viewHref && <a href={viewHref} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>看页面 →</a>}
            {b.id && <button onClick={() => del(b.id)} style={{ background: 'none', border: '1px solid #E0C9C9', color: '#991B1B', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>删除</button>}
            {note[id] && <span style={{ fontSize: 11, color: '#2D6A4F', fontWeight: 700 }}>已压缩 {note[id]}</span>}
          </div>
        </div>
      </div>
    );
  }

  const activeTab = TABS.find(t2 => t2.key === tab);

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '24px 28px', color: '#000' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: NAVY, margin: '0 0 4px' }}>Banners</h1>
      <p style={{ fontSize: 13, color: '#000', margin: '0 0 16px' }}>
        给各个页面换 banner 图。上传时自动压缩(最宽 1920px、转 WebP),不会拖慢网站。没设图的页面保持原来的默认样式。
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(t2 => (
          <button key={t2.key} onClick={() => setTab(t2.key)}
            style={{ background: tab === t2.key ? NAVY : '#fff', color: tab === t2.key ? '#fff' : NAVY, border: `1px solid ${tab === t2.key ? NAVY : '#E0DDD7'}`, borderRadius: 20, padding: '6px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
            {t2.label}
          </button>
        ))}
      </div>

      {loading ? <div>Loading…</div> : tab === 'home' ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 12.5, color: '#000' }}>首页轮播:每张图会自动轮播切换。建议 2–4 张,宽图效果最好(约 1920×700)。</div>
          {slides.map((s, i) => (
            <BannerRow key={s.id} pageType="home" pageKey="carousel" sortOrder={s.sort_order}
              title={`第 ${i + 1} 张`} subtitle="首页轮播" viewHref="/" b={s} withCta />
          ))}
          <button onClick={() => pickFile('home', 'carousel', slides.length ? Math.max(...slides.map(s => s.sort_order)) + 1 : 0)}
            style={{ justifySelf: 'start', background: GOLD, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            ＋ 新增一张轮播图
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {keys.length === 0 && <div style={{ color: '#000' }}>没有找到{activeTab?.label}。</div>}
          {keys.map(k => (
            <BannerRow key={k.slug} pageType={tab} pageKey={k.slug} sortOrder={0}
              title={k.name} subtitle={activeTab.path(k.slug)} viewHref={activeTab.path(k.slug)}
              b={find(tab, k.slug, 0)} withCta={false} />
          ))}
        </div>
      )}
    </div>
  );
}
