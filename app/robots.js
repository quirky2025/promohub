import { absoluteUrl, SITE_URL } from '@/lib/siteUrl';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/',
        '/admin/',
        '/api/',
        '/artwork/',
        '/cart',
        '/order-confirmation',
        '/place-order',
        '/upload/',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
