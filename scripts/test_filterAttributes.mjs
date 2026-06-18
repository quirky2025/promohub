// Fixture tests for lib/filterAttributes.js  ->  node scripts/test_filterAttributes.mjs
import {
  colourFamiliesOf, decorationFamiliesOf, isDecorationCharge,
  moqBucket, capacityBucketBags, capacityBucketDrinkware, stockTypeOf,
  materialFamiliesOf, materialFamiliesFromText,
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
check('two tags -> two families', materialFamiliesOf(['Nylon','Aluminium']), ['Nylon','Metal']);

// Material from free text (product.materials) -- option 1: all families, with precedence
check('text: Jute with cotton handles', materialFamiliesFromText('Jute with cotton handles'), ['Jute','Cotton']);
check('text: 600D Polyester', materialFamiliesFromText('600D Polyester'), ['Polyester']);
check('text: Recycled Polyester (rPET) -> RPET only', materialFamiliesFromText('Recycled Polyester (rPET)'), ['RPET']);
check('text: Non-Woven Polypropylene -> Non-Woven only', materialFamiliesFromText('Non-Woven Polypropylene'), ['Non-Woven']);
check('text: 100% Cotton Canvas', materialFamiliesFromText('100% Cotton Canvas'), ['Cotton','Canvas']);
check('text: Stainless Steel', materialFamiliesFromText('Stainless Steel Bottle'), ['Metal']);
check('text: empty', materialFamiliesFromText(''), []);
check('text: Recycled Cotton (not RPET)', materialFamiliesFromText('Recycled Cotton'), ['Cotton']);
check('name: Poly Tote Bag -> Polyester', materialFamiliesFromText('Poly Tote Bag'), ['Polyester']);
check('name: Juco Shopper -> Jute+Cotton', materialFamiliesFromText('Juco Shopper'), ['Jute','Cotton']);
check('name: polypropylene NOT Polyester', materialFamiliesFromText('Polypropylene Bag'), ['Plastic']);
check('name: Non-Woven Tote', materialFamiliesFromText('Non-Woven Tote'), ['Non-Woven']);

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
