import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { generateFactoryPoPDF } from '@/lib/factoryPoDocPdf';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);

const fmtDate = (d) =>
  new Date(d || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

// POST { orderId, toOverride? } → emails the Factory PO (PDF) to the factory.
export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const { orderId, toOverride } = await request.json();
    if (!orderId) return Response.json({ error: 'orderId is required' }, { status: 400 });

    const db = sourcingDb();
    const { data: o, error } = await db
      .from('sourcing_orders')
      .select('*, factories(id, name, contact_person, wechat, phone, address, email, payment_terms)')
      .eq('id', orderId)
      .single();
    if (error || !o) return Response.json({ error: 'Order not found' }, { status: 404 });

    const factory = o.factories || {};
    const to = (toOverride || factory.email || '').trim();
    if (!to || !to.includes('@')) {
      return Response.json({ error: 'No factory email. Add it in 工厂管理 (Factory → Email), or pass an address.' }, { status: 400 });
    }

    const charges = [];
    if (Number(o.setup_cost_rmb)) charges.push({ label: 'Setup / plate', amountRmb: o.setup_cost_rmb });
    if (Number(o.tooling_cost_rmb)) charges.push({ label: 'Tooling / mould', amountRmb: o.tooling_cost_rmb });
    if (Number(o.sample_cost_rmb)) charges.push({ label: 'Pre-production sample', amountRmb: o.sample_cost_rmb });

    const bytes = await generateFactoryPoPDF({
      poNumber: o.factory_po_number,
      date: fmtDate(o.created_at),
      ourRef: o.order_number,
      supplier: {
        name: factory.name,
        contact: factory.contact_person,
        phone: [factory.phone, factory.wechat ? `WeChat: ${factory.wechat}` : null].filter(Boolean).join('  '),
        address: factory.address,
      },
      shipTo: {
        label: 'Our forwarder (EXW collection)',
        address: 'To be advised — please hold for collection and notify us when ready.',
      },
      incoterm: o.incoterm || 'EXW',
      paymentTerms: factory.payment_terms || '30% deposit, 70% before shipment',
      items: [{ name: o.product_name, spec: o.product_spec, qty: o.quantity, unitRmb: o.exw_unit_rmb }],
      charges,
      notes: o.internal_notes || '',
    });

    const body = `
      <p style="font-size:15px;margin:0 0 16px;color:#000;">Hi ${factory.contact_person || 'there'},</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#000;">Please find attached our Purchase Order <strong>${o.factory_po_number}</strong> for <strong>${o.product_name}</strong> (Qty ${o.quantity}). Could you please confirm receipt and the expected completion date?</p>
      <p style="font-size:14px;line-height:1.6;color:#000;margin:16px 0 0;">Thank you,<br>QuirkyPromo Sourcing · hello@quirkypromo.com.au</p>`;

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [to],
      subject: `Purchase Order ${o.factory_po_number} — QuirkyPromo`,
      html: quirkyEmail(body),
      attachments: [{ filename: `PO_${o.factory_po_number}.pdf`, content: Buffer.from(bytes).toString('base64') }],
    });

    // best-effort: record that we sent it (ignore if column absent)
    await db.from('sourcing_orders').update({ po_sent_at: new Date().toISOString() }).eq('id', orderId);

    return Response.json({ success: true, to });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
