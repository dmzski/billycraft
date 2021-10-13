import { Table } from "@coco-ui/core";
import React from "react";
import ProductTableLine from "components/product/ProductTableLine";
import Product from "models/Product";

const ProductTable = ({ products }: { products: Product[] }): JSX.Element => {
  return (
    <Table className="w-full table-fixed mt-4">
      <Table.Head>
        <Table.HeadCell className="p-2 w-42">Type</Table.HeadCell>
        <Table.HeadCell className="p-2 w-1/3">Nom</Table.HeadCell>
        <Table.HeadCell className="p-2 w-1/3">Description</Table.HeadCell>
        <Table.HeadCell className="text-right p-2 pr-8">
          Prix Unitaire HT
        </Table.HeadCell>
        <Table.HeadCell className="w-20 p-2" />
      </Table.Head>
      <Table.Body>
        {products.map((product: Product) => (
          <ProductTableLine
            key={product.id || "new-product"}
            product={product}
          />
        ))}
        <ProductTableLine product={{} as Product} />
      </Table.Body>
    </Table>
  );
};

export default ProductTable;
