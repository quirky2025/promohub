import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Convert subcategory name to URL slug — handle & correctly
function toSlug(name) {
  return name.toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/&/g, 'and')
    .replace(/ /g, '-');
}

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);

  const { data: products } = await supabase
    .from('products')
    .select('id, name, subcategory, product_colours(images)')
    .ilike('category', categoryName)
    .eq('status', 'active');

  // Group by subcategory
  const subcategoryMap = {};
  products?.forEach(p => {
    const sub = p.subcategory || 'Other';
    if (!subcategoryMap[sub]) {
      subcategoryMap[sub] = { name: sub, count: 0, image: null };
    }
    subcategoryMap[sub].count++;
    if (!subcategoryMap[sub].image) {
      const imgs = p.product_colours?.[0]?.images;
      if (Array.isArray(imgs) && imgs.length > 0) {
        subcategoryMap[sub].image = imgs[0];
      }
    }
  });

  const subcategories = Object.values(subcategoryMap).sort((a, b) => a.name.localeCompare(b.name));
  const totalProducts = products?.length || 0;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', minHeight: '100vh', background: '#F8F7F4', color: '#1a1a1a' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>All Products</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600, textTransform: 'capitalize' }}>{categoryName}</span>
        </div>
      </div>

      {/* HEADER */}
      <div style={{ background: NAVY, color: '#fff', padding: '40px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '40px', fontWeight: 600, margin: '0 0 8px', textTransform: 'capitalize', color: '#fff' }}>
            {categoryName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', margin: 0, fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }}>
            {totalProducts} products across {subcategories.length} categories
          </p>
        </div>
      </div>

      {/* SUBCATEGORY GRID */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {subcategories.map(sub => (
            <Link
              key={sub.name}
              href={`/subcategory/${toSlug(sub.name)}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E0DDD7', transition: 'box-shadow .2s, transform .2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ height: '200px', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {sub.image
                    ? <img src={sub.image} alt={sub.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    : <div style={{ color: '#C8C4BC', fontSize: '40px' }}>📦</div>
                  }
                </div>
                <div style={{ padding: '16px 20px', borderTop: '1px solid #F0EEED', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px', color: NAVY, fontFamily: '"DM Sans", sans-serif' }}>{sub.name}</div>
                    <div style={{ fontSize: '12px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>{sub.count} products</div>
                  </div>
                  <div style={{ color: GOLD, fontSize: '18px' }}>→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}