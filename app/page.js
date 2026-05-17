import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      supplier_sku,
      category,
      product_colours (
        id,
        name,
        images
      )
    `)
    .limit(24);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '2rem' }}>PromoHub Products</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {products?.map(product => {
          const images = product.product_colours?.[0]?.images;
          const firstImage = Array.isArray(images) ? images[0] : null;

          return (
            <div key={product.id} style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={product.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '200px',
                  background: '#f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#999'
                }}>No image</div>
              )}
              <div style={{ padding: '1rem' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem' }}>{product.name}</p>
                <p style={{ color: '#666', margin: '0 0 0.25rem', fontSize: '0.875rem' }}>SKU: {product.supplier_sku}</p>
                <p style={{ color: '#999', margin: 0, fontSize: '0.875rem' }}>{product.category}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}