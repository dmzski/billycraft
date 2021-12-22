package dtos

type BillEmailCustomization struct {
	ID                int    `json:"id"`
	Body              string `json:"body"`
	Object            string `json:"object"`
	SendAutomatically bool   `json:"sendAutomatically"`
	CompanyID         int    `json:"companyId"`
}
