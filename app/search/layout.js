// → app/search/layout.js  (NEW FILE)
//
// #10 (Rulebook §A): internal search-results URLs (/search?q=...) must not be
// indexed — they are infinite, thin, duplicate faceted pages. They are still
// followed so Google can reach the real product pages they link to.
//
// app/search/page.jsx is a Client Component and cannot export metadata, so this
// server-side layout sets robots for EVERY /search URL regardless of the ?q=
// value. canonical is left to the page/root; we only force noindex,follow here.
export const metadata = {
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }) {
  return children;
}
