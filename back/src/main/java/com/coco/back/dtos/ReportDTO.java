package com.coco.back.dtos;

import com.coco.back.deserializers.CustomInstantDeserializer;
import com.coco.back.serializers.CustomInstantSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.runtime.annotations.RegisterForReflection;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class ReportDTO implements Serializable {

    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant startDate;

    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant endDate;


    public Double sales;
    public Double articleSales;
    public Double serviceSales;
    public Double otherSales;
    public List<ReportDTO> details = new ArrayList<>();

}
