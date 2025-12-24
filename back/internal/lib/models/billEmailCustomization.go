package models

type BillEmailCustomization struct {
	ID                string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Body              string
	Object            string
	SendAutomatically bool
	CompanyID         string `gorm:"<-:create"`
	Company           Organization
}

func (BillEmailCustomization) TableName() string {
	return "com_bill_email_customization"
}
