// Homepage V1 — server component (SSR + SEO). Global Nav/Footer come from layout.js.
// Discovery hub + SEO weight + Kit conversion. See HOMEPAGE.md.
import HomeKitPicker from '@/components/HomeKitPicker';

const NAVY = '#1B2A4A', GOLD = '#C9A96E', GOLD_DK = '#B2925A', CREAM = '#F8F7F4', LINE = '#E0DDD7', MUTED = '#7A7570';
const SITE = 'https://www.quirkypromo.com.au';
const serif = '"Cormorant Garamond", serif';

export const metadata = {
  title: 'Promotional Products & Corporate Gifts Australia | QuirkyPromo',
  description: 'Browse custom promotional products in Australia by category, colour, MOQ, price and branding option. Compare bags, drinkware, pens, apparel and more.',
  alternates: { canonical: SITE + '/' },
  openGraph: {
    title: 'Promotional Products & Corporate Gifts Australia | QuirkyPromo',
    description: 'Custom promotional products, branded merchandise and corporate gifts — transparent pricing, flexible MOQ, Australia-wide delivery.',
    url: SITE + '/', type: 'website',
  },
};

const CATEGORIES = [
  ['Bags', '/custom-bags-australia', '👜'], ['Drinkware', '/custom-drinkware-australia', '🥤'],
  ['Pens', '/branded-pens-australia', '🖊️'], ['Apparel', '/custom-branded-apparel-australia', '👕'],
  ['Tech', '/corporate-tech-gifts-australia', '💻'], ['Outdoor & Sports', '/outdoor-promotional-products-australia', '⚽'],
  ['Headwear', '/custom-headwear-australia', '🧢'], ['Office & Stationery', '/branded-office-supplies-australia', '📓'],
];
const POPULAR = [
  ['Tote Bags', '/custom-tote-bags-australia'], ['Drink Bottles', '/custom-drink-bottles-australia'],
  ['Cooler Bags', '/custom-cooler-bags-australia'], ['Pens', '/branded-pens-australia'],
  ['Notebooks', '/branded-notebooks-australia'], ['Caps', '/custom-caps-australia'],
  ['T-Shirts', '/custom-t-shirts-australia'], ['Umbrellas', '/custom-umbrellas-australia'],
];
const HELP = [
  ['Prices shown ex GST', 'Item price only'], ['Branding options available', 'Print, embroidery, engraving'],
  ['Artwork approval before production', 'You sign off first'], ['Request a quote for custom orders', 'We come back fast'],
];
const TESTIMONIALS = [
  { quote: 'The merchandise provided was of high quality, beautifully branded, and very competitively priced. The attention to detail in the presentation and finish of the products was excellent, and the final items reflected positively on our organisation.', name: 'Ian Westmoreland OAM', role: 'CEO, Kintsugi Heroes' },
  { quote: 'I have worked with Lily for many years and she has been such a great help with sourcing very custom and unique products for us. From sample, arranging freight and all the in-betweens, Lily has ensured everything is always perfect!', name: 'Jenny', role: 'Founder' },
  { quote: 'We have used Lily and the Quirky team for several years now for our promotional and offshore product sourcing. She always does her best to find the right solution at the right price and on deadline, and handles the whole import and customs process with ease.', name: 'Matt', role: 'Account Manager' },
  { quote: 'Hornsby Mazda always receives fantastic service from Lily. She is very quick, efficient, and professional with every order we place. We are consistently impressed by her attention to detail and responsiveness.', name: 'Adam', role: 'Retail Sales Manager, Hornsby Mazda' },
];
const CLOUD = 'https://res.cloudinary.com/dyz9r0fm7/image/upload/h_88';
const BRANDS = [
  ['NSW Government', '/v1780103113/nsw-gov-logo_tfwp9l.png'], ['Kintsugi Heroes', '/v1780103111/KintsugiHeroes_Primary_black_cmmnoe.png'],
  ['Ultra Violette', '/v1780102503/UV_Master_Logo_440x_-_Copy_ofyma5.svg'], ['Netflix', '/v1780102502/Netflix_Logo_PMS_copy_kgit7s.svg'],
  ['Mazda', '/v1780102501/mazda_lvip9m.svg'], ['Hyegrove Willoughby', '/v1780102498/Hyegrove_Willoughby_Logo_sv8z7n.svg'],
  ['Foxtel', '/v1780102498/foxtel-logo-2020_-_Copy_-_Copy_pwfskq.svg'], ['Barker College', '/v1780102496/barker-logo-tagline-red_s5paps.svg'],
];

const jsonLd = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': SITE + '/#org', name: 'QuirkyPromo', url: SITE,
      description: 'Custom promotional products, branded merchandise and corporate gifts in Australia.' },
    { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE, name: 'QuirkyPromo', publisher: { '@id': SITE + '/#org' },
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: SITE + '/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } },
  ],
};

