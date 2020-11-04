package com.dorianmaliszewski.back;

import com.dorianmaliszewski.back.models.Quote;
import com.dorianmaliszewski.back.models.QuoteLine;
import io.quarkus.qute.TemplateExtension;

@TemplateExtension
class QuoteTemplateExtension {

    static Double total(Quote quote) {
        return quote.lines.stream().mapToDouble(quoteLine -> quoteLine.price + quoteLine.price * (quote.tva / 100)).sum();
    }

    static Double priceTTC(QuoteLine quoteLine, Integer tva) {
        Double calculatedTva = 0D;
        if (tva != null) calculatedTva = Double.valueOf(tva) / 100;
        return quoteLine.price + quoteLine.price * calculatedTva;
    }

    static Double subTotal(QuoteLine quoteLine) {
        return quoteLine.price *quoteLine.quantity;
    }

    static String formatNumber(Double num) {
        return String.format("%.2f", num);
    }
}
