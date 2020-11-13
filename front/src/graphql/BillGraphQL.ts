import request, { gql } from "graphql-request";
import { GRAPHQL_URL } from "../constants/global";
import { Bill } from "../models/Bill";
import { BillStatusEnum } from "../models/BillStatusEnum";
import { graphQLClient } from "./GraphQLClient";

export const BillGraphQL = {
  getAllBills: async () => {
    const { allBills } = await graphQLClient.request(
      gql`
        query {
          allBills {
            id
            customer {
              id
              name
            }
            title
            createdAt
            updatedAt
            version
            status
            lines {
              line
              description
              price
              quantity
              type
            }
          }
        }
      `
    );

    return allBills;
  },
  getAllBillsNotArchived: async () => {
    const { allBillsNotArchived } = await graphQLClient.request(
      gql`
        query {
          allBillsNotArchived {
            id
            customer {
              id
              name
            }
            title
            createdAt
            updatedAt
            version
            status
            lines {
              line
              description
              price
              quantity
              type
            }
          }
        }
      `
    );

    return allBillsNotArchived;
  },
  getAllBillsArchived: async () => {
    const { allBillsArchived } = await graphQLClient.request(
      gql`
        query {
          allBillsArchived {
            id
            customer {
              id
              name
            }
            title
            createdAt
            updatedAt
            version
            status
            lines {
              line
              description
              price
              quantity
              type
            }
          }
        }
      `
    );

    return allBillsArchived;
  },

  createOrUpdateBill: async (bill: Bill) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation ($bill: BillInput!) {
          ${bill.id ? "updateBill" : "createBill"}(bill: $bill) {
            id
            title
            createdAt
            updatedAt
            version
            status
            customer {
                id
            }
          }
        }
      `,
      {
        bill,
      }
    );

    return mutation;
  },

  getBill: async (_: any, id: number) => {
    const { billById } = await graphQLClient.request(
      gql`
        query {
            billById(id: "${id}") {
            id
            title
            customer {
              id
              name
            }
            phoneNumber
            postalCode
            status
          }
        }
      `
    );

    return billById;
  },

  updateBillStatus: async ({ id, statusEnum }: any) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($id: String, $statusEnum: BillStatusEnum) {
          updateBillStatus(id: $id, statusEnum: $statusEnum) {
            id
            title
            createdAt
            updatedAt
            version
            status
            customer {
              id
            }
          }
        }
      `,
      {
        id,
        statusEnum,
      }
    );

    return mutation;
  },

  createFromQuote: async (quoteId: string) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($quoteId: String) {
          createBillFromQuote(quoteId: $quoteId) {
            id
            title
            createdAt
            updatedAt
            version
            status
            quoteId
            customer {
              id
            }
          }
        }
      `,
      {
        quoteId,
      }
    );

    return mutation;
  },
};
