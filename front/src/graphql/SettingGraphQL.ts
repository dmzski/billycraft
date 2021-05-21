import { gql } from "graphql-request";
import { GRAPHQL_URL } from "../constants/global";
import { graphQLClient } from "./GraphQLClient";

export const SettingGraphQL = {
  getAllSettings: async (): Promise<any[]> => {
    const { allSettings } = await graphQLClient.request(
      GRAPHQL_URL,
      gql`
        query {
          allSettings {
            id
            value
          }
        }
      `
    );

    return allSettings;
  },
};
