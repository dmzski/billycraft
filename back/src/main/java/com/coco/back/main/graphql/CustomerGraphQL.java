package com.coco.back.main.graphql;

import com.coco.back.main.models.Customer;
import com.coco.back.main.services.CustomerService;
import io.quarkus.security.identity.SecurityIdentity;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.inject.Inject;
import java.util.List;

@GraphQLApi
public class CustomerGraphQL {

    @Inject
    CustomerService customerService;

    @Claim(standard = Claims.preferred_username)
    String username;

    @Query("allCustomers")
    @Description("Get all customers")
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers(username);
    }

    @Query("customerById")
    @Description("Get customer by id")
    public Customer getCustomerById(Long id) {
        return customerService.getCustomer(username, id);
    }

    @Query("allCustomersByNameContain")
    @Description("Get customer by id")
    public List<Customer> getAllCustomersByNameContain(String name) {
        return customerService.getAllCustomersByNameContains(username, name);
    }

    @Mutation("createCustomer")
    @Description("Create customer")
    public Customer createCustomer(Customer customer) {
        return this.customerService.createCustomer(username, customer);
    }

    @Mutation("updateCustomer")
    @Description("Update customer")
    public Customer updateCustomer(Customer customer) {
        return this.customerService.updateCustomer(username, customer.id, customer);
    }
}
