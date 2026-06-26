// lib/freightEngine.js
// Pure international-freight rate engine. NO database access here — the caller
// loads the rate data (sheets, rows, surcharges, fees, blacklist) and passes it in.
// This keeps the math unit-testable and reproducible (see freight_plan spec).
//
// Units: all sheet rates are RMB unless a fee line declares currency 'AUD'.
// Weight bands are LEFT-CLOSED, RIGHT-OPEN: weight_from <= kg < weight_to.

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

export function ceilTo(value, step) {
  if (!step) return value;
  return Math.ceil((value - 1e-9) / step) * step;
}

export function volumetricKg(l, w, h, count = 1, divisor = 6000) {
  if (!l || !w || !h) return 0;
  return (Number(l) * Number(w) * Number(h) * (Number(count) || 1)) / (divisor || 6000);
}

// chargeable weight = max(actual, volumetric), rounded up to the channel step, floored at min.
export function chargeableKg({
  actualKg = 0, cartonL, cartonW, cartonH, cartonCount = 1,
  divisor = 6000, roundStep = 0.5, minChargeableKg = 0,
}) {
  const vol = volumetricKg(cartonL, cartonW, cartonH, cartonCount, divisor);
  let kg = Math.max(Number(actualKg) || 0, vol);
  kg = ceilTo(kg, roundStep);
  if (minChargeableKg) kg = Math.max(kg, Number(minChargeableKg));
  return { chargeableKg: round2(kg), actualKg: round2(Number(actualKg) || 0), volumetricKg: round2(vol) };
}

export function isBlacklisted(postcode, blacklist = []) {
  const pc = Number(postcode);
  if (!pc) return false;
  return blacklist.some((b) => pc >= Number(b.postcode_from) && pc <= Number(b.postcode_to));
}

function postcodeMatches(row, pc) {
  if (row.postcode_from == null || row.postcode_to == null || pc == null) return true;
  return pc >= Number(row.postcode_from) && pc <= Number(row.postcode_to);
}

// Select the rate row for a chargeable weight + postcode.
export function pickRow(rows, kg, postcode) {
  const pc = Number(postcode) || null;
  const inPc = rows.filter((r) => postcodeMatches(r, pc));
  const isLookup = inPc.length > 0 && inPc.every((r) => r.pricing_model === 'lookup_total');
  if (isLookup) {
    // UPS-style: round up to the smallest weight_to >= kg.
    const elig = inPc.filter((r) => Number(r.weight_to) >= kg).sort((a, b) => Number(a.weight_to) - Number(b.weight_to));
    return elig[0] || null; // null => over max => quote required
  }
  const elig = inPc.filter((r) => {
    const from = Number(r.weight_from) || 0;
    const to = r.weight_to == null ? Infinity : Number(r.weight_to);
    return kg >= from && kg < to;
  });
  return elig[0] || null;
}

export function rowBaseRmb(row, kg) {
  if (!row) return null;
  if (row.pricing_model === 'flat_per_kg') return kg * Number(row.kg_rate);
  if (row.pricing_model === 'lookup_total') return Number(row.flat_price);
  if (row.pricing_model === 'first_additional') {
    const fwu = Number(row.first_weight_unit);
    const fwp = Number(row.first_weight_price);
    const awu = Number(row.additional_weight_unit);
    const awp = Number(row.additional_weight_price);
    if (kg <= fwu) return fwp;
    const extra = Math.ceil((kg - fwu) / awu);
    return fwp + extra * awp;
  }
  return null;
}

export function surchargeRmb(goodsClass, kg, qty, rules = []) {
  const r = rules.find((x) => x.goods_class === goodsClass);
  if (!r) return { amount: 0 };
  if (r.basis === 'per_kg') return { amount: kg * Number(r.rate), basis: 'per_kg', rate: Number(r.rate) };
  if (r.basis === 'per_pcs') return { amount: (Number(qty) || 0) * Number(r.rate), basis: 'per_pcs', rate: Number(r.rate) };
  if (r.basis === 'quote_required') return { amount: 0, quoteRequired: true };
  return { amount: 0 };
}

