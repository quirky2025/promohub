'use client';

// Single-page browser for a brand Range: subcategory pills act as tabs.
// Click a pill -> the grid + left filter below shows that subcategory (same page).
// `groups` = { [category]: [{ sub, count, products }] } (subs pre-sorted by count desc).
import { useState } from 'react';
import CategoryFilter from '@/components/CategoryFilter';

const NAVY = '#1B2A4A';

export default function ASRangeBrowser({ groups, cats }) {
  const allSubs = cats.flatMap((c) => groups[c].map((g) => ({ ...g, cat: c })));
  const [sel, setSel] = useState(allSubs[0]?.sub || null);
  const current = allSubs.find((s) => s.sub === sel) || allSubs[0] || null;

  const pillBase = {
    display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 16px',
    borderRadius: '999px', border: '1.5px solid #E0DDD7', background: '#fff',
    color: '#000', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap',
  };
  const pillOn = { background: NAVY, color: '#fff', borderColor: NAVY };

  return (
    <div>
      <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>
        Browse by Subcategory
      </h2>

      {cats.map((cat) => (
        <div key={cat} style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '17px', fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>{cat}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {groups[cat].map((g) => {
              const on = g.sub === sel;
              return (
                <button key={g.sub} type="button" onClick={() => setSel(g.sub)} style={{ ...pillBase, ...(on ? pillOn : {}) }}>
                  {g.sub}
                  <span style={{ color: on ? 'rgba(255,255,255,.7)' : '#000', fontWeight: 400, fontSize: '12px' }}>{g.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {current && (
        <div style={{ marginTop: '30px', borderTop: '1px solid #E0DDD7', paddingTop: '28px' }}>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>
            {current.sub} <span style={{ fontSize: '14px', color: '#000', fontWeight: 400 }}>· {current.count} products</span>
          </h3>
          <CategoryFilter products={current.products} category={current.cat} includeType={false} />
        </div>
      )}
    </div>
  );
}
