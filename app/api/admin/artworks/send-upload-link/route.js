import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);

// Manually re-send the "upload your logo" link for an awaiting-logo artwork,
// using its existing token (no new record created).
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { token } = await request.json();
    if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });
    const db = sourcingDb();
    const { data: art } = await db.from('artworks').select('*').eq('token', token).single();
    if (!art) return Response.json({ error: 'Artwork not found' }, { status: 404 });
    if (!art.customer_email) return Response.json({ error: 'No customer email on file' }, { status: 400 });

    const uploadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/upload/${token}`;
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [art.customer_email],
      subject: `Reminder: upload your logo for order ${art.order_number}`,
      html: quirkyEmail(`
        <p style="font-size:15px;margin:0 0 16px;">Hi ${art.customer_name || 'there'},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Just a friendly reminder — to create your free artwork mockup for <strong>${art.product_name || 'your order'}</strong>, we still need your logo file.</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${uploadUrl}" style="display:inline-block;background:#C9A96E;color:#fff;text-decoration:none;padding:15px 38px;border-radius:10px;font-weight:700;font-size:16px;">Upload your logo &rarr;</a>
        </div>
        <div style="background:#F8F7F4;border-radius:10px;padding:16px 20px;margin:0 0 16px;font-size:14px;">
          <div style="font-weight:700;color:#1B2A4A;margin-bottom:8px;">Accepted file formats</div>
          <div style="color:#000000;font-weight:700;">VECTOR FILES ONLY — AI, PDF, EPS or SVG. We cannot print from PNG or JPG.</div>
        </div>
        <p style="font-size:14px;line-height:1.6;color:#7A7570;margin:0;">Prefer email? Send your logo to <a href="mailto:hello@quirkypromo.com.au" style="color:#C9A96E;">hello@quirkypromo.com.au</a> and quote <strong>${art.order_number}</strong>.</p>
      `),
    });
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
