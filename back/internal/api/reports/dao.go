package reports

import (
	"back/database"
	"back/internal/api/company"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"time"
)

type ReportDAO struct {
}

func (dao ReportDAO) FindForMonth(tenant int, date time.Time) dtos.Report {
	bills := []models.Bill{}
	startDate := time.Date(date.Year(), date.Month(), 1, 0, 0, 0, 0, time.Local)
	endDate := startDate.AddDate(0, 1, 0).Add(time.Nanosecond * -1)
	err := database.DBConn.Preload("Lines").Where("company_id = ? AND paid_at BETWEEN ? AND ?", tenant, startDate, endDate).Find(&bills).Error
	if err != nil {
		panic(err)
	}
	company := company.DAO.FindOneById(tenant)

	outgoing := models.Outgoing{}
	database.DBConn.Preload("Lines").Where("company_id = ? AND start_date <= ? AND end_date >= ?", tenant, startDate, startDate).First(&outgoing)

	report := dtos.Report{
		Details:      make([]dtos.Report, 0),
		StartDate:    startDate.String(),
		EndDate:      endDate.String(),
		OtherSales:   0,
		ServiceSales: 0,
		ArticleSales: 0,
		ArticleTaxes: 0,
		Sales:        0,
		ServiceTaxes: 0,
		OtherTaxes:   0,
		Outgoings:    0,
	}
	for _, bill := range bills {
		billReport := dtos.Report{
			StartDate:    bill.PaidAt.String(),
			EndDate:      bill.PaidAt.String(),
			OtherSales:   0,
			ServiceSales: 0,
			ArticleSales: 0,
		}
		for _, line := range bill.Lines {
			linePrice := getLinePrice(bill, line)
			switch line.Type {
			case "ARTICLE":
				report.ArticleSales += linePrice
				billReport.ArticleSales += linePrice
			case "SERVICE":
				report.ServiceSales += linePrice
				billReport.ServiceSales += linePrice
			default:
				report.OtherSales += linePrice
				billReport.OtherSales += linePrice
			}
		}
		billReport.Sales = billReport.ArticleSales + billReport.ServiceSales + billReport.OtherSales
		billReport = addReportTaxes(company, billReport)
		report.Details = append(report.Details, billReport)

	}
	if outgoing.Lines != nil {
		for _, line := range outgoing.Lines {
			report.Outgoings += line.TotalHT * (1.0 - (float64(line.VAT) / 100))
		}
	}
	report.Sales = report.OtherSales + report.ArticleSales + report.ServiceSales
	report = addReportTaxes(company, report)

	return report
}

func (dao ReportDAO) FindForYear(tenant int, date time.Time) dtos.Report {
	startDate := time.Date(date.Year(), 1, 1, 0, 0, 0, 0, time.Local)
	endDate := startDate.AddDate(1, 0, 0).Add(time.Nanosecond * -1)
	company := company.DAO.FindOneById(tenant)
	report := dtos.Report{
		Details:      make([]dtos.Report, 0),
		StartDate:    startDate.String(),
		EndDate:      endDate.String(),
		OtherSales:   0,
		ServiceSales: 0,
		ArticleSales: 0,
		Sales:        0,
		ArticleTaxes: 0,
		ServiceTaxes: 0,
		OtherTaxes:   0,
		Outgoings:    0,
	}

	for !startDate.After(endDate) {
		monthReport := dao.FindForMonth(tenant, startDate)
		report.ArticleSales += monthReport.ArticleSales
		report.ServiceSales += monthReport.ServiceSales
		report.OtherSales += monthReport.OtherSales
		report.Sales += monthReport.Sales
		report.Details = append(report.Details, monthReport)
		report.Outgoings += monthReport.Outgoings
		report.ArticleTaxes += monthReport.ArticleTaxes
		report.ServiceTaxes += monthReport.ServiceTaxes
		report.OtherTaxes += monthReport.OtherTaxes
		startDate = startDate.AddDate(0, 1, 0)
	}
	addReportTaxes(company, report)
	return report
}

func getLinePrice(bill models.Bill, line models.BillLine) float64 {
	tva := 0.0
	if bill.Tva != nil && *bill.Tva > 0 {
		tva = float64(int(*bill.Tva) / 100)
	}

	return line.Quantity * (line.Price + (line.Price * tva))

}

func addReportTaxes(company models.Company, report dtos.Report) dtos.Report {
	if company.ArticlesTax != nil {
		report.ArticleTaxes += float64(*company.ArticlesTax) / 100 * report.ArticleSales
	}
	if company.ServicesTax != nil {
		report.ServiceTaxes += float64(*company.ServicesTax) / 100 * report.ServiceSales
	}
	if company.OthersTax != nil {
		report.OtherTaxes += float64(*company.OthersTax) / 100 * report.OtherSales
	}
	return report
}

var DAO = &ReportDAO{}