// Auto fees (RMB + AUD) and manual/actual-cost flags.
export function computeFees(feeRules = [], ctx = {}) {
  const { chargeableKg = 0, longestCm = 0, declaredValueAud = 0, taxInclusive = false, pieces = 1, declaredValueRmb = 0 } = ctx;
  const rmbLines = [];
  const audLines = [];
  const manual = [];

  const tier = (type, metric, val) =>
    feeRules
      .filter((f) => f.fee_type === type && (f.trigger_condition?.gte != null) && val >= Number(f.trigger_condition.gte))
      .sort((a, b) => Number(b.amount) - Number(a.amount))[0];

  // Overweight is per SINGLE carton (单件计费重 ≥ 30/50/80kg), so test per-piece weight, not the total.
  const perPieceKg = chargeableKg / (pieces || 1);
  const ow = tier('overweight', 'billable_kg', perPieceKg);
  if (ow) rmbLines.push({ type: 'overweight', amount: Number(ow.amount) * (pieces || 1), note: ow.notes });
  const os = tier('oversize', 'longest_cm', longestCm);
  if (os) rmbLines.push({ type: 'oversize', amount: Number(os.amount) * (pieces || 1), note: os.notes });

  if (!taxInclusive) {
    const customs = feeRules.find((f) => f.fee_type === 'customs');
    if (customs && declaredValueAud > 1000) audLines.push({ type: 'customs', amount: Number(customs.amount), note: customs.notes });
    const duty = feeRules.find((f) => f.fee_type === 'duty');
    if (duty && declaredValueAud) audLines.push({ type: 'duty', amount: declaredValueAud * Number(duty.amount) / 100, note: duty.notes });
  }
  // Optional / actual-cost fees → surface for manual entry (not auto-added).
  feeRules
    .filter((f) => f.fee_type === 'insurance' || f.amount_basis === 'actual_cost')
    .forEach((f) => manual.push({ type: f.fee_type, note: f.notes }));

  return { rmbLines, audLines, manual };
}

// Full calc for ONE carrier sheet. Returns a breakdown object.
// data: { sheet, rows, surcharges, fees }
// input: { actualKg, cartonL,cartonW,cartonH,cartonCount, qty, goodsClass, postcode,
//          longestCm, pieces, declaredValueAud, fxRate }
export function calcCarrier(data, input) {
  const { sheet, rows = [], surcharges = [], fees = [] } = data;
  if (!sheet) return { ok: false, reason: 'no_active_sheet' };
  const fx = Number(input.fxRate) || null;
  const roundStep = sheet.channel === 'sea' ? 1 : 0.5;

  const cw = chargeableKg({
    actualKg: input.actualKg,
    cartonL: input.cartonL, cartonW: input.cartonW, cartonH: input.cartonH, cartonCount: input.cartonCount,
    divisor: sheet.volumetric_divisor || 6000,
    roundStep,
    minChargeableKg: sheet.min_chargeable_kg || 0,
  });

  const row = pickRow(rows, cw.chargeableKg, input.postcode);
  if (!row) return { ok: false, reason: 'no_band', carrier: sheet.carrier, service: sheet.service, ...cw };

  const base = rowBaseRmb(row, cw.chargeableKg);
  const sur = surchargeRmb(input.goodsClass, cw.chargeableKg, input.qty, surcharges);
  if (sur.quoteRequired) return { ok: false, reason: 'goods_quote_required', carrier: sheet.carrier };

  const feeCtx = {
    chargeableKg: cw.chargeableKg, longestCm: input.longestCm, declaredValueAud: input.declaredValueAud,
    taxInclusive: !!sheet.tax_inclusive, pieces: input.pieces || 1,
  };
  const fee = computeFees(fees, feeCtx);

  const rmbFees = fee.rmbLines.reduce((s, l) => s + l.amount, 0);
  const totalRmb = round2(base + sur.amount + rmbFees);
  const audFees = fee.audLines.reduce((s, l) => s + l.amount, 0);
  const freightAud = fx ? round2(totalRmb * fx + audFees) : null;

  return {
    ok: true,
    sheetId: sheet.id, sheetVersion: sheet.version,
    channel: sheet.channel, origin: sheet.origin, carrier: sheet.carrier, service: sheet.service,
    taxInclusive: !!sheet.tax_inclusive,
    ...cw,
    pricingModel: row.pricing_model,
    baseRmb: round2(base),
    surchargeRmb: round2(sur.amount),
    surcharge: sur,
    feeRmbLines: fee.rmbLines, feeAudLines: fee.audLines, manualFees: fee.manual,
    totalRmb,
    fxRate: fx,
    freightAud,
    transitTime: row.transit_time || sheet.notes || null,
    breakdown: { base: round2(base), surcharge: round2(sur.amount), rmbFees: round2(rmbFees), audFees: round2(audFees) },
  };
}

// Compare a set of carrier datasets; returns sorted (cheapest AUD first) valid results + invalids.
export function compareCarriers(datasets, input) {
  const results = datasets.map((d) => calcCarrier(d, input));
  const valid = results.filter((r) => r.ok && r.freightAud != null).sort((a, b) => a.freightAud - b.freightAud);
  const invalid = results.filter((r) => !r.ok || r.freightAud == null);
  return { cheapest: valid[0] || null, valid, invalid };
}
