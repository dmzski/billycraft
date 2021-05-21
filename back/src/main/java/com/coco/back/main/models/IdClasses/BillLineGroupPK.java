package com.coco.back.main.models.IdClasses;

import com.coco.back.main.models.Bill;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@RegisterForReflection
public class BillLineGroupPK implements Serializable {

    @JoinColumn(name = "bill_id", referencedColumnName = "id")
    @ManyToOne
    public Bill bill;
    public Integer num;

    public BillLineGroupPK(Bill bill, Integer num) {
        this.bill = bill;
        this.num = num;
    }

    public BillLineGroupPK() {
    }
}