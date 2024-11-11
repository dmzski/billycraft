package models

import (
	"time"
)

type BillCustomization struct {
	ID                         string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	CompanyID                  string `gorm:"<-:create"`
	AfterTable                 string
	Footer                     string
	MainColor                  string
	DisplayCompanyEmail        bool
	DisplayCompanyPhoneNumber  bool
	DisplayCustomerEmail       bool
	DisplayCustomerPhoneNumber bool
	CreatedAt                  time.Time
	UpdatedAt                  *time.Time `gorm:"autoUpdateTime"`
	Company                    Organization
}

func (BillCustomization) TableName() string {
	return "com_bill_customization"
}
