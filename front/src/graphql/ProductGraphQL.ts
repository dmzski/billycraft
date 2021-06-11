import { gql } from "graphql-request";
import { Product } from "models/Product";
import { graphQLClient } from "./GraphQLClient";

export const ProductGraphQL = {
  getAllProducts: async (): Promise<any> => {
    const { getAllProducts } = await graphQLClient.request(
      gql`
        query {
          getAllProducts {
            id
            name
            description
            price
            type
          }
        }
      `
    );

    return getAllProducts;
  },
  getAllProductsContains: async (_: any, search: string): Promise<any> => {
    const { getAllProductsContains } = await graphQLClient.request(
      gql`
        query($search: String) {
          getAllProductsContains(search: $search) {
            id
            name
            description
            price
            type
          }
        }
      `,
      {
        search,
      }
    );

    return getAllProductsContains;
  },

  saveProduct: async (product: Product): Promise<any> => {
    const { mutation } = await graphQLClient.request(
      gql`
        mutation($product: ProductInput!) {
          saveProduct(product: $product) {
            id
            name
            description
            price
            type
          }
        }
      `,
      {
        product,
      }
    );

    return mutation;
  },
};
