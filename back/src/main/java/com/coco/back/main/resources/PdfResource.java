package com.coco.back.main.resources;

import com.coco.back.main.services.BillPDFService;
import com.coco.back.main.services.QuotePDFService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.jboss.resteasy.annotations.jaxrs.PathParam;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/{tenant}/pdfs")
@Authenticated
@RequestScoped
public class PdfResource {

    @Inject
    QuotePDFService quotePdfService;

    @Inject
    BillPDFService billPDFService;

    @Claim(standard = Claims.preferred_username)
    String username;

    @GET
    @Path("/quote/{id}")
    @Produces("application/pdf")
    public Response getPdfByQuoteId (@PathParam String tenant, @PathParam String id) {
        byte[] pdf = this.quotePdfService.getQuotePdf(username, id);
        return Response.ok(pdf).header("Content-Disposition","attachment; filename=\"" + id + ".pdf\"").build();
    }

    @GET
    @Path("/quote/{id}/renew")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response renewPdfOfQuoteById (@PathParam String tenant, @PathParam String id) {
        byte[] pdf = this.quotePdfService.generateQuote(username, id);
        return Response.ok(pdf).build();
    }


    @GET
    @Path("/bill/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getPdfByBillId (@PathParam String tenant, @PathParam String id) {
        byte[] pdf = this.billPDFService.getBillPdf(username, id);
        return Response.ok(pdf).build();
    }

    @GET
    @Path("/bill/{id}/renew")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response renewPdfOfBillById (@PathParam String tenant, @PathParam String id) {
        byte[] pdf = this.billPDFService.generateBill(username, id);
        return Response.ok(pdf).build();
    }
}
