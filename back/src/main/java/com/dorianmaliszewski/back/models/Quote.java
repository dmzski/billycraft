package com.dorianmaliszewski.back.models;

import com.dorianmaliszewski.back.generators.QuoteIdGenerator;
import com.dorianmaliszewski.back.deserializers.CustomLocalDateTimeDeserializer;
import com.dorianmaliszewski.back.enums.StatusEnum;
import com.dorianmaliszewski.back.serializers.CustomLocalDateTimeSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;
import io.smallrye.graphql.api.Scalar;
import io.smallrye.graphql.api.ToScalar;
import org.eclipse.microprofile.graphql.Ignore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "com_quote")
@RegisterForReflection
public class Quote extends PanacheEntityBase {

    @Id
    @GeneratedValue(generator = QuoteIdGenerator.GENERATOR_NAME)
    @GenericGenerator(name = QuoteIdGenerator.GENERATOR_NAME, strategy = "com.dorianmaliszewski.back.generators.QuoteIdGenerator")
    public String id;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    public Customer customer;

    public String title;

    public Integer tva;

    @CreationTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    @ToScalar(Scalar.DateTime.class)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime updatedAt;
    @Version
    public Integer version;
    @Enumerated(EnumType.STRING)
    public StatusEnum status;

    @OneToMany(mappedBy = "quote", orphanRemoval = true, cascade = CascadeType.ALL)
    public List<QuoteLine> lines = new ArrayList<>();

    @Ignore
    public String createdBy;

    @Column(name = "company_id")
    public Long companyId;

    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime sentAt;

    public String fileName;

}
