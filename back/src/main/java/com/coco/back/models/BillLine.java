package com.coco.back.models;

import com.coco.back.models.IdClasses.BillLinePK;
import com.coco.back.enums.LineTypeEnum;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.persistence.*;

@Entity
@IdClass(BillLinePK.class)
@RegisterForReflection
@Table(name = "com_bill_line")
public class BillLine {
    @Id
    @JoinColumn(name = "bill_id", referencedColumnName = "id")
    @ManyToOne
    public Bill bill;

    @Id
    public Integer line;

    public Double quantity;

    @Column(name = "price")
    public Double price;

    public String description;


    @Enumerated(value = EnumType.STRING)
    public LineTypeEnum type;

    public BillLine() {

    }

    public BillLine(Bill bill, QuoteLine quoteLine) {
        this.line = quoteLine.line;
        this.quantity = quoteLine.quantity;
        this.price = quoteLine.price;
        this.description = quoteLine.description;
        this.bill = bill;
        this.type = quoteLine.type;
    }
}
