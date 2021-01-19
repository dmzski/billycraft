package models

type QuoteCustomization struct {
	ID                         int32
	CompanyID                  int32
	Company                    Company
	AfterTable                 string
	Footer                     string
	MainColor                  string
	DisplayCompanyEmail        bool
	DisplayCompanyPhoneNumber  bool
	DisplayCustomerEmail       bool
	DisplayCustomerPhoneNumber bool
}

func (QuoteCustomization) TableName() string {
	return "compta.com_quote_customization"
}
