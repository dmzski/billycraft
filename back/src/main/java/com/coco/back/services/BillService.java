package com.coco.back.services;

import com.coco.back.models.*;
import com.coco.back.enums.BillStatusEnum;
import com.coco.back.enums.StatusEnum;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@ApplicationScoped
public class BillService {

    @Inject
    EmailService emailService;

    public List<Bill> getAllBills(String username) {
        return Bill.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1)", username);
    }

    public List<Bill> getAllBillsNotArchived(String username) {
        return Bill.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) and status != 'ARCHIVED'", username);
    }

    public Bill getBillById(String username, String id) {
        return Bill.find("id = ?1 AND company_id = (SELECT u.company.id from User u WHERE u.email = ?2)", id, username).singleResult();
    }

    @Transactional
    public Bill createBill(String username, Bill bill) {
        User user = (User) User.findByIdOptional(username).orElseThrow();
        bill.customer = Customer.findById(bill.customer.id);
        AtomicInteger index = new AtomicInteger();
        bill.lines.forEach(billLine -> {
            billLine.line = index.getAndIncrement();
            billLine.bill = bill;
        });
        bill.status = BillStatusEnum.DRAFT;
        bill.companyId = user.company.id;
        bill.createdBy = username;
        bill.persist();
        return bill;
    }

    @Transactional
    public Bill createBillFromQuote(String username, String quoteId) {
        Quote quote = (Quote) Quote.find("company_id = (SELECT u.company.id from User u WHERE email = ?1) AND id = ?2", username, quoteId).firstResultOptional().orElseThrow();
        quote.status = StatusEnum.ARCHIVED;
        Bill bill = new Bill();
        bill.title = quote.title;
        bill.tva = quote.tva;
        bill.customer = quote.customer;
        quote.lines.forEach(quoteLine -> bill.lines.add(new BillLine(bill, quoteLine)));
        bill.status = BillStatusEnum.DRAFT;
        bill.companyId = quote.companyId;
        bill.createdBy = username;
        bill.quoteId = quote.id;
        bill.persist();
        quote.persist();

        return bill;
    }


    @Transactional
    public Bill updateBill(String username, String id, Bill newBill) {
        Bill bill = this.getBillById(username, id);
        bill.status = BillStatusEnum.DRAFT;
        bill.tva = newBill.tva;
        bill.title = newBill.title;
        bill.lines.clear();
        bill.persistAndFlush();

        AtomicInteger index = new AtomicInteger();
        bill.lines.addAll(newBill.lines.stream().peek(billLine -> {
            billLine.line = index.getAndIncrement();
            billLine.bill = bill;
        }).collect(Collectors.toList()));

        bill.persist();
        return bill;
    }

    @Transactional
    public Bill updateBillStatus(String username, String id, BillStatusEnum newStatus) {
        Bill bill = this.getBillById(username, id);

        // If the bill was refused and user want to put in draft again
        if (bill.status != null && bill.status.equals(BillStatusEnum.REFUSED) && (newStatus == null || newStatus.equals(BillStatusEnum.DRAFT))){
            bill.sentAt = null;
        }

        bill.status = newStatus != null ? newStatus : BillStatusEnum.DRAFT;

        // If the status is not Sent or More
        if (bill.status.isGreaterThanOrEqualSent() && bill.sentAt == null) {
            bill.sentAt = Instant.now();
            bill.persist();
            BillEmailCustomization billEmailCustomization = BillEmailCustomization.find("company_id = ?1", bill.companyId).singleResult();
            if (billEmailCustomization.sendAutomatically) {
                this.emailService.sendBillEmailWithBill(username, bill);
            }
        }

        if (bill.status.isPaid() && bill.paidAt == null) {
            bill.paidAt = Instant.now();
        }


        bill.persist();
        return bill;
    }

    public List<Bill> getAllBillsArchived(String username) {
        return Bill.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) and status = 'ARCHIVED'", username);
    }

    @Transactional
    public Bill updateBillPaidAt(String username, String id, Instant paidAt) {
        Bill bill = this.getBillById(username, id);

        if (bill.status.isPaid()) {
            bill.paidAt = paidAt;
            bill.persist();
        }

        return bill;
    }
}
