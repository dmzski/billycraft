package models

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	ID          string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Name        string
	Contact     string
	PhoneNumber string
	City        string
	PostalCode  string
	Address     string
	Email       string
	CreatedAt   time.Time
	UpdatedAt   *time.Time      `gorm:"autoUpdateTime"`
	DeletedAt   *gorm.DeletedAt `gorm:"index"`
	CompanyID   string          `gorm:"<-:create"`
	Company     Organization
}

func (Customer) TableName() string {
	return "com_customer"
}
