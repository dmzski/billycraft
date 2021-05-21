import { gql } from "graphql-request";
import { Company } from "../models/Company";
import { graphQLClient } from "./GraphQLClient";

export const CompanyGraphQL = {
  getMyCompany: async (): Promise<Company> => {
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
            email
          }
        }
      `
    );

    return myCompany;
  },
  createOrUpdateMyCompany: async (company: Company): Promise<any> => {
    const mutation = await graphQLClient.request(
      gql`
        mutation ($company: CompanyInput!) {
          ${company.id ? "updateCompany" : "createCompany"}(company: $company) {
            id
            name
            phoneNumber
            postalCode
            city
            address
            siret
            logo
            email
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
