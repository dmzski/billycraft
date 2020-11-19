package com.coco.back.services;

import com.coco.back.models.Customer;
import com.coco.back.models.User;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.NotFoundException;
import java.util.List;

@ApplicationScoped
public class CustomerService {

    @Inject
    UserService userService;

    public List<Customer> getAllCustomers(String username) {
        return Customer.list("company_id = (SELECT u.company.id FROM User u WHERE u.email = ?1)", username);
    }

    public Customer getCustomer(String username, Long id) {
        return Customer.find("id = ?1 AND company_id = (SELECT u.company.id FROM User u WHERE u.email = ?2)", id, username).firstResult();
    }

    @Transactional
    public Customer createCustomer(String email, Customer customer) {
        customer.company = this.userService.findByEmail(email).company;
        customer.persist();
        return customer;
    }


    @Transactional
    public Customer updateCustomer(String username, Long id, Customer newCustomer) {
        Customer customer = this.getCustomer(username, id);
        if (customer != null) {
            customer.name = newCustomer.name;
            customer.contact = newCustomer.contact;
            customer.city = newCustomer.city;
            customer.phoneNumber = newCustomer.phoneNumber;
            customer.postalCode = newCustomer.postalCode;
            customer.address = newCustomer.address;
            customer.email = newCustomer.email;
            customer.persist();
            return customer;
        } else {
            throw new NotFoundException("Entity not found");
        }
    }

    public List<Customer> getAllCustomersByNameContains(String username, String name) {
        User user = (User) User.find("email = ?1", username).singleResultOptional().orElseThrow();
        return Customer.find("company_id = ?1 AND lower(name) LIKE ?2", user.company.id, "%" + name.toLowerCase() + "%").list();
    }
}
