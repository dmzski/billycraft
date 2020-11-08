package com.dorianmaliszewski.back.resources;

import com.dorianmaliszewski.back.services.CompanyService;
import org.jboss.resteasy.annotations.jaxrs.PathParam;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import java.io.File;

@Path("/uploads")
public class UploadResource {

    @Inject
    CompanyService companyService;

    @GET
    @Path("/logo/{id}")
    public byte[] getUploadByName(@PathParam Long id) {
        return this.companyService.getLogo(id);
    }

}