const wrap = { maxWidth: 1180, margin: '0 auto', padding: '0 28px' };
const h2 = { fontFamily: serif, fontWeight: 700, color: NAVY, fontSize: 32, letterSpacing: '-.3px', margin: 0 };
const subTxt = { color: MUTED, fontSize: 14, marginTop: 4 };
const card = { background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 18, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 9, minHeight: 120 };

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section style={{ background: CREAM, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ ...wrap, textAlign: 'center', maxWidth: 780, paddingTop: 54, paddingBottom: 48 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD_DK, marginBottom: 15 }}>Australia-wide · transparent pricing · flexible MOQ</div>
          <h1 style={{ fontFamily: serif, fontWeight: 700, color: NAVY, fontSize: 46, lineHeight: 1.08, letterSpacing: '-.5px', margin: 0 }}>Promotional Products, Branded Merchandise &amp; Corporate Gifts Australia</h1>
          <p style={{ fontSize: 17.5, color: MUTED, margin: '16px auto 24px', maxWidth: 580 }}>Create branded products, promo kits and corporate gifts with transparent pricing, flexible MOQ and Australia-wide delivery.</p>
          <form action="/search" method="get" style={{ display: 'flex', gap: 10, maxWidth: 560, margin: '0 auto 14px' }}>
            <input name="q" placeholder="Search products, categories or brands..." style={{ flex: 1, height: 50, border: `1.5px solid ${LINE}`, borderRadius: 10, padding: '0 18px', fontSize: 16, fontFamily: 'inherit', background: '#fff' }} />
            <button style={{ height: 50, padding: '0 24px', background: GOLD, color: NAVY, fontWeight: 600, fontSize: 14.5, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Search</button>
          </form>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 }}>
            <a href="#cats" style={btn(GOLD, NAVY)}>Browse products</a>
            <a href="#kit" style={btnGhost()}>Build a promo kit</a>
            <a href="/contact" style={btnGhost()}>Request a quote</a>
          </div>
        </div>
      </section>

      {/* BUILD A PROMO KIT */}
      <section id="kit" style={{ background: '#fff' }}>
        <div style={{ ...wrap, padding: '52px 28px' }}>
          <h2 style={h2}>Build a promo kit — shop kits by occasion</h2>
          <p style={subTxt}>Pick a scene, we pre-fill a recommended kit — then tune quantity, budget, timing and products.</p>
          <HomeKitPicker />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ padding: '42px 0' }}>
        <div style={{ ...wrap, textAlign: 'center' }}>
          <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, color: NAVY, letterSpacing: '-.3px' }}>Easy. Fast. Transparent. Custom.</div>
          <p style={{ color: MUTED, fontSize: 15, maxWidth: 660, margin: '8px auto 0' }}>Australian-stocked options, local decoration, clear product pricing and flexible order quantities for businesses of every size.</p>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section id="cats" style={{ background: CREAM, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={h2}>Shop by category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 26 }}>
            {CATEGORIES.map(([name, href, e]) => (
              <a key={href} href={href} style={card}>
                <span style={{ width: 42, height: 42, borderRadius: 11, background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21 }}>{e}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>{name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section style={{ padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={h2}>Shop popular products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 13, marginTop: 26 }}>
            {POPULAR.map(([name, href]) => (
              <a key={href} href={href} style={{ ...card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 0, padding: '14px 17px', fontWeight: 600, fontSize: 15, color: NAVY }}>
                {name} <span style={{ color: GOLD_DK }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BUYING HELP */}
      <section style={{ background: CREAM, borderTop: `1px solid ${LINE}`, padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={h2}>Buying help</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 22 }}>
            {HELP.map(([t, s]) => (
              <div key={t}><h4 style={{ fontSize: 14, color: NAVY, fontWeight: 600, margin: 0 }}>{t}</h4><p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>{s}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT OUR CLIENTS SAY */}
      <section style={{ background: NAVY, color: '#fff', textAlign: 'center', padding: '56px 0' }}>
        <div style={wrap}>
          <h2 style={{ fontFamily: serif, fontSize: 34, fontWeight: 700, color: '#fff', margin: 0 }}>What our clients say</h2>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, marginTop: 4 }}>Trusted by leading Australian organisations</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26, marginTop: 38 }}>
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

      {/* TRUSTED BY BRANDS */}
      <section style={{ textAlign: 'center', padding: '52px 0' }}>
        <div style={wrap}>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, color: NAVY, margin: 0 }}>Trusted by leading Australian brands</h2>
          <div style={{ color: MUTED, fontSize: 14, marginTop: 4 }}>From ASX-listed companies to government departments and fast-growing startups</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center', alignItems: 'center', marginTop: 34 }}>
            {BRANDS.map(([name, src]) => (
              <img key={name} src={CLOUD + src} alt={name} style={{ height: 38, opacity: .75, objectFit: 'contain' }} />
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
            <p style={{ marginTop: 11 }}>Browse thousands of products including drink bottles, coffee cups, tote bags, apparel, notebooks, technology accessories, conference giveaways and staff welcome kits. Many products are available from Australian inventory with local decoration, flexible minimum order quantities and Australia-wide delivery.</p>
            <p style={{ marginTop: 11 }}>For larger or more unique projects, our Custom Made &amp; Global Sourcing service supports bespoke merchandise, retail-quality packaging, OEM manufacturing and large-scale sourcing. From trade shows and conferences to employee onboarding, client gifts and marketing campaigns, we help organisations build stronger brand connections through products people genuinely use and keep.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function btn(bg, color) { return { display: 'inline-flex', alignItems: 'center', gap: 8, background: bg, color, fontWeight: 600, fontSize: 15, padding: '13px 22px', borderRadius: 8, textDecoration: 'none', border: '1.5px solid transparent' }; }
function btnGhost() { return { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: NAVY, fontWeight: 600, fontSize: 15, padding: '13px 22px', borderRadius: 8, textDecoration: 'none', border: `1.5px solid ${NAVY}` }; }
