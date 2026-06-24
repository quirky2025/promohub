// lib/imageHost.js
// ── Centralised image hosting ──────────────────────────────────────────────
// All logo / artwork / mockup uploads and all thumbnail transforms go through
// THIS file. Today the provider is Cloudinary. When product photos move to
// Cloudflare later, change these two functions in ONE place — nothing else.
//
// IMPORTANT: logos / artwork / proofs MUST stay on a provider that can
// rasterise vector + PDF files (AI/EPS/PDF). Cloudflare Images cannot do that,
// so keep this pointing at Cloudinary for those. Product photos (raster) can be
// swapped to Cloudflare independently.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Upload a File (browser) → returns the hosted URL, or '' on failure.
export async function uploadImage(file) {
  if (!file) return '';
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );
  const data = await res.json();
  return data.secure_url || data.url || '';
}

// Turn a stored file URL into something an <img> can display.
// Vector / PDF files (AI/EPS/SVG/PDF) are rasterised to PNG (first page).
// Raster images and non-Cloudinary URLs pass through unchanged.
export function displayThumb(url) {
  if (!url || typeof url !== 'string') return url;
  if (!/\.(pdf|ai|eps|svg)(\?|$)/i.test(url)) return url;
  if (!url.includes('/upload/')) return url;
  return url
    .replace('/upload/', '/upload/pg_1,f_png/')
    .replace(/\.(pdf|ai|eps|svg)(\?|$)/i, '.png$2');
}
