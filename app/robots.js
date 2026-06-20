import { absoluteUrl, SITE_URL } from '@/lib/siteUrl';

// Block AI / scraper bots — they burned most of the Cloudinary bandwidth
// (GPTBot 685MB, Amazonbot, AhrefsBot, ClaudeBot...). Search engines that bring
// real traffic (Googlebot / Bingbot) stay allowed.
// NOTE: remove 'AhrefsBot' from this list if you use Ahrefs for your own SEO.
const BLOCKED_BOTS = [
  'GPTBot', 'ClaudeBot', 'CCBot', 'Amazonbot',
  'Bytespider', 'PerplexityBot', 'AhrefsBot',
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/', '/admin/', '/api/', '/artwork/',
          '/cart', '/order-confirmation', '/place-order', '/upload/',
        ],
      },
      ...BLOCKED_BOTS.map((bot) => ({ userAgent: bot, disallow: '/' })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
