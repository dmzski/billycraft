package models

import (
	"backv2/dtos"

	"gorm.io/gorm"
)

type QuoteEmailCustomization struct {
	ID                int `gorm:"primaryKey;autoIncrement"`
	Body              string
	Object            string
	SendAutomatically bool
	CompanyID         int `gorm:"<-:create"`
	Company           Company
}

func (QuoteEmailCustomization) TableName() string {
	return "com_quote_email_customization"
}

func (q *QuoteEmailCustomization) BeforeCreate(tx *gorm.DB) (err error) {
	q.ID = 0
	return
}

func (q QuoteEmailCustomization) ToDTO() dtos.QuoteEmailCustomization {
	return dtos.QuoteEmailCustomization{
		ID:                q.ID,
		Body:              q.Body,
		Object:            q.Object,
		SendAutomatically: q.SendAutomatically,
		CompanyID:         q.CompanyID,
	}
}

func (QuoteEmailCustomization) FromDTO(q dtos.QuoteEmailCustomization) QuoteEmailCustomization {
	return QuoteEmailCustomization{
		ID:                q.ID,
		Body:              q.Body,
		Object:            q.Object,
		SendAutomatically: q.SendAutomatically,
		CompanyID:         q.CompanyID,
	}
}
