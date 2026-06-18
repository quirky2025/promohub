// Fixture tests for lib/filterAttributes.js  ->  node scripts/test_filterAttributes.mjs
import {
  colourFamiliesOf, decorationFamiliesOf, isDecorationCharge,
  moqBucket, capacityBucketBags, capacityBucketDrinkware, stockTypeOf
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
check('Screen Print -> Spot', decorationFamiliesOf(['Screen Print']), ['Spot Colour Print']);
check('Pad Print -> Spot', decorationFamiliesOf(['Pad Print Per Colour/Position']), ['Spot Colour Print']);
check('UVDTF -> Full Colour', decorationFamiliesOf(['UVDTF Full Colour']), ['Full Colour']);
check('Laser Engraving', decorationFamiliesOf(['Laser Engraving Per Position']), ['Laser Engraving']);
check('Digital Transfer -> Transfer (precedence)', decorationFamiliesOf(['Digital Transfer']), ['Transfer']);
check('Debossing -> Special', decorationFamiliesOf(['Debossing Per Position']), ['Special']);

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
