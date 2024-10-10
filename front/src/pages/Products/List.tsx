import ProductTableLine from '@/pages/Products/Row'
import Product from '@/models/Product'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'

type ProductTableProps = { products: Product[]; reloadProducts: () => Promise<void> }

const ProductTable = ({ products, reloadProducts }: ProductTableProps) => {
  const { data: suppliers } = useAllSuppliersQuery()

  return (
    <div className="flex flex-col gap-8">
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
  )
}

export default ProductTable
