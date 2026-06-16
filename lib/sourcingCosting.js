export const FREIGHT_MODES = [
  { key: 'express', label: 'Express', defaultRateType: 'per_kg' },
  { key: 'air', label: 'Air', defaultRateType: 'per_kg' },
  { key: 'sea', label: 'Sea', defaultRateType: 'per_kg' },
];

export function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function roundMoney(value) {
  return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
}

export function roundQty(value, decimals = 3) {
  const factor = 10 ** decimals;
  return Math.round((toNumber(value) + Number.EPSILON) * factor) / factor;
}

function hasValue(value) {
  return value !== null && value !== undefined && value !== '';
}

function fieldValue(row, input, key, fallbackKey = key) {
  return hasValue(row?.[key]) ? row[key] : input?.[fallbackKey];
}

export function calculateQuoteValidity(input = {}) {
  const quoteDate = input.quoteDate || new Date().toISOString().slice(0, 10);
  const validityDays = Math.max(1, Math.ceil(toNumber(input.validityDays, 14)));
  const date = new Date(`${quoteDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { quoteDate, validityDays, validUntil: null };
  }
  date.setDate(date.getDate() + validityDays);
  return {
    quoteDate,
    validityDays,
    validUntil: date.toISOString().slice(0, 10),
  };
}

export function calculatePacking(input = {}) {
  const quantity = Math.max(0, Math.ceil(toNumber(input.quantity)));
  const unitsPerCarton = Math.max(0, Math.ceil(toNumber(input.unitsPerCarton)));
  const cartonCount = unitsPerCarton > 0 ? Math.ceil(quantity / unitsPerCarton) : 0;
  const lengthCm = toNumber(input.cartonLengthCm);
  const widthCm = toNumber(input.cartonWidthCm);
  const heightCm = toNumber(input.cartonHeightCm);
  const grossWeightKgPerCarton = toNumber(input.grossWeightKgPerCarton);
  const manualTotalCbm = toNumber(input.manualTotalCbm);
  const expressDivisor = toNumber(input.volumetricDivisorExpress, 5000) || 5000;
  const airDivisor = toNumber(input.volumetricDivisorAir, 6000) || 6000;
  const seaDivisor = toNumber(input.volumetricDivisorSea, 6000) || 6000;
  const dimensionCbmPerCarton = lengthCm && widthCm && heightCm
    ? (lengthCm * widthCm * heightCm) / 1000000
    : 0;
  const dimensionTotalCbm = dimensionCbmPerCarton * cartonCount;
  const totalCbm = manualTotalCbm || dimensionTotalCbm;
  const cbmPerCarton = manualTotalCbm && cartonCount
    ? manualTotalCbm / cartonCount
    : dimensionCbmPerCarton;
  const totalGrossWeightKg = grossWeightKgPerCarton * cartonCount;
  const totalVolumeCm3 = totalCbm * 1000000;
  const expressVolumetricWeightKg = totalVolumeCm3 / expressDivisor;
  const airVolumetricWeightKg = totalVolumeCm3 / airDivisor;
  const seaVolumetricWeightKg = totalVolumeCm3 / seaDivisor;
  const expressChargeableKg = Math.max(totalGrossWeightKg, expressVolumetricWeightKg);
  const airChargeableKg = Math.max(totalGrossWeightKg, airVolumetricWeightKg);
  const seaChargeableKg = Math.max(totalGrossWeightKg, seaVolumetricWeightKg);

  return {
    quantity,
    unitsPerCarton,
    cartonCount,
    cbmPerCarton: roundQty(cbmPerCarton, 4),
    totalCbm: roundQty(totalCbm, 4),
    totalGrossWeightKg: roundQty(totalGrossWeightKg, 3),
    expressVolumetricWeightKg: roundQty(expressVolumetricWeightKg, 3),
    airVolumetricWeightKg: roundQty(airVolumetricWeightKg, 3),
    seaVolumetricWeightKg: roundQty(seaVolumetricWeightKg, 3),
    expressChargeableKg: roundQty(expressChargeableKg, 3),
    airChargeableKg: roundQty(airChargeableKg, 3),
    seaChargeableKg: roundQty(seaChargeableKg, 3),
  };
}

function chargeableWeightForMode(packing, mode) {
  if (mode === 'express') return toNumber(packing.expressChargeableKg);
  if (mode === 'air') return toNumber(packing.airChargeableKg);
  if (mode === 'sea') return toNumber(packing.seaChargeableKg);
  return toNumber(packing.totalGrossWeightKg);
}

function volumetricWeightForMode(packing, mode) {
  if (mode === 'express') return toNumber(packing.expressVolumetricWeightKg);
  if (mode === 'air') return toNumber(packing.airVolumetricWeightKg);
  if (mode === 'sea') return toNumber(packing.seaVolumetricWeightKg);
  return 0;
}

export function currencyToAud(amount, currency, rates = {}) {
  const value = toNumber(amount);
  if (!value) return 0;
  if (currency === 'AUD') return value;
  if (currency === 'USD') return value * toNumber(rates.usdToAud, 1);
  return value * toNumber(rates.rmbToAud, 0);
}

export function calculateFreightOption(option = {}, packing = {}, rates = {}) {
  const mode = option.mode || 'sea';
  const rateType = option.rateType || (mode === 'sea' ? 'per_cbm' : 'per_kg');
  const rateAmount = toNumber(option.rateAmount);
  const currency = option.currency || 'RMB';
  const minCharge = toNumber(option.minCharge);
  const manualChargeable = toNumber(option.chargeableWeightKg);
  const manualCbm = toNumber(option.cbm);

  const chargeableWeightKg =
    manualChargeable ||
    (mode === 'express' ? packing.expressChargeableKg : mode === 'air' ? packing.airChargeableKg : packing.totalGrossWeightKg);
  const cbm = manualCbm || packing.totalCbm;
  const baseQty =
    rateType === 'fixed'
      ? 1
      : rateType === 'per_cbm'
        ? Math.max(cbm, minCharge)
        : Math.max(chargeableWeightKg, minCharge);

  const freightBaseAud = currencyToAud(rateAmount * baseQty, currency, rates);
  const originChargeAud = currencyToAud(option.originCharge || 0, option.originCurrency || currency, rates);
  const destinationChargeAud = currencyToAud(option.destinationCharge || 0, option.destinationCurrency || 'AUD', rates);
  const estimatedCostAud = freightBaseAud + originChargeAud + destinationChargeAud;

  return {
    ...option,
    mode,
    rateType,
    currency,
    chargeableWeightKg: roundQty(chargeableWeightKg, 3),
    cbm: roundQty(cbm, 4),
    baseQty: roundQty(baseQty, 4),
    originChargeAud: roundMoney(originChargeAud),
    destinationChargeAud: roundMoney(destinationChargeAud),
    estimatedCostAud: roundMoney(estimatedCostAud),
  };
}

export function calculatePriceBreak(row = {}, input = {}, effectiveFx = 0) {
  const quantity = Math.max(1, Math.ceil(toNumber(fieldValue(row, input, 'quantity'), 1)));
  const incoterm = row.incoterm || input.incoterm || 'EXW';
  const shippingMode = row.shippingMode || row.mode || input.selectedFreightMode || 'sea';
  const packing = calculatePacking({ ...input, quantity });
  const exwUnitRmb = toNumber(fieldValue(row, input, 'exwUnitRmb'));
  const fobUnitRmb = toNumber(fieldValue(row, input, 'fobUnitRmb'));
  const unitRmb = incoterm === 'FOB' && fobUnitRmb ? fobUnitRmb : exwUnitRmb;
  const setupCostRmb = toNumber(fieldValue(row, input, 'setupCostRmb'));
  const sampleCostRmb = toNumber(fieldValue(row, input, 'sampleCostRmb'));
  const toolingCostRmb = toNumber(fieldValue(row, input, 'toolingCostRmb'));
  const chinaLocalFreightRmb = toNumber(fieldValue(row, input, 'chinaLocalFreightRmb'));
  const chinaDocumentFeesRmb = toNumber(fieldValue(row, input, 'chinaDocumentFeesRmb'));
  const chinaOtherFeesRmb = toNumber(fieldValue(row, input, 'chinaOtherFeesRmb'));
  const freightRateRmbPerKg = toNumber(fieldValue(row, input, 'freightRateRmbPerKg'));
  const autoChargeableWeightKg = chargeableWeightForMode(packing, shippingMode);
  const autoVolumetricWeightKg = volumetricWeightForMode(packing, shippingMode);
  const chargeableWeightKg = toNumber(row.chargeableWeightKg) || autoChargeableWeightKg;
  const calculatedFreightRmb = freightRateRmbPerKg * chargeableWeightKg;
  const internationalShippingRmb = hasValue(row.internationalShippingRmb)
    ? toNumber(row.internationalShippingRmb)
    : calculatedFreightRmb;
  const localChargesAud = toNumber(fieldValue(row, input, 'localChargesAud', 'localChargesAudEst'));
  const clearanceAud = toNumber(fieldValue(row, input, 'clearanceAud', 'clearanceAudEst'));
  const localDeliveryAud = toNumber(fieldValue(row, input, 'localDeliveryAud', 'localDeliveryAudEst'));
  const dutyRatePct = toNumber(fieldValue(row, input, 'dutyRatePct', 'dutyRatePctEst'));
  const dutyAudManual = fieldValue(row, input, 'dutyAudManual');
  const marginPct = Math.min(toNumber(fieldValue(row, input, 'marginPct', 'targetMarginPct'), 35), 95);
  const costBufferPct = toNumber(fieldValue(row, input, 'costBufferPct'));
  const productionLeadTimeDays = fieldValue(row, input, 'productionLeadTimeDays');
  const transitDays = row.transitDays || '';

  const factoryProductRmb =
    unitRmb * quantity +
    setupCostRmb +
    sampleCostRmb +
    toolingCostRmb;
  const chinaSubtotalRmb =
    factoryProductRmb +
    chinaLocalFreightRmb +
    chinaDocumentFeesRmb +
    chinaOtherFeesRmb;
  const totalRmb = chinaSubtotalRmb + internationalShippingRmb;
  const rmbCostAud = totalRmb * effectiveFx;
  const localCostAud = localChargesAud + clearanceAud + localDeliveryAud;
  const dutyAud = hasValue(dutyAudManual)
    ? toNumber(dutyAudManual)
    : rmbCostAud * (dutyRatePct / 100);
  const costBeforeBuffer = rmbCostAud + localCostAud + dutyAud;
  const costBufferAud = costBeforeBuffer * (costBufferPct / 100);
  const quoteTotalCostAud = costBeforeBuffer + costBufferAud;
  const quoteExGstAud = marginPct > 0
    ? quoteTotalCostAud / (1 - marginPct / 100)
    : quoteTotalCostAud;
  const quoteGstAud = quoteExGstAud * 0.1;
  const quoteIncGstAud = quoteExGstAud + quoteGstAud;

  return {
    ...row,
    id: row.id || `${quantity}-${shippingMode}`,
    quantity,
    incoterm,
    shippingMode,
    packing,
    autoVolumetricWeightKg: roundQty(autoVolumetricWeightKg, 3),
    autoChargeableWeightKg: roundQty(autoChargeableWeightKg, 3),
    chargeableWeightKg: roundQty(chargeableWeightKg, 3),
    freightRateRmbPerKg: roundQty(freightRateRmbPerKg, 4),
    calculatedFreightRmb: roundMoney(calculatedFreightRmb),
    unitFreightRmb: roundQty(internationalShippingRmb / quantity, 4),
    exwUnitRmb: roundQty(exwUnitRmb, 4),
    fobUnitRmb: roundQty(fobUnitRmb, 4),
    unitRmb: roundQty(unitRmb, 4),
    setupCostRmb: roundMoney(setupCostRmb),
    sampleCostRmb: roundMoney(sampleCostRmb),
    toolingCostRmb: roundMoney(toolingCostRmb),
    factoryProductRmb: roundMoney(factoryProductRmb),
    chinaLocalFreightRmb: roundMoney(chinaLocalFreightRmb),
    chinaDocumentFeesRmb: roundMoney(chinaDocumentFeesRmb),
    chinaOtherFeesRmb: roundMoney(chinaOtherFeesRmb),
    chinaSubtotalRmb: roundMoney(chinaSubtotalRmb),
    internationalShippingRmb: roundMoney(internationalShippingRmb),
    totalRmb: roundMoney(totalRmb),
    unitCostRmb: roundQty(totalRmb / quantity, 4),
    rmbCostAud: roundMoney(rmbCostAud),
    internationalShippingAud: roundMoney(internationalShippingRmb * effectiveFx),
    localChargesAud: roundMoney(localChargesAud),
    clearanceAud: roundMoney(clearanceAud),
    localDeliveryAud: roundMoney(localDeliveryAud),
    localCostAud: roundMoney(localCostAud),
    dutyRatePct: roundQty(dutyRatePct, 3),
    dutyAud: roundMoney(dutyAud),
    costBufferPct: roundQty(costBufferPct, 3),
    costBufferAud: roundMoney(costBufferAud),
    quoteTotalCostAud: roundMoney(quoteTotalCostAud),
    marginPct: roundQty(marginPct, 3),
    quoteExGstAud: roundMoney(quoteExGstAud),
    quoteGstAud: roundMoney(quoteGstAud),
    quoteIncGstAud: roundMoney(quoteIncGstAud),
    quoteUnitExGstAud: roundQty(quoteExGstAud / quantity, 4),
    estimatedProfitAud: roundMoney(quoteExGstAud - quoteTotalCostAud),
    productionLeadTimeDays,
    transitDays,
    leadTimeLabel: [productionLeadTimeDays ? `Production: ${productionLeadTimeDays}` : null, transitDays ? `Transit: ${transitDays}` : null]
      .filter(Boolean)
      .join(' + '),
  };
}

export function calculateSourcingEstimate(input = {}) {
  const quantity = Math.max(1, Math.ceil(toNumber(input.quantity, 1)));
  const exchangeRate = toNumber(input.exchangeRateEst);
  const effectiveFx = exchangeRate * (1 + toNumber(input.fxBufferPct) / 100);
  const validity = calculateQuoteValidity(input);
  const packing = calculatePacking({ ...input, quantity });
  const selectedMode = input.selectedFreightMode || 'sea';
  const rates = {
    rmbToAud: effectiveFx,
    usdToAud: toNumber(input.usdToAud, 1.52),
  };
  const freightOptions = (input.freightOptions || []).map((option) =>
    calculateFreightOption(option, packing, rates)
  );
  const selectedFreight =
    freightOptions.find((option) => option.mode === selectedMode) ||
    freightOptions[0] ||
    { estimatedCostAud: 0 };

  const unitRmb = input.incoterm === 'FOB' && toNumber(input.fobUnitRmb)
    ? toNumber(input.fobUnitRmb)
    : toNumber(input.exwUnitRmb);
  const productRmb =
    unitRmb * quantity +
    toNumber(input.setupCostRmb) +
    toNumber(input.sampleCostRmb) +
    toNumber(input.toolingCostRmb);
  const chinaRmb =
    toNumber(input.chinaLocalFreightRmb) +
    toNumber(input.chinaDocumentFeesRmb) +
    toNumber(input.chinaOtherFeesRmb);
  const productAud = productRmb * effectiveFx;
  const chinaAud = chinaRmb * effectiveFx;
  const freightAud = toNumber(selectedFreight.estimatedCostAud);
  const localChargesAud =
    toNumber(input.localChargesAudEst) +
    toNumber(input.clearanceAudEst) +
    toNumber(input.localDeliveryAudEst);
  const dutyBaseAud = productAud + chinaAud + freightAud;
  const dutyAud = input.dutyAudManual !== '' && input.dutyAudManual != null
    ? toNumber(input.dutyAudManual)
    : dutyBaseAud * (toNumber(input.dutyRatePctEst) / 100);
  const costBeforeBuffer = productAud + chinaAud + freightAud + localChargesAud + dutyAud;
  const costBufferAud = costBeforeBuffer * (toNumber(input.costBufferPct) / 100);
  const landedCostExGstAud = costBeforeBuffer + costBufferAud;
  const marginPct = Math.min(toNumber(input.targetMarginPct, 35), 95);
  const quoteExGstAud = marginPct > 0
    ? landedCostExGstAud / (1 - marginPct / 100)
    : landedCostExGstAud;
  const quoteGstAud = quoteExGstAud * 0.1;
  const quoteIncGstAud = quoteExGstAud + quoteGstAud;
  const priceBreaks = Array.isArray(input.priceBreaks)
    ? input.priceBreaks
        .filter((row) => toNumber(row.quantity) > 0)
        .map((row) => calculatePriceBreak(row, input, effectiveFx))
    : [];
  const selectedPriceBreak =
    priceBreaks.find((row) => row.id === input.selectedPriceBreakId) ||
    priceBreaks[0] ||
    null;

  if (selectedPriceBreak) {
    return {
      ...validity,
      quantity: selectedPriceBreak.quantity,
      packing: selectedPriceBreak.packing || packing,
      freightOptions,
      priceBreaks,
      selectedPriceBreak,
      selectedFreightMode: selectedPriceBreak.shippingMode,
      selectedFreight,
      effectiveExchangeRate: roundQty(effectiveFx, 6),
      productCostAud: roundMoney(selectedPriceBreak.factoryProductRmb * effectiveFx),
      chinaCostAud: roundMoney(
        (
          selectedPriceBreak.chinaLocalFreightRmb +
          selectedPriceBreak.chinaDocumentFeesRmb +
          selectedPriceBreak.chinaOtherFeesRmb
        ) * effectiveFx
      ),
      freightCostAud: selectedPriceBreak.internationalShippingAud,
      localChargesAud: selectedPriceBreak.localCostAud,
      dutyAud: selectedPriceBreak.dutyAud,
      costBufferAud: selectedPriceBreak.costBufferAud,
      landedCostExGstAud: selectedPriceBreak.quoteTotalCostAud,
      quoteExGstAud: selectedPriceBreak.quoteExGstAud,
      quoteGstAud: selectedPriceBreak.quoteGstAud,
      quoteIncGstAud: selectedPriceBreak.quoteIncGstAud,
      quoteUnitExGstAud: selectedPriceBreak.quoteUnitExGstAud,
      estimatedProfitAud: selectedPriceBreak.estimatedProfitAud,
      totalRmb: selectedPriceBreak.totalRmb,
      unitCostRmb: selectedPriceBreak.unitCostRmb,
    };
  }

  return {
    ...validity,
    quantity,
    packing,
    freightOptions,
    priceBreaks,
    selectedPriceBreak,
    selectedFreightMode: selectedMode,
    selectedFreight,
    effectiveExchangeRate: roundQty(effectiveFx, 6),
    productCostAud: roundMoney(productAud),
    chinaCostAud: roundMoney(chinaAud),
    freightCostAud: roundMoney(freightAud),
    localChargesAud: roundMoney(localChargesAud),
    dutyAud: roundMoney(dutyAud),
    costBufferAud: roundMoney(costBufferAud),
    landedCostExGstAud: roundMoney(landedCostExGstAud),
    quoteExGstAud: roundMoney(quoteExGstAud),
    quoteGstAud: roundMoney(quoteGstAud),
    quoteIncGstAud: roundMoney(quoteIncGstAud),
    quoteUnitExGstAud: roundQty(quoteExGstAud / quantity, 4),
    estimatedProfitAud: roundMoney(quoteExGstAud - landedCostExGstAud),
  };
}

export function calculateActualProfit(input = {}) {
  const invoiceExGst = input.customerInvoiceExGstAud
    ? toNumber(input.customerInvoiceExGstAud)
    : toNumber(input.customerInvoiceIncGstAud) / 1.1;
  const actualLanded =
    toNumber(input.actualFactoryCostAud) +
    toNumber(input.actualChinaCostAud) +
    toNumber(input.actualFreightAud) +
    toNumber(input.actualLocalChargesAud) +
    toNumber(input.actualDutyAud);
  const actualProfit = invoiceExGst - actualLanded;
  return {
    invoiceExGstAud: roundMoney(invoiceExGst),
    actualLandedCostExGstAud: roundMoney(actualLanded),
    actualProfitAud: roundMoney(actualProfit),
    profitVarianceAud: roundMoney(actualProfit - toNumber(input.estimatedProfitAud)),
  };
}
