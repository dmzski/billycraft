import { Grid } from "@coco-ui/core";
import React from "react";
import ProductTableLine from "../../components/product/ProductTableLine";
import { Product } from "../../models/Product";

const ProductTable = ({ products }: any): JSX.Element => {
  return (
    <div className="w-full">
      <Grid cols={2} gap={1}>
        <div>Nom</div>
        <div className="text-right">
          <span>Prix Unitaire HT</span>
          <span className="px-12"></span>
        </div>
        {products.map((product: Product) => (
          <ProductTableLine key={product.id || "new-product"} product={product} />
        ))}
        <ProductTableLine product={new Product()} />
      </Grid>
    </div>
  );
};

export default ProductTable;
