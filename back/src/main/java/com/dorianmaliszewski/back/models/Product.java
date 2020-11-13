package com.dorianmaliszewski.back.models;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@RegisterForReflection
@Entity
@Table(name = "com_product")
public class Product extends PanacheEntity {

    public String description;
    public Double price;

    public Long companyId;
}
