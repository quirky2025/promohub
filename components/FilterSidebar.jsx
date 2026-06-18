'use client';

// Config-driven filter sidebar (presentational).
// Props:
//   facets   = computeFacets(...) -> [{ key, label, isType, values:[{value,count}] }]
//   selected = { facetKey: Set(values) }
//   onToggle(facetKey, value)  onClear()  resultCount
// Holds NO data fetching and writes NO URL. Parent owns state + filtering.
import { useState } from 'react';
import { PRICE_NOTE } from '@/lib/filterAttributes';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const SHOW_LIMIT = 8;

function FacetSection({ facet, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? facet.values : facet.values.slice(0, SHOW_LIMIT);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
        {facet.label}
      </div>
      {shown.map(({ value, count }) => (
        <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '3px 0', fontSize: 14, color: '#1a1a1a' }}>
          <input
            type="checkbox"
            checked={!!(selected && selected.has(value))}
            onChange={() => onToggle(facet.key, value)}
            style={{ width: 15, height: 15, accentColor: GOLD, flexShrink: 0 }}
          />
          <span style={{ flex: 1 }}>{value}</span>
          <span style={{ fontSize: 12, color: '#A9A39B' }}>({count})</span>
        </label>
      ))}
      {facet.values.length > SHOW_LIMIT && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ marginTop: 6, fontSize: 12, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
        >
          {expanded ? 'Show less' : `Show all ${facet.values.length}`}
        </button>
      )}
      {facet.key === 'price' && (
        <div style={{ fontSize: 11, color: '#A9A39B', marginTop: 6, lineHeight: 1.5 }}>{PRICE_NOTE}</div>
      )}
    </div>
  );
}

export default function FilterSidebar({ facets = [], selected = {}, onToggle, onClear, resultCount }) {
  const anySelected = Object.values(selected).some(s => s && s.size > 0);
  return (
    <div style={{ width: '100%', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Filters</span>
        {anySelected && (
          <button onClick={onClear} style={{ fontSize: 12, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
        )}
      </div>

      {facets.length === 0
        ? <div style={{ fontSize: 13, color: '#A9A39B' }}>No filters available</div>
        : facets.map(f => <FacetSection key={f.key} facet={f} selected={selected[f.key]} onToggle={onToggle} />)}

      {typeof resultCount === 'number' && (
        <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: 16, fontSize: 13, color: '#7A7570' }}>
          {resultCount} product{resultCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
