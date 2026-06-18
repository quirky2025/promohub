// Fixture tests for lib/filterAttributes.js  ->  node scripts/test_filterAttributes.mjs
import {
  colourFamiliesOf, decorationFamiliesOf, isDecorationCharge,
  moqBucket, capacityBucketBags, capacityBucketDrinkware, stockTypeOf,
  materialFamiliesOf, materialFamiliesFromText, materialPrimaryFromText, primaryBottleMaterial, isBpaFreeText, gendersFromText,
} from '../lib/filterAttributes.js';

let pass = 0, fail = 0;
const eq = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
function check(label, got, want) {
  const ok = Array.isArray(want) ? eq(got, want) : got === want;
  if (ok) { pass++; console.log('PASS ' + label); }
  else { fail++; console.log('FAIL ' + label + '  got=' + JSON.stringify(got) + ' want=' + JSON.stringify(want)); }
}

// Colour (token-aware, compound, multi, no false-positive)
check('natural-and-black', colourFamiliesOf(['natural-and-black']), ['Natural','Black']);
check('white-cup-and-navy-band', colourFamiliesOf(['white-cup-and-navy-band']), ['White','Blue']);
check('frosted-clear', colourFamiliesOf(['frosted-clear']), ['Clear']);
check('rose-gold (not Pink)', colourFamiliesOf(['rose-gold']), ['Gold']);
check('khaki', colourFamiliesOf(['khaki']), ['Natural']);
check('custom-pms-colours -> Multi', colourFamiliesOf(['custom-pms-colours']), ['Multi']);
check('multicolour -> Multi', colourFamiliesOf(['multicolour']), ['Multi']);
check('redwood NOT Red (token-aware)', colourFamiliesOf(['redwood']), []);

// Decoration (charge exclusion + 6 families + precedence)
check('Embroidery Per Position', decorationFamiliesOf(['Embroidery Per Position (up to 10,000 stitches)']), ['Embroidery']);
check('Additional Stitches is charge', isDecorationCharge('Embroidery Per Additional 5,000 Stitches'), true);
check('Screen Print -> Screen/Pad', decorationFamiliesOf(['Screen Print']), ['Screen / Pad Print']);
check('Pad Print -> Screen/Pad', decorationFamiliesOf(['Pad Print Per Colour/Position']), ['Screen / Pad Print']);
check('UVDTF -> Full Colour', decorationFamiliesOf(['UVDTF Full Colour']), ['Full Colour']);
check('Laser Engraving', decorationFamiliesOf(['Laser Engraving Per Position']), ['Laser Engraving']);
check('Digital Transfer -> Transfer (precedence)', decorationFamiliesOf(['Digital Transfer']), ['Transfer']);
check('Debossing -> Special', decorationFamiliesOf(['Debossing Per Position']), ['Special']);

// Material (keyword, one family per tag, precedence)
check('Cotton', materialFamiliesOf(['Cotton']), ['Cotton']);
check('Jute / Hessian', materialFamiliesOf(['Jute']), ['Jute']);
check('600D Polyester', materialFamiliesOf(['600D Polyester']), ['Polyester']);
check('Non-Woven PP -> Non-Woven (not Plastic)', materialFamiliesOf(['Non-Woven Polypropylene']), ['Non-Woven']);
check('recycled polyester -> RPET (not Polyester)', materialFamiliesOf(['Recycled Polyester']), ['RPET']);
check('RPET', materialFamiliesOf(['rPET']), ['RPET']);
check('Canvas', materialFamiliesOf(['Cotton Canvas']), ['Cotton']);
check('two tags -> two families', materialFamiliesOf(['Nylon','Aluminium']), ['Nylon','Aluminium']);

// Material from free text (product.materials) -- option 1: all families, with precedence
check('text: Jute with cotton handles', materialFamiliesFromText('Jute with cotton handles'), ['Jute','Cotton']);
check('text: 600D Polyester', materialFamiliesFromText('600D Polyester'), ['Polyester']);
check('text: Recycled Polyester (rPET) -> RPET only', materialFamiliesFromText('Recycled Polyester (rPET)'), ['RPET']);
check('text: Non-Woven Polypropylene -> Non-Woven only', materialFamiliesFromText('Non-Woven Polypropylene'), ['Non-Woven']);
check('text: 100% Cotton Canvas', materialFamiliesFromText('100% Cotton Canvas'), ['Cotton','Canvas']);
check('text: Stainless Steel -> own value', materialFamiliesFromText('Stainless Steel Bottle'), ['Stainless Steel']);
check('text: empty', materialFamiliesFromText(''), []);
check('text: Recycled Cotton (not RPET)', materialFamiliesFromText('Recycled Cotton'), ['Cotton']);
check('name: Poly Tote Bag -> Polyester', materialFamiliesFromText('Poly Tote Bag'), ['Polyester']);
check('name: Juco Shopper -> Jute+Cotton', materialFamiliesFromText('Juco Shopper'), ['Jute','Cotton']);
check('name: polypropylene -> PP (not Polyester/Plastic)', materialFamiliesFromText('Polypropylene Bag'), ['Polypropylene']);
check('name: Non-Woven Tote', materialFamiliesFromText('Non-Woven Tote'), ['Non-Woven']);

