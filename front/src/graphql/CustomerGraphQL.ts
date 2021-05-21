import { gql } from "graphql-request";
import { Customer } from "../models/Customer";
import { graphQLClient } from "./GraphQLClient";

export const CustomerGraphQL = {
  getAllCustomers: async (): Promise<Customer[]> => {
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
  createOrUpdateCustomer: async ({ address, city, contact, email, name, phoneNumber, postalCode, id }: Customer): Promise<any> => {
    const mutation = await graphQLClient.request(
      gql`
        mutation ($customer: CustomerInput) {
          ${id ? "updateCustomer" : "createCustomer"}(customer: $customer) {
            id
          }
        }
      `,
      {
        customer: {
          id,
          address,
          city,
          contact,
          email,
          name,
          phoneNumber,
          postalCode,
        },
      }
    );

    return mutation;
  },

  getCustomer: async (_: any, id: number): Promise<Customer> => {
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

  getAllCustomersByNameContain: async (key: string, name: string): Promise<Customer[]> => {
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
