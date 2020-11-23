package com.coco.back.main.graphql;

import com.coco.back.main.models.Quote;
import com.coco.back.main.services.QuoteService;
import com.coco.back.main.enums.StatusEnum;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.Claim;

import javax.inject.Inject;
import java.util.List;

@GraphQLApi
@Authenticated
public class QuoteGraphQL {

    @Inject
    QuoteService quoteService;

    @Claim("preferred_username")
    String username;

    @Query("allQuotes")
    @Description("Get all quotes")
    public List<Quote> getAllQuotes () {
        return this.quoteService.getAllQuotes(username);
    }

    @Query("allQuotesNotArchived")
    @Description("Get all quotes without status ARCHIVED")
    public List<Quote> getAllQuotesNotArchived () {
        return this.quoteService.getAllQuotesNotArchived(username);
    }

    @Query("allQuotesArchived")
    @Description("Get all quotes without status ARCHIVED")
    public List<Quote> getAllQuotesArchived () {
        return this.quoteService.getAllQuotesArchived(username);
    }

    @Query("quoteById")
    @Description("Get quote by id")
    public Quote getQuoteById(String id) {
        return this.quoteService.getQuoteById(username, id);
    }

    @Mutation("createQuote")
    @Description("Create quote")
    public Quote createQuote(Quote quote) {
        return this.quoteService.createQuote(username, quote);
    }


    @Mutation("updateQuote")
    @Description("Update quote")
    public Quote updateQuote(Quote quote) {
        return this.quoteService.updateQuote(username, quote.id, quote);
    }

    @Mutation("updateQuoteStatus")
    @Description("Change the quote's status")
    public Quote updateQuoteStatus(String id, StatusEnum statusEnum) {
        return this.quoteService.updateQuoteStatus(username, id, statusEnum);
    }
}
