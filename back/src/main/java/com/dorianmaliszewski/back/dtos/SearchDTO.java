package com.dorianmaliszewski.back.dtos;

import com.dorianmaliszewski.back.enums.SearchCategoryEnum;
import io.quarkus.runtime.annotations.RegisterForReflection;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class SearchDTO implements Serializable {
    public SearchCategoryEnum category;
    public List<SearchResultDTO> results = new ArrayList<>();

    public SearchDTO() {

    }

    public SearchDTO(SearchCategoryEnum searchCategoryEnum, List<SearchResultDTO> results) {
        this.category = searchCategoryEnum;
        this.results = results;
    }

}
