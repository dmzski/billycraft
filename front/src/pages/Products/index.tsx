import { ProductApi } from "api/ProductApi";
import React from "react";
import { useQuery } from "react-query";
import Loader from "../../components/Loader";
import ProductTable from "./List";
import Product from "../../models/Product";

const ProductsPage = (): JSX.Element => {
  const productsQuery = useQuery("products", ProductApi.findAll, {
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <h2 className="text-3xl">Articles</h2>
      <p className="text-sm mt-1">
        Retrouvez ci-dessous la liste des articles que vous avez enregistrés.
        Vous pourrez les ajouter plus rapidement lors de la création de vos
        factures et devis.
      </p>
      <div className="flex-col justify-center w-full mt-8 items-center">
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
    </>
  );
};

export default ProductsPage;
