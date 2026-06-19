// /promotional-products — colored category hub (INDEXABLE). Data-driven from live url_pages.
// Each card: pastel header with representative product images from that category's products,
// title, blurb, and subcategory links. SEO-safe: only links live canonical pages.
import Link from 'next/link';
import { getCategoryHubCards } from '@/lib/urlPages';
import { absoluteUrl, SITE_URL } from '@/lib/siteUrl';
import ProductImg from '@/components/ProductImg';

const NAVY = '#1B2A4A', GOLD = '#C9A96E', CREAM = '#F8F7F4', LINE = '#E0DDD7', MUTED = '#7A7570';
const serif = '"Cormorant Garamond", serif';

export const revalidate = 1800;

// Soft pastels, assigned by position and cycled (reference cycles a small set too).
const PASTELS = ['#E7EFE6', '#FBF0CE', '#FAE0E6', '#E9E4F5', '#FCE6D2', '#DEEDEC', '#E6ECF6', '#F3E7DA', '#EAF1DC', '#F6E5EF'];

const BLURBS = {
  'custom-bags-australia': 'Totes, backpacks and cooler bags — branded bags that carry your logo everywhere.',
  'custom-drinkware-australia': 'Bottles, cups and tumblers your audience reaches for every day.',
  'branded-pens-australia': "You've made it when your logo's on a pen — affordable branded pens by the box.",
  'custom-branded-apparel-australia': 'T-shirts, polos and hoodies — wearable branding for teams and events.',
  'corporate-tech-gifts-australia': 'Power banks, speakers and accessories that keep your brand switched on.',
  'outdoor-promotional-products-australia': 'Sun, sport and the outdoors — branded gear for team days and field events.',
  'custom-headwear-australia': 'Caps, beanies and bucket hats — logo-front and always on show.',
  'branded-office-supplies-australia': 'Notebooks, pens and desk essentials your clients actually use.',
  'branded-notebooks-australia': 'Branded notebooks and journals for conferences, staff and clients.',
};

export const metadata = {
  title: 'Promotional Products Australia | QuirkyPromo',
  description:
    'Browse every category of custom promotional products and branded merchandise in Australia — bags, drinkware, pens, apparel, tech, headwear, office and more. Add your logo with transparent pricing and flexible MOQ.',
  alternates: { canonical: absoluteUrl('/promotional-products') },
  openGraph: {
    title: 'Promotional Products Australia | QuirkyPromo',
    description: 'Browse every category of custom promotional products and branded merchandise in Australia.',
    url: absoluteUrl('/promotional-products'), type: 'website',
  },
};

const catHref = (p) => p.canonical_url || `/${p.slug}`;
const catName = (p) => p.nav_label || p.h1 || p.slug;
const blurbFor = (p) => BLURBS[p.slug] || `Add your logo to custom ${catName(p).toLowerCase()} — practical branded merch people keep.`;

export default async function PromotionalProductsPage() {
  const cards = await getCategoryHubCards(4, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Promotional Products', item: absoluteUrl('/promotional-products') },
      ] },
      { '@type': 'CollectionPage', name: 'Promotional Products Australia', url: absoluteUrl('/promotional-products') },
    ],
  };

  return (
    <main style={{ minHeight: '100vh', background: CREAM, color: '#1a1a1a' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" style={{ borderBottom: `1px solid ${LINE}`, background: '#fff' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '12px 24px', fontSize: 13, color: MUTED }}>
          <Link href="/" style={{ color: MUTED, textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY }}>Promotional Products</span>
        </div>
      </nav>

      <section style={{ background: '#fff', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '46px 24px 38px', textAlign: 'center' }}>
          <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 10 }}>Add your logo to anything</div>
          <h1 style={{ fontFamily: serif, fontSize: 42, lineHeight: 1.08, color: NAVY, margin: 0, fontWeight: 600 }}>Promotional Products Australia</h1>
          <p style={{ fontSize: 17, color: MUTED, maxWidth: 720, margin: '16px auto 0', lineHeight: 1.6 }}>
            Browse our full range of custom promotional products and branded merchandise by category — or <Link href="/promo-kits" style={{ color: NAVY, fontWeight: 600 }}>build a ready-made promo kit</Link>.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 16px' }}>
        {cards.length === 0 ? (
          <div style={{ padding: '40px 0', color: MUTED, textAlign: 'center' }}>Categories are being prepared. Please <Link href="/contact" style={{ color: NAVY }}>contact us</Link>.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
            {/* Promo tile */}
            <div style={{ background: NAVY, color: '#fff', borderRadius: 14, padding: '28px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 220 }}>
              <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 600, lineHeight: 1.15 }}>New products, added often</div>
              <div style={{ color: '#cfd6e4', fontSize: 14, lineHeight: 1.9, marginTop: 10 }}>Flexible MOQ<br/>Local stock options<br/>Australia-wide delivery</div>
              <Link href="/new-arrivals" style={{ alignSelf: 'flex-start', marginTop: 16, background: GOLD, color: NAVY, fontWeight: 700, padding: '11px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Shop new arrivals →</Link>
            </div>

            {cards.map((cat, i) => (
              <div key={cat.slug} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Link href={catHref(cat)} aria-label={catName(cat)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: PASTELS[i % PASTELS.length], minHeight: 180, padding: '18px 22px', textDecoration: 'none' }}>
                  {cat.images.length > 0 ? (
                    cat.images.map((src, j) => (
                      <ProductImg key={j} src={src} alt={catName(cat)} size="list" style={{ maxHeight: 130, maxWidth: `${100 / Math.min(cat.images.length, 3)}%`, objectFit: 'contain' }} />
                    ))
                  ) : (
                    <span style={{ fontFamily: serif, fontSize: 30, color: NAVY, fontWeight: 600 }}>{catName(cat)}</span>
                  )}
                </Link>
                <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h2 style={{ fontFamily: serif, fontSize: 23, color: NAVY, margin: 0, fontWeight: 600 }}>
                    <Link href={catHref(cat)} style={{ color: NAVY, textDecoration: 'none' }}>{catName(cat)}</Link>
                  </h2>
                  <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.55, margin: '8px 0 0' }}>{blurbFor(cat)}</p>
                  {cat.children.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
                      {cat.children.map((sub) => (
                        <Link key={sub.slug} href={catHref(sub)} style={{ color: '#3a3f45', textDecoration: 'none', fontSize: 13 }}>{catName(sub)}</Link>
                      ))}
                    </div>
                  )}
                  <Link href={catHref(cat)} style={{ marginTop: 'auto', paddingTop: 14, color: GOLD, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Shop {catName(cat)} →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ borderTop: `1px solid ${LINE}`, background: '#fff', marginTop: 28 }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px' }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, color: NAVY, margin: 0, fontWeight: 600 }}>Custom promotional products in Australia</h2>
          <div style={{ color: MUTED, fontSize: 14.5, lineHeight: 1.75, marginTop: 12 }}>
            <p style={{ margin: 0 }}>QuirkyPromo supplies promotional products, branded merchandise and corporate gifts to Australian businesses of every size. Browse by category to compare options by colour, price, minimum order quantity, material and branding method.</p>
            <p style={{ marginTop: 11 }}>Many products are available from Australian inventory with local decoration and Australia-wide delivery. For event packs and staff gifts, our <Link href="/promo-kits" style={{ color: NAVY, fontWeight: 600 }}>promo kits</Link> bundle the essentials by occasion.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
