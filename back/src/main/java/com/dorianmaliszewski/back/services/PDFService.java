package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.forms.PdfMultipartForm;
import com.dorianmaliszewski.back.models.Company;
import com.dorianmaliszewski.back.models.Quote;
import com.dorianmaliszewski.back.models.QuoteCustomization;
import com.dorianmaliszewski.back.services.rest.PDFServiceRest;
import io.quarkus.qute.TemplateInstance;
import io.quarkus.qute.api.CheckedTemplate;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@ApplicationScoped
public class PDFService {

    private final static Logger LOG = Logger.getLogger(PDFService.class);

    @Inject
    QuoteService quoteService;

    @Inject
    @RestClient
    PDFServiceRest pdfServiceRest;

    @CheckedTemplate
    public static class Templates {
        public static native TemplateInstance quote();
    }


    public byte[] generateQuote(String username, String quoteId) {
        Quote quote = this.quoteService.getQuoteById(username, quoteId);
        Company company = (Company) Company.findByIdOptional(quote.companyId).orElseThrow(EntityNotFoundException::new);
        QuoteCustomization quoteCustomization = (QuoteCustomization) QuoteCustomization.find("company_id = ?1", company.id).singleResultOptional().orElse(new QuoteCustomization());
        String html = Templates.quote().data("quote", quote).data("company",company).data("customization", quoteCustomization).render();
        try {
            Path indexPath = Files.createTempFile(quoteId, ".html");
            Files.write(indexPath, html.getBytes(StandardCharsets.UTF_8));
            PdfMultipartForm form = new PdfMultipartForm();
            form.index = Files.newInputStream(indexPath);
            return pdfServiceRest.getPdfFromHtmlFile(form);

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }
}
