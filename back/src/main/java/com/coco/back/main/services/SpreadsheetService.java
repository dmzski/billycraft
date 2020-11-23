 package com.coco.back.main.services;

import com.coco.back.main.models.Company;
import com.coco.back.main.models.Quote;
import com.coco.back.main.models.User;
import com.coco.back.main.utils.QuoteUtils;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityNotFoundException;
import java.util.concurrent.atomic.AtomicReference;

@ApplicationScoped
public class SpreadsheetService {

    private static final String LB = "\n";
    public String getCSVOfQuote(String username, String quoteId) {
        User user = User.find("email = ?1", username).singleResult();
        if (user.company == null) {
            return null;
        }
        Quote quote = (Quote) Quote.find("company_id = ?1", user.company.id).firstResultOptional().orElseThrow(EntityNotFoundException::new);

        String content = "";


        //            Path file = Files.createTempFile("csv-", ".csv");
        content = this.generateHeaders(user.company, quote);
        content += "," + LB;
        content += "Description,Quantité,\"Prix HT\",\"Prix TTC\",\"Sous Total\"" + LB;
        content += this.generateLines(quote) + LB;
        content += this.generateTotal(quote);
//            Files.write(file, content.getBytes(StandardCharsets.UTF_8));
        return content;
    }

    private String generateTotal(Quote quote) {
        String total = "";
        if (quote.tva != null && quote.tva > 0) {
            total += ",,,TVA," + quote.tva + LB;
        }

        total += ",,,TOTAL," + QuoteUtils.total(quote) + LB;

        return total;
    }

    private String generateLines(Quote quote) {
        AtomicReference<String> lines = new AtomicReference<>("");
        quote.lines.forEach(quoteLine -> {
            lines.getAndSet(lines + sanitizeCSV(quoteLine.description) + "," + quoteLine.quantity + "," + quoteLine.price + "," + QuoteUtils.priceTTC(quoteLine, quote.tva) + "," + QuoteUtils.subTotalTTC(quoteLine, quote.tva) + LB);
        });
        return lines.get();
    }

    private String generateHeaders(Company company, Quote quote) {
        String headers = "";
        headers += sanitizeCSV(company.name) + ",,,,DEVIS" + LB;
        headers += sanitizeCSV(company.address) + ",,,," + sanitizeCSV(quote.customer.name) + LB;
        headers += sanitizeCSV(company.postalCode + ", " + company.city) + ",,,," + sanitizeCSV(quote.customer.address) + LB;
        headers += ",,,," + sanitizeCSV(quote.customer.postalCode + ", " + quote.customer.city) + LB + LB;
        headers += ",,,," + sanitizeCSV("Référence du devis : " + quote.id) + LB;
        headers += sanitizeCSV("Objet du devis : " + quote.title) + ",,,," + LB;
        return headers;
    }


    private String sanitizeCSV(String string) {
        return "\"" + string.replaceAll("\\\\", "\\\\\\").replaceAll("\"", "\"\"") + "\"";
    }
}
