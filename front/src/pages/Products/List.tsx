import ProductTableLine from '@/pages/Products/Row'
import Product from '@/models/Product'
import { useI18n } from '@/i18n'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'

type ProductTableProps = { products: Product[]; reloadProducts: () => Promise<void> }

const ProductTable = ({ products, reloadProducts }: ProductTableProps) => {
  const { t } = useI18n()
  const { data: suppliers } = useAllSuppliersQuery()

  return (
    <div>
      <div className="p-4 gap-2 grid md:grid-cols-12 bg-base-200 rounded-t">
        <div className="md:col-span-2">{t('products.list.headers.supplier')}</div>
        <div className="md:col-span-1">{t('products.list.headers.type')}</div>
        <div className="md:col-span-5">{t('products.list.headers.name')}</div>
        <div className="md:col-span-1">{t('products.list.headers.etPrice')}</div>
        <div className="md:col-span-1">{t('products.list.headers.itPrice')}</div>
        <div className="md:col-span-1">{t('products.list.headers.remainingStock')}</div>
        <div className="md:col-span-1">&nbsp;</div>
      </div>
      <div>
        {products.map(product => (
          <ProductTableLine
            key={product.id}
            product={product}
            reloadProducts={reloadProducts}
            supplier={
              product.supplierId
                ? suppliers?.find(({ id }) => id === product.supplierId)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}

export default ProductTable
