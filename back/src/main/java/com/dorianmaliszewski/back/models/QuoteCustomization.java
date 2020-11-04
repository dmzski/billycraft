package com.dorianmaliszewski.back.models;

import com.dorianmaliszewski.back.deserializers.CustomLocalDateTimeDeserializer;
import com.dorianmaliszewski.back.serializers.CustomLocalDateTimeSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "com_quote_customization")
@RegisterForReflection
public class QuoteCustomization extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @JoinColumn(name = "company_id", referencedColumnName = "id")
    @OneToOne
    public Company company;

    public String afterInformation;
    public String afterTable;
    public String footer;

    @Version
    public Integer version;

    @CreationTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime updatedAt;

    public QuoteCustomization(Company company) {
        this.company = company;
    }

    public QuoteCustomization () {

    }
}
