import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// GET ?q=<sku or name> → products with COST data (base_price tiers + decorations + sizes).
// Used by the Raise PO modal to auto-fill a supplier COST line (base + decoration + setup,
// NO margin). Everything stays editable after (print method is confirmed with the supplier).
export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || searchParams.get('sku') || '').trim();
  if (!q) return Response.json({ products: [] });

  const db = sourcingDb();
  const { data, error } = await db
    .from('products')
    .select('id, name, sku, size_chart, size_pricing, pricing_tiers(min_qty, max_qty, base_price, sort_order), decoration_options(id, name, detail, per_unit, has_setup, setup_fee, type, sort_order)')
    .or(`sku.ilike.%${q}%,name.ilike.%${q}%`)
    .limit(12);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const products = (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    sizes: Array.isArray(p.size_chart?.sizes) ? p.size_chart.sizes : [],
    sizePricing: p.size_pricing || {},
    tiers: (p.pricing_tiers || [])
      .slice()
      .sort((a, b) => (a.sort_order ?? a.min_qty ?? 0) - (b.sort_order ?? b.min_qty ?? 0))
      .map((t) => ({ minQty: t.min_qty, maxQty: t.max_qty, base: Number(t.base_price) || 0 })),
    decorations: (p.decoration_options || [])
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((d) => ({ id: d.id, name: d.name, detail: d.detail, perUnit: Number(d.per_unit) || 0, hasSetup: !!d.has_setup, setupFee: Number(d.setup_fee) || 0, type: d.type })),
  }));

  return Response.json({ products });
}
