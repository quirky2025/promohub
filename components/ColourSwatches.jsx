'use client';

import { parseColours } from '@/lib/colourCards';

// Render a stored colour-code string ("JHT-23101, JHT-23102, ...") as swatch blocks.
// The block colour comes from the colour card so the code and the colour line up.
export default function ColourSwatches({ codes, size = 18, showCode = false }) {
  const list = parseColours(codes);
  if (!list.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-start' }}>
      {list.map((c) => (
        <span key={c.code} title={`${c.code}${c.name ? ' · ' + c.name : ''}`}
          style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: showCode ? 40 : 'auto' }}>
          <span style={{ width: size, height: size, borderRadius: 4, background: c.hex || '#eee', border: '1px solid rgba(0,0,0,0.18)', display: 'inline-block' }} />
          {showCode && <span style={{ fontSize: 9, color: '#9a958e', lineHeight: 1 }}>{c.code.replace('JHT-', '')}</span>}
        </span>
      ))}
    </div>
  );
}
