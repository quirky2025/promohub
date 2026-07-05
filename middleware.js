// middleware.js — 301/410 handling for legacy 404 URLs.
// Spec: outputs/REDIRECT_404_FIX_REQUEST.md (945 old 404s from GSC).
//
//  A. Deep legacy URLs  /category/<...>/<slug>  (3+ inner segments)
//       1. last segment is a published product  -> 301 /products/<slug>
//       2. any segment maps to a live url_pages  -> 301 to its canonical flat URL
//       3. nothing matches                        -> 410 Gone
//     Shallow /category/<x> and /category/<x>/<y> are left to next.config's
//     existing static redirects (we never touch them — avoids 301->410 regressions).
//  B. Ancient PHP URLs  /promo/...               -> 410 Gone
//  C. /site                                       -> 410 Gone
//
//  RED LINE: never blanket-redirect unmatched URLs to the homepage (soft-404).

import { NextResponse } from 'next/server';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function gone() {
  return new NextResponse('Gone — this page has been permanently removed.', {
    status: 410,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

async function supaGet(pathAndQuery) {
  if (!SUPA_URL || !SUPA_KEY) return null;
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/${pathAndQuery}`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Returns the slug if a published product with this slug exists, else null.
async function publishedProductSlug(slug) {
  const rows = await supaGet(
    `products?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=slug&limit=1`
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0].slug : null;
}

// Returns the canonical flat URL if this slug is a live url_pages entry, else null.
async function liveCategoryUrl(slug) {
  const rows = await supaGet(
    `url_pages?slug=eq.${encodeURIComponent(slug)}&status=eq.live&select=canonical_url&limit=1`
  );
  return (Array.isArray(rows) && rows[0] && rows[0].canonical_url) || null;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // B. Ancient PHP URLs -> 410
  if (pathname.startsWith('/promo/') || pathname.endsWith('.php')) {
    return gone();
  }

  // C. /site -> 410
  if (pathname === '/site') return gone();

  // A. Deep legacy /category/<...>/<slug> (3+ inner segments; shallow ones
  //    are handled by next.config static redirects, so we skip them here).
  if (pathname.startsWith('/category/')) {
    const inner = pathname.split('/').filter(Boolean).slice(1); // drop 'category'
    if (inner.length >= 3) {
      // 1. last segment = published product -> 301 to PDP
      const last = inner[inner.length - 1];
      if (last) {
        const slug = await publishedProductSlug(last);
        if (slug) {
          return NextResponse.redirect(new URL(`/products/${slug}`, req.url), 301);
        }
      }
      // 2. any segment maps to a live category -> 301 to canonical flat URL
      for (const seg of inner) {
        const canonical = await liveCategoryUrl(seg);
        if (canonical) {
          return NextResponse.redirect(new URL(canonical, req.url), 301);
        }
      }
      // 3. nothing matched -> 410
      return gone();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/category/:path*', '/promo/:path*', '/site'],
};
