package com.coco.back.main.extensions;

import com.coco.back.main.models.Bill;
import com.coco.back.main.models.BillLine;
import com.coco.back.main.models.Quote;
import com.coco.back.main.models.QuoteLine;
import com.coco.back.main.utils.EmailUtils;
import io.quarkus.qute.TemplateExtension;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

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
            return "0.00 €";
        }
        return String.format("%.2f €", num);
    }

    static String transformToHtml(String text) {
        return text.replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;");
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
            return "0.00";
        }
        return String.format("%.2f", num);
    }

    static String getPDFDate(Bill bill) {
        Instant instant = Instant.now();
        if (bill.sentAt != null) {
            instant = bill.sentAt;
        }

        return DateTimeFormatter.ofPattern("dd/MM/yyyy").withLocale(Locale.FRANCE).withZone(ZoneId.of("UTC")).format(instant);
    }

    static String getPDFDate(Quote quote) {
        Instant instant = Instant.now();
        if (quote.sentAt != null) {
            instant = quote.sentAt;
        }

        return DateTimeFormatter.ofPattern("dd/MM/yyyy").withLocale(Locale.FRANCE).withZone(ZoneId.of("UTC")).format(instant);
    }

    static String replaceIdentifiers(String string, Bill bill) {
        return EmailUtils.replaceStringWithBillInformation(string, bill);
    }

    static String replaceIdentifiers(String string, Quote quote) {
        return EmailUtils.replaceStringWithQuoteInformation(string, quote);
    }
}
