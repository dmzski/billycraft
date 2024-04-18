import ProductTableLine from '@/pages/Products/Row'
import Product from '@/models/Product'
import { useI18n } from '@/i18n'

type ProductTableProps = { products: Product[]; reloadProducts: () => Promise<void> }

const ProductTable = ({ products, reloadProducts }: ProductTableProps) => {
  const { t } = useI18n()

  return (
    <div>
      <div className="p-4 gap-2 grid md:grid-cols-12 bg-base-200 rounded-t">
        <div className="md:col-span-2">{t('products.list.headers.type')}</div>
        <div className="md:col-span-7">{t('products.list.headers.name')}</div>
        <div className="md:col-span-2">{t('products.list.headers.etPrice')}</div>
        <div className="md:col-span-1" />
      </div>
      <div>
        {products.map(product => (
          <ProductTableLine key={product.id} product={product} reloadProducts={reloadProducts} />
        ))}
      </div>
    </div>
  )
}

export default ProductTable
