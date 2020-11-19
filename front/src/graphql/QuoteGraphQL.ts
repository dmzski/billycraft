import request, { gql } from "graphql-request";
import { GRAPHQL_URL } from "../constants/global";
import { Quote } from "../models/Quote";
import { QuoteStatusEnum } from "../models/QuoteStatusEnum";
import { graphQLClient } from "./GraphQLClient";

const QUOTE_DTO = `
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

export const QuoteGraphQL = {
  getAllQuotes: async () => {
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
  getAllQuotesNotArchived: async () => {
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
  getAllQuotesArchived: async () => {
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

  createOrUpdateQuote: async (quote: Quote) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation ($quote: QuoteInput!) {
          ${quote.id ? "updateQuote" : "createQuote"}(quote: $quote) {
            ${QUOTE_DTO}
          }
        }
      `,
      {
        quote,
      }
    );

    return mutation;
  },

  getQuote: async (_: any, id: number) => {
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

  sendQuote: async (id: string) => {
    const mutation = await graphQLClient.request(
      gql`
          mutation {
            sendQuote(id: "${id}") {
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
        `
    );

    return mutation;
  },

  updateQuoteStatus: async ({ id, statusEnum }: any) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation($id: String, $statusEnum: StatusEnum) {
          updateQuoteStatus(id: $id, statusEnum: $statusEnum) {
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
};
