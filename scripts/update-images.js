const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg3ODI0MywiZXhwIjoyMDk0NDU0MjQzfQ.MXLWykCZO-Buzwr9evOPE7YHjeoVe53PXn3vEJW0NTc'
);

async function getAllProducts() {
  let allProducts = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id, supplier_sku')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    allProducts = allProducts.concat(data);
    console.log(`已获取 ${allProducts.length} 个产品...`);

    if (data.length < pageSize) break;
    page++;
  }

  return allProducts;
}

async function updateImages() {
  const results = JSON.parse(fs.readFileSync('scripts/upload-results.json', 'utf8'));

  const grouped = {};
  results.forEach(({ fileName, url }) => {
    const match = fileName.match(/^(\d+)-(\d+)\./);
    if (!match) return;
    const sku = match[1];
    const index = parseInt(match[2]);
    if (!grouped[sku]) grouped[sku] = [];
    grouped[sku].push({ index, url });
  });

  Object.keys(grouped).forEach(sku => {
    grouped[sku].sort((a, b) => a.index - b.index);
  });

  console.log(`找到 ${Object.keys(grouped).length} 个产品的图片`);

  const products = await getAllProducts();
  console.log(`数据库中共有 ${products.length} 个产品`);

  let updated = 0;
  let notFound = 0;

  for (const product of products) {
    const sku = product.supplier_sku;
    const images = grouped[sku];
    if (!images || images.length === 0) {
      notFound++;
      continue;
    }

    const imageUrls = images.map(i => i.url);

    const { data: colours } = await supabase
      .from('product_colours')
      .select('id')
      .eq('product_id', product.id)
      .limit(1);

    if (colours && colours.length > 0) {
      const { error: updateError } = await supabase
        .from('product_colours')
        .update({ images: imageUrls })
        .eq('id', colours[0].id);

      if (updateError) {
        console.error(`✗ SKU ${sku}: ${updateError.message}`);
      } else {
        updated++;
      }
    } else {
      const { error: insertError } = await supabase
        .from('product_colours')
        .insert({
          product_id: product.id,
          name: 'Default',
          images: imageUrls,
          sort_order: 0
        });

      if (insertError) {
        console.error(`✗ SKU ${sku} (insert): ${insertError.message}`);
      } else {
        updated++;
      }
    }

    if (updated % 100 === 0 && updated > 0) {
      console.log(`进度：已更新 ${updated} 个产品...`);
    }
  }

  console.log(`\n完成！更新了 ${updated} 个产品，${notFound} 个产品没有找到图片`);
}

updateImages();