package models

import (
	"back/internal/lib/dtos"

	"gorm.io/gorm"
)

type Supplier struct {
	ID        string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Name      string
	Color     *string
	Vat       float32
	CompanyID string `gorm:"<-:create"`
	CreatedBy string `gorm:"foreignKey:Email;<-:create"`
	DeletedAt gorm.DeletedAt
}

func (p Supplier) TableName() string {
	return "com_supplier"
}

func (p Supplier) ToDTO() dtos.SupplierResponse {
	return dtos.SupplierResponse{
		ID:        p.ID,
		Name:      p.Name,
		Color:     p.Color,
		Vat:       p.Vat,
		CompanyID: p.CompanyID,
		CreatedBy: p.CreatedBy,
	}
}

func (Supplier) FromDTO(p dtos.SupplierRequest) Supplier {
	return Supplier{
		Name:  p.Name,
		Color: p.Color,
		Vat:   p.Vat,
	}
}
