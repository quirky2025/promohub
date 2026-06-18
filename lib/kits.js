// Promo Kits — single source of truth (data only, no DB).
// Used by /promo-kits hub, the Kit Builder, and /promo-kits/[slug] scene pages.
// See PROMO_KITS.md. Slot links are validated against live url_pages at render time
// (see getLiveCanonicalMap in lib/urlPages.js) — we never hard-link a non-live page.

// Slot key -> ordered canonical slug candidates (first = primary).
export const SLOT_CANONICAL = {
  'drink-bottle':  ['custom-drink-bottles-australia'],
  'drinkware':     ['custom-drinkware-australia'],
  'notebook':      ['branded-notebooks-australia'],
  'pen':           ['branded-pens-australia'],
  'tote-bag':      ['custom-tote-bags-australia'],
  'drawstring-bag':['custom-drawstring-bags-australia'],
  'cooler-bag':    ['custom-cooler-bags-australia'],
  'lanyard':       ['custom-lanyards-australia'],
  'sticker':       ['custom-stickers-australia'],
  'keyring':       ['custom-keyrings-australia'],
  'cap':           ['custom-caps-australia'],
  'apparel':       ['custom-hoodies-australia', 'custom-branded-apparel-australia'],
  'tech':          ['custom-power-banks-australia', 'custom-usb-drives-australia', 'corporate-tech-gifts-australia'],
  'gift-box':      ['custom-gift-boxes-australia'],
  'umbrella':      ['custom-umbrellas-australia'],
  'towel':         ['custom-towels-australia'],
  'sunglasses':    ['custom-sunglasses-australia'],
  'picnic':        ['picnic-and-bbq-australia'],
  'candle':        ['candles-and-diffusers-australia'],
  'stress-ball':   ['custom-stress-balls-australia'],
};

// Display label per slot (kept stable / human-readable).
export const SLOT_LABEL = {
  'drink-bottle': 'Drink bottle', 'drinkware': 'Drinkware', 'notebook': 'Notebook',
  'pen': 'Pen', 'tote-bag': 'Tote bag', 'drawstring-bag': 'Drawstring bag',
  'cooler-bag': 'Cooler bag', 'lanyard': 'Lanyard', 'sticker': 'Sticker',
  'keyring': 'Keyring', 'cap': 'Cap', 'apparel': 'Apparel / Hoodie',
  'tech': 'Tech item', 'gift-box': 'Gift box', 'umbrella': 'Umbrella',
  'towel': 'Towel', 'sunglasses': 'Sunglasses', 'picnic': 'Picnic / BBQ item',
  'candle': 'Candle / home item', 'stress-ball': 'Stress ball',
};

