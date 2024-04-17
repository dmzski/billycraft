package models

import (
	"back/internal/lib/dtos"
	"time"
)

type BillCustomization struct {
	ID                         string `gorm:"primaryKey"`
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

func (BillCustomization) TableName() string {
	return "com_bill_customization"
}

func (q BillCustomization) ToDTO() dtos.BillCustomization {
	return dtos.BillCustomization{
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

func (BillCustomization) FromDTO(q dtos.BillCustomization) BillCustomization {
	return BillCustomization{
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
