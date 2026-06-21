// Single source of truth for a company's address: the company_addresses table
// (same table the customer /account uses). Falls back to companies.billing_address.
export function fmtAddrRow(r) {
  if (!r) return '';
  const cityLine = [r.suburb, r.state, r.postcode].filter(Boolean).join(' ');
  const country = r.country && r.country !== 'Australia' ? r.country : '';
  return [r.line1, r.line2, cityLine, country].filter(Boolean).join(', ');
}
export function fmtBilling(a) {
  if (!a) return '';
  if (typeof a === 'string') return a;
  try { return Object.values(a).filter(Boolean).join(', '); } catch { return ''; }
}
// pick the default delivery row from a list of company_addresses rows
export function pickDefaultDelivery(rows) {
  const list = (rows || []).filter(r => r.kind === 'delivery');
  return list.find(r => r.is_default) || list[0] || null;
}
