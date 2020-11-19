package com.coco.back.models;

import com.coco.back.deserializers.CustomInstantDeserializer;
import com.coco.back.serializers.CustomInstantSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "com_bill_customization")
@RegisterForReflection
public class BillCustomization extends PanacheEntityBase {
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

    public BillCustomization(Company company) {
        this.company = company;
    }

    public BillCustomization() {

    }
}
