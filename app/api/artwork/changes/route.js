import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { token, name, notes } = await req.json();

    const { data: artwork } = await supabase
      .from('artworks')
      .select('*')
      .eq('token', token)
      .single();

    if (!artwork) return Response.json({ error: 'Not found' }, { status: 404 });

    await supabase.from('artworks').update({
      status: 'changes_requested',
      notes,
    }).eq('token', token);

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: artwork.customer_email,
      to: ['hello@quirkypromo.com.au'],
      subject: `Changes Requested — ${artwork.order_number} — ${artwork.customer_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1B2A4A; padding: 20px 28px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #C9A96E; margin: 0;">Artwork Changes Requested</h2>
          </div>
          <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 20px 28px; border-radius: 0 0 12px 12px;">
            <p><strong>Order:</strong> ${artwork.order_number}</p>
            <p><strong>Customer:</strong> ${name} (${artwork.customer_email})</p>
            <p><strong>Product:</strong> ${artwork.product_name}</p>
            <p><strong>Changes Requested:</strong></p>
            <div style="background: #FEF3C7; border-radius: 8px; padding: 16px; white-space: pre-wrap;">${notes}</div>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}
