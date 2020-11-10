package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.dtos.SearchDTO;
import com.dorianmaliszewski.back.dtos.SearchResultDTO;
import com.dorianmaliszewski.back.enums.SearchCategoryEnum;
import com.dorianmaliszewski.back.models.Bill;
import com.dorianmaliszewski.back.models.Company;
import com.dorianmaliszewski.back.models.Customer;
import com.dorianmaliszewski.back.models.Quote;

import javax.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class SearchService {


    public List<SearchDTO> searchAll(String username, String query) {
        List<SearchDTO> dtos = new ArrayList<>();

        Company company = (Company) Company.find("id = (SELECT u.company.id from User u WHERE u.email = ?1)", username).firstResultOptional().orElseThrow();

        List<Quote> quotes = Quote.list("company_id = ?1", company.id);
        List<Customer> customers = Customer.list("company_id = ?1", company.id);
        List<Bill> bills = Bill.list("company_id = ?1", company.id);

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
