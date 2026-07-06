// app/as-colour/[type]/page.js — AS Colour Range sub-page for one subcategory
// (e.g. /as-colour/activewear). Reuses the shared CategoryFilter (left filter + grid).
// Products are calculator products; card price = calculatorFromPrice (the PDP "From $X").
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getFirstImage, getColourSwatches } from '@/lib/urlPages';
import { calculatorFromPrice } from '@/lib/decorationPricing';
import QuoteButton from '@/components/QuoteButton';
import CategoryFilter from '@/components/CategoryFilter';

export const revalidate = 3600;

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const FONT = '"DM Sans", sans-serif';

const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

async function getRangeProducts(supplier) {
  const { data, error } = await supabase
    .from('products')
    .select('*, pricing_tiers(base_price), product_colours(images, sort_order, hex, name), decoration_options(name, type)')
    .eq('supplier', supplier)
    .eq('is_published', true)
    .order('name')
    .limit(1000);
  if (error) {
    console.error('[as-colour sub] query failed', error);
    return [];
  }
  return data || [];
}

export async function generateMetadata({ params }) {
  const { type } = await params;
  return { alternates: { canonical: `/as-colour/${type}` } };
}

export default async function ASColourTypePage({ params }) {
  const { type } = await params;
  const all = await getRangeProducts('AS Colour');
  const matches = all.filter((p) => slugify(p.subcategory) === type);
  if (matches.length === 0) notFound();

  const sub = matches[0].subcategory;
  const cat = matches[0].category;

  const enriched = matches.map((p) => ({
    ...p,
    _image: getFirstImage(p),
    _price: calculatorFromPrice(p) || 0,
    _swatches: getColourSwatches(p),
    _decorationNames: (p.decoration_options || []).filter((d) => d.type !== 'addon').map((d) => d.name),
  }));

  return (
    <div style={{ fontFamily: FONT, background: '#fff', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#1a1a1a' }}>
          <Link href="/" style={{ color: '#1a1a1a', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/as-colour" style={{ color: '#1a1a1a', textDecoration: 'none' }}>AS Colour Range</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{sub}</span>
        </div>
      </div>

      {/* Hero — subcategory page (FRONTEND_STYLE_GUIDE §4: 44px 40px) */}
      <section style={{ background: NAVY, padding: '44px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', padding: '5px 13px', borderRadius: '20px', marginBottom: '16px' }}>
              AS Colour Range
            </div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '44px', lineHeight: 1.08, color: '#fff', fontWeight: 600, margin: '0 0 14px' }}>
              AS Colour {sub}
            </h1>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <QuoteButton label="Request a Quote" source="as-colour-sub" style={{ background: GOLD, color: '#fff', padding: '12px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }} />
              <span style={{ color: 'rgba(255,255,255,.65)', fontSize: '13px' }}>{matches.length} products</span>
            </div>
          </div>
        </div>
      </section>

      {/* Left filter + product grid — reuse shared CategoryFilter (single subcategory) */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <CategoryFilter products={enriched} category={cat} includeType={false} />
      </div>
    </div>
  );
}
