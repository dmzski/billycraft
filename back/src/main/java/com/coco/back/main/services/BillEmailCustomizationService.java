package com.coco.back.main.services;

import com.coco.back.main.models.Company;
import com.coco.back.main.models.QuoteCustomization;
import com.coco.back.main.models.BillEmailCustomization;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.ForbiddenException;
import javax.ws.rs.NotFoundException;
import java.util.Optional;

@ApplicationScoped
public class BillEmailCustomizationService {

    @Transactional
    public BillEmailCustomization saveBillEmailCustomization(String username, BillEmailCustomization newBillEmailCustomization) {
        BillEmailCustomization billEmailCustomization = (BillEmailCustomization) BillEmailCustomization.find("company_id = (SELECT u.company.id FROM User u WHERE u.email = ?1)", username).singleResultOptional().orElse(new QuoteCustomization());
        billEmailCustomization.body = newBillEmailCustomization.body;
        billEmailCustomization.object = newBillEmailCustomization.object;
        billEmailCustomization.sendAutomatically = newBillEmailCustomization.sendAutomatically;
        if (billEmailCustomization.company == null) {
            billEmailCustomization.company = (Company) Company.find("id = (SELECT u.company.id FROM User u WHERE u.email = ?1)", username).singleResultOptional().orElseThrow(NotFoundException::new);
        }

        billEmailCustomization.persist();

        return billEmailCustomization;
    }

    @Transactional
    public BillEmailCustomization findBillEmailCustomizationCreatedBy(String email) {
        Company company = Company.find("createdBy = ?1", email).singleResult();
        if (company != null) {
            Optional<BillEmailCustomization> optionalBillEmailCustomization = BillEmailCustomization.find("company_id = ?1", company.id).firstResultOptional();
            if (optionalBillEmailCustomization.isEmpty()) {
                BillEmailCustomization billEmailCustomization = new BillEmailCustomization(company);
                billEmailCustomization.persistAndFlush();
                return billEmailCustomization;
            }
            return optionalBillEmailCustomization.get();
        } else {
            throw new ForbiddenException();
        }
    }
}
