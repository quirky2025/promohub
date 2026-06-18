'use client';

// Client-side filter for flat category / subcategory pages (app/[slug]/page.js).
// Server SSR-renders the default product grid (SEO intact) AND passes the full,
// enriched product list to this component; it adds the FilterSidebar + a filtered
// grid. Writes NO URL. Only used on category/subcategory pages (NOT colour pages).
//
// Each product must be pre-enriched by the server with display + facet fields:
//   _image (string|null), _price (number), _swatches [{id,name,hex}],
//   _decorationNames (string[]),  plus raw: name, slug, subcategory, category,
//   is_eco, min_qty, colour_slugs, brand, fulfillment, capacity,
//   pen_mechanism, pen_ink_colour, material_tags.
import { useState, useMemo } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import ProductImg from '@/components/ProductImg';
import { computeFacets, applyFilters } from '@/lib/filterFacets';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function CategoryFilter({ products = [], category, includeType = true }) {
  const [selected, setSelected] = useState({});
  const facets = useMemo(() => computeFacets(products, category, { includeType }), [products, category, includeType]);
  const filtered = useMemo(() => applyFilters(products, category, selected, { includeType }), [products, category, selected, includeType]);

  function onToggle(key, value) {
    setSelected(prev => {
      const next = { ...prev };
      const s = new Set(next[key] || []);
      if (s.has(value)) s.delete(value); else s.add(value);
      next[key] = s;
      return next;
    });
  }
  function clearAll() { setSelected({}); }

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
      <div style={{ width: '240px', flexShrink: 0 }}>
        <FilterSidebar facets={facets} selected={selected} onToggle={onToggle} onClear={clearAll} resultCount={filtered.length} />
      </div>
      <div style={{ flex: 1 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>No products match these filters.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(214px, 1fr))', gap: '20px' }}>
            {filtered.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const price = product._price || 0;
  const swatches = product._swatches || [];
  return (
    <a href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
      <article style={{ height: '100%', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 7px rgba(0,0,0,.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '192px', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          <ProductImg src={product._image} alt={product.name} size="list" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '13px', boxSizing: 'border-box' }} />
          {product.is_eco && (
            <div style={{ position: 'absolute', left: '10px', top: '10px', background: '#2D6A4F', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '999px' }}>ECO</div>
          )}
        </div>
        <div style={{ padding: '14px 15px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ color: NAVY, fontSize: '14px', fontWeight: 700, lineHeight: 1.35, textAlign: 'center' }}>{product.name}</div>
          <div style={{ fontSize: '12px', color: '#7A7570', textAlign: 'center' }}>{product.subcategory || product.category}</div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '22px', alignItems: 'flex-end' }}>
            {price > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#7A7570' }}>As low as</div>
                <div style={{ color: GOLD, fontSize: '18px' }}>${price.toFixed(2)}</div>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#7A7570' }}>Min Qty</div>
              <div style={{ color: NAVY, fontSize: '18px' }}>{product.min_qty || '-'}</div>
            </div>
          </div>
          {swatches.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {swatches.map(c => <span key={c.id} title={c.name} style={{ width: '15px', height: '15px', borderRadius: '999px', background: c.hex, border: '1px solid rgba(0,0,0,.14)' }} />)}
            </div>
          )}
        </div>
      </article>
    </a>
  );
}
