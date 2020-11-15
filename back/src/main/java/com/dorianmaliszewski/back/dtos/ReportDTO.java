package com.dorianmaliszewski.back.dtos;

import com.dorianmaliszewski.back.deserializers.CustomLocalDateTimeDeserializer;
import com.dorianmaliszewski.back.serializers.CustomLocalDateTimeSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.runtime.annotations.RegisterForReflection;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class ReportDTO implements Serializable {

    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime startDate;

    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime endDate;


    public Double sales;
    public Double articleSales;
    public Double serviceSales;
    public Double otherSales;
    public List<ReportDTO> details = new ArrayList<>();

}
