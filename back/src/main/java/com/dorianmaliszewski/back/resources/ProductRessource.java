package com.dorianmaliszewski.back.resources;

import com.dorianmaliszewski.back.models.Product;
import com.dorianmaliszewski.back.services.ProductService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Authenticated
@Path("/{tenant}/products")
@RequestScoped
public class ProductRessource {

    @Inject
    ProductService productService;

    @Claim(standard = Claims.preferred_username)
    String username;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getAllProducts() {
        return this.productService.findAllOfMyCompany(username);
    }



    @GET
    @Path("/contains")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getAllProductsContains(@QueryParam("q") String query) {
        return this.productService.findAllOfMyCompanyContains(username, query);
    }
}
