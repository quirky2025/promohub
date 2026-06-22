import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { generatePurchaseOrderPDF } from '@/lib/poDocPdf';

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const db = sourcingDb();
    const { data: po } = await db.from('purchase_orders').select('*').eq('id', id).single();
    if (!po) return Response.json({ error: 'PO not found' }, { status: 404 });

    let supplier = null, order = null;
    if (po.supplier_id) { const r = await db.from('suppliers').select('*').eq('id', po.supplier_id).single(); supplier = r.data; }
    if (po.order_id) { const r = await db.from('orders').select('*').eq('id', po.order_id).single(); order = r.data; }

    const termsLabel = supplier?.payment_terms === 'account' ? 'Monthly account' : 'Prepaid';
    const items = (Array.isArray(po.items) && po.items.length)
      ? po.items
      : (Array.isArray(order?.items)
        ? order.items.map(it => ({ stockCode: it.sku || it.stockCode || '', name: it.productName || it.name || '', qty: it.qty || it.quantity || 1, branding: it.branding || it.brandingMethod || '' }))
        : []);

    const bytes = await generatePurchaseOrderPDF({
      poNumber: po.po_number,
      date: new Date(po.created_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
      supplier: { name: supplier?.name || '', email: supplier?.email || '', terms: termsLabel },
      deliverTo: order?.delivery_address || '',
      ourRef: (po.order_number || order?.order_number || '') + (order?.job_name ? ` (${order.job_name})` : ''),
      items,
      subtotal: po.cost_subtotal,
      freight: po.freight_cost,
      total: po.cost_total,
      notes: po.notes || '',
    });

    return new Response(Buffer.from(bytes), {
      headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="PO_${po.po_number}.pdf"` },
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
