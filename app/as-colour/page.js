// app/as-colour/page.js — AS Colour brand Range (single page). Hero + subcategory
// pills that act as tabs (client): click one -> its products + left filter show below,
// on the same page. Pills are ordered by product count (popular first).
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getFirstImage, getColourSwatches } from '@/lib/urlPages';
import { calculatorFromPrice } from '@/lib/decorationPricing';
import QuoteButton from '@/components/QuoteButton';
import ASRangeBrowser from '@/components/ASRangeBrowser';

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

async function getRangeProducts(supplier) {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, category, subcategory, is_eco, min_qty, colour_slugs, brand, material_tags, fulfillment, capacity, pen_mechanism, pen_ink_colour, decoration_model, pricing_tiers(base_price), product_colours(images, sort_order, hex, name), decoration_options(name, type)')
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

// Trim to only the fields CategoryFilter + pills need (keeps the client payload small).
function enrich(p) {
  return {
    id: p.id, slug: p.slug, name: p.name, category: p.category, subcategory: p.subcategory,
    is_eco: p.is_eco, min_qty: p.min_qty, colour_slugs: p.colour_slugs, brand: p.brand,
    material_tags: p.material_tags, fulfillment: p.fulfillment, capacity: p.capacity,
    pen_mechanism: p.pen_mechanism, pen_ink_colour: p.pen_ink_colour,
    decoration_model: p.decoration_model,
    _image: getFirstImage(p),
    _price: calculatorFromPrice(p) || 0,
    _swatches: getColourSwatches(p),
    _decorationNames: (p.decoration_options || []).filter((d) => d.type !== 'addon').map((d) => d.name),
  };
}

// -> { [category]: [{ sub, count, products }] } with subs sorted by count desc.
function buildGroups(products) {
  const byCat = {};
  for (const p of products) {
    const cat = p.category || 'Other';
    const sub = p.subcategory || 'Other';
    (byCat[cat] ||= {});
    (byCat[cat][sub] ||= []).push(p);
  }
  const groups = {};
  for (const cat of Object.keys(byCat)) {
    groups[cat] = Object.entries(byCat[cat])
      .map(([sub, items]) => ({ sub, count: items.length, products: items }))
      .sort((a, b) => b.count - a.count);
  }
  return groups;
}

function orderedCats(groups) {
  return [
    ...CAT_ORDER.filter((c) => groups[c]),
    ...Object.keys(groups).filter((c) => !CAT_ORDER.includes(c)),
  ];
}

export default async function ASColourRangePage() {
  const products = (await getRangeProducts('AS Colour')).map(enrich);
  const groups = buildGroups(products);
  const cats = orderedCats(groups);

  return (
    <div style={{ fontFamily: FONT, background: '#fff', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#000' }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
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
        {products.length === 0
          ? <p style={{ color: '#000' }}>This range is being prepared — please check back shortly.</p>
          : <ASRangeBrowser groups={groups} cats={cats} />}
      </div>
    </div>
  );
}
