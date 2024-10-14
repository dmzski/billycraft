import { Badge, Button } from '@coco-ui/core'
import Product from '@/models/Product'
import { PencilIcon, TagIcon, TrashIcon } from '@heroicons/react/24/solid'
import { EditProductModal } from '../modals/EditProductModal'
import { DeleteProductModal } from '../modals/DeleteProductModal'
import Supplier from '@/models/Supplier'
import { calculatePriceTTC } from '@/utils/price'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { ProductTypeLabel } from '@/components/labels/ProductTypeLabel'
import { useI18n } from '@/i18n'
import { useReducer } from 'react'
import clsx from 'clsx'
import { ProductGroup } from '@/models/ProductGroup'

type ProductTableLineProps = {
  product: Product
  supplier?: Supplier
  reloadProducts: () => Promise<void>
  groupName?: ProductGroup['name']
}

const ProductTableLine = ({
  product,
  reloadProducts,
  supplier,
  groupName,
}: ProductTableLineProps) => {
  const formatCurrency = useFormatCurrency()
  const { t, scopedT } = useI18n()
  const pageT = scopedT('products.list.headers')
  const [open, toggleOpen] = useReducer(state => !state, false)

  return (
    <div
      onClick={toggleOpen}
      className={clsx(
        'collapse collapse-arrow border rounded-lg items-center',
        open ? 'collapse-open' : 'collapse-close',
      )}
    >
      <div className="collapse-title pl-4 pr-12 py-2 flex flex-row gap-4 justify-between items-center flex-wrap overflow-hidden shadow">
        <div className="flex flex-row gap-4 items-center overflow-hidden">
          <div className="flex flex-col-reverse md:flex-row gap-2 items-center">
            <ProductTypeLabel short type={product.type} />
            {product.type === 'ARTICLE' ? (
              <Badge variant={product.stock && product.stock > 0 ? 'primary' : 'error'}>
                {product.stock ?? '-'}
              </Badge>
            ) : null}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-baseline overflow-hidden">
            <p className="truncate">{product.name}</p>
            {supplier?.name ? (
              <div className="truncate opacity-40 text-xs">{supplier?.name ?? '-'}</div>
            ) : null}
          </div>
        </div>
        {groupName ? (
          <Badge outline variant="ghost" className="gap-2 items-center flex">
            <TagIcon className="w-4" />
            {groupName}
          </Badge>
        ) : null}
      </div>
      <div className="collapse-content p-0">
        <div className="flex flex-col gap-4 flex-wrap p-4">
          {product.description ? (
            <dl className="">
              <dt className="font-bold">{pageT('description')}</dt>
              <dd className="whitespace-pre-wrap">{product.description}</dd>
            </dl>
          ) : null}
          <div className="grid grid-cols-2 gap-4">
            <dl>
              <dt className="font-bold">{pageT('etPrice')}</dt>
              <dd>{formatCurrency(product.price)}</dd>
            </dl>
            <dl>
              <dt className="font-bold">{pageT('itPrice')}</dt>
              <dd>{formatCurrency(calculatePriceTTC(product.price, supplier?.vat ?? 0))}</dd>
            </dl>
          </div>
          <div className="flex gap-4 flex-wrap justify-end">
            <EditProductModal
              disclosure={
                <Button
                  onClick={e => {
                    e.stopPropagation()
                  }}
                  outline
                  type="button"
                  variant="primary"
                >
                  <PencilIcon className="w-5" />
                  <span>{t('edit')}</span>
                </Button>
              }
              product={product}
              onSubmitSuccess={reloadProducts}
            />
            <DeleteProductModal
              disclosure={
                <Button
                  onClick={e => {
                    e.stopPropagation()
                  }}
                  type="button"
                  variant="error"
                  outline
                >
                  <TrashIcon className="w-5" />
                  <span>{t('delete')}</span>
                </Button>
              }
              product={product}
              onSubmitSuccess={reloadProducts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTableLine
