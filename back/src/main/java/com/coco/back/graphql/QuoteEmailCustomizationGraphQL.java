package com.coco.back.graphql;

import com.coco.back.models.QuoteEmailCustomization;
import com.coco.back.services.QuoteEmailCustomizationService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.inject.Inject;

@GraphQLApi
@Authenticated
public class QuoteEmailCustomizationGraphQL {

    @Claim(standard = Claims.preferred_username)
    String username;

    @Inject
    QuoteEmailCustomizationService quoteEmailCustomizationService;

    @Query
    @Description("My quote email customization")
    public QuoteEmailCustomization getMyQuoteEmailCustomization() {
        return this.quoteEmailCustomizationService.findQuoteEmailCustomizationCreatedBy(username);
    }

    @Mutation
    @Description("update the quote email customization")
    public QuoteEmailCustomization updateMyQuoteEmailCustomization(QuoteEmailCustomization quoteEmailCustomization) {
        return this.quoteEmailCustomizationService.saveQuoteEmailCustomization(username, quoteEmailCustomization);
    }
}
