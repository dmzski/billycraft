package reports

import (
	"back/database"
	"back/internal/api/company"
	"back/internal/api/outgoings"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"time"
)

type Repository struct {
}

func (Repository) FindAllByTenant(tenant string) (reports []models.Report) {
	if err := database.DBConn.Preload("ReportBills").Preload("ReportOutgoings").Preload("ReportOutgoings.Lines").Where("company_id = ?", tenant).Find(&reports).Error; err != nil {
		panic(err)
	}
	return
}

func (Repository) FindOneByTenantAndId(tenant string, id string) (report models.Report) {
	if err := database.DBConn.Preload("ReportBills").Preload("ReportOutgoings").Preload("ReportOutgoings.Lines").Where("company_id = ? AND id = ?", tenant, id).First(&report).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) Create(user models.User, dto dtos.ReportRequest) models.Report {
	startMonth, err := time.Parse(time.RFC3339, dto.StartDate)
	if err != nil {
		panic("Can't parse date")
	}
	endMonth, err := time.Parse(time.RFC3339, dto.EndDate)
	if err != nil {
		panic("Can't parse date")
	}
	report := dao.BuildBetweenTwoDates(*user.CompanyID, startMonth, endMonth)
	report.CompanyID = *user.CompanyID
	report.CreatedBy = user.Email
	report.Name = dto.Name

	tx := database.DBConn.Begin()
	if err := tx.Omit("Bills.*", "Outgoings.*").Create(&report).Error; err != nil {
		tx.Rollback()
		panic(err)
	}

	tx.Commit()

	return report
}

func (dao Repository) CreateCron(creator string, tenant string, startTime time.Time, endTime time.Time, name string) models.Report {
	report := dao.BuildBetweenTwoDates(tenant, startTime, endTime)
	report.CompanyID = tenant
	report.CreatedBy = creator
	report.Name = name

	tx := database.DBConn.Begin()
	if err := tx.Omit("Bills.*", "Outgoings.*").Create(&report).Error; err != nil {
		tx.Rollback()
		panic(err)
	}

	tx.Commit()

	return report
}

func (dao Repository) Delete(tenant string, id string) {
	if err := database.DBConn.Where("company_id = ? AND id = ?", tenant, id).Delete(&models.Report{}).Error; err != nil {
		panic(err)
	}
}

func (Repository) BuildBetweenTwoDates(tenant string, startDate time.Time, endDate time.Time) models.Report {
	bills := []models.Bill{}
	err := database.DBConn.Preload("Lines").Where("company_id = ? AND paid_at BETWEEN ? AND ?", tenant, startDate, endDate).Find(&bills).Error
	if err != nil {
		panic(err)
	}
	company := company.DAO.FindOneById(tenant)

	outgoings := outgoings.DAO.FindAllBetweenDates(tenant, startDate, endDate)

	report := models.Report{
		StartDate:       startDate.Local(),
		EndDate:         endDate.Local(),
		OtherSales:      0,
		ServiceSales:    0,
		ArticleSales:    0,
		ArticleTaxes:    0,
		ServiceTaxes:    0,
		OtherTaxes:      0,
		Outgoings:       0,
		ReportBills:     make([]models.ReportBill, 0),
		ReportOutgoings: make([]models.ReportOutgoing, 0),
	}
	for _, bill := range bills {
		billReport := models.ReportBill{
			Title:        bill.Title,
			BillID:       bill.ID,
			PaidAt:       *bill.PaidAt,
			SentAt:       *bill.SentAt,
			ArticleTaxes: 0,
			ServiceTaxes: 0,
			OtherTaxes:   0,
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
		billReport = addBillReportTaxes(company, billReport)
		report.ReportBills = append(report.ReportBills, billReport)

	}

	for _, outgoing := range outgoings {
		if outgoing.Lines != nil {
			for _, line := range outgoing.Lines {
				report.Outgoings += line.TotalHT * (1.0 + (float64(line.VAT) / 100))
			}
		}
		report.ReportOutgoings = append(report.ReportOutgoings, outgoing.ToReport())
	}
	report = addReportTaxes(company, report)

	return report
}

func (dao Repository) BuildForMonth(tenant string, date time.Time) models.Report {
	startDate := time.Date(date.Year(), date.Month(), 1, 0, 0, 0, 0, time.Local)
	endDate := startDate.AddDate(0, 1, 0).Add(time.Nanosecond * -1)
	return dao.BuildBetweenTwoDates(tenant, startDate, endDate)
}

func (dao Repository) BuildForYear(tenant string, date time.Time) models.Report {
	startDate := time.Date(date.Year(), 1, 1, 0, 0, 0, 0, time.Local)
	endDate := startDate.AddDate(1, 0, 0).Add(time.Nanosecond * -1)
	return dao.BuildBetweenTwoDates(tenant, startDate, endDate)
}

func getLinePrice(bill models.Bill, line models.BillLine) float64 {
	tva := 0.0
	if bill.Tva != nil && *bill.Tva > 0 {
		tva = float64(int(*bill.Tva) / 100)
	}

	return line.Quantity * (line.Price + (line.Price * tva))

}

func addReportTaxes(company models.Company, report models.Report) models.Report {
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

func addBillReportTaxes(company models.Company, report models.ReportBill) models.ReportBill {
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

var DAO = &Repository{}
