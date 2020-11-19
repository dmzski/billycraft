package com.coco.back.services;

import com.coco.back.models.Product;
import com.coco.back.models.User;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductService {

    public List<Product> findAllOfMyCompany (String username) {
        return Product.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1)", username);
    }


    public List<Product> findAllOfMyCompanyContains (String username, String search) {
        return Product.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) AND translate(lower(description), ' ', '') LIKE ?2", username, "%" + search.toLowerCase().replaceAll(" ", "") + "%");
    }

    @Transactional
    public Product saveProduct(String username, Product product) {
        User user = (User) User.findByIdOptional(username).orElseThrow();
        if (user.company == null) {
            throw new ClientErrorException(Response.Status.CONFLICT);
        }

        Optional<Product> oldProduct = Product.find("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) AND translate(lower(description), ' ', '') = ?2", username, product.description.toLowerCase().replaceAll(" ", "")).singleResultOptional();

        if (oldProduct.isPresent()) {
            oldProduct.get().price = product.price;
            oldProduct.get().persist();
            return oldProduct.get();
        } else {
            product.companyId = user.company.id;
            product.persist();
            return product;
        }
    }

    @Transactional
    public boolean deleteProduct(String username, Long id) {
        Product.find("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) AND id = ?2", username, id).singleResultOptional().ifPresent(PanacheEntityBase::delete);
        return true;
    }
}

