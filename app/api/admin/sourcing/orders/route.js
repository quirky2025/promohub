import { NextResponse } from 'next/server';
import { getAdminUser, isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { nextOrderNumber, nextPoNumber } from '@/lib/docNumbers';
import { toNumber } from '@/lib/sourcingCosting';

function text(v) {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Try to pull a "Delivery address:" block out of a sourcing_request notes field.
function deliveryFromRequest(req) {
  if (!req) return null;
  const notes = req.notes || '';
  const m = /delivery address:\s*([\s\S]*?)(?:\n\n|$)/i.exec(notes);
  if (m && m[1].trim()) return m[1].trim();
  return null;
}

// Build the order row from a saved cost sheet (+ its linked request) and any
// admin overrides in the POST body.
function buildOrderRow({ sheet, request, company, body, orderNumber, poNumber, userEmail }) {
  const summary = sheet.estimate_summary || {};
  const pb = summary.selectedPriceBreak || {};
  const qty = Math.max(1, Math.ceil(toNumber(sheet.quantity || summary.quantity, 1)));

  const exwUnitRmb = num(sheet.exw_unit_rmb) ?? num(pb.exwUnitRmb) ?? 0;
  const setup = toNumber(sheet.setup_cost_rmb ?? pb.setupCostRmb);
  const sample = toNumber(sheet.sample_cost_rmb ?? pb.sampleCostRmb);
  const tooling = toNumber(sheet.tooling_cost_rmb ?? pb.toolingCostRmb);
  const chinaLocal = toNumber(sheet.china_local_freight_rmb ?? pb.chinaLocalFreightRmb);
  const chinaOther = toNumber(sheet.china_other_fees_rmb ?? pb.chinaOtherFeesRmb);
  // Factory PO total = product (exw*qty) + setup + sample + tooling (EXW; the
  // factory's own bill). China inland freight / forwarder fees are tracked
  // separately and billed by the forwarder.
  const factoryProductRmb = toNumber(pb.factoryProductRmb) || (exwUnitRmb * qty + setup + sample + tooling);

  const unitExGst = num(sheet.quote_unit_ex_gst_aud) ?? num(summary.quoteUnitExGstAud) ?? 0;
  const subtotalExGst = num(sheet.quote_ex_gst_aud) ?? num(summary.quoteExGstAud) ?? 0;
  const gst = num(sheet.quote_gst_aud) ?? num(summary.quoteGstAud) ?? 0;
  const totalIncGst = num(sheet.quote_inc_gst_aud) ?? num(summary.quoteIncGstAud) ?? 0;

  const customerName = text(body.customerName) || text(request?.contact_name) || null;
  const customerCompany = text(body.customerCompany) || company?.name || text(request?.company_name) || null;
  const customerEmail = text(body.customerEmail) || text(request?.email) || null;
  const customerPhone = text(body.customerPhone) || text(request?.phone) || null;
  const deliveryAddress = text(body.deliveryAddress) || deliveryFromRequest(request) || company?.delivery_address || null;

  return {
    order_number: orderNumber,
    factory_po_number: poNumber,
    cost_sheet_id: sheet.id,
    sourcing_request_id: sheet.sourcing_request_id || request?.id || null,
    company_id: company?.id || null,
    factory_id: sheet.factory_id || null,
    status: 'order_placed',

    customer_name: customerName,
    customer_company: customerCompany,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    delivery_address: deliveryAddress,

    product_name: sheet.product_name || 'Sourcing product',
    product_spec: sheet.product_spec || null,
    product_code: text(body.productCode) || (summary.productCode || null),
    quantity: qty,

    selected_freight_mode: sheet.selected_freight_mode || summary.selectedFreightMode || null,
    exchange_rate: num(sheet.exchange_rate_est) ?? num(summary.effectiveExchangeRate),
    margin_pct: num(sheet.target_margin_pct) ?? num(pb.marginPct),
    unit_price_ex_gst_aud: unitExGst,
    subtotal_ex_gst_aud: subtotalExGst,
    gst_aud: gst,
    total_inc_gst_aud: totalIncGst,

    exw_unit_rmb: exwUnitRmb,
    factory_product_rmb: factoryProductRmb,
    setup_cost_rmb: setup,
    sample_cost_rmb: sample,
    tooling_cost_rmb: tooling,
    china_local_freight_rmb: chinaLocal,
    china_other_fees_rmb: chinaOther,
    factory_total_rmb: factoryProductRmb,

    est_international_freight_aud: num(summary.freightCostAud) ?? num(pb.internationalShippingAud) ?? 0,
    est_landed_cost_ex_gst_aud: num(summary.landedCostExGstAud) ?? 0,
    est_profit_aud: num(summary.estimatedProfitAud) ?? 0,

    items: [{
      name: sheet.product_name || 'Sourcing product',
      spec: sheet.product_spec || '',
      qty,
      unitPrice: unitExGst,
      lineTotal: subtotalExGst,
    }],
    estimate_snapshot: summary,
    internal_notes: text(body.internalNotes) || null,
    customer_notes: text(body.customerNotes) || sheet.customer_notes || null,
    created_by: userEmail || null,
  };
}

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const costSheetId = searchParams.get('costSheetId');

  try {
    if (id) {
      const { data, error } = await db
        .from('sourcing_orders')
        .select('*, factories(id, name, contact_person, wechat, phone, address, payment_terms), sourcing_order_events(*)')
        .eq('id', id)
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ order: data });
    }

    let query = db
      .from('sourcing_orders')
      .select('*, factories(id, name)')
      .order('created_at', { ascending: false })
      .limit(200);
    if (status) query = query.eq('status', status);
    if (costSheetId) query = query.eq('cost_sheet_id', costSheetId);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ orders: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Create a sourcing order from an accepted cost sheet (生成 OC + 工厂 PO).
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const costSheetId = body.costSheetId || body.cost_sheet_id;
    if (!costSheetId) return NextResponse.json({ error: 'costSheetId is required' }, { status: 400 });
    const db = sourcingDb();

    const { data: sheet, error: sErr } = await db
      .from('sourcing_cost_sheets')
      .select('*')
      .eq('id', costSheetId)
      .single();
    if (sErr || !sheet) return NextResponse.json({ error: 'Cost sheet not found' }, { status: 404 });

    // Guard: one order per cost sheet (unless explicitly forced).
    if (!body.force) {
      const { data: existing } = await db
        .from('sourcing_orders')
        .select('order_number')
        .eq('cost_sheet_id', costSheetId)
        .limit(1)
        .maybeSingle();
      if (existing) {
        return NextResponse.json(
          { error: `This cost sheet is already an order (${existing.order_number}).` },
          { status: 400 }
        );
      }
    }

    let request_ = null;
    if (sheet.sourcing_request_id) {
      const { data } = await db.from('sourcing_requests').select('*').eq('id', sheet.sourcing_request_id).single();
      request_ = data || null;
    }

    // Resolve the customer company from the CRM by name (best effort).
    let company = null;
    const companyName = text(body.customerCompany) || text(request_?.company_name);
    if (companyName) {
      const { data } = await db
        .from('companies')
        .select('id, name, billing_address')
        .ilike('name', companyName)
        .limit(1)
        .maybeSingle();
      if (data) {
        company = data;
        // pull a default delivery address if present
        const { data: addr } = await db
          .from('company_addresses')
          .select('*')
          .eq('company_id', data.id)
          .eq('kind', 'delivery')
          .limit(1)
          .maybeSingle();
        if (addr) {
          company.delivery_address = [addr.line1, addr.line2, [addr.suburb, addr.state, addr.postcode].filter(Boolean).join(' ')]
            .filter(Boolean).join('\n');
        }
      }
    }

    const orderNumber = await nextOrderNumber(db);
    const poNumber = await nextPoNumber(db);
    const row = buildOrderRow({ sheet, request: request_, company, body, orderNumber, poNumber, userEmail: user.email });

    const { data: order, error } = await db.from('sourcing_orders').insert(row).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await db.from('sourcing_order_events').insert({
      order_id: order.id,
      event_type: 'order_placed',
      note: `Order created from cost sheet ${sheet.sheet_number || sheet.id}. OC ${orderNumber} · Factory PO ${poNumber}.`,
      snapshot: { costSheetId, orderNumber, poNumber },
      created_by: user.email,
    });

    // Advance the cost sheet status (non-fatal).
    try {
      await db.from('sourcing_cost_sheets').update({ status: 'factory_po_sent' }).eq('id', sheet.id);
    } catch (_) { /* ignore */ }

    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

const ACTUAL_FIELDS = {
  factoryInvoiceNumber: 'factory_invoice_number',
  factoryPaidRmb: 'factory_paid_rmb',
  factoryPaidAud: 'factory_paid_aud',
  factoryFxPaid: 'factory_fx_paid',
  forwarderInvoiceNumber: 'forwarder_invoice_number',
  actualFreightAud: 'actual_freight_aud',
  trackingNumber: 'tracking_number',
  shipDate: 'ship_date',
  deliveryDate: 'delivery_date',
};

export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const id = body.id;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const db = sourcingDb();

    const update = {};
    if (body.status) update.status = body.status;
    if (body.internalNotes !== undefined) update.internal_notes = text(body.internalNotes);

    for (const [bodyKey, col] of Object.entries(ACTUAL_FIELDS)) {
      if (body[bodyKey] !== undefined) {
        if (col.endsWith('_date')) update[col] = text(body[bodyKey]);
        else if (col.endsWith('_number') || col === 'tracking_number') update[col] = text(body[bodyKey]);
        else update[col] = num(body[bodyKey]);
      }
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: 'No supported fields to update' }, { status: 400 });
    }

    const { data, error } = await db.from('sourcing_orders').update(update).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await db.from('sourcing_order_events').insert({
      order_id: id,
      event_type: body.status ? `status:${body.status}` : 'updated',
      note: text(body.note) || (body.status ? `Status → ${body.status}` : 'Order updated'),
      snapshot: update,
      created_by: user.email,
    });

    return NextResponse.json({ order: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
