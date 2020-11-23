package com.coco.back.main.resources;

import com.coco.back.main.services.EmailService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/{tenant}/emails")
@Authenticated
@RequestScoped
public class EmailRessource {

    @Claim(standard = Claims.preferred_username)
    String username;

    @Inject
    EmailService emailService;

    @GET
    @Path("/quotes/preview")
    @Produces(MediaType.TEXT_HTML)
    public String getQuotePreview() {
        return this.emailService.getQuotePreview(username);
    }

    @POST
    @Path("/quotes/send")
    @Produces(MediaType.TEXT_PLAIN)
    public boolean sendQuote(@QueryParam("id") String id) {
        return this.emailService.sendQuoteEmail(username, id);
    }

    @POST
    @Path("/bills/send")
    @Produces(MediaType.TEXT_PLAIN)
    public boolean sendBill(@QueryParam("id") String id) {
        return this.emailService.sendBillEmail(username, id);
    }

}
