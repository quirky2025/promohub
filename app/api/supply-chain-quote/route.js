import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      productDescription, quantity, targetPrice, inHandsDate, freightPreference,
      brandingRequirements, colourRequirements, decorationMethod,
      forChildren, deliveryState, complianceNotes,
      companyName, name, email, phone, notes,
    } = body;

    if (!email || !name || !companyName || !productDescription) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const submittedAt = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });

    // Save to Supabase
    await supabase.from('sourcing_requests').insert({
      product_description: productDescription,
      quantity,
      target_price: targetPrice || null,
      in_hands_date: inHandsDate || null,
      freight_preference: freightPreference || null,
      branding_requirements: brandingRequirements,
      colour_requirements: colourRequirements || null,
      decoration_method: decorationMethod || null,
      for_children: forChildren,
      delivery_state: deliveryState,
      compliance_notes: complianceNotes || null,
      company_name: companyName,
      contact_name: name,
      email,
      phone: phone || null,
      notes: notes || null,
      status: 'new',
    });

    const freightLabels = {
      express: 'Express (5–7 days)',
      air: 'Air Freight (20 days)',
      sea: 'Sea Freight (45 days)',
      local: 'Local stock only',
      '': 'Not specified',
    };

    const childrenLabels = {
      yes: 'Yes — under 14 years',
      no: 'No — adult use',
      mixed: 'Mixed / general public',
    };

    // Internal email
    const internalHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">New Sourcing Quote Request</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Submitted ${submittedAt} · QuirkyPromo Supply Chain</p>
        </div>
        <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 13px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">📦 Product Requirements</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #7A7570; width: 180px; vertical-align: top;">Product Description</td><td style="font-weight: 600; color: #1B2A4A; white-space: pre-wrap;">${productDescription}</td></tr>
            <tr><td style="padding: 6px 0; color: #7A7570;">Quantity Required</td><td style="font-weight: 600; color: #1B2A4A;">${quantity}</td></tr>
            ${targetPrice ? `<tr><td style="padding: 6px 0; color: #7A7570;">Target Unit Price</td><td>${targetPrice}</td></tr>` : ''}
            ${inHandsDate ? `<tr><td style="padding: 6px 0; color: #7A7570;">In-Hands Date</td><td style="font-weight: 600; color: #C0392B;">${inHandsDate}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #7A7570;">Freight Preference</td><td>${freightLabels[freightPreference] || freightPreference || 'Not specified'}</td></tr>
          </table>
          <h2 style="font-size: 13px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">🎨 Branding & Compliance</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #7A7570; width: 180px; vertical-align: top;">Branding Requirements</td><td style="white-space: pre-wrap;">${brandingRequirements}</td></tr>
            ${colourRequirements ? `<tr><td style="padding: 6px 0; color: #7A7570;">Colour Requirements</td><td>${colourRequirements}</td></tr>` : ''}
            ${decorationMethod ? `<tr><td style="padding: 6px 0; color: #7A7570;">Decoration Method</td><td>${decorationMethod}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #7A7570;">For Children</td><td>${childrenLabels[forChildren] || forChildren}</td></tr>
            <tr><td style="padding: 6px 0; color: #7A7570;">Delivery State</td><td><strong>${deliveryState}</strong></td></tr>
            ${complianceNotes ? `<tr><td style="padding: 6px 0; color: #7A7570; vertical-align: top;">Compliance Notes</td><td style="white-space: pre-wrap;">${complianceNotes}</td></tr>` : ''}
          </table>
          <h2 style="font-size: 13px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">👤 Customer Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #7A7570; width: 180px;">Name</td><td style="font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 6px 0; color: #7A7570;">Company</td><td style="font-weight: 600;">${companyName}</td></tr>
            <tr><td style="padding: 6px 0; color: #7A7570;">Email</td><td><a href="mailto:${email}" style="color: #C9A96E;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 6px 0; color: #7A7570;">Phone</td><td>${phone}</td></tr>` : ''}
          </table>
          ${notes ? `<h2 style="font-size: 13px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">💬 Additional Notes</h2><div style="background: #F8F7F4; border-radius: 8px; padding: 16px; font-size: 14px; color: #3D3A36; white-space: pre-wrap; margin-bottom: 24px;">${notes}</div>` : ''}
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #F0EEED;">
            <a href="mailto:${email}?subject=Re: Sourcing Quote Request from ${encodeURIComponent(companyName)}" style="display: inline-block; background: #C9A96E; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
          </div>
        </div>
      </div>
    `;

    // Customer confirmation email
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">QuirkyPromo</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Sourcing Quote Request Received</p>
        </div>
        <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; margin: 0 0 16px;">Hi ${name},</p>
          <p style="font-size: 15px; margin: 0 0 24px;">Thank you for your sourcing enquiry! Our team will review your requirements and get back to you within <strong>24–48 business hours</strong>.</p>
          <div style="background: #F8F7F4; border-radius: 10px; padding: 20px 24px; margin: 0 0 24px; font-size: 14px;">
            <div style="font-weight: 700; color: #1B2A4A; margin-bottom: 12px;">Your Request Summary</div>
            <div style="margin-bottom: 8px;"><span style="color: #7A7570;">Product:</span> <strong>${productDescription.slice(0, 80)}${productDescription.length > 80 ? '...' : ''}</strong></div>
            <div style="margin-bottom: 8px;"><span style="color: #7A7570;">Quantity:</span> <strong>${quantity}</strong></div>
            ${inHandsDate ? `<div style="margin-bottom: 8px;"><span style="color: #7A7570;">In-Hands Date:</span> <strong style="color: #C0392B;">${inHandsDate}</strong></div>` : ''}
            <div><span style="color: #7A7570;">Delivery State:</span> <strong>${deliveryState}</strong></div>
          </div>
          <p style="font-size: 14px; color: #7A7570; margin: 0 0 8px;">Questions? Contact us directly:</p>
          <p style="font-size: 16px; font-weight: 700; color: #1B2A4A; margin: 0 0 4px;">📞 02 9477 4748</p>
          <p style="font-size: 14px; color: #7A7570; margin: 0 0 24px;"><a href="mailto:hello@quirkypromo.com.au" style="color: #C9A96E;">hello@quirkypromo.com.au</a></p>
          <p style="font-size: 14px; color: #7A7570; margin: 0;">The QuirkyPromo Team</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      to: ['hello@quirkypromo.com.au'],
      replyTo: email,
      subject: `New Sourcing Quote Request — ${companyName} · ${quantity} units`,
      html: internalHtml,
    });

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [email],
      subject: `Your Sourcing Quote Request — QuirkyPromo`,
      html: customerHtml,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Supply chain quote error:', error);
    return Response.json({ error: 'Failed to send quote request' }, { status: 500 });
  }
}
