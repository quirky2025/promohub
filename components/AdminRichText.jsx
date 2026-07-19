'use client';

// Shared limited rich-text editor for admin CMS (pages + blog).
// Toolbar: bold / link / lists ONLY. Paste is cleaned (Word/web styling stripped).

import { useEffect, useRef } from 'react';

const NAVY = '#1B2A4A';
const MAX_W = 1920;
const QUALITY = 0.82;

const ALLOWED_TAGS = new Set(['P', 'BR', 'B', 'STRONG', 'EM', 'I', 'A', 'UL', 'OL', 'LI', 'H2', 'H3', 'IMG']);

export function cleanHtml(dirty) {
  if (typeof window === 'undefined') return dirty || '';
  const doc = new DOMParser().parseFromString(`<div>${dirty || ''}</div>`, 'text/html');
  const walk = (node) => {
    let out = '';
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) { out += child.textContent.replace(/</g, '&lt;'); return; }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const tag = child.tagName;
      const inner = walk(child);
      if (!ALLOWED_TAGS.has(tag)) { out += inner; return; }
      if (tag === 'BR') { out += '<br />'; return; }
      if (tag === 'A') {
        const href = child.getAttribute('href') || '';
        if (/^javascript:/i.test(href)) { out += inner; return; }
        out += `<a href="${href.replace(/"/g, '&quot;')}">${inner}</a>`;
        return;
      }
      if (tag === 'IMG') {
        const src = child.getAttribute('src') || '';
        const alt = child.getAttribute('alt') || '';
        if (src) out += `<img src="${src.replace(/"/g, '&quot;')}" alt="${alt.replace(/"/g, '&quot;')}" style="max-width:100%;border-radius:8px" />`;
        return;
      }
      const t = tag.toLowerCase();
      out += `<${t}>${inner}</${t}>`;
    });
    return out;
  };
  return walk(doc.body.firstChild);
}

export function compressImage(file) {
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
      c.toBlob(b => b ? resolve(b) : reject(new Error('compress failed')), 'image/webp', QUALITY);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Not an image file (save iPhone HEIC as JPG first)')); };
    img.src = url;
  });
}

function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

export default function AdminRichText({ value, onChange, minHeight = 90, placeholder }) {
  const ref = useRef(null);
  const lastValue = useRef(value);
  // Frozen initial content — React must never rewrite innerHTML mid-typing (caret jumps).
  const initial = useRef(value);

  useEffect(() => {
    if (ref.current && value !== lastValue.current && document.activeElement !== ref.current) {
      ref.current.innerHTML = value || '';
      lastValue.current = value;
    }
  }, [value]);

  function emit() {
    const html = ref.current?.innerHTML || '';
    lastValue.current = html;
    onChange(html);
  }
  function cmd(name) {
    ref.current?.focus();
    if (name === 'createLink') {
      const url = window.prompt('Link URL (e.g. /custom-packaging-australia or https://…)');
      if (!url) return;
      document.execCommand('createLink', false, url);
    } else {
      document.execCommand(name, false, null);
    }
    emit();
  }
  function onPaste(e) {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html') || esc(e.clipboardData.getData('text/plain')).replace(/\n/g, '<br />');
    document.execCommand('insertHTML', false, cleanHtml(html));
    emit();
  }

  const btn = { background: '#fff', border: '1px solid #E0DDD7', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: NAVY };
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        <button type="button" style={btn} onClick={() => cmd('bold')}><b>B</b></button>
        <button type="button" style={btn} onClick={() => cmd('createLink')}>🔗 Link</button>
        <button type="button" style={btn} onClick={() => cmd('insertUnorderedList')}>• List</button>
        <button type="button" style={btn} onClick={() => cmd('insertOrderedList')}>1. List</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={() => { const c = cleanHtml(ref.current?.innerHTML); if (c !== lastValue.current) { ref.current.innerHTML = c; lastValue.current = c; onChange(c); } }}
        onPaste={onPaste}
        data-placeholder={placeholder || ''}
        style={{ border: '1.5px solid #E0DDD7', borderRadius: 8, padding: '10px 12px', minHeight, fontSize: 14, lineHeight: 1.7, color: '#000', outline: 'none', background: '#fff' }}
        dangerouslySetInnerHTML={{ __html: initial.current || '' }}
      />
    </div>
  );
}
