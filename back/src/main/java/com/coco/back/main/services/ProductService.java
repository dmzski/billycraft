package com.coco.back.main.services;

import com.coco.back.main.models.Product;
import com.coco.back.main.models.User;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductService {

    public List<Product> findAllOfMyCompany(String username) {
        return Product.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1)", username);
    }

    public List<Product> searchInMyCompagny(String username, String search) {
        return Product.list(
                "SELECT p.* FROM com_product p WHERE company_id = (SELECT u.company_id from com_user u WHERE u.email = ?1) AND ((SELECT COUNT(pk.*) FROM com_product_keywords pk WHERE pk.product_id = p.id AND translate(lower(pk.keyword), ' ', '') LIKE ?2 GROUP BY p.id) <> 0 OR translate(lower(p.name), ' ', '') LIKE ?2)",
                username, "%" + search.toLowerCase().replaceAll(" ", "") + "%");
    }

    @Transactional
    public Product saveProduct(String username, Product product) {
        User user = (User) User.findByIdOptional(username).orElseThrow();
        if (user.company == null) {
            throw new ClientErrorException(Response.Status.CONFLICT);
        }

        Optional<Product> oldProduct = Product
                .find("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) AND id = ?2", username,
                        product.id)
                .singleResultOptional();

        if (oldProduct.isPresent()) {
            oldProduct.get().price = product.price;
            if (oldProduct.get().keywords == null) {
                oldProduct.get().keywords = new ArrayList<String>();
            }

            oldProduct.get().keywords.clear();
            if (product.keywords != null) {
                oldProduct.get().keywords.addAll(product.keywords);
            }
            oldProduct.get().description = product.description;
            oldProduct.get().name = product.name;
            oldProduct.get().type = product.type;
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
        Product.find("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) AND id = ?2", username, id)
                .singleResultOptional().ifPresent(PanacheEntityBase::delete);
        return true;
    }
}
