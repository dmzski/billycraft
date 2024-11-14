package responses

import (
	"back/internal/lib/models"
	"time"
)

type ReportSummaryResponse struct {
  StartDate    string                  `json:"startDate" validate:"required"`
  EndDate      string                  `json:"endDate" validate:"required"`
  Sales        float64                 `json:"sales" validate:"required"`
  ArticleSales float64                 `json:"articleSales" validate:"required"`
  ServiceSales float64                 `json:"serviceSales" validate:"required"`
  OtherSales   float64                 `json:"otherSales" validate:"required"`
  ArticleTaxes float64                 `json:"articleTaxes" validate:"required"`
  ServiceTaxes float64                 `json:"serviceTaxes" validate:"required"`
  OtherTaxes   float64                 `json:"otherTaxes" validate:"required"`
  Outgoings    float64                 `json:"outgoings" validate:"required"`
  Details      []ReportSummaryResponse `json:"details" validate:"required"`
}//@name ReportSummaryResponse

type ReportResponse struct {
  ID             string                   `json:"id" validate:"required"`
  Name           string                   `json:"name" validate:"required"`
  CreatedAt      time.Time                `json:"createdAt" validate:"required"`
  StartDate      time.Time                `json:"startDate" validate:"required"`
  EndDate        time.Time                `json:"endDate" validate:"required"`
  Sales          float64                  `json:"sales" validate:"required"`
  ArticleSales   float64                  `json:"articleSales" validate:"required"`
  ServiceSales   float64                  `json:"serviceSales" validate:"required"`
  OtherSales     float64                  `json:"otherSales" validate:"required"`
  ArticleTaxes   float64                  `json:"articleTaxes" validate:"required"`
  ServiceTaxes   float64                  `json:"serviceTaxes" validate:"required"`
  OtherTaxes     float64                  `json:"otherTaxes" validate:"required"`
  TotalOutgoings float64                  `json:"totalOutgoings" validate:"required"`
  Bills          []ReportBillResponse     `json:"bills" validate:"required"`
  Outgoings      []ReportOutgoingResponse `json:"outgoings" validate:"required"`
}//@name ReportResponse

type ReportOutgoingResponse struct {
  OutgoingID string                       `json:"outgoingId" validate:"required"`
  Name       string                       `json:"name" validate:"required"`
  StartDate  time.Time                    `json:"startDate" validate:"required"`
  EndDate    time.Time                    `json:"endDate" validate:"required"`
  CreatedBy  string                       `json:"createdBy" validate:"required"`
  Lines      []ReportOutgoingLineResponse `json:"lines" validate:"required"`
}//@name ReportOutgoingResponse

type ReportOutgoingLineResponse struct {
  Line                  int     `json:"line" validate:"required"`
	SupplierID            *string `json:"supplierId"`
	BillID                *string `json:"billId"`
	SupplierBillReference *string `json:"supplierBillReference"`
  TotalHT               float64 `json:"totalHT" validate:"required"`
  VAT                   float32 `json:"vat" validate:"required"`
}//@name ReportOutgoingLineResponse

type ReportBillResponse struct {
  Title        string    `json:"title" validate:"required"`
  BillID       string    `json:"billId" validate:"required"`
  PaidAt       time.Time `json:"paidAt" validate:"required"`
  SentAt       time.Time `json:"sentAt" validate:"required"`
  ArticleSales float64   `json:"articleSales" validate:"required"`
  ServiceSales float64   `json:"serviceSales" validate:"required"`
  OtherSales   float64   `json:"otherSales" validate:"required"`
  ArticleTaxes float64   `json:"articleTaxes" validate:"required"`
  ServiceTaxes float64   `json:"servicetaxes" validate:"required"`
  OtherTaxes   float64   `json:"otherTaxes" validate:"required"`
  CreatedBy    string    `json:"createdBy" validate:"required"`
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
