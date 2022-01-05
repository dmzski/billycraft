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
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
	Sales        float64   `json:"sales"`
	ArticleSales float64   `json:"articleSales"`
	ServiceSales float64   `json:"serviceSales"`
	OtherSales   float64   `json:"otherSales"`
	ArticleTaxes float64   `json:"articleTaxes"`
	ServiceTaxes float64   `json:"serviceTaxes"`
	OtherTaxes   float64   `json:"otherTaxes"`
	Outgoings    float64   `json:"outgoings"`
	BillIDs      []string  `json:"billIds"`
	OutgoingIDs  []string  `json:"outgoingIds"`
}

type ReportRequest struct {
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
	Name      string `json:"name"`
}
