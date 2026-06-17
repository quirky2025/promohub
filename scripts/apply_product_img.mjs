#!/usr/bin/env node
// apply_product_img.mjs — 第一轮止血:把列表页/详情页的产品 <img> 自动换成 <ProductImg>
// 在【全新克隆的 main 分支】仓库根目录运行:  node scripts/apply_product_img.mjs
// 幂等:已替换/已 import 的会跳过。只动产品图,不动 banner/logo/分类卡静态图。

import fs from 'node:fs';

const IMPORT_LINE = "import ProductImg from '@/components/ProductImg';";

// 列表页:统一替换网格产品图(变量名都是 img + alt={product.name})
const LIST_FILES = [
  'app/page.js',
  'app/category/[category]/page.js',
  'app/category/[category]/[subcategory]/page.js',
  'app/search/page.jsx',
  'app/sale/page.js',
  'app/new-arrivals/page.js',
  'app/collections/[slug]/page.js',
  'app/brands/[slug]/page.js',
  'app/indent/IndentCatalog.jsx',
];
const LIST_SWAP = [
  ['<img src={img} alt={product.name}', '<ProductImg src={img} alt={product.name}'],
];

// 商品详情页:逐个精确替换(主图 eager+detail,其余 lazy)
const PRODUCT_CLIENT = 'app/products/[slug]/ProductClient.jsx';
const PC_SWAP = [
  ['<img src={bigImage} alt={mainAlt}', '<ProductImg src={bigImage} alt={mainAlt} size="detail" eager'],
  ['<img src={src} alt={i === 0 ? mainAlt : galleryAlt}', '<ProductImg src={src} alt={i === 0 ? mainAlt : galleryAlt} size="thumb"'],
  ['<img src={c.image || c.images[0]} alt={colourImageAlt(c.name, product.name)}', '<ProductImg src={c.image || c.images[0]} alt={colourImageAlt(c.name, product.name)} size="thumb"'],
  ['<img src={c.image} alt={colourImageAlt(c.name, product.name)}', '<ProductImg src={c.image} alt={colourImageAlt(c.name, product.name)} size="thumb"'],
  ['<img src={img} alt={`${p.name} with logo`}', '<ProductImg src={img} alt={`${p.name} with logo`} size="list"'],
];

function ensureImport(text) {
  if (text.includes("from '@/components/ProductImg'")) return text;
  const lines = text.split('\n');
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s.+from\s+['"].+['"];?\s*$/.test(lines[i])) lastImport = i;
  }
  if (lastImport === -1) { // 'use client' 之后或文件头插入
    let at = 0;
    if (/^['"]use client['"];?/.test(lines[0])) at = 1;
    lines.splice(at, 0, IMPORT_LINE);
  } else {
    lines.splice(lastImport + 1, 0, IMPORT_LINE);
  }
  return lines.join('\n');
}

function apply(file, swaps) {
  if (!fs.existsSync(file)) { console.log(`SKIP (missing): ${file}`); return; }
  let text = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [oldS, newS] of swaps) {
    if (text.includes(oldS)) { text = text.split(oldS).join(newS); changed++; }
    else console.log(`  - 未找到(可能已替换或写法不同): ${oldS.slice(0, 48)}...`);
  }
  if (changed > 0) text = ensureImport(text);
  fs.writeFileSync(file, text);
  console.log(`${changed > 0 ? 'OK  ' : '--- '}${file}  (${changed} 处)`);
}

console.log('== 列表页 ==');
for (const f of LIST_FILES) apply(f, LIST_SWAP);
console.log('== 商品详情页 ==');
apply(PRODUCT_CLIENT, PC_SWAP);
console.log('\n完成。请 `git diff` 复核(应只多出 import + <img>→<ProductImg>),再 build/preview 验收。');
