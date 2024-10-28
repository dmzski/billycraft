import { BottomActionBar } from '@/components/BottomActionBar'
import ProductTableLine from './Row'
import Product from '@/models/Product'
import { useAllProductGroupsQuery } from '@/queries/useAllProductGroupsQuery'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'
import { useRef, useState } from 'react'
import { MultiEditProductGroupModal } from '../modals/MultiEditProductGroupModal'
import { Button } from '@coco-ui/core'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { MultiDeleteProductModal } from '../modals/MultiDeleteProductModal'
import { useI18n } from '@/i18n'

type ProductTableProps = {
  products: Product[]
  reloadProducts: () => Promise<void>
}

const ProductTable = ({ products, reloadProducts }: ProductTableProps) => {
  const { t } = useI18n()
  const { data: suppliers } = useAllSuppliersQuery()
  const { data: groups } = useAllProductGroupsQuery()
  const divRef = useRef<HTMLDivElement>(null)

  const [selected, setSelected] = useState<Product[]>([])
  const getSupplier = (product: Product) =>
    product.supplierId ? suppliers?.find(({ id }) => id === product.supplierId) : undefined

  const getGroupName = (product: Product) =>
    product.groupId ? groups?.find(({ id }) => id === product.groupId)?.name : undefined

  return (
    <div ref={divRef} className="relative flex flex-col gap-8">
      {products.map(product => (
        <ProductTableLine
          key={product.id}
          product={product}
          reloadProducts={reloadProducts}
          supplier={getSupplier(product)}
          groupName={getGroupName(product)}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
      {selected?.length > 0 ? (
        <BottomActionBar containerRef={divRef}>
          <div className="flex justify-between items-center gap-4">
            <span className="font-bold">
              {selected?.length}&nbsp;
              {t(selected?.length > 1 ? 'itemSelectedPlural' : 'itemSelected')}
            </span>
            <div className="flex gap-2">
              <MultiEditProductGroupModal
                disclosure={
                  <Button size="icon">
                    <PencilIcon />
                  </Button>
                }
                onSubmitSuccess={reloadProducts}
                products={selected}
              />
              <MultiDeleteProductModal
                disclosure={
                  <Button size="icon" variant="destructive">
                    <TrashIcon />
                  </Button>
                }
                onSubmitSuccess={reloadProducts}
                productIds={selected.map(({ id }) => id)}
              />
            </div>
          </div>
        </BottomActionBar>
      ) : null}
    </div>
  )
}

export default ProductTable
