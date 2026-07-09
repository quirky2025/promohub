# Intex Import Checklist — "Quality Gate"

Purpose: import the Intex Global range (~700 products) **clean from day one**, avoiding
every data bug we found while fixing LL (Logoline) / PB (PromoBrands). Each rule below
comes from a real bug caught during精修. Turn bugs into prevention.

Source files: `Intex-data-export-au.csv` (native — decoration pricing + setups) +
`Intex-data-export-appa-au.csv` (APPA — clean image URLs + colours). **Join on `product_code`.**

Pricing model: **calculator** (decorated-to-order, like AS Colour / Gildan) →
`decoration_model = 'calculator'`, card shows "From $X · decorated".

---

## A. Import rules (bake these into the mapping)

1. **Quote-only products get NO decoration rows.**
   If a product has no real per-unit print price (indent / made-to-order / sourcing),
   do **NOT** stuff the product's unit price into `decoration_options.per_unit`.
   Flag it `quote_only = true` and route the PDP to "Request a Quote".
   *(Bug source: LN/LL indent products showed $123 / $220 "print prices" = product price leaked into decoration.)*

2. **Every decoration option keeps its OWN print size.**
   Map each option's real `detail` (print area) individually. Do **NOT** copy the large
   size (e.g. `350mm x 280mm`) onto the smaller-area variant.
   *(Bug source: Faux Embroidery / Colourflex / DigiFlex small variant was stamped "350x280", making two identical-looking rows at different prices.)*

3. **Classify add-ons as `type='addon'`, not `branding`.**
   Packaging / extras → addon: `polybag`, `gift box`, `gift box sleeve`, `sleeve`,
   `kitting`, `carton`, `pouch`, `gift tube`, `customisable card`, `personalisation surcharge`,
   `variable data …`. These belong in the "Add-ons & Extras" section, not "Branding & Decoration".
   *(Bug source: "Individual Polybag" was `branding` → appeared in the decoration table.)*

4. **Capture each option's real setup fee.**
   Store the per-option setup from the feed (Intex has it, e.g. $20 / $40 per option).
   Do **NOT** collapse to a single product-level number.
   *(Bug source: LL8831 supplier setup was $40 (1-pos) / $80 (2-pos) but we kept only one $40 → 2-pos undercharged. Standard products currently use a flat house setup of $60; for Intex, keep the real per-option setup so multi-position isn't underpriced.)*

5. **Normalise method names.**
   Map the many feed name variants to a small family set: Pad Print, Screen Print,
   Digital / DTG, Transfer (DigiFlex / Colourflex / Digital), Laser / Engraving,
   Embroidery, Debossing, Sublimation. Avoid 100+ near-duplicate names.

6. **Images: host on R2/Cloudinary — never hotlink `media.intexglobal.com`.**
   Download the APPA image URLs, store on our own R2 (like the TRENDS webp pipeline).

7. **Taxonomy: map to our two-level category/subcategory** (Apparel/Bags/Drinkware…),
   not the supplier's raw path. Set `supplier = 'IntexGlobal'` (or agreed brand name) so
   the Brand filter works and it stays independent of TRENDS pricing.

---

## B. Pricing sanity (must hold after import)

- Decoration per-unit **sell** = cost × 1.4, **rounded UP to nearest $0.10** (site rule).
- Setup: keep Intex's real per-option setup (see A4). Never below cost.
- Card "From $X" = cheapest garment tier × margin + cheapest decoration (calculator).
- Product/unbranded tier prices are **not** rounded — only decoration per-unit.
- No decoration `per_unit` should exceed the product's own unit price (that = pollution → it's a quote-only product, see A1).

---

## C. Process — sample first, never blast 700 in blind

1. Import a **sample of 5–10 Intex products** spanning categories (a drinkware, a bag, an apparel, one with multiple print sizes, one indent/quote-only).
2. **Eyeball each** on a preview PDP: price ×1.4 + $0.10 round, correct sizes, setup right, add-ons in the Add-ons section, images loading, category correct, Brand filter shows IntexGlobal.
3. Only after the sample is clean → run the **full ~700**.
4. Re-run the audit queries in §D on the full set before publishing.

---

## D. Audit queries (run in Supabase after import — no sandbox needed)

```sql
-- 1) Pollution: decoration priced higher than the product itself (= quote-only leaked in)
select p.supplier_sku, p.name, max(d.per_unit) as max_deco,
       (select min(base_price) from pricing_tiers pt where pt.product_id = p.id) as min_base
from decoration_options d join products p on p.id = d.product_id
where p.supplier ilike 'intex%' and d.type='branding'
group by p.id, p.supplier_sku, p.name
having max(d.per_unit) > (select min(base_price) from pricing_tiers pt where pt.product_id = p.id);

-- 2) Duplicate-looking rows: same method + same size, different price (= size mislabelled)
select p.supplier_sku, d.name as method, d.detail,
       count(*) n, array_agg(d.per_unit order by d.per_unit) prices
from decoration_options d join products p on p.id = d.product_id
where p.supplier ilike 'intex%' and d.type='branding'
group by p.supplier_sku, d.name, d.detail
having count(*) > 1 and count(distinct d.per_unit) > 1;

-- 3) Add-ons mis-typed as branding
select name, count(*) from decoration_options d
join products p on p.id = d.product_id
where p.supplier ilike 'intex%' and d.type='branding'
  and (name ilike any (array['%polybag%','%gift box%','%sleeve%','%packaging%','%kitting%','%carton%','%pouch%','%card%','%gift tube%','%personalisation%','%variable data%']))
group by name;
```
Each of these should return **zero rows** on a clean import.

---

## Notes
- This checklist is derived from the LL/PB精修 (2026-07). Add a new rule every time a
  new bug class is found — this doc is the running "import quality spec".
- Sandbox not required: the transform can run on Lily's own machine (script emits SQL) or
  via Supabase CSV import + JOIN. Auditing (§D) is pure Supabase SQL.
