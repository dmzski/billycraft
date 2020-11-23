package com.coco.back.main.graphql;

import com.coco.back.main.models.BillEmailCustomization;
import com.coco.back.main.services.BillEmailCustomizationService;
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
public class BillEmailCustomizationGraphQL {

    @Claim(standard = Claims.preferred_username)
    String username;

    @Inject
    BillEmailCustomizationService billEmailCustomizationService;

    @Query
    @Description("My bill email customization")
    public BillEmailCustomization getMyBillEmailCustomization() {
        return this.billEmailCustomizationService.findBillEmailCustomizationCreatedBy(username);
    }

    @Mutation
    @Description("update the bill email customization")
    public BillEmailCustomization updateMyBillEmailCustomization(BillEmailCustomization billEmailCustomization) {
        return this.billEmailCustomizationService.saveBillEmailCustomization(username, billEmailCustomization);
    }
}
