import { gql } from "graphql-request";
import { BillEmailCustomization } from "models/BillEmailCustomization";
import { graphQLClient } from "./GraphQLClient";

export const BillEmailCustomizationGraphQL = {
  getMine: async (): Promise<any> => {
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
  updateMyBillCustomization: async (billEmailCustomization: BillEmailCustomization): Promise<any> => {
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
