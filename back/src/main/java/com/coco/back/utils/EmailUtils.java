package com.coco.back.utils;

import com.coco.back.models.Bill;
import com.coco.back.models.Quote;

public class EmailUtils {

    public static String replaceStringWithQuoteInformation(String string, Quote quote) {
        return string.replaceAll("#QUOTE_ID#", quote.id).replaceAll("#QUOTE_TITLE#", quote.title);
    }

    public static String replaceStringWithBillInformation(String string, Bill bill) {
        return string.replaceAll("#BILL_ID#", bill.id).replaceAll("#BILL_TITLE#", bill.title);
    }
}
