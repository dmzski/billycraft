package com.coco.back.main.resources;

import com.coco.back.main.exceptions.ApiResponseException;
import com.coco.back.main.services.SpreadsheetService;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;

@Path("/{tenant}/sheets")
public class SpreadsheetResource {

    @Inject
    SpreadsheetService spreadsheetService;

    @Claim(standard = Claims.preferred_username)
    String username;

    @GET
    @Path("/csv/preview")
    @Produces(MediaType.TEXT_PLAIN)
    public String previewSpreadsheet() {
        return this.spreadsheetService.getCSVOfQuote(username, "1");
    }

    @GET
    @Path("/xls/preview")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response previewXls() throws ApiResponseException {
        return Response.status(200).header("Content-Disposition", "attachment;filename=" + "test.xls").entity(this.spreadsheetService.generateQuoteXLS(username, "1")).build();
    }
}
