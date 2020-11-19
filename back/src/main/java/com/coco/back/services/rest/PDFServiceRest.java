package com.coco.back.services.rest;

import com.coco.back.forms.PdfMultipartForm;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
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
