import { Table } from "@coco-ui/core";
import React from "react";
import ProductTableLine from "pages/Products/Row";
import Product from "models/Product";

const ProductTable = ({ products }: { products: Product[] }): JSX.Element => {
  return (
    <Table className="w-full table-fixed">
      <Table.Head>
        <Table.HeadCell className="w-48">Type</Table.HeadCell>
        <Table.HeadCell className="w-1/3">Nom</Table.HeadCell>
        <Table.HeadCell className="w-1/3">Description</Table.HeadCell>
        <Table.HeadCell className="w-44 text-right">
          Prix Unitaire HT
        </Table.HeadCell>
        <Table.HeadCell className="w-24" />
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
