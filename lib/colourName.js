// Shared colour-name normalization — single source of truth for image alt (#3)
// and the variant foundation (4B). Keep all colour cleaning logic here.
//
// cleanColour(raw) -> { name, mode }
//   mode: 'solid' | 'compound' | 'full_colour' | 'placeholder' | 'unknown'
//   name: cleaned colour for solid/compound; null otherwise.
//
// Pipeline: take first segment (split on '.' / ';') -> take colour after a
// "Component:" prefix -> strip parentheticals -> "/" => " and " (compound) ->
// detect full-colour phrases / placeholders.
//
// Product schema `color` is ONLY valid for mode 'solid' or 'compound'.

const PLACEHOLDER = new Set(['', 'default', 'product colour']);

export function cleanColour(raw) {
  if (raw == null) return { name: null, mode: 'placeholder' };
  const c = String(raw).trim();
  const low = c.toLowerCase();
  if (PLACEHOLDER.has(low)) return { name: null, mode: 'placeholder' };
  if (low === 'custom' || /any colou?r|produced in|full colou?r/i.test(c)) {
    return { name: null, mode: 'full_colour' };
  }

  // 1) first segment (handles "Natural. Lid: Black" -> "Natural")
  let seg = (c.split(/[.;]/)[0] || '').trim() || c.trim();
  // 2) colour after a "Component:" prefix (handles "Body: White" -> "White")
  if (seg.includes(':')) seg = seg.slice(seg.indexOf(':') + 1).trim();
  // 3) strip parentheticals ("Silver (swivel only)" -> "Silver")
  seg = seg.replace(/\([^)]*\)/g, '').trim();
  // 4) compound "/" -> " and "  ("Natural/Silver" -> "Natural and silver")
  let compound = false;
  if (seg.includes('/')) {
    const parts = seg.split('/').map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      compound = true;
      seg = parts[0] + parts.slice(1).map((p) => ' and ' + p.toLowerCase()).join('');
    } else {
      seg = parts[0] || seg;
    }
  }
  seg = seg.replace(/[.\s]+$/, '').trim();

  if (!seg || PLACEHOLDER.has(seg.toLowerCase()) || seg.toLowerCase() === 'custom') {
    return { name: null, mode: 'unknown' };
  }
  return { name: seg, mode: compound ? 'compound' : 'solid' };
}

// Colour-variant image alt: "[Colour] [Name] with logo" for solid/compound,
// else "[Name] with logo" (full_colour / placeholder / unknown).
export function colourImageAlt(rawColour, productName) {
  const { name, mode } = cleanColour(rawColour);
  if ((mode === 'solid' || mode === 'compound') && name) {
    if (String(productName).toLowerCase().startsWith(name.toLowerCase())) {
      return `${productName} with logo`; // avoid "Blue Blue ..."
    }
    return `${name} ${productName} with logo`;
  }
  return `${productName} with logo`;
}
