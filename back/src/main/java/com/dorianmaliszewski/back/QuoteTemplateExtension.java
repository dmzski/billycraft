package com.dorianmaliszewski.back;

import com.dorianmaliszewski.back.models.Quote;
import com.dorianmaliszewski.back.models.QuoteLine;
import io.quarkus.qute.TemplateExtension;

@TemplateExtension
class QuoteTemplateExtension {

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

    static String formatNumber(Double num) {
        return String.format("%.2f", num);
    }
}
