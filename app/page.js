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

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: '#1A1714' }}>

      {/* HERO */}
      <div style={{ background: '#1A1714', color: '#fff', padding: '64px 32px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '48px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '2px' }}>
          Premium Promotional Products
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '16px', margin: '0 0 32px' }}>
          High-quality branded merchandise for Australian businesses
        </p>
        <Link href="/category/drinkware" style={{ background: '#E07050', color: '#fff', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>
          Shop Now
        </Link>
      </div>

      {/* PRODUCT GRID */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <h2 style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 400, marginBottom: '24px' }}>Featured Products</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {products?.map(product => {
            const images = product.product_colours?.[0]?.images;
            const firstImage = Array.isArray(images) ? images[0] : null;
            return (
              <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7' }}>
                  {firstImage
                    ? <img src={firstImage} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'contain', padding: '16px', boxSizing: 'border-box' }} />
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
