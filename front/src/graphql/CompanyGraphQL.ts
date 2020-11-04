import { request, gql } from "graphql-request";
import { GRAPHQL_URL } from "../constants/global";
import { Company } from "../models/Company";
import { graphQLClient } from "./GraphQLClient";

export const CompanyGraphQL = {
  getMyCompany: async () => {
    const { myCompany } = await graphQLClient.request(
      gql`
        query {
          myCompany {
            id
            name
            phoneNumber
            postalCode
            city
            address
            siret
            logo
          }
        }
      `
    );

    return myCompany;
  },
  createOrUpdateMyCompany: async (company: Company) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation ($company: CompanyInput!) {
          ${company.id ? "updateCompany" : "createCompany"}(company: $company) {
            id
            name
            phoneNumber
            city
            postalCode
            address
            logo
            siret
          }
        }
      `,
      {
        company,
      }
    );

    return mutation;
  },
};
