import { Button } from '@coco-ui/core'
import Product from '@/models/Product'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { EditProductModal } from './modals/EditProductModal'
import { DeleteProductModal } from './modals/DeleteProductModal'

type ProductTableLineProps = {
  product: Product
  reloadProducts: () => Promise<void>
}

const ProductTableLine = ({ product, reloadProducts }: ProductTableLineProps) => (
  <div
    className="grid md:grid-cols-12 px-4 py-2 gap-2 border-b items-center"
  >
    <div className="md:col-span-2">
      {product.type}
    </div>
    <div className="md:col-span-7 flex flex-col gap-2">
      <p className='truncate'>
        {product.name}
      </p>
      {product.description ? (
        <p className='pl-4 text-sm whitespace-pre-wrap'>
          {product.description}
        </p>
      ) : null}
    </div>
    <div className="md:col-span-2 truncate">
      {product.price}
    </div>
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

export default ProductTableLine
