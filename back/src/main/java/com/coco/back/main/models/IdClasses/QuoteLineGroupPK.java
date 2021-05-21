package com.coco.back.main.models.IdClasses;

import com.coco.back.main.models.Quote;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@RegisterForReflection
public class QuoteLineGroupPK implements Serializable {

    @JoinColumn(name = "quote_id", referencedColumnName = "id")
    @ManyToOne
    public Quote quote;
    public Integer num;

    public QuoteLineGroupPK(Quote quote, Integer num) {
        this.quote = quote;
        this.num = num;
    }

    public QuoteLineGroupPK() {
    }
}