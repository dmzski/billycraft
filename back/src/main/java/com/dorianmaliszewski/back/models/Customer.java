package com.dorianmaliszewski.back.models;




import com.dorianmaliszewski.back.deserializers.CustomLocalDateTimeDeserializer;
import com.dorianmaliszewski.back.serializers.CustomLocalDateTimeSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "com_customer")
@RegisterForReflection
public class Customer extends BaseEntity {
    public String name;
    public String contact;
    public String phoneNumber;
    public String city;
    public String postalCode;
    public String address;
    public String email;

    @OneToMany(mappedBy = "customer")
    public List<Quote> quotes = new ArrayList<>();

    @CreationTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime updatedAt;

    @Version
    public Integer version;

    @JoinColumn(name = "company_id")
    @ManyToOne
    public Company company;
}
