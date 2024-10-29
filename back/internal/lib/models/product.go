package models

import (
	"back/internal/lib/dtos"
)

type Product struct {
	ID          string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Type        string
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

func (p Product) ToDTO() dtos.Product {
	return dtos.Product{
		ID:          p.ID,
		Type:        p.Type,
		Name:        p.Name,
		Description: p.Description,
		Price:       p.Price,
		Stock:       p.Stock,
		Code:        p.Code,
		CompanyID:   p.CompanyID,
		CreatedBy:   p.CreatedBy,
		SupplierID:  p.SupplierID,
		GroupID:     p.GroupID,
		LowStock:    p.LowStock,
		StockAlert:  p.StockAlert,
	}
}

func (Product) FromDTO(p dtos.Product) Product {
	return Product{
		ID:          p.ID,
		Type:        p.Type,
		Name:        p.Name,
		Description: p.Description,
		Price:       p.Price,
		Stock:       p.Stock,
		Code:        p.Code,
		CompanyID:   p.CompanyID,
		CreatedBy:   p.CreatedBy,
		SupplierID:  p.SupplierID,
		GroupID:     p.GroupID,
		LowStock:    p.LowStock,
		StockAlert:  p.StockAlert,
	}
}
