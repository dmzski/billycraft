import { gql } from "graphql-request";
import { Bill } from "../models/Bill";
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
  getAllBills: async (): Promise<Bill[]> => {
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
  getAllBillsNotArchived: async (): Promise<Bill[]> => {
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
  getAllBillsArchived: async (): Promise<Bill[]> => {
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

  createOrUpdateBill: async ({ id, quoteId, customer, lines, status, title, tva, total }: Bill): Promise<any> => {
    const mutation = await graphQLClient.request(
      gql`
        mutation ($bill: BillInput!) {
          ${id ? "updateBill" : "createBill"}(bill: $bill) {
            ${BILL_DTO}
          }
        }
      `,
      {
        bill: {
          id,
          quoteId,
          customer,
          lines: (lines || []).map(({ description, line, price, quantity, type }) => ({
            type,
            description,
            quantity,
            price,
            line,
          })),
          status,
          title,
          tva,
          total,
        },
      }
    );

    return mutation;
  },

  getBill: async (_: unknown, id: number): Promise<Bill> => {
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

  updateBillStatus: async ({ id, statusEnum }: { id: string; statusEnum: string }): Promise<any> => {
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

  createFromQuote: async (quoteId: string): Promise<any> => {
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
