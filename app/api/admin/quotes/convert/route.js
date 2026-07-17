import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';
import { generateOrderDocPDF } from '@/lib/orderDocPdf';
import { nextOrderNumber as allocOrderNumber } from '@/lib/docNumbers';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

async function nextOrderNumber(db) {
  return allocOrderNumber(db);
}

// Convert an accepted quote into a confirmed order (Pay Later / EFT).
// The order then flows through the normal pipeline: artwork -> tax invoice
// after approval -> payment -> production -> dispatch.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { quoteId } = await request.json();
    if (!quoteId) return Response.json({ error: 'Missing quoteId' }, { status: 400 });
    const db = sourcingDb();

    const { data: q, error: qErr } = await db.from('quotes').select('*').eq('quote_number', quoteId).single();
    if (qErr || !q) return Response.json({ error: 'Quote not found' }, { status: 404 });
    if (q.converted_order_number) {
      return Response.json({ error: `Already converted to ${q.converted_order_number}` }, { status: 400 });
    }

    // INDENT (China) quotes: gate on PROCEED (status accepted), and do NOT email
    // the customer or force an artwork card here (Lily controls those).
    const isIndent = q.quote_type === 'indent';
    if (isIndent && q.status !== 'won' && q.status !== 'accepted') {
      return Response.json({ error: '请先标记 PROCEED(客户同意)再转订单' }, { status: 400 });
    }

    const orderNumber = await nextOrderNumber(db);
    const qty = Number(q.quantity) || 1;
    const subtotal = Number(q.subtotal) || 0;
    const unitPrice = qty ? Number((subtotal / qty).toFixed(2)) : subtotal;
    const items = [{
      productName: q.product_name || 'Product',
      sku: q.product_sku || '',
      stockCode: q.product_sku || '',
      colour: q.colour || '',
      branding: q.branding_summary || q.branding_method || '',
      qty,
      unitPrice,
      subtotal,
      ...(isIndent ? { sourcing_product_id: q.sourcing_product_id || null, indent: true } : {}),
    }];

    const orderRow = {
      order_number: orderNumber,
      invoice_number: orderNumber,
      status: 'confirmed',
      payment_terms: 'prepaid',
      payment_method: 'eft',
      payment_status: 'unpaid',
      customer_name: q.customer_name,
      customer_email: q.customer_email,
      customer_phone: q.customer_phone || '',
      customer_company: q.customer_company || '',
      delivery_address: q.delivery_address || '',
      items,
      subtotal,
      shipping: Number(q.shipping) || 0,
      gst: Number(q.gst) || 0,
      total: Number(q.total) || 0,
      total_net: Number((subtotal + (Number(q.shipping) || 0)).toFixed(2)),
      gst_total: Number(q.gst) || 0,
      total_gross: Number(q.total) || 0,
      quote_ref: q.quote_number || null,
      order_type: isIndent ? 'indent' : 'local',
      sourcing_quote_ref: isIndent ? (q.quote_number || null) : null,
      // INDENT items with no branding need no artwork → skip the artwork gate.
      artwork_required: !(isIndent && items.every((it) => !it.branding)),
      created_at: new Date().toISOString(),
    };

    let { error } = await db.from('orders').insert(orderRow);
    if (error && /column|does not exist|could not find/i.test(error.message || '')) {
      const legacy = {
        invoice_number: orderNumber, customer_name: q.customer_name, customer_email: q.customer_email,
        customer_phone: q.customer_phone || '', customer_company: q.customer_company || '',
        delivery_address: q.delivery_address || '', items, subtotal, shipping: Number(q.shipping) || 0,
        gst: Number(q.gst) || 0, total: Number(q.total) || 0, payment_method: 'eft', payment_status: 'unpaid',
        created_at: new Date().toISOString(),
      };
      ({ error } = await db.from('orders').insert(legacy));
    }
    if (error) return Response.json({ error: error.message }, { status: 500 });

    // Order Confirmation PDF + email (OC only — Pay Later). Non-fatal if it fails.
    // INDENT (China) orders skip the auto-email + auto-artwork entirely — Lily
    // sends the invoice / proof herself and artwork may not apply (no print).
    if (!isIndent) try {
      const ocBuffer = await generateOrderDocPDF({
        orderNumber,
        date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
        customer: { company: q.customer_company, name: q.customer_name, email: q.customer_email, phone: q.customer_phone },
        deliveryAddress: q.delivery_address || '',
        items: items.map(it => ({ stockCode: it.sku, name: it.productName, colour: it.colour, branding: it.branding, addons: [], qty: it.qty, unit: it.unitPrice, lineTotal: it.subtotal })),
        subtotal, shipping: Number(q.shipping) || 0, gst: Number(q.gst) || 0, total: Number(q.total) || 0,
        paymentStatus: 'awaiting', leadTimeDays: '3-7', quoteRef: q.quote_number || '',
        docType: 'ORDER CONFIRMATION',
      });
      const body = `
        <p style="font-size:15px;margin:0 0 16px;">Hi ${q.customer_name || 'there'},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Thank you for confirming your order from quote <strong>${q.quote_number || ''}</strong> — we're thrilled to be making it for you! Your <strong>Order Confirmation</strong> is attached as a PDF.</p>
        <div style="background:#ffffff;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;">
          <span style="color:#7A7570;">Order</span> <strong style="color:#1B2A4A;">${orderNumber}</strong>
          &nbsp;&middot;&nbsp; <span style="color:#7A7570;">Status</span> <strong style="color:#2D6A4F;">&#10003; Order confirmed</strong>
          &nbsp;&middot;&nbsp; <span style="color:#7A7570;">Next step</span> <strong style="color:#1B2A4A;">Artwork approval</strong>
        </div>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Here's what happens next: we'll email you a <strong>free digital proof</strong> to approve. Once you're happy with it and payment has been received, we'll get straight into production.</p>
        <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Any questions at all, just reply or call us on <strong>02 9477 4748</strong>.</p>`;
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>', replyTo: 'hello@quirkypromo.com.au',
        to: [q.customer_email], subject: `Order Confirmation - ${orderNumber}`,
        html: quirkyEmail(body),
        attachments: [{ filename: `OrderConfirmation_${orderNumber}.pdf`, content: ocBuffer.toString('base64') }],
      });
    } catch (_) { /* email/PDF failure must not block conversion */ }

    // Create an Artwork record + email the customer to upload their logo, so the
    // converted order appears in the Artworks board and we can produce the mockup.
    // INDENT orders skip this — Lily handles factory artwork/proof herself.
    if (!isIndent) try {
      const token = crypto.randomBytes(32).toString('hex');
      const hasLogo = !!q.artwork_url;
      await db.from('artworks').insert({
        order_number: orderNumber,
        customer_name: q.customer_name,
        customer_email: q.customer_email,
        product_name: q.product_name || 'Product',
        status: hasLogo ? 'logo_received' : 'awaiting_logo',
        logo_url: q.artwork_url || null,
        token,
        payment_method: 'eft',
      });
      const uploadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/upload/${token}`;
      if (!hasLogo) await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>', replyTo: 'hello@quirkypromo.com.au',
        to: [q.customer_email],
        subject: `One quick step for your order ${orderNumber} — upload your logo`,
        html: quirkyEmail(`
          <p style="font-size:15px;margin:0 0 16px;">Hi ${q.customer_name},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Thank you so much for your order of <strong>${q.product_name || 'your product'}</strong> — we can't wait to get started! To create your free artwork mockup, we just need your logo file.</p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${uploadUrl}" style="display:inline-block;background:#C9A96E;color:#fff;text-decoration:none;padding:15px 38px;border-radius:10px;font-weight:700;font-size:16px;">Upload your logo &rarr;</a>
          </div>
          <div style="background:#ffffff;border-radius:10px;padding:16px 20px;margin:0 0 16px;font-size:14px;">
            <div style="font-weight:700;color:#1B2A4A;margin-bottom:8px;">Accepted file formats</div>
            <div style="color:#000000;font-weight:700;">VECTOR FILES ONLY — AI, PDF, EPS or SVG. We cannot print from PNG or JPG.</div>
          </div>
          <p style="font-size:14px;line-height:1.6;color:#7A7570;margin:0;">Prefer email? Send your logo to <a href="mailto:hello@quirkypromo.com.au" style="color:#C9A96E;">hello@quirkypromo.com.au</a> and quote <strong>${orderNumber}</strong>.</p>
        `),
      });
    } catch (_) { /* non-fatal — order already created */ }

    // Mark the quote converted.
    let { error: uErr } = await db.from('quotes').update({ status: 'accepted', converted_order_number: orderNumber }).eq('quote_number', quoteId);
    if (uErr && /column|does not exist|could not find/i.test(uErr.message || '')) {
      await db.from('quotes').update({ status: 'accepted' }).eq('quote_number', quoteId);
    }

    return Response.json({ success: true, orderNumber });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
