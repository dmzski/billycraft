package models

import (
	"backv2/dtos"

	"gorm.io/gorm"
)

type BillEmailCustomization struct {
	ID                int `gorm:"primaryKey;autoIncrement"`
	Body              string
	Object            string
	SendAutomatically bool
	CompanyID         int `gorm:"<-:create"`
	Company           Company
}

func (BillEmailCustomization) TableName() string {
	return "compta.com_bill_email_customization"
}

func (b *BillEmailCustomization) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = 0
	return
}

func (BillEmailCustomization) FromDTO(b dtos.BillEmailCustomization) BillEmailCustomization {
	return BillEmailCustomization{
		ID:                b.ID,
		Body:              b.Body,
		Object:            b.Object,
		SendAutomatically: b.SendAutomatically,
		CompanyID:         b.CompanyID,
	}
}

func (b BillEmailCustomization) ToDTO() dtos.BillEmailCustomization {
	return dtos.BillEmailCustomization{
		ID:                b.ID,
		Body:              b.Body,
		Object:            b.Object,
		SendAutomatically: b.SendAutomatically,
		CompanyID:         b.CompanyID,
	}
}
