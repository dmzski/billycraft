package com.coco.back.main.resources;

import com.coco.back.main.services.SpreadsheetService;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.io.File;

@Path("/{tenant}/sheets")
public class SpreadsheetResource {

    @Inject
    SpreadsheetService spreadsheetService;

//    @Claim(standard = Claims.preferred_username)
//    String username;

    @GET
    @Path("/csv/preview")
    @Produces(MediaType.TEXT_PLAIN)
    public String previewSpreadsheet() {
        return this.spreadsheetService.getCSVOfQuote("maliszewskid3@gmail.com", "1");
    }
}
