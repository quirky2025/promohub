// lib/cmsHtml.js — shared CMS HTML helpers (page editor + blog).
// Server-side sanitiser + structured-blocks → HTML compiler.

export function sanitizeHtml(html) {
  let s = String(html || '');
  s = s.replace(/<\/(?:script|style|iframe|object|embed)>/gi, '');
  s = s.replace(/<(?:script|style|iframe|object|embed)[^>]*>/gi, '');
  s = s.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  s = s.replace(/\sstyle\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');
  s = s.replace(/javascript\s*:/gi, '');
  return s;
}

export function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// blocks: [{ level:'h2'|'h3'|'raw', heading, html, image_url, image_alt }]
export function compileBlocks(blocks) {
  const parts = [];
  for (const b of blocks || []) {
    if (!b) continue;
    if (b.level === 'raw') {
      if (b.html && String(b.html).trim()) parts.push(sanitizeHtml(b.html));
      continue;
    }
    const tag = b.level === 'h3' ? 'h3' : 'h2';
    if (b.heading && String(b.heading).trim()) parts.push(`<${tag}>${escapeHtml(b.heading)}</${tag}>`);
    if (b.image_url) parts.push(`<p><img src="${escapeHtml(b.image_url)}" alt="${escapeHtml(b.image_alt || '')}" style="max-width:100%;border-radius:8px" /></p>`);
    if (b.html && String(b.html).trim()) parts.push(sanitizeHtml(b.html));
  }
  return parts.join('\n');
}

// Give every <h2> an id and return [{ id, text }] — used for the blog TOC.
export function addHeadingIds(html) {
  const toc = [];
  let i = 0;
  const out = String(html || '').replace(/<h2>([\s\S]*?)<\/h2>/gi, (m, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id = `s-${++i}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || i}`;
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}
