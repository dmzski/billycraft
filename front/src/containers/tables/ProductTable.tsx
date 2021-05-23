import { Table } from "@coco-ui/core";
import React from "react";
import ProductTableLine from "components/product/ProductTableLine";
import { Product } from "models/Product";

const ProductTable = ({ products }: { products: Product[] }): JSX.Element => {
  return (
    <Table className="w-full mt-4">
      <Table.Head>
        <Table.HeadCell>Type</Table.HeadCell>
        <Table.HeadCell>Mot-clés</Table.HeadCell>
        <Table.HeadCell>Nom</Table.HeadCell>
        <Table.HeadCell className="text-right">Prix Unitaire HT</Table.HeadCell>
        <Table.HeadCell className="w-1/6" />
      </Table.Head>
      <Table.Body>
        {products.map((product: Product) => (
          <ProductTableLine key={product.id || "new-product"} product={product} />
        ))}
        <ProductTableLine product={new Product()} />
      </Table.Body>
    </Table>
  );
};

export default ProductTable;
