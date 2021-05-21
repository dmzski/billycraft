package com.coco.back.main.utils;

import com.coco.back.main.models.Quote;
import com.coco.back.main.models.QuoteLine;

public class QuoteUtils {

    public static Double total(Quote quote) {
        return quote.lines.stream()
                .mapToDouble(quoteLine ->
                        priceTTC(quoteLine, quote.tva) * (quoteLine.quantity != null ? quoteLine.quantity : 0)
                )
                .sum();
    }

    public static Double priceTTC(QuoteLine quoteLine, Integer tva) {
        double calculatedTva = 0D;
        if (quoteLine.price == null || quoteLine.quantity == null) return 0D;
        if (tva != null) calculatedTva = Double.valueOf(tva) / 100;
        return quoteLine.price + quoteLine.price * calculatedTva;
    }

    public static Double subTotal(QuoteLine quoteLine) {
        if (quoteLine.price == null || quoteLine.quantity == null) return 0D;
        return quoteLine.price * quoteLine.quantity;
    }

    public static Double subTotalTTC(QuoteLine quoteLine, Integer tva) {
        if (quoteLine.price == null || quoteLine.quantity == null) return 0D;
        return priceTTC(quoteLine, tva) * quoteLine.quantity;
    }

}
