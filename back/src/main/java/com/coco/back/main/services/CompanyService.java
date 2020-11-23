package com.coco.back.main.services;

import com.coco.back.main.models.Company;
import com.coco.back.main.models.User;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.ForbiddenException;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@ApplicationScoped
public class CompanyService {

    @ConfigProperty(name = "compta.upload-dir", defaultValue = "/tmp")
    String uploadDir;

    @Inject
    UserService userService;

    @Inject
    QuoteCustomizationService quoteCustomizationService;

    @ConfigProperty(name = "compta.base-url", defaultValue = "http://localhost:8080/compta")
    String baseUrl;

    public Company findMyCompany(String userId) {
        return Company.find("createdBy = ?1", userId).firstResult();
    }

    @Transactional
    public Company createCompany(String userId, Company company) {
        User user = this.userService.findByEmail(userId);
        if (user == null) throw new EntityNotFoundException();

        if (user.company != null) {
            throw new ClientErrorException("User already have a company", Response.Status.CONFLICT);
        }

        company.createdBy = userId;
        company.persist();

        user.company = company;
        user.persist();

        this.quoteCustomizationService.initQuoteCustomization(company);

        return company;
    }

    @Transactional
    public Company updateCompany(String userId, Company newCompany) {
        Company company = (Company) Company.findByIdOptional(newCompany.id).orElseThrow(EntityNotFoundException::new);
        if (!company.createdBy.equals(userId)) {
            throw new ForbiddenException("You can't do that");
        }
        company.address = newCompany.address;
        company.logo = newCompany.logo;
        company.phoneNumber = newCompany.phoneNumber;
        company.city = newCompany.city;
        company.postalCode = newCompany.postalCode;
        company.siret = newCompany.siret;
        company.email = newCompany.email;
        company.name = newCompany.name;
        company.persist();
        return company;
    }


    public String uploadLogo(String username, byte[] logo) {
        Company company = (Company) Company.find("createdBy = ?1", username).firstResultOptional().orElseThrow();

        if (logo == null) {
            System.out.println("Logo is null");
            return null;
        }
        //constructs upload file path
        String fileName = uploadDir + "/" + company.id + "/logo.png";
        try {
            File f = new File(fileName);

            f.getParentFile().mkdirs();
            f.createNewFile();
            Files.write(f.toPath(), logo);
            return  baseUrl + "/uploads/logo/" + company.id;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public byte[] getLogo(Long companyId) {
        File file = new File(uploadDir + "/" + companyId + "/logo.png");
        if (!file.exists()) {
            return null;
        }
        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
