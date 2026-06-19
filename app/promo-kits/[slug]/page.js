// /promo-kits/[slug] — curated scene landing pages (INDEXABLE).
// Light content: H1 + intro + kit template (must/optional) + budget + CTA to builder + disclaimer.
// Slot links validated against live url_pages — non-live slots render as plain text (SEO-safe).
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SCENES, getScene, SLOT_LABEL, SLOT_CANONICAL, KIT_DISCLAIMER, COLOUR_UI_COPY } from '@/lib/kits';
import { getLiveCanonicalMap } from '@/lib/urlPages';
import { absoluteUrl, SITE_URL } from '@/lib/siteUrl';

const NAVY = '#1B2A4A', GOLD = '#C9A96E', CREAM = '#F8F7F4', LINE = '#E0DDD7', MUTED = '#7A7570';
const serif = '"Cormorant Garamond", serif';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return SCENES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const scene = getScene(slug);
  if (!scene) return { title: 'Promo Kit Not Found | QuirkyPromo' };
  return {
    title: `${scene.name} — Custom Branded Kit | QuirkyPromo Australia`,
    description: `${scene.tagline} Build a ${scene.name.toLowerCase()} with transparent product pricing, flexible MOQ and Australia-wide delivery.`,
    alternates: { canonical: absoluteUrl(`/promo-kits/${scene.slug}`) },
    openGraph: { title: `${scene.name} | QuirkyPromo`, description: scene.tagline, url: absoluteUrl(`/promo-kits/${scene.slug}`), type: 'website' },
  };
}

function SlotRow({ slotKey, liveMap }) {
  const label = SLOT_LABEL[slotKey] || slotKey;
  const candidates = SLOT_CANONICAL[slotKey] || [];
  const liveSlug = candidates.find((s) => liveMap.has(s));
  return (
    <li style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
      <span aria-hidden style={{ color: GOLD, fontWeight: 700 }}>·</span>
      {liveSlug ? (
        <Link href={liveMap.get(liveSlug).canonical_url} style={{ color: NAVY, textDecoration: 'none', fontSize: 15.5, fontWeight: 600 }}>{label}</Link>
      ) : (
        <span style={{ color: '#3a3f45', fontSize: 15.5 }}>{label}</span>
      )}
    </li>
  );
}

export default async function ScenePage({ params }) {
  const { slug } = await params;
  const scene = getScene(slug);
  if (!scene) notFound();

  const slotSlugs = [...scene.must, ...scene.optional].flatMap((k) => SLOT_CANONICAL[k] || []);
  const liveMap = await getLiveCanonicalMap(slotSlugs);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Promo Kits', item: absoluteUrl('/promo-kits') },
        { '@type': 'ListItem', position: 3, name: scene.name, item: absoluteUrl(`/promo-kits/${scene.slug}`) },
      ] },
      { '@type': 'WebPage', name: scene.name, description: scene.tagline, url: absoluteUrl(`/promo-kits/${scene.slug}`) },
    ],
  };

  const builderHref = `/promo-kits?scene=${scene.slug}`;

  return (
    <main style={{ minHeight: '100vh', background: CREAM, color: '#1a1a1a' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" style={{ borderBottom: `1px solid ${LINE}`, background: '#fff' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '12px 24px', fontSize: 13, color: MUTED }}>
          <Link href="/" style={{ color: MUTED, textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/promo-kits" style={{ color: MUTED, textDecoration: 'none' }}>Promo Kits</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY }}>{scene.name}</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '44px 24px 36px' }}>
          <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }} aria-hidden>{scene.emoji}</div>
          <h1 style={{ fontFamily: serif, fontSize: 38, lineHeight: 1.1, color: NAVY, margin: 0, fontWeight: 600 }}>{scene.name}</h1>
          <p style={{ fontSize: 17, color: MUTED, maxWidth: 700, marginTop: 14, lineHeight: 1.6 }}>{scene.intro}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
            <Link href={builderHref} style={{ background: GOLD, color: NAVY, fontWeight: 700, padding: '13px 22px', borderRadius: 8, textDecoration: 'none', fontSize: 15 }}>Customise this kit →</Link>
            <Link href="/contact" style={{ border: `1.5px solid ${NAVY}`, color: NAVY, fontWeight: 700, padding: '13px 22px', borderRadius: 8, textDecoration: 'none', fontSize: 15 }}>Request a quote</Link>
          </div>
        </div>
      </section>

      {/* Template + budget */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '38px 24px 10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, padding: '24px 24px 18px' }}>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase' }}>Included in the kit</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}>
              {scene.must.map((k) => <SlotRow key={k} slotKey={k} liveMap={liveMap} />)}
            </ul>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, padding: '24px 24px 18px' }}>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase' }}>Popular add-ons</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}>
              {scene.optional.map((k) => <SlotRow key={k} slotKey={k} liveMap={liveMap} />)}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 24, background: NAVY, color: '#fff', borderRadius: 12, padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Typical budget</div>
            <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, marginTop: 4 }}>${scene.budget[0]}–${scene.budget[1]} <span style={{ fontSize: 15, color: '#cfd6e4', fontFamily: 'inherit' }}>per person · ex GST</span></div>
          </div>
          <Link href={builderHref} style={{ background: GOLD, color: NAVY, fontWeight: 700, padding: '13px 22px', borderRadius: 8, textDecoration: 'none', fontSize: 15 }}>Build &amp; estimate this kit →</Link>
        </div>
      </section>

      {/* Colour note */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '18px 24px 0' }}>
        <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{COLOUR_UI_COPY}</p>
      </section>

      {/* Other scenes */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '30px 24px' }}>
        <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 }}>Other kits by occasion</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SCENES.filter((s) => s.slug !== scene.slug).map((s) => (
            <Link key={s.slug} href={`/promo-kits/${s.slug}`} style={{ border: `1px solid ${LINE}`, background: '#fff', color: NAVY, padding: '9px 15px', borderRadius: 999, textDecoration: 'none', fontSize: 14 }}>{s.emoji} {s.name.replace(' Kit', '')}</Link>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ borderTop: `1px solid ${LINE}`, background: '#fff' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '20px 24px', color: MUTED, fontSize: 12.5, lineHeight: 1.6 }}>{KIT_DISCLAIMER}</div>
      </section>
    </main>
  );
}
