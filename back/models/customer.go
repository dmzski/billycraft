package models

import (
	"backv2/dtos"
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	ID          int64 `gorm:"primaryKey;autoIncrement;<-:create"`
	Name        string
	Contact     string
	PhoneNumber string
	City        string
	PostalCode  string
	Address     string
	Email       string
	CreatedAt   time.Time
	UpdatedAt   *time.Time     `gorm:"autoUpdateTime"`
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	CompanyID   int            `gorm:"<-:create"`
	Company     Company
}

func (Customer) TableName() string {
	return "com_customer"
}

func (c *Customer) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = 0
	return
}

func (c Customer) ToDTO() dtos.Customer {
	return dtos.Customer{
		ID:          c.ID,
		Name:        c.Name,
		Contact:     c.Contact,
		PhoneNumber: c.PhoneNumber,
		City:        c.City,
		PostalCode:  c.PostalCode,
		Address:     c.Address,
		Email:       c.Email,
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
		CompanyID:   c.CompanyID,
		Deleted:     c.DeletedAt.Valid,
	}
}

func (Customer) FromDTO(c dtos.Customer) Customer {
	return Customer{
		ID:          c.ID,
		Name:        c.Name,
		Contact:     c.Contact,
		PhoneNumber: c.PhoneNumber,
		City:        c.City,
		PostalCode:  c.PostalCode,
		Address:     c.Address,
		Email:       c.Email,
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
		CompanyID:   c.CompanyID,
	}
}
