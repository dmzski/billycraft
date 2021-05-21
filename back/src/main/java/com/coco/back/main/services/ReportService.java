package com.coco.back.main.services;

import com.coco.back.main.dtos.ReportDTO;
import com.coco.back.main.models.Bill;
import com.coco.back.main.models.Company;
import com.coco.back.main.utils.BillUtils;

import javax.enterprise.context.ApplicationScoped;
import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@ApplicationScoped
public class ReportService {
    public ReportDTO getMonthReport(String username, Instant instant) {
        ReportDTO monthReport = new ReportDTO();

        // Start of the month
        Instant startDateTime = YearMonth.from(instant.atZone(ZoneId.of("UTC"))).atDay(1).atTime(LocalTime.MIN).toInstant(ZoneOffset.UTC);
        // End of the month
        Instant endDateTime = YearMonth.from(instant.atZone(ZoneId.of("UTC")))
                .atEndOfMonth().atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC);

        Company company = (Company) Company.find("id = (SELECT u.company.id from User u where u.email = ?1)", username).singleResultOptional().orElseThrow();
        List<Bill> bills = Bill.list("company_id = ?1 AND paid_at BETWEEN ?2 AND ?3", company.id, startDateTime, endDateTime);
        monthReport.startDate = startDateTime;
        monthReport.endDate = endDateTime;

        AtomicReference<Double> sales = new AtomicReference<>((double) 0);
        AtomicReference<Double> articleSales = new AtomicReference<>((double) 0);
        AtomicReference<Double> serviceSales = new AtomicReference<>((double) 0);
        AtomicReference<Double> otherSales = new AtomicReference<>((double) 0);

        bills.forEach(bill -> {
            if (bill.lines != null && bill.lines.size() > 0) {
                bill.lines.forEach(billLine -> {
                    double lineTTC = BillUtils.subTotalTTC(billLine, bill.tva);
                    if (billLine.type != null) {
                        switch(billLine.type) {
                            case ARTICLE:
                                articleSales.updateAndGet(v -> v + lineTTC);
                                break;
                            case SERVICE:
                                serviceSales.updateAndGet(v -> v + lineTTC);
                                break;
                            case OTHER_SERVICE:
                            default:
                                otherSales.updateAndGet(v -> v + lineTTC);
                        }
                    } else {
                        otherSales.updateAndGet(v -> v + lineTTC);
                    }
                    sales.updateAndGet(v -> v + lineTTC);
                });
            }
        });

        monthReport.sales = sales.get();
        monthReport.articleSales = articleSales.get();
        monthReport.serviceSales = serviceSales.get();
        monthReport.otherSales = otherSales.get();

        return monthReport;
    }

    public ReportDTO getYearReport(String username, Instant instant) {
        ReportDTO yearReport = new ReportDTO();

        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.of("UTC"));

        // Start of the year
        Instant startDateTime = Year.from(zonedDateTime).atDay(1).atTime(LocalTime.MIN).toInstant(ZoneOffset.UTC);
        // End of the year
        Instant endDateTime =  Year.from(zonedDateTime).atDay(Year.from(zonedDateTime).length()).atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC);

        yearReport.startDate = startDateTime;
        yearReport.endDate = endDateTime;

        AtomicReference<Double> sales = new AtomicReference<>((double) 0);
        AtomicReference<Double> articleSales = new AtomicReference<>((double) 0);
        AtomicReference<Double> serviceSales = new AtomicReference<>((double) 0);
        AtomicReference<Double> otherSales = new AtomicReference<>((double) 0);
        List<ReportDTO> monthReports = new ArrayList<>();

        startDateTime.atZone(ZoneId.of("UTC")).toLocalDate().datesUntil(endDateTime.atZone(ZoneId.of("UTC")).toLocalDate(), Period.ofMonths(1)).forEach(localDate -> {
            ReportDTO reportDTO = this.getMonthReport(username, localDate.atStartOfDay(ZoneId.of("UTC")).toInstant());
            sales.set(sales.get() + reportDTO.sales);
            articleSales.set(articleSales.get() + reportDTO.articleSales);
            serviceSales.set(serviceSales.get() + reportDTO.serviceSales);
            otherSales.set(otherSales.get() + reportDTO.otherSales);
            monthReports.add(reportDTO);
        });

        yearReport.sales = sales.get();
        yearReport.articleSales = articleSales.get();
        yearReport.serviceSales = serviceSales.get();
        yearReport.otherSales = otherSales.get();
        yearReport.details.addAll(monthReports);

        return yearReport;
    }
}
