package com.dorianmaliszewski.back.services.rest;

import com.dorianmaliszewski.back.forms.PdfMultipartForm;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@RegisterRestClient(configKey = "pdf-service-api")
@Path("/")
public interface PDFServiceRest {

    @POST
    @Path("/convert/html")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    byte[] getPdfFromHtmlFile(@MultipartForm PdfMultipartForm form);
}
