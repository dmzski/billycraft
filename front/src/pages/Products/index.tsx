import Loader from '../../components/Loader'
import ProductTable from './List'
import Product from '@/models/Product'
import { useAllProductsQuery } from '@/queries/useAllProductsQuery'
import { useI18n } from '@/i18n'

const ProductsPage = () => {
  const { t } = useI18n()
  const { data, isLoading } = useAllProductsQuery()

  const sortedData = data?.sort((a: Product, b: Product) =>
    a.name.localeCompare(b.name),
  ) ?? []
  return (
    <>
      <h2 className="text-3xl">{t('products.list.title')}</h2>
      <p className="text-sm mt-1">
        {t('products.list.description')}
      </p>
      <div className="flex-col justify-center mt-8 items-center">
        {isLoading && !data ? (
          <div className="w-full flex justify-center">
            <Loader />
          </div>
        ) : null}
        {data ? (
          <ProductTable
            products={sortedData}
          />
        ) : null}
      </div>
    </>
  )
}

export default ProductsPage
