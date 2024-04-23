package models

import (
	"back/internal/lib/dtos"
)

type BillEmailCustomization struct {
	ID                string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Body              string
	Object            string
	SendAutomatically bool
	CompanyID         string `gorm:"<-:create"`
	Company           Company
}

func (BillEmailCustomization) TableName() string {
	return "com_bill_email_customization"
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
