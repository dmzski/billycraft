package requests

type ReportRequest struct {
	StartDate string `json:"startDate" validate:"required"`
	EndDate   string `json:"endDate" validate:"required"`
	Name      string `json:"name" validate:"required"`
}//@name ReportRequest
