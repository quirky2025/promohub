import { NextResponse } from 'next/server';
import { isAdmin, unauthorized, getAdminUser } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import {
  calculateActualProfit,
  calculateSourcingEstimate,
  toNumber,
} from '@/lib/sourcingCosting';

function text(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function nullableNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function sheetNumber() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return `SQ-${stamp}`;
}

function buildPayload(input, summary, userEmail) {
  const packing = summary.packing || {};
  const selectedFreight = summary.selectedFreight || {};
  const selectedPriceBreak = summary.selectedPriceBreak || {};
  return {
    sheet_number: text(input.sheetNumber),
    sourcing_request_id: input.sourcingRequestId || null,
    factory_id: input.factoryId || null,
    factory_quote_id: input.factoryQuoteId || null,
    status: input.status || 'draft',
    product_name: text(input.productName) || 'Sourcing product',
    product_spec: text(input.productSpec),
    quantity: Math.max(1, Math.ceil(toNumber(summary.quantity || input.quantity, 1))),
    incoterm: input.incoterm || 'EXW',
    selected_freight_mode: summary.selectedFreightMode || input.selectedFreightMode || null,
    exchange_rate_est: toNumber(input.exchangeRateEst),
    exchange_rate_actual: nullableNumber(input.exchangeRateActual),
    fx_buffer_pct: toNumber(input.fxBufferPct),
    cost_buffer_pct: toNumber(input.costBufferPct),
    target_margin_pct: toNumber(selectedPriceBreak.marginPct || input.targetMarginPct, 35),
    exw_unit_rmb: nullableNumber(selectedPriceBreak.exwUnitRmb ?? input.exwUnitRmb),
    fob_unit_rmb: nullableNumber(selectedPriceBreak.fobUnitRmb ?? input.fobUnitRmb),
    setup_cost_rmb: toNumber(selectedPriceBreak.setupCostRmb ?? input.setupCostRmb),
    sample_cost_rmb: toNumber(selectedPriceBreak.sampleCostRmb ?? input.sampleCostRmb),
    tooling_cost_rmb: toNumber(selectedPriceBreak.toolingCostRmb ?? input.toolingCostRmb),
    china_local_freight_rmb: toNumber(selectedPriceBreak.chinaLocalFreightRmb ?? input.chinaLocalFreightRmb),
    china_document_fees_rmb: toNumber(selectedPriceBreak.chinaDocumentFeesRmb ?? input.chinaDocumentFeesRmb),
    china_other_fees_rmb: toNumber(selectedPriceBreak.chinaOtherFeesRmb ?? input.chinaOtherFeesRmb),
    production_lead_time_days: nullableNumber(selectedPriceBreak.productionLeadTimeDays ?? input.productionLeadTimeDays),
    units_per_carton: nullableNumber(input.unitsPerCarton),
    carton_count: packing.cartonCount || null,
    carton_length_cm: nullableNumber(input.cartonLengthCm),
    carton_width_cm: nullableNumber(input.cartonWidthCm),
    carton_height_cm: nullableNumber(input.cartonHeightCm),
    gross_weight_kg_per_carton: nullableNumber(input.grossWeightKgPerCarton),
    total_gross_weight_kg: packing.totalGrossWeightKg || null,
    total_cbm: packing.totalCbm || null,
    local_charges_aud_est: toNumber(selectedPriceBreak.localChargesAud ?? input.localChargesAudEst),
    clearance_aud_est: toNumber(selectedPriceBreak.clearanceAud ?? input.clearanceAudEst),
    duty_rate_pct_est: toNumber(selectedPriceBreak.dutyRatePct ?? input.dutyRatePctEst),
    duty_aud_est: summary.dutyAud,
    local_delivery_aud_est: toNumber(selectedPriceBreak.localDeliveryAud ?? input.localDeliveryAudEst),
    freight_cost_aud_est:
      selectedPriceBreak.internationalShippingAud ||
      selectedFreight.estimatedCostAud ||
      0,
    landed_cost_ex_gst_aud_est: summary.landedCostExGstAud,
    quote_ex_gst_aud: summary.quoteExGstAud,
    quote_gst_aud: summary.quoteGstAud,
    quote_inc_gst_aud: summary.quoteIncGstAud,
    quote_unit_ex_gst_aud: summary.quoteUnitExGstAud,
    estimated_profit_aud: summary.estimatedProfitAud,
    estimate_inputs: input,
    estimate_summary: summary,
    internal_notes: text(input.internalNotes),
    customer_notes: text(input.customerNotes),
    created_by: userEmail || null,
  };
}

