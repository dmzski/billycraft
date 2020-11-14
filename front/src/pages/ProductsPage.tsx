import React from "react";
import { useQuery } from "react-query";
import Loader from "../components/Loader";
import Layout from "../containers/layout/Layout";
import ProductTable from "../containers/tables/ProductTable";
import { ProductGraphQL } from "../graphql/ProductGraphQL";
import { Product } from "../models/Product";

const ProductsPage = () => {
  const productsQuery = useQuery("products", ProductGraphQL.getAllProducts, { refetchOnWindowFocus: false });
  return (
    <Layout>
      <div className="flex-col justify-center w-full">
        <h2 className="text-bold text-2xl text-center">Vos produits</h2>
        {productsQuery.isLoading && <Loader />}
        {productsQuery.isError && <div>Une erreur est survenue</div>}
        {productsQuery.data && <ProductTable products={productsQuery.data.sort((a: Product, b: Product) => a.description.localeCompare(b.description))} />}
      </div>
    </Layout>
  );
};

export default ProductsPage;
