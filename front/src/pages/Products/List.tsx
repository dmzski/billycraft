import ProductTableLine from 'pages/Products/Row'
import Product from 'models/Product'

const ProductTable = ({ products }: { products: Product[] }): JSX.Element => (
  <div>
    <div className="p-4 gap-2 grid md:grid-cols-12 bg-base-200 rounded-t">
      <div className="md:col-span-2">Type</div>
      <div className="md:col-span-3">Nom&nbsp;*</div>
      <div className="md:col-span-3">Description</div>
      <div className="md:col-span-2">Prix Unitaire HT</div>
      <div className="md:col-span-2" />
    </div>
    <div>
      <ProductTableLine isNew product={{} as Product} />
      {products.map((product: Product) => (
        <ProductTableLine key={product.id || 'new-product'} product={product} />
      ))}
    </div>
  </div>
)

export default ProductTable
