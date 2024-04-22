package models

import (
	"back/internal/lib/dtos"
)

type Product struct {
	ID          string `gorm:"primaryKey;<-:false"`
	Type        string
	Name        string
	Description *string
	Price       *float64
	CompanyID   string `gorm:"<-:create"`
	CreatedBy   string `gorm:"foreignKey:Email;<-:create"`
  SupplierID  *string
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
		CompanyID:   p.CompanyID,
		CreatedBy:   p.CreatedBy,
    SupplierID:  p.SupplierID,
	}
}

func (Product) FromDTO(p dtos.Product) Product {
	return Product{
		ID:          p.ID,
		Type:        p.Type,
		Name:        p.Name,
		Description: p.Description,
		Price:       p.Price,
		CompanyID:   p.CompanyID,
		CreatedBy:   p.CreatedBy,
    SupplierID: p.SupplierID,
	}
}
