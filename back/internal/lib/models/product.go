package models

import (
	"back/internal/lib/enums"
)

type Product struct {
	ID          string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Type        enums.ProductType
	Name        string
	Description *string
	Price       *float64
	Stock       *float64
	Code        *string
	CompanyID   string `gorm:"<-:create"`
	CreatedBy   string `gorm:"foreignKey:Email;<-:create"`
	SupplierID  *string
	GroupID     *string
	LowStock    *float64
	StockAlert  bool
}

func (p Product) TableName() string {
	return "com_product"
}
