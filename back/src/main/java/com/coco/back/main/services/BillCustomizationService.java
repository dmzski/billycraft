package com.coco.back.main.services;

import com.coco.back.main.models.BillCustomization;
import com.coco.back.main.models.Company;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.ForbiddenException;
import java.util.Optional;

@ApplicationScoped
public class BillCustomizationService {

    @Transactional
    public BillCustomization findBillCustomizationCreatedBy(String email) {
        Company company = Company.find("createdBy = ?1", email).singleResult();
        if (company != null) {
            Optional<BillCustomization> optionalBillCustomization = BillCustomization.find("company_id = ?1", company.id).firstResultOptional();
            if (optionalBillCustomization.isEmpty()) {
                BillCustomization billCustomization = new BillCustomization(company);
                billCustomization.persistAndFlush();
                return billCustomization;
            }
            return optionalBillCustomization.get();
        } else {
            throw new ForbiddenException();
        }
    }

    @Transactional
    public BillCustomization initBillCustomization(Company company) {
        BillCustomization billCustomization = new BillCustomization(company);
        billCustomization.persistAndFlush();
        return billCustomization;
    }

    @Transactional
    public BillCustomization updateBillCustomizationCreatedBy(String username, BillCustomization newBillCustomization) {
        Company company = Company.find("createdBy = ?1", username).singleResult();
        if (company != null) {
            BillCustomization billCustomization = (BillCustomization) BillCustomization.find("company_id = ?1", company.id).firstResultOptional().orElse(new BillCustomization(company));
            billCustomization.afterTable = newBillCustomization.afterTable;
            billCustomization.footer = newBillCustomization.footer;
            billCustomization.displayCompanyEmail = newBillCustomization.displayCompanyEmail;
            billCustomization.displayCompanyPhoneNumber = newBillCustomization.displayCompanyPhoneNumber;
            billCustomization.displayCustomerEmail = newBillCustomization.displayCustomerEmail;
            billCustomization.displayCustomerPhoneNumber = newBillCustomization.displayCustomerPhoneNumber;
            billCustomization.mainColor = newBillCustomization.mainColor;
            billCustomization.persist();
            return billCustomization;
        } else {
            throw new ForbiddenException();
        }
    }
}
