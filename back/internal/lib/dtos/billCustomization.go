package dtos

import "time"

type BillCustomization struct {
	ID                         string        `json:"id"`
	CompanyID                  string        `json:"companyId"`
	AfterTable                 string     `json:"afterTable"`
	Footer                     string     `json:"footer"`
	MainColor                  string     `json:"mainColor"`
	DisplayCompanyEmail        bool       `json:"displayCompanyEmail"`
	DisplayCompanyPhoneNumber  bool       `json:"displayCompanyPhoneNumber"`
	DisplayCustomerEmail       bool       `json:"displayCustomerEmail"`
	DisplayCustomerPhoneNumber bool       `json:"displayCustomerPhoneNumber"`
	CreatedAt                  time.Time  `json:"createdAt"`
	UpdatedAt                  *time.Time `json:"updatedAt"`
}
