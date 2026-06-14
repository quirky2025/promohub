export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quirkypromo.com.au')
  .replace(/\/+$/, '');

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;

  return `${SITE_URL}/${String(path).replace(/^\/+/, '')}`;
}
