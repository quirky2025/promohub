import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

export default async function SubcategoryPage({ params }) {
  const { subcategory } = await params;
  const subcategoryName = decodeURIComponent(subcategory).replace(/-/g, ' ');

  const { data: products } = await supabase
    .from('products')
    .select('id, name, supplier_sku, category, subcategory, min_qty, product_colours(images)')
    .ilike('subcategory', subcategoryName)
    .eq('status', 'active')
    .order('name');

  const category = products?.[0]?.category || '';

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", minHeight: '100vh', background: '#F4F2EE', color: '#1A1714' }}>

      {/* BREADCRUMB */}
      <div style={{ padding: '10px 32px', fontSize: '12px', color: '#7A7570', background: '#fff', borderBottom: '1px solid #E0DDD7' }}>
        <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <Link href={`/category/${encodeURIComponent(category.toLowerCase())}`} style={{ color: '#7A7570', textDecoration: 'none', textTransform: 'capitalize' }}>{category}</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <span style={{ textTransform: 'capitalize' }}>{subcategoryName}</span>
      </div>

      {/* HEADER */}
      <div style={{ background: '#1A1714', color: '#fff', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: 400, margin: '0 0 8px', textTransform: 'capitalize' }}>
            {subcategoryName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', margin: 0, fontSize: '14px' }}>
            {products?.length || 0} products
          </p>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
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
                    <div style={{ fontSize: '11px', color: '#7A7570' }}>Min. {product.min_qty} units</div>
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
