package com.coco.back.models;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import javax.persistence.*;

@Entity
@Table(name = "com_user")
public class User extends PanacheEntityBase {

    @Id
    public String email;
    public String firstName;
    public String lastName;

    @ManyToOne
    @JoinColumn(name = "company_id")
    public Company company;
}
