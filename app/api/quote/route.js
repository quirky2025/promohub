import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name, company, email, phone,
      qty, colour,
      brandingMethod, padPositions, padColours, screenPositions, otherPositions, personalisationLines,
      pmsColours, extraOptions,
      requiredDate, deliveryAddress, artworkFileName,
      notes,
      productName, productSku,
    } = body;

    if (!name || !email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Build branding summary
    function getBrandingType(n) {
      const s = (n || '').toLowerCase();
      if (s.includes('pad print')) return 'pad';
      if (s.includes('screen print')) return 'screen';
      if (s.includes('personalisation') || s.includes('personalization')) return 'personalisation';
      return 'other';
    }

    let brandingSummary = brandingMethod || 'None / Unbranded';
    if (brandingMethod) {
      const bt = getBrandingType(brandingMethod);
      if (bt === 'pad') brandingSummary = `${brandingMethod} — ${padPositions} position(s), ${padColours} colour(s)`;
      else if (bt === 'screen') brandingSummary = `${brandingMethod} — ${screenPositions} position(s), 1 colour`;
      else if (bt === 'personalisation') brandingSummary = `${brandingMethod} — ${personalisationLines} line(s)`;
      else if (otherPositions) brandingSummary = `${brandingMethod} — ${otherPositions} position(s)`;
    }

    const extrasHtml = extraOptions?.length
      ? `<tr><td style="padding: 6px 0; color: #7A7570; width: 160px;">Packaging Add-ons</td><td style="color: #1B2A4A;">${extraOptions.join(', ')}</td></tr>`
      : '';

    const pmsHtml = pmsColours
      ? `<tr><td style="padding: 6px 0; color: #7A7570;">PMS Colour(s)</td><td style="color: #1B2A4A;">${pmsColours}</td></tr>`
      : '';

    const artworkHtml = artworkFileName
      ? `<tr><td style="padding: 6px 0; color: #7A7570;">Artwork File</td><td style="color: #2D6A4F; font-weight: 600;">✅ ${artworkFileName} (will be emailed separately)</td></tr>`
      : `<tr><td style="padding: 6px 0; color: #7A7570;">Artwork</td><td style="color: #B0AAA3;">Not uploaded — client to send separately</td></tr>`;

    const dateHtml = requiredDate
      ? `<tr><td style="padding: 6px 0; color: #7A7570;">Required Date</td><td style="font-weight: 600; color: #C0392B;">${requiredDate}</td></tr>`
      : '';

    const addressHtml = deliveryAddress
      ? `<tr><td style="padding: 6px 0; color: #7A7570;">Delivery Address</td><td style="color: #1B2A4A;">${deliveryAddress.replace(/\n/g, '<br>')}</td></tr>`
      : '';

    // Email TO BUSINESS OWNER
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      to: ['hello@quirkypromo.com.au'],
      replyTo: email,
      subject: `New Quote Request: ${productName}`,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">New Quote Request</h1>
            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">QuirkyPromo.com.au</p>
          </div>
          <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">

            <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">📦 Product</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #7A7570; width: 160px;">Product</td><td style="font-weight: 600; color: #1B2A4A;">${productName}</td></tr>
              ${productSku ? `<tr><td style="padding: 6px 0; color: #7A7570;">SKU</td><td style="font-family: monospace; color: #1B2A4A;">${productSku}</td></tr>` : ''}
              <tr><td style="padding: 6px 0; color: #7A7570;">Quantity</td><td style="font-weight: 600; color: #1B2A4A;">${qty || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #7A7570;">Colour</td><td style="color: #1B2A4A;">${colour || '—'}</td></tr>
            </table>

            <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">🎨 Branding</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #7A7570; width: 160px;">Method</td><td style="color: #1B2A4A;">${brandingSummary}</td></tr>
              ${pmsHtml}
              ${extrasHtml}
              ${artworkHtml}
            </table>

            <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">🗓 Delivery</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              ${dateHtml}
              ${addressHtml}
            </table>

            <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">👤 Customer</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #7A7570; width: 160px;">Name</td><td style="font-weight: 600; color: #1B2A4A;">${name}</td></tr>
              ${company ? `<tr><td style="padding: 6px 0; color: #7A7570;">Company</td><td style="color: #1B2A4A;">${company}</td></tr>` : ''}
              <tr><td style="padding: 6px 0; color: #7A7570;">Email</td><td><a href="mailto:${email}" style="color: #C9A96E;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 6px 0; color: #7A7570;">Phone</td><td style="color: #1B2A4A;">${phone}</td></tr>` : ''}
            </table>

            ${notes ? `
            <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">💬 Notes</h2>
            <div style="background: #F8F7F4; border-radius: 8px; padding: 16px; font-size: 14px; color: #3D3A36; line-height: 1.6; white-space: pre-wrap; margin-bottom: 24px;">${notes}</div>
            ` : ''}

            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #F0EEED;">
              <a href="mailto:${email}?subject=Re: Quote for ${encodeURIComponent(productName)}" style="display: inline-block; background: #C9A96E; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
            </div>
          </div>
        </div>
      `,
    });

    // Auto-reply TO CUSTOMER
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [email],
      subject: `We've received your quote request — ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">QuirkyPromo</h1>
            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Corporate & Promotional Products</p>
          </div>
          <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px; margin: 0 0 16px;">Hi ${name},</p>
            <p style="font-size: 15px; margin: 0 0 16px;">Thanks for your enquiry! We've received your quote request for <strong>${productName}</strong> and will get back to you within 1 hour.</p>

            <div style="background: #F8F7F4; border-radius: 10px; padding: 16px 20px; margin: 20px 0; font-size: 14px;">
              <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Product:</span> <strong>${productName}</strong></div>
              <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Quantity:</span> <strong>${qty || '—'}</strong></div>
              ${colour ? `<div style="margin-bottom: 6px;"><span style="color: #7A7570;">Colour:</span> <strong>${colour}</strong></div>` : ''}
              ${brandingMethod ? `<div style="margin-bottom: 6px;"><span style="color: #7A7570;">Branding:</span> <strong>${brandingSummary}</strong></div>` : ''}
              ${requiredDate ? `<div><span style="color: #7A7570;">Required by:</span> <strong>${requiredDate}</strong></div>` : ''}
            </div>

            ${artworkFileName ? `<p style="font-size: 14px; color: #7A7570; margin: 0 0 16px;">📎 Please remember to email your artwork file <strong>${artworkFileName}</strong> to <a href="mailto:hello@quirkypromo.com.au" style="color: #C9A96E;">hello@quirkypromo.com.au</a></p>` : ''}

            <p style="font-size: 14px; color: #7A7570; margin: 0 0 8px;">In the meantime, feel free to call us:</p>
            <p style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin: 0 0 24px;">📞 02 9477 4748</p>
            <p style="font-size: 14px; color: #7A7570; margin: 0;">The QuirkyPromo Team</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Quote API error:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
