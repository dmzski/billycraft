package com.coco.back.main.models;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;

import javax.persistence.*;

import com.coco.back.main.enums.LineTypeEnum;

@RegisterForReflection
@Entity
@Table(name = "com_product")
public class Product extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Enumerated(value = EnumType.STRING)
    public LineTypeEnum type;
    public String name;
    public String description;
    public Double price;

    @ElementCollection
    @CollectionTable(name = "com_product_keywords", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "keyword")
    public List<String> keywords;

    public Long companyId;
}
