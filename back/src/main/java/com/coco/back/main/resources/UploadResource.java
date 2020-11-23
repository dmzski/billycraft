package com.coco.back.main.resources;

import com.coco.back.main.services.CompanyService;
import org.jboss.resteasy.annotations.jaxrs.PathParam;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

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
