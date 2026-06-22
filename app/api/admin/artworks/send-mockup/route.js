import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { token, mockupUrl } = await req.json();

    const { data: artwork } = await supabase.from('artworks').select('*').eq('token', token).single();
    if (!artwork) return Response.json({ error: 'Not found' }, { status: 404 });

    await supabase.from('artworks').update({ mockup_url: mockupUrl, status: 'mockup_sent' }).eq('token', token);

    const approveUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/artwork/${token}`;
    const isPdf = mockupUrl.toLowerCase().includes('.pdf') || mockupUrl.toLowerCase().includes('/pdf');
    const previewUrl = isPdf
      ? mockupUrl.replace('/upload/', '/upload/pg_1/').replace(/\.pdf$/, '.jpg')
      : mockupUrl;

    const mockupSection = `
      <div style="text-align:center;margin:24px 0;">
        <img src="${previewUrl}" alt="Artwork proof" style="max-width:100%;border-radius:10px;border:1px solid #E0DDD7;" />
      </div>`;

    const bodyHtml = `
      <p style="font-size:15px;margin:0 0 16px;">Hi ${artwork.customer_name},</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Your artwork proof for <strong>${artwork.product_name}</strong> is ready for review. Please take a look and approve it so we can get started.</p>
      <div style="background:#F8F7F4;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;">
        <span style="color:#7A7570;">Order</span> <strong style="color:#1B2A4A;">${artwork.order_number}</strong>
        &nbsp;·&nbsp; <span style="color:#7A7570;">Product</span> <strong style="color:#1B2A4A;">${artwork.product_name}</strong>
      </div>
      ${mockupSection}
      <div style="text-align:center;margin:28px 0;">
        <a href="${approveUrl}" style="display:inline-block;background:#C9A96E;color:#fff;text-decoration:none;padding:15px 38px;border-radius:10px;font-weight:700;font-size:16px;">Review &amp; Approve Artwork →</a>
      </div>
      <p style="font-size:13px;color:#7A7570;text-align:center;margin:0 0 8px;">This link is unique to your order — please don't share it.</p>
      <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Any questions, just reply or call us on <strong>02 9477 4748</strong>.</p>`;

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [artwork.customer_email],
      subject: `Your Artwork Proof is Ready — ${artwork.order_number}`,
      html: quirkyEmail(bodyHtml),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}
