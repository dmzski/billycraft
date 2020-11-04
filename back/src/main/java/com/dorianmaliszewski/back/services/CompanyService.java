package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.models.Company;
import com.dorianmaliszewski.back.models.User;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import javax.ws.rs.ForbiddenException;

@ApplicationScoped
public class CompanyService {

    @Inject
    UserService userService;

    public Company findMyCompany(String userId) {
        return Company.find("createdBy = ?1", userId).firstResult();
    }

    @Transactional
    public Company createCompagny(String userId, Company company) {
        User user = this.userService.findByEmail(userId);
        if (user == null) throw new EntityNotFoundException();

        company.createdBy = userId;
        company.persist();

        user.company = company;
        user.persist();

        return company;
    }

    @Transactional
    public Company updateCompagny(String userId, Company newCompany) {
        Company company = (Company) Company.findByIdOptional(newCompany.id).orElseThrow(EntityExistsException::new);
        if (!company.createdBy.equals(userId)) {
            throw new ForbiddenException("You can't do that");
        }
        company.address = newCompany.address;
        company.logo = newCompany.logo;
        company.phoneNumber = newCompany.phoneNumber;
        company.city = newCompany.city;
        company.postalCode = newCompany.postalCode;
        company.siret = newCompany.siret;
        company.persist();
        return company;
    }
}
