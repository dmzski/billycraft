package com.dorianmaliszewski.back.extensions;

import com.dorianmaliszewski.back.models.Bill;
import com.dorianmaliszewski.back.models.BillLine;
import io.quarkus.qute.TemplateExtension;

@TemplateExtension
class BillTemplateExtension {

    static Double total(Bill bill) {
        return bill.lines.stream()
                .mapToDouble(billLine ->
                    priceTTC(billLine, bill.tva) * (billLine.quantity != null ? billLine.quantity : 0)
                )
                .sum();
    }

    static Double priceTTC(BillLine billLine, Integer tva) {
        double calculatedTva = 0D;
        if (billLine.price == null || billLine.quantity == null) return 0D;
        if (tva != null) calculatedTva = Double.valueOf(tva) / 100;
        return billLine.price + billLine.price * calculatedTva;
    }

    static Double subTotal(BillLine billLine) {
        if (billLine.price == null || billLine.quantity == null) return 0D;
        return billLine.price * billLine.quantity;
    }

    static String formatNumber(Double num) {
        return String.format("%.2f", num);
    }
}
