import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { generateOrderDocPDF, QUIRKY_BANK } from '@/lib/orderDocPdf';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Customer order / Order Confirmation number: OC260001
async function generateOrderNumber() {
  const year = String(new Date().getFullYear()).slice(2);
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  const num = String((count || 0) + 1).padStart(4, '0');
  return `OC${year}${num}`;
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { customer, items, subtotal, shipping, gst, total, paymentMethod, surcharge, stripePaymentId } = body;

    // ✅ Stripe服务端验证
    let paymentStatus = 'unpaid';
    if (paymentMethod === 'stripe') {
      if (!stripePaymentId) {
        return Response.json({ error: 'Missing payment ID' }, { status: 400 });
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentId);
      if (paymentIntent.status !== 'succeeded') {
        return Response.json({ error: 'Payment not completed' }, { status: 400 });
      }
      paymentStatus = 'paid';
    }

    const orderNumber = await generateOrderNumber();
    const invoiceDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

    const deliveryAddress = [
      customer.street, customer.street2, customer.suburb,
      customer.state, customer.postcode, 'Australia'
    ].filter(Boolean).join(', ');

    // Save to Supabase — write a proper CONFIRMED order so it lands in the
    // admin Orders pipeline (not the "quote" tab) with correct totals.
    const orderRow = {
      order_number: orderNumber,
      invoice_number: orderNumber,          // kept for back-compat / fallback
      status: 'confirmed',                  // real order, not a quote
      payment_terms: paymentMethod === 'eft' ? 'prepaid' : 'prepaid',
      payment_method: paymentMethod,
      payment_status: paymentStatus === 'paid' ? 'paid' : 'unpaid',
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      customer_company: customer.company || '',
      delivery_address: deliveryAddress,
      delivery_address_json: {
        line1: customer.street || '', line2: customer.street2 || '',
        suburb: customer.suburb || '', state: customer.state || '',
        postcode: customer.postcode || '', country: 'Australia',
      },
      items,                                 // legacy JSON (admin board fallback)
      subtotal,
      shipping,
      gst,
      total,
      total_net: Number(((subtotal || 0) + (shipping || 0)).toFixed(2)),
      gst_total: gst,
      total_gross: total,
      created_at: new Date().toISOString(),
    };
    let { error } = await supabase.from('orders').insert(orderRow);
    if (error && /column|does not exist|could not find/i.test(error.message || '')) {
      // Fallback for environments missing the newer columns
      const legacy = {
        invoice_number: orderNumber,
        customer_name: customer.name, customer_email: customer.email,
        customer_phone: customer.phone || '', customer_company: customer.company || '',
        delivery_address: deliveryAddress, items, subtotal, shipping, gst, total,
        payment_method: paymentMethod, payment_status: paymentStatus,
        created_at: new Date().toISOString(),
      };
      ({ error } = await supabase.from('orders').insert(legacy));
    }
    if (error) throw error;

    // ✅ Generate Order Confirmation / Tax Invoice PDF (shared QUOTE-style template)
    const deliveryLines = [
      customer.street, customer.street2,
      [customer.suburb, customer.state, customer.postcode].filter(Boolean).join(' '),
    ].filter(Boolean).join('\n');
    const docOpts = {
      orderNumber,
      date: invoiceDate,
      customer: { company: customer.company, name: customer.name, email: customer.email, phone: customer.phone },
      deliveryAddress: deliveryLines,
      items: (items || []).map(it => ({
        stockCode: it.sku || it.productSku || it.stockCode || '',
        name: it.productName || it.name || 'Product',
        colour: it.colour || '',
        branding: it.branding || '',
        addons: Array.isArray(it.addons) ? it.addons.map(a => a.name || a) : [],
        qty: it.qty || it.quantity || 1,
        unit: it.unitPrice || it.unit || 0,
        lineTotal: it.subtotal != null ? it.subtotal : null,
      })),
      subtotal,
      shipping,
      gst,
      surcharge: surcharge || 0,
      total,
      paymentStatus: paymentStatus === 'paid' ? 'paid' : 'awaiting',
      leadTimeDays: '3-7',
      bank: QUIRKY_BANK,
    };
    const isPaidOrder = paymentStatus === 'paid';
    const ocBuffer = await generateOrderDocPDF({ ...docOpts, docType: 'ORDER CONFIRMATION' });
    const ocB64 = ocBuffer.toString('base64');
    // Tax Invoice is emailed at order time ONLY when already paid (Stripe).
    // For Pay Later / EFT, the Tax Invoice (amount due + how to pay) is sent
    // AFTER artwork approval — not now. So order email = Order Confirmation only.
    let invB64 = null;
    if (isPaidOrder) {
      const invBuffer = await generateOrderDocPDF({ ...docOpts, docType: 'TAX INVOICE' });
      invB64 = invBuffer.toString('base64');
    }
    const attachments = [{ filename: `OrderConfirmation_${orderNumber}.pdf`, content: ocB64 }];
    if (invB64) attachments.push({ filename: `TaxInvoice_${orderNumber}.pdf`, content: invB64 });

    // Warm customer email — no navy top bar, details live in the attached PDF.
    const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // Paid (Stripe): show a payment-received note. Pay Later / EFT: no bank
    // details here — they arrive with the Tax Invoice after proof approval.
    const payBox = isPaidOrder ? `
          <div style="background:#F0FAF4;border:1px solid #2D6A4F;border-radius:10px;padding:14px 18px;margin:16px 0;">
            <span style="color:#2D6A4F;font-weight:700;">Payment received — thank you!</span>
          </div>` : '';

    const emailHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <div style="padding:8px 4px 0;">
          <p style="font-size:15px;margin:0 0 16px;">Hi ${customer.name},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Thank you so much for your order — we're thrilled to be making it for you! Your <strong>Order Confirmation</strong>${isPaidOrder ? ' and <strong>Tax Invoice</strong> are attached as PDFs' : ' is attached as a PDF'} for your records.</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Here's what happens next: we'll email you a <strong>free digital proof</strong> to approve. Once you're happy with it${paymentMethod === 'eft' ? ' and payment has been received' : ''}, we'll get straight into production.</p>
          <div style="background:#F8F7F4;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;">
            <span style="color:#7A7570;">Order</span> <strong style="color:#1B2A4A;">${orderNumber}</strong>
            &nbsp;·&nbsp; <span style="color:#7A7570;">Status</span> <strong style="color:#2D6A4F;">✓ Order confirmed${isPaidOrder ? ' &amp; paid' : ''}</strong>
            &nbsp;·&nbsp; <span style="color:#7A7570;">Next step</span> <strong style="color:#1B2A4A;">Artwork approval</strong>
          </div>
          ${payBox}
          <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Any questions at all, just reply to this email or call us on <strong>02 9477 4748</strong> — we're always happy to help.</p>
        </div>
        <div style="padding-top:16px;border-top:1px solid #E0DDD7;margin-top:24px;">
          <div style="font-size:20px;font-weight:800;letter-spacing:-0.3px;margin-bottom:10px;"><span style="color:#C9A96E;">Quirky</span><span style="color:#1B2A4A;">Promo</span></div>
          <p style="color:#1a1a1a;font-size:14px;margin:0 0 2px;">Kind regards,</p>
          <p style="color:#1B2A4A;font-size:15px;font-weight:700;margin:0 0 8px;">The QuirkyPromo Team</p>
          <p style="color:#3D3A36;font-size:13px;margin:0;">Tel: <strong style="color:#1B2A4A;">02 9477 4748</strong>  ·  Email: <a href="mailto:hello@quirkypromo.com.au" style="color:#C9A96E;">hello@quirkypromo.com.au</a>  ·  Web: <a href="https://www.quirkypromo.com.au" style="color:#C9A96E;">quirkypromo.com.au</a></p>
          <p style="color:#7A7570;font-size:11px;margin:8px 0 0;">ABN 95 656 714 270</p>
        </div>
      </div>
    `;

    // ✅ Email to customer with PDF
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [customer.email],
      subject: isPaidOrder ? `Order Confirmation & Tax Invoice — ${orderNumber}` : `Order Confirmation — ${orderNumber}`,
      html: emailHtml,
      attachments,
    });

    // ✅ Email to you with PDF
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: customer.email,
      to: ['hello@quirkypromo.com.au'],
      subject: `New Order: ${orderNumber} — ${customer.name}`,
      html: emailHtml,
      attachments,
    });

    return Response.json({ success: true, orderNumber });
  } catch (error) {
    return Response.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
