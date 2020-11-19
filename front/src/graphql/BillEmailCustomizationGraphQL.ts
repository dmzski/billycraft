import { gql } from "graphql-request";
import { graphQLClient } from "./GraphQLClient";

export const BillEmailCustomizationGraphQL = {
  getMine: async () => {
    const { myBillEmailCustomization } = await graphQLClient.request(
      gql`
        query {
          myBillEmailCustomization {
            id
            object
            body
            sendAutomatically
          }
        }
      `
    );

    return myBillEmailCustomization;
  },
  updateMyBillCustomization: async (billEmailCustomization: any) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($billEmailCustomization: BillEmailCustomizationInput!) {
          updateMyBillEmailCustomization(billEmailCustomization: $billEmailCustomization) {
            id
            object
            body
            sendAutomatically
          }
        }
      `,
      {
        billEmailCustomization,
      }
    );
    return mutation;
  },
};
