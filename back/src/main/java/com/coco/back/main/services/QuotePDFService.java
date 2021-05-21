package com.coco.back.main.services;

import com.coco.back.main.enums.StatusEnum;
import com.coco.back.main.forms.PdfMultipartForm;
import com.coco.back.main.models.Company;
import com.coco.back.main.models.Quote;
import com.coco.back.main.models.QuoteCustomization;
import com.coco.back.main.services.rest.PDFServiceRest;
import io.quarkus.qute.Template;
import io.quarkus.qute.TemplateInstance;
import io.quarkus.qute.api.CheckedTemplate;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@ApplicationScoped
public class QuotePDFService {

    private final static Logger LOG = Logger.getLogger(QuotePDFService.class);

    @Inject
    QuoteService quoteService;

    @Inject
    @RestClient
    PDFServiceRest pdfServiceRest;

    @ConfigProperty(name = "compta.upload-dir", defaultValue = "/tmp/compta")
    String pdfDir;

    @CheckedTemplate
    public static class Templates {
        public static native TemplateInstance quote();
    }

    @Inject
    Template footer;


    @Transactional
    public byte[] generateQuote(String username, String quoteId) {
        Quote quote = this.quoteService.getQuoteById(username, quoteId);
        Company company = (Company) Company.findByIdOptional(quote.companyId).orElseThrow(EntityNotFoundException::new);
        QuoteCustomization quoteCustomization = (QuoteCustomization) QuoteCustomization.find("company_id = ?1", company.id).singleResultOptional().orElse(new QuoteCustomization());


        String html = Templates.quote().data("quote", quote).data("lines", quote.lines).data("company",company).data("customization", quoteCustomization).render();
        try {
            PdfMultipartForm form = new PdfMultipartForm();
            form.index = new ByteArrayInputStream(html.getBytes(StandardCharsets.UTF_8));
            if (quote.id != null) {
                form.resultFilename = quote.id;
            }
            if (quoteCustomization.footer != null) {
                String footerHtml = footer.data("footer", quoteCustomization.footer).render();
                form.footer = new ByteArrayInputStream(footerHtml.getBytes(StandardCharsets.UTF_8));
            }
            byte[] result = pdfServiceRest.getPdfFromHtmlFile(form);

            if (!quote.status.equals(StatusEnum.DRAFT)) {
                File f = new File(pdfDir + "/" + company.id + "/" + quote.id + "_" + quote.version + ".pdf");
                f.getParentFile().mkdirs();
                f.createNewFile();
                Files.write(f.toPath(), result);
                quote.fileName = f.getName();
                quote.persist();
            }
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

    public byte[] getQuotePdf(String username, String quoteId) {
        Quote quote = this.quoteService.getQuoteById(username, quoteId);
        Company company = (Company) Company.findByIdOptional(quote.companyId).orElseThrow(EntityNotFoundException::new);
        try {
            if (quote.fileName == null || quote.fileName.equals("") || quote.status.equals(StatusEnum.DRAFT)) {
                return this.generateQuote(username, quoteId);
            }
            File f = new File(pdfDir + "/" + company.id + "/" + quote.fileName);
            if (!f.exists()) {
                return this.generateQuote(username, quoteId);
            }
            return Files.readAllBytes(f.toPath());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public File getQuotePdfFile(String username, String quoteId) {
        Quote quote = this.quoteService.getQuoteById(username, quoteId);
        Company company = (Company) Company.findByIdOptional(quote.companyId).orElseThrow(EntityNotFoundException::new);
        if (quote.status.equals(StatusEnum.DRAFT)) {
            return null;
        }
        File f = new File(pdfDir + "/" + company.id + "/" + quote.fileName);
        if (quote.fileName == null || quote.fileName.equals("") || !f.exists()) {
                this.generateQuote(username, quoteId);
                quote = this.quoteService.getQuoteById(username, quoteId);
                return new File(pdfDir + "/" + company.id + "/" + quote.fileName);
        }
        return f;
    }
}
