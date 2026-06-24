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
    const { token, name, notes } = await req.json();

    const { data: artwork } = await supabase.from('artworks').select('*').eq('token', token).single();
    if (!artwork) return Response.json({ error: 'Not found' }, { status: 404 });

    await supabase.from('artworks').update({ status: 'changes_requested', notes }).eq('token', token);

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: artwork.customer_email,
      to: ['hello@quirkypromo.com.au'],
      subject: `Changes Requested — ${artwork.order_number} — ${artwork.customer_name}`,
      html: quirkyEmail(`
        <p style="font-size:15px;margin:0 0 12px;"><strong>${name}</strong> requested changes to the artwork.</p>
        <div style="background:#ffffff;border-radius:10px;padding:14px 18px;margin:0 0 16px;font-size:14px;">
          <div><span style="color:#7A7570;">Order</span> <strong style="color:#1B2A4A;">${artwork.order_number}</strong></div>
          <div><span style="color:#7A7570;">Product</span> <strong style="color:#1B2A4A;">${artwork.product_name}</strong></div>
          <div><span style="color:#7A7570;">Customer</span> <strong style="color:#1B2A4A;">${name}</strong> (${artwork.customer_email})</div>
        </div>
        <p style="font-size:14px;font-weight:700;color:#1B2A4A;margin:0 0 6px;">Changes requested:</p>
        <div style="background:#FEF3C7;border-radius:8px;padding:14px 16px;white-space:pre-wrap;font-size:14px;color:#92400E;">${notes}</div>
      `),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}
