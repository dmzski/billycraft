package facturx

import (
	"back/internal/lib/models"
	"fmt"
	"strings"
	"time"
)

type FacturXData struct {
	Bill          models.Bill
	Company       models.Organization
	Customer      *models.Customer
	Lines         []BillLineData
	TotalHT       float64
	TotalVAT      float64
	TotalTTC      float64
	InvoiceDate   time.Time
	InvoiceNumber string
	Currency      string
}

type BillLineData struct {
	Name        string
	Description string
	Quantity    float64
	UnitPrice   float64
	TotalHT     float64
	VATPercent  float32
	TotalVAT    float64
	TotalTTC    float64
}

func PrepareFacturXData(bill models.Bill, company models.Organization, customer *models.Customer) FacturXData {
	lines := make([]BillLineData, 0, len(bill.Lines))
	totalHT := 0.0
	totalVAT := 0.0

	vatPercent := float32(0)
	if bill.Tva != nil {
		vatPercent = *bill.Tva
	}

	for _, line := range bill.Lines {
		lineHT := line.Price * line.Quantity
		lineVAT := lineHT * float64(vatPercent/100)
		lineTTC := lineHT + lineVAT

		totalHT += lineHT
		totalVAT += lineVAT

		description := ""
		if line.Description != nil {
			description = *line.Description
		}

		lines = append(lines, BillLineData{
			Name:        line.Name,
			Description: description,
			Quantity:    line.Quantity,
			UnitPrice:   line.Price,
			TotalHT:     lineHT,
			VATPercent:  vatPercent,
			TotalVAT:    lineVAT,
			TotalTTC:    lineTTC,
		})
	}

	totalTTC := totalHT + totalVAT

	invoiceDate := bill.CreatedAt
	if bill.SentAt != nil {
		invoiceDate = *bill.SentAt
	}

	return FacturXData{
		Bill:          bill,
		Company:       company,
		Customer:      customer,
		Lines:         lines,
		TotalHT:       totalHT,
		TotalVAT:      totalVAT,
		TotalTTC:      totalTTC,
		InvoiceDate:   invoiceDate,
		InvoiceNumber: bill.Name,
		Currency:      "EUR",
	}
}

func FormatCurrency(amount float64, currency string) string {
	return fmt.Sprintf("%.2f %s", amount, currency)
}

func FormatDate(date time.Time) string {
	return date.Format("20060102")
}

func FormatDateTime(date time.Time) string {
	return date.Format("20060102150405")
}

func CleanString(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	s = strings.ReplaceAll(s, "\"", "&quot;")
	s = strings.ReplaceAll(s, "'", "&apos;")
	return strings.TrimSpace(s)
}
