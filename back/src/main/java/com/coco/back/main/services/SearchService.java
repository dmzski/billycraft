package com.coco.back.main.services;

import com.coco.back.main.dtos.SearchResultDTO;
import com.coco.back.main.dtos.SearchDTO;
import com.coco.back.main.enums.SearchCategoryEnum;
import com.coco.back.main.models.Bill;
import com.coco.back.main.models.Company;
import com.coco.back.main.models.Customer;
import com.coco.back.main.models.Quote;

import javax.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class SearchService {


    public List<SearchDTO> searchAll(String username, String query) {
        List<SearchDTO> dtos = new ArrayList<>();

        Company company = (Company) Company.find("id = (SELECT u.company.id from User u WHERE u.email = ?1)", username).firstResultOptional().orElseThrow();
        String normalizedQuery = "%" + query.toLowerCase().replaceAll(" ", "") + "%";
        List<Quote> quotes = Quote.list("company_id = ?1 AND (translate(lower(title), ' ', '') LIKE ?2 OR lower(id) LIKE ?2)", company.id, normalizedQuery);
        List<Customer> customers = Customer.list("company_id = ?1 AND (translate(lower(name), ' ', '') LIKE ?2 OR cast(id as string) LIKE ?2)", company.id, normalizedQuery);
        List<Bill> bills = Bill.list("company_id = ?1 AND (translate(lower(title), ' ', '') LIKE ?2 OR lower(id) LIKE ?2)", company.id, normalizedQuery);

        if (bills.size() > 0) {
            dtos.add(new SearchDTO(SearchCategoryEnum.BILL, bills.stream().map(bill -> new SearchResultDTO(bill.id, bill.title)).collect(Collectors.toList())));
        }
        if (quotes.size() > 0) {
            dtos.add(new SearchDTO(SearchCategoryEnum.QUOTE, quotes.stream().map(quote -> new SearchResultDTO(quote.id, quote.title)).collect(Collectors.toList())));
        }
        if (customers.size() > 0) {
            dtos.add(new SearchDTO(SearchCategoryEnum.CUSTOMER, customers.stream().map(customer -> new SearchResultDTO(String.valueOf(customer.id), customer.name)).collect(Collectors.toList())));
        }

        return dtos;
    }
}
