'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProductImg from '@/components/ProductImg';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const MARGIN = 1.40;

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);
    supabase
      .from('products')
      .select(`id, name, slug, supplier_sku, category, subcategory, min_qty, is_published,
        product_colours(id, name, hex, images, sort_order),
        pricing_tiers(base_price)`)
      .eq('is_published', true)
      .or(`name.ilike.%${q}%,supplier_sku.ilike.%${q}%,category.ilike.%${q}%,subcategory.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(48)
      .then(({ data }) => {
        setResults(data || []);
        setLoading(false);
      });
  }, [q]);

  function getImage(product) {
    if (!product.product_colours?.length) return null;
    const sorted = [...product.product_colours].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const imgs = sorted[0]?.images;
    if (!imgs) return null;
    const arr = Array.isArray(imgs) ? imgs : Object.values(imgs);
    return arr[0] || null;
  }

  function getLowestPrice(product) {
    if (!product.pricing_tiers?.length) return null;
    return Math.min(...product.pricing_tiers.map(t => parseFloat(t.base_price) * MARGIN));
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: 600, color: NAVY, margin: '0 0 8px' }}>
          Search Results
        </h1>
        {q && (
          <p style={{ color: '#7A7570', fontSize: '15px', margin: 0 }}>
            {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} for `}
            {!loading && <strong style={{ color: NAVY }}>"{q}"</strong>}
          </p>
        )}
      </div>

      {/* No query */}
      {!q && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#7A7570' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ fontSize: '18px' }}>Enter a search term to find products</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#7A7570' }}>
          <p style={{ fontSize: '16px' }}>Searching...</p>
        </div>
      )}

      {/* No results */}
      {!loading && q && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
          <p style={{ fontSize: '18px', color: NAVY, fontWeight: 600, marginBottom: '8px' }}>No products found for "{q}"</p>
          <p style={{ color: '#7A7570', marginBottom: '24px' }}>Try a different keyword or browse our categories</p>
          <Link href="/" style={{ background: GOLD, color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
            Browse All Products
          </Link>
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {results.map(product => {
            const img = getImage(product);
            const price = getLowestPrice(product);
            return (
              <Link key={product.id} href={`/products/${product.slug}`}
                style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'box-shadow .2s', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.06)'}
              >
                <div style={{ aspectRatio: '1', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {img
                    ? <ProductImg src={img} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    : <div style={{ color: '#B0AAA3', fontSize: '13px' }}>No image</div>
                  }
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#B0AAA3', fontFamily: '"DM Mono", monospace', marginBottom: '4px' }}>{product.supplier_sku}</div>
                  <div style={{ fontWeight: 600, color: NAVY, fontSize: '15px', marginBottom: '6px', lineHeight: 1.3 }}>{product.name}</div>
                  <div style={{ fontSize: '12px', color: '#7A7570', marginBottom: '10px' }}>{product.category}{product.subcategory ? ` › ${product.subcategory}` : ''}</div>
                  {price && (
                    <div style={{ fontSize: '13px', color: GOLD, fontWeight: 700 }}>
                      From ${price.toFixed(2)} <span style={{ color: '#B0AAA3', fontWeight: 400, fontSize: '11px' }}>excl. GST</span>
                    </div>
                  )}
                  {product.min_qty && (
                    <div style={{ fontSize: '11px', color: '#B0AAA3', marginTop: '4px' }}>Min. {product.min_qty} units</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <Suspense fallback={
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px', textAlign: 'center', color: '#7A7570' }}>
          <p style={{ fontSize: '16px' }}>Loading...</p>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  );
}
