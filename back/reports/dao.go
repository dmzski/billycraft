package reports

import (
	"backv2/database"
	"backv2/dtos"
	"backv2/models"
	"time"
)

type ReportDAO struct {
}

func (dao ReportDAO) FindForMonth(tenant int, date time.Time) *dtos.Report {
	bills := []models.Bill{}
	startDate := time.Date(date.Year(), date.Month(), 1, 0, 0, 0, 0, time.Local)
	endDate := startDate.AddDate(0, 1, 0).Add(time.Nanosecond * -1)
	err := database.DBConn.Preload("Lines").Where("company_id = ? AND paid_at BETWEEN ? AND ?", tenant, startDate, endDate).Find(&bills).Error
	if err != nil {
		panic(err)
	}
	report := &dtos.Report{
		Details:      []*dtos.Report{},
		StartDate:    startDate.String(),
		EndDate:      endDate.String(),
		OtherSales:   0,
		ServiceSales: 0,
		ArticleSales: 0,
	}
	for _, bill := range bills {
		billReport := &dtos.Report{
			StartDate:    bill.CreatedAt.String(),
			EndDate:      bill.CreatedAt.String(),
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
				break
			case "OTHER":
				report.OtherSales += linePrice
				billReport.OtherSales += linePrice
				break
			case "SERVICE":
				report.ServiceSales += linePrice
				billReport.ServiceSales += linePrice
				break
			}
		}
		report.Details = append(report.Details, billReport)

	}
	report.Sales = report.OtherSales + report.ArticleSales + report.ServiceSales
	return report
}

func (dao ReportDAO) FindForYear(tenant int, date time.Time) *dtos.Report {
	startDate := time.Date(date.Year(), 1, 1, 0, 0, 0, 0, time.Local)
	endDate := startDate.AddDate(1, 0, 0).Add(time.Nanosecond * -1)
	report := &dtos.Report{
		Details:      []*dtos.Report{},
		StartDate:    startDate.String(),
		EndDate:      endDate.String(),
		OtherSales:   0,
		ServiceSales: 0,
		ArticleSales: 0,
	}

	for !startDate.After(endDate) {
		monthReport := dao.FindForMonth(tenant, startDate)
		report.ArticleSales += monthReport.ArticleSales
		report.ServiceSales += monthReport.ServiceSales
		report.OtherSales += monthReport.OtherSales
		report.Sales += monthReport.Sales
		report.Details = append(report.Details, monthReport)
		startDate = startDate.AddDate(0, 1, 0)
	}
	report.Sales = report.OtherSales + report.ArticleSales + report.ServiceSales
	return report
}

func getLinePrice(bill models.Bill, line models.BillLine) float64 {
	tva := 0.0
	if bill.Tva != nil && *bill.Tva > 0 {
		tva = float64(int(*bill.Tva) / 100)
	}

	return line.Quantity * (line.Price + (line.Price * tva))

}

var DAO = &ReportDAO{}
