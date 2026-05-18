import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);

  // Get all subcategories and a sample product image for each
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
      subcategoryMap[sub] = {
        name: sub,
        count: 0,
        image: null,
      };
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
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", minHeight: '100vh', background: '#F4F2EE', color: '#1A1714' }}>

      {/* BREADCRUMB */}
      <div style={{ padding: '10px 32px', fontSize: '12px', color: '#7A7570', background: '#fff', borderBottom: '1px solid #E0DDD7' }}>
        <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <span style={{ textTransform: 'capitalize' }}>{categoryName}</span>
      </div>

      {/* HEADER */}
      <div style={{ background: '#1A1714', color: '#fff', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: 400, margin: '0 0 8px', textTransform: 'capitalize' }}>
            {categoryName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', margin: 0, fontSize: '14px' }}>
            {totalProducts} products across {subcategories.length} categories
          </p>
        </div>
      </div>

      {/* SUBCATEGORY GRID */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {subcategories.map(sub => (
            <Link
              key={sub.name}
              href={`/subcategory/${encodeURIComponent(sub.name.toLowerCase().replace(/ /g, '-'))}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E0DDD7', transition: 'box-shadow .2s', cursor: 'pointer' }}>
                {/* Image */}
                <div style={{ height: '200px', background: '#F8F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {sub.image
                    ? <img src={sub.image} alt={sub.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    : <div style={{ color: '#C8C4BC', fontSize: '40px' }}>📦</div>
                  }
                </div>
                {/* Info */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #F0EEED', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{sub.name}</div>
                    <div style={{ fontSize: '12px', color: '#7A7570' }}>{sub.count} products</div>
                  </div>
                  <div style={{ color: '#0C7A6B', fontSize: '18px' }}>→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
