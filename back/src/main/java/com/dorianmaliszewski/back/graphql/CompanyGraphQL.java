package com.dorianmaliszewski.back.graphql;

import com.dorianmaliszewski.back.models.Company;
import com.dorianmaliszewski.back.services.CompanyService;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.inject.Inject;

@GraphQLApi
@Authenticated
public class CompanyGraphQL {

    @Inject
    CompanyService companyService;

    @Claim(standard = Claims.preferred_username)
    String username;

    @Query("myCompany")
    @Description("Find my company")
    public Company findMyCompany() {
        return this.companyService.findMyCompany(username);
    }

    @Mutation
    @Description("Create my company")
    public Company createCompany(Company company) {
        return this.companyService.createCompany(username, company);
    }

    @Mutation
    @Description("Update my company")
    public Company updateCompany(Company company) {
        return this.companyService.updateCompany(username, company);
    }
}

