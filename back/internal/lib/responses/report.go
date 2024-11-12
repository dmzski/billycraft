package responses

import (
	"back/internal/lib/models"
	"time"
)

type ReportSummaryResponse struct {
	StartDate    string                  `json:"startDate"`
	EndDate      string                  `json:"endDate"`
	Sales        float64                 `json:"sales"`
	ArticleSales float64                 `json:"articleSales"`
	ServiceSales float64                 `json:"serviceSales"`
	OtherSales   float64                 `json:"otherSales"`
	ArticleTaxes float64                 `json:"articleTaxes"`
	ServiceTaxes float64                 `json:"serviceTaxes"`
	OtherTaxes   float64                 `json:"otherTaxes"`
	Outgoings    float64                 `json:"outgoings"`
	Details      []ReportSummaryResponse `json:"details"`
}//@name ReportSummaryResponse

type ReportResponse struct {
	ID             string                   `json:"id"`
	Name           string                   `json:"name"`
	CreatedAt      time.Time                `json:"createdAt"`
	StartDate      time.Time                `json:"startDate"`
	EndDate        time.Time                `json:"endDate"`
	Sales          float64                  `json:"sales"`
	ArticleSales   float64                  `json:"articleSales"`
	ServiceSales   float64                  `json:"serviceSales"`
	OtherSales     float64                  `json:"otherSales"`
	ArticleTaxes   float64                  `json:"articleTaxes"`
	ServiceTaxes   float64                  `json:"serviceTaxes"`
	OtherTaxes     float64                  `json:"otherTaxes"`
	TotalOutgoings float64                  `json:"totalOutgoings"`
	Bills          []ReportBillResponse     `json:"bills"`
	Outgoings      []ReportOutgoingResponse `json:"outgoings"`
}//@name ReportResponse

type ReportOutgoingResponse struct {
	OutgoingID string                       `json:"outgoingId"`
	Name       string                       `json:"name"`
	StartDate  time.Time                    `json:"startDate"`
	EndDate    time.Time                    `json:"endDate"`
	CreatedBy  string                       `json:"createdBy"`
	Lines      []ReportOutgoingLineResponse `json:"lines"`
}//@name ReportOutgoingResponse

type ReportOutgoingLineResponse struct {
	Line                  int     `json:"line"`
	SupplierID            *string `json:"supplierId"`
	BillID                *string `json:"billId"`
	SupplierBillReference *string `json:"supplierBillReference"`
	TotalHT               float64 `json:"totalHT"`
	VAT                   float32 `json:"vat"`
}//@name ReportOutgoingLineResponse

type ReportBillResponse struct {
	Title        string    `json:"title"`
	BillID       string    `json:"billId"`
	PaidAt       time.Time `json:"paidAt"`
	SentAt       time.Time `json:"sentAt"`
	ArticleSales float64   `json:"articleSales"`
	ServiceSales float64   `json:"serviceSales"`
	OtherSales   float64   `json:"otherSales"`
	ArticleTaxes float64   `json:"articleTaxes"`
	ServiceTaxes float64   `json:"servicetaxes"`
	OtherTaxes   float64   `json:"otherTaxes"`
	CreatedBy    string    `json:"createdBy"`
}//@name ReportBillResponse

func CreateReportResponse(r models.Report) ReportResponse {
	dto := ReportResponse{
		ID:             r.ID,
		Name:           r.Name,
		CreatedAt:      r.CreatedAt,
		StartDate:      r.StartDate,
		EndDate:        r.EndDate,
		Sales:          r.ArticleSales + r.ServiceSales + r.OtherSales,
		ArticleSales:   r.ArticleSales,
		ServiceSales:   r.ServiceSales,
		OtherSales:     r.OtherSales,
		ArticleTaxes:   r.ArticleTaxes,
		ServiceTaxes:   r.ServiceTaxes,
		OtherTaxes:     r.OtherTaxes,
		TotalOutgoings: r.Outgoings,
		Bills:          make([]ReportBillResponse, 0),
		Outgoings:      make([]ReportOutgoingResponse, 0),
	}
	for _, bill := range r.ReportBills {
		dto.Bills = append(dto.Bills, CreateReportBillResponse(bill))
	}
	for _, outgoing := range r.ReportOutgoings {
		dto.Outgoings = append(dto.Outgoings, CreateReportOutgoingResponse(outgoing))
	}

	return dto
}

func CreateReportBillResponse(r models.ReportBill) ReportBillResponse {
	dto := ReportBillResponse{
		Title:        r.Title,
		BillID:       r.BillID,
		PaidAt:       r.PaidAt,
		SentAt:       r.SentAt,
		ArticleSales: r.ArticleSales,
		ServiceSales: r.ServiceSales,
		OtherSales:   r.OtherSales,
		ArticleTaxes: r.ArticleTaxes,
		ServiceTaxes: r.ServiceTaxes,
		OtherTaxes:   r.OtherTaxes,
		CreatedBy:    r.CreatedBy,
	}

	return dto

}

func CreateReportOutgoingResponse(r models.ReportOutgoing) ReportOutgoingResponse {
	dto := ReportOutgoingResponse{
		OutgoingID: r.ID,
		Name:       r.Name,
		StartDate:  r.StartDate,
		EndDate:    r.EndDate,
		Lines:      make([]ReportOutgoingLineResponse, 0),
	}

	for _, line := range r.Lines {
		dto.Lines = append(dto.Lines, CreateReportOutgoingLineResponse(line))
	}
	return dto
}

func CreateReportOutgoingLineResponse(r models.ReportOutgoingLine) ReportOutgoingLineResponse {
	dto := ReportOutgoingLineResponse{
		Line:                  r.Line,
		SupplierID:            r.SupplierID,
		BillID:                r.BillID,
		SupplierBillReference: r.SupplierBillReference,
		TotalHT:               r.TotalHT,
		VAT:                   r.VAT,
	}

	return dto
}
