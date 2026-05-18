import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

export default async function CategoryPage({ params }) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);

  const { data: products } = await supabase
    .from('products')
    .select('id, name, supplier_sku, category, subcategory, product_colours(images)')
    .eq('category', category)
    .eq('status', 'active');

  const subcategories = [...new Set(products?.map(p => p.subcategory).filter(Boolean))].sort();

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f8f8f6' }}>
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
        <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#666' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>→</span>
          <span>{category}</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {category}
        </h1>

        {subcategories.length > 0 && (
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {subcategories.map(sub => (
              <Link key={sub} href={`/subcategory/${encodeURIComponent(sub)}`}
                style={{
                  padding: '0.5rem 1.25rem',
                  border: '1px solid #1a1a1a',
                  textDecoration: 'none',
                  color: '#1a1a1a',
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  background: 'white'
                }}>
                {sub}
              </Link>
            ))}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
                      style={{ width: '100%', height: '220px', objectFit: 'contain', padding: '1rem' }} />
                  ) : (
                    <div style={{ width: '100%', height: '220px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      No image
                    </div>
                  )}
                  <div style={{ padding: '1rem', borderTop: '1px solid #f0f0f0' }}>
                    <p style={{ fontWeight: '500', margin: '0 0 0.25rem', fontSize: '0.9rem' }}>{product.name}</p>
                    <p style={{ color: '#999', margin: '0 0 0.25rem', fontSize: '0.75rem' }}>SKU: {product.supplier_sku}</p>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.subcategory}</p>
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