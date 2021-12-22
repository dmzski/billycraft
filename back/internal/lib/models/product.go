package models

import (
	"backv2/internal/lib/dtos"

	"gorm.io/gorm"
)

type Product struct {
	ID          int64 `gorm:"primaryKey;autoIncrement;<-:create"`
	Type        string
	Name        string
	Description *string
	Price       *float64
	CompanyID   int    `gorm:"<-:create"`
	CreatedBy   string `gorm:"foreignKey:Email;<-:create"`
}

func (p Product) TableName() string {
	return "com_product"
}

func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	p.ID = 0
	return
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
	}
}
