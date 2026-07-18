// Homepage V1 — server component (SSR + SEO). Global Nav/Footer from layout.js.
// Discovery hub + Kit entry + line-draw hero. See HOMEPAGE.md.
import { supabase } from '@/lib/supabase';
import HomeCarousel from '@/components/HomeCarousel';
import { getFirstImage, getLowestPrice } from '@/lib/urlPages';
import ProductImg from '@/components/ProductImg';
const NAVY = '#1B2A4A', GOLD = '#C9A96E', GOLD_DK = '#B2925A', CREAM = '#ffffff', LINE = '#E0DDD7', MUTED = '#000000';
const SITE = 'https://www.quirkypromo.com.au';
const serif = '"Cormorant Garamond", serif';

export const metadata = {
  title: 'Promotional Products & Corporate Gifts Australia | QuirkyPromo',
  description: 'Browse custom promotional products in Australia by category, colour, MOQ, price and branding option. Compare bags, drinkware, pens, apparel and more.',
  alternates: { canonical: SITE + '/' },
  openGraph: { title: 'Promotional Products & Corporate Gifts Australia | QuirkyPromo', description: 'Custom promotional products, branded merchandise and corporate gifts — transparent pricing, flexible MOQ, Australia-wide delivery.', url: SITE + '/', type: 'website' },
};

const CATEGORIES = [
  ['Bags', '/custom-bags-australia', '/categories/BAGS.jpg'], ['Drinkware', '/custom-drinkware-australia', '/categories/drinkware.jpg'],
  ['Pens', '/branded-pens-australia', '/categories/PENS.jpg'], ['Apparel', '/custom-branded-apparel-australia', '/categories/APPAREL.jpg'],
  ['Tech', '/corporate-tech-gifts-australia', '/categories/TECHNOLOGY.jpg'], ['Outdoor & Sports', '/outdoor-promotional-products-australia', '/categories/OUTDOOR.jpg'],
  ['Headwear', '/custom-headwear-australia', '/categories/HEADWARE.jpg'], ['Office & Stationery', '/branded-office-supplies-australia', '/categories/BUSINESS.jpg'],
];
const BRANDS_SHOP = [
  ['Moleskine', '/brands/moleskine', '/brands/moleskine.svg'],
  ['Swiss Peak', '/brands/swiss-peak', '/brands/swiss-peak.jpg'],
  ['Pierre Cardin', '/brands/pierre-cardin', '/brands/pierre-cardin.jpg'],
  ['CamelBak', '/brands/camelbak', '/brands/camelbak.svg'],
];
const HELP = [
  ['Prices shown ex GST', 'Item price only'], ['Local stock options', 'Stock confirmed before order'],
  ['Branding options available', 'Print, embroidery, engraving'], ['Artwork approval before production', 'You sign off first'],
];
const TESTIMONIALS = [
  { quote: 'The merchandise provided was of high quality, beautifully branded, and very competitively priced. The attention to detail in the presentation and finish of the products was excellent, and the final items reflected positively on our organisation.', name: 'Ian Westmoreland OAM', role: 'CEO, Kintsugi Heroes' },
  { quote: 'I have worked with Lily for many years and she has been such a great help with sourcing very custom and unique products for us. From sample, arranging freight and all the in-betweens, Lily has ensured everything is always perfect!', name: 'Jenny', role: 'Founder' },
  { quote: 'We have used Lily and the Quirky team for several years now for our promotional and offshore product sourcing. She always does her best to find the right solution at the right price and on deadline, and handles the whole import and customs process with ease.', name: 'Matt', role: 'Account Manager' },
  { quote: 'Hornsby Mazda always receives fantastic service from Lily. She is very quick, efficient, and professional with every order we place. We are consistently impressed by her attention to detail and responsiveness.', name: 'Adam', role: 'Retail Sales Manager, Hornsby Mazda' },
];
// Trusted-by logos: static files in public/logos/ (off Cloudinary). Each sits in a
// fixed box so all logos render at a similar visual size regardless of aspect ratio.
const BRANDS = [
  ['Netflix', '/logos/Netflix.svg'], ['Mazda', '/logos/mazda.svg'],
  ['Foxtel', '/logos/foxtel.svg'], ['Ultra Violette', '/logos/UV.svg'],
  ['Northern Beaches Council', '/logos/logo-nbc.svg'], ['Hyegrove Willoughby', '/logos/Hyegrove_Willoughby.svg'],
  ['Barker College', '/logos/barker.svg'], ['ACRF', '/logos/ACRF.svg'],
  ['CMDA', '/logos/CMDAHorizontal.svg'], ['IGNITE', '/logos/IGNITE.svg'],
  ['NCL', '/logos/NCL.svg'],
];
const jsonLd = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'Organization', '@id': SITE + '/#org', name: 'QuirkyPromo', url: SITE, description: 'Custom promotional products, branded merchandise and corporate gifts in Australia.' },
  { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE, name: 'QuirkyPromo', publisher: { '@id': SITE + '/#org' }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: SITE + '/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } },
] };

