import { Resend } from 'resend';
import { sourcingDb } from '@/lib/sourcingDb';
import { resolveB2BFromRequest, resolveOrCreateLeadFromQuote } from '@/lib/b2bContext';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

// Unified Local-Stock enquiry intake (the nav / generic "Get a Quote").
// Every enquiry becomes a LEAD: logged-in users attach to their company,
// guests get a lead company auto-created (email dedup, needs_review). Then the
// enquiry is stored in quote_requests linked to that company. Fails safe.
export async function POST(req) {
  try {
    const body = await req.json();
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const message = (body.message || '').trim();
    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const b2b = await resolveB2BFromRequest(req);
    const link = b2b.company_id
      ? b2b
      : await resolveOrCreateLeadFromQuote({
          email,
          name,
          company: body.company,
          phone: body.phone,
          industry: body.industry,
        });

    const db = sourcingDb();
    const { error } = await db.from('quote_requests').insert([{
      name,
      company: (body.company || '').trim() || null,
      email,
      phone: (body.phone || '').trim() || null,
      message,
      quantity: (body.quantity || '').toString().trim() || null,
      date_needed: body.date_needed || null,
      source: body.source || 'website',
      ...(link.company_id ? { company_id: link.company_id } : {}),
      ...(link.placed_by_contact_id ? { placed_by_contact_id: link.placed_by_contact_id } : {}),
    }]);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    // Emails (fail-safe — never block lead creation)
    try {
      const rows = [
        ['Name', name], ['Company', body.company], ['Email', email], ['Phone', body.phone],
        ['Quantity', body.quantity], ['Date needed', body.date_needed], ['Source', body.source || 'website'],
      ].filter(([, v]) => v).map(([k, v]) =>
        `<tr><td style="padding:6px 0;color:#7A7570;width:120px;">${esc(k)}</td><td style="padding:6px 0;color:#1B2A4A;">${esc(v)}</td></tr>`).join('');

      const internalHtml = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#1B2A4A;padding:16px 24px;border-radius:10px 10px 0 0;"><img src="https://www.quirkypromo.com.au/quirky-logo-quote.png" alt="QuirkyPromo" height="30" style="display:block;height:30px;" /><p style="color:rgba(255,255,255,0.8);font-size:14px;margin:8px 0 0;">New Enquiry</p></div>
        <div style="border:1px solid #E0DDD7;border-top:none;border-radius:0 0 10px 10px;padding:20px 24px;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">${rows}</table>
          <div style="margin-top:14px;padding:14px;background:#ffffff;border-radius:8px;font-size:14px;color:#1B2A4A;white-space:pre-wrap;">${esc(message)}</div>
          <a href="mailto:${esc(email)}?subject=Re:%20your%20enquiry%20to%20QuirkyPromo" style="display:inline-block;margin-top:16px;background:#C9A96E;color:#fff;text-decoration:none;padding:11px 24px;border-radius:8px;font-weight:600;font-size:14px;">Reply to ${esc(name)}</a>
        </div></div>`;

      const customerHtml = quirkyEmail(`
          <p style="font-size:15px;margin:0 0 16px;">Hi ${esc(name)},</p>
          <p style="font-size:15px;color:#1a1a1a;line-height:1.6;margin:0 0 16px;">Thank you so much for reaching out — your enquiry has landed safely with us and we're already on it. One of our team will be in touch very soon (usually within the hour during business hours) with some ideas and pricing tailored to what you need.</p>
          <p style="font-size:11px;color:#7A7570;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px;">Your enquiry</p>
          <div style="border-left:3px solid #C9A96E;padding:2px 0 2px 14px;margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-style:italic;color:#1a1a1a;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(message)}</div>
          <p style="font-size:15px;color:#1a1a1a;line-height:1.6;margin:0 0 4px;">In the meantime, if you'd like to chat sooner just call us on <strong>02 9477 4748</strong> or simply reply to this email — we'd love to help make your promotion a success.</p>`);

      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
        to: ['hello@quirkypromo.com.au'],
        replyTo: email,
        subject: `New Enquiry — ${name}${body.company ? ` (${body.company})` : ''}`,
        html: internalHtml,
      });
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
        to: [email],
        replyTo: 'hello@quirkypromo.com.au',
        subject: "We've received your enquiry — QuirkyPromo",
        html: customerHtml,
      });
    } catch (mailErr) {
      console.error('lead-enquiry email failed', mailErr);
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
