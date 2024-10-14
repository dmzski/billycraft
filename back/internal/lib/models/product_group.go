package models

import (
	"back/internal/lib/dtos"
	"time"
)

type ProductGroup struct {
	ID        string `gorm:"primaryKey;<-:false"`
	CompanyID string `gorm:"<-:create"`
	Name      string
	CreatedBy string    `gorm:"<-:create"`
	CreatedAt time.Time `gorm:"<-:false"`
	UpdatedAt *time.Time `gorm:"<-:false;autoUpdateTime"`
}

func (ProductGroup) TableName() string {
	return "com_product_group"
}

func (entity ProductGroup) ToDTO() dtos.ProductGroup {
	return dtos.ProductGroup{
		CreatedAt: entity.CreatedAt,
		ID:        entity.ID,
		Name:      entity.Name,
		CompanyID: entity.CompanyID,
		CreatedBy: entity.CreatedBy,
		UpdatedAt: entity.UpdatedAt,
	}
}
