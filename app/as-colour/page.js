// app/as-colour/page.js — AS Colour brand Range hub (calculator products live here,
// not in the global TRENDS category pages). Hero + subcategory pills that link to
// per-type sub-pages (/as-colour/<type>), which carry the left filter + product grid.
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import QuoteButton from '@/components/QuoteButton';

export const revalidate = 3600;

export const metadata = {
  title: 'AS Colour Custom Apparel — Printed to Order | QuirkyPromo',
  description:
    'Custom-printed AS Colour apparel, bags and headwear. Screen print, DTG, DTF or embroidery, min 20. Free digital proof before production.',
  alternates: { canonical: '/as-colour' },
};

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const FONT = '"DM Sans", sans-serif';
const CAT_ORDER = ['Apparel', 'Bags', 'Headwear'];

const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

async function getRangeProducts(supplier) {
  const { data, error } = await supabase
    .from('products')
    .select('id, category, subcategory')
    .eq('supplier', supplier)
    .eq('is_published', true)
    .limit(1000);
  if (error) {
    console.error('[as-colour range] query failed', error);
    return [];
  }
  return data || [];
}

function groupByType(products) {
  const groups = {};
  for (const p of products) {
    const cat = p.category || 'Other';
    const sub = p.subcategory || 'Other';
    (groups[cat] ||= {});
    (groups[cat][sub] ||= 0);
    groups[cat][sub] += 1;
  }
  return groups;
}

function orderedCats(groups) {
  return [
    ...CAT_ORDER.filter((c) => groups[c]),
    ...Object.keys(groups).filter((c) => !CAT_ORDER.includes(c)),
  ];
}

// Subcategory nav = compact pill button (clearly navigation, not a product card).
function SubcatPill({ sub, count }) {
  return (
    <Link href={`/as-colour/${slugify(sub)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '999px', border: '1.5px solid #E0DDD7', background: '#fff', color: '#1a1a1a', fontSize: '14px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
      {sub}
      <span style={{ color: '#1a1a1a', fontWeight: 400, fontSize: '12px' }}>{count}</span>
    </Link>
  );
}

export default async function ASColourRangePage() {
  const products = await getRangeProducts('AS Colour');
  const groups = groupByType(products);
  const cats = orderedCats(groups);

  return (
    <div style={{ fontFamily: FONT, background: '#fff', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#1a1a1a' }}>
          <Link href="/" style={{ color: '#1a1a1a', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>AS Colour Range</span>
        </div>
      </div>

      {/* Hero — matches FRONTEND_STYLE_GUIDE §4 list-page hero (padding 54px 40px 58px) */}
      <section style={{ background: NAVY, padding: '54px 40px 58px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', padding: '5px 13px', borderRadius: '20px', marginBottom: '18px' }}>
              AS Colour Range
            </div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', lineHeight: 1.08, color: '#fff', fontWeight: 600, margin: '0 0 16px' }}>
              AS Colour Custom Apparel
            </h1>
            <p style={{ color: 'rgba(255,255,255,.76)', fontSize: '16px', lineHeight: 1.75, margin: '0 0 22px', maxWidth: '780px' }}>
              Premium blanks, printed to order — tees, hoodies, bags and headwear with your logo. Screen print, DTG, DTF or embroidery. Minimum 20, free digital proof before production.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <QuoteButton label="Request a Quote" source="as-colour-range" style={{ background: GOLD, color: '#fff', padding: '12px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }} />
              <span style={{ color: 'rgba(255,255,255,.65)', fontSize: '13px' }}>{products.length} products</span>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 80px' }}>
        {products.length === 0 && (
          <p style={{ color: '#1a1a1a' }}>This range is being prepared — please check back shortly.</p>
        )}

        {/* Browse by subcategory — pills link to per-type sub-pages */}
        {products.length > 0 && (
          <section>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>
              Browse by Subcategory
            </h2>
            {cats.map((cat) => (
              <div key={cat} style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>{cat}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {Object.keys(groups[cat]).sort().map((sub) => (
                    <SubcatPill key={sub} sub={sub} count={groups[cat][sub]} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
