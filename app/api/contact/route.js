import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'QuirkyPromo Website <hello@quirkypromo.com.au>',
      to: 'hello@quirkypromo.com.au',
      replyTo: email,
      subject: `New Contact Form Enquiry from ${name}`,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1B2A4A; padding: 32px; text-align: center;">
            <h1 style="color: #C9A96E; font-family: Georgia, serif; margin: 0; font-size: 28px;">QuirkyPromo</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 14px;">New Contact Form Enquiry</p>
          </div>
          <div style="background: #fff; padding: 40px; border: 1px solid #E0DDD7;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F0EEED; font-size: 13px; color: #7A7570; width: 120px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F0EEED; font-size: 15px; color: #1B2A4A;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F0EEED; font-size: 13px; color: #7A7570; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F0EEED; font-size: 15px; color: #1B2A4A;"><a href="mailto:${email}" style="color: #C9A96E;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F0EEED; font-size: 13px; color: #7A7570; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F0EEED; font-size: 15px; color: #1B2A4A;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-size: 13px; color: #7A7570; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Message</td>
                <td style="padding: 12px 0; font-size: 15px; color: #1B2A4A; line-height: 1.7;">${message.replace(/\n/g, '<br/>')}</td>
              </tr>
            </table>
          </div>
          <div style="background: #F8F7F4; padding: 20px; text-align: center; border: 1px solid #E0DDD7; border-top: none;">
            <p style="margin: 0; font-size: 12px; color: #B0AAA3;">Sent from quirkypromo.com.au contact form</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
