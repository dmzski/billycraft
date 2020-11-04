package com.dorianmaliszewski.back.forms;

import org.jboss.resteasy.annotations.providers.multipart.PartFilename;
import org.jboss.resteasy.annotations.providers.multipart.PartType;

import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import java.io.InputStream;

public class PdfMultipartForm {

    @FormParam("index.html")
    @PartFilename("index.html")
    @PartType(MediaType.TEXT_HTML)
    public InputStream index;
    @FormParam("footer.html")
    @PartFilename("footer.html")
    @PartType(MediaType.TEXT_HTML)
    public InputStream footer;
    @FormParam("header.html")
    @PartType(MediaType.TEXT_HTML)
    @PartFilename("header.html")
    public InputStream header;
}
