import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

export default async function SubcategoryPage({ params }) {
  const { subcategory: rawSub } = await params;
  const subcategory = decodeURIComponent(rawSub);

  const { data: products } = await supabase
    .from('products')
    .select('id, name, supplier_sku, category, subcategory, min_qty, product_colours(images)')
    .eq('subcategory', subcategory)
    .eq('status', 'active');

  const category = products?.[0]?.category || '';

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f8f8f6' }}>
      {/* 导航栏 */}
      <nav style={{
        background: '#1a1a1a', color: 'white',
        padding: '0 2rem', display: 'flex',
        alignItems: 'center', height: '64px'
      }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>
          PROMOHUB
        </Link>
      </nav>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* 面包屑 */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#666' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>→</span>
          <Link href={`/category/${encodeURIComponent(category)}`} style={{ color: '#666', textDecoration: 'none' }}>{category}</Link>
          <span style={{ margin: '0 0.5rem' }}>→</span>
          <span>{subcategory}</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {subcategory}
        </h1>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* 左侧 Filter */}
          <div style={{ width: '260px', flexShrink: 0 }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: '600' }}>
                Filter
              </h3>

              {/* Price filter */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Price</span>
                  <span>›</span>
                </div>
              </div>

              {/* Min Qty filter */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Minimum Quantity</span>
                  <span>›</span>
                </div>
              </div>

              {/* Colour filter */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Colour</span>
                  <span>›</span>
                </div>
              </div>

              {/* Decoration filter */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Decoration</span>
                  <span>›</span>
                </div>
              </div>

              {/* Material filter */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Material</span>
                  <span>›</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧产品网格 */}
          <div style={{ flex: 1 }}>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {products?.length || 0} products
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              {products?.map(product => {
                const images = product.product_colours?.[0]?.images;
                const firstImage = Array.isArray(images) ? images[0] : null;
                return (
                  <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer' }}>
                      {firstImage ? (
                        <img src={firstImage} alt={product.name}
                          style={{ width: '100%', height: '200px', objectFit: 'contain', padding: '1rem' }} />
                      ) : (
                        <div style={{ width: '100%', height: '200px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                          No image
                        </div>
                      )}
                      <div style={{ padding: '1rem', borderTop: '1px solid #f0f0f0' }}>
                        <p style={{ fontWeight: '500', margin: '0 0 0.25rem', fontSize: '0.9rem' }}>{product.name}</p>
                        <p style={{ color: '#999', margin: '0 0 0.25rem', fontSize: '0.75rem' }}>SKU: {product.supplier_sku}</p>
                        <p style={{ color: '#666', margin: 0, fontSize: '0.75rem' }}>Min qty: {product.min_qty}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}