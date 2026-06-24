# Push `feat/promo-kits` → Vercel preview

Patch: **`promo-kits.patch`** (in this folder). One commit, 7 files, based on **main** (independent of the homepage branch — no file overlap, so the two can merge in any order; suggest homepage first).

What it adds:
- `app/promotional-products/page.js` — category hub (indexable), data-driven from live `url_pages`.
- `app/promo-kits/page.js` — hub + 6-step Kit Builder (indexable; **noindex when `?scene/qty/budget/colour` present**).
- `app/promo-kits/[slug]/page.js` — 8 curated scene pages (indexable).
- `lib/kits.js` — kit data SSOT. `components/KitBuilder.jsx` — client builder.
- `lib/urlPages.js` — +`getCategoryTree()` and `getLiveCanonicalMap()` (additive).
- `app/sitemap.js` — adds the 2 hubs + 8 scene routes (builder results stay out).

```bash
# fresh clone of main on your machine
git clone https://github.com/quirky2025/promohub.git pk-push && cd pk-push
git checkout -b feat/promo-kits
git am /path/to/promo-kits.patch
git push -u origin feat/promo-kits
```

## Check on the preview (acceptance)
- `/promotional-products` lists your live categories, each with up to 6 subcategories; links resolve (no 404). If empty, it shows a "being prepared" message — that means `url_pages` query returned nothing (check `page_type='product_category'`, `status='live'`, `breadcrumb_parent`).
- `/promo-kits` shows 8 scene cards + the builder. Click a scene chip / change colour, qty, budget, add-ons, timing → the right-hand estimate updates.
- `/promo-kits/new-starter` (and the other 7) render H1 + kit contents + budget + CTA. Kit item links only appear as links when that canonical page is live; otherwise they show as plain text (by design — SEO-safe).
- View source: `/promo-kits` and scene pages are `index`; **`/promo-kits?scene=new-starter&qty=100` is `noindex`**. Canonicals correct. One H1 each.
- `/sitemap.xml` includes `/promo-kits`, `/promotional-products`, and the 8 scene URLs — and does **not** include any `?scene=` builder URL.

## Known V1 limits (by design, documented)
- The builder is **rule-based**: it assembles the scene template, applies a colour theme + closest-match note, and estimates budget (per-person × qty). It does **not** yet resolve individual live products / real stock — that needs the product DB + `colourFamiliesOf` and is gated on Admin/kit data (PROMO_KITS.md §4b, §5). Every kit surface carries the price + stock-check disclaimer.
- Quote CTA links to `/contact?kit=…&colour=…&qty=…` (harmless if /contact ignores the query). Wiring it into a real quote flow is a follow-up.

**Don't merge until accepted.** Tell me once homepage + kits are merged and I'll note it in NOW.md and line up the next queue item (Stock "Now" copy).
