package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.enums.StatusEnum;
import com.dorianmaliszewski.back.models.Customer;
import com.dorianmaliszewski.back.models.Quote;
import com.dorianmaliszewski.back.models.User;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.ws.rs.NotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class QuoteService {

    public List<Quote> getAllQuotes(String username) {
        return Quote.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1)", username);
    }

    public List<Quote> getAllQuotesNotArchived(String username) {
        return Quote.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) and status != 'ARCHIVED'", username);
    }

    public Quote getQuoteById(String username, String id) {
        return Quote.find("id = ?1 AND company_id = (SELECT u.company.id from User u WHERE u.email = ?2)", id, username).singleResult();
    }

    @Transactional
    public Quote createQuote(String username, Quote quote) {
        User user = (User) User.findByIdOptional(username).orElseThrow();
        quote.customer = Customer.findById(quote.customer.id);
        quote.lines.forEach(quoteLine -> quoteLine.quote = quote);
        quote.status = StatusEnum.DRAFT;
        quote.companyId = user.company.id;
        quote.createdBy = username;
        quote.persist();
        return quote;
    }

    @Transactional
    public Quote updateQuote(String username, String id, Quote newQuote) {
        Quote quote = this.getQuoteById(username, id);
        quote.status = StatusEnum.DRAFT;
        quote.title = newQuote.title;
        quote.tva = newQuote.tva;
        quote.lines.clear();
        quote.persistAndFlush();
        quote.lines.addAll(newQuote.lines);
        quote.lines.forEach(quoteLine -> quoteLine.quote = quote);
        quote.persist();
        return quote;
    }

    @Transactional
    public Quote updateQuoteStatus(String username, String id, StatusEnum newStatus) {
        Quote quote = this.getQuoteById(username, id);

        // If the quote was refused and user want to put in draft again
        if (quote.status != null && quote.status.equals(StatusEnum.REFUSED) && (newStatus == null || newStatus.equals(StatusEnum.DRAFT))){
            quote.sentAt = null;
        }

        quote.status = newStatus != null ? newStatus : StatusEnum.DRAFT;

        // If the status is not Sent or More
        if (quote.status.isGreaterThanOrEqualSent() && quote.sentAt == null) {
            quote.sentAt = LocalDateTime.now();
        }

        quote.persist();
        return quote;
    }

    public List<Quote> getAllQuotesArchived(String username) {
        return Quote.list("company_id = (SELECT u.company.id from User u WHERE u.email = ?1) and status = 'ARCHIVED'", username);
    }
}
