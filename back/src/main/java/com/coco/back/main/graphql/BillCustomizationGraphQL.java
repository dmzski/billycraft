package com.coco.back.main.graphql;

import com.coco.back.main.models.BillCustomization;
import com.coco.back.main.services.BillCustomizationService;
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
public class BillCustomizationGraphQL {

    @Claim(standard = Claims.preferred_username)
    String username;

    @Inject
    BillCustomizationService billCustomizationService;

    @Query
    @Description("My quote customization")
    public BillCustomization getMyBillCustomization() {
        return this.billCustomizationService.findBillCustomizationCreatedBy(username);
    }

    @Mutation
    @Description("update the quote customization")
    public BillCustomization updateMyBillCustomization(BillCustomization billCustomization) {
        return this.billCustomizationService.updateBillCustomizationCreatedBy(username, billCustomization);
    }
}
