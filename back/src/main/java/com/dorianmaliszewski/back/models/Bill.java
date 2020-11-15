package com.dorianmaliszewski.back.models;

import com.dorianmaliszewski.back.deserializers.CustomLocalDateTimeDeserializer;
import com.dorianmaliszewski.back.enums.BillStatusEnum;
import com.dorianmaliszewski.back.generators.BillIdGenerator;
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
@Table(name = "com_bill")
@RegisterForReflection
public class Bill extends PanacheEntityBase {

    @Id
    @GeneratedValue(generator = BillIdGenerator.GENERATOR_NAME)
    @GenericGenerator(name = BillIdGenerator.GENERATOR_NAME, strategy = "com.dorianmaliszewski.back.generators.BillIdGenerator")
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
    public BillStatusEnum status;

    @OneToMany(mappedBy = "bill", orphanRemoval = true, cascade = CascadeType.ALL)
    public List<BillLine> lines = new ArrayList<>();

    @Ignore
    public String createdBy;

    @Column(name = "company_id")
    public Long companyId;

    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime sentAt;

    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime paidAt;

    public String fileName;

    public String quoteId;

}
