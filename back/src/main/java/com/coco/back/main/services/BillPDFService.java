package com.coco.back.main.services;

import com.coco.back.main.models.BillCustomization;
import com.coco.back.main.models.Company;
import com.coco.back.main.services.rest.PDFServiceRest;
import com.coco.back.main.enums.BillStatusEnum;
import com.coco.back.main.enums.LineTypeEnum;
import com.coco.back.main.enums.StatusEnum;
import com.coco.back.main.forms.PdfMultipartForm;
import com.coco.back.main.models.Bill;
import com.coco.back.main.models.BillLine;
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
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @Inject
    Template footer;


    @Transactional
    public byte[] generateBill(String username, String billId) {
        Bill bill = this.billService.getBillById(username, billId);
        Company company = (Company) Company.findByIdOptional(bill.companyId).orElseThrow(EntityNotFoundException::new);
        BillCustomization billCustomization = (BillCustomization) BillCustomization.find("company_id = ?1", company.id).singleResultOptional().orElse(new BillCustomization());

        List<BillLine> articles = new ArrayList<>();
        List<BillLine> services = new ArrayList<>();
        if (bill.lines != null) {
            articles = bill.lines.stream().filter(billLine -> billLine.type != null && billLine.type.equals(LineTypeEnum.ARTICLE)).collect(Collectors.toList());
            services = bill.lines.stream().filter(billLine -> billLine.type == null || !billLine.type.equals(LineTypeEnum.ARTICLE)).collect(Collectors.toList());

        }

        String html = Templates.bill().data("bill", bill).data("articles", articles).data("services", services).data("company",company).data("customization", billCustomization).render();
        try {
            PdfMultipartForm form = new PdfMultipartForm();
            form.index = new ByteArrayInputStream(html.getBytes(StandardCharsets.UTF_8));
            if (bill.id != null) {
                form.resultFilename = bill.id;
            }
            if (billCustomization.footer != null) {
                String footerHtml = footer.data("footer", billCustomization.footer).render();
                form.footer = new ByteArrayInputStream(footerHtml.getBytes(StandardCharsets.UTF_8));
            }
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


    public File getBillPdfFile(String username, String billId) {
        Bill bill = this.billService.getBillById(username, billId);
        Company company = (Company) Company.findByIdOptional(bill.companyId).orElseThrow(EntityNotFoundException::new);
        if (bill.fileName == null || bill.fileName.equals("") || bill.status.equals(StatusEnum.DRAFT)) {
            return null;
        }
        File f = new File(pdfDir + "/" + company.id + "/" + bill.fileName);
        if (!f.exists()) {
            this.generateBill(username, billId);
            return new File(bill.fileName);
        }
        return f;
    }
}
