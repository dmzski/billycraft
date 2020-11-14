import { gql } from "graphql-request";
import { graphQLClient } from "./GraphQLClient";

export const ProductGraphQL = {
  getAllProducts: async () => {
    const { getAllProducts } = await graphQLClient.request(
      gql`
        query {
          getAllProducts {
            id
            description
            price
          }
        }
      `
    );

    return getAllProducts;
  },
  getAllProductsContains: async (_: any, search: string) => {
    const { getAllProductsContains } = await graphQLClient.request(
      gql`
        query($search: String) {
          getAllProductsContains(search: $search) {
            id
            description
            price
          }
        }
      `,
      {
        search,
      }
    );

    return getAllProductsContains;
  },

  saveProduct: async (product: any) => {
    const { mutation } = await graphQLClient.request(
      gql`
        mutation($product: ProductInput!) {
          saveProduct(product: $product) {
            id
            description
            price
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
