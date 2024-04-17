package dtos

import "time"

type Report struct {
	StartDate    string   `json:"startDate"`
	EndDate      string   `json:"endDate"`
	Sales        float64  `json:"sales"`
	ArticleSales float64  `json:"articleSales"`
	ServiceSales float64  `json:"serviceSales"`
	OtherSales   float64  `json:"otherSales"`
	ArticleTaxes float64  `json:"articleTaxes"`
	ServiceTaxes float64  `json:"serviceTaxes"`
	OtherTaxes   float64  `json:"otherTaxes"`
	Outgoings    float64  `json:"outgoings"`
	Details      []Report `json:"details"`
}

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
}

type ReportOutgoingResponse struct {
	OutgoingID string                       `json:"outgoingId"`
	Name       string                       `json:"name"`
	StartDate  time.Time                    `json:"startDate"`
	EndDate    time.Time                    `json:"endDate"`
	CreatedBy  string                       `json:"createdBy"`
	Lines      []ReportOutgoingLineResponse `json:"lines"`
}

type ReportOutgoingLineResponse struct {
	Line                  int     `json:"line"`
	SupplierID            *string `json:"supplierId"`
	BillID                *string `json:"billId"`
	SupplierBillReference *string `json:"supplierBillReference"`
	TotalHT               float64 `json:"totalHT"`
	VAT                   float32 `json:"vat"`
}

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
}

type ReportRequest struct {
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
	Name      string `json:"name"`
}
