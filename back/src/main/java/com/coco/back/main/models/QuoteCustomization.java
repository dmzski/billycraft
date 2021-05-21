package com.coco.back.main.models;

import com.coco.back.main.deserializers.CustomInstantDeserializer;
import com.coco.back.main.serializers.CustomInstantSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.Instant;

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

    public String afterTable;
    public String footer;
    public String mainColor;

    public Boolean displayCompanyEmail;
    public Boolean displayCompanyPhoneNumber;
    public Boolean displayCustomerEmail;
    public Boolean displayCustomerPhoneNumber;

    @Version
    public Integer version;

    @CreationTimestamp
    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant updatedAt;

    public QuoteCustomization(Company company) {
        this.company = company;
    }

    public QuoteCustomization () {

    }
}
