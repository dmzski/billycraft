package models

import (
	"back/internal/lib/dtos"
	"time"
)

type QuoteCustomization struct {
	ID                         string `gorm:"primaryKey;<-:false"`
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
	Company                    Company
}

func (QuoteCustomization) TableName() string {
	return "com_quote_customization"
}

func (q QuoteCustomization) ToDTO() dtos.QuoteCustomization {
	return dtos.QuoteCustomization{
		ID:                         q.ID,
		CompanyID:                  q.CompanyID,
		AfterTable:                 q.AfterTable,
		Footer:                     q.Footer,
		MainColor:                  q.MainColor,
		DisplayCompanyEmail:        q.DisplayCompanyEmail,
		DisplayCompanyPhoneNumber:  q.DisplayCompanyPhoneNumber,
		DisplayCustomerEmail:       q.DisplayCustomerEmail,
		DisplayCustomerPhoneNumber: q.DisplayCustomerPhoneNumber,
		CreatedAt:                  q.CreatedAt,
		UpdatedAt:                  q.UpdatedAt,
	}
}

func (QuoteCustomization) FromDTO(q dtos.QuoteCustomization) QuoteCustomization {
	return QuoteCustomization{
		ID:                         q.ID,
		CompanyID:                  q.CompanyID,
		AfterTable:                 q.AfterTable,
		Footer:                     q.Footer,
		MainColor:                  q.MainColor,
		DisplayCompanyEmail:        q.DisplayCompanyEmail,
		DisplayCompanyPhoneNumber:  q.DisplayCompanyPhoneNumber,
		DisplayCustomerEmail:       q.DisplayCustomerEmail,
		DisplayCustomerPhoneNumber: q.DisplayCustomerPhoneNumber,
		CreatedAt:                  q.CreatedAt,
		UpdatedAt:                  q.UpdatedAt,
	}
}
