package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.models.Product;

import javax.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class ProductService {

    public List<Product> findAllOfMyCompany (String username) {
        return Product.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1)", username);
    }


    public List<Product> findAllOfMyCompanyContains (String username, String query) {
        return Product.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) AND translate(lower(description), ' ', '') = ?2", username, query.toLowerCase().replaceAll(" ", ""));
    }

}

