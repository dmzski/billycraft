package com.coco.back.resources;

import com.coco.back.dtos.SearchDTO;
import com.coco.back.services.SearchService;
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
@Path("/{tenant}/search")
@RequestScoped
public class SearchRessource {

    @Claim(standard = Claims.preferred_username)
    String username;

    @Inject
    SearchService searchService;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<SearchDTO> searchAll (@QueryParam("query") String query) {
        return this.searchService.searchAll(username, query);
    }
}
