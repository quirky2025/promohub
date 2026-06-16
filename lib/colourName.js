// Shared colour-name normalization — single source of truth for image alt (#3)
// and the variant foundation (4B). Keep all colour cleaning logic here.
//
// cleanColour(raw) -> { name, mode, secondary }
//   mode: 'solid' | 'compound' | 'full_colour' | 'placeholder' | 'unknown'
//   name: cleaned MAIN colour for solid/compound; null otherwise.
//   secondary: [{ colour, component }] extra components (e.g. {colour:'black', component:'lid'})
//
// Product schema `color` is ONLY valid for mode 'solid' or 'compound' (uses name).

const PLACEHOLDER = new Set(['', 'default', 'product colour']);

function normaliseColour(s) {
  let c = (s || '').replace(/\([^)]*\)/g, '').trim();
  let compound = false;
  if (c.includes('/')) {
    const parts = c.split('/').map((x) => x.trim()).filter(Boolean);
    if (parts.length > 1) { compound = true; c = parts[0] + parts.slice(1).map((p) => ' and ' + p.toLowerCase()).join(''); }
    else c = parts[0] || c;
  }
  c = c.replace(/[.\s]+$/, '').trim();
  return { value: c, compound };
}

export function cleanColour(raw) {
  if (raw == null) return { name: null, mode: 'placeholder', secondary: [] };
  const c = String(raw).trim();
  const low = c.toLowerCase();
  if (PLACEHOLDER.has(low)) return { name: null, mode: 'placeholder', secondary: [] };
  if (low === 'custom' || /any colou?r|produced in|full colou?r/i.test(c)) {
    return { name: null, mode: 'full_colour', secondary: [] };
  }

  const segments = c.split(/[.;]/).map((s) => s.trim()).filter(Boolean);
  const first = segments[0] || c;

  let mainRaw = first.includes(':') ? first.slice(first.indexOf(':') + 1).trim() : first;
  const main = normaliseColour(mainRaw);

  const secondary = [];
  for (const seg of segments.slice(1)) {
    if (!seg.includes(':')) continue;
    const comp = seg.slice(0, seg.indexOf(':')).trim().toLowerCase();
    const col = normaliseColour(seg.slice(seg.indexOf(':') + 1).trim()).value;
    if (comp && col) secondary.push({ colour: col.toLowerCase(), component: comp });
  }

  if (!main.value || PLACEHOLDER.has(main.value.toLowerCase()) || main.value.toLowerCase() === 'custom') {
    return { name: null, mode: 'unknown', secondary };
  }
  return { name: main.value, mode: main.compound ? 'compound' : 'solid', secondary };
}

export function colourImageAlt(rawColour, productName) {
  const { name, mode, secondary } = cleanColour(rawColour);
  if ((mode === 'solid' || mode === 'compound') && name) {
    const lead = String(productName).toLowerCase().startsWith(name.toLowerCase())
      ? `${productName}`
      : `${name} ${productName}`;
    if (secondary && secondary.length) {
      const s = secondary[0]; // keep only ONE secondary part (avoid long alt)
      return `${lead} with ${s.colour} ${s.component}`;
    }
    return `${lead} with logo`;
  }
  return `${productName} with logo`;
}
