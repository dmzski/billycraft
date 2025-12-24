package models

import (
	"time"
)

type QuoteCustomization struct {
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

func (QuoteCustomization) TableName() string {
	return "com_quote_customization"
}
