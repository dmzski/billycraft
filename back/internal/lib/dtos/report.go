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
