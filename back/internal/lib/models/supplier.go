package models

import (
	"gorm.io/gorm"
)

type Supplier struct {
	ID        string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Name      string
	Color     *string
	Vat       float32
	CompanyID string `gorm:"<-:create"`
	CreatedBy string `gorm:"foreignKey:Email;<-:create"`
	DeletedAt *gorm.DeletedAt
}

func (p Supplier) TableName() string {
	return "com_supplier"
}
