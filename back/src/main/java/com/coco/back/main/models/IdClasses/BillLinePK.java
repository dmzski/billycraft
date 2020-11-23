package com.coco.back.main.models.IdClasses;

import com.coco.back.main.models.Bill;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@RegisterForReflection
public class BillLinePK implements Serializable {

    @JoinColumn(name = "bill_id", referencedColumnName = "id")
    @ManyToOne
    public Bill bill;
    public Integer line;

    public BillLinePK(Bill bill, Integer line) {
        this.bill = bill;
        this.line = line;
    }

    public BillLinePK() {
    }
}