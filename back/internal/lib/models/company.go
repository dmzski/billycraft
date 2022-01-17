package models

import (
	"back/internal/lib/dtos"
	"log"
	"time"

	"gorm.io/gorm"
)

type Company struct {
	ID              int `gorm:"primaryKey;autoIncrement;<-:create"`
	Name            string
	City            string
	Address         string
	PostalCode      string
	PhoneNumber     string
	Logo            *string
	Siret           string
	Email           string
	ArticlesTax     *float32
	ServicesTax     *float32
	OthersTax       *float32
	AutoMonthReport *bool
	AutoYearReport  *bool
	CreatedBy       string     `gorm:"<-:create"`
	CreatedAt       time.Time  `gorm:"<-:create"`
	UpdatedAt       *time.Time `gorm:"autoUpdateTime"`
}

func (Company) TableName() string {
	return "com_company"
}

func (c *Company) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = 0
	return
}

func (c Company) ToDTO() dtos.CompanyResponse {
	dto := dtos.CompanyResponse{
		ID:              c.ID,
		Name:            c.Name,
		City:            c.City,
		Address:         c.Address,
		PostalCode:      c.PostalCode,
		PhoneNumber:     c.PhoneNumber,
		Logo:            c.Logo,
		Siret:           c.Siret,
		Email:           c.Email,
		CreatedBy:       c.CreatedBy,
		CreatedAt:       c.CreatedAt,
		UpdatedAt:       c.UpdatedAt,
		ArticlesTax:     c.ArticlesTax,
		ServicesTax:     c.ServicesTax,
		OthersTax:       c.OthersTax,
		AutoMonthReport: false,
		AutoYearReport:  false,
	}

	if c.AutoMonthReport != nil {
		dto.AutoMonthReport = *c.AutoMonthReport
	}
	if c.AutoYearReport != nil {
		dto.AutoYearReport = *c.AutoYearReport
	}

	return dto
}

func (Company) FromDTO(c dtos.CompanyRequest) Company {
	log.Println(c.AutoMonthReport)
	return Company{
		Name:            c.Name,
		City:            c.City,
		Address:         c.Address,
		PostalCode:      c.PostalCode,
		PhoneNumber:     c.PhoneNumber,
		Logo:            c.Logo,
		Siret:           c.Siret,
		Email:           c.Email,
		ArticlesTax:     c.ArticlesTax,
		ServicesTax:     c.ServicesTax,
		OthersTax:       c.OthersTax,
		AutoMonthReport: c.AutoMonthReport,
		AutoYearReport:  c.AutoYearReport,
	}

}
