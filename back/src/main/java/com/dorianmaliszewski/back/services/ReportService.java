package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.dtos.ReportDTO;
import com.dorianmaliszewski.back.models.Bill;
import com.dorianmaliszewski.back.models.Company;
import com.dorianmaliszewski.back.utils.BillUtils;

import javax.enterprise.context.ApplicationScoped;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@ApplicationScoped
public class ReportService {
    public ReportDTO getMonthReport(String username, LocalDateTime localDateTime) {
        ReportDTO monthReport = new ReportDTO();

        // Start of the month
        LocalDateTime startDateTime = localDateTime.withDayOfMonth(1).toLocalDate().atStartOfDay();
        // End of the month
        LocalDateTime endDateTime = localDateTime.withDayOfMonth(localDateTime.getMonth().length(localDateTime.toLocalDate().isLeapYear()));
        endDateTime = LocalDateTime.of(endDateTime.toLocalDate(), LocalTime.MAX);

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

    public ReportDTO getYearReport(String username, LocalDateTime localDateTime) {
        ReportDTO yearReport = new ReportDTO();

        // Start of the year
        LocalDateTime startDateTime = localDateTime.with(TemporalAdjusters.firstDayOfYear()).toLocalDate().atStartOfDay();
        // End of the year
        LocalDateTime endDateTime = localDateTime.with(TemporalAdjusters.lastDayOfYear()).toLocalDate().atTime(LocalTime.MAX);

        yearReport.startDate = startDateTime;
        yearReport.endDate = endDateTime;

        AtomicReference<Double> sales = new AtomicReference<>((double) 0);
        AtomicReference<Double> articleSales = new AtomicReference<>((double) 0);
        AtomicReference<Double> serviceSales = new AtomicReference<>((double) 0);
        AtomicReference<Double> otherSales = new AtomicReference<>((double) 0);
        List<ReportDTO> monthReports = new ArrayList<>();

        startDateTime.toLocalDate().datesUntil(endDateTime.toLocalDate(), Period.ofMonths(1)).forEach(localDate -> {
            ReportDTO reportDTO = this.getMonthReport(username, localDate.atStartOfDay());
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
