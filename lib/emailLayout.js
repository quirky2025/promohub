// lib/emailLayout.js
// Shared customer email shell — no navy top bar, warm body, signature with a
// text wordmark logo (always renders; email clients block external images).
export function quirkyEmail(bodyHtml) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
    <div style="padding:8px 4px 0;">${bodyHtml}</div>
    <div style="padding-top:16px;border-top:1px solid #E0DDD7;margin-top:24px;">
      <div style="font-size:20px;font-weight:800;letter-spacing:-0.3px;margin-bottom:10px;"><span style="color:#C9A96E;">Quirky</span><span style="color:#1B2A4A;">Promo</span></div>
      <p style="color:#1a1a1a;font-size:14px;margin:0 0 2px;">Kind regards,</p>
      <p style="color:#1B2A4A;font-size:15px;font-weight:700;margin:0 0 8px;">The QuirkyPromo Team</p>
      <p style="color:#3D3A36;font-size:13px;margin:0;">Tel: <strong style="color:#1B2A4A;">02 9477 4748</strong>  ·  Email: <a href="mailto:hello@quirkypromo.com.au" style="color:#C9A96E;">hello@quirkypromo.com.au</a>  ·  Web: <a href="https://www.quirkypromo.com.au" style="color:#C9A96E;">quirkypromo.com.au</a></p>
      <p style="color:#7A7570;font-size:11px;margin:8px 0 0;">ABN 95 656 714 270</p>
    </div>
  </div>`;
}
