import { computeFacets, applyFilters } from '../lib/filterFacets.js';
let pass=0, fail=0;
const check=(l,g,w)=>{ const ok=JSON.stringify(g)===JSON.stringify(w); if(ok){pass++;console.log('PASS '+l);}else{fail++;console.log('FAIL '+l+' got='+JSON.stringify(g)+' want='+JSON.stringify(w));} };

const P = [];
// 6 black tote bags, 6 white tote bags, 6 black backpacks (so counts >= THIN_HIDE)
for (let i=0;i<6;i++) P.push({ category:'Bags', subcategory:'Tote Bags', colour_slugs:['black'], min_qty:50, fulfillment:'local_stock', capacity:'10L', material_tags:['cotton'], _price:3, _decorationNames:['Screen Print'] });
for (let i=0;i<6;i++) P.push({ category:'Bags', subcategory:'Tote Bags', colour_slugs:['white'], min_qty:250, fulfillment:'indent_air', capacity:'20L', material_tags:['cotton'], _price:8, _decorationNames:['Full Colour Print'] });
for (let i=0;i<6;i++) P.push({ category:'Bags', subcategory:'Backpacks', colour_slugs:['black'], min_qty:50, fulfillment:'local_stock', capacity:'2L', material_tags:['plastic'], _price:15, _decorationNames:['Embroidery Per Position'] });

const facets = computeFacets(P, 'Bags');
const colour = facets.find(f=>f.key==='colour');
check('colour facet values', colour.values, [{value:'Black',count:12},{value:'White',count:6}]);
const bagType = facets.find(f=>f.key==='bagType');
check('bagType facet', bagType.values, [{value:'Tote Bags',count:12},{value:'Backpacks',count:6}]);

// subcategory page hides type
const noType = computeFacets(P, 'Bags', { includeType:false });
check('subcat hides bagType', !!noType.find(f=>f.key==='bagType'), false);

// AND across (Black AND Tote) -> 6
check('Black AND Tote', applyFilters(P,'Bags',{colour:new Set(['Black']), bagType:new Set(['Tote Bags'])}).length, 6);
// OR within colour (Black or White) -> 18
check('Black OR White', applyFilters(P,'Bags',{colour:new Set(['Black','White'])}).length, 18);
// unselected -> no exclusion
check('no selection', applyFilters(P,'Bags',{}).length, 18);
// stock Local Stock -> 12
check('stock Local', applyFilters(P,'Bags',{stock:new Set(['Local Stock'])}).length, 12);

console.log('\n'+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