function buildFreightRows(sheetId, summary) {
  return (summary.freightOptions || []).map((option) => ({
    cost_sheet_id: sheetId,
    mode: option.mode,
    provider: text(option.provider),
    rate_type: option.rateType || 'per_kg',
    currency: option.currency || 'RMB',
    rate_amount: toNumber(option.rateAmount),
    min_charge: toNumber(option.minCharge),
    chargeable_weight_kg: option.chargeableWeightKg || null,
    cbm: option.cbm || null,
    transit_days: text(option.transitDays),
    origin_charge_aud: toNumber(option.originChargeAud),
    destination_charge_aud: toNumber(option.destinationChargeAud),
    estimated_cost_aud: option.estimatedCostAud || 0,
    selected: option.mode === summary.selectedFreightMode,
    notes: text(option.notes),
  }));
}

function buildCostLines(sheetId, input, summary) {
  if (summary.selectedPriceBreak) {
    const row = summary.selectedPriceBreak;
    return [
      ['factory', 'Factory product/setup/sample/tooling', 'RMB', row.factoryProductRmb, row.factoryProductRmb * summary.effectiveExchangeRate],
      ['china_local_freight', 'Factory to forwarder', 'RMB', row.chinaLocalFreightRmb, row.chinaLocalFreightRmb * summary.effectiveExchangeRate],
      ['china_document_fee', text(input.documentFeeLabel) || 'COO / export document fees', 'RMB', row.chinaDocumentFeesRmb, row.chinaDocumentFeesRmb * summary.effectiveExchangeRate],
      ['china_other_fee', 'China other fees', 'RMB', row.chinaOtherFeesRmb, row.chinaOtherFeesRmb * summary.effectiveExchangeRate],
      ['international_freight', `${row.shippingMode || 'Freight'} freight`, 'RMB', row.internationalShippingRmb, row.internationalShippingAud],
      ['local_charge', 'Australia local charges', 'AUD', row.localChargesAud, row.localChargesAud],
      ['clearance', 'Customs clearance / broker', 'AUD', row.clearanceAud, row.clearanceAud],
      ['duty', 'Estimated duty', 'AUD', row.dutyAud, row.dutyAud],
      ['local_delivery', 'Local delivery', 'AUD', row.localDeliveryAud, row.localDeliveryAud],
    ]
      .filter((line) => toNumber(line[3]) !== 0)
      .map(([category, label, currency, amount, aud]) => ({
        cost_sheet_id: sheetId,
        phase: 'estimate',
        category,
        label,
        currency,
        amount,
        exchange_rate: currency === 'RMB' ? summary.effectiveExchangeRate : null,
        amount_aud: toNumber(aud),
        taxable: false,
      }));
  }

  return [
    ['factory', 'Factory product/setup/sample/tooling', 'RMB',
      toNumber(input.exwUnitRmb || input.fobUnitRmb) * toNumber(input.quantity) +
        toNumber(input.setupCostRmb) +
        toNumber(input.sampleCostRmb) +
        toNumber(input.toolingCostRmb),
      summary.productCostAud],
    ['china_local_freight', 'Factory to forwarder', 'RMB', toNumber(input.chinaLocalFreightRmb), null],
    ['china_document_fee', text(input.documentFeeLabel) || 'COO / export document fees', 'RMB', toNumber(input.chinaDocumentFeesRmb), null],
    ['china_other_fee', 'China other fees', 'RMB', toNumber(input.chinaOtherFeesRmb), null],
    ['international_freight', `${summary.selectedFreightMode || 'Freight'} freight`, 'AUD', summary.freightCostAud, summary.freightCostAud],
    ['local_charge', 'Australia local charges', 'AUD', toNumber(input.localChargesAudEst), toNumber(input.localChargesAudEst)],
    ['clearance', 'Customs clearance / broker', 'AUD', toNumber(input.clearanceAudEst), toNumber(input.clearanceAudEst)],
    ['duty', 'Estimated duty', 'AUD', summary.dutyAud, summary.dutyAud],
    ['local_delivery', 'Local delivery', 'AUD', toNumber(input.localDeliveryAudEst), toNumber(input.localDeliveryAudEst)],
  ]
    .filter((row) => toNumber(row[3]) !== 0)
    .map(([category, label, currency, amount, aud]) => ({
      cost_sheet_id: sheetId,
      phase: 'estimate',
      category,
      label,
      currency,
      amount,
      exchange_rate: currency === 'RMB' ? summary.effectiveExchangeRate : null,
      amount_aud: aud == null ? toNumber(amount) * summary.effectiveExchangeRate : toNumber(aud),
      taxable: false,
    }));
}

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const requestId = searchParams.get('request') || searchParams.get('sourcingRequestId');

  try {
    if (id) {
      const { data, error } = await db
        .from('sourcing_cost_sheets')
        .select('*, factories(id, name), sourcing_freight_options(*), sourcing_cost_lines(*)')
        .eq('id', id)
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ sheet: data });
    }

    let query = db
      .from('sourcing_cost_sheets')
      .select('*, factories(id, name)')
      .order('created_at', { ascending: false })
      .limit(100);
    if (status) query = query.eq('status', status);
    if (requestId) query = query.eq('sourcing_request_id', requestId);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ sheets: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const input = body.input || body;
    if (!text(input.productName)) {
      return NextResponse.json({ error: 'productName is required' }, { status: 400 });
    }
    if (!toNumber(input.exchangeRateEst)) {
      return NextResponse.json({ error: 'exchangeRateEst is required' }, { status: 400 });
    }

    const summary = calculateSourcingEstimate(input);
    const db = sourcingDb();
    const payload = buildPayload(
      { ...input, sheetNumber: input.sheetNumber || sheetNumber() },
      summary,
      user.email
    );
    const { data: sheet, error } = await db
      .from('sourcing_cost_sheets')
      .insert(payload)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const freightRows = buildFreightRows(sheet.id, summary);
    if (freightRows.length) {
      const { error: freightError } = await db.from('sourcing_freight_options').insert(freightRows);
      if (freightError) return NextResponse.json({ error: freightError.message }, { status: 500 });
    }

    const costRows = buildCostLines(sheet.id, input, summary);
    if (costRows.length) {
      const { error: lineError } = await db.from('sourcing_cost_lines').insert(costRows);
      if (lineError) return NextResponse.json({ error: lineError.message }, { status: 500 });
    }

    await db.from('sourcing_reconciliation_events').insert({
      cost_sheet_id: sheet.id,
      event_type: 'estimate_created',
      note: 'Initial landed-cost estimate saved',
      snapshot: { input, summary },
      created_by: user.email,
    });

    return NextResponse.json({ sheet, summary });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const id = body.id;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const db = sourcingDb();

    if (body.actualInputs) {
      const actual = calculateActualProfit(body.actualInputs);
      const update = {
        status: body.status || 'reconciled',
        actual_factory_cost_aud: nullableNumber(body.actualInputs.actualFactoryCostAud),
        actual_china_cost_aud: nullableNumber(body.actualInputs.actualChinaCostAud),
        actual_freight_aud: nullableNumber(body.actualInputs.actualFreightAud),
        actual_local_charges_aud: nullableNumber(body.actualInputs.actualLocalChargesAud),
        actual_duty_aud: nullableNumber(body.actualInputs.actualDutyAud),
        actual_landed_cost_ex_gst_aud: actual.actualLandedCostExGstAud,
        customer_invoice_ex_gst_aud: actual.invoiceExGstAud,
        customer_invoice_inc_gst_aud: nullableNumber(body.actualInputs.customerInvoiceIncGstAud),
        payment_received_aud: nullableNumber(body.actualInputs.paymentReceivedAud),
        actual_profit_aud: actual.actualProfitAud,
        profit_variance_aud: actual.profitVarianceAud,
        actual_inputs: body.actualInputs,
        actual_summary: actual,
      };
      const { data, error } = await db
        .from('sourcing_cost_sheets')
        .update(update)
        .eq('id', id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      await db.from('sourcing_reconciliation_events').insert({
        cost_sheet_id: id,
        event_type: 'actual_reconciled',
        note: body.note || 'Actual costs reconciled',
        snapshot: { input: body.actualInputs, summary: actual },
        created_by: user.email,
      });
      return NextResponse.json({ sheet: data, actual });
    }

    const input = body.input || body;
    const summary = calculateSourcingEstimate(input);
    const payload = buildPayload(input, summary, user.email);
    if (!input.sheetNumber) delete payload.sheet_number;
    delete payload.created_by;
    const { data, error } = await db
      .from('sourcing_cost_sheets')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await db.from('sourcing_freight_options').delete().eq('cost_sheet_id', id);
    await db.from('sourcing_cost_lines').delete().eq('cost_sheet_id', id).eq('phase', 'estimate');
    const freightRows = buildFreightRows(id, summary);
    if (freightRows.length) await db.from('sourcing_freight_options').insert(freightRows);
    const costRows = buildCostLines(id, input, summary);
    if (costRows.length) await db.from('sourcing_cost_lines').insert(costRows);

    await db.from('sourcing_reconciliation_events').insert({
      cost_sheet_id: id,
      event_type: 'estimate_updated',
      note: 'Landed-cost estimate updated',
      snapshot: { input, summary },
      created_by: user.email,
    });
    return NextResponse.json({ sheet: data, summary });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  const { error } = await sourcingDb().from('sourcing_cost_sheets').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
