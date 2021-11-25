package dtos

type Report struct {
	StartDate    string    `json:"startDate"`
	EndDate      string    `json:"endDate"`
	Sales        float64   `json:"sales"`
	ArticleSales float64   `json:"articleSales"`
	ServiceSales float64   `json:"serviceSales"`
	OtherSales   float64   `json:"otherSales"`
	Details      []*Report `json:"details"`
}