const wrap = { maxWidth: 1180, margin: '0 auto', padding: '0 28px' };
const h2 = { fontFamily: serif, fontWeight: 700, color: NAVY, fontSize: 32, letterSpacing: '-.3px', margin: 0 };
const subTxt = { color: MUTED, fontSize: 14, marginTop: 4 };
const card = { background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 18, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 9, minHeight: 120 };
const btn = (bg, color, brd) => ({ display: 'inline-flex', alignItems: 'center', gap: 8, background: bg, color, fontWeight: 600, fontSize: 15, padding: '14px 26px', borderRadius: 8, textDecoration: 'none', border: `1.5px solid ${brd || 'transparent'}` });

export const revalidate = 600;

// Homepage "New arrivals" is now AUTOMATIC: it shows the 4 most recently added
// products that are ticked "✨ New Arrival" in admin → Products (is_new_arrival)
// and published. Tick/untick in admin — no code change needed.
async function getNewArrivals() {
  const cols = 'id, name, slug, product_colours(images, sort_order), pricing_tiers(min_qty, base_price)';
  try {
    let { data, error } = await supabase
      .from('products')
      .select(cols)
      .eq('is_new_arrival', true)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(4);
    // Fallback if this table has no created_at column — still show 4.
    if (error) {
      ({ data, error } = await supabase
        .from('products')
        .select(cols)
        .eq('is_new_arrival', true)
        .eq('is_published', true)
        .limit(4));
    }
    return (!error && data) ? data : [];
  } catch (e) { return []; }
}

