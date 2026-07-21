import { Resend } from 'resend';
import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { quirkyEmail } from '@/lib/emailLayout';

// 工单C · Per-product review invitation (Google reviews version).
// POST { orderId, index, to } → sends an English review-invite email naming the
// specific product, stamps items[index].review_invite = { sent_at, to } (jsonb),
// returns fresh items. Re-send allowed (stamp updates). Requires GOOGLE_REVIEW_URL env.

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const { orderId, index, to } = await request.json();
    if (!orderId || index == null || !to) {
      return Response.json({ error: 'Missing orderId / index / to' }, { status: 400 });
    }
    const reviewUrl = process.env.GOOGLE_REVIEW_URL;
    if (!reviewUrl) {
      return Response.json({ error: 'GOOGLE_REVIEW_URL env var not set (Google Business Profile → Ask for reviews → copy link, add in Vercel, redeploy)' }, { status: 500 });
    }

    const db = sourcingDb();
    const { data: order, error: readErr } = await db
      .from('orders')
      .select('id, order_number, invoice_number, customer_name, customer_email, items')
      .eq('id', orderId).single();
    if (readErr || !order || !Array.isArray(order.items)) {
      return Response.json({ error: 'Order or items not found' }, { status: 404 });
    }
    const idx = Number(index);
    const item = order.items[idx];
    if (!item) return Response.json({ error: `No item at index ${idx}` }, { status: 404 });
    if ((item.status || '') !== 'delivered') {
      return Response.json({ error: 'Review invite is only available after this product is delivered' }, { status: 400 });
    }

    const productName = item.display_title || item.name || item.product_name || 'your order';
    const firstName = String(order.customer_name || '').trim().split(/\s+/)[0] || 'there';

    const body = `
      <p style="font-size:15px;color:#1a1a1a;">Hi ${firstName},</p>
      <p style="font-size:14px;color:#1a1a1a;line-height:1.7;">
        We hope your <strong style="color:#1B2A4A;">${productName}</strong> arrived safely and your team loves how the branding turned out.
      </p>
      <p style="font-size:14px;color:#1a1a1a;line-height:1.7;">
        If you have 60 seconds, a quick Google review would mean a great deal to our small Australian team —
        it's the best way to help other businesses find us.
      </p>
      <p style="margin:22px 0;">
        <a href="${reviewUrl}"
           style="background:#C9A96E;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 26px;border-radius:8px;display:inline-block;">
          Leave a quick review
        </a>
      </p>
      <p style="font-size:13px;color:#1a1a1a;line-height:1.6;">
        And if anything about your ${productName} isn't perfect, please just reply to this email — we'll make it right first.
      </p>`;

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      to: [String(to).trim()],
      reply_to: 'hello@quirkypromo.com.au',
      subject: `How did we do? — ${productName}`,
      html: quirkyEmail(body),
    });

    const now = new Date().toISOString();
    const items = order.items.map((it, i) => i === idx
      ? { ...it, review_invite: { sent_at: now, to: String(to).trim(), count: ((it.review_invite?.count || 0) + 1) } }
      : it);
    const { error: upErr } = await db.from('orders').update({ items }).eq('id', orderId);
    if (upErr) return Response.json({ error: `Sent, but failed to record: ${upErr.message}` }, { status: 500 });

    return Response.json({ success: true, items });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
