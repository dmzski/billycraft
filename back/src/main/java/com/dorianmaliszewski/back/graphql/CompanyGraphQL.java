package com.dorianmaliszewski.back.graphql;

import com.dorianmaliszewski.back.models.Company;
import com.dorianmaliszewski.back.services.CompanyService;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

import javax.inject.Inject;

@GraphQLApi
@Authenticated
public class CompanyGraphQL {

    @Inject
    CompanyService companyService;

    @Inject
    SecurityIdentity identity;

    @Query("myCompany")
    @Description("Find my company")
    public Company findMyCompany() {
        return this.companyService.findMyCompany(identity.getPrincipal().getName());
    }

    @Mutation
    @Description("Create my company")
    public Company createCompany(Company company) {
        return this.companyService.createCompany(identity.getPrincipal().getName(), company);
    }

    @Mutation
    @Description("Update my company")
    public Company updateCompany(Company company) {
        return this.companyService.updateCompany(identity.getPrincipal().getName(), company);
    }
}

