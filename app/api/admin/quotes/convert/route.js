import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';
import { generateOrderDocPDF } from '@/lib/orderDocPdf';

const resend = new Resend(process.env.RESEND_API_KEY);

async function nextOrderNumber(db) {
  const year = String(new Date().getFullYear()).slice(2);
  const { count } = await db.from('orders').select('*', { count: 'exact', head: true });
  return `OC${year}${String((count || 0) + 1).padStart(4, '0')}`;
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
    try {
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
        <div style="background:#F8F7F4;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;">
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
