// lib/emailLayout.js
// Shared customer email shell — NO navy top bar, warm body, navy signature
// block with the white QuirkyPromo logo. Keeps every customer-facing email
// (order confirmation, logo request, mockup, etc.) visually consistent.
export function quirkyEmail(bodyHtml) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
    <div style="padding:8px 4px 0;">${bodyHtml}</div>
    <div style="background:#1B2A4A;border-radius:12px;padding:24px 28px;margin-top:24px;">
      <img src="https://www.quirkypromo.com.au/quirky-logo-quote.png" alt="QuirkyPromo" height="30" style="height:30px;display:block;margin-bottom:12px;" />
      <p style="color:#fff;font-size:14px;margin:0 0 2px;">Kind regards,</p>
      <p style="color:#C9A96E;font-size:15px;font-weight:700;margin:0 0 10px;">The QuirkyPromo Team</p>
      <p style="color:rgba(255,255,255,0.65);font-size:12px;margin:0;">02 9477 4748  ·  hello@quirkypromo.com.au  ·  quirkypromo.com.au</p>
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:8px 0 0;">ABN 95 656 714 270</p>
    </div>
  </div>`;
}
