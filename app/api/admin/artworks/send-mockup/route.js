import { Resend } from 'resend';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  if (!(await isAdmin(req))) return unauthorized();

  try {
    const { token, mockupUrl } = await req.json();
    const supabase = sourcingDb();

    const { data: artwork } = await supabase
      .from('artworks')
      .select('*')
      .eq('token', token)
      .single();

    if (!artwork) return Response.json({ error: 'Not found' }, { status: 404 });

    // Update mockup URL and status
    await supabase.from('artworks').update({
      mockup_url: mockupUrl,
      status: 'mockup_sent',
    }).eq('token', token);

    const approveUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/artwork/${token}`;
    const isPdf = mockupUrl.toLowerCase().includes('.pdf') || mockupUrl.toLowerCase().includes('/pdf');

    // Mockup section in email: PDF shows a notice, image shows inline
    const mockupEmailSection = isPdf
      ? `
        <div style="text-align: center; margin: 24px 0; background: #F8F7F4; border-radius: 10px; padding: 24px; border: 1px solid #E0DDD7;">
          <div style="font-size: 40px; margin-bottom: 12px;">📄</div>
          <p style="font-size: 14px; color: #1B2A4A; font-weight: 600; margin: 0 0 8px;">Your mockup is a PDF file</p>
          <p style="font-size: 13px; color: #7A7570; margin: 0;">Click the button below to open and review your artwork mockup.</p>
        </div>
      `
      : `
        <div style="text-align: center; margin: 24px 0;">
          <img src="${mockupUrl}" alt="Artwork Mockup" style="max-width: 100%; border-radius: 10px; border: 1px solid #E0DDD7;" />
        </div>
      `;

    // Send to customer
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [artwork.customer_email],
      subject: `Your Artwork Mockup is Ready – ${artwork.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">QuirkyPromo</h1>
            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Artwork Mockup Ready · ${artwork.order_number}</p>
          </div>
          <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px; margin: 0 0 16px;">Hi ${artwork.customer_name},</p>
            <p style="font-size: 15px; margin: 0 0 24px;">
              Your artwork mockup for <strong>${artwork.product_name}</strong> is ready for review.
              Please click the button below to view and approve your artwork.
            </p>
            <div style="background: #F8F7F4; border-radius: 10px; padding: 16px 20px; margin: 0 0 24px; font-size: 14px;">
              <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Order Number:</span> <strong style="color: #C9A96E;">${artwork.order_number}</strong></div>
              <div><span style="color: #7A7570;">Product:</span> <strong>${artwork.product_name}</strong></div>
            </div>

            ${mockupEmailSection}

            <div style="text-align: center; margin: 24px 0;">
              <a href="${approveUrl}" style="display: inline-block; background: #C9A96E; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px;">
                Review & Approve Artwork →
              </a>
            </div>
            <p style="font-size: 13px; color: #7A7570; text-align: center; margin: 0 0 8px;">
              This link is unique to your order. Please do not share it.
            </p>
            <p style="font-size: 13px; color: #7A7570; text-align: center; margin: 0;">
              Questions? Call us: <strong style="color: #1B2A4A;">02 9477 4748</strong>
            </p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}
