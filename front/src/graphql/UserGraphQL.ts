import { gql } from "graphql-request";
import { graphQLClient } from "./GraphQLClient";

export const UserGraphQL = {
  getMyInformation: async (): Promise<any> => {
    const { myInformation } = await graphQLClient.request(
      gql`
        query {
          myInformation {
            email
            firstName
            lastName
            company {
              id
              name
              logo
            }
          }
        }
      `
    );

    return myInformation;
  },
};
