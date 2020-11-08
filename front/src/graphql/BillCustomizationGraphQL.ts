import { gql } from "graphql-request";
import { graphQLClient } from "./GraphQLClient";

export const BillCustomizationGraphQL = {
  getMyInformation: async () => {
    const { myBillCustomization } = await graphQLClient.request(
      gql`
        query {
          myBillCustomization {
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

    return myBillCustomization;
  },
  updateMyBillCustomization: async (billCustomization: any) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($billCustomization: BillCustomizationInput!) {
          updateMyBillCustomization(billCustomization: $billCustomization) {
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
        billCustomization,
      }
    );
    return mutation;
  },
};
