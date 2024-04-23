package dtos

type BillEmailCustomization struct {
	ID                string `json:"id"`
	Body              string `json:"body"`
	Object            string `json:"object"`
	SendAutomatically bool   `json:"sendAutomatically"`
	CompanyID         string `json:"companyId"`
}
