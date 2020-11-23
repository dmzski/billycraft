package com.coco.back.main.dtos;

import io.quarkus.runtime.annotations.RegisterForReflection;

import java.io.Serializable;

@RegisterForReflection
public class SearchResultDTO implements Serializable {
    public String description;
    public String id;

    public SearchResultDTO() {

    }

    public SearchResultDTO(String id, String description) {
        this.description = description;
        this.id = id;
    }
}
