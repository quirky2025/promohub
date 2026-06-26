'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FREIGHT_MODES,
  calculateActualProfit,
  calculateSourcingEstimate,
  calculatePriceBreak,
} from '@/lib/sourcingCosting';

const DEFAULT_FREIGHT_OPTIONS = [
  { mode: 'express', provider: 'DHL / Express', rateType: 'per_kg', currency: 'RMB', rateAmount: '', minCharge: '', transitDays: '', originCharge: '', destinationCharge: '' },
  { mode: 'air', provider: 'Air freight', rateType: 'per_kg', currency: 'RMB', rateAmount: '', minCharge: '', transitDays: '', originCharge: '', destinationCharge: '' },
  { mode: 'sea', provider: 'Sea freight', rateType: 'per_kg', currency: 'RMB', rateAmount: '', minCharge: '', transitDays: '', originCharge: '', destinationCharge: '' },
];

const DEFAULT_VALIDITY_NOTE =
  'Quote valid for 14 days from issue date. Freight, exchange rate, and supplier availability are subject to confirmation at order placement.';
const MTO_PRODUCTS_STORAGE_KEY = 'quirkypromo:mto-products:v1';

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function defaultQuoteNumber() {
  return `SQ-${todayString().replaceAll('-', '')}`;
}

function makePriceBreak(quantity = 500, shippingMode = 'air', overrides = {}) {
  return {
    id: `pb-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    showOnPdf: true,
    recommended: false,
    customerOptionLabel: '',
    deliveryAddress: '',
    deliveryPlanNote: '',
    quantity,
    shippingMode,
    exwUnitRmb: '',
    fobUnitRmb: '',
    chinaLocalFreightRmb: '',
    chinaDocumentFeesRmb: '',
    internationalShippingRmb: '',
    freightRateRmbPerKg: '',
    chargeableWeightKg: '',
    localChargesAud: '',
    clearanceAud: '',
    dutyAudManual: '',
    localDeliveryAud: '',
    marginPct: '',
    productionLeadTimeDays: '',
    transitDays: '',
    ...overrides,
  };
}

function defaultPriceBreaks(quantity = 500) {
  return [
    makePriceBreak(quantity, 'express', { id: `pb-${quantity}-express` }),
    makePriceBreak(quantity, 'air', { id: `pb-${quantity}-air` }),
    makePriceBreak(quantity, 'sea', { id: `pb-${quantity}-sea` }),
  ];
}

function fieldAfterPrefix(value, prefix) {
  if (!value) return '';
  const line = String(value)
    .split('\n')
    .find((part) => part.toLowerCase().startsWith(prefix.toLowerCase()));
  return line ? line.slice(prefix.length).trim() : '';
}

function blockAfterPrefix(value, prefix) {
  if (!value) return '';
  const lines = String(value).split(/\r?\n/);
  const start = lines.findIndex((line) => line.toLowerCase().startsWith(prefix.toLowerCase()));
  if (start < 0) return '';
  const firstLineValue = lines[start].slice(prefix.length).trim();
  if (firstLineValue) return firstLineValue;
  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) break;
    block.push(line);
  }
  return block.join('\n').trim();
}

function requestProductName(req) {
  return fieldAfterPrefix(req.product_description, 'Product name:') ||
    String(req.product_description || '').split('\n').find(Boolean) ||
    '';
}

function requestDeliveryAddress(req) {
  return blockAfterPrefix(req.notes, 'Delivery address:') || '';
}

function requestLogoRequirements(req) {
  return blockAfterPrefix(req.branding_requirements, 'Logo / print requirements:') ||
    req.branding_requirements ||
    '';
}

function madeToOrderSpec(product = {}) {
  const specRows = (product.specRows || [])
    .filter((row) => row.name || row.description)
    .map((row) => `${row.name}: ${row.description}`)
    .join('\n');
  const colourRows = (product.availableColours || [])
    .filter((row) => row.name || row.pms || row.supplierColour)
    .map((row) => [row.name, row.supplierColour, row.pms].filter(Boolean).join(' / '))
    .join('\n');
  return [
    product.sku ? `Product SKU: ${product.sku}` : null,
    product.category ? `Category: ${product.category}` : null,
    product.specs ? `Specs: ${product.specs}` : null,
    product.material ? `Material: ${product.material}` : null,
    product.dimensions ? `Dimensions: ${product.dimensions}` : null,
    product.colours ? `Colours: ${product.colours}` : null,
    product.packaging ? `Packaging: ${product.packaging}` : null,
    colourRows ? `Available Colours:\n${colourRows}` : null,
    product.decorationOptions ? `Decoration: ${product.decorationOptions}` : null,
    specRows ? `Product Specs:\n${specRows}` : null,
  ].filter(Boolean).join('\n');
}

function madeToOrderBranding(product = {}) {
  const structured = (product.brandingOptions || [])
    .filter((row) => row.method || row.maxSize || row.position)
    .map((row) => [
      row.method,
      row.maxSize ? `Max ${row.maxSize}` : null,
      row.position ? `Position ${row.position}` : null,
      row.colourLimit,
      row.notes,
    ].filter(Boolean).join(' / '))
    .join('\n');
  return [
    product.logoRequirements,
    product.decorationOptions,
    structured ? `Branding options:\n${structured}` : null,
  ].filter(Boolean).join('\n\n');
}

function madeToOrderFromStorage(id) {
  try {
    const raw = window.localStorage.getItem(MTO_PRODUCTS_STORAGE_KEY);
    const products = raw ? JSON.parse(raw) : [];
    return products.find((product) => product.id === id) || null;
  } catch {
    return null;
  }
}

function requestProductDetails(req) {
  return String(req.product_description || '')
    .replace(/^Product name:.*(\r?\n){0,2}/i, '')
    .replace(/^Details:\s*/i, '')
    .trim();
}

function createDefaultForm() {
  const quantity = 500;
  return {
    factoryId: '',
    sourcingRequestId: '',
    quoteNumber: defaultQuoteNumber(),
    customerCompany: '',
    customerContact: '',
    customerEmail: '',
    quoteDeliveryAddress: '',
    logoRequirements: '',
    productName: '',
    productSpec: '',
    quantity,
    quoteDate: todayString(),
    validityDays: '14',
    validityNote: DEFAULT_VALIDITY_NOTE,
    incoterm: 'EXW',
    exwUnitRmb: '',
    fobUnitRmb: '',
    setupCostRmb: '',
    sampleCostRmb: '',
    toolingCostRmb: '',
    chinaLocalFreightRmb: '',
    chinaDocumentFeesRmb: '',
    documentFeeLabel: 'COO / document fee',
    chinaOtherFeesRmb: '',
    productionLeadTimeDays: '',
    unitsPerCarton: '',
    cartonLengthCm: '',
    cartonWidthCm: '',
    cartonHeightCm: '',
    grossWeightKgPerCarton: '',
    manualTotalCbm: '',
    volumetricDivisorExpress: '5000',
    volumetricDivisorAir: '6000',
    volumetricDivisorSea: '6000',
    exchangeRateEst: '0.2150',
    fxBufferPct: '2',
    costBufferPct: '5',
    targetMarginPct: '35',
    selectedFreightMode: 'sea',
    localChargesAudEst: '',
    clearanceAudEst: '',
    dutyRatePctEst: '',
    dutyAudManual: '',
    localDeliveryAudEst: '',
    selectedPriceBreakId: `pb-${quantity}-air`,
    priceBreaks: defaultPriceBreaks(quantity),
    internalNotes: '',
    customerNotes: '',
    freightOptions: DEFAULT_FREIGHT_OPTIONS,
  };
}

const DEFAULT_FORM = createDefaultForm();

const DEFAULT_ACTUAL = {
  customerInvoiceIncGstAud: '',
  paymentReceivedAud: '',
  actualFactoryCostAud: '',
  actualChinaCostAud: '',
  actualFreightAud: '',
  actualLocalChargesAud: '',
  actualDutyAud: '',
};

function money(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
  return Number(value).toLocaleString('en-AU', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function currency(value, digits = 2) {
  return `$${money(value, digits)}`;
}

function rmb(value, digits = 2) {
  return `RMB ${money(value, digits)}`;
}

function compact(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
  return Number(value).toLocaleString('en-AU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function cleanText(value, fallback = '') {
  return value === null || value === undefined || value === '' ? fallback : String(value);
}

function shipLabel(value) {
  return FREIGHT_MODES.find((mode) => mode.key === value)?.label || cleanText(value, 'Freight');
}

function wrapWords(text, maxChars = 42) {
  const words = cleanText(text).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function safePdfFilename(value) {
  return cleanText(value, 'quote').replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'quote';
}

export default function SourcingCostingPage() {
  const [factories, setFactories] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [sourceRequest, setSourceRequest] = useState(null);
  const [sourceProduct, setSourceProduct] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [actual, setActual] = useState(DEFAULT_ACTUAL);
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [factoryProducts, setFactoryProducts] = useState([]);
  const [loadedTiers, setLoadedTiers] = useState([]);
  const [pickedQuoteId, setPickedQuoteId] = useState('');

  const summary = useMemo(() => calculateSourcingEstimate(form), [form]);
  const actualSummary = useMemo(() => {
    if (!selectedSheet) return null;
    return calculateActualProfit({
      ...actual,
      estimatedProfitAud: selectedSheet.estimated_profit_aud || summary.estimatedProfitAud,
    });
  }, [actual, selectedSheet, summary.estimatedProfitAud]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestId = params.get('request');
    const mtoProductId = params.get('mto');
    loadFactories();
    loadSheets(requestId);
    if (requestId) loadRequest(requestId);
    else if (mtoProductId) loadMadeToOrderProduct(mtoProductId);
    // Initial URL context only; re-running would overwrite an in-progress costing table.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When a factory is selected, load its quoted products so you can pick one to pre-fill.
  useEffect(() => {
    if (!form.factoryId) { setFactoryProducts([]); return; }
    fetch(`/api/admin/sourcing/quotes?factory_id=${form.factoryId}`)
      .then((r) => r.json())
      .then((d) => setFactoryProducts(d.quotes || []))
      .catch(() => setFactoryProducts([]));
  }, [form.factoryId]);

  async function loadFactories() {
    const res = await fetch('/api/admin/sourcing/factories');
    const data = await res.json();
    setFactories(data.factories || []);
  }

  async function loadSheets(requestId = form.sourcingRequestId) {
    const query = requestId ? `?request=${encodeURIComponent(requestId)}` : '';
    const res = await fetch(`/api/admin/sourcing/cost-sheets${query}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ? `Cost sheet table not ready: ${data.error}` : '');
      return;
    }
    setSheets(data.sheets || []);
  }

  async function loadRequest(requestId) {
    const res = await fetch(`/api/admin/sourcing/requests?id=${encodeURIComponent(requestId)}`);
    const data = await res.json();
    if (!res.ok || !data.request) {
      setError(data.error || 'Failed to load sourcing request');
      return;
    }
    const req = data.request;
    const quantity = req.quantity || 500;
    const breaks = defaultPriceBreaks(quantity);
    setSourceRequest(req);
    setForm((current) => ({
      ...current,
      sourcingRequestId: req.id,
      customerCompany: req.company_name || current.customerCompany,
      customerContact: req.contact_name || current.customerContact,
      customerEmail: req.email || current.customerEmail,
      quoteDeliveryAddress: requestDeliveryAddress(req) || current.quoteDeliveryAddress,
      logoRequirements: requestLogoRequirements(req) || current.logoRequirements,
      productName: requestProductName(req) || current.productName,
      productSpec: requestProductDetails(req) || req.colour_requirements || req.decoration_method || current.productSpec,
      quantity,
      selectedFreightMode: req.freight_preference || current.selectedFreightMode,
      selectedPriceBreakId: breaks.find((row) => row.shippingMode === (req.freight_preference || 'air'))?.id || breaks[1]?.id,
      priceBreaks: breaks.map((row) => ({
        ...row,
        quantity,
        productionLeadTimeDays: current.productionLeadTimeDays,
      })),
      customerNotes: [
        req.notes ? `Client notes:\n${req.notes}` : null,
        req.branding_requirements ? `Branding:\n${req.branding_requirements}` : null,
        req.target_price ? `Target price: ${req.target_price}` : null,
        req.in_hands_date ? `In-hands date: ${req.in_hands_date}` : null,
      ].filter(Boolean).join('\n\n'),
      internalNotes: current.internalNotes || req.internal_notes || '',
    }));
  }

  async function loadMadeToOrderProduct(productId) {
    let product = null;
    try {
      const res = await fetch(`/api/admin/sourcing/products?id=${encodeURIComponent(productId)}`);
      if (res.ok) {
        const data = await res.json();
        product = data.product || null;
      }
    } catch {
      product = null;
    }
    if (!product) product = madeToOrderFromStorage(productId);
    if (!product) {
      setError('Made-to-order product was not found.');
      return;
    }
    const quantity = product.moq || 500;
    setSourceProduct(product);
    setForm((current) => ({
      ...current,
      factoryId: product.factoryId || current.factoryId,
      productName: product.name || current.productName,
      productSpec: madeToOrderSpec(product) || current.productSpec,
      quantity,
      logoRequirements: madeToOrderBranding(product) || current.logoRequirements,
      unitsPerCarton: product.unitsPerCarton || current.unitsPerCarton,
      cartonLengthCm: product.cartonLengthCm || current.cartonLengthCm,
      cartonWidthCm: product.cartonWidthCm || current.cartonWidthCm,
      cartonHeightCm: product.cartonHeightCm || current.cartonHeightCm,
      grossWeightKgPerCarton: product.grossWeightKgPerCarton || current.grossWeightKgPerCarton,
      productionLeadTimeDays: product.productionLeadTime || current.productionLeadTimeDays,
      customerNotes: [
        product.publicPositioning ? `Product positioning:\n${product.publicPositioning}` : null,
        product.sampleInfo ? `Sample info:\n${product.sampleInfo}` : null,
      ].filter(Boolean).join('\n\n') || current.customerNotes,
      internalNotes: [
        current.internalNotes,
        product.sku ? `Product SKU: ${product.sku}` : null,
        product.category ? `Category: ${product.category}` : null,
        product.factorySku ? `Factory SKU: ${product.factorySku}` : null,
        product.documentsSupported ? `Documents supported: ${product.documentsSupported}` : null,
        product.complianceNotes ? `Compliance notes: ${product.complianceNotes}` : null,
        product.internalNotes,
      ].filter(Boolean).join('\n\n'),
      selectedPriceBreakId: `pb-${quantity}-air`,
      priceBreaks: defaultPriceBreaks(quantity).map((row) => ({
        ...row,
        quantity,
        productionLeadTimeDays: product.productionLeadTime || current.productionLeadTimeDays,
        deliveryAddress: current.quoteDeliveryAddress,
      })),
    }));
    setMessage(`Loaded made-to-order product: ${product.name}`);
  }

  // Pick one of the factory's quoted products → pre-fill the costing form from it.
  function pickProduct(quoteId) {
    setPickedQuoteId(quoteId);
    if (!quoteId) return;
    const q = factoryProducts.find((x) => String(x.id) === String(quoteId));
    if (!q) return;
    const tiers = (q.quote_tiers || []).slice().sort((a, b) => Number(a.quantity) - Number(b.quantity));
    setLoadedTiers(tiers);
    const qty = Number(tiers[0]?.quantity) || 500;
    const gw = q.est_unit_weight_g && q.units_per_carton
      ? Math.round((Number(q.est_unit_weight_g) * Number(q.units_per_carton) / 1000) * 1000) / 1000
      : '';
    setForm((cur) => ({
      ...cur,
      productName: q.product_code ? `${q.product_code} ${q.product_name}` : (q.product_name || ''),
      productSpec: q.product_spec || cur.productSpec,
      incoterm: 'EXW',
      exwUnitRmb: tiers[0] ? String(tiers[0].exw_unit_price_rmb) : cur.exwUnitRmb,
      quantity: qty,
      unitsPerCarton: q.units_per_carton ?? cur.unitsPerCarton,
      cartonLengthCm: q.carton_length_cm ?? cur.cartonLengthCm,
      cartonWidthCm: q.carton_width_cm ?? cur.cartonWidthCm,
      cartonHeightCm: q.carton_height_cm ?? cur.cartonHeightCm,
      grossWeightKgPerCarton: gw === '' ? cur.grossWeightKgPerCarton : gw,
      exchangeRateEst: q.exchange_rate ? String(q.exchange_rate) : cur.exchangeRateEst,
      productionLeadTimeDays: q.lead_time_days ?? cur.productionLeadTimeDays,
      chinaLocalFreightRmb: q.domestic_freight_rmb ?? cur.chinaLocalFreightRmb,
      priceBreaks: defaultPriceBreaks(qty),
      selectedPriceBreakId: `pb-${qty}-air`,
    }));
  }

  // Apply a quantity tier (sets quantity + matching EXW).
  function applyTier(t) {
    const qty = Number(t.quantity);
    setForm((cur) => ({
      ...cur,
      quantity: qty,
      exwUnitRmb: String(t.exw_unit_price_rmb),
      priceBreaks: defaultPriceBreaks(qty),
      selectedPriceBreakId: `pb-${qty}-air`,
    }));
  }

  // Fill Express/Air/Sea price-break rows from the freight comparison so the three options differ.
  function applyModes(byMode) {
    setForm((cur) => ({
      ...cur,
      priceBreaks: cur.priceBreaks.map((row) => {
        const fr = byMode?.[row.shippingMode];
        return fr && fr.totalRmb != null
          ? { ...row, internationalShippingRmb: String(Math.round(Number(fr.totalRmb) * 100) / 100) }
          : row;
      }),
    }));
  }

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateFreight(index, key, value) {
    setForm((current) => ({
      ...current,
      freightOptions: current.freightOptions.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      ),
    }));
  }

  function updatePriceBreak(id, key, value) {
    setForm((current) => ({
      ...current,
      priceBreaks: current.priceBreaks.map((row) =>
        row.id === id ? { ...row, [key]: value } : row
      ),
    }));
  }

  function selectPriceBreak(row) {
    setForm((current) => ({
      ...current,
      selectedPriceBreakId: row.id,
      selectedFreightMode: row.shippingMode || current.selectedFreightMode,
      quantity: row.quantity || current.quantity,
    }));
  }

  function clonePriceBreakValues(row = {}, current = {}) {
    return {
      showOnPdf: row.showOnPdf !== false,
      recommended: false,
      customerOptionLabel: '',
      deliveryAddress: row.deliveryAddress || current.quoteDeliveryAddress,
      deliveryPlanNote: row.deliveryPlanNote || '',
      exwUnitRmb: row.exwUnitRmb || current.exwUnitRmb,
      fobUnitRmb: row.fobUnitRmb || current.fobUnitRmb,
      chinaLocalFreightRmb: row.chinaLocalFreightRmb || current.chinaLocalFreightRmb,
      chinaDocumentFeesRmb: row.chinaDocumentFeesRmb || current.chinaDocumentFeesRmb,
      freightRateRmbPerKg: '',
      chargeableWeightKg: '',
      internationalShippingRmb: '',
      localChargesAud: row.localChargesAud || current.localChargesAudEst,
      clearanceAud: row.clearanceAud || current.clearanceAudEst,
      localDeliveryAud: row.localDeliveryAud || current.localDeliveryAudEst,
      dutyAudManual: row.dutyAudManual || current.dutyAudManual,
      marginPct: row.marginPct || current.targetMarginPct,
      productionLeadTimeDays: row.productionLeadTimeDays || current.productionLeadTimeDays,
    };
  }

  function addPriceBreak(shippingMode = 'air') {
    setForm((current) => {
      const selectedRow = current.priceBreaks.find((row) => row.id === current.selectedPriceBreakId);
      const row = makePriceBreak(selectedRow?.quantity || current.quantity || 500, shippingMode, {
        ...clonePriceBreakValues(selectedRow, current),
      });
      return {
        ...current,
        selectedPriceBreakId: row.id,
        priceBreaks: [...current.priceBreaks, row],
      };
    });
  }

  function addFreightSetFromRow(sourceId) {
    setForm((current) => {
      const source =
        current.priceBreaks.find((row) => row.id === sourceId) ||
        current.priceBreaks.find((row) => row.id === current.selectedPriceBreakId) ||
        current.priceBreaks[0];
      if (!source) return current;
      const sourceQuantity = String(source.quantity || current.quantity || 500);
      const existingModes = new Set(
        current.priceBreaks
          .filter((row) => String(row.quantity || '') === sourceQuantity)
          .map((row) => row.shippingMode)
      );
      const newRows = ['express', 'air', 'sea']
        .filter((mode) => !existingModes.has(mode))
        .map((mode) =>
          makePriceBreak(source.quantity || current.quantity || 500, mode, {
            ...clonePriceBreakValues(source, current),
          })
        );
      if (!newRows.length) return current;
      return {
        ...current,
        selectedPriceBreakId: newRows[0].id,
        selectedFreightMode: newRows[0].shippingMode,
        quantity: newRows[0].quantity,
        priceBreaks: [...current.priceBreaks, ...newRows],
      };
    });
  }

  function removePriceBreak(id) {
    setForm((current) => {
      const remaining = current.priceBreaks.filter((row) => row.id !== id);
      return {
        ...current,
        priceBreaks: remaining,
        selectedPriceBreakId:
          current.selectedPriceBreakId === id
            ? remaining[0]?.id || ''
            : current.selectedPriceBreakId,
      };
    });
  }

  async function saveEstimate() {
    setSaving(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/sourcing/cost-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: form }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Save failed');
      return;
    }
    setMessage(`Saved ${data.sheet.sheet_number || 'cost sheet'}`);
    setSelectedSheet(data.sheet);
    setActual({
      ...DEFAULT_ACTUAL,
      customerInvoiceIncGstAud: data.summary.quoteIncGstAud || '',
      paymentReceivedAud: data.summary.quoteIncGstAud || '',
    });
    await loadSheets(form.sourcingRequestId);
  }

  function loadSheet(sheet) {
    const input = sheet.estimate_inputs || {};
    const defaultForm = createDefaultForm();
    const priceBreaks = input.priceBreaks?.length
      ? input.priceBreaks
      : defaultPriceBreaks(input.quantity || sheet.quantity || defaultForm.quantity);
    setSelectedSheet(sheet);
    setForm({
      ...defaultForm,
      ...input,
      factoryId: input.factoryId || sheet.factory_id || '',
      sourcingRequestId: input.sourcingRequestId || sheet.sourcing_request_id || '',
      productName: input.productName || sheet.product_name || '',
      productSpec: input.productSpec || sheet.product_spec || '',
      quantity: input.quantity || sheet.quantity || 1,
      selectedFreightMode: input.selectedFreightMode || sheet.selected_freight_mode || 'sea',
      freightOptions: input.freightOptions || DEFAULT_FREIGHT_OPTIONS,
      priceBreaks,
      selectedPriceBreakId: input.selectedPriceBreakId || sheet.estimate_summary?.selectedPriceBreak?.id || priceBreaks[0]?.id || '',
    });
    setActual({
      ...DEFAULT_ACTUAL,
      ...(sheet.actual_inputs || {}),
      customerInvoiceIncGstAud: sheet.customer_invoice_inc_gst_aud || sheet.quote_inc_gst_aud || '',
      paymentReceivedAud: sheet.payment_received_aud || '',
    });
    setMessage(`Loaded ${sheet.sheet_number || sheet.product_name}`);
    setError('');
  }

  async function reconcileActual() {
    if (!selectedSheet?.id) {
      setError('Load or save a cost sheet before reconciliation.');
      return;
    }
    setReconciling(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/sourcing/cost-sheets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedSheet.id,
        actualInputs: {
          ...actual,
          estimatedProfitAud: selectedSheet.estimated_profit_aud || summary.estimatedProfitAud,
        },
      }),
    });
    const data = await res.json();
    setReconciling(false);
    if (!res.ok) {
      setError(data.error || 'Reconciliation failed');
      return;
    }
    setSelectedSheet(data.sheet);
    setMessage(`Reconciled. Actual profit ${currency(data.actual.actualProfitAud)}`);
    await loadSheets(form.sourcingRequestId);
  }

  async function generateCustomerQuotePdf() {
    setError('');
    setMessage('');
    const pdfRows = (summary.priceBreaks || []).filter((row) => row.showOnPdf !== false);
    if (!pdfRows.length) {
      setError('Select at least one matrix row for the customer PDF.');
      return;
    }
    if (!form.productName.trim()) {
      setError('Product name is required before generating the quote PDF.');
      return;
    }

    setGeneratingPdf(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdf = await PDFDocument.create();
      const pageSize = [595.28, 841.89];
      const margin = 42;
      const navy = rgb(0.105, 0.165, 0.29);
      const gold = rgb(0.74, 0.56, 0.27);
      const ink = rgb(0.12, 0.12, 0.12);
      const muted = rgb(0.45, 0.45, 0.45);
      const line = rgb(0.86, 0.84, 0.78);
      const pale = rgb(0.98, 0.96, 0.91);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

      let page = pdf.addPage(pageSize);
      let y = 790;

      function addPageIfNeeded(required = 40) {
        if (y - required > 40) return;
        page = pdf.addPage(pageSize);
        y = 790;
      }

      function text(value, x, yy, size = 10, options = {}) {
        page.drawText(cleanText(value), {
          x,
          y: yy,
          size,
          font: options.bold ? bold : font,
          color: options.color || ink,
        });
      }

      function wrapped(value, x, yy, widthChars, size = 9, options = {}) {
        const lines = wrapWords(value, widthChars);
        lines.forEach((lineText, index) => {
          text(lineText, x, yy - index * (size + 3), size, options);
        });
        return lines.length * (size + 3);
      }

      function labelValue(label, value, x, yy, width = 220) {
        text(label, x, yy, 8, { bold: true, color: muted });
        const used = wrapped(value || '-', x, yy - 14, Math.floor(width / 5.6), 9);
        return used + 16;
      }

      text('QuirkyPromo', margin, y, 24, { bold: true, color: navy });
      text('Customer Quote', 430, y + 4, 18, { bold: true, color: gold });
      y -= 30;
      page.drawLine({ start: { x: margin, y }, end: { x: 553, y }, thickness: 1, color: line });
      y -= 24;

      const quoteNumber = form.quoteNumber || defaultQuoteNumber();
      text(`Quote #: ${quoteNumber}`, margin, y, 10, { bold: true });
      text(`Date: ${form.quoteDate || todayString()}`, 240, y, 10);
      text(`Valid until: ${summary.validUntil || '-'}`, 390, y, 10, { bold: true });
      y -= 24;

      const defaultAddress = form.quoteDeliveryAddress || 'To be confirmed';
      const multipleAddressRows = pdfRows.some((row) =>
        cleanText(row.deliveryAddress).trim() &&
        cleanText(row.deliveryAddress).trim() !== cleanText(defaultAddress).trim()
      );
      const deliveryBasis = multipleAddressRows
        ? 'Pricing is based on the delivery address and delivery plan shown for each option.'
        : `Pricing is based on delivery to: ${defaultAddress}`;

      const leftUsed = labelValue('Customer', [form.customerCompany, form.customerContact, form.customerEmail].filter(Boolean).join('\n'), margin, y, 230);
      const rightUsed = labelValue('Delivery Basis', deliveryBasis, 315, y, 230);
      y -= Math.max(leftUsed, rightUsed) + 10;

      addPageIfNeeded(120);
      page.drawRectangle({ x: margin, y: y - 86, width: 511, height: 96, borderColor: line, color: pale, borderWidth: 1 });
      text('Product', margin + 12, y - 12, 11, { bold: true, color: navy });
      y -= 30;
      const productLeft = labelValue('Product Name', form.productName, margin + 12, y, 230);
      const productRight = labelValue('Specs', form.productSpec || '-', 315, y, 220);
      y -= Math.max(productLeft, productRight);
      const logoUsed = labelValue('Logo / Decoration Requirements', form.logoRequirements || 'To be confirmed', margin + 12, y, 480);
      y -= logoUsed + 18;

      addPageIfNeeded(150);
      text('Quote Options', margin, y, 14, { bold: true, color: navy });
      y -= 20;
      const columns = [
        ['Option', 42, 94],
        ['Qty', 136, 42],
        ['Freight', 178, 58],
        ['Delivery Plan', 236, 110],
        ['Lead Time', 346, 64],
        ['Unit ex GST', 410, 56],
        ['Total ex GST', 466, 58],
        ['Total inc GST', 524, 28],
      ];
      page.drawRectangle({ x: margin, y: y - 18, width: 511, height: 20, color: navy });
      columns.forEach(([label, x]) => text(label, x, y - 12, 7.2, { bold: true, color: rgb(1, 1, 1) }));
      y -= 24;

      pdfRows.forEach((row, index) => {
        addPageIfNeeded(54);
        const optionName = [
          row.recommended ? 'Recommended' : null,
          row.customerOptionLabel || `${shipLabel(row.shippingMode)} option`,
        ].filter(Boolean).join(' - ');
        const rowAddress = row.deliveryAddress || defaultAddress;
        const deliveryPlan = [
          row.deliveryPlanNote,
          multipleAddressRows || row.deliveryAddress ? `To: ${rowAddress}` : null,
        ].filter(Boolean).join(' | ') || 'Delivery to quoted address';
        const leadTime = row.customerLeadTime || row.leadTimeLabel || 'To be confirmed';
        const rowHeight = Math.max(
          34,
          12 + Math.max(wrapWords(optionName, 18).length, wrapWords(deliveryPlan, 24).length, wrapWords(leadTime, 14).length) * 11
        );
        if (index % 2 === 0) {
          page.drawRectangle({ x: margin, y: y - rowHeight + 8, width: 511, height: rowHeight, color: rgb(0.99, 0.985, 0.965) });
        }
        wrapped(optionName, 42, y, 18, 8.5, { bold: row.recommended });
        text(String(row.quantity || ''), 136, y, 8.5);
        text(shipLabel(row.shippingMode), 178, y, 8.5);
        wrapped(deliveryPlan, 236, y, 24, 8.2);
        wrapped(leadTime, 346, y, 14, 8.2);
        text(currency(row.quoteUnitExGstAud, 2), 410, y, 8.2);
        text(currency(row.quoteExGstAud), 466, y, 8.2);
        text(currency(row.quoteIncGstAud), 524, y, 8.2, { bold: true });
        y -= rowHeight;
      });

      y -= 16;
      addPageIfNeeded(90);
      text('Notes', margin, y, 12, { bold: true, color: navy });
      y -= 16;
      const notes = [
        form.validityNote,
        form.customerNotes,
        'Final production starts after artwork proof approval. Pricing excludes any changes to product specification, delivery address, or delivery split unless noted above.',
      ].filter(Boolean).join('\n\n');
      wrapped(notes, margin, y, 94, 9, { color: muted });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safePdfFilename(quoteNumber)}-${safePdfFilename(form.productName)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage(`Customer quote PDF generated with ${pdfRows.length} option${pdfRows.length === 1 ? '' : 's'}.`);
    } catch (err) {
      setError(err.message || 'Could not generate PDF.');
    } finally {
      setGeneratingPdf(false);
    }
  }

  return (
    <div>
      <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1 className="srcx-h1" style={{ marginBottom: 4 }}>Sourcing Costing</h1>
          <div className="srcx-muted">Estimate landed cost, customer quote, and final profit variance.</div>
          {sourceRequest && (
            <div className="srcx-muted" style={{ marginTop: 4 }}>
              Linked request: {sourceRequest.company_name} / {sourceRequest.contact_name} / {sourceRequest.quantity?.toLocaleString()} pcs
            </div>
          )}
          {sourceProduct && (
            <div className="srcx-muted" style={{ marginTop: 4 }}>
              Linked made-to-order product: {sourceProduct.name}
              {sourceProduct.sku ? ` / SKU ${sourceProduct.sku}` : ''}
              {sourceProduct.factoryName ? ` / ${sourceProduct.factoryName}` : ''}
              {sourceProduct.moq ? ` / MOQ ${Number(sourceProduct.moq).toLocaleString()} pcs` : ''}
            </div>
          )}
        </div>
        <div className="srcx-row">
          <button className="srcx-btn srcx-btn-ghost" onClick={generateCustomerQuotePdf} disabled={generatingPdf}>
            {generatingPdf ? 'Generating PDF...' : 'Generate Customer Quote PDF'}
          </button>
          <button className="srcx-btn srcx-btn-gold" onClick={saveEstimate} disabled={saving}>
            {saving ? 'Saving...' : 'Save Estimate'}
          </button>
        </div>
      </div>

      {message && <div className="srcx-card" style={{ borderColor: '#2e7d52', color: '#2e7d52', padding: '10px 14px' }}>{message}</div>}
      {error && <div className="srcx-card" style={{ borderColor: '#b4413e', color: '#b4413e', padding: '10px 14px' }}>{error}</div>}

      <div className="srcx-grid" style={{ gridTemplateColumns: 'minmax(0, 1.15fr) minmax(360px, .85fr)', alignItems: 'start' }}>
        <div>
          <Section title="Factory Quote">
            <div className="srcx-grid srcx-grid-4">
              <Field label="Factory">
                <select value={form.factoryId} onChange={(event) => update('factoryId', event.target.value)}>
                  <option value="">Manual / not selected</option>
                  {factories.map((factory) => (
                    <option key={factory.id} value={factory.id}>{factory.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="选产品(自动带入)">
                <select value={pickedQuoteId} onChange={(event) => pickProduct(event.target.value)} disabled={!form.factoryId}>
                  <option value="">{form.factoryId ? '— 选已报价产品 —' : '先选工厂'}</option>
                  {factoryProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.product_code ? `${p.product_code} · ` : ''}{p.product_name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Product name">
                <input value={form.productName} onChange={(event) => update('productName', event.target.value)} />
              </Field>
              <Field label="Product spec">
                <input value={form.productSpec} onChange={(event) => update('productSpec', event.target.value)} />
              </Field>
            </div>
            {loadedTiers.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
                <span className="srcx-muted" style={{ fontSize: 12 }}>数量档(点一下套用 EXW):</span>
                {loadedTiers.map((t) => (
                  <button key={t.id || t.quantity} type="button" className="srcx-btn srcx-btn-ghost srcx-btn-sm" onClick={() => applyTier(t)}>
                    {Number(t.quantity).toLocaleString()} → ¥{t.exw_unit_price_rmb}
                  </button>
                ))}
              </div>
            )}
            <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
              <Field label="Quantity">
                <input type="number" value={form.quantity} onChange={(event) => update('quantity', event.target.value)} />
              </Field>
              <Field label="Incoterm">
                <select value={form.incoterm} onChange={(event) => update('incoterm', event.target.value)}>
                  <option value="EXW">EXW</option>
                  <option value="FOB">FOB China</option>
                  <option value="CIF">CIF</option>
                  <option value="DDP">DDP</option>
                </select>
              </Field>
              <Field label="Production lead time">
                <input value={form.productionLeadTimeDays} onChange={(event) => update('productionLeadTimeDays', event.target.value)} placeholder="15-20 working days" />
              </Field>
            </div>
            <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
              <MoneyField label="EXW unit RMB" value={form.exwUnitRmb} onChange={(value) => update('exwUnitRmb', value)} />
              <MoneyField label="FOB China unit RMB" value={form.fobUnitRmb} onChange={(value) => update('fobUnitRmb', value)} />
              <MoneyField label="Setup RMB" value={form.setupCostRmb} onChange={(value) => update('setupCostRmb', value)} />
              <MoneyField label="Sample RMB" value={form.sampleCostRmb} onChange={(value) => update('sampleCostRmb', value)} />
              <MoneyField label="Tooling RMB" value={form.toolingCostRmb} onChange={(value) => update('toolingCostRmb', value)} />
            </div>
          </Section>

          <Section title="Customer Quote Details">
            <div className="srcx-grid srcx-grid-3">
              <Field label="Quote number">
                <input value={form.quoteNumber} onChange={(event) => update('quoteNumber', event.target.value)} />
              </Field>
              <Field label="Customer company">
                <input value={form.customerCompany} onChange={(event) => update('customerCompany', event.target.value)} />
              </Field>
              <Field label="Customer contact">
                <input value={form.customerContact} onChange={(event) => update('customerContact', event.target.value)} />
              </Field>
              <Field label="Customer email">
                <input value={form.customerEmail} onChange={(event) => update('customerEmail', event.target.value)} />
              </Field>
              <Field label="Default delivery address">
                <input value={form.quoteDeliveryAddress} onChange={(event) => update('quoteDeliveryAddress', event.target.value)} placeholder="Pricing is based on delivery to this address" />
              </Field>
              <Field label="Logo / decoration requirements">
                <input value={form.logoRequirements} onChange={(event) => update('logoRequirements', event.target.value)} placeholder="Logo position, decoration method, print colours..." />
              </Field>
            </div>
          </Section>

          <Section title="China Charges">
            <div className="srcx-grid srcx-grid-3">
              <MoneyField label="Factory to forwarder RMB" value={form.chinaLocalFreightRmb} onChange={(value) => update('chinaLocalFreightRmb', value)} />
              <MoneyField label="Document fees RMB" value={form.chinaDocumentFeesRmb} onChange={(value) => update('chinaDocumentFeesRmb', value)} />
              <Field label="Document fee note">
                <input value={form.documentFeeLabel} onChange={(event) => update('documentFeeLabel', event.target.value)} placeholder="COO, FTA, fumigation..." />
              </Field>
              <MoneyField label="China other fees RMB" value={form.chinaOtherFeesRmb} onChange={(value) => update('chinaOtherFeesRmb', value)} />
            </div>
          </Section>

          <Section title="Packing">
            <div className="srcx-grid srcx-grid-3">
              <Field label="Units per carton">
                <input type="number" value={form.unitsPerCarton} onChange={(event) => update('unitsPerCarton', event.target.value)} />
              </Field>
              <Field label="Carton L cm">
                <input type="number" step="0.1" value={form.cartonLengthCm} onChange={(event) => update('cartonLengthCm', event.target.value)} />
              </Field>
              <Field label="Carton W cm">
                <input type="number" step="0.1" value={form.cartonWidthCm} onChange={(event) => update('cartonWidthCm', event.target.value)} />
              </Field>
              <Field label="Carton H cm">
                <input type="number" step="0.1" value={form.cartonHeightCm} onChange={(event) => update('cartonHeightCm', event.target.value)} />
              </Field>
              <Field label="Gross kg per carton">
                <input type="number" step="0.01" value={form.grossWeightKgPerCarton} onChange={(event) => update('grossWeightKgPerCarton', event.target.value)} />
              </Field>
              <Field label="Manual total CBM override">
                <input type="number" step="0.0001" value={form.manualTotalCbm} onChange={(event) => update('manualTotalCbm', event.target.value)} />
              </Field>
            </div>
            <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
              <Field label="Express volumetric divisor">
                <input type="number" step="1" value={form.volumetricDivisorExpress} onChange={(event) => update('volumetricDivisorExpress', event.target.value)} />
              </Field>
              <Field label="Air volumetric divisor">
                <input type="number" step="1" value={form.volumetricDivisorAir} onChange={(event) => update('volumetricDivisorAir', event.target.value)} />
              </Field>
              <Field label="Sea volumetric divisor">
                <input type="number" step="1" value={form.volumetricDivisorSea} onChange={(event) => update('volumetricDivisorSea', event.target.value)} />
              </Field>
            </div>
            <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
              <ReadOnlyField label="Volume per carton CBM" value={summary.packing.cbmPerCarton || 0} />
              <ReadOnlyField label="Total volume CBM" value={summary.packing.totalCbm || 0} />
              <ReadOnlyField label="Total gross kg" value={summary.packing.totalGrossWeightKg || 0} />
              <ReadOnlyField label="Express chargeable kg" value={summary.packing.expressChargeableKg || 0} />
              <ReadOnlyField label="Air chargeable kg" value={summary.packing.airChargeableKg || 0} />
              <ReadOnlyField label="Sea chargeable kg" value={summary.packing.seaChargeableKg || 0} />
            </div>
          </Section>

          <Section title="FX, Local Charges, Margin">
            <div className="srcx-grid srcx-grid-3">
              <Field label="FX: 1 RMB = AUD">
                <input type="number" step="0.0001" value={form.exchangeRateEst} onChange={(event) => update('exchangeRateEst', event.target.value)} />
              </Field>
              <Field label="FX buffer %">
                <input type="number" step="0.1" value={form.fxBufferPct} onChange={(event) => update('fxBufferPct', event.target.value)} />
              </Field>
              <Field label="Cost buffer %">
                <input type="number" step="0.1" value={form.costBufferPct} onChange={(event) => update('costBufferPct', event.target.value)} />
              </Field>
              <Field label="Target margin %">
                <input type="number" step="0.1" value={form.targetMarginPct} onChange={(event) => update('targetMarginPct', event.target.value)} />
              </Field>
              <MoneyField label="AU local charges AUD" value={form.localChargesAudEst} onChange={(value) => update('localChargesAudEst', value)} />
              <MoneyField label="Clearance AUD" value={form.clearanceAudEst} onChange={(value) => update('clearanceAudEst', value)} />
              <Field label="Duty rate %">
                <input type="number" step="0.1" value={form.dutyRatePctEst} onChange={(event) => update('dutyRatePctEst', event.target.value)} />
              </Field>
              <MoneyField label="Manual duty AUD" value={form.dutyAudManual} onChange={(value) => update('dutyAudManual', value)} />
              <MoneyField label="Local delivery AUD" value={form.localDeliveryAudEst} onChange={(value) => update('localDeliveryAudEst', value)} />
            </div>
          </Section>

          <Section title="Quote Validity">
            <div className="srcx-grid srcx-grid-3">
              <Field label="Quote date">
                <input type="date" value={form.quoteDate} onChange={(event) => update('quoteDate', event.target.value)} />
              </Field>
              <Field label="Valid days">
                <input type="number" value={form.validityDays} onChange={(event) => update('validityDays', event.target.value)} />
              </Field>
              <Field label="Valid until">
                <input value={summary.validUntil || ''} readOnly />
              </Field>
            </div>
            <div style={{ marginTop: 12 }}>
              <Field label="Validity note for customer quote">
                <textarea rows={3} value={form.validityNote} onChange={(event) => update('validityNote', event.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="📋 报价计算(易读版)">
            <CleanQuote form={form} update={update} applyModes={applyModes} />
          </Section>

          <details style={{ margin: '0 0 14px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: '#5a5550', padding: '10px 0' }}>
              ⚙ 高级明细(报价档矩阵 + 运费选项)—— 平时不用看,易读版会自动填好
            </summary>
            <Section title="Quote Pricing Matrix">
              <PriceBreakMatrix
                rows={form.priceBreaks}
                calculatedRows={summary.priceBreaks || []}
                selectedId={form.selectedPriceBreakId}
                validUntil={summary.validUntil}
                onChange={updatePriceBreak}
                onSelect={selectPriceBreak}
                onRemove={removePriceBreak}
                onAdd={addPriceBreak}
                onAddFreightSet={addFreightSetFromRow}
              />
            </Section>
          </details>

          <Section title="Notes">
            <div className="srcx-grid srcx-grid-2">
              <Field label="Internal notes">
                <textarea rows={4} value={form.internalNotes} onChange={(event) => update('internalNotes', event.target.value)} />
              </Field>
              <Field label="Customer quote notes">
                <textarea rows={4} value={form.customerNotes} onChange={(event) => update('customerNotes', event.target.value)} />
              </Field>
            </div>
          </Section>
        </div>

        <aside>
          <SummaryPanel summary={summary} form={form} />
          <SavedSheets sheets={sheets} selectedId={selectedSheet?.id} onLoad={loadSheet} />
          <ReconciliationPanel
            selectedSheet={selectedSheet}
            actual={actual}
            setActual={setActual}
            actualSummary={actualSummary}
            onSave={reconcileActual}
            saving={reconciling}
          />
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="srcx-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="srcx-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function MoneyField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <input type="number" step="0.01" value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <Field label={label}>
      <input value={value} readOnly />
    </Field>
  );
}

function MatrixInput({ value, onChange, step = '0.01', placeholder = '' }) {
  return (
    <input
      type="number"
      step={step}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      style={{ minWidth: 86 }}
    />
  );
}

function MatrixTextInput({ value, onChange, placeholder = '', width = 126 }) {
  return (
    <input
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      style={{ minWidth: width }}
    />
  );
}

function MatrixAutoValue({ value, digits = 2 }) {
  return (
    <span className="srcx-num" style={{ display: 'inline-block', minWidth: 62 }}>
      {compact(value, digits)}
    </span>
  );
}

function hasManualValue(value) {
  return value !== null && value !== undefined && value !== '';
}

function PriceBreakMatrix({ rows, calculatedRows, selectedId, validUntil, onChange, onSelect, onRemove, onAdd, onAddFreightSet }) {
  function calculated(id) {
    return calculatedRows.find((row) => row.id === id) || {};
  }
  const selectedRow = rows.find((row) => row.id === selectedId) || rows[0];

  return (
    <div>
      <div className="srcx-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="srcx-muted">
          One row is one customer quote option. Freight can calculate from RMB/kg x chargeable kg, with optional manual total override.
        </div>
        <div className="srcx-row">
          <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={() => selectedRow && onAddFreightSet(selectedRow.id)}>Add freight set for selected qty</button>
          <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={() => onAdd('express')}>Add Express</button>
          <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={() => onAdd('air')}>Add Air</button>
          <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={() => onAdd('sea')}>Add Sea</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="srcx-table srcx-matrix">
          <thead>
            <tr>
              <th title="Use this row for the quote summary">Use</th>
              <th title="Include this option in the customer quote PDF">PDF</th>
              <th title="Mark this option as recommended in the customer PDF">Rec</th>
              <th title="Customer-facing option label">Option</th>
              <th title="Delivery address for this option, if different from the default address">Addr</th>
              <th title="Customer-facing delivery plan, split shipment, or address note">Plan</th>
              <th title="Factory unit price, usually EXW">Unit RMB</th>
              <th title="Quantity">Qty</th>
              <th title="FOB China unit price">FOB RMB</th>
              <th title="Factory to forwarder / China local delivery">CN Local</th>
              <th title="COO, test report, fumigation, or other document fee">Doc Fee</th>
              <th title="China subtotal before international freight">CN Subtotal</th>
              <th title="International shipping method">Ship</th>
              <th title="Cartons for this quantity">CTN</th>
              <th title="Gross weight for this quantity">GW kg</th>
              <th title="Total volume for this quantity">CBM</th>
              <th title="Volumetric weight for selected ship mode">Vol kg</th>
              <th title="Chargeable weight in kg">Chg kg</th>
              <th title="International freight rate in RMB per kg">RMB/kg</th>
              <th title="Manual total freight override in RMB">Manual Frt</th>
              <th title="Calculated or manual total freight in RMB">Frt Total</th>
              <th title="Freight cost per product in RMB">Frt/unit</th>
              <th title="Production lead time">Prod LT</th>
              <th title="Transit lead time">Transit LT</th>
              <th title="Australia local charges">AU Local</th>
              <th title="Duty in AUD">Duty</th>
              <th title="Australia local delivery">AU Del.</th>
              <th title="Total RMB cost including international freight">Total RMB</th>
              <th title="Unit RMB cost including international freight">Unit Cost</th>
              <th title="Quote total cost before margin, ex GST">Cost AUD</th>
              <th title="Target margin percentage">Mgn %</th>
              <th title="Customer unit quote ex GST">Unit Quote</th>
              <th title="Customer total quote ex GST">Quote ex GST</th>
              <th title="Quote validity date">Valid</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const calc = calculated(row.id);
              const selected = selectedId === row.id;
              return (
                <tr key={row.id} className={selected ? 'srcx-best' : ''}>
                  <td>
                    <button className={selected ? 'srcx-btn srcx-btn-sm srcx-btn-gold' : 'srcx-btn srcx-btn-sm srcx-btn-ghost'} onClick={() => onSelect(row)}>
                      {selected ? 'Selected' : 'Use'}
                    </button>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginTop: 4, whiteSpace: 'nowrap' }}>
                      {({ express: 'Express 快递', air: 'Air 空运', sea: 'Sea 海运' }[row.shippingMode] || row.shippingMode || 'Air')}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.showOnPdf !== false}
                      onChange={(event) => onChange(row.id, 'showOnPdf', event.target.checked)}
                      style={{ width: 18, height: 18, minWidth: 18 }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(row.recommended)}
                      onChange={(event) => onChange(row.id, 'recommended', event.target.checked)}
                      style={{ width: 18, height: 18, minWidth: 18 }}
                    />
                  </td>
                  <td><MatrixTextInput value={row.customerOptionLabel} placeholder="Recommended" onChange={(value) => onChange(row.id, 'customerOptionLabel', value)} /></td>
                  <td><MatrixTextInput value={row.deliveryAddress} placeholder="Default address" width={150} onChange={(value) => onChange(row.id, 'deliveryAddress', value)} /></td>
                  <td><MatrixTextInput value={row.deliveryPlanNote} placeholder="All to one address / split..." width={170} onChange={(value) => onChange(row.id, 'deliveryPlanNote', value)} /></td>
                  <td><MatrixInput value={row.exwUnitRmb} step="0.0001" onChange={(value) => onChange(row.id, 'exwUnitRmb', value)} /></td>
                  <td><MatrixInput value={row.quantity} step="1" onChange={(value) => onChange(row.id, 'quantity', value)} /></td>
                  <td><MatrixInput value={row.fobUnitRmb} step="0.0001" onChange={(value) => onChange(row.id, 'fobUnitRmb', value)} /></td>
                  <td><MatrixInput value={row.chinaLocalFreightRmb} onChange={(value) => onChange(row.id, 'chinaLocalFreightRmb', value)} /></td>
                  <td><MatrixInput value={row.chinaDocumentFeesRmb} onChange={(value) => onChange(row.id, 'chinaDocumentFeesRmb', value)} /></td>
                  <td className="srcx-num">{rmb(calc.chinaSubtotalRmb)}</td>
                  <td>
                    <select value={row.shippingMode || 'air'} onChange={(event) => onChange(row.id, 'shippingMode', event.target.value)} style={{ minWidth: 92 }}>
                      <option value="express">Express</option>
                      <option value="air">Air</option>
                      <option value="sea">Sea</option>
                    </select>
                  </td>
                  <td><MatrixAutoValue value={calc.packing?.cartonCount} digits={0} /></td>
                  <td><MatrixAutoValue value={calc.packing?.totalGrossWeightKg} digits={3} /></td>
                  <td><MatrixAutoValue value={calc.packing?.totalCbm} digits={4} /></td>
                  <td><MatrixAutoValue value={calc.autoVolumetricWeightKg} digits={3} /></td>
                  <td>
                    <MatrixInput
                      value={hasManualValue(row.chargeableWeightKg) ? row.chargeableWeightKg : calc.autoChargeableWeightKg || ''}
                      step="0.001"
                      onChange={(value) => onChange(row.id, 'chargeableWeightKg', value)}
                    />
                  </td>
                  <td><MatrixInput value={row.freightRateRmbPerKg} step="0.0001" onChange={(value) => onChange(row.id, 'freightRateRmbPerKg', value)} /></td>
                  <td><MatrixInput value={row.internationalShippingRmb} onChange={(value) => onChange(row.id, 'internationalShippingRmb', value)} /></td>
                  <td className="srcx-num">{rmb(calc.internationalShippingRmb)}</td>
                  <td className="srcx-num">{rmb(calc.unitFreightRmb, 4)}</td>
                  <td><input value={row.productionLeadTimeDays || ''} onChange={(event) => onChange(row.id, 'productionLeadTimeDays', event.target.value)} style={{ minWidth: 92 }} /></td>
                  <td><input value={row.transitDays || ''} onChange={(event) => onChange(row.id, 'transitDays', event.target.value)} style={{ minWidth: 88 }} /></td>
                  <td><MatrixInput value={row.localChargesAud} onChange={(value) => onChange(row.id, 'localChargesAud', value)} /></td>
                  <td><MatrixInput value={row.dutyAudManual} onChange={(value) => onChange(row.id, 'dutyAudManual', value)} /></td>
                  <td><MatrixInput value={row.localDeliveryAud} onChange={(value) => onChange(row.id, 'localDeliveryAud', value)} /></td>
                  <td className="srcx-num">{rmb(calc.totalRmb)}</td>
                  <td className="srcx-num">{rmb(calc.unitCostRmb, 4)}</td>
                  <td className="srcx-num">{currency(calc.quoteTotalCostAud)}</td>
                  <td><MatrixInput value={row.marginPct} step="0.1" onChange={(value) => onChange(row.id, 'marginPct', value)} /></td>
                  <td className="srcx-num">{currency(calc.quoteUnitExGstAud, 2)}</td>
                  <td className="srcx-num">{currency(calc.quoteExGstAud)}</td>
                  <td>{validUntil || '-'}</td>
                  <td>
                    <button className="srcx-link" onClick={() => onAddFreightSet(row.id)}>Add set</button>{' | '}
                    <button className="srcx-link srcx-link-danger" onClick={() => onRemove(row.id)}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="srcx-muted" style={{ marginTop: 10 }}>
        Charge kg is auto-calculated from packing volume and gross weight unless you type an override. Manual Freight RMB overrides RMB/kg x chargeable kg.
      </div>
    </div>
  );
}

function FreightOption({ option, selected, summary, onSelect, onChange }) {
  const modeLabel = FREIGHT_MODES.find((mode) => mode.key === option.mode)?.label || option.mode;
  return (
    <div className="srcx-landed" style={{ borderColor: selected ? 'var(--gold)' : 'var(--line)' }}>
      <div className="srcx-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <button className={selected ? 'srcx-btn srcx-btn-sm srcx-btn-gold' : 'srcx-btn srcx-btn-sm srcx-btn-ghost'} onClick={onSelect}>
          {modeLabel}
        </button>
        <strong className="srcx-num">{currency(summary?.estimatedCostAud || 0)}</strong>
      </div>
      <div className="srcx-grid srcx-grid-3">
        <Field label="Provider">
          <input value={option.provider || ''} onChange={(event) => onChange('provider', event.target.value)} />
        </Field>
        <Field label="Rate type">
          <select value={option.rateType} onChange={(event) => onChange('rateType', event.target.value)}>
            <option value="per_kg">Per kg</option>
            <option value="per_cbm">Per CBM</option>
            <option value="fixed">Fixed</option>
          </select>
        </Field>
        <Field label="Currency">
          <select value={option.currency} onChange={(event) => onChange('currency', event.target.value)}>
            <option value="RMB">RMB</option>
            <option value="AUD">AUD</option>
            <option value="USD">USD</option>
          </select>
        </Field>
        <MoneyField label="Rate" value={option.rateAmount} onChange={(value) => onChange('rateAmount', value)} />
        <MoneyField label="Minimum charge" value={option.minCharge} onChange={(value) => onChange('minCharge', value)} />
        <Field label="Transit days">
          <input value={option.transitDays || ''} onChange={(event) => onChange('transitDays', event.target.value)} />
        </Field>
      </div>
      <div className="srcx-muted srcx-num" style={{ marginTop: 8 }}>
        Chargeable: {summary?.chargeableWeightKg || 0} kg / {summary?.cbm || 0} CBM / base {summary?.baseQty || 0}
      </div>
    </div>
  );
}

function SummaryPanel({ summary, form }) {
  const selected = summary.selectedPriceBreak;
  return (
    <div className="srcx-card" style={{ position: 'sticky', top: 12 }}>
      <h2>Quote Summary</h2>
      <div className="srcx-grid srcx-grid-2">
        <Metric label="Selected option" value={selected ? `${selected.quantity} pcs / ${shipLabel(selected.shippingMode)}` : '-'} />
        <Metric label="Cartons" value={summary.packing.cartonCount || 0} />
        <Metric label="Weight" value={`${summary.packing.totalGrossWeightKg || 0} kg`} />
        <Metric label="CBM" value={summary.packing.totalCbm || 0} />
        <Metric label="Chargeable kg" value={`${selected?.chargeableWeightKg || 0} kg`} />
        <Metric label="Unit freight" value={selected ? rmb(selected.unitFreightRmb, 4) : '-'} />
        <Metric label="FX used" value={summary.effectiveExchangeRate || 0} />
        <Metric label="Valid until" value={summary.validUntil || '-'} />
        <Metric label="Lead time" value={selected?.leadTimeLabel || '-'} />
      </div>
      <hr className="srcx-divider" />
      <table className="srcx-table">
        <tbody className="srcx-num">
          <Breakdown label="Total RMB" value={summary.totalRmb} currencyLabel="RMB" />
          <Breakdown label="Factory cost" value={summary.productCostAud} />
          <Breakdown label="China costs" value={summary.chinaCostAud} />
          <Breakdown label={`${summary.selectedFreightMode || form.selectedFreightMode} freight`} value={summary.freightCostAud} />
          <Breakdown label="AU local/clearance/delivery" value={summary.localChargesAud} />
          <Breakdown label="Duty" value={summary.dutyAud} />
          <Breakdown label="Buffer" value={summary.costBufferAud} />
          <Breakdown label="Quote total cost ex GST" value={summary.landedCostExGstAud} bold />
          <Breakdown label="Customer quote ex GST" value={summary.quoteExGstAud} bold />
          <Breakdown label="GST" value={summary.quoteGstAud} />
          <Breakdown label="Customer quote inc GST" value={summary.quoteIncGstAud} bold />
          <Breakdown label="Unit ex GST" value={summary.quoteUnitExGstAud} digits={2} />
          <Breakdown label="Estimated profit" value={summary.estimatedProfitAud} bold green />
        </tbody>
      </table>
      <div className="srcx-muted" style={{ marginTop: 10 }}>
        Customer quote includes the selected freight option.
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="srcx-landed" style={{ marginTop: 0 }}>
      <div className="srcx-muted">{label}</div>
      <div className="srcx-num" style={{ fontWeight: 800, fontSize: 18 }}>{value}</div>
    </div>
  );
}

function Breakdown({ label, value, bold, green, digits = 2, currencyLabel = 'AUD' }) {
  return (
    <tr>
      <td>{label}</td>
      <td style={{ textAlign: 'right', fontWeight: bold ? 800 : 500, color: green ? 'var(--green)' : undefined }}>
        {currencyLabel === 'RMB' ? rmb(value, digits) : currency(value, digits)}
      </td>
    </tr>
  );
}

function SavedSheets({ sheets, selectedId, onLoad }) {
  return (
    <div className="srcx-card">
      <h2>Saved Estimates</h2>
      {!sheets.length ? (
        <div className="srcx-empty" style={{ padding: 18 }}>No saved cost sheets yet.</div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {sheets.slice(0, 8).map((sheet) => (
            <button
              key={sheet.id}
              className="srcx-link"
              onClick={() => onLoad(sheet)}
              style={{
                textAlign: 'left',
                border: selectedId === sheet.id ? '1px solid var(--gold)' : '1px solid var(--line)',
                borderRadius: 8,
                padding: '10px 12px',
                textDecoration: 'none',
                color: 'var(--ink)',
              }}
            >
              <strong>{sheet.sheet_number || 'Draft'}</strong>
              <div>{sheet.product_name} / {sheet.quantity?.toLocaleString()} pcs</div>
              <div className="srcx-muted">
                Quote {currency(sheet.quote_inc_gst_aud)} / Profit {currency(sheet.estimated_profit_aud)}
              </div>
              {sheet.estimate_summary?.validUntil && (
                <div className="srcx-muted">
                  Valid until {sheet.estimate_summary.validUntil}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReconciliationPanel({ selectedSheet, actual, setActual, actualSummary, onSave, saving }) {
  function set(key, value) {
    setActual((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="srcx-card">
      <h2>Actual Cost Reconciliation</h2>
      {!selectedSheet ? (
        <div className="srcx-empty" style={{ padding: 18 }}>Save or load an estimate first.</div>
      ) : (
        <>
          <div className="srcx-grid srcx-grid-2">
            <MoneyField label="Customer invoice inc GST" value={actual.customerInvoiceIncGstAud} onChange={(value) => set('customerInvoiceIncGstAud', value)} />
            <MoneyField label="Payment received AUD" value={actual.paymentReceivedAud} onChange={(value) => set('paymentReceivedAud', value)} />
            <MoneyField label="Actual factory AUD" value={actual.actualFactoryCostAud} onChange={(value) => set('actualFactoryCostAud', value)} />
            <MoneyField label="Actual China costs AUD" value={actual.actualChinaCostAud} onChange={(value) => set('actualChinaCostAud', value)} />
            <MoneyField label="Actual freight AUD" value={actual.actualFreightAud} onChange={(value) => set('actualFreightAud', value)} />
            <MoneyField label="Actual local charges AUD" value={actual.actualLocalChargesAud} onChange={(value) => set('actualLocalChargesAud', value)} />
            <MoneyField label="Actual duty AUD" value={actual.actualDutyAud} onChange={(value) => set('actualDutyAud', value)} />
          </div>
          {actualSummary && (
            <div className="srcx-landed">
              <table className="srcx-table">
                <tbody className="srcx-num">
                  <Breakdown label="Invoice ex GST" value={actualSummary.invoiceExGstAud} />
                  <Breakdown label="Actual landed ex GST" value={actualSummary.actualLandedCostExGstAud} />
                  <Breakdown label="Actual profit" value={actualSummary.actualProfitAud} bold green={actualSummary.actualProfitAud >= 0} />
                  <Breakdown label="Variance vs estimate" value={actualSummary.profitVarianceAud} bold green={actualSummary.profitVarianceAud >= 0} />
                </tbody>
              </table>
            </div>
          )}
          <button className="srcx-btn" onClick={onSave} disabled={saving} style={{ marginTop: 10 }}>
            {saving ? 'Saving...' : 'Save Actuals'}
          </button>
        </>
      )}
    </div>
  );
}

function FreightCompare({ form, onApply }) {
  const [postcode, setPostcode] = useState('');
  const [goodsClass, setGoodsClass] = useState('class1');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const qty = Math.max(0, Math.ceil(Number(form.quantity) || 0));
  const upc = Math.max(0, Math.ceil(Number(form.unitsPerCarton) || 0));
  const cartonCount = upc > 0 ? Math.ceil(qty / upc) : 0;
  const actualKg = (Number(form.grossWeightKgPerCarton) || 0) * cartonCount;
  const CARRIER = { dhl: '香港DHL', ups: '香港UPS', fedex: '内地FedEx', air: '空派', sea: '海派' };
  const f2 = (v) => (v == null ? '—' : Number(v).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

  async function run() {
    setLoading(true); setResult(null);
    const input = {
      actualKg,
      cartonL: Number(form.cartonLengthCm) || 0,
      cartonW: Number(form.cartonWidthCm) || 0,
      cartonH: Number(form.cartonHeightCm) || 0,
      cartonCount, pieces: cartonCount,
      qty, goodsClass,
      postcode: Number(postcode) || null,
      fxRate: Number(form.exchangeRateEst) || null,
    };
    const res = await fetch('/api/admin/sourcing/freight-engine', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'calc', input }),
    });
    setResult(await res.json());
    setLoading(false);
  }

  return (
    <div>
      <p className="srcx-muted" style={{ marginTop: 0 }}>
        用箱规/重量(数量 {qty}、{cartonCount} 箱、实重 {f2(actualKg)}kg)+ 邮编 + 品类实时比价。选一个「用此」→ 写进当前选中价格档的「国际运费 RMB」。
      </p>
      <div className="srcx-row" style={{ gap: 12, flexWrap: 'wrap' }}>
        <div className="srcx-field" style={{ width: 140 }}>
          <label>目的邮编</label>
          <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="如 2000" />
        </div>
        <div className="srcx-field" style={{ width: 220 }}>
          <label>品类</label>
          <select value={goodsClass} onChange={(e) => setGoodsClass(e.target.value)}>
            <option value="class1">一类 ¥1/kg</option>
            <option value="class2">二类 ¥2/kg</option>
            <option value="class3">三类 ¥3/kg</option>
            <option value="special">特殊 ¥3/件</option>
          </select>
        </div>
        <div className="srcx-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="srcx-btn" onClick={run} disabled={loading || !cartonCount}>{loading ? '计算中…' : '比价'}</button>
        </div>
      </div>
      {!cartonCount && <p className="srcx-muted" style={{ fontSize: 12 }}>请先在上方填「每箱数量」「箱规」「每箱毛重」。</p>}
      {result?.blacklisted && <p className="srcx-error">邮编 {result.postcode} 不可派送(黑名单)。</p>}
      {result && !result.blacklisted && (
        <table className="srcx-table" style={{ marginTop: 10 }}>
          <thead><tr><th>方式 / 承运商</th><th>计费重</th><th>RMB</th><th>AUD</th><th></th></tr></thead>
          <tbody className="srcx-num">
            {result.valid?.map((r, i) => (
              <tr key={i} style={{ background: i === 0 ? '#E1F5EE' : undefined }}>
                <td>{CARRIER[r.carrier] || r.carrier}{r.service ? ` ${String(r.service).toUpperCase()}` : ''}{i === 0 ? ' ← 最省' : ''}</td>
                <td>{f2(r.chargeableKg)}kg</td>
                <td>¥{f2(r.totalRmb)}</td>
                <td><strong>${f2(r.freightAud)}</strong></td>
                <td><button className="srcx-btn srcx-btn-gold" style={{ padding: '2px 10px', fontSize: 12 }} onClick={() => onApply(r)}>用此</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {result && !result.blacklisted && (
        <p className="srcx-muted" style={{ fontSize: 12, marginTop: 6 }}>
          海/空含税:本地费/关税留空;Express 不含税:记得在下方填关税 15% + 清关 120AUD。写入的是 RMB 运费,整单 ×汇率折 AUD。
        </p>
      )}
    </div>
  );
}

// Clean vertical costing view: factory EXW → CN local → international shipping (3 options)
// → local AUD → total AUD → margin → customer price, with a 3-way freight comparison.
function CleanQuote({ form, update, applyModes }) {
  const [postcode, setPostcode] = useState('');
  const [goodsClass, setGoodsClass] = useState('class1');
  const [freight, setFreight] = useState(null); // byChannel { express, air, sea }
  const [loading, setLoading] = useState(false);
  const [pickMode, setPickMode] = useState('sea');

  const f2 = (v, d = 2) => (v == null || Number.isNaN(Number(v)) ? '—' : Number(v).toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d }));
  const qty = Math.max(1, Math.ceil(Number(form.quantity) || 0));
  const upc = Math.max(0, Math.ceil(Number(form.unitsPerCarton) || 0));
  const cartonCount = upc > 0 ? Math.ceil(qty / upc) : 0;
  const actualKg = (Number(form.grossWeightKgPerCarton) || 0) * cartonCount;
  const fx = (Number(form.exchangeRateEst) || 0) * (1 + (Number(form.fxBufferPct) || 0) / 100);
  const marginPct = Number(form.targetMarginPct) || 0;
  const exwTotal = (Number(form.exwUnitRmb) || 0) * qty;
  const cnLocal = (Number(form.chinaLocalFreightRmb) || 0) + (Number(form.chinaDocumentFeesRmb) || 0) + (Number(form.chinaOtherFeesRmb) || 0);
  const localAud = (Number(form.localChargesAudEst) || 0) + (Number(form.clearanceAudEst) || 0) + (Number(form.localDeliveryAudEst) || 0);

  async function calcFreight() {
    setLoading(true);
    const input = {
      actualKg, cartonL: Number(form.cartonLengthCm) || 0, cartonW: Number(form.cartonWidthCm) || 0, cartonH: Number(form.cartonHeightCm) || 0,
      cartonCount, pieces: cartonCount, qty, goodsClass, postcode: Number(postcode) || null, fxRate: fx || null,
    };
    try {
      const res = await fetch('/api/admin/sourcing/freight-engine', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'calc', input }) });
      const d = await res.json();
      setFreight(d.byChannel || null);
      setPickMode(d.byChannel?.sea ? 'sea' : d.byChannel?.air ? 'air' : 'express');
    } catch { setFreight(null); }
    setLoading(false);
  }

  function priceForMode(mode) {
    const fr = freight?.[mode];
    if (!fr || fr.totalRmb == null) return null;
    const row = { quantity: qty, exwUnitRmb: form.exwUnitRmb, shippingMode: mode, internationalShippingRmb: fr.totalRmb };
    const c = calculatePriceBreak(row, form, fx);
    return { freightRmb: Number(fr.totalRmb), unit: c.quoteUnitExGstAud, total: c.quoteExGstAud, landedUnit: c.quoteUnitExGstAud ? c.quoteTotalCostAud / qty : 0 };
  }

  const MODES = [
    { k: 'express', label: 'Express 快递', t: '5–7天' },
    { k: 'air', label: 'Air 空运', t: '6–10天' },
    { k: 'sea', label: 'Sea 海运', t: '20–30天' },
  ];
  const priced = MODES.map((m) => ({ ...m, p: priceForMode(m.k) })).filter((m) => m.p);
  const cheapestK = priced.slice().sort((a, b) => a.p.unit - b.p.unit)[0]?.k;
  const sel = priceForMode(pickMode);

  const bh = (bg) => ({ padding: '7px 13px', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', color: '#fff', background: bg });
  const blk = { border: '1px solid #E0DDD7', borderRadius: 12, margin: '0 0 11px', overflow: 'hidden' };
  const ln = { display: 'flex', justifyContent: 'space-between', padding: '8px 13px', fontSize: 13.5 };

  return (
    <div>
      <p className="srcx-muted" style={{ marginTop: 0 }}>
        数量 {qty}、{cartonCount} 箱、实重 {f2(actualKg)}kg。填邮编 + 品类 → 算运费 → 下面竖着看每块成本 + 三种运费客户价。
      </p>
      <div className="srcx-row" style={{ gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <div className="srcx-field" style={{ width: 130 }}><label>目的邮编</label><input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="2000" /></div>
        <div className="srcx-field" style={{ width: 200 }}><label>品类</label>
          <select value={goodsClass} onChange={(e) => setGoodsClass(e.target.value)}>
            <option value="class1">一类 ¥1/kg</option><option value="class2">二类 ¥2/kg</option>
            <option value="class3">三类 ¥3/kg</option><option value="special">特殊 ¥3/件</option>
          </select>
        </div>
        <div className="srcx-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="srcx-btn" onClick={calcFreight} disabled={loading || !cartonCount}>{loading ? '算运费中…' : '算运费'}</button>
        </div>
      </div>
      {!cartonCount && <p className="srcx-muted" style={{ fontSize: 12 }}>请先在上方填「每箱数量」「箱规」「每箱毛重」。</p>}

      <div style={blk}><div style={bh('#9A3324')}>① 工厂 FACTORY · RMB</div>
        <div style={ln}><span className="srcx-muted">EXW 单价 × 数量</span><span style={{ fontWeight: 700, color: '#1B2A4A' }}>¥{f2(Number(form.exwUnitRmb) || 0, 4)} × {qty} = ¥{f2(exwTotal)}</span></div>
      </div>
      <div style={blk}><div style={bh('#9A3324')}>② 中国端费用 CN LOCAL · RMB</div>
        <div style={ln}><span className="srcx-muted">内陆运费 + 单证 + 杂费</span><span style={{ fontWeight: 700, color: '#1B2A4A' }}>¥{f2(cnLocal)}</span></div>
        <div style={{ ...ln, background: '#F4F3F0', fontWeight: 700 }}><span>中国端小计</span><span>¥{f2(exwTotal + cnLocal)}</span></div>
      </div>
      <div style={blk}><div style={bh('#1B2A4A')}>③ 国际运费 INTERNATIONAL · RMB(选一个)</div>
        {freight ? MODES.map((m) => {
          const fr = freight[m.k];
          const on = pickMode === m.k;
          return (
            <div key={m.k} onClick={() => fr && setPickMode(m.k)} style={{ ...ln, cursor: fr ? 'pointer' : 'default', background: on ? '#E1F5EE' : undefined, opacity: fr ? 1 : 0.45 }}>
              <span>{on ? '● ' : '○ '}{m.label} · {m.t}{cheapestK === m.k ? ' · 最省' : ''}</span>
              <span style={{ fontWeight: 700, color: '#1B2A4A' }}>{fr ? `¥${f2(fr.totalRmb)}` : '不可用'}</span>
            </div>
          );
        }) : <div style={{ ...ln, color: '#8a857e' }}>点上面「算运费」后这里出现 Express / Air / Sea 三个价</div>}
      </div>
      <div style={blk}><div style={bh('#C9A96E')}>④ 本地费用 LOCAL · AUD</div>
        <div style={ln}><span className="srcx-muted">清关/派送/其它(常为0)</span><span style={{ fontWeight: 700, color: '#1B2A4A' }}>A${f2(localAud)}</span></div>
      </div>
      <div style={blk}><div style={bh('#0F6E56')}>⑤ 合计 → AUD(按选中的 {MODES.find((m) => m.k === pickMode)?.label || ''})</div>
        <div style={ln}><span className="srcx-muted">(① + ② + ③) × 汇率 {f2(fx, 4)} + ④</span><span style={{ fontWeight: 700, color: '#1B2A4A' }}>到岸 /个 A${sel ? f2(sel.landedUnit) : '—'}</span></div>
      </div>
      <div style={blk}><div style={bh('#0F6E56')}>⑥ MARGIN</div>
        <div className="srcx-row" style={{ gap: 14, padding: '8px 13px', flexWrap: 'wrap' }}>
          <div className="srcx-field" style={{ width: 130 }}><label>毛利率 %</label>
            <input type="number" step="0.5" value={form.targetMarginPct} onChange={(e) => update('targetMarginPct', e.target.value)} />
          </div>
          <div className="srcx-field" style={{ width: 130 }}><label>或 倍数 ×</label>
            <input type="number" step="0.01" value={marginPct > 0 && marginPct < 100 ? (1 / (1 - marginPct / 100)).toFixed(2) : ''}
              onChange={(e) => { const m = Number(e.target.value); update('targetMarginPct', m > 1 ? String(Math.round((1 - 1 / m) * 10000) / 100) : '0'); }} placeholder="1.40" />
          </div>
        </div>
      </div>

      <div style={{ background: '#1B2A4A', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px' }}>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>⑦ 客户单价(选中 {MODES.find((m) => m.k === pickMode)?.label || ''},excl. GST)</span>
        <span style={{ color: '#C9A96E', fontSize: 22, fontWeight: 700 }}>A${sel ? f2(sel.unit) : '—'} /个</span>
      </div>

      {priced.length > 0 && (
        <>
          <p className="srcx-muted" style={{ fontSize: 12, fontWeight: 700, margin: '0 0 6px' }}>三种运费的客户报价(并排比):</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {priced.map((m) => (
              <div key={m.k} style={{ flex: 1, border: m.k === cheapestK ? '2px solid #0F6E56' : '1px solid #E0DDD7', borderRadius: 10, padding: 10, textAlign: 'center', background: m.k === cheapestK ? '#F2FBF7' : '#fff' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: m.k === cheapestK ? '#0F6E56' : '#5a5550' }}>{m.label}{m.k === cheapestK ? ' ✓' : ''}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1B2A4A' }}>A${f2(m.p.unit)}</div>
                <div style={{ fontSize: 11, color: '#8a857e' }}>/个 · 总 A${f2(m.p.total)}</div>
              </div>
            ))}
          </div>
          <button className="srcx-btn srcx-btn-gold" onClick={() => applyModes(freight)}>
            ✓ 用这三种运费出报价(填入下方明细 + PDF 三个选项)
          </button>
        </>
      )}
    </div>
  );
}
