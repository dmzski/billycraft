package com.coco.back.main.models;

import com.coco.back.main.deserializers.CustomInstantDeserializer;
import com.coco.back.main.enums.StatusEnum;
import com.coco.back.main.generators.QuoteIdGenerator;
import com.coco.back.main.serializers.CustomInstantSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.eclipse.microprofile.graphql.Ignore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "com_quote")
@RegisterForReflection
public class Quote extends PanacheEntityBase {

    @Id
    @GeneratedValue(generator = QuoteIdGenerator.GENERATOR_NAME)
    @GenericGenerator(name = QuoteIdGenerator.GENERATOR_NAME, strategy = "com.coco.back.main.generators.QuoteIdGenerator")
    public String id;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    public Customer customer;

    public String title;

    public Integer tva;

    @CreationTimestamp
    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant updatedAt;
    @Version
    public Integer version;
    @Enumerated(EnumType.STRING)
    public StatusEnum status;

    @OneToMany(mappedBy = "quote", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    public List<QuoteLine> lines = new ArrayList<>();

    @Ignore
    public String createdBy;

    @Column(name = "company_id")
    public Long companyId;

    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant sentAt;

    public String fileName;

}
