package models

import (
	"back/internal/lib/dtos"
)

type QuoteEmailCustomization struct {
	ID                string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Body              string
	Object            string
	SendAutomatically bool
	CompanyID         string `gorm:"<-:create"`
	Company           Company
}

func (QuoteEmailCustomization) TableName() string {
	return "com_quote_email_customization"
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
