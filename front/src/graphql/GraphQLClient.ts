import { GraphQLClient } from "graphql-request";
import { GRAPHQL_URL } from "../constants/global";

export const graphQLClient = new GraphQLClient(GRAPHQL_URL);
