import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { productMaterialFamilies } from '@/lib/smartCollections';

// D8 — distinct values for the rule builder, scanned from real product data.
export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();

  const categories = new Set();
  const subByCat = {};
  const brands = new Set();
  const suppliers = new Set();
  const colours = new Set();
  const materials = new Set();
  const decoModels = new Set();

  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('products')
      .select('name, materials, category, subcategory, brand, supplier, colour_slugs, material_tags, decoration_model')
      .eq('is_published', true)
      .range(from, from + PAGE - 1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    (data || []).forEach(p => {
      if (p.category) {
        categories.add(p.category);
        if (p.subcategory) {
          if (!subByCat[p.category]) subByCat[p.category] = new Set();
          subByCat[p.category].add(p.subcategory);
        }
      }
      if (p.brand) brands.add(p.brand);
      if (p.supplier) suppliers.add(p.supplier);
      (Array.isArray(p.colour_slugs) ? p.colour_slugs : []).forEach(c => c && colours.add(c));
      // material options = the same FAMILIES the sidebar filter shows
      productMaterialFamilies(p).forEach(m => m && materials.add(m));
      if (p.decoration_model) decoModels.add(p.decoration_model);
    });
    if (!data || data.length < PAGE) break;
  }

  // print methods from decoration_options (distinct names, no addons)
  const printMethods = new Set();
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('decoration_options')
      .select('name, type')
      .range(from, from + PAGE - 1);
    if (error) break;
    (data || []).forEach(d => { if (d.name && d.type !== 'addon') printMethods.add(d.name); });
    if (!data || data.length < PAGE) break;
  }

  const sort = (s) => [...s].sort((a, b) => String(a).localeCompare(String(b)));
  return NextResponse.json({
    categories: sort(categories),
    subcategories: Object.fromEntries(Object.entries(subByCat).map(([k, v]) => [k, sort(v)])),
    brands: sort(brands),
    suppliers: sort(suppliers),
    colours: sort(colours),
    material_tags: sort(materials),
    decoration_models: sort(decoModels),
    print_methods: sort(printMethods),
  });
}
