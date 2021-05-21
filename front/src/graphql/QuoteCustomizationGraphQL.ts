import { gql } from "graphql-request";
import { graphQLClient } from "./GraphQLClient";

export const QuoteCustomizationGraphQL = {
  getMyInformation: async (): Promise<any> => {
    const { myQuoteCustomization } = await graphQLClient.request(
      gql`
        query {
          myQuoteCustomization {
            afterTable
            footer
            mainColor
            displayCustomerEmail
            displayCompanyEmail
            displayCustomerPhoneNumber
            displayCompanyPhoneNumber
          }
        }
      `
    );

    return myQuoteCustomization;
  },
  updateMyQuoteCustomization: async (quoteCustomization: any): Promise<any> => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($quoteCustomization: QuoteCustomizationInput!) {
          updateMyQuoteCustomization(quoteCustomization: $quoteCustomization) {
            afterTable
            footer
            mainColor
            displayCustomerEmail
            displayCompanyEmail
            displayCustomerPhoneNumber
            displayCompanyPhoneNumber
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
