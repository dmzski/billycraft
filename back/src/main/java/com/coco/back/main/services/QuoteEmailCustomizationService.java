package com.coco.back.main.services;

import com.coco.back.main.models.Company;
import com.coco.back.main.models.QuoteCustomization;
import com.coco.back.main.models.QuoteEmailCustomization;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.ForbiddenException;
import javax.ws.rs.NotFoundException;
import java.util.Optional;

@ApplicationScoped
public class QuoteEmailCustomizationService {

    @Transactional
    public QuoteEmailCustomization saveQuoteEmailCustomization(String username, QuoteEmailCustomization newQuoteEmailCustomization) {
        QuoteEmailCustomization quoteEmailCustomization = (QuoteEmailCustomization) QuoteEmailCustomization.find("company_id = (SELECT u.company.id FROM User u WHERE u.email = ?1)", username).singleResultOptional().orElse(new QuoteCustomization());
        quoteEmailCustomization.body = newQuoteEmailCustomization.body;
        quoteEmailCustomization.object = newQuoteEmailCustomization.object;
        quoteEmailCustomization.sendAutomatically = newQuoteEmailCustomization.sendAutomatically;
        if (quoteEmailCustomization.company == null) {
            quoteEmailCustomization.company = (Company) Company.find("id = (SELECT u.company.id FROM User u WHERE u.email = ?1)", username).singleResultOptional().orElseThrow(NotFoundException::new);
        }

        quoteEmailCustomization.persist();

        return quoteEmailCustomization;
    }

    @Transactional
    public QuoteEmailCustomization findQuoteEmailCustomizationCreatedBy(String email) {
        Company company = Company.find("id = (SELECT u.company.id FROM User u WHERE u.email = ?1)", email).singleResult();
        if (company != null) {
            Optional<QuoteEmailCustomization> optionalQuoteEmailCustomization = QuoteEmailCustomization.find("company_id = ?1", company.id).firstResultOptional();
            if (optionalQuoteEmailCustomization.isEmpty()) {
                QuoteEmailCustomization quoteEmailCustomization = new QuoteEmailCustomization(company);
                quoteEmailCustomization.persistAndFlush();
                return quoteEmailCustomization;
            }
            return optionalQuoteEmailCustomization.get();
        } else {
            throw new ForbiddenException();
        }
    }
}
