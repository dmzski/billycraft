package com.dorianmaliszewski.back.resources;

import com.dorianmaliszewski.back.services.PDFService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.jboss.resteasy.annotations.jaxrs.PathParam;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;

@Path("/{tenant}/pdfs")
@Authenticated
public class PdfResource {

    @Inject
    PDFService pdfService;

    @Claim(standard = Claims.preferred_username)
    String username;

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getPdfByQuoteId (@PathParam String tenant, @PathParam String id) {
        byte[] pdf = this.pdfService.generateQuote(username, id);
        return Response.ok(pdf).build();
    }
}
