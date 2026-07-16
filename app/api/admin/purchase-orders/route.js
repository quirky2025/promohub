import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';
import { generatePurchaseOrderPDF } from '@/lib/poDocPdf';
import { nextPoNumber as allocPoNumber } from '@/lib/docNumbers';

const resend = new Resend(process.env.RESEND_API_KEY);

async function nextPoNumber(db) {
  return allocPoNumber(db);
}

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const db = sourcingDb();
    const { data, error } = await db.from('purchase_orders').select('*').order('created_at', { ascending: false });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ purchaseOrders: data || [] });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const b = await request.json();
    const db = sourcingDb();
    const subtotal = Number(b.costSubtotal) || 0;
    const freight = Number(b.freightCost) || 0;
    const po_number = await nextPoNumber(db);
    const { data, error } = await db.from('purchase_orders').insert({
      po_number,
      order_id: b.orderId || null,
      order_number: b.orderNumber || null,
      supplier_id: b.supplierId || null,
      status: b.status || 'draft',
      cost_subtotal: subtotal,
      freight_cost: freight,
      cost_total: Number((subtotal + freight).toFixed(2)),
      items: b.items || null,
      notes: b.notes || null,
      deliver_to: b.deliverTo || null,
      ...(b.poDate ? { created_at: new Date(b.poDate + 'T00:00:00').toISOString() } : {}),
    }).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });

    // Raising a PO means production has started — advance the linked order to
    // "In Production" (unless it's already dispatched/delivered/cancelled).
    if (b.orderId) {
      try {
        const { data: ord } = await db.from('orders').select('status').eq('id', b.orderId).single();
        const advanced = ['dispatched', 'delivered', 'completed', 'cancelled'];
        if (ord && !advanced.includes(ord.status)) {
          const { error: e1 } = await db.from('orders')
            .update({ status: 'in_production', production_started_at: new Date().toISOString() })
            .eq('id', b.orderId);
          if (e1 && /column|does not exist|could not find/i.test(e1.message || '')) {
            await db.from('orders').update({ status: 'in_production' }).eq('id', b.orderId);
          }
        }
      } catch (_) { /* non-fatal — PO still created */ }
    }

    return Response.json({ purchaseOrder: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const b = await request.json();
    if (!b.id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const db = sourcingDb();
    let updates = { updated_at: new Date().toISOString() };

    if (b.action === 'status') {
      updates.status = b.status;
    } else if (b.action === 'invoice') {
      updates.supplier_invoice_number = b.supplierInvoiceNumber || null;
      updates.supplier_invoice_at = new Date().toISOString();
    } else if (b.action === 'pay') {
      updates.supplier_payment_status = 'paid';
      updates.supplier_paid_at = new Date().toISOString();
      // Mirror the payment as money OUT in the Finance bank ledger, so the bank
      // balance drops automatically. NON-FATAL — never block marking paid.
      try {
        const { data: po } = await db.from('purchase_orders').select('*').eq('id', b.id).single();
        let supplier = null;
        if (po?.supplier_id) { const r = await db.from('suppliers').select('name').eq('id', po.supplier_id).single(); supplier = r.data; }
        const amt = Number(b.paidAmount) || Number(po?.cost_total) || 0;
        if (amt > 0) {
          await db.from('bank_transactions').insert({
            txn_date: new Date().toISOString().slice(0, 10),
            direction: 'out',
            amount_aud: amt,
            gst_aud: Math.round((amt / 11) * 100) / 100,
            business_line: 'local_stock',
            category: 'purchases',
            counterparty: supplier?.name || null,
            description: `Supplier payment · ${po?.po_number || ''}${po?.supplier_invoice_number ? ' · inv ' + po.supplier_invoice_number : ''}`,
            reference: po?.po_number || null,
            reconciled: true,
            source: 'system',
            linked_type: 'purchase_order',
            linked_id: b.id,
            created_by: user.email,
          });
        }
      } catch (_) { /* finance ledger optional / may not exist yet */ }
    } else if (b.action === 'details') {
      const subtotal = Number(b.costSubtotal) || 0;
      const freight = Number(b.freightCost) || 0;
      updates.cost_subtotal = subtotal;
      updates.freight_cost = freight;
      updates.cost_total = Number((subtotal + freight).toFixed(2));
      if (b.notes !== undefined) updates.notes = b.notes || null;
      if (b.supplierId !== undefined) updates.supplier_id = b.supplierId || null;
      if (b.items !== undefined) updates.items = b.items || null;
      if (b.deliverTo !== undefined) updates.deliver_to = b.deliverTo || null;
      if (b.poDate) updates.created_at = new Date(b.poDate + 'T00:00:00').toISOString();
    } else if (b.action === 'send') {
      // Email the PO PDF straight to the supplier's email on file.
      const { data: po } = await db.from('purchase_orders').select('*').eq('id', b.id).single();
      if (!po) return Response.json({ error: 'PO not found' }, { status: 404 });
      let supplier = null, order = null;
      if (po.supplier_id) { const r = await db.from('suppliers').select('*').eq('id', po.supplier_id).single(); supplier = r.data; }
      if (po.order_id) { const r = await db.from('orders').select('*').eq('id', po.order_id).single(); order = r.data; }
      if (!supplier?.email) return Response.json({ error: 'This supplier has no email — add one in Suppliers first.' }, { status: 400 });

      const items = (Array.isArray(po.items) && po.items.length)
        ? po.items
        : (Array.isArray(order?.items)
          ? order.items.map(it => ({ stockCode: it.sku || it.stockCode || '', name: it.productName || it.name || '', qty: it.qty || it.quantity || 1, branding: it.branding || it.brandingMethod || '' }))
          : []);

      const bytes = await generatePurchaseOrderPDF({
        poNumber: po.po_number,
        date: new Date(po.created_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
        ourRef: po.order_number || order?.order_number || '',
        jobName: order?.job_name || order?.customer_company || '',
        deliver: po.deliver_to
          ? { company: '', name: '', phone: '', address: po.deliver_to }
          : {
              company: order?.customer_company || '',
              name: order?.customer_name || '',
              phone: order?.customer_phone || '',
              address: order?.delivery_address || '',
            },
        items: items.map(it => ({ stockCode: it.stockCode, name: it.name, qty: it.qty, unitCost: it.unitCost, branding: it.branding })),
        freight: po.freight_cost,
      });

      const greeting = supplier.contact_name || supplier.name || 'there';
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
        replyTo: 'hello@quirkypromo.com.au',
        to: [supplier.email],
        subject: `Purchase Order ${po.po_number} — QuirkyPromo`,
        html: quirkyEmail(`
          <p style="font-size:15px;margin:0 0 16px;">Hi ${greeting},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Please find attached our Purchase Order <strong>${po.po_number}</strong>. Could you please confirm receipt and the expected dispatch date?</p>
          <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Many thanks,<br/>The QuirkyPromo Team</p>`),
        attachments: [{ filename: `PO_${po.po_number}.pdf`, content: Buffer.from(bytes).toString('base64') }],
      });

      updates.status = 'sent';
    } else {
      return Response.json({ error: 'Unknown action' }, { status: 400 });
    }

    const { data, error } = await db.from('purchase_orders').update(updates).eq('id', b.id).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ purchaseOrder: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// DELETE ?id=… → remove a whole PO (and any bank ledger entry it posted).
export async function DELETE(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  const db = sourcingDb();
  try { await db.from('bank_transactions').delete().eq('linked_type', 'purchase_order').eq('linked_id', id); } catch (_) { /* finance optional */ }
  const { error } = await db.from('purchase_orders').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
