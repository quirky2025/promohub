import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

async function nextPoNumber(db) {
  const year = String(new Date().getFullYear()).slice(2);
  const { count } = await db.from('purchase_orders').select('*', { count: 'exact', head: true });
  return `SP${year}${String((count || 0) + 1).padStart(4, '0')}`;
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
    }).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
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
    } else if (b.action === 'details') {
      const subtotal = Number(b.costSubtotal) || 0;
      const freight = Number(b.freightCost) || 0;
      updates.cost_subtotal = subtotal;
      updates.freight_cost = freight;
      updates.cost_total = Number((subtotal + freight).toFixed(2));
      if (b.notes !== undefined) updates.notes = b.notes || null;
      if (b.supplierId !== undefined) updates.supplier_id = b.supplierId || null;
      if (b.items !== undefined) updates.items = b.items || null;
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
