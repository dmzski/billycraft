package cron

import (
	"back/internal/api/company"
	"back/internal/api/reports"
	"log"
	"time"
)

var BOT_EMAIL = "bot@coco-erp.fr"

func LaunchMonthReportJob() {
	generateMonthReports()
}
func LaunchYearReportJob() {
	generateYearReports()
}

func generateMonthReports() {

	companies := company.DAO.FindAllForMonthCron()
	log.Printf("Generate month reports for %d companies", len(companies))
	now := time.Now()
	startDate := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local).AddDate(0, -1, 0)
	endDate := startDate.AddDate(0, 1, 0).Add(time.Nanosecond * -1)
	for _, company := range companies {
		reports.DAO.CreateCron(BOT_EMAIL, company.ID, startDate, endDate, startDate.Format("2006-01"))
	}
}

func generateYearReports() {
	companies := company.DAO.FindAllForYearCron()
	log.Printf("Generate year reports for %d companies", len(companies))
	now := time.Now()
	startDate := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, time.Local).AddDate(-1, 0, 0)
	endDate := startDate.AddDate(1, 0, 0).Add(time.Nanosecond * -1)
	for _, company := range companies {
		reports.DAO.CreateCron(BOT_EMAIL, company.ID, startDate, endDate, startDate.Format("2006"))
	}

}
