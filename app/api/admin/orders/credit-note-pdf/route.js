import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { generateOrderDocPDF, QUIRKY_BANK } from '@/lib/orderDocPdf';

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// GET ?id=<order id>&reason=... → a Credit Note (customer overpaid after a
// spec change) OR an Adjustment / Balance-due note (customer owes more).
// The amount is the difference between the revised order total and what the
// customer already paid (orders.amount_paid).
export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const reason = searchParams.get('reason') || '';
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const db = sourcingDb();
    const { data: order } = await db.from('orders').select('*').eq('id', id).single();
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    const paid = order.amount_paid != null ? Number(order.amount_paid) : Number(order.total) || 0;
    const delta = round2((Number(order.total) || 0) - paid);   // + = customer owes more, − = credit
    if (Math.abs(delta) < 0.01) return Response.json({ error: 'No adjustment to note (paid = revised total)' }, { status: 400 });

    const credit = delta < 0;
    const amt = Math.abs(delta);               // inc GST
    const ex = round2(amt / 1.1);
    const gst = round2(amt - ex);

    const orderNumber = order.order_number || order.invoice_number || '';
    const docType = credit ? 'CREDIT NOTE' : 'ADJUSTMENT - BALANCE DUE';
    const lineName = reason || (credit
      ? 'Credit - final specification change'
      : 'Additional charge - final specification change');

    const bytes = await generateOrderDocPDF({
      docType,
      orderNumber,
      date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
      customer: {
        company: order.customer_company || '', name: order.customer_name || '',
        email: order.customer_email || '', phone: order.customer_phone || '',
      },
      deliveryAddress: order.delivery_address || '',
      items: [{ stockCode: '', name: lineName, colour: '', branding: '', addons: [], qty: 1, unit: ex, lineTotal: ex }],
      subtotal: ex,
      shipping: 0,
      gst,
      total: amt,
      paymentStatus: credit ? 'paid' : 'awaiting',
      leadTimeDays: '3-7',
      bank: QUIRKY_BANK,
    });

    return new Response(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${credit ? 'CreditNote' : 'Balance'}_${orderNumber}.pdf"`,
      },
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
