import ProductTableLine from '@/pages/Products/Row'
import Product from '@/models/Product'
import { useI18n } from '@/i18n'

const ProductTable = ({ products }: { products: Product[] }) => {
  const {t} = useI18n()

  return (
  <div>
    <div className="p-4 gap-2 grid md:grid-cols-12 bg-base-200 rounded-t">
      <div className="md:col-span-2">{t('products.list.headers.type')}</div>
      <div className="md:col-span-3">{t('products.list.headers.name')}</div>
      <div className="md:col-span-4">{t('products.list.headers.description')}</div>
      <div className="md:col-span-2">{t('products.list.headers.etPrice')}</div>
      <div className="md:col-span-1" />
    </div>
    <div>
      <ProductTableLine />
      {products.map((product: Product) => (
        <ProductTableLine key={product.id ?? 'new-product'} product={product} />
      ))}
    </div>
  </div>
)}

export default ProductTable
