package models

import (
	"time"
)

type Organization struct {
	ID              string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Name            string
	City            string
	Address         string
	PostalCode      string
	PhoneNumber     string
	Logo            *string
	Siret           string
	Email           string
	IntraVatNumber  *string
	ArticlesTax     *float32
	ServicesTax     *float32
	OthersTax       *float32
	AutoMonthReport *bool
	AutoYearReport  *bool
	VatPercent      float32
	CreatedBy       string     `gorm:"<-:create"`
	CreatedAt       time.Time  `gorm:"<-:create"`
	UpdatedAt       *time.Time `gorm:"autoUpdateTime"`
}

func (Organization) TableName() string {
	return "com_company"
}
