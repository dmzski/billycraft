import Loader from '@/components/Loader'
import ProductTable from './List'
import { useAllProductsQuery } from '@/queries/useAllProductsQuery'
import { useI18n } from '@/i18n'
import { AddProductModal } from '../modals/AddProductModal'
import { Button } from '@coco-ui/core'
import { Filters } from './Filters'
import { useMemo, useState } from 'react'
import { ProductFilters, filterProducts } from '@/utils/products'
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/solid'
import { UpdateStockModal } from '../modals/UpdateStockModal'

const ProductsPage = () => {
  const { t } = useI18n()
  const [filters, setFilters] = useState<ProductFilters>({
    type: '',
    name: '',
    supplierId: '',
    groupId: '',
  })
  const { data, isLoading, reload } = useAllProductsQuery()

  const enhancedData = useMemo(
    () => filterProducts(data?.sort((a, b) => a.name.localeCompare(b.name)) ?? [], filters),
    [data, filters],
  )

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">{t('products.list.title')}</h1>
        <div className="grid lg:grid-cols-12 gap-2">
          <p className="text-sm md:col-span-8">{t('products.list.description')}</p>
          <div className="lg:col-span-4 flex flex-col lg:flex-row lg:justify-end gap-2">
            <UpdateStockModal
              onSubmitSuccess={reload}
              disclosure={
                <Button outline variant="default" className="gap-2">
                  <ArrowPathIcon className="w-5" />
                  {t('products.list.updateStocks')}
                </Button>
              }
            />
            <AddProductModal
              disclosure={
                <Button variant="primary" className="gap-2">
                  <PlusIcon className="w-5" />
                  {t('products.list.add')}
                </Button>
              }
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
