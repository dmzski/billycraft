package com.dorianmaliszewski.back.extensions;

import com.dorianmaliszewski.back.models.Bill;
import com.dorianmaliszewski.back.models.BillLine;
import com.dorianmaliszewski.back.models.Quote;
import com.dorianmaliszewski.back.models.QuoteLine;
import io.quarkus.qute.TemplateExtension;

@TemplateExtension
public class CustomTemplateExtension {

    static Double total(Quote quote) {
        return quote.lines.stream()
                .mapToDouble(quoteLine ->
                    priceTTC(quoteLine, quote.tva) * (quoteLine.quantity != null ? quoteLine.quantity : 0)
                )
                .sum();
    }

    static Double priceTTC(QuoteLine quoteLine, Integer tva) {
        double calculatedTva = 0D;
        if (quoteLine.price == null || quoteLine.quantity == null) return 0D;
        if (tva != null) calculatedTva = Double.valueOf(tva) / 100;
        return quoteLine.price + quoteLine.price * calculatedTva;
    }

    static Double subTotal(QuoteLine quoteLine) {
        if (quoteLine.price == null || quoteLine.quantity == null) return 0D;
        return quoteLine.price * quoteLine.quantity;
    }

    static String formatCurrency(Double num) {
        if (num == 0) {
            return "";
        }
        return String.format("%.2f €", num);
    }

    static String replaceBreakLineToBr(String text) {
        return text.replaceAll("\n", "<br/>");
    }

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
        if (num == 0) {
            return "";
        }
        return String.format("%.2f", num);
    }
}
