package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.models.Company;
import com.dorianmaliszewski.back.models.QuoteCustomization;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.ForbiddenException;
import java.util.Optional;

@ApplicationScoped
public class QuoteCustomizationService {

    @Transactional
    public QuoteCustomization findQuoteCustomizationCreatedBy(String email) {
        Company company = Company.find("createdBy = ?1", email).singleResult();
        if (company != null) {
            System.out.println("Company id : " + company.id);

            Optional<QuoteCustomization> optionalQuoteCustomization = QuoteCustomization.find("company_id = ?1", company.id).firstResultOptional();
            if (optionalQuoteCustomization.isEmpty()) {
                QuoteCustomization quoteCustomization = new QuoteCustomization(company);
                quoteCustomization.persistAndFlush();
                return quoteCustomization;
            }
            return optionalQuoteCustomization.get();
        } else {
            throw new ForbiddenException();
        }
    }

    @Transactional
    public QuoteCustomization initQuoteCustomization(Company company) {
        QuoteCustomization quoteCustomization = new QuoteCustomization(company);
        quoteCustomization.persistAndFlush();
        return quoteCustomization;
    }

    @Transactional
    public QuoteCustomization updateQuoteCustomizationCreatedBy(String username, QuoteCustomization newQuoteCustomization) {
        Company company = Company.find("createdBy = ?1", username).singleResult();
        if (company != null) {
            QuoteCustomization quoteCustomization = (QuoteCustomization) QuoteCustomization.find("company_id = ?1", company.id).firstResultOptional().orElse(new QuoteCustomization(company));
            quoteCustomization.afterInformation = newQuoteCustomization.afterInformation;
            quoteCustomization.afterTable = newQuoteCustomization.afterTable;
            quoteCustomization.footer = newQuoteCustomization.footer;
            quoteCustomization.persist();
            return quoteCustomization;
        } else {
            throw new ForbiddenException();
        }
    }
}
