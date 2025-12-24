package models

type QuoteEmailCustomization struct {
	ID                string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Body              string
	Object            string
	SendAutomatically bool
	CompanyID         string `gorm:"<-:create"`
	Company           Organization
}

func (QuoteEmailCustomization) TableName() string {
	return "com_quote_email_customization"
}
