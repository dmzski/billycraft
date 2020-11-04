import { request, gql } from "graphql-request";
import { GRAPHQL_URL } from "../constants/global";
import { Customer } from "../models/Customer";
import { graphQLClient } from "./GraphQLClient";

export const SettingGraphQL = {
  getAllSettings: async () => {
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
