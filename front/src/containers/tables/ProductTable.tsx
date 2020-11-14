import React from "react";
import ProductTableLine from "../../components/product/ProductTableLine";
import { Product } from "../../models/Product";

const ProductTable: React.FC<any> = ({ products }) => {
  return (
    <div className="w-full">
      <table className="w-full text-left table-card">
        <thead>
          <tr>
            <th>Nom</th>
            <th className="text-right">Prix Unitaire HT</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: Product) => (
            <ProductTableLine product={product} />
          ))}
          <ProductTableLine product={new Product()} />
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
