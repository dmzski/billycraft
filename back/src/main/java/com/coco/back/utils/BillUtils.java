package com.coco.back.utils;

import com.coco.back.models.Bill;
import com.coco.back.models.BillLine;

public class BillUtils {

    public static Double total(Bill bill) {
        return bill.lines.stream()
                .mapToDouble(billLine ->
                        priceTTC(billLine, bill.tva) * (billLine.quantity != null ? billLine.quantity : 0)
                )
                .sum();
    }

    public static Double priceTTC(BillLine billLine, Integer tva) {
        double calculatedTva = 0D;
        if (billLine.price == null || billLine.quantity == null) return 0D;
        if (tva != null) calculatedTva = Double.valueOf(tva) / 100;
        return billLine.price + billLine.price * calculatedTva;
    }

    public static Double subTotal(BillLine billLine) {
        if (billLine.price == null || billLine.quantity == null) return 0D;
        return billLine.price * billLine.quantity;
    }

    public static Double subTotalTTC(BillLine billLine, Integer tva) {
        if (billLine.price == null || billLine.quantity == null) return 0D;
        return priceTTC(billLine, tva) * billLine.quantity;
    }

}
