package dtos

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
	ID           string   `json:"id"`
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
	BillIDs      []string `json:"bill_ids"`
	OutgoingIDs  []string `json:"outgoing_ids"`
}

type ReportRequest struct {
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
}
