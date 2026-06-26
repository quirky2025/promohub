import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { generateOrderDocPDF } from '@/lib/orderDocPdf';
import { generateFactoryPoPDF } from '@/lib/factoryPoDocPdf';

const fmtDate = (d) =>
  new Date(d || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

// GET ?id=<sourcing_order_id>&doc=oc|po  -> streams the PDF.
export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const doc = (searchParams.get('doc') || 'oc').toLowerCase();
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 });

  const db = sourcingDb();
  const { data: o, error } = await db
    .from('sourcing_orders')
    .select('*, factories(id, name, contact_person, wechat, phone, address, payment_terms), sourcing_cost_sheets(sheet_number)')
    .eq('id', id)
    .single();
  if (error || !o) return Response.json({ error: 'Order not found' }, { status: 404 });

  try {
    let bytes;
    let filename;

    if (doc === 'po') {
      const factory = o.factories || {};
      const charges = [];
      if (Number(o.setup_cost_rmb)) charges.push({ label: 'Setup / plate', amountRmb: o.setup_cost_rmb });
      if (Number(o.tooling_cost_rmb)) charges.push({ label: 'Tooling / mould', amountRmb: o.tooling_cost_rmb });
      if (Number(o.sample_cost_rmb)) charges.push({ label: 'Pre-production sample', amountRmb: o.sample_cost_rmb });

      bytes = await generateFactoryPoPDF({
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
        incoterm: 'EXW',
        paymentTerms: factory.payment_terms || '30% deposit, 70% before shipment',
        items: [{
          name: o.product_name,
          spec: o.product_spec,
          qty: o.quantity,
          unitRmb: o.exw_unit_rmb,
        }],
        charges,
        notes: o.internal_notes || '',
      });
      filename = `FactoryPO_${o.factory_po_number || o.order_number}.pdf`;
    } else {
      const sheetNo = o.sourcing_cost_sheets?.sheet_number || '';
      bytes = await generateOrderDocPDF({
        orderNumber: o.order_number,
        date: fmtDate(o.created_at),
        customer: {
          company: o.customer_company,
          name: o.customer_name,
          email: o.customer_email,
          phone: o.customer_phone,
        },
        deliveryAddress: o.delivery_address || '',
        items: [{
          stockCode: o.product_code || '',
          name: o.product_name,
          colour: '',
          branding: o.product_spec || '',
          addons: [],
          qty: o.quantity,
          unit: o.unit_price_ex_gst_aud,
          lineTotal: o.subtotal_ex_gst_aud,
        }],
        subtotal: o.subtotal_ex_gst_aud,
        shipping: 0,
        gst: o.gst_aud,
        total: o.total_inc_gst_aud,
        paymentStatus: 'awaiting',
        leadTimeDays: o.selected_freight_mode === 'sea' ? '35-50' : o.selected_freight_mode === 'air' ? '20-30' : '18-25',
        quoteRef: sheetNo,
        docType: 'ORDER CONFIRMATION',
      });
      filename = `OrderConfirmation_${o.order_number}.pdf`;
    }

    return new Response(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
