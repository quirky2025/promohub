const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const env = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter(Boolean).reduce((acc, line) => {
  const idx = line.indexOf('=');
  if (idx > -1) {
    acc[line.slice(0, idx)] = line.slice(idx + 1);
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const CROSS_CATEGORY_ONLY = ['Note Pads', 'Promotional', 'Personal Care'];

async function buildSubs(categoryName) {
  const res = await supabase.from('products').select('id,name,subcategory,extra_subcategories').ilike('category', categoryName).eq('is_published', true).limit(2000);
  const subs = {};
  res.data.forEach(p => {
    const main = p.subcategory || 'Other';
    subs[main] = true;
    (Array.isArray(p.extra_subcategories) ? p.extra_subcategories : []).forEach(extra => {
      if (extra && extra !== p.subcategory && !CROSS_CATEGORY_ONLY.includes(extra)) {
        subs[extra] = true;
      }
    });
  });
  return Object.keys(subs).sort();
}

async function main() {
  const cats = ['Print', 'Bags', 'Headwear'];
  for (const cat of cats) {
    const names = await buildSubs(cat);
    console.log('---', cat, '---');
    console.log('has Note Pads?', names.includes('Note Pads'));
    console.log('has Cotton Bags?', names.includes('Cotton Bags'));
    console.log('has School Headwear?', names.includes('School Headwear'));
    console.log('count', names.length, 'names sample:', names.slice(0, 20));
  }

  const business = await supabase.from('products').select('id,name,slug,category,subcategory,extra_subcategories,supplier_sku').eq('supplier_sku', '115826').limit(20);
  console.log('Business supplier_sku 115826 count', business.data?.length, 'error', business.error);
  if (business.data) console.log(business.data);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});