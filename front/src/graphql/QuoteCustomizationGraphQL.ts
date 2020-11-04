import { gql } from "graphql-request";
import { graphQLClient } from "./GraphQLClient";

export const QuoteCustomizationGraphQL = {
  getMyInformation: async () => {
    const { myQuoteCustomization } = await graphQLClient.request(
      gql`
        query {
          myQuoteCustomization {
            afterInformation
            afterTable
            footer
          }
        }
      `
    );

    return myQuoteCustomization;
  },
  updateMyQuoteCustomization: async (quoteCustomization: any) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($quoteCustomization: QuoteCustomizationInput!) {
          updateMyQuoteCustomization(quoteCustomization: $quoteCustomization) {
            afterInformation
            afterTable
            footer
          }
        }
      `,
      {
        quoteCustomization,
      }
    );
    return mutation;
  },
};
