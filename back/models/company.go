package models

import (
	"backv2/dtos"
	"time"

	"gorm.io/gorm"
)

type Company struct {
	ID                      int `gorm:"primaryKey;autoIncrement;<-:create"`
	Name                    string
	City                    string
	Address                 string
	PostalCode              string
	PhoneNumber             string
	Logo                    *string
	Siret                   string
	Email                   string
	CreatedBy               string     `gorm:"<-:create"`
	CreatedAt               time.Time  `gorm:"<-:create"`
	UpdatedAt               *time.Time `gorm:"autoUpdateTime"`
	QuoteCustomization      *QuoteCustomization
	QuoteEmailCustomization *QuoteEmailCustomization
	BillCustomization       *BillCustomization
	BillEmailCustomization  *BillEmailCustomization
	Users                   []User     `gorm:"foreignkey:CompanyID"`
	Customers               []Customer `gorm:"foreignkey:CompanyID"`
}

func (Company) TableName() string {
	return "com_company"
}

func (c *Company) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = 0
	return
}

func (c Company) ToDTO() dtos.Company {
	return dtos.Company{
		ID:          c.ID,
		Name:        c.Name,
		City:        c.City,
		Address:     c.Address,
		PostalCode:  c.PostalCode,
		PhoneNumber: c.PhoneNumber,
		Logo:        c.Logo,
		Siret:       c.Siret,
		Email:       c.Email,
		CreatedBy:   c.CreatedBy,
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
	}
}

func (Company) FromDTO(c dtos.Company) Company {
	return Company{
		ID:          c.ID,
		Name:        c.Name,
		City:        c.City,
		Address:     c.Address,
		PostalCode:  c.PostalCode,
		PhoneNumber: c.PhoneNumber,
		Logo:        c.Logo,
		Siret:       c.Siret,
		Email:       c.Email,
		CreatedBy:   c.CreatedBy,
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
	}
}
