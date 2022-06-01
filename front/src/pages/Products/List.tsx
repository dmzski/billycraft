import ProductTableLine from 'pages/Products/Row'
import Product from 'models/Product'

const ProductTable = ({ products }: { products: Product[] }): JSX.Element => (
  <div>
    <div className="px-2 py-4 gap-2 grid md:grid-cols-12 bg-primary-50 text-primary-700 rounded-t">
      <div className="md:col-span-2">Type</div>
      <div className="md:col-span-3">Nom&nbsp;*</div>
      <div className="md:col-span-3">Description</div>
      <div className="md:col-span-2">Prix Unitaire HT</div>
      <div className="md:col-span-2" />
    </div>
    <div>
      <ProductTableLine index={0} isNew product={{} as Product} />
      {products.map((product: Product, index) => (
        <ProductTableLine key={product.id || 'new-product'} product={product} index={index + 1} />
      ))}
    </div>
  </div>
)

export default ProductTable
