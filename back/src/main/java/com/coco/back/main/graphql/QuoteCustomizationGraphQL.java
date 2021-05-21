package com.coco.back.main.graphql;

import com.coco.back.main.models.QuoteCustomization;
import com.coco.back.main.services.QuoteCustomizationService;
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
public class QuoteCustomizationGraphQL {

    @Claim(standard = Claims.preferred_username)
    String username;

    @Inject
    QuoteCustomizationService quoteCustomizationService;

    @Query
    @Description("My quote customization")
    public QuoteCustomization getMyQuoteCustomization() {
        return this.quoteCustomizationService.findQuoteCustomizationCreatedBy(username);
    }

    @Mutation
    @Description("update the quote customization")
    public QuoteCustomization updateMyQuoteCustomization(QuoteCustomization quoteCustomization) {
        return this.quoteCustomizationService.updateQuoteCustomizationCreatedBy(username, quoteCustomization);
    }
}
