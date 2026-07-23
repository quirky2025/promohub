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

export default function CategoryFilter({ products = [], category, includeType = true, materialLinks = [] }) {
  const [selected, setSelected] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [visible, setVisible] = useState(24);
  const facets = useMemo(() => computeFacets(products, category, { includeType }), [products, category, includeType]);
  const filtered = useMemo(() => applyFilters(products, category, selected, { includeType }), [products, category, selected, includeType]);

  // Single-select per facet group: picking a new value replaces the previous one
  // in the same group; clicking the already-selected value clears it.
  function onToggle(key, value) {
    setVisible(24);
    setSelected(prev => {
      const next = { ...prev };
      const alreadyOn = (prev[key] && prev[key].has(value));
      next[key] = alreadyOn ? new Set() : new Set([value]);
      return next;
    });
  }
  function clearAll() { setVisible(24); setSelected({}); }

  return (
    <div className="qp-cat-layout" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
      <style>{`.qp-cat-toggle{ display: none !important; } @media (max-width: 768px){ .qp-cat-layout{ flex-direction: column; gap: 16px; } .qp-cat-filter{ width: 100% !important; display: none; } .qp-cat-filter.qp-cat-open{ display: block; } .qp-cat-toggle{ display: flex !important; justify-content: space-between; align-items: center; } }`}</style>
      <button className="qp-cat-toggle" onClick={() => setFilterOpen(o => !o)} style={{ width: '100%', padding: '12px 16px', background: '#fff', border: '1.5px solid #C8C4BC', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: '#1B2A4A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
        <span>Filters ({filtered.length})</span>
        <span>{filterOpen ? '▲' : '▼'}</span>
      </button>
      <div className={`qp-cat-filter${filterOpen ? ' qp-cat-open' : ''}`} style={{ width: '240px', flexShrink: 0 }}>
        {/* TAXONOMY_V2 step 4 — secondary "Shop by material" entry. NAVIGATION
            (jumps to a landing page), deliberately boxed + navy-headed so it
            can't be mistaken for the Material FILTER below. */}
        {materialLinks.length > 0 && (
          <div style={{ marginBottom: '14px', border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
            <div style={{ background: NAVY, color: '#fff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '10px 14px', fontWeight: 700, fontSize: '12px' }}>
              Shop by material
            </div>
            <div style={{ padding: '6px 0' }}>
              {materialLinks.map(l => (
                <a key={l.href} href={l.href}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', fontSize: '13.5px', fontWeight: 600, color: NAVY, textDecoration: 'none', borderBottom: '1px solid #F0EEED' }}>
                  {l.label} <span style={{ color: GOLD }}>›</span>
                </a>
              ))}
            </div>
          </div>
        )}
        <FilterSidebar facets={facets} selected={selected} onToggle={onToggle} onClear={clearAll} resultCount={filtered.length} />
      </div>
      <div style={{ flex: 1 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#000' }}>No products match these filters.</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(214px, 1fr))', gap: '20px' }}>
              {filtered.slice(0, visible).map(product => <ProductCard key={product.id} product={product} />)}
            </div>
            {filtered.length > visible && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button onClick={() => setVisible(v => v + 24)} style={{ background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '8px', padding: '12px 30px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  Load More ({filtered.length - visible})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const price = product._price || 0;
  const isCalc = product.decoration_model === 'calculator';
  const quoteOnly = !!(product._quoteOnly || product.quote_only);
  const swatches = product._swatches || [];
  return (
    <a href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
      <article style={{ height: '100%', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 7px rgba(0,0,0,.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '192px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          <ProductImg src={product._image} alt={product.name} size="list" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '13px', boxSizing: 'border-box' }} />
          {product.is_eco && (
            <div style={{ position: 'absolute', left: '10px', top: '10px', background: '#2D6A4F', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '999px' }}>ECO</div>
          )}
        </div>
        <div style={{ padding: '14px 15px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ color: NAVY, fontSize: '14px', fontWeight: 700, lineHeight: 1.35, textAlign: 'center' }}>{product.name}</div>
          <div style={{ fontSize: '12px', color: '#000', textAlign: 'center', fontFamily: '"DM Mono", monospace', letterSpacing: '0.5px' }}>{product.supplier_sku ? `SKU: ${product.supplier_sku}` : (product.subcategory || product.category)}</div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '22px', alignItems: 'flex-end' }}>
            {quoteOnly ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#000' }}>&nbsp;</div>
                <div style={{ color: GOLD, fontSize: '14px', fontWeight: 700 }}>Get a Quote</div>
              </div>
            ) : price > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#000' }}>{isCalc ? 'From' : 'As low as'}</div>
                <div style={{ color: GOLD, fontSize: '18px' }}>${price.toFixed(2)}</div>
                {isCalc && <div style={{ fontSize: '10px', color: '#000' }}>decorated</div>}
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#000' }}>Min Qty</div>
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
