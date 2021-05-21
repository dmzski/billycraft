import { gql } from "graphql-request";
import { graphQLClient } from "./GraphQLClient";

export const QuoteEmailCustomizationGraphQL = {
  getMine: async (): Promise<any> => {
    const { myQuoteEmailCustomization } = await graphQLClient.request(
      gql`
        query {
          myQuoteEmailCustomization {
            id
            object
            body
            sendAutomatically
          }
        }
      `
    );

    return myQuoteEmailCustomization;
  },
  updateMyQuoteCustomization: async (quoteEmailCustomization: any): Promise<any> => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($quoteEmailCustomization: QuoteEmailCustomizationInput!) {
          updateMyQuoteEmailCustomization(quoteEmailCustomization: $quoteEmailCustomization) {
            id
            object
            body
            sendAutomatically
          }
        }
      `,
      {
        quoteEmailCustomization,
      }
    );
    return mutation;
  },
};
