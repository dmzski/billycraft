import Loader from '@/components/Loader'
import ProductGroupList from './List'
import { useI18n } from '@/i18n'
import { useMemo } from 'react'
import { useAllProductGroupsQuery } from '@/queries/useAllProductGroupsQuery'
import { Button } from '@coco-ui/core'
import { AddProductGroupModal } from '../modals/AddProductGroupModal'
import { PlusIcon } from '@heroicons/react/24/solid'

const ProductsPage = () => {
  const { scopedT } = useI18n()
  const pageT = scopedT('products.groups')
  const { data, isLoading, reload } = useAllProductGroupsQuery()

  const enhancedData = useMemo(
    () => data?.sort((a, b) => a.name.localeCompare(b.name)) ?? [],
    [data],
  )

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">{pageT('title')}</h1>
        <div className="flex gap-4 flex-wrap justify-between">
          <p>{pageT('description')}</p>
          <div className="flex flex-wrap gap-4">
            <AddProductGroupModal
              onSubmitSuccess={reload}
              disclosure={
                <Button>
                  <PlusIcon />
                  {pageT('add')}
                </Button>
              }
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
        {data ? <ProductGroupList groups={enhancedData} reloadGroups={reload} /> : null}
      </div>
    </div>
  )
}

export default ProductsPage
