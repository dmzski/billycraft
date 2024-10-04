import { Button } from '@coco-ui/core'
import Product from '@/models/Product'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { EditProductModal } from './modals/EditProductModal'
import { DeleteProductModal } from './modals/DeleteProductModal'
import Supplier from '@/models/Supplier'
import { calculatePriceTTC } from '@/utils/price'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { ProductTypeLabel } from '@/components/labels/ProductTypeLabel'

type ProductTableLineProps = {
  product: Product
  supplier?: Supplier
  reloadProducts: () => Promise<void>
}

const ProductTableLine = ({ product, reloadProducts, supplier }: ProductTableLineProps) => {
  const formatCurrency = useFormatCurrency()

  return (
    <div className="grid md:grid-cols-12 px-4 py-2 gap-2 border-b items-center">
      <div className="md:col-span-2 truncate">{supplier?.name ?? "-"}</div>
      <div className="md:col-span-1">
        <ProductTypeLabel short type={product.type} />
      </div>
      <div className="md:col-span-5 flex flex-col gap-2">
        <p className="truncate">{product.name}</p>
        {product.description ? (
          <p className="pl-4 text-sm whitespace-pre-wrap">{product.description}</p>
        ) : null}
      </div>
      <div>{formatCurrency(product.price)}</div>
      <div>{formatCurrency(calculatePriceTTC(product.price, supplier?.vat ?? 0))}</div>
      <div>{product.stock ?? "-"}</div>
      <div className="flex justify-end">
        <div className="flex gap-2 justify-end">
          <EditProductModal
            disclosure={
              <Button outline type="button" variant="primary">
                <PencilIcon className="w-5" />
              </Button>
            }
            product={product}
            onSubmitSuccess={reloadProducts}
          />
          <DeleteProductModal
            disclosure={
              <Button type="button" variant="error" outline>
                <TrashIcon className="w-5" />
              </Button>
            }
            product={product}
            onSubmitSuccess={reloadProducts}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductTableLine
