import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env.local','utf8').split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i), l.slice(i+1)];}));
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
const { data: p, error } = await db.from('products').select('*').eq('supplier_sku','FD400.MTO').maybeSingle();
if (error) { console.log('ERR', error); process.exit(0); }
if (!p) { console.log('not found'); process.exit(0); }
console.log('id', p.id);
console.log('name', p.name);
console.log('supplier', p.supplier);
console.log('is_published', p.is_published);
console.log('category/sub', p.category, p.subcategory);
console.log('colours', JSON.stringify(p.colours, null, 2));
console.log('tiers', JSON.stringify(p.tiers, null, 2));
console.log('decorations/decos', JSON.stringify(p.decorations || p.decos || p.decoration_options, null, 2));
console.log('price_tiers field names present:', Object.keys(p).filter(k=>/tier|price|deco|colour|color|image/i.test(k)));
const { data: pc, error: e2 } = await db.from('product_colours').select('*').eq('product_id', p.id);
if (e2) console.log('pc err', e2);
console.log('product_colours rows:', pc?.length);
(pc||[]).forEach(r => console.log(' -', r.colour_name || r.name, 'images:', (r.images||[]).length));
