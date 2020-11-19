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
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "com_company")
@RegisterForReflection
public class Company extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String name;
    public String city;
    public String address;
    public String postalCode;
    public String phoneNumber;
    public String logo;
    public String siret;
    public String email;

    @Version
    public Integer version;

    public String createdBy;

    @CreationTimestamp
    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant updatedAt;

    @OneToOne(mappedBy = "company", cascade = {CascadeType.REMOVE}, orphanRemoval = true)
    public QuoteCustomization quoteCustomization;

    @OneToOne(mappedBy = "company", cascade = {CascadeType.REMOVE}, orphanRemoval = true)
    public BillCustomization billCustomization;

    @OneToOne(mappedBy = "company", cascade = {CascadeType.REMOVE}, orphanRemoval = true)
    public BillEmailCustomization billEmailCustomization;

    @OneToOne(mappedBy = "company", cascade = {CascadeType.REMOVE}, orphanRemoval = true)
    public QuoteEmailCustomization quoteEmailCustomization;

    @OneToMany(mappedBy = "company")
    public List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    public List<Customer> customers = new ArrayList<>();
}
