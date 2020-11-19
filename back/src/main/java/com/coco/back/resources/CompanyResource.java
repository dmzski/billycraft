package com.coco.back.resources;

import com.coco.back.services.CompanyService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.io.IOException;

@Path("/{tenant}/company")
@Authenticated
@RequestScoped
public class CompanyResource {

    @Claim(standard = Claims.preferred_username)
    String username;

    @Inject
    CompanyService companyService;

    @POST
    @Path("/upload-logo")
    @Consumes(MediaType.APPLICATION_OCTET_STREAM)
    @Produces(MediaType.TEXT_PLAIN)
    public String uploadLogo (byte[] logo) throws IOException {
        System.out.println(username);
        return this.companyService.uploadLogo(username, logo);

    }
}
