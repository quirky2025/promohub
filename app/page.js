import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('id, name, supplier_sku, category, subcategory, product_colours(images)')
    .eq('status', 'active')
    .limit(24);

  const { data: allProducts } = await supabase
    .from('products')
    .select('category, subcategory')
    .eq('status', 'active');

  const categoryMap = {};
  allProducts?.forEach(({ category, subcategory }) => {
    if (!category) return;
    if (!categoryMap[category]) categoryMap[category] = new Set();
    if (subcategory) categoryMap[category].add(subcategory);
  });

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", minHeight: '100vh', background: '#F4F2EE', color: '#1A1714' }}>

      {/* NAV */}
      <nav style={{ background: '#1A1714', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: 'serif', fontSize: '19px', color: '#fff', textDecoration: 'none', letterSpacing: '1px' }}>
          PROMO<span style={{ color: '#E07050' }}>HUB</span>
        </Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {Object.keys(categoryMap).sort().map(cat => (
            <Link key={cat} href={`/category/${encodeURIComponent(cat)}`}
              style={{ color: '#C8C4BC', textDecoration: 'none', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {cat}
            </Link>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#1A1714', color: '#fff', padding: '48px 32px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '42px', fontWeight: 400, margin: '0 0 12px', letterSpacing: '2px' }}>
          Premium Promotional Products
        </h1>
        <p style={{ color: '#7A7570', fontSize: '15px', margin: 0 }}>
          High-quality branded merchandise for Australian businesses
        </p>
      </div>

      {/* CATEGORY PILLS */}
      <div style={{ padding: '20px 32px', display: 'flex', gap: '10px', flexWrap: 'wrap', borderBottom: '1px solid #E0DDD7', background: '#fff' }}>
        <Link href="/" style={{ padding: '6px 16px', borderRadius: '20px', background: '#1A1714', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
          All
        </Link>
        {Object.keys(categoryMap).sort().map(cat => (
          <Link key={cat} href={`/category/${encodeURIComponent(cat)}`}
            style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #C8C4BC', color: '#3D3A36', textDecoration: 'none', fontSize: '12px' }}>
            {cat}
          </Link>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 32px' }}>
        <p style={{ fontSize: '13px', color: '#7A7570', marginBottom: '20px' }}>{products?.length || 0} products</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {products?.map(product => {
            const images = product.product_colours?.[0]?.images;
            const firstImage = Array.isArray(images) ? images[0] : null;
            return (
              <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7', transition: 'box-shadow .2s' }}>
                  {firstImage
                    ? <img src={firstImage} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'contain', padding: '16px', background: '#fff' }} />
                    : <div style={{ width: '100%', height: '200px', background: '#F4F2EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B0AAA3', fontSize: '13px' }}>No image</div>
                  }
                  <div style={{ padding: '12px 14px', borderTop: '1px solid #F0EEED' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{product.name}</div>
                    <div style={{ fontSize: '11px', color: '#B0AAA3', marginBottom: '4px' }}>{product.supplier_sku}</div>
                    <div style={{ fontSize: '11px', color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.subcategory || product.category}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}