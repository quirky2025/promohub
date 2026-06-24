# Push homepage V1 → Vercel preview (UPDATED)

`feat/homepage-v1-clean` already exists on GitHub (your earlier push). This patch is a **newer version** (adds Shop by Brand + New Arrivals), so you **force-update** the same branch.

Patch: **`homepage-v1.patch`** (~950KB). One commit:
- `app/page.js` — V1 homepage
- `public/categories/*.jpg` (8) — category photos
- `public/brands/*` (4) — Moleskine / Swiss Peak / Pierre Cardin / CamelBak logos
- `public/kit-hero.svg`
- removes unused `public/categories/LEISURE.jpg`

Homepage sections:
- **Shop by Category** (8 image cards) + View all → `/promotional-products`
- **Shop by Brand** (4 logo cards) → `/brands/<slug>` (no View all — no /brands hub yet)
- **New Arrivals** (4 real products by slug, from-price) → `/products/<slug>` + View all → `/new-arrivals`

```cmd
cd C:\Users\jilin\Desktop
rmdir /s /q hp-push3 2>nul
git clone https://github.com/quirky2025/promohub.git hp-push3
cd hp-push3
git checkout -b feat/homepage-v1-clean
git am C:\Users\jilin\Desktop\promohub\homepage-v1.patch
git push --force-with-lease origin feat/homepage-v1-clean
```

`--force-with-lease` safely overwrites your own earlier push (fails if someone else changed it — they haven't).

## Check on the preview
- Category: 8 photo cards + "View all →" (the View all 404s until `feat/promo-kits` is merged — expected).
- Brand: 4 logos (Moleskine appears black), each → its brand page.
- New Arrivals: 4 product cards with real photo + name + "from $X" → product pages. (These need the live DB, so they only show on the Vercel preview, not in local file checks.)
- One H1, JSON-LD present, images lazy-loaded.