// 8 V1 scenes (PROMO_KITS.md §2). budget = per person, ex GST estimate.
export const SCENES = [
  { slug: 'new-starter', name: 'New Starter Kit', emoji: '👋',
    tagline: 'Welcome new employees with a branded kit they actually use from day one.',
    must: ['drink-bottle', 'notebook', 'pen', 'tote-bag'], optional: ['cap', 'apparel', 'tech'],
    budget: [15, 35],
    intro: 'A staff onboarding kit that makes new starters feel part of the team on day one — practical branded items for the desk, the commute and the coffee run.' },
  { slug: 'trade-show-giveaway', name: 'Trade Show & Event Giveaway Kit', emoji: '🎪',
    tagline: 'High-volume, low-cost branded giveaways to hand out at the booth.',
    must: ['pen', 'tote-bag', 'lanyard'], optional: ['sticker', 'keyring', 'drink-bottle'],
    budget: [3, 10],
    intro: 'Cost-effective giveaways designed for volume — light, practical items that carry your logo off the floor and keep your brand in front of prospects long after the event.' },
  { slug: 'conference', name: 'Conference Kit', emoji: '🎤',
    tagline: 'A more complete delegate pack for multi-day conferences and summits.',
    must: ['tote-bag', 'notebook', 'pen', 'lanyard'], optional: ['drink-bottle', 'tech'],
    budget: [12, 30],
    intro: 'A delegate pack that keeps attendees organised across a multi-day program — a bag to carry it all, something to write on, and the essentials that make the event run smoothly.' },
  { slug: 'client-thank-you', name: 'Client Thank You Kit', emoji: '🤝',
    tagline: 'A considered gift that says thank you and keeps your brand close.',
    must: ['drinkware', 'notebook', 'pen'], optional: ['gift-box', 'keyring', 'umbrella'],
    budget: [20, 45],
    intro: 'A polished thank-you gift for valued clients — quality branded pieces presented well, designed to be kept on the desk rather than in a drawer.' },
  { slug: 'real-estate-handover', name: 'Real Estate Handover Kit', emoji: '🔑',
    tagline: 'A memorable handover gift for new homeowners at settlement.',
    must: ['drinkware', 'keyring', 'gift-box'], optional: ['cooler-bag', 'candle'],
    budget: [20, 50],
    intro: 'A welcome-home gift for buyers at handover — a warm, branded touch that turns a settlement into a referral and keeps your agency front of mind.' },
  { slug: 'outdoor-team-day', name: 'Outdoor Team Day Kit', emoji: '⛰️',
    tagline: 'Branded gear for team days, field days and outdoor events.',
    must: ['cooler-bag', 'drink-bottle', 'cap'], optional: ['towel', 'sunglasses', 'picnic'],
    budget: [15, 40],
    intro: 'Everything the team needs for a day outdoors — sun-smart, hydrated and branded, from the cooler bag to the cap.' },
  { slug: 'eofy-christmas', name: 'EOFY & Christmas Gift Kit', emoji: '🎁',
    tagline: 'Seasonal branded gifting for staff and clients at EOFY and Christmas.',
    must: ['drinkware', 'notebook'], optional: ['pen', 'apparel', 'umbrella', 'tech'],
    budget: [20, 60],
    intro: 'A seasonal gift kit for end-of-financial-year and Christmas — a thoughtful way to thank staff and clients with branded pieces they will genuinely use into the new year.' },
  { slug: 'school-club', name: 'School & Club Kit', emoji: '🎒',
    tagline: 'Affordable branded kits for schools, clubs and community groups.',
    must: ['drawstring-bag', 'drink-bottle', 'cap'], optional: ['pen', 'sticker', 'stress-ball'],
    budget: [10, 25],
    intro: 'Budget-friendly branded kits for schools, sports clubs and community groups — durable everyday items that build team identity without stretching the fundraising budget.' },
];

export function getScene(slug) {
  return SCENES.find((s) => s.slug === slug) || null;
}

// All canonical slugs referenced by any scene slot (for live-validation lookups).
export function allSlotSlugs() {
  const set = new Set();
  for (const s of SCENES) {
    for (const k of [...s.must, ...s.optional]) {
      for (const slug of (SLOT_CANONICAL[k] || [])) set.add(slug);
    }
  }
  return [...set];
}

// Builder colour palette — 9 themes (PROMO_KITS.md §4b). Navy independent of Blue,
// Charcoal independent of Grey. Matching uses colour_slugs at build time (later).
export const PALETTE = [
  { key: 'black', label: 'Black', swatch: '#1a1a1a' },
  { key: 'white', label: 'White', swatch: '#ffffff' },
  { key: 'navy', label: 'Navy', swatch: '#1B2A4A' },
  { key: 'charcoal', label: 'Charcoal', swatch: '#3a3f45' },
  { key: 'natural', label: 'Natural', swatch: '#d9c8a9' },
  { key: 'blue', label: 'Blue', swatch: '#2f6fb0' },
  { key: 'green', label: 'Green', swatch: '#3f7d52' },
  { key: 'red', label: 'Red', swatch: '#b23a3a' },
  { key: 'mixed', label: 'Mixed', swatch: 'linear-gradient(135deg,#1B2A4A 0%,#C9A96E 50%,#3f7d52 100%)' },
];

// Approximate-colour fallback order (PROMO_KITS.md §4b).
export const FALLBACK_MAP = {
  black: ['charcoal', 'navy'], white: ['natural', 'grey'], navy: ['blue', 'black'],
  charcoal: ['black', 'grey'], natural: ['white', 'brown'], blue: ['navy', 'black'],
  green: ['natural', 'black'], red: ['black', 'white'], mixed: [],
};

export const QUANTITIES = [25, 50, 100, 250, 500];
export const TIMINGS = ['Standard (3–4 weeks)', 'Rush (where stock allows)', 'Flexible / planning ahead'];

// Price / stock disclaimer — mandatory at every kit page + quote (PROMO_KITS.md §4, STOCK_ACCURACY.md).
export const KIT_DISCLAIMER =
  'Prices are product estimates only · Ex GST · Branding, setup and freight quoted separately · Stock confirmed and final pricing confirmed after artwork and stock check.';

export const COLOUR_UI_COPY =
  "We'll prioritise products in your selected kit colour. If an exact colour isn't available, we'll suggest the closest suitable alternative before quoting.";
