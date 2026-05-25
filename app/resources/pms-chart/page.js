'use client';

import { useState } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

// Common PMS colours used in corporate branding
const PMS_COLOURS = [
  // Reds
  { pms: 'PMS 485', hex: '#DA291C', name: 'Red', cmyk: '0, 100, 100, 0' },
  { pms: 'PMS 186', hex: '#C8102E', name: 'Crimson Red', cmyk: '0, 100, 81, 4' },
  { pms: 'PMS 200', hex: '#BA0C2F', name: 'Dark Red', cmyk: '0, 100, 75, 27' },
  { pms: 'PMS 199', hex: '#CC0033', name: 'Bright Red', cmyk: '0, 100, 75, 20' },
  // Oranges
  { pms: 'PMS 021', hex: '#FE5000', name: 'Orange', cmyk: '0, 69, 100, 0' },
  { pms: 'PMS 144', hex: '#ED7D31', name: 'Light Orange', cmyk: '0, 47, 100, 0' },
  { pms: 'PMS 1585', hex: '#F4831F', name: 'Medium Orange', cmyk: '0, 50, 100, 0' },
  // Yellows
  { pms: 'PMS 109', hex: '#FFD700', name: 'Yellow', cmyk: '0, 14, 100, 0' },
  { pms: 'PMS 116', hex: '#FFCD00', name: 'Bright Yellow', cmyk: '0, 20, 100, 0' },
  { pms: 'PMS 012', hex: '#FFD700', name: 'Lemon Yellow', cmyk: '0, 11, 91, 0' },
  // Greens
  { pms: 'PMS 376', hex: '#84BD00', name: 'Lime Green', cmyk: '30, 0, 100, 0' },
  { pms: 'PMS 361', hex: '#43B02A', name: 'Green', cmyk: '70, 0, 100, 0' },
  { pms: 'PMS 348', hex: '#00703C', name: 'Dark Green', cmyk: '100, 0, 70, 30' },
  { pms: 'PMS 355', hex: '#009A44', name: 'Medium Green', cmyk: '100, 0, 65, 5' },
  // Blues
  { pms: 'PMS 279', hex: '#418FDE', name: 'Light Blue', cmyk: '70, 35, 0, 0' },
  { pms: 'PMS 285', hex: '#0072CE', name: 'Blue', cmyk: '100, 43, 0, 0' },
  { pms: 'PMS 286', hex: '#003DA5', name: 'Royal Blue', cmyk: '100, 75, 0, 0' },
  { pms: 'PMS 289', hex: '#1B2A4A', name: 'Navy Blue', cmyk: '100, 72, 18, 59' },
  { pms: 'PMS 2945', hex: '#005EB8', name: 'Medium Blue', cmyk: '100, 50, 0, 10' },
  { pms: 'PMS 300', hex: '#005BAC', name: 'Corporate Blue', cmyk: '100, 46, 0, 15' },
  // Purples
  { pms: 'PMS 259', hex: '#6C1D45', name: 'Dark Purple', cmyk: '40, 100, 20, 40' },
  { pms: 'PMS 2665', hex: '#7B5EA7', name: 'Purple', cmyk: '50, 65, 0, 0' },
  { pms: 'PMS 2655', hex: '#7965AC', name: 'Medium Purple', cmyk: '50, 55, 0, 0' },
  { pms: 'PMS 266', hex: '#5C2D91', name: 'Violet', cmyk: '75, 90, 0, 0' },
  // Pinks
  { pms: 'PMS 812', hex: '#FF3EB5', name: 'Hot Pink', cmyk: '0, 76, 0, 0' },
  { pms: 'PMS 183', hex: '#FFB3C1', name: 'Light Pink', cmyk: '0, 30, 0, 0' },
  { pms: 'PMS 204', hex: '#D63384', name: 'Deep Pink', cmyk: '0, 80, 10, 10' },
  // Neutrals
  { pms: 'PMS Cool Gray 1', hex: '#F2F2F2', name: 'Light Gray', cmyk: '0, 0, 0, 7' },
  { pms: 'PMS Cool Gray 5', hex: '#B1B3B3', name: 'Medium Gray', cmyk: '0, 0, 0, 35' },
  { pms: 'PMS Cool Gray 9', hex: '#75787B', name: 'Dark Gray', cmyk: '0, 0, 0, 55' },
  { pms: 'PMS 426', hex: '#2D2926', name: 'Near Black', cmyk: '0, 0, 0, 90' },
  { pms: 'PMS Black', hex: '#000000', name: 'Black', cmyk: '0, 0, 0, 100' },
  { pms: 'PMS White', hex: '#FFFFFF', name: 'White', cmyk: '0, 0, 0, 0' },
  // Gold/Bronze
  { pms: 'PMS 871', hex: '#8B6914', name: 'Metallic Gold', cmyk: '0, 25, 80, 45' },
  { pms: 'PMS 7549', hex: '#F0B323', name: 'Yellow Gold', cmyk: '0, 25, 85, 0' },
  { pms: 'PMS 4525', hex: '#C9A96E', name: 'Warm Gold', cmyk: '0, 18, 45, 20' },
];

