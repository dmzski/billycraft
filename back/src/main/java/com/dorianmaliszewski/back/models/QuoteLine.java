package com.dorianmaliszewski.back.models;

import com.dorianmaliszewski.back.models.IdClasses.QuoteLinePK;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.persistence.*;

@Entity
@IdClass(QuoteLinePK.class)
@RegisterForReflection
@Table(name = "com_quote_line")
public class QuoteLine {
    @Id
    @JoinColumn(name = "quote_id", referencedColumnName = "id")
    @ManyToOne
    public Quote quote;

    @Id
    public Integer line;

    public Double quantity;

    @Column(name = "price")
    public Double price;

    public String description;
}