export default async function Home() {
  const newArrivals = await getNewArrivals();
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section style={{ background: CREAM, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ ...wrap, textAlign: 'center', paddingTop: 56, paddingBottom: 50, maxWidth: 880 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD_DK, marginBottom: 14 }}>Australia-wide · transparent pricing · flexible MOQ</div>
          <h1 style={{ fontFamily: serif, fontWeight: 700, color: NAVY, fontSize: 44, lineHeight: 1.08, letterSpacing: '-.5px', margin: 0 }}>Promotional Products, Branded Merchandise &amp; Corporate Gifts Australia</h1>
          <p style={{ fontSize: 17.5, color: MUTED, margin: '16px auto 24px', maxWidth: 600 }}>Create branded products and corporate gifts with transparent pricing, flexible MOQ and Australia-wide delivery.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/promotional-products" style={btn(GOLD, NAVY)}>Browse products</a>
          </div>
          <div style={{ marginTop: 30 }}>
            <img src="/hero-products.png" alt="Navy branded promotional products — cap, t-shirt, drink bottle, notebook, tote bag and pen, each with your logo" style={{ width: '100%', maxWidth: 1000, height: 'auto', display: 'block', margin: '0 auto' }} />
          </div>
        </div>
      </section>

      {/* PROMO CAROUSEL — slides managed in admin → Catalog → Banners → 首页轮播.
          Renders nothing until at least one slide is added. */}
      <HomeCarousel />

      {/* TRUST STRIP */}
      <section style={{ background: NAVY, padding: '44px 0' }}>
        <div style={{ ...wrap, textAlign: 'center' }}>
          <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, color: '#ffffff', letterSpacing: '-.3px' }}>Easy. Fast. Transparent. Custom.</div>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 15, maxWidth: 660, margin: '8px auto 0' }}>Australian-stocked options, local decoration, clear product pricing and flexible order quantities for businesses of every size.</p>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section id="cats" style={{ padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={{ ...h2, textAlign: 'center' }}>Shop by category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 26 }}>
            {CATEGORIES.map(([name, href, img]) => (
              <a key={href} href={href} style={{ display: 'block', border: `1px solid ${LINE}`, borderRadius: 12, overflow: 'hidden', textDecoration: 'none', background: '#fff' }}>
                <span style={{ display: 'block', aspectRatio: '1 / 1', overflow: 'hidden', background: CREAM }}>
                  <img src={img} alt={name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </span>
                <span style={{ display: 'block', padding: '13px 15px', fontSize: 15, fontWeight: 600, color: NAVY }}>{name}</span>
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <a href="/promotional-products" style={btn('transparent', NAVY, NAVY)}>View all categories →</a>
          </div>
        </div>
      </section>

      {/* SHOP BY BRAND */}
      <section style={{ background: CREAM, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={{ ...h2, textAlign: 'center' }}>Shop by brand</h2>
          <p style={{ ...subTxt, textAlign: 'center' }}>Trusted brands, available for custom branding.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 22 }}>
            {BRANDS_SHOP.map(([name, href, img]) => (
              <a key={href} href={href} aria-label={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, padding: '26px 20px', minHeight: 96, textDecoration: 'none' }}>
                <img src={img} alt={name} loading="lazy" decoding="async" style={{ maxWidth: '78%', maxHeight: 44, objectFit: 'contain', display: 'block' }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
      <section style={{ padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={{ ...h2, textAlign: 'center' }}>New arrivals</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 26 }}>
            {newArrivals.map((p) => {
              const price = getLowestPrice(p);
              return (
                <a key={p.id} href={`/products/${p.slug}`} style={{ display: 'block', border: `1px solid ${LINE}`, borderRadius: 12, overflow: 'hidden', textDecoration: 'none', background: '#fff' }}>
                  <span style={{ display: 'block', aspectRatio: '1 / 1', overflow: 'hidden', background: '#fff' }}>
                    <ProductImg src={getFirstImage(p)} alt={p.name} size="list" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 10, boxSizing: 'border-box' }} />
                  </span>
                  <span style={{ display: 'block', padding: '12px 14px 14px' }}>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: NAVY, lineHeight: 1.3 }}>{p.name}</span>
                    {price > 0 && <span style={{ display: 'block', fontSize: 13, color: MUTED, marginTop: 5 }}>from ${price.toFixed(2)}</span>}
                  </span>
                </a>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <a href="/new-arrivals" style={btn('transparent', NAVY, NAVY)}>View all new arrivals →</a>
          </div>
        </div>
      </section>
      )}

      {/* BUYING HELP */}
      <section style={{ padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={{ ...h2, textAlign: 'center' }}>How ordering works</h2>
          <style>{`@media (max-width: 768px){ .qp-home-steps{ grid-template-columns: 1fr 1fr !important; } .qp-home-testi{ grid-template-columns: 1fr !important; } }`}</style>
          <div className="qp-home-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 26 }}>
            {HELP.map(([t, s]) => (<div key={t} style={{ textAlign: 'center' }}><h4 style={{ fontSize: 14, color: NAVY, fontWeight: 600, margin: 0 }}>{t}</h4><p style={{ fontSize: 12.5, color: MUTED, margin: '4px 0 0' }}>{s}</p></div>))}
          </div>
        </div>
      </section>

      {/* WHAT OUR CLIENTS SAY */}
      <section style={{ background: NAVY, color: '#fff', textAlign: 'center', padding: '56px 0' }}>
        <div style={wrap}>
          <h2 style={{ fontFamily: serif, fontSize: 34, fontWeight: 700, color: '#fff', margin: 0 }}>What our clients say</h2>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, marginTop: 4 }}>Trusted by leading Australian organisations</div>
          <div className="qp-home-testi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26, marginTop: 38 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name}>
                <div style={{ color: GOLD, letterSpacing: 3, fontSize: 14 }}>★★★★★</div>
                <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: 'rgba(255,255,255,.92)', lineHeight: 1.5, margin: '14px 0 18px' }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: '#fff' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section style={{ textAlign: 'center', padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, color: NAVY, margin: 0 }}>Trusted by leading Australian brands</h2>
          <div style={{ color: MUTED, fontSize: 14, marginTop: 4 }}>From ASX-listed companies to government departments and fast-growing startups</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center', alignItems: 'center', marginTop: 34 }}>
            {BRANDS.map(([name, src]) => (
              <span key={name} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 150, height: 46 }}>
                <img src={src} alt={name} loading="lazy" decoding="async" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: .8 }} />
              </span>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 26 }}>+ many more Australian businesses, government departments, and education institutions</div>
        </div>
      </section>

      {/* SEO COPY */}
      <section style={{ background: CREAM, borderTop: `1px solid ${LINE}`, padding: '42px 0' }}>
        <div style={{ ...wrap, maxWidth: 920 }}>
          <h2 style={{ ...h2, fontSize: 24 }}>Promotional products &amp; corporate gifts in Australia</h2>
          <div style={{ color: MUTED, fontSize: 14, lineHeight: 1.75, marginTop: 12 }}>
            <p style={{ margin: 0 }}>Quirky Promo helps Australian businesses create promotional products, branded merchandise and corporate gifts that are practical, memorable and easy to order.</p>
            <p style={{ marginTop: 11 }}>Browse thousands of products including drink bottles, coffee cups, tote bags, apparel, notebooks, technology accessories, conference giveaways and staff gifts. Many products are available from Australian inventory with local decoration, flexible minimum order quantities and Australia-wide delivery.</p>
            <p style={{ marginTop: 11 }}>For larger or more unique projects, our Custom Made &amp; Global Sourcing service supports bespoke merchandise, retail-quality packaging, OEM manufacturing and large-scale sourcing. From trade shows and conferences to employee onboarding, client gifts and marketing campaigns, we help organisations build stronger brand connections through products people genuinely use and keep.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
