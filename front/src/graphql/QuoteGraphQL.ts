import request, { gql } from "graphql-request";
import { GRAPHQL_URL } from "../constants/global";
import { Quote } from "../models/Quote";
import { QuoteStatusEnum } from "../models/QuoteStatusEnum";
import { graphQLClient } from "./GraphQLClient";

export const QuoteGraphQL = {
  getAllQuotes: async () => {
    const { allQuotes } = await graphQLClient.request(
      gql`
        query {
          allQuotes {
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

    return allQuotes;
  },
  getAllQuotesNotArchived: async () => {
    const { allQuotesNotArchived } = await graphQLClient.request(
      gql`
        query {
          allQuotesNotArchived {
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

    return allQuotesNotArchived;
  },
  getAllQuotesArchived: async () => {
    const { allQuotesArchived } = await graphQLClient.request(
      gql`
        query {
          allQuotesArchived {
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

    return allQuotesArchived;
  },

  createOrUpdateQuote: async (quote: Quote) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation ($quote: QuoteInput!) {
          ${quote.id ? "updateQuote" : "createQuote"}(quote: $quote) {
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
