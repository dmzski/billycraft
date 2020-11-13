package com.dorianmaliszewski.back.graphql;

import com.dorianmaliszewski.back.models.Product;
import com.dorianmaliszewski.back.services.ProductService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.inject.Inject;
import java.util.List;

@GraphQLApi
@Authenticated
public class ProductGraphQL {

    @Inject
    ProductService productService;

    @Claim(standard = Claims.preferred_username)
    String username;

    @Query("getAllProducts")
    @Description("Get all products")
    public List<Product> getAllProducts() {
        return this.productService.findAllOfMyCompany(username);
    }

    @Query("getAllProductsContains")
    @Description("Get all products that contains the string")
    public List<Product> getAllProductsContains(String query) {
        return this.productService.findAllOfMyCompanyContains(username, query);
    }

}
