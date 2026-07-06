// app/as-colour/page.js — AS Colour brand Range (calculator products live here,
// not in the global TRENDS category pages). Type-first:
//   Hero -> "Browse by Subcategory" cards (image + count) -> product sections.
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getFirstImage } from '@/lib/urlPages';
import { calculatorFromPrice } from '@/lib/decorationPricing';

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
    .select('id, slug, name, category, subcategory, pricing_tiers(base_price), product_colours(images, sort_order)')
    .eq('supplier', supplier)
    .eq('is_published', true)
    .order('name')
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
    (groups[cat][sub] ||= []).push(p);
  }
  return groups;
}

function orderedCats(groups) {
  return [
    ...CAT_ORDER.filter((c) => groups[c]),
    ...Object.keys(groups).filter((c) => !CAT_ORDER.includes(c)),
  ];
}

function SubcatCard({ sub, items }) {
  const img = items.map(getFirstImage).find(Boolean);
  return (
    <a href={`#${slugify(sub)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
        <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {img
            ? <img src={img} alt={sub} loading="lazy" style={{ width: '82%', height: '82%', objectFit: 'contain' }} />
            : <span style={{ color: '#B0AAA3', fontSize: '13px' }}>No image</span>}
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY }}>{sub}</div>
          <div style={{ fontSize: '12px', color: '#7A7570', marginTop: '2px' }}>{items.length} products</div>
        </div>
      </div>
    </a>
  );
}

function ProductCard({ p }) {
  const img = getFirstImage(p);
  const from = calculatorFromPrice(p);
  return (
    <Link href={`/products/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{ border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
        <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {img
            ? <img src={img} alt={p.name} loading="lazy" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
            : <span style={{ color: '#B0AAA3', fontSize: '13px' }}>No image</span>}
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, lineHeight: 1.4, minHeight: '36px' }}>{p.name}</div>
          {from != null && (
            <div style={{ fontSize: '13px', color: NAVY, marginTop: '6px' }}>
              From <span style={{ color: GOLD, fontWeight: 700 }}>${from.toFixed(2)}</span>
              <span style={{ color: '#7A7570', fontSize: '11px' }}> / unit decorated</span>
            </div>
          )}
        </div>
      </div>
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>AS Colour Range</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: NAVY, padding: '44px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '40px', fontWeight: 600, color: '#fff', margin: '0 0 10px' }}>
            AS Colour Custom Apparel
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', margin: 0, lineHeight: 1.7, maxWidth: '720px' }}>
            Premium blanks, printed to order — tees, hoodies, bags and headwear with your logo.
            Screen print, DTG, DTF or embroidery. Minimum 20, free digital proof before production.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 80px' }}>
        {products.length === 0 && (
          <p style={{ color: '#7A7570' }}>This range is being prepared — please check back shortly.</p>
        )}

        {/* Browse by Subcategory */}
        {products.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>
              Browse by Subcategory
            </h2>
            {cats.map((cat) => (
              <div key={cat} style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#B0AAA3', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>{cat}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '18px' }}>
                  {Object.keys(groups[cat]).sort().map((sub) => (
                    <SubcatCard key={sub} sub={sub} items={groups[cat][sub]} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Product sections (anchor targets) */}
        {cats.map((cat) => (
          <div key={cat}>
            {Object.keys(groups[cat]).sort().map((sub) => (
              <div key={sub} id={slugify(sub)} style={{ marginBottom: '40px', scrollMarginTop: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px', paddingBottom: '10px', borderBottom: `2px solid ${GOLD}` }}>
                  <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 600, color: NAVY, margin: 0 }}>{sub}</h2>
                  <span style={{ fontSize: '13px', color: '#7A7570' }}>{groups[cat][sub].length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '18px' }}>
                  {groups[cat][sub].map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
