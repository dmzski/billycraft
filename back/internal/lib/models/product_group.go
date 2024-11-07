package models

import (
	"time"
)

type ProductGroup struct {
	ID        string `gorm:"primaryKey;<-:false"`
	CompanyID string `gorm:"<-:create"`
	Name      string
	CreatedBy string     `gorm:"<-:create"`
	CreatedAt time.Time  `gorm:"<-:false"`
	UpdatedAt *time.Time `gorm:"<-:false;autoUpdateTime"`
}

func (ProductGroup) TableName() string {
	return "com_product_group"
}