// Drinkware materials (split metal; tritan/glass/ceramic/bamboo)
check('Recycled Stainless Steel -> Stainless Steel', materialFamiliesFromText('Recycled Stainless Steel Bottle'), ['Stainless Steel']);
check('Aluminium Bottle', materialFamiliesFromText('Aluminium Drink Bottle'), ['Aluminium']);
check('Tritan (not Plastic)', materialFamiliesFromText('Tritan Sports Bottle'), ['Tritan']);
check('Borosilicate Glass', materialFamiliesFromText('Borosilicate Glass Cup'), ['Glass']);
check('Bamboo + Ceramic mug', materialFamiliesFromText('Bamboo Lid Ceramic Mug').sort(), ['Bamboo','Ceramic']);
check('Carbon Steel -> Metal (no stainless)', materialFamiliesFromText('Carbon Steel Mug'), ['Metal']);
check('tag Stainless Steel', materialFamiliesOf(['Stainless Steel']), ['Stainless Steel']);

// PRIMARY material (drop lid/seal/handle/sleeve accessory parts)
check('primary: steel bottle w/ poly handle -> Stainless Steel only', materialPrimaryFromText('Bottle: 201 Stainless Steel Outer, 304 Stainless Steel Inner | Lid: Polypropylene (PP) and a Silicone Seal | Carry Handle: Polyester (PES)'), ['Stainless Steel']);
check('primary: glass bottle w/ jute sleeve -> Glass only', materialPrimaryFromText('Bottle: Borosilicate Glass | Sleeve: Jute/Hessian'), ['Glass']);
check('primary: bag body poly, nylon lining/PU trim -> Polyester only', materialPrimaryFromText('Body: 600D Polyester | Lining: Nylon | Trim: PU'), ['Polyester']);
check('primary: unlabeled fallback', materialPrimaryFromText('Stainless Steel'), ['Stainless Steel']);
check('primary: empty', materialPrimaryFromText(''), []);

// DRINKWARE single bottle material (whitelist + first-by-position)
const DW=['Stainless Steel','Aluminium','Glass','Tritan','Ceramic','Polypropylene','Bamboo','RPET'];
check('dw: steel bottle + PP lid -> Stainless Steel', primaryBottleMaterial('Bottle: 201 Stainless Steel | Lid: Polypropylene (PP) and a Silicone Seal | Handle: Polyester', 'Halifax Bottle', DW), ['Stainless Steel']);
check('dw: unlabeled steel + pp lid -> Stainless Steel', primaryBottleMaterial('Stainless steel bottle with a PP lid and silicone seal', '', DW), ['Stainless Steel']);
check('dw: real PP bottle -> Polypropylene', primaryBottleMaterial('Polypropylene drink bottle', '', DW), ['Polypropylene']);
check('dw: glass + bamboo lid -> Glass', primaryBottleMaterial('Bottle: Borosilicate Glass | Lid: Bamboo', 'Eden Glass Bottle', DW), ['Glass']);
check('dw: name only Tritan -> Tritan', primaryBottleMaterial('', 'Clear Tritan Drink Bottle', DW), ['Tritan']);

// BPA Free
check('BPA: Tritan -> true', isBpaFreeText('Tritan Bottle'), true);
check('BPA: stainless -> true', isBpaFreeText('Stainless Steel Flask'), true);
check('BPA: explicit claim -> true', isBpaFreeText('BPA-Free Plastic Bottle'), true);
check('BPA: generic plastic, no claim -> false', isBpaFreeText('Polypropylene Cup'), false);

// Gender (apparel)
check("gender: Men's Polo", gendersFromText("Men's Polo"), ['Men']);
check("gender: Women's Tee (not Men)", gendersFromText("Women's Tee"), ['Women']);
check('gender: Kids Hoodie', gendersFromText('Kids Hoodie'), ['Kids']);
check('gender: Unisex Crew', gendersFromText('Unisex Crew'), ['Unisex']);

// Buckets
check('moq 1000 -> >500', moqBucket(1000), '>500');
check('moq 100 -> <=100', moqBucket(100), '<=100');
check('bags 5L', capacityBucketBags('5L'), '<=5L');
check('bags 18L', capacityBucketBags('18L'), '16-25L');
check('drinkware 350ml', capacityBucketDrinkware('350ml'), '<500ml');
check('drinkware 500ml', capacityBucketDrinkware('500ml'), '500-749ml');
check('drinkware 750ml', capacityBucketDrinkware('750ml'), '750ml-1L');
check('stock local_stock', stockTypeOf('local_stock'), 'Local Stock');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
