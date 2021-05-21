package com.coco.back.main.resources;

import com.coco.back.main.dtos.ReportDTO;
import com.coco.back.main.services.ReportService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.time.Instant;

@Authenticated
@Path("/{tenant}/reports")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
public class ReportResource {

    @Claim(standard = Claims.preferred_username)
    String username;

    @Inject
    ReportService reportService;


    @GET
    @Path("/month")
    public ReportDTO getMonthReport (@QueryParam("query") String query) {
        return this.reportService.getMonthReport(username, Instant.parse(query));
    }

    @GET
    @Path("/year")
    public ReportDTO getYearReport (@QueryParam("query") String query) {
        return this.reportService.getYearReport(username, Instant.parse(query));
    }
}
