import { request, gql } from "graphql-request";
import { async } from "rxjs";
import { GRAPHQL_URL } from "../constants/global";
import { Customer } from "../models/Customer";
import { graphQLClient } from "./GraphQLClient";

export const CustomerGraphQL = {
  getAllCustomers: async () => {
    const { allCustomers } = await graphQLClient.request(
      gql`
        query {
          allCustomers {
            id
            name
            contact
            phoneNumber
            city
            postalCode
            email
            address
          }
        }
      `
    );

    return allCustomers;
  },
  createOrUpdateCustomer: async (customer: Customer) => {
    const mutation = await graphQLClient.request(
      gql`
        mutation ($customer: CustomerInput) {
          ${customer.id ? "updateCustomer" : "createCustomer"}(customer: $customer) {
            id
          }
        }
      `,
      {
        customer,
      }
    );

    return mutation;
  },

  getCustomer: async (_: any, id: number) => {
    const { customerById } = await graphQLClient.request(
      gql`
        query {
          customerById(id: ${id}) {
            id
            name
            contact
            phoneNumber
            postalCode
          }
        }
      `
    );

    return customerById;
  },

  getAllCustomersByNameContain: async (key: string, name: string) => {
    const { allCustomersByNameContain } = await graphQLClient.request(
      gql`
      query {
        allCustomersByNameContain(name: "${name}") {
          id 
          name
        }

      }
      `
    );

    return allCustomersByNameContain;
  },
};
