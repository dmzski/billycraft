import Loader from '../../components/Loader'
import ProductTable from './List'
import { useAllProductsQuery } from '@/queries/useAllProductsQuery'
import { useI18n } from '@/i18n'
import { AddProductModal } from './modals/AddProductModal'
import { Button } from '@coco-ui/core'
import { Filters } from './Filters'
import { useMemo, useState } from 'react'
import { ProductFilters, filterProducts } from '@/utils/products'

const ProductsPage = () => {
  const { t } = useI18n()
  const [filters, setFilters] = useState<ProductFilters>({ type: '', name: '' })
  const { data, isLoading, reload } = useAllProductsQuery()

  const enhancedData = useMemo(
    () => filterProducts(data?.sort((a, b) => a.name.localeCompare(b.name)) ?? [], filters),
    [data, filters],
  )

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl">{t('products.list.title')}</h1>
        <div className="grid md:grid-cols-12">
          <p className="text-sm md:col-span-10">{t('products.list.description')}</p>
          <div className="md:col-span-2 flex justify-end">
            <AddProductModal
              disclosure={<Button variant="primary">{t('products.list.add')}</Button>}
              onSubmitSuccess={reload}
            />
          </div>
        </div>
      </div>
      <div className="flex-col justify-center items-center">
        {isLoading && !data ? (
          <div className="w-full flex justify-center">
            <Loader />
          </div>
        ) : null}
        {data ? (
          <div className="flex flex-col gap-5">
            <Filters filters={filters} onChangeFilters={setFilters} />
            <ProductTable products={enhancedData} reloadProducts={reload} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductsPage
