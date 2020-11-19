package com.coco.back.services;

import com.coco.back.models.*;
import com.coco.back.utils.EmailUtils;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.reactive.ReactiveMailer;
import io.quarkus.qute.TemplateInstance;
import io.quarkus.qute.api.CheckedTemplate;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import java.io.File;

@ApplicationScoped
public class EmailService {

    private static final Logger LOG = Logger.getLogger(EmailService.class);

    @Inject
    ReactiveMailer mailer;

    @Inject
    QuotePDFService quotePDFService;

    @Inject
    BillPDFService billPDFService;

    private static final String BASE_QUOTE_SUBJECT = "Devis #QUOTE_ID# : #QUOTE_TITLE#";
    private static final String BASE_BILL_SUBJECT = "Facture #BILL_ID# : #BILL_TITLE#";


    public String getQuotePreview(String username) {
        Quote quote = new Quote();
        quote.id = "TEST_45613";
        quote.title = "Titre d'exemple";

        Company company = (Company) Company.find("id = ?1", quote.companyId).singleResultOptional().orElseThrow();
        QuoteEmailCustomization quoteEmailCustomization = (QuoteEmailCustomization) QuoteEmailCustomization.find("company_id = ?1", company.id).singleResultOptional().orElseThrow(NotFoundException::new);

        return Templates.quote(quote, company, quoteEmailCustomization).render();
    }


    @CheckedTemplate
    static class Templates {
        public static native TemplateInstance quote(Quote quote, Company company, QuoteEmailCustomization customization);
        public static native TemplateInstance bill(Bill bill, Company company, BillEmailCustomization customization);
    }


    public void batchSendQuoteEmail(File file, Quote quote) {
        if (quote.customer == null) {
            return;
        }
        Company company = (Company) Company.find("id = ?1", quote.companyId).singleResultOptional().orElseThrow();
        User user = (User) User.find("email = ?1", quote.createdBy).singleResultOptional().orElseThrow();
        Customer customer = (Customer) Customer.find("id = ?1", quote.customer.id).singleResultOptional().orElseThrow();

        if (customer.email == null) {
            return ;
        }

        QuoteEmailCustomization quoteEmailCustomization = (QuoteEmailCustomization) QuoteEmailCustomization.find("company_id = ?1", company.id).singleResultOptional().orElse(new QuoteEmailCustomization());

        Mail quoteMail = Mail
                .withHtml(
                        customer.email,
                        EmailUtils.replaceStringWithQuoteInformation(quoteEmailCustomization.object != null ? quoteEmailCustomization.object : BASE_QUOTE_SUBJECT, quote),
                        Templates.quote(quote, quoteEmailCustomization.company, quoteEmailCustomization).render()
                )
                .setReplyTo(user.email)
                .addCc(user.email)
                .addAttachment(quote.id + ".pdf", file, "application/octet-stream")
                .setFrom("no-reply@coco-erp.fr");


        if (company.email != null) {
            quoteMail.addBcc(company.email);
        }

        mailer.send(quoteMail).subscribeAsCompletionStage().thenRun(() -> {
            LOG.infof("Quote %s sent to %s ", quote.id, company.id);
        });
    }

    public void batchSendBillEmail(File file, Bill bill) {
        if (bill.customer == null) {
            return;
        }
        Company company = (Company) Company.find("id = ?1", bill.companyId).singleResultOptional().orElseThrow();
        User user = (User) User.find("email = ?1", bill.createdBy).singleResultOptional().orElseThrow();
        Customer customer = (Customer) Customer.find("id = ?1", bill.customer.id).singleResultOptional().orElseThrow();

        if (customer.email == null) {
            return ;
        }

        BillEmailCustomization billEmailCustomization = (BillEmailCustomization) BillEmailCustomization.find("company_id = ?1", company.id).singleResultOptional().orElse(new BillEmailCustomization());
        Mail billMail =  Mail
                .withHtml(
                        customer.email,
                        EmailUtils.replaceStringWithBillInformation(billEmailCustomization.object != null ? billEmailCustomization.object : BASE_BILL_SUBJECT, bill),
                        Templates.bill(bill, billEmailCustomization.company, billEmailCustomization).render()
                )
                .addCc(user.email)
                .setReplyTo(user.email)
                .addAttachment(bill.id + ".pdf", file, "application/octet-stream")
                .setFrom("no-reply@coco-erp.fr");

        if (company.email != null) {
            billMail.addBcc(company.email);
        }

        mailer.send(billMail).subscribeAsCompletionStage().thenRun(() -> {
            LOG.infof("Bill %s sent to %s ", bill.id, company.id);
        });
    }


    public boolean sendQuoteEmail(String username, String id) {
        Quote quote = (Quote) Quote.find("id = ?1 AND company_id = (SELECT u.company.id FROM User u WHERE u.email = ?2)", id, username).singleResultOptional().orElseThrow(NotFoundException::new);
        if (!quote.status.isGreaterThanOrEqualSent()) {
            return false;
        }
        File file = this.quotePDFService.getQuotePdfFile(username, id);
        this.batchSendQuoteEmail(file, quote);
        return true;
    }

    public boolean sendBillEmail(String username, String id) {
        Bill bill = (Bill) Bill.find("id = ?1 AND company_id = (SELECT u.company.id FROM User u WHERE u.email = ?2)", id, username).singleResultOptional().orElseThrow(NotFoundException::new);
        if (!bill.status.isGreaterThanOrEqualSent()) {
            return false;
        }
        File file = this.billPDFService.getBillPdfFile(username, id);
        this.batchSendBillEmail(file, bill);
        return true;
    }

    public boolean sendBillEmailWithBill(String username, Bill bill) {
        if (!bill.status.isGreaterThanOrEqualSent()) {
            return false;
        }
        File file = this.billPDFService.getBillPdfFile(username, bill.id);
        this.batchSendBillEmail(file, bill);
        return true;
    }

    public boolean sendQuoteEmailWithQuote(String username, Quote quote) {
        if (!quote.status.isGreaterThanOrEqualSent()) {
            return false;
        }
        File file = this.quotePDFService.getQuotePdfFile(username, quote.id);
        this.batchSendQuoteEmail(file, quote);
        return true;
    }
}
