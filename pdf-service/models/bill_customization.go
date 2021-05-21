package models

type BillCustomization struct {
	ID                         int32
	Company                    Company
	AfterTable                 string
	Footer                     string
	MainColor                  string
	DisplayCompanyEmail        bool
	DisplayCompanyPhoneNumber  bool
	DisplayCustomerEmail       bool
	DisplayCustomerPhoneNumber bool
}

func (BillCustomization) TableName() string {
	return "compta.com_bill_customization"
}
