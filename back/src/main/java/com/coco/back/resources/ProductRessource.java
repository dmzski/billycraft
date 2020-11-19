package com.coco.back.resources;

import com.coco.back.models.Product;
import com.coco.back.services.ProductService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
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

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public boolean deleteProduct(@PathParam("id") Long id) {
        return this.productService.deleteProduct(username, id);
    }
}
