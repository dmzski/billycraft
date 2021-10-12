import { gql } from "graphql-request";
import { Quote } from "../models/Quote";
import { graphQLClient } from "./GraphQLClient";

const QUOTE_DTO = `
id
customer {
  id
  name
}
title
tva
createdAt
updatedAt
sentAt
version
status
lines {
  line
  name
  description
  price
  quantity
  type
}`;

export const QuoteGraphQL = {
  getAllQuotes: async (): Promise<Quote[]> => {
    const { allQuotes } = await graphQLClient.request(
      gql`
        query {
          allQuotes {
            ${QUOTE_DTO}
          }
        }
      `
    );

    return allQuotes;
  },
  getAllQuotesNotArchived: async (): Promise<Quote[]> => {
    const { allQuotesNotArchived } = await graphQLClient.request(
      gql`
        query {
          allQuotesNotArchived {
            ${QUOTE_DTO}
          }
        }
      `
    );

    return allQuotesNotArchived;
  },
  getAllQuotesArchived: async (): Promise<Quote[]> => {
    const { allQuotesArchived } = await graphQLClient.request(
      gql`
        query {
          allQuotesArchived {
            ${QUOTE_DTO}
          }
        }
      `
    );

    return allQuotesArchived;
  },

  createOrUpdateQuote: async ({ id, customer, lines, status, title, tva, total }: Quote): Promise<any> => {
    console.log("La tva", tva);
    const mutation = await graphQLClient.request(
      gql`
        mutation ($quote: QuoteInput!) {
          ${id ? "updateQuote" : "createQuote"}(quote: $quote) {
            ${QUOTE_DTO}
          }
        }
      `,
      {
        quote: {
          id,
          customer,
          lines: (lines || []).map(({ name, description, line, price, quantity, type }) => ({
            type,
            name,
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

  getQuote: async (id: string): Promise<Quote> => {
    const { quoteById } = await graphQLClient.request(
      gql`
        query {
            quoteById(id: "${id}") {
            ${QUOTE_DTO}
          }
        }
      `
    );

    return quoteById;
  },

  sendQuote: async (id: string): Promise<any> => {
    const mutation = await graphQLClient.request(
      gql`
          mutation {
            sendQuote(id: "${id}") {
              ${QUOTE_DTO}
            }
          }
        `
    );

    return mutation;
  },

  updateQuoteStatus: async ({ id, statusEnum }: { id: string; statusEnum: string }): Promise<any> => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($id: String, $statusEnum: StatusEnum) {
          updateQuoteStatus(id: $id, statusEnum: $statusEnum) {
            ${QUOTE_DTO}
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
};
