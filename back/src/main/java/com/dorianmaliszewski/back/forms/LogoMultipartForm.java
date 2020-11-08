package com.dorianmaliszewski.back.forms;

import org.jboss.resteasy.annotations.providers.multipart.PartFilename;
import org.jboss.resteasy.annotations.providers.multipart.PartType;

import javax.ws.rs.FormParam;
import java.io.File;

public class LogoMultipartForm {

    @FormParam("logo")
    @PartType("application/octet-stream")
    @PartFilename("logo.png")
    public byte[] logo;

    @FormParam("filename")
    @PartType("text/plain")
    public String fileName;
}
