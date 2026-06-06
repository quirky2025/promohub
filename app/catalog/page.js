// app/catalog/page.js —— Catalogues 页面(服务端外壳,带 SEO 元数据)
import CatalogClient from './CatalogClient';

export const metadata = {
  title: 'Product Catalogues | QuirkyPromo',
  description:
    'Browse our latest promotional product catalogues online — seasonal collections, eco ranges and more. Found something you like? Request a quote with the page number.',
};

export default function CatalogPage() {
  return <CatalogClient />;
}
