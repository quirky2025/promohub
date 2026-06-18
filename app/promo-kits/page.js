// /promo-kits — hub (INDEXABLE) + Kit Builder. When builder params are present
// (?scene/?qty/?budget/?colour) the result is noindex (PROMO_KITS.md SEO rule).
import Link from 'next/link';
import { Suspense } from 'react';
import KitBuilder from '@/components/KitBuilder';
import { SCENES, PALETTE, KIT_DISCLAIMER } from '@/lib/kits';
import { absoluteUrl, SITE_URL } from '@/lib/siteUrl';

const NAVY = '#1B2A4A', GOLD = '#C9A96E', CREAM = '#F8F7F4', LINE = '#E0DDD7', MUTED = '#7A7570';
const serif = '"Cormorant Garamond", serif';

export const dynamic = 'force-dynamic';

const BUILDER_PARAMS = ['scene', 'qty', 'budget', 'colour'];

export async function generateMetadata({ searchParams }) {
  const sp = (await searchParams) || {};
  const isResult = BUILDER_PARAMS.some((k) => sp[k] != null && sp[k] !== '');
  return {
    title: 'Build a Promo Kit — Branded Kits by Occasion | QuirkyPromo Australia',
    description:
      'Build a custom branded promo kit for staff onboarding, trade shows, conferences, client gifts and more. Choose a scene, colour, quantity and budget — transparent pricing, flexible MOQ, Australia-wide delivery.',
    alternates: { canonical: absoluteUrl('/promo-kits') },
    robots: isResult ? { index: false, follow: true } : undefined,
    openGraph: { title: 'Build a Promo Kit | QuirkyPromo', description: 'Custom branded promo kits by occasion — choose a scene, colour, quantity and budget.', url: absoluteUrl('/promo-kits'), type: 'website' },
  };
}

export default function PromoKitsHub() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Promo Kits', item: absoluteUrl('/promo-kits') },
      ] },
      { '@type': 'CollectionPage', name: 'Promo Kits by Occasion', url: absoluteUrl('/promo-kits'),
        hasPart: SCENES.map((s) => ({ '@type': 'WebPage', name: s.name, url: absoluteUrl(`/promo-kits/${s.slug}`) })) },
    ],
  };

  return (
    <main style={{ minHeight: '100vh', background: CREAM, color: '#1a1a1a' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" style={{ borderBottom: `1px solid ${LINE}`, background: '#fff' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '12px 24px', fontSize: 13, color: MUTED }}>
          <Link href="/" style={{ color: MUTED, textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY }}>Promo Kits</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '46px 24px 38px' }}>
          <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 10 }}>Build a promo kit</div>
          <h1 style={{ fontFamily: serif, fontSize: 41, lineHeight: 1.08, color: NAVY, margin: 0, fontWeight: 600, maxWidth: 760 }}>Branded promo kits for your event, team or campaign</h1>
          <p style={{ fontSize: 17, color: MUTED, maxWidth: 720, marginTop: 16, lineHeight: 1.6 }}>
            Pick a ready-made kit by occasion, choose your colour theme, quantity and budget, and we'll prepare a quote. Every kit is fully brandable with your logo — transparent product pricing, flexible minimum order quantities and Australia-wide delivery.
          </p>
        </div>
      </section>

      {/* Scene cards */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '38px 24px 8px' }}>
        <h2 style={{ fontFamily: serif, fontSize: 28, color: NAVY, margin: '0 0 18px', fontWeight: 600 }}>Shop kits by occasion</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {SCENES.map((s) => (
            <Link key={s.slug} href={`/promo-kits/${s.slug}`} style={{ display: 'block', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, padding: '20px 20px 18px', textDecoration: 'none' }}>
              <div style={{ fontSize: 30, lineHeight: 1 }} aria-hidden>{s.emoji}</div>
              <div style={{ fontFamily: serif, fontSize: 21, color: NAVY, fontWeight: 600, marginTop: 10 }}>{s.name.replace(' Kit', '')}</div>
              <div style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.5, marginTop: 7 }}>{s.tagline}</div>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: 13, marginTop: 12 }}>${s.budget[0]}–${s.budget[1]} pp · View kit →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Builder */}
      <section id="builder" style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 12px' }}>
        <h2 style={{ fontFamily: serif, fontSize: 28, color: NAVY, margin: '0 0 6px', fontWeight: 600 }}>Build your own kit</h2>
        <p style={{ color: MUTED, fontSize: 15, margin: '0 0 22px', maxWidth: 680, lineHeight: 1.55 }}>Six quick steps. Adjust the scene, colour, quantity, budget, products and timing — the estimate updates as you go.</p>
        <Suspense fallback={<div style={{ color: MUTED, padding: '20px 0' }}>Loading builder…</div>}>
          <KitBuilder />
        </Suspense>
      </section>

      {/* Colour palette note */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ color: MUTED, fontSize: 13 }}>Kit colour themes:</span>
          {PALETTE.map((p) => (
            <span key={p.key} title={p.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#3a3f45' }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: p.swatch, border: '1px solid rgba(0,0,0,.15)' }} />{p.label}
            </span>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ borderTop: `1px solid ${LINE}`, background: '#fff', marginTop: 26 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 24px', color: MUTED, fontSize: 12.5, lineHeight: 1.6 }}>{KIT_DISCLAIMER}</div>
      </section>
    </main>
  );
}
