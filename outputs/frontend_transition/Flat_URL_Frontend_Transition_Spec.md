# QuirkyPromo Flat URL Frontend Transition Spec

> Generated after checking local Next.js docs and current `app/` routes. This is a frontend implementation spec only; no app code has been changed.

## Next 16 Notes From Local Docs

- Dynamic route `params` is a Promise in this version. In `page.js` and `generateMetadata`, use `const { slug } = await params`.
- `generateMetadata` is server-side. Use it to read `url_pages.title`, `meta_description`, and `canonical_url`.
- `middleware.js` is deprecated. This repo already has `proxy.js`; admin/auth/redirect work should stay in `proxy.js`.

## Recommended First Implementation

Build only a single-segment flat route first:

`app/[slug]/page.js`

Do not start with `app/[...slug]/page.js`. A catch-all route would touch every nested path and raise collision risk with existing routes like `/products/[slug]`, `/brands/[slug]`, `/category/...`, `/collections/...`, and `/supply-chain/...`.

## Route Guard

The route should:

1. Await `params`.
2. Reject reserved slugs before querying `url_pages`.
3. Query `url_pages` by exact `slug`.
4. Require `status = live`.
5. Apply the resolver from `outputs/product_filter_resolver/product_filter_resolver_spec.md`.
6. Return `notFound()` when no live page exists.

## Current Reserved Top-Level Slugs

`about`, `account`, `admin`, `api`, `artwork`, `best-sellers`, `blog`, `brands`, `cart`, `catalog`, `category`, `collections`, `contact`, `eco`, `faq`, `indent`, `new-arrivals`, `order-confirmation`, `place-order`, `privacy`, `products`, `refund-return`, `resources`, `reviews`, `sale`, `sales-terms`, `search`, `services`, `supply-chain`, `sustainability`, `testimonials`, `track-order`, `upload`, `website-terms`

## READY Seed Route Conflicts

- None.

## Slugs With Internal Slash

- None in the current READY seed.

Current READY seed can be handled by `app/[slug]/page.js`. Future internal-slash pages should use their specific existing route family first, for example `/brands/[slug]`, rather than making the root route catch all paths too early.

## Files To Add Later

- `lib/urlPages.js`: fetch `url_pages`, reserved slug helper, product filter resolver.
- `app/[slug]/page.js`: server route shell, metadata, product query, render.
- Optional `components/UrlPageProductGrid.jsx`: shared listing UI if old category pages remain client-heavy.

## Files To Touch Later

- `components/Nav.jsx`: switch nav/footer/home links from `url_pages` after counts validate.
- `app/category/[category]/page.js`: old route canonical should point to new page where a redirect mapping exists.
- `app/category/[category]/[subcategory]/page.js`: same canonical/transition handling.
- `app/products/[slug]/ProductClient.jsx`: breadcrumb links should use new flat URL once `url_pages` is live.

## Must Verify Before Switching Navigation

- Product counts from `product_filter_validation_READONLY.sql`.
- No empty live category/subcategory/compound/kit_collection pages.
- Static routes still open: `/cart`, `/admin`, `/products/example`, `/brands/example`, `/collections/example`.
- A flat page opens, e.g. `/custom-drink-bottles-australia`.
- Unknown slug returns 404.
- Canonical for new page equals `url_pages.canonical_url`.
