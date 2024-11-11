package models

import (
	"back/internal/lib/enums"
)

type BillLine struct {
	BillID      string `gorm:"primaryKey"`
	Line        int    `gorm:"primaryKey"`
	Quantity    float64
	Price       float64
	Name        string
	Description *string
	Type        enums.ProductType
	ProductID   *string
	Bill        Bill
}

func (BillLine) TableName() string {
	return "com_bill_line"
}
