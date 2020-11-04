package com.dorianmaliszewski.back.models.IdClasses;

import com.dorianmaliszewski.back.models.Quote;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@RegisterForReflection
public class QuoteLinePK implements Serializable {

    @JoinColumn(name = "quote_id", referencedColumnName = "id")
    @ManyToOne
    public Quote quote;
    public Integer line;

    public QuoteLinePK(Quote quote, Integer line) {
        this.quote = quote;
        this.line = line;
    }

    public QuoteLinePK() {
    }
}