import request, { gql } from "graphql-request";
import { GRAPHQL_URL } from "../constants/global";
import { Bill } from "../models/Bill";
import { BillStatusEnum } from "../models/BillStatusEnum";
import { graphQLClient } from "./GraphQLClient";

const BILL_DTO = `
id
customer {
  id
  name
}
title
createdAt
updatedAt
sentAt
version
status
lines {
  line
  description
  price
  quantity
  type
}`;
export const BillGraphQL = {
  getAllBills: async () => {
    const { allBills } = await graphQLClient.request(
      gql`
        query {
          allBills {
            ${BILL_DTO}
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
            ${BILL_DTO}
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
            ${BILL_DTO}
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
            ${BILL_DTO}
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
            ${BILL_DTO}
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
            ${BILL_DTO}
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
