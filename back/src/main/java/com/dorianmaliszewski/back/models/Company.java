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

    @Version
    public Integer version;

    public String createdBy;

    @CreationTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime updatedAt;

    @OneToOne(mappedBy = "company", cascade = {CascadeType.REMOVE}, orphanRemoval = true)
    public QuoteCustomization quoteCustomization;

    @OneToMany(mappedBy = "company")
    public List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    public List<Customer> customers = new ArrayList<>();
}
