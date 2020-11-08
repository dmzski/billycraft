package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.enums.BillStatusEnum;
import com.dorianmaliszewski.back.forms.PdfMultipartForm;
import com.dorianmaliszewski.back.models.*;
import com.dorianmaliszewski.back.services.rest.PDFServiceRest;
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
public class BillPDFService {

    private final static Logger LOG = Logger.getLogger(BillPDFService.class);

    @Inject
    BillService billService;

    @Inject
    @RestClient
    PDFServiceRest pdfServiceRest;

    @ConfigProperty(name = "compta.upload-dir", defaultValue = "/tmp/compta")
    String pdfDir;

    @CheckedTemplate
    public static class Templates {
        public static native TemplateInstance bill();
    }


    @Transactional
    public byte[] generateBill(String username, String billId) {
        Bill bill = this.billService.getBillById(username, billId);
        Company company = (Company) Company.findByIdOptional(bill.companyId).orElseThrow(EntityNotFoundException::new);
        BillCustomization billCustomization = (BillCustomization) BillCustomization.find("company_id = ?1", company.id).singleResultOptional().orElse(new BillCustomization());
        String html = Templates.bill().data("bill", bill).data("company",company).data("customization", billCustomization).render();
        try {
            PdfMultipartForm form = new PdfMultipartForm();
            form.index = new ByteArrayInputStream(html.getBytes(StandardCharsets.UTF_8));
            byte[] result = pdfServiceRest.getPdfFromHtmlFile(form);

            if (!bill.status.equals(BillStatusEnum.DRAFT)) {
                File f = new File(pdfDir + "/" + company.id + "/" + bill.id + "_" + bill.version + ".pdf");
                f.getParentFile().mkdirs();
                f.createNewFile();
                Files.write(f.toPath(), result);
                bill.fileName = f.getName();
                bill.persist();
            }
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

    public byte[] getBillPdf(String username, String billId) {
        Bill bill = this.billService.getBillById(username, billId);
        Company company = (Company) Company.findByIdOptional(bill.companyId).orElseThrow(EntityNotFoundException::new);
        try {
            if (bill.fileName == null || bill.fileName.equals("") || bill.status.equals(BillStatusEnum.DRAFT)) {
                return this.generateBill(username, billId);
            }
            File f = new File(pdfDir + "/" + company.id + "/" + bill.fileName);
            if (!f.exists()) {
                return this.generateBill(username, billId);
            }
            return Files.readAllBytes(f.toPath());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Transactional
    public byte[] generateBillWithData(Bill bill, Company company) {
        BillCustomization billCustomization = (BillCustomization) BillCustomization.find("company_id = ?1", company.id).singleResultOptional().orElse(new BillCustomization());
        String html = Templates.bill().data("bill", bill).data("company",company).data("customization", billCustomization).render();
        try {
            PdfMultipartForm form = new PdfMultipartForm();
            form.index = new ByteArrayInputStream(html.getBytes(StandardCharsets.UTF_8));
            byte[] result = pdfServiceRest.getPdfFromHtmlFile(form);
            if (!bill.status.equals(BillStatusEnum.DRAFT)) {
                File f = new File(pdfDir + "/" + company.id + "/" + bill.id + "_" + bill.version + ".pdf");
                f.getParentFile().mkdirs();
                f.createNewFile();
                Files.write(f.toPath(), result);
                bill.fileName = f.getName();
                bill.persist();
            }
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }
}
