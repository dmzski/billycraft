import { Table } from '@coco-ui/core';
import ProductTableLine from 'pages/Products/Row';
import Product from 'models/Product';

const ProductTable = ({ products }: { products: Product[] }): JSX.Element => (
    <Table className="w-full table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.HeadCell className="w-48">Type</Table.HeadCell>
          <Table.HeadCell className="w-1/3">Nom</Table.HeadCell>
          <Table.HeadCell className="w-1/3">Description</Table.HeadCell>
          <Table.HeadCell className="w-44 text-right">
            Prix Unitaire HT
          </Table.HeadCell>
          <Table.HeadCell className="w-24" />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <ProductTableLine isNew product={{} as Product} />
        {products.map((product: Product) => (
          <ProductTableLine
            key={product.id || 'new-product'}
            product={product}
          />
        ))}
      </Table.Body>
    </Table>
  )

export default ProductTable;
