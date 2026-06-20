// Inject f_auto,q_auto,w_<width> into a Cloudinary delivery URL so the browser is
// served AVIF/WebP/JPG automatically (+ auto-quality). Safe + idempotent:
// only touches res.cloudinary.com URLs that don't already carry a transform.
export function cld(url, width) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
  const marker = '/image/upload/';
  const j = url.indexOf(marker);
  if (j === -1) return url;
  const after = url.slice(j + marker.length);
  const first = after.split('/')[0];
  if (/(^|,)(f_|q_|w_|h_|c_|dpr_|e_)/.test(first)) return url; // already transformed
  return url.slice(0, j + marker.length) + `f_auto,q_auto,w_${width}/` + after;
}