const COLOUR_GROUPS = ['All', 'Reds', 'Oranges', 'Yellows', 'Greens', 'Blues', 'Purples', 'Pinks', 'Neutrals', 'Gold'];

function getGroup(pms) {
  const name = pms.name.toLowerCase();
  if (name.includes('red') || name.includes('crimson')) return 'Reds';
  if (name.includes('orange')) return 'Oranges';
  if (name.includes('yellow') || name.includes('lemon')) return 'Yellows';
  if (name.includes('green') || name.includes('lime')) return 'Greens';
  if (name.includes('blue') || name.includes('navy')) return 'Blues';
  if (name.includes('purple') || name.includes('violet')) return 'Purples';
  if (name.includes('pink')) return 'Pinks';
  if (name.includes('gold') || name.includes('bronze') || name.includes('warm')) return 'Gold';
  return 'Neutrals';
}

export default function PMSColourMatchPage() {
  const [activeGroup, setActiveGroup] = useState('All');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');

  const filtered = PMS_COLOURS.filter(c => {
    const matchGroup = activeGroup === 'All' || getGroup(c) === activeGroup;
    const matchSearch = !search || c.pms.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div style={{ background: BG, fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 16px' }}>
            PMS Colour Match
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7 }}>
            The Pantone® Matching System (PMS) ensures your brand colours are reproduced consistently across every product we make.
          </p>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '32px auto 0' }} />
        </div>
      </div>

      {/* WHAT IS PMS */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '60px' }}>
          {[
            { icon: '🎨', title: 'What is PMS?', desc: 'Pantone Matching System is a standardised colour system used worldwide. Each colour has a unique number so your logo colour looks the same on every product, every time.' },
            { icon: '🔍', title: 'How to find your PMS?', desc: 'Check your brand guidelines document, ask your designer, or use Adobe Illustrator/Photoshop to identify the colour. You can also email us your logo and we\'ll help identify it.' },
            { icon: '✅', title: 'Why it matters?', desc: 'Without a PMS number, colours may be interpreted differently by different printers. PMS eliminates guesswork and ensures brand consistency across all your promotional products.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '20px', fontWeight: 600, color: NAVY, marginBottom: '10px' }}>{title}</div>
              <div style={{ fontSize: '14px', color: '#5A5A5A', lineHeight: 1.8 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* INFO BOX */}
        <div style={{ background: '#fff', borderLeft: `4px solid ${GOLD}`, borderRadius: '0 8px 8px 0', padding: '20px 24px', marginBottom: '48px' }}>
          <p style={{ fontSize: '15px', color: '#5A5A5A', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: NAVY }}>Please note:</strong> While we make every effort to match PMS colours as closely as possible, exact colour reproduction can vary depending on the product material, branding method, and substrate colour. We recommend requesting a physical sample for colour-critical orders.
          </p>
        </div>
      </div>

      {/* COLOUR CHART */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 80px' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '36px', fontWeight: 600, color: NAVY, marginBottom: '24px' }}>
          Common PMS Colours
        </h2>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by PMS number or colour name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', color: NAVY }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {COLOUR_GROUPS.map(group => (
            <button key={group} onClick={() => setActiveGroup(group)}
              style={{ padding: '8px 16px', borderRadius: '20px', border: `1.5px solid ${activeGroup === group ? NAVY : '#E0DDD7'}`, background: activeGroup === group ? NAVY : '#fff', color: activeGroup === group ? '#fff' : '#5A5A5A', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
              {group}
            </button>
          ))}
        </div>

        {/* Colour Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
          {filtered.map(colour => (
            <div key={colour.pms}
              onClick={() => copyToClipboard(colour.pms)}
              style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: copied === colour.pms ? `0 0 0 2px ${GOLD}` : 'none' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = copied === colour.pms ? `0 0 0 2px ${GOLD}` : 'none'}
            >
              <div style={{ height: '80px', background: colour.hex, border: colour.hex === '#FFFFFF' ? '1px solid #E0DDD7' : 'none' }} />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '2px', fontFamily: '"DM Mono", monospace' }}>{colour.pms}</div>
                <div style={{ fontSize: '11px', color: '#7A7570', marginBottom: '4px' }}>{colour.name}</div>
                <div style={{ fontSize: '10px', color: '#B0AAA3', fontFamily: '"DM Mono", monospace' }}>{colour.hex}</div>
                {copied === colour.pms && (
                  <div style={{ fontSize: '10px', color: GOLD, fontWeight: 700, marginTop: '4px' }}>✓ Copied!</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: '#B0AAA3', marginTop: '24px', textAlign: 'center' }}>
          Click any colour to copy the PMS number. This chart shows common corporate PMS colours — not a complete Pantone library.
        </p>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '16px' }}>
            Not sure of your PMS colour?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px' }}>
            Send us your logo file and we'll identify the closest PMS match for you — no charge.
          </p>
          <a href="/contact" style={{ display: 'inline-block', background: GOLD, color: '#fff', padding: '16px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            Send Us Your Logo
          </a>
        </div>
      </div>
    </div>
  );
}
