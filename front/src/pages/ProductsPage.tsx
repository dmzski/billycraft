import { ProductApi } from "api/ProductApi";
import React from "react";
import { useQuery } from "react-query";
import Loader from "../components/Loader";
import ProductTable from "../containers/tables/ProductTable";
import Product from "../models/Product";

const ProductsPage = (): JSX.Element => {
  const productsQuery = useQuery("products", ProductApi.findAll, {
    refetchOnWindowFocus: false,
  });
  return (
    <div className="flex-col justify-center w-full items-center">
      <h2 className="text-bold text-2xl text-center">Vos produits</h2>
      {productsQuery.isLoading && (
        <div className="w-full flex justify-center">
          <Loader />
        </div>
      )}
      {productsQuery.isError && <div>Une erreur est survenue</div>}
      {productsQuery.data && (
        <ProductTable
          products={productsQuery.data.sort((a: Product, b: Product) =>
            a.description.localeCompare(b.description)
          )}
        />
      )}
    </div>
  );
};

export default ProductsPage;
