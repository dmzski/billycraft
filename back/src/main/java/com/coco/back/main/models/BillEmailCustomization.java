package com.coco.back.main.models;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.persistence.*;

@Table(name = "com_bill_email_customization")
@Entity
@RegisterForReflection
public class BillEmailCustomization extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String body;
    public String object;
    public boolean sendAutomatically;

    @OneToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    public Company company;

    public BillEmailCustomization() {

    }

    public BillEmailCustomization(Company company) {
        this.company = company;
    }
}
