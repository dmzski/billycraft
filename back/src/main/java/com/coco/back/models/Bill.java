package com.coco.back.models;

import com.coco.back.enums.BillStatusEnum;
import com.coco.back.generators.BillIdGenerator;
import com.coco.back.deserializers.CustomInstantDeserializer;
import com.coco.back.serializers.CustomInstantSerializer;
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
@Table(name = "com_bill")
@RegisterForReflection
public class Bill extends PanacheEntityBase {

    @Id
    @GeneratedValue(generator = BillIdGenerator.GENERATOR_NAME)
    @GenericGenerator(name = BillIdGenerator.GENERATOR_NAME, strategy = "com.coco.back.generators.BillIdGenerator")
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
    public BillStatusEnum status;

    @OneToMany(mappedBy = "bill", orphanRemoval = true, cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    public List<BillLine> lines = new ArrayList<>();

    @Ignore
    public String createdBy;

    @Column(name = "company_id")
    public Long companyId;

    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant sentAt;

    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant paidAt;

    public String fileName;

    public String quoteId;

}
